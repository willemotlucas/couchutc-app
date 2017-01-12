import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';

var styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#009286",
    },
    viewContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 10
    },
    label: {
        fontSize: 20,
        color: 'white',
        marginRight: 40
    },
    number: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
    },
    button: {
        paddingBottom: 20,
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
    }
});

class SearchNumberGuest extends React.Component {

    constructor(props) {
        super();
        this.state = {
            numberOfGuest: props.numberOfGuest
        }

        this.onPlusButtonPress = this.onPlusButtonPress.bind(this);
        this.onMinusButtonPress = this.onMinusButtonPress.bind(this);
        this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    }

    onPlusButtonPress() {
        if(this.state.numberOfGuest < 5)
            this.setState({numberOfGuest: this.state.numberOfGuest + 1});
    }

    onMinusButtonPress() {
        if(this.state.numberOfGuest > 1)
            this.setState({numberOfGuest: this.state.numberOfGuest - 1});
    }

    onSaveButtonPress() {
        this.props.onPickNumberOfGuest(this.state.numberOfGuest);
        this.props.closeModal(false);
    }

    render(){
        return (
            <View style={styles.modalContainer}>
                <View style={{flex: 0.9}}>
                    <View style={styles.viewContainer}>
                        <Text style={styles.label}>Nombre de voyageurs</Text>
                        <Icon.Button style={styles.button} name="minus-circle" size={30} backgroundColor="#009286" onPress={this.onMinusButtonPress}/>
                        <Text style={styles.number}>{this.state.numberOfGuest}</Text>
                        <Icon.Button style={styles.button} name="plus-circle" size={30} backgroundColor="#009286" onPress={this.onPlusButtonPress}/>
                    </View>
                </View>
                <View style={{flex: 0.1}}>
                    <Button style={styles.end} onPress={this.onSaveButtonPress}>Valider</Button>
                </View>
            </View>
        );
    }
}

module.exports = SearchNumberGuest;
