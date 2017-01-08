import React from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ListView,
    TouchableHighlight
} from "react-native";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';

import Realm from 'realm';
import Message from '../../models/Message';
import User from '../../models/User';

//import Helper from './Helper';

var styles = StyleSheet.create({
    container: {
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
    }
});

var monthNames = [
    "Jan", "Fev", "Mar",
    "Avr", "Mai", "Juin", "Juil",
    "Au", "Sept", "Oct",
    "Nov", "Dec"
];

let realm = new Realm({schema: [Message, User]});

class Chat extends React.Component {
    constructor(props) {
        super(props);
        var dataForList = [];
        let messages = realm.objects('Message').sorted(['sendAt', 'from_user_id', 'to_user_id']); //TODO filter on user

        var currentUserId = 1;
        var conversations = new Object();
        var interlocutor = null;
        let users = realm.objects('User');
        //get last message of each conversation
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
        //get user data of each conversation
        Object.keys(conversations).forEach(function(key) {
            let user = users.filtered(`id = ${key}`);
            dataForList.push({
                message: conversations[key],
                user: user[0]
            });
        });
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.state = {
            dataSource: dataSource.cloneWithRows(dataForList)
        }
    }

    onConversationPressed(id) {
        alert('coucou');
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData['user'].profilePicture == null) {
            avatar = <Icon name="user" size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            //Add picture
        }
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
                    onPress={() => this.onConversationPressed(
                        rowData['message'].id
                    )}
                    underlayColor='#dddddd'>
                        <View style={styles.conversationRow}>
                            {avatar}
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
