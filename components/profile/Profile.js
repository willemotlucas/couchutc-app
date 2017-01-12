import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import User from './User';
import Home from './Home';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    }
});

class Profile extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <ScrollableTabView renderTabBar={() => <DefaultTabBar inactiveTextColor="white" activeTextColor="white" backgroundColor="#00A799" tabBarUnderlineStyle={{color: "white"}}/>}>
                    <User tabLabel="Profil" user={1} />
                    <Home tabLabel="Hébergement" user={1}/>
                </ScrollableTabView>
            </View>
        );
    }
}

module.exports = Profile;
