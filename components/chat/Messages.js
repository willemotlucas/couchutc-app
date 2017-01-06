import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Requests from './Requests';
import Chat from './Chat';

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
    render(){
        return (
            <View style={styles.container}>
                <ScrollableTabView renderTabBar={() => <DefaultTabBar inactiveTextColor="white" activeTextColor="white" backgroundColor="#00A799" tabBarUnderlineStyle={{color: "white"}}/>}>
                    <Chat tabLabel="Conversations" />
                    <Requests tabLabel="Demandes" />
                </ScrollableTabView>
            </View>
        );
    }
}

module.exports = Messages;
