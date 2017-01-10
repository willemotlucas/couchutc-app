import React from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ListView,
    TouchableHighlight
} from "react-native";
import {Actions} from "react-native-router-flux";
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from 'apsl-react-native-button'

import Realm from 'realm';
import User from '../../models/User';
import HostingRequest from '../../models/HostingRequest';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
    },
    modal: {
        flexDirection: 'row',
        marginTop: 15,
        height: 475,
        width: 350,
        borderRadius: 10
    },
    modalInnerContainer: {
        backgroundColor: '#fff', 
        marginTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    inlineBlocks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10
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
    buttons: {
        position: 'absolute', 
        bottom: 0,
        left: 20,
        width: 310,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

var monthNames = [
    "Jan", "Fev", "Mar",
    "Avr", "Mai", "Juin", "Juil",
    "Au", "Sept", "Oct",
    "Nov", "Dec"
];


let realm = new Realm({schema: [User, HostingRequest]});

const onButtonPress = () => {
    Alert.alert('Button has been pressed!');
};

class Requests extends React.Component {
    constructor(props) {
        super(props);

        var dataForList = [];
        let requests = realm.objects('HostingRequest');
        Object.keys(requests).forEach(function(key) {
            let users = realm.objects('User');
            let guests = users.filtered(`id = ${requests[key].guest_id}`);

            dataForList.push({
                request: requests[key],
                user: guests[0]
            });
        });

        var dataSource = new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.state = {
            dataSource: dataSource.cloneWithRows(dataForList),
            firstName: '',
            lastName: '',
            age: '',
            startingDate: '',
            startingHour: '',
            endingDate: '',
            endingHour: '',
            nbGuests: '',
            message: '',
            received: true,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3
        };
    }

    onHostingRequestPressed(firstName, lastName, age, startingDate, endingDate, nbGuests, message) {
        //format minutes
        var startingMin = null;
        if (startingDate.getMinutes() < 10) {
            startingMin = "0" + startingDate.getMinutes();
        } else {
            startingMin = startingDate.getMinutes();
        }
        var endingMin = null;
        if (endingDate.getMinutes() < 10) {
            endingMin = "0" + endingDate.getMinutes();
        } else {
            endingMin = endingDate.getMinutes();
        }
        this.setState({
            firstName: firstName,
            lastName: lastName,
            age: age,
            startingDate: startingDate.getDate() + ' ' + monthNames[startingDate.getMonth()],
            startingHour: startingDate.getHours() + 'h' + startingMin,
            endingDate: endingDate.getDate() + ' ' + monthNames[endingDate.getMonth()],
            endingHour: endingDate.getHours() + 'h' + endingMin,
            nbGuests: nbGuests,
            message: message
        });

        this.refs.detailsRequest.open();
    }

    closeRequestDetails() {
        this.refs.detailsRequest.close();
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData['user'].profilePicture == null) {
            avatar = <Icon name="user" size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            //Add picture
        }
        var receivedPicture = null;
        if (!rowData.received) {
            receivedPicture = <MaterialIcons name='call-made' size={40} style={{color: '#00A799', position: 'absolute', right: 10, top: 15}}/>
        } else {
            receivedPicture = <MaterialIcons name='call-received' size={40} style={{color: '#F94351', position: 'absolute', right: 10, top: 15}}/>;
        }
        return (
              <View>
                <View style={styles.row}>
                    <TouchableHighlight
                    onPress={() => this.onHostingRequestPressed(
                    rowData['user'].firstName,
                    rowData['user'].lastName,
                    rowData['user'].age(),
                    rowData['request'].startingDate,
                    rowData['request'].endingDate,
                    rowData['request'].numberOfGuest,
                    rowData['request'].message
                    )}
                    underlayColor='#dddddd'>
                        <View style={styles.requestRow}>
                            {avatar}
                            <View>
                                <Text>{rowData['user'].firstName} {rowData['user'].lastName}</Text>
                                <View style={styles.inlineBlocks}>
                                    <Icon name="calendar" size={15} style={styles.icon}/>
                                    <Text>{rowData['request'].startingDate.getDate() + ' ' + monthNames[rowData['request'].startingDate.getMonth()]} au {rowData['request'].endingDate.getDate() + ' ' + monthNames[rowData['request'].endingDate.getMonth()]}</Text>
                                </View>
                                <View style={styles.inlineBlocks}>
                                    <Icon name="users" size={15} style={styles.icon}/>
                                    <Text>{rowData['request'].numberOfGuest} voyageurs</Text>
                                </View>
                            </View>
                            {receivedPicture}
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
              </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
                <Modal style={styles.modal} position={"top"} ref={"detailsRequest"} isDisabled={this.state.isDisabled}>
                    <View style={[styles.inlineBlocks, {position: 'absolute', top: 0}]}>
                        <Icon name="close" size={30} style={[styles.icon, {marginLeft: 10, marginRight: 40}]} onPress={() => this.closeRequestDetails()}/>
                        <Text style={{fontSize: 20}}>Détails de la demande</Text>
                    </View>
                    <View style={styles.modalInnerContainer}>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="user" size={35} style={styles.icon}/>
                            <View>
                                <Text style={{fontSize: 18}}>{this.state.firstName} {this.state.lastName}</Text>
                                <Text>{this.state.age} ans </Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="calendar" size={30}  style={styles.icon}/>
                            <View>
                                <Text>Arrivée : {this.state.startingDate} vers {this.state.startingHour}</Text>
                                <Text>Départ : {this.state.endingDate} vers {this.state.endingHour}</Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="users" size={28} style={styles.icon} />
                            <Text>{this.state.nbGuests} voyageurs</Text>
                        </View>
                        <View>
                            <Text>Message de {this.state.firstName}</Text>
                            <Text style={styles.borderedText} numberOfLines={6}>
                            {this.state.message}</Text>
                        </View>
                    </View>
                    <View style={styles.buttons}>
                            <Button style={{backgroundColor: '#00A799', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}}>
                                Accepter la demande
                            </Button>
                            <Button style={{borderColor: '#00A799', height: 35}} textStyle={{fontSize: 15, color: '#00A799'}}>
                                Demander plus d'informations
                            </Button>
                            <Button style={{backgroundColor: '#F94351', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}}>
                                Refuser la demande
                            </Button>
                        </View>
                </Modal>
            </View>
        );
    }
}

module.exports = Requests;
