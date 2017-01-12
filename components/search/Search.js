import React from 'react';
import {View, Text, StyleSheet, Modal, Keyboard, LayoutAnimation} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import NavigationBar from "react-native-navbar";
import Icon from 'react-native-vector-icons/FontAwesome';

import SearchCity from './SearchCity';
import SearchDate from './SearchDate';
import SearchNumberGuest from './SearchNumberGuest';
import SearchResults from './SearchResults';

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
        marginTop: 50
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
        paddingTop: 7
    },
    searchText : {
        color: 'white'
    },
    end: {
        alignItems: 'flex-end',
        height: 50,
        color: 'white',
        fontSize: 20,
        paddingTop: 7,
        marginTop: 30
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
            numberOfGuest: 1,
            renderResults: false
        }

        this.setSearchCityModalVisible = this.setSearchCityModalVisible.bind(this);
        this.setSearchDateModalVisible = this.setSearchDateModalVisible.bind(this);
        this.setSearchNumberGuestModalVisible = this.setSearchNumberGuestModalVisible.bind(this);
        this.handleSearchCity = this.handleSearchCity.bind(this);
        this.handlePickedDate = this.handlePickedDate.bind(this);
        this.handleNumberOfGuest = this.handleNumberOfGuest.bind(this);
        this.toggleRenderResults = this.toggleRenderResults.bind(this);
        this.onSearchButtonPress = this.onSearchButtonPress.bind(this);
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
        var dateOptions = {
            day: 'numeric', 
            month: 'short'
        };

        const dateString = startDate.toLocaleDateString('fr', dateOptions) + ' - ' + endDate.toLocaleDateString('fr', dateOptions);

        this.setState({
            pickedStartDate: startDate,
            pickedEndDate: endDate,
            pickedDate: dateString
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

    onSearchButtonPress() {
        if(this.state.searchCity != 'Chercher une ville' && this.state.pickedStartDate != null && this.state.pickedEndDate != null){
            this.toggleRenderResults();
        }
    }

    toggleRenderResults() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        // if renderResults == true, that means we want to close search container and render search results
        this.setState({renderResults: !this.state.renderResults});
    }

    renderSearchView() {
        if(this.state.renderResults){
            return (
                <View style={[styles.searchContainer, {flex: 0.1}]}>
                    <Icon.Button name="search" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={this.toggleRenderResults}><Text style={styles.searchText}>{this.state.searchCity} - {this.state.pickedDate} - {this.state.numberOfGuest} voyageur(s)</Text></Icon.Button>
                </View>
            )
        } else {
            return (
                <View style={[styles.searchContainer, {flex: 0.4}]}>
                    <Icon.Button name="globe" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchCityModalVisible(true)}>{this.state.searchCity}</Icon.Button>
                    <Icon.Button name="calendar-o" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchDateModalVisible(true)}>{this.state.pickedDate}</Icon.Button>
                    <Icon.Button name="users" underlayColor={defaultBackgroundColor} backgroundColor={defaultBackgroundColor} style={styles.searchButtons} onPress={() => this.setSearchNumberGuestModalVisible(true)}>{this.state.numberOfGuestString}</Icon.Button>
                </View>
            )
        }
    }

    renderResults() {
        if(this.state.renderResults){
            return (
                <SearchResults city={this.state.searchCity} startDate={this.state.pickedStartDate} endDate={this.state.pickedEndDate} nbGuest={this.state.numberOfGuest}/>
            )
        }
    }

    renderBlankContainer() {
        if(!this.state.renderResults){
            return (
                <View style={{flex: 0.3}}>

                </View>
            );
        }
    }

    renderSearchButton() {
        if(!this.state.renderResults){
            return (
                <View style={{flex: 0.3}}>
                    <Button style={[styles.searchButtonAction, styles.end]} onPress={this.onSearchButtonPress}>Chercher</Button>
                </View>
            )
        }
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

                {this.renderSearchView()}
                {this.renderResults()}
                {this.renderBlankContainer()}
                {this.renderSearchButton()}
            </View>
        );
    }
}

module.exports = Search;
