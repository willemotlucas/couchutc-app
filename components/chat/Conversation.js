import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'react-native-button';

import Realm from 'realm';
import Message from '../../models/Message';
import User from '../../models/User';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    }
});

let realm = new Realm({schema: [Message, User]});

class Conversation extends React.Component {
	constructor(props) {
		super(props);
		
		var user = this.props.user;
		let messages = realm.objects('Message').sorted('sendAt'); //TODO filter on user        
		var conversation = this.getMessagesOfConversation(messages, user);
		console.log(conversation);
	}

	getMessagesOfConversation(messages, user) {
        var conversations = [];
        var currentUserId = 1;
        Object.keys(messages).forEach(function (key) {
            if ((messages[key].from_user_id === currentUserId  && messages[key].to_user_id === user) || 
            	(messages[key].from_user_id === user  && messages[key].to_user_id === currentUserId)) {
                conversations.push(messages[key]);
           
            }
        });
        return conversations;
    }

    render(){
        return (
            <View style={styles.container}>
                <Text>Conversation page with : {this.props.user}</Text>
                <Button onPress={() => this.props.onChange(false)}>Back </Button>
            </View>
        );
    }
}

module.exports = Conversation;