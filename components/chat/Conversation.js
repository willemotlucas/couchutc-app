import React from 'react';
import {
	View, 
	Text, 
	StyleSheet,
	Dimensions
} from "react-native";
import Button from 'react-native-button';

import Realm from 'realm';
import Message from '../../models/Message';
import User from '../../models/User';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 55,
        height: Dimensions.get('window').height - 75,
    },
    footerContainer: {
	    marginTop: 5,
	    marginLeft: 10,
	    marginRight: 10,
	    marginBottom: 10,
	},
	footerText: {
		fontSize: 14,
		color: '#aaa',
	},
});

let realm = new Realm({schema: [Message, User]});

//demo answers
var counter = 0;
const answers = ['Oui bien sur, je serais la pour vous accueilllir', 'pas de problème'];

class Conversation extends React.Component {
	constructor(props) {
		super(props);
		var user = this.props.user;
		let users = realm.objects('User');
		var currentUser = users.filtered(`id = "${1}"`);
		var interlocutor = users.filtered(`id = "${user}"`);

		this.state = {
			currentUser: currentUser[0],
			interlocutor: interlocutor[0],
			messages: [],
			typingText: null
		};

		this._isMounted = false;
		this.onSend = this.onSend.bind(this);
		this.renderFooter = this.renderFooter.bind(this);		
		this.renderBubble = this.renderBubble.bind(this);
	}

	componentWillMount() {
		this._isMounted = true;
		let messages = realm.objects('Message').sorted('sendAt', 'asc');
		var conversation = this.getMessagesOfConversation(messages, this.state.interlocutor.id);
		conversation = this.formatData(conversation);
	    this.setState({
			messages: conversation
	    });
  	}

	getMessagesOfConversation(messages, user) {
        var conversation = [];
        var currentUserId = 1;//TODO filter on user        
        Object.keys(messages).forEach(function (key) {
            if ((messages[key].from_user_id === currentUserId  && messages[key].to_user_id === user) || 
            	(messages[key].from_user_id === user  && messages[key].to_user_id === currentUserId)) {
                conversation.push(messages[key]);
           
            }
        });
        return conversation;
    }

    formatData(conversation) { // TODO TEST FUNCTION
		var dataForList = [];
		var cpt = 0;
		var currentUserData = this.state.currentUser;
		var userInterlocutor = this.formatUserData(this.state.interlocutor);
		var currentUser = this.formatUserData(currentUserData);
		Object.keys(conversation).forEach(function (key) {
			var user;
			if (conversation[key].from_user_id == currentUserData.id) {
				user = currentUser;
			} else {
				user = userInterlocutor;
			}
			dataForList.push({
				_id: cpt,
				text: conversation[key].message,
				createdAt: new Date(conversation[key].sendAt),
				user: user
			});
			cpt = cpt + 1;

		});
		return dataForList;
	}

	formatUserData(user) {
		var userFormatted = {
			_id: user.id,
			name: user.firstName + ' ' + user.lastName,
			avatar: 'https://facebook.github.io/react/img/logo_og.png'
		};
		return userFormatted;
	}

	onSend(messages = []) {
	    this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			};
	    });
	    realm.write(() => {
			realm.create('Message', {
				id: this.state.messages.length,
				sendAt: new Date(),
				message: messages[0].text,
				createdAt: new Date(),
				updatedAt: new Date(),
				from_user_id: 1, //TODO
				to_user_id: this.state.interlocutor.id 
			});
		});
    	this.props.refresh(true);
	    // for demo purpose
    	this.answerDemo(messages);
  	}

  	answerDemo(messages) {
	    if (messages.length > 0) {
	      if ((messages[0].image || messages[0].location) || !this._isAlright) {
	        this.setState((previousState) => {
	          return {
	            typingText: this.state.interlocutor.firstName + ' est en train d\'écrire'
	          };
	        });
	      }
	    }

	    setTimeout(() => {
	      	if (this._isMounted === true) {
		        if (messages.length > 0) {
         	 		this.onReceive(answers[counter]);
         	 		counter= counter + 1;
        		}
      		}

	      	this.setState((previousState) => {
		        return {
		          typingText: null
		        };
	      	});
    	}, 1000);
	}

  	onReceive(text) {
	    this.setState((previousState) => {
	      return {
	        messages: GiftedChat.append(previousState.messages, {
	          _id: Math.round(Math.random() * 1000000),
	          text: text,
	          createdAt: new Date(),
	          user: {
	            _id: 2,
	            name: 'React Native',
	            avatar: 'https://facebook.github.io/react/img/logo_og.png',
	          },
	        }),
	      };
	    });
  	}

  	renderFooter(props) {
	    if (this.state.typingText) {
	      return (
	        <View style={styles.footerContainer}>
	          <Text style={styles.footerText}>
	            {this.state.typingText}
	          </Text>
	        </View>
	      );
	    }
	    return null;
  	}

	renderBubble(props) {
	    return (
	      <Bubble
	        {...props}
	        wrapperStyle={{
	          right: {
	            backgroundColor: '#00A799',
	            marginRight: 5
	          }
	        }}
	      />
	    );
  	}

    render(){
        return (
            <View style={styles.container}>
                <GiftedChat
                renderBubble={this.renderBubble}
		        messages={this.state.messages}
		        onSend={this.onSend}
		        user={{
		          _id: 1,
		        }}
		        renderFooter={this.renderFooter}
		      	/>
            </View>
        );
    }
}

module.exports = Conversation;