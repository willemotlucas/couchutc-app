import React from 'react';
import {View, Text, StyleSheet, Modal} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import NavigationBar from "react-native-navbar";
import Icon from 'react-native-vector-icons/FontAwesome';

import SearchCity from './SearchCity';
import SearchDate from './SearchDate';
import SearchNumberGuest from './SearchNumberGuest';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    navBarStyle: {
        backgroundColor: "#009286"
    },
    searchContainer: {
        backgroundColor: "#009286",
        marginTop: 50
    },
    searchButton: {
        flexDirection: 'row',
        margin: 10,
        height: 40,
        backgroundColor: "#00A799",
        borderRadius: 0
    }
});

class Search extends React.Component {
    state = {
        searchCityModalVisible: false,
        searchDateModalVisible: false,
        searchNumberGuestModalVisible: false
    }

    setSearchCityModalVisible(visible) {
        this.setState({searchCityModalVisible: visible});
    }


    setSearchDateModalVisible(visible) {
        this.setState({searchDateModalVisible: visible});
    }


    setSearchNumberGuestModalVisible(visible) {
        this.setState({searchNumberGuestModalVisible: visible});
    }

    leftButtonConfig = {
        title: 'Fermer',
        tintColor: 'white',
        handler: () => {
            this.setSearchCityModalVisible(false);
            this.setSearchDateModalVisible(false);
            this.setSearchNumberGuestModalVisible(false);
        },
    }

    render(){
        return (
            <View style={styles.container}>
                <Modal animationType={"slide"} visible={this.state.searchCityModalVisible} onRequestClose={() => this.setSearchCityModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchCity/>
                </Modal>
                <Modal animationType={"slide"} visible={this.state.searchDateModalVisible} onRequestClose={() => this.setSearchDateModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchDate/>
                </Modal>
                <Modal animationType={"slide"} visible={this.state.searchNumberGuestModalVisible} onRequestClose={() => this.setSearchNumberGuestModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchNumberGuest/>
                </Modal>
                <View style={styles.searchContainer}>
                    <Icon.Button name="globe" underlayColor="#009286" backgroundColor="#009286" style={styles.searchButton} onPress={() => this.setSearchCityModalVisible(true)}>Choisir la ville</Icon.Button>
                    <Icon.Button name="calendar-o" underlayColor="#009286" backgroundColor="#009286" style={styles.searchButton} onPress={() => this.setSearchDateModalVisible(true)}>Choisir la date</Icon.Button>
                    <Icon.Button name="users" underlayColor="#009286" backgroundColor="#009286" style={styles.searchButton} onPress={() => this.setSearchNumberGuestModalVisible(true)}>Choisir le nombre de voyageurs</Icon.Button>
                </View>
            </View>
        );
    }
}

module.exports = Search;
