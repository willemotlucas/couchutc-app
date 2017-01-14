import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import User from './User';
import Home from './Home';
import realm from '../../models/realm'
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
        var currentUserId = realm.objects('AuthenticatedUser')[0].id;

        return (
            <View style={styles.container}>
                <ScrollableTabView renderTabBar={() => <DefaultTabBar inactiveTextColor="white" activeTextColor="white" backgroundColor="#009286" style={{borderWidth: 0}}/>}>
                    <User tabLabel="Profil" user={currentUserId} />
                    <Home tabLabel="Hébergement" user={currentUserId}/>
                </ScrollableTabView>
            </View>
        );
    }
}

module.exports = Profile;
