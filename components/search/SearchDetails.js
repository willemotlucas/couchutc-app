import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Dimensions, TextInput} from "react-native";
import {Actions} from "react-native-router-flux";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-looped-carousel';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-root-toast';

import realm from '../../models/realm';
import DateFormat from '../common/DateFormat';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    scrollContainer: {
        backgroundColor: '#FAFAFA',
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
    modal: {
        flexDirection: 'row',
        marginTop: 15,
        height: 350,
        width: 350,
    },
    modalInnerContainer: {
        backgroundColor: '#fff', 
        marginTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },
    inlineBlocks: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lineDetails: {
        marginBottom: 8
    },
    borderedText: {
        marginTop: 5,
        marginBottom: 15,
        borderWidth: 0.5,
        padding: 5,
        borderColor: 'grey',
        borderRadius: 5,
        width: 310,
        minHeight: 100
    },
    sendButton: {
        backgroundColor: '#00A799',
        color: 'white',
        height: 40,
        paddingTop: 7
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
        marginBottom: 10
    }
});

const { width, height } = Dimensions.get('window');

class SearchDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            messageToast: '',
            visible: false,
            message: ''
        }

        this.onSendRequestButtonPress = this.onSendRequestButtonPress.bind(this);
        this.onSendHostingRequest = this.onSendHostingRequest.bind(this);
        this.displayToast = this.displayToast.bind(this);
    }

    onSendRequestButtonPress() {
        this.setState({showModal: true});
    }

    onSendHostingRequest() {
        const currentUser = realm.objects('AuthenticatedUser')[0];
        const hostingRequests = realm.objects('HostingRequest');
        const lastHostingRequest = hostingRequests[hostingRequests.length - 1];

        var hostingRequest = {
            id: lastHostingRequest.id + 1,
            startingDate: this.props.startDate,
            endingDate: this.props.endDate,
            numberOfGuest: this.props.nbGuest,
            message: this.state.message,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            guest_id: currentUser.id,
            host_id: this.props.user.id
        }

        realm.write(() => {
            realm.create('HostingRequest', hostingRequest);
        });

        this.setState({showModal: !this.state.showModal});
        this.displayToast('La demande a bien été envoyée');
    }

    displayToast(message) {
        setTimeout(() => this.setState({
            visible: true,
            messageToast: message
        }), 300); // show toast after 1s

        setTimeout(() => this.setState({
            visible: false,
            messageToast: ""
        }), 4000); // hide toast after 5s
    }

    render() {
        const user = this.props.user;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Carousel style={{width: width, height: 200}}>
                        {user.home.photos.map((photo) => <Image style={{width: width, height: 200}} source={{uri: photo.value}}/>)}
                    </Carousel>
                    <View style={styles.content}>
                        <View style={styles.inline}>
                            <Image style={styles.circle} source={{uri: user.profilePicture.value}}/> 
                            <Text style={styles.title}>{user.firstName} {user.lastName}, {user.age()} ans</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Localisation</Text>
                            <Text style={styles.text}>{user.home.city}, {user.home.country}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Type de couchage</Text>
                            <Text style={styles.text}>{user.home.sleepingAccomodation} en {user.home.propertyType.toLowerCase()}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Informations sur l'hôte</Text>
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
                <Button style={styles.end} onPress={this.onSendRequestButtonPress}>Envoyer une demande</Button>
                <Modal style={styles.modal} position={"top"} isOpen={this.state.showModal}>
                    <View style={[styles.inlineBlocks, {position: 'absolute', top: 0}]}>
                     <Icon name="close" size={30} style={[styles.icon, {marginLeft: 10, marginRight: 40}]} onPress={() => this.setState({showModal: !this.state.showModal})}/>
                        <Text style={{fontSize: 20}}>Résumé de la demande</Text>
                    </View>
                    <View style={styles.modalInnerContainer}>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="calendar" size={30}  style={styles.icon}/>
                            <View style={{marginLeft: 10}}>
                                <Text>Arrivée : {DateFormat.getDateInLongStringWithDay(this.props.startDate)}</Text>
                                <Text>Départ : {DateFormat.getDateInLongStringWithDay(this.props.endDate)}</Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="users" size={28} style={styles.icon} />
                            <Text style={{marginLeft: 10}}>{this.props.nbGuest} voyageur(s)</Text>
                        </View>
                        <View style={{marginBottom: 10, marginTop: 10}}>
                            <Text>Ecrivez un petit mot à {user.firstName}</Text>
                            <TextInput style={styles.borderedText} numberOfLines={6} multiline={true} ref="message" onChangeText={(message) => this.setState({message})} value={this.state.message}/>
                        </View>
                        <Button style={styles.sendButton} textStyle={{fontSize: 15, color: 'white'}} onPress={this.onSendHostingRequest}>
                            Envoyer la demande
                        </Button>
                    </View>
                </Modal>
                <Toast visible={this.state.visible} position={-65} shadow={false} animation={true} hideOnPress={true}>
                    {this.state.messageToast}
                </Toast>
            </View>
        );
    }
}

module.exports = SearchDetails;
