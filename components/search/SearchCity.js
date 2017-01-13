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
    },
    end: {
        alignItems: 'flex-end',
        height: 40,
        color: 'white',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        paddingTop: 5,
        margin: 5
    },
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
                <View style={{flex: 0.9}}>
                    <Sae label={'Entrez une ville'} ref="city" style={styles.textInput} labelStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} iconColor={'white'} iconName={'globe'}/>
                </View>
                <View style={{flex: 0.1}}>
                    <Button style={styles.end} onPress={() => this.onPressButtonOK()}>Valider</Button>
                </View>
            </View>
        );
    }
}

module.exports = SearchCity;
