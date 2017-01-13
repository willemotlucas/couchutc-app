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
    }
});

class Messages extends React.Component {
    constructor(props) {
      super(props);

    }

    render(){
        return (
            <View style={styles.container}>
                <ScrollableTabView renderTabBar={() => <DefaultTabBar inactiveTextColor="white" activeTextColor="white" backgroundColor="#009286" tabBarUnderlineStyle={{color: "white", borderWidth: 0}}/>}>
                    <Chat tabLabel="Conversations" refresh={true}/>
                    <Requests tabLabel="Demandes" />
                </ScrollableTabView>
            </View>
        );
    }
}

module.exports = Messages;
