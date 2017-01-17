import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

import CustomTabBar from '../common/CustomTabBar';
import User from './User';
import Home from './Home';
import realm from '../../models/realm'
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    navbar: {
        paddingTop: 20,
        backgroundColor: "#009286"
    }
});

class Profile extends React.Component {
    render(){
        var currentUserId = realm.objects('AuthenticatedUser')[0].id;

        return (
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <ScrollableTabView prerenderingSiblingsNumber={1} renderTabBar={() => <CustomTabBar/>}>
                        <User tabLabel="Profil" user={currentUserId} />
                        <Home tabLabel="Hébergement" user={currentUserId}/>
                    </ScrollableTabView>
                </View>
            </View>
        );
    }
}

module.exports = Profile;
