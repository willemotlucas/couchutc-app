import React from 'react';
import {
	View, 
	Text, 
	StyleSheet,
	Dimensions
} from "react-native";
import Button from 'react-native-button';

import realm from '../../models/realm';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 25,
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

//demo answers
var counter = 0;
const answers = ['Oui bien sur, je serais la pour vous accueilllir', 'pas de problème'];

class Conversation extends React.Component {
	constructor(props) {
		super(props);
		var user = this.props.interlocutor;
		let users = realm.objects('User');
		var currentUser = users.filtered(`id = "${realm.objects('AuthenticatedUser')[0].id}"`);
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
		console.log(this.state.interlocutor.id);
		conversation = this.formatData(conversation);
	    this.setState({
			messages: conversation
	    });
  	}

	getMessagesOfConversation(messages, user) {
        var conversation = [];
        var currentUserId = this.state.currentUser.id;//TODO filter on user        
        Object.keys(messages).forEach(function (key) {
            if ((messages[key].from_user_id === currentUserId  && messages[key].to_user_id === user) || 
            	(messages[key].from_user_id === user  && messages[key].to_user_id === currentUserId)) {
                conversation.push(messages[key]);
           
            }
        });
        return conversation;
    }

    formatData(conversation) {
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
			avatar: user.profilePicture.value
		};
		return userFormatted;
	}

	onSend(messages = []) {
	    this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			};
	    });
	    this.saveMessage(messages[0].text, this.state.currentUser.id, this.state.interlocutor.id);
	    // for demo purpose
    	this.answerDemo(messages);
  	}

  	//function to save current user and automatic demo answers
  	saveMessage(message, user, interlocutor) {
  		realm.write(() => {
			realm.create('Message', {
				id: this.state.messages.length,
				sendAt: new Date(),
				message: message,
				createdAt: new Date(),
				updatedAt: new Date(),
				from_user_id: user, //TODO
				to_user_id: interlocutor
			});
		});
		this.props.refresh(true);
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
         	 		this.saveMessage(answers[counter], this.state.interlocutor.id, this.state.currentUser.id);
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