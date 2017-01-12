import React from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";

import Real from 'realm';

import Users from '../../models/User';
import Home from '../../models/Home';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50,
        backgroundColor: "#FAFAFA"
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#CACACA",
        marginTop: 13
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    label: {
        fontSize: 18
    }, 
    header: {
        backgroundColor: '#009286',
        height: 150,
        alignItems: 'center'
    },
    text: {
        backgroundColor: 'white',
        fontSize: 15,
        padding: 5
    },
    section: {
        marginTop: 10,
        marginBottom: 10
    },
    content: {
        padding: 5
    },
});

let realm = new Realm({schema: [Users, Home]});

class User extends React.Component {
    constructor() {
        super();

    }

    render() {
        const user = realm.objects('User').filtered(`id = "${this.props.user}"`)[0];
        const home = user.home;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <View style={styles.circle}/>
                        <Text style={styles.title}>{user.firstName} {user.lastName}</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.section}>
                            <Text style={styles.label}>Date de naissance</Text>
                            <Text style={styles.text}>{user.birthday.toLocaleDateString('fr')}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Lieu de vie</Text>
                            <Text style={styles.text}>{home.city}, {home.country}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Branche</Text>
                            <Text style={styles.text}>{user.speciality}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Numéro de téléphone</Text>
                            <Text style={styles.text}>{user.phoneNumber}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Biographie</Text>
                            <Text style={styles.text}>{user.biography}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Pays visités</Text>
                            <Text style={styles.text}>{user.visitedCountries}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

module.exports = User;