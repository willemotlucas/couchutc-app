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
        let messages = realm.objects('Message'); //TODO filter on user
        Object.keys(messages).forEach(function(key) {
            let users = realm.objects('User');
            let user = users.filtered(`id = ${messages[key].to_user_id}`);
            dataForList.push({
                message: messages[key],
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
                                <Text numberOfLines={1}>{rowData['message'].message} jdjdjdjdjdisjbdcidbscsdjkb</Text>
                            </View>
                            <Text style={styles.lastMessageDate}>{rowData['message'].sendAt.getDate() + ' ' + monthNames[rowData['message'].sendAt.getMonth()]}</Text>
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
