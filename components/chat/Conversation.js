import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Button from 'react-native-button';

import Realm from 'realm';
import Message from '../../models/Message';
import User from '../../models/User';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

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
		let users = realm.objects('User');
		var currentUser = users.filtered(`id = "${1}"`);
		var interlocutor = users.filtered(`id = "${user}"`);
		this.state = {
			currentUser: user[0],
			interlocutor: interlocutor[0],
			messages: []
		};
		this.onSend = this.onSend.bind(this);
	}

	componentWillMount() {
		let messages = realm.objects('Message').sorted('sendAt'); //TODO filter on user        
		var conversation = this.getMessagesOfConversation(messages, this.state.user);
		conversation = this.formatData(conversation);
	    this.setState({
			messages: conversation
	    });
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

    formatData(conversation) { // TODO TEST FUNCTION
		var dataForList = [];
		var cpt = 0;

		var userInterlocutor = this.formatUserData(this.state.interlocutor);
		var currentUser = this.formatUserData(this.state.currentUserId);
		Object.keys(conversation).forEach(function (key) {
			var user;
			if (conversation[key].from_user_id == this.state.currentUser.id) {
				user = currentUser;
			} else {
				user = userInterlocutor;
			}
			console.log(user);
			dataForList.push({
				_id: cpt,
				text: conversation[key].message,
				createdAt: new Date(conversation[key].sendAt),
				user: user
			});
			cpt = cpt + 1;

		});
	}

	formatUserData(user) {
		var user = [];
		user.push({
			_id: user.id,
			name: user.firstName + ' ' + user.lastName,
			avatar: 'https://facebook.github.io/react/img/logo_og.png'
		});
		return user;
	}

	onSend(messages = []) {
	    this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			};
	    });
  	}

    render(){
        return (
            <View style={styles.container}>
                <Text>Conversation page with : {this.props.user}</Text>
                <Button onPress={() => this.props.onChange(false)}>Back </Button>
                <GiftedChat
		        messages={this.state.messages}
		        onSend={this.onSend}
		        user={{
		          _id: 1,
		        }}
		      	/>
            </View>
        );
    }
}

module.exports = Conversation;