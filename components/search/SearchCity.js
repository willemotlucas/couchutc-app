import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';

var styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "#009286",
    },
    textInput: {
        margin: 10,
    },
    textInputLabel: {
        color: 'white'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

class SearchCity extends React.Component {

    constructor(props) {
        super(props);
    }

    onPressButtonOK() {
        var city = this.refs.city.state.value;

        if(typeof city === 'string' && city.length > 0){
            this.props.onSearchCity(city);
            this.props.closeModal(false);
        }
    }

    render(){
        return (
            <View style={styles.modalContainer}>
                <Sae label={'Entrez une ville'} ref="city" style={styles.textInput} labelStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} iconColor={'white'} iconName={'globe'}/>
                <Button style={styles.button} onPress={() => this.onPressButtonOK()}>OK</Button>
            </View>
        );
    }
}

module.exports = SearchCity;
