import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'react-native-button'

import Realm from 'realm';
import User from '../../models/User';

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
    writeData() {
        let realm = new Realm({schema: [User]});
        let users = realm.objects('User');

        if(users.length == 0) {
            realm.write(() => {
              realm.create('User', {
                id: 1,
                firstName:  'Lucas',
                lastName: 'Willemot',
                birthday: new Date('1994-04-30'),
                gender: 'Male',
                biography: 'Je vous attends !',
                visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
                smoker: false,
                hosting: true,
                speciality: 'Génie Informatique',
                phoneNumber: '0661065110',
                createdAt: new Date(),
                updatedAt: new Date()
              });

            realm.create('User', {
                id: 2,
                firstName:  'Valentin',
                lastName: 'Paul',
                birthday: new Date('1994-05-14'),
                gender: 'Male',
                biography: 'Je vous attends !',
                visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
                smoker: false,
                hosting: true,
                speciality: 'Génie Informatique',
                phoneNumber: '0661065110',
                createdAt: new Date(),
                updatedAt: new Date()
              });

            realm.create('User', {
                id: 3,
                firstName:  'Alexandra',
                lastName: 'Duval',
                birthday: new Date('1994-08-15'),
                gender: 'Female',
                biography: 'Je vous attends !',
                visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
                smoker: false,
                hosting: true,
                speciality: 'Génie Informatique',
                phoneNumber: '0661065110',
                createdAt: new Date(),
                updatedAt: new Date()
              });
            });
        }
    }

    render(){
        console.log('render search');
        this.writeData();

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
