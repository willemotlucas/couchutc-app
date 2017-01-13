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
import Toast from 'react-native-root-toast';

import realm from '../../models/realm';

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

const onButtonPress = () => {
    Alert.alert('Button has been pressed!');
};

class Requests extends React.Component {
    constructor(props) {
        super(props);

        var dataForList = this.getDataForList();
        var currentUser = 1;
        var dataSource = new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.state = {
            dataSource: dataSource.cloneWithRows(dataForList),
            interlocutorId: '',
            firstName: '',
            lastName: '',
            age: '',
            requestId: '',
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
            sliderValue: 0.3,
            currentUserId: currentUser,
            visible: false,
            messageToast: ""
        };
    }

    getDataForList() {
        var currentUser = 1;
        let requests = realm.objects('HostingRequest').filtered(`(guest_id = ${currentUser} or host_id = ${currentUser}) and status = "pending"`);

        return this.formatDataForList(requests);
    }

    formatDataForList(requests) {
        var currentUser = 1;
        var dataForList = [];
        Object.keys(requests).forEach(function(key) {
            if (requests[key].guest_id == currentUser) {
                var userToDisplay = requests[key].host_id;
            } else {
                var userToDisplay = requests[key].guest_id;
            }
            let users = realm.objects('User');
            let guests = users.filtered(`id = ${userToDisplay}`);

            dataForList.push({
                request: requests[key],
                user: guests[0]
            });
        });
        return dataForList;
    }

    onHostingRequestPressed(id, firstName, lastName, age, requestId, startingDate, endingDate, nbGuests, message) {
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
            interlocutorId: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            requestId: requestId,
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

    acceptHostingRequest(id) {
        let request = realm.objects('HostingRequest').filtered(`id = ${id}`)[0];
        realm.write(() => {
          request.status = "accepted";
        });
        this.refresh();
        this.refs.detailsRequest.close();
        this.displayToast('Demande d\'hébergement acceptée');
    }

    refuseHostingRequest(id) {
        let request = realm.objects('HostingRequest').filtered(`id = ${id}`)[0];
        realm.write(() => {
          request.status = "cancelled";
        });
        this.refresh();
        this.refs.detailsRequest.close();
        this.displayToast('Demande d\'hébergement refusée');
    }

    refresh() {
        var dataForList = this.getDataForList();
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.setState({
            dataSource: dataSource.cloneWithRows(dataForList)
        });
    }

    displayToast(message) {
        setTimeout(() => this.setState({
            visible: true,
            messageToast: message
        }), 1000); // show toast after 1s

        setTimeout(() => this.setState({
            visible: false,
            messageToast: ""
        }), 5000); // hide toast after 5s
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData['user'].profilePicture == null) {
            avatar = <Icon name="user" size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            //Add picture
        }
        var receivedPicture = null;
        if (rowData['request'].guest_id === this.state.currentUserId) {
            receivedPicture = <MaterialIcons name='call-made' size={40} style={{color: '#00A799', position: 'absolute', right: 10, top: 15}}/>
        } else {
            receivedPicture = <MaterialIcons name='call-received' size={40} style={{color: '#F94351', position: 'absolute', right: 10, top: 15}}/>;
        }
        return (
              <View>
                <View style={styles.row}>
                    <TouchableHighlight
                    onPress={() => this.onHostingRequestPressed(
                    rowData['user'].id,
                    rowData['user'].firstName,
                    rowData['user'].lastName,
                    rowData['user'].age(),
                    rowData['request'].id,
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
                            <Button style={{backgroundColor: '#00A799', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}} onPress={() => this.acceptHostingRequest(this.state.requestId)}>
                                Accepter la demande
                            </Button>
                            <Button style={{borderColor: '#00A799', height: 35}} textStyle={{fontSize: 15, color: '#00A799'}} onPress={() => Actions.message_details({interlocutor: this.state.interlocutorId, refresh: this.refresh})}>
                                Demander plus d'informations
                            </Button>
                            <Button style={{backgroundColor: '#F94351', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}}>
                                Refuser la demande
                            </Button>
                        </View>
                </Modal>
                <Toast
                visible={this.state.visible}
                position={-65}
                shadow={false}
                animation={false}
                hideOnPress={true}>
                    {this.state.messageToast}
                </Toast>
            </View>
        );
    }
}

module.exports = Requests;
