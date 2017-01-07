import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'react-native-button'

import FakeData from '../../models/FakeData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});


export default class extends React.Component {
    render(){
        FakeData.write();

        const title = this.props.title || 'No Title';
        const data = this.props.data || 'No Data';
        return (
            <View style={[styles.container, this.props.style]}>
                <Text>Login page</Text>
                <Text>Data: {data}</Text>
                <Button onPress={() => Actions.tabbar()}>Se connecter</Button>
                <Button onPress={() => Actions.register()}>Sinscrire</Button>
            </View>
        );
    }
}
