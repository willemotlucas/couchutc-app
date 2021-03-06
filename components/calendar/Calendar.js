import React from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ListView,
    TouchableHighlight,
    Image
} from "react-native";

import {Actions} from "react-native-router-flux";
import CalendarComponent from 'react-native-calendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modalbox';

import realm from '../../models/realm';
import DateFormat from '../common/DateFormat'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 54,
    },
    instructions: {
        textAlign: "center",
        color: "#333333"
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc'
    },
    hostingRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
    },
    inlineBlocks: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    chevronRight: {
        position: 'relative', 
        left: 210
    },
    modal: {
        flexDirection: 'row',
        marginTop: 15,
        height: 365,
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
    borderedText: {
        marginTop: 10,
        borderWidth: 0.5,
        padding: 5,
        borderColor: 'grey',
        borderRadius: 5,
        minWidth: 310,
        minHeight: 120
    },
    lineDetails: {
        marginBottom: 8
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
});

var calendarStyles = StyleSheet.create({
    calendarContainer: {
        backgroundColor: '#009286',
        paddingTop: 10
    },
    calendarControls: {
      backgroundColor: '#009286',
    },
    calendarHeading: {
      borderTopWidth: 0,
      borderBottomColor: '#009286',
      borderBottomWidth: 0.5
    },
    hasEventDaySelectedCircle: {
      backgroundColor: 'white',
    },
    selectedDayCircle: {
      backgroundColor: 'white',
    },
    title: {
      color: 'white',
      fontSize: 20
    },
    weekRow: {
      borderTopWidth: 0,
      borderTopColor: 'transparent',
    },
    eventIndicator: {
        backgroundColor: 'white'
    },
    day: {
        color: 'white'
    },
    dayHeading: {
        color: 'white'
    },
    selectedDayText: {
        color: '#009286'
    },
    currentDayText: {
        color: 'white',
        fontWeight: 'bold'
    },
    currentDayCircle: {
        backgroundColor: 'white',
    },
});

var monthNames = [
    "Janvier", "Février", "Mars",
    "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre",
    "Novembre", "Décembre"
];

const singleGuest = "1 voyageur";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        var currentDate = new Date().toJSON().slice(0,10);
        let hostingRequests = realm.objects('HostingRequest');
        var currentUserId = realm.objects('AuthenticatedUser')[0].id;
        let results = hostingRequests.filtered(`(host_id = ${currentUserId} or guest_id = ${currentUserId}) and status = "accepted"`);
        
        var eventDates = this.getRequestsDate(results);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url}
        );

        this.state = {
            currentDate: currentDate,
            eventDates: eventDates,
            dataSource: dataSource.cloneWithRows({}),
            hostingRequests: results,
            received: true,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            firstName: '',
            lastName: '',
            age: '',
            startingDate: '',
            startingHour: '',
            endingDate: '',
            endingHour: '',
            nbGuests: '',
            message: '',
            status: '',
            currentUserId: currentUserId
        }
    }

    getRequestsDate(results) {
        var eventDates = [];
        Object.keys(results).forEach(function(key) {
            var startingDate = results[key].startingDate;
            var endingDate = results[key].endingDate;
            var date = new Date(startingDate.getTime());

            while (date <= endingDate) {
                eventDates.push(new Date(date).toJSON().slice(0,10));
                date.setDate(date.getDate() + 1);
            }
        });
        return eventDates;
    }

    onDateSelected(date) {
        // Retrieve all requests
        var requests = this.state.hostingRequests;
        var requestsForSelectedDate = [];
        // Retrieve selected date
        var selectedDate = new Date(date).toJSON().slice(0,10);

        // Get all hosting requests for selected date
        // Iterate over all request
        Object.keys(requests).forEach(function(key) {
            // Fix décalage d'un jour
            var startingDate = new Date(requests[key].startingDate - 1).toJSON().slice(0,10);
            var endingDate = new Date(requests[key].endingDate - 1).toJSON().slice(0,10);

            // If selected date is between starting date and ending date
            if (startingDate <= selectedDate && endingDate >= selectedDate) {
                let users = realm.objects('User');
                let guest = users.filtered(`id = ${requests[key].guest_id}`)[0];
                let host = users.filtered(`id = ${requests[key].host_id}`)[0];
                //build array to display list
                requestsForSelectedDate.push({
                    request: requests[key],
                    guest: guest,
                    host: host
                });     
            }
        });

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url}
        );
        this.setState({
            dataSource: dataSource.cloneWithRows(requestsForSelectedDate)
        });
    }

    onHostingRequestPressed(rowData){
        var row = this.getRowInformation(rowData);

        this.setState({
            firstName: row.firstName,
            lastName: row.lastName,
            age: row.age,
            startingDate: rowData['request'].startingDate.getDate() + ' ' + monthNames[rowData['request'].startingDate.getMonth()],
            endingDate: rowData['request'].endingDate.getDate() + ' ' + monthNames[rowData['request'].endingDate.getMonth()],
            nbGuests: rowData['request'].numberOfGuest,
            message: rowData['request'].message,
            messageLabel: row.messageLabel,
            profilePicture: row.profilePicture.value,
        });

        this.refs.detailsRequest.open();
    }

    closeRequestDetails() {
        this.setState({
            firstName: '',
            lastName: '',
            age: '',
            startingDate: '',
            startingHour: '',
            endingDate: '',
            endingHour: '',
            nbGuests: '',
            message: '',
            profilePicture: '',
            messageLabel: ''
        });
        this.refs.detailsRequest.close();
    }

    getRowInformation(rowData){
        var row = {};

        if(rowData['request'].guest_id === this.state.currentUserId){
            // si l'invité est l'utilisateur courant, on affiche le nom/prénom de l'hote et sa photo de profil
            row.firstName = rowData['host'].firstName;
            row.lastName = rowData['host'].lastName;
            row.age = rowData['host'].age();
            row.profilePicture = rowData['host'].profilePicture;
            row.rightIcon = <MaterialIcons name='call-made' size={30} style={{color: '#00A799', position: 'relative', left: 30}}/>
            row.messageLabel = `Votre message`;
        } else {
            // sinon on affiche le nom/prénom et la photo de profil du current user
            row.firstName = rowData['guest'].firstName;
            row.lastName = rowData['guest'].lastName;
            row.age = rowData['guest'].age();
            row.profilePicture = rowData['guest'].profilePicture;  
            row.rightIcon = <MaterialIcons name='call-received' size={30} style={{color: '#F94351', position: 'relative', left: 30}}/>;
            row.messageLabel = `Message de ${row.firstName}`;
        }

        return row;
    }

    renderHostingRow(rowData){
        var row = this.getRowInformation(rowData);

        return (
            <View style={styles.hostingRow}>
                <Image style={[styles.circle, {marginRight: 15, marginLeft: 10}]} source={{uri: row.profilePicture.value}}/>
                <View>
                    <Text style={{fontWeight: 'bold'}}>{row.firstName} {row.lastName}</Text>
                    <View style={styles.inlineBlocks}>
                        <Icon name='calendar' size={15} style={styles.icon}/>
                        <Text
                        numberOfLines={1}>{rowData['request'].startingDate.getDate() + ' ' + monthNames[rowData['request'].startingDate.getMonth()]} au {rowData['request'].endingDate.getDate() + ' ' + monthNames[rowData['request'].endingDate.getMonth()]}</Text>
                    </View>
                    <View style={styles.inlineBlocks}>
                        <Icon name='users' size={15} style={styles.icon}/>
                        <Text
                        numberOfLines={1}>{rowData['request'].numberOfGuest} voyageur(s)</Text>
                    </View>
                </View>
                <View>
                    {row.rightIcon}
                </View>
            </View>
        );
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <View>
                <View>
                  <TouchableHighlight underlayColor='#dddddd' 
                    onPress={() => this.onHostingRequestPressed(rowData)}>
                    {this.renderHostingRow(rowData)}
                  </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(){        
        return (
            <View style={styles.container}>
                <CalendarComponent
                customStyle={calendarStyles} // Customize any pre-defined styles
                dayHeadings={['D', 'L', 'M', 'M', 'J', 'V', 'S']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                eventDates={this.state.eventDates}       // Optional array of moment() parseable dates that will show an event indicator
                events={this.state.eventDates} // Optional array of event objects with a date property and custom styles for the event indicator
                monthNames={DateFormat.getLongMonths()}// Defaults to english names of months
                nextButtonText={<Icon name='chevron-right' color="#fff" size={20}/>}           // Text for next button. Default: 'Next'
                onDateSelect={(date) => this.onDateSelected(date)} // Callback after date selection
                onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                onTouchNext={this.onTouchNext}    // Callback for next touch event
                onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                prevButtonText={<Icon name='chevron-left' color="#fff" size={20}/>}           // Text for previous button. Default: 'Prev'
                scrollEnabled={true}              // False disables swiping. Default: False
                showControls={true}               // False hides prev/next buttons. Default: False
                showEventIndicators={true}        // False hides event indicators. Default:False
                startDate={this.state.currentDate}          // The first month that will display. Default: current month
                titleFormat={'MMMM YYYY'}         // Format for displaying current month. Default: 'MMMM YYYY'
                today={this.state.currentDate}              // Defaults to today
                weekStart={1} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                />
                <View style={styles.separator}/>
                <ListView
                enableEmptySections= {true}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
                <Modal style={[styles.modal]} position={"center"} ref={"detailsRequest"} isDisabled={this.state.isDisabled}>
                    <View style={[styles.inlineBlocks, {position: 'absolute', top: 0}]}>
                        <Icon name="close" size={30} style={[styles.icon, {marginLeft: 10, marginRight: 40}]} onPress={() => this.closeRequestDetails()}/>
                        <Text style={{fontSize: 20}}>Détails de la demande</Text>
                    </View>
                    <View style={styles.modalInnerContainer}>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Image style={styles.circle} source={{uri: this.state.profilePicture}}/> 
                            <View>
                                <Text style={{fontSize: 18}}>{this.state.firstName} {this.state.lastName}</Text>
                                <Text>{this.state.age} ans</Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="calendar" size={30}  style={[styles.icon, {marginLeft: 15}]}/>
                            <View>
                                <Text>Arrivée : {this.state.startingDate}</Text>
                                <Text>Départ : {this.state.endingDate}</Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="users" size={28} style={[styles.icon, {marginLeft: 15}]} />
                            <Text>{this.state.nbGuests} voyageur(s)</Text>
                        </View>
                        <View>
                            <Text>{this.state.messageLabel}</Text>
                            <Text style={styles.borderedText} numberOfLines={6}>
                            {this.state.message}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

module.exports = Calendar;
