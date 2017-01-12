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
        backgroundColor: '#00A799',
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

const singleGuest = "1 voyageur";

class User extends React.Component {
    constructor() {
        super();

    }

    render() {
        const user = realm.objects('User').filtered(`id = "${this.props.user}"`)[0];
        const home = user.home;
        var nbGuests;
        if (home.maxGuestNumber == 1) {
            nbGuests = singleGuest;
        } else {
            nbGuests = home.maxGuestNumber + " voyageurs";
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <View style={styles.circle}/>
                        <Text style={styles.title}>{user.firstName} {user.lastName}</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.section}>
                            <Text style={styles.label}>Localisation</Text>
                            <Text style={styles.text}>{home.city}, {home.country}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Capacité de l'hébergement</Text>
                            <Text style={styles.text}>{nbGuests}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Logement</Text>
                            <Text style={styles.text}>{home.propertyType}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Lieu de sommeil</Text>
                            <Text style={styles.text}>{home.sleepingAccomodation}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

module.exports = User;