import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Requests from './Requests';
import Chat from './Chat';
import Conversation from './Conversation';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        marginTop: 50
    }
});

class Messages extends React.Component {
    constructor(props) {
      super(props);
    
      this.state = {
        renderConversation: false,
        user: null
      };

      this.onChange = this.onChange.bind(this);
    }

    onChange(id, data) {
        this.setState({
            renderConversation: data,
            user: id
        }, function() {
            console.log('rendering Conversation with user : ' + id);
        });
        
    }

    renderConversation() {
        if (this.state.renderConversation) {
            return(<Conversation onChange={this.onChange} user={this.state.user}/>);
        }
    }

    renderChatRequests() {
        if (!this.state.renderConversation) {
            return(
                <View>
                    <ScrollableTabView renderTabBar={() => <DefaultTabBar inactiveTextColor="white" activeTextColor="white" backgroundColor="#00A799" tabBarUnderlineStyle={{color: "white"}}/>}>
                        <Chat tabLabel="Conversations" onChange={this.onChange}/>
                        <Requests tabLabel="Demandes" />
                    </ScrollableTabView>
                    {this.renderConversation()}
                </View>
            );
        }
    }

    render(){
        return (
            <View style={styles.container}>
                {this.renderChatRequests()}
                {this.renderConversation()}
            </View>
        );
    }
}

module.exports = Messages;
