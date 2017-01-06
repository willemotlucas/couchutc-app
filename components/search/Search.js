import React from 'react';
import {View, Text, StyleSheet, Modal, Keyboard} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import NavigationBar from "react-native-navbar";
import Icon from 'react-native-vector-icons/FontAwesome';

import SearchCity from './SearchCity';
import SearchDate from './SearchDate';
import SearchNumberGuest from './SearchNumberGuest';

var defaultBackgroundColor = "#009286"

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    navBarStyle: {
        backgroundColor: defaultBackgroundColor
    },
    searchContainer: {
        backgroundColor: defaultBackgroundColor,
        marginTop: 50,
    },
    searchButtons: {
        margin: 10,
        height: 40,
        backgroundColor: "#00A799",
        borderRadius: 0
    },
    searchButtonAction: {
        backgroundColor: defaultBackgroundColor,
        color: 'white',
        height: 40,
    }
});

class Search extends React.Component {

    constructor() {
        super();
        this.state = {
            searchCityModalVisible: false,
            searchDateModalVisible: false,
            searchNumberGuestModalVisible: false,
            searchCity: 'Chercher une ville',
            pickedDate: 'Choisir une date',
            pickedStartDate: null,
            pickedEndDate: null,
            numberOfGuestString: '1 voyageur',
            numberOfGuest: 1
        }

        this.setSearchCityModalVisible = this.setSearchCityModalVisible.bind(this);
        this.setSearchDateModalVisible = this.setSearchDateModalVisible.bind(this);
        this.setSearchNumberGuestModalVisible = this.setSearchNumberGuestModalVisible.bind(this);
        this.handleSearchCity = this.handleSearchCity.bind(this);
        this.handlePickedDate = this.handlePickedDate.bind(this);
        this.handleNumberOfGuest = this.handleNumberOfGuest.bind(this);
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

    handleSearchCity(city) {
        this.setState({searchCity: city});
    }

    handlePickedDate(startDate, endDate) {
        var dateOptions = {day: 'numeric', month: 'short'};
        var pickedDate = startDate.toLocaleDateString('fr', dateOptions) + ' - ' + endDate.toLocaleDateString('fr', dateOptions);

        this.setState({
            pickedStartDate: startDate,
            pickedEndDate: endDate,
            pickedDate: pickedDate
        })
    }

    handleNumberOfGuest(numberOfGuest) {
        if(numberOfGuest > 1){
            this.setState({
                numberOfGuest,
                numberOfGuestString: numberOfGuest + ' voyageurs'
            });
        }
        else
            this.setState({
                numberOfGuest,
                numberOfGuestString: '1 voyageur'
            });
    }

    render(){
        return (
            <View style={styles.container}>
                <Modal animationType={"slide"} visible={this.state.searchCityModalVisible} onRequestClose={() => this.setSearchCityModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchCity onSearchCity={this.handleSearchCity} closeModal={this.setSearchCityModalVisible} />
                </Modal>
                <Modal animationType={"slide"} visible={this.state.searchDateModalVisible} onRequestClose={() => this.setSearchDateModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchDate onPickDate={this.handlePickedDate} closeModal={this.setSearchDateModalVisible}/>
                </Modal>
                <Modal animationType={"slide"} visible={this.state.searchNumberGuestModalVisible} onRequestClose={() => this.setSearchNumberGuestModalVisible(false)}>
                    <NavigationBar style={styles.navBarStyle} leftButton={this.leftButtonConfig}/>
                    <SearchNumberGuest numberOfGuest={this.state.numberOfGuest} onPickNumberOfGuest={this.handleNumberOfGuest} closeModal={this.setSearchNumberGuestModalVisible}/>
                </Modal>
                <View style={styles.searchContainer}>
                    <Icon.Button name="globe" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchCityModalVisible(true)}>{this.state.searchCity}</Icon.Button>
                    <Icon.Button name="calendar-o" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchDateModalVisible(true)}>{this.state.pickedDate}</Icon.Button>
                    <Icon.Button name="users" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchNumberGuestModalVisible(true)}>{this.state.numberOfGuestString}</Icon.Button>
                </View>
                <View>
                    <Button style={[styles.searchButtonAction, {bottom: this.state.btnLocation}]}>CHERCHER</Button>
                </View>
            </View>
        );
    }
}

module.exports = Search;
