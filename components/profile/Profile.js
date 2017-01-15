import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

import CustomTabBar from '../common/CustomTabBar';
import User from './User';
import Home from './Home';

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
        return (
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <ScrollableTabView prerenderingSiblingsNumber={1} renderTabBar={() => <CustomTabBar/>}>
                        <User tabLabel="Profil" user={1} />
                        <Home tabLabel="Hébergement" user={1}/>
                    </ScrollableTabView>
                </View>
            </View>
        );
    }
}

module.exports = Profile;
