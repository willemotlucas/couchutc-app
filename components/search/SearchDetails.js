import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Realm from 'realm';
import Carousel from 'react-native-looped-carousel';

import User from '../../models/User';
import Home from '../../models/Home';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64,
        backgroundColor: '#FAFAFA'
    },
    scrollContainer: {
        marginBottom: 40
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    label: {
        fontSize: 18
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
    end: {
        alignItems: 'flex-end',
        height: 40,
        color: 'white',
        fontSize: 20,
        backgroundColor: '#009286',
        paddingTop: 7
    },
});

let realm = new Realm({schema: [User, Home]});
const { width, height } = Dimensions.get('window');

class SearchDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const user = this.props.user;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Carousel style={{width: width, height: 200}}>
                        <Image style={{width: width, height: 200}} source={{uri: 'http://www.mademoiselleclaudine-leblog.com/wp-content/uploads/2014/11/SFD8B0C4B51B199404BAAEE3ABC34ED36AB.jpg'}}/>
                        <Image style={{width: width, height: 200}} source={{uri: 'http://www.mademoiselleclaudine-leblog.com/wp-content/uploads/2014/11/SFD8B0C4B51B199404BAAEE3ABC34ED36AB.jpg'}}/>
                        <Image style={{width: width, height: 200}} source={{uri: 'http://www.mademoiselleclaudine-leblog.com/wp-content/uploads/2014/11/SFD8B0C4B51B199404BAAEE3ABC34ED36AB.jpg'}}/>
                    </Carousel>
                    <View style={styles.content}>
                        <Text style={styles.title}>{user.firstName} {user.lastName}, {user.age()} ans</Text>
                        <View style={styles.section}>
                            <Text style={styles.label}>Localisation</Text>
                            <Text style={styles.text}>{user.home.city}, {user.home.country}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Type de couchage</Text>
                            <Text style={styles.text}>{user.home.sleepingAccomodation} en {user.home.propertyType.toLowerCase()}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Informations sur lhôte</Text>
                            <Text style={styles.text}>{user.biography}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Pays visités</Text>
                            <Text style={styles.text}>{user.visitedCountries}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Spécialité UTC</Text>
                            <Text style={styles.text}>{user.speciality}</Text>
                        </View>
                    </View>
                </ScrollView>
                <Button style={styles.end} onPress={this.onSaveButtonPressed}>Envoyer une demande</Button>
            </View>
        );
    }
}

module.exports = SearchDetails;
