import React from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ListView,
    TouchableHighlight,
    LayoutAnimation,
    Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import Conversation from './Conversation';

import realm from '../../models/realm';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    conversationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    message: {
        width: 275
    },
    lastMessageDate: {
        position: 'absolute', 
        right: 10, 
        top: 15
    },
    label: {
        fontWeight: 'bold'
    },
    row: {
        padding: 10
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

var monthNames = [
    "Jan", "Fev", "Mars",
    "Avril", "Mai", "Juin", "Juil",
    "Aout", "Sept", "Oct",
    "Nov", "Dec"
];

class Chat extends React.Component {
    constructor(props) {
        super(props);        

        var dataForList = this.getMessages();
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.state = {
            dataSource: dataSource.cloneWithRows(dataForList)
        }

        this.getMessages = this.getMessages.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    getMessages() {
        //get last message of each conversation
        let messages = realm.objects('Message').sorted(['sendAt', 'from_user_id', 'to_user_id']); //TODO filter on user        
        var conversations = this.getLastMessageOfConversations(messages);
        //get user data of each conversation
        return this.addUserData(conversations);

    }

    getLastMessageOfConversations(messages) {
        var conversations = new Object();
        var interlocutor = null;
        var currentUserId = realm.objects('AuthenticatedUser')[0].id;
        
        Object.keys(messages).forEach(function (key) {
            if (messages[key].from_user_id === currentUserId) {
                interlocutor = messages[key].to_user_id;
            } else if (messages[key].to_user_id === currentUserId) {
                interlocutor = messages[key].from_user_id;
            } else {
                return;
            }
            if (conversations[interlocutor] == undefined || conversations[interlocutor].sendAt < messages[key].sendAt) {
                conversations[interlocutor] = messages[key];
            } else if (conversations[interlocutor] && conversations[interlocutor].sendAt > messages[key].sendAt) {
                return;
            }
        });
        return conversations;
    }

    refresh() {
        var dataForList = this.getMessages();
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.setState({
            dataSource: dataSource.cloneWithRows(dataForList)
        });
    }

    addUserData(conversations) {
        let users = realm.objects('User');
        var dataForList = [];
        Object.keys(conversations).forEach(function(key) {
            let user = users.filtered(`id = ${key}`);
            dataForList.push({
                message: conversations[key],
                user: user[0]
            });
        });
        return dataForList;
    }

    renderRow(rowData, sectionID, rowID) {
        var dateLastMessage = null;
        if (rowData['message'].sendAt.toJSON().slice(0,10) == new Date().toJSON().slice(0,10)) {
            var min = null;
            if (rowData['message'].sendAt.getMinutes() < 10) {
                min = "0" + rowData['message'].sendAt.getMinutes();
            } else {
                min = rowData['message'].sendAt.getMinutes();
            }
            dateLastMessage = rowData['message'].sendAt.getHours() + 'h' + min;
        } else {
            dateLastMessage = rowData['message'].sendAt.getDate() + ' ' + monthNames[rowData['message'].sendAt.getMonth()];
        }
        return (
            <View>
                <View style={styles.row}>
                    <TouchableHighlight
                    onPress={() => Actions.message_details({interlocutor: rowData['user'].id, refresh: this.refresh})}
                    underlayColor='#dddddd'>
                        <View style={styles.conversationRow}>
                            <Image style={[styles.circle, {marginRight: 15, marginLeft: 10}]} source={{uri: rowData['user'].profilePicture.value}}/> 
                            <View style={styles.message}>
                                <Text style={styles.label}>{rowData['user'].firstName} {rowData['user'].lastName}</Text>
                                <Text numberOfLines={1}>{rowData['message'].message}</Text>
                            </View>
                            <Text style={styles.lastMessageDate}>{dateLastMessage}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
            </View>
        );
    }
}

module.exports = Chat;
