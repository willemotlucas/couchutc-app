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
import Modal from 'react-native-modalbox';

import realm from '../../models/realm';

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
        paddingTop: 5, 
        paddingBottom: 5
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
        left: 180
    },
    modal: {
        flexDirection: 'row',
        marginTop: 15,
        height: 350,
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
});

var calendarStyles = StyleSheet.create({
    calendarContainer: {
        backgroundColor: '#EEE',
    },
    calendarControls: {
      backgroundColor: '#EEE',
    },
    calendarHeading: {
      borderTopWidth: 0,
      borderBottomColor: '#CCC',
      borderBottomWidth: 0.5
    },
    hasEventDaySelectedCircle: {
      backgroundColor: '#00A799',
    },
    selectedDayCircle: {
      backgroundColor: '#00A799',
    },
    title: {
      color: '#00A799',
      fontSize: 20
    },
    weekRow: {
      borderTopWidth: 0.5,
      borderTopColor: '#CCC',
    },
    eventIndicator: {
        backgroundColor: '#999'
    },
});

var monthNames = [
    "Jan", "Fev", "Mar",
    "Avr", "Mai", "Juin", "Juil",
    "Aout", "Sept", "Oct",
    "Nov", "Dec"
];

const singleGuest = "1 voyageur";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        var currentDate = new Date().toJSON().slice(0,10);
        let hostingRequests = realm.objects('HostingRequest');
        var currentUserId = 1;
        let results = hostingRequests.filtered(`host_id = ${currentUserId} and status= "accepted"`);
        
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
            message: ''
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
        var requests = this.state.hostingRequests;
        var requestsForSelectedDate = [];
        var selectedDate = new Date(date).toJSON().slice(0,10);

        //get all hosting requests for selected date
        Object.keys(requests).forEach(function(key) {
            if (requests[key].startingDate.toJSON().slice(0,10) <= selectedDate && 
            requests[key].endingDate.toJSON().slice(0,10) >= selectedDate) {
                let users = realm.objects('User');
                let guest = users.filtered(`id = ${requests[key].guest_id}`);
                //build array to display list
                requestsForSelectedDate.push({
                    request: requests[key],
                    guest: guest[0]
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
        this.setState({
            firstName: '',
            lastName: '',
            age: '',
            startingDate: '',
            startingHour: '',
            endingDate: '',
            endingHour: '',
            nbGuests: '',
            message: ''
        });
        this.refs.detailsRequest.close();
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData['guest'].profilePicture == null) {
            avatar = <Icon name='user' size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            avatar = <Image source={{uri: '././resources/users.png'}}/>
        }
        var nbGuest = null;
        if (rowData['request'].numberOfGuest == 1) {
            nbGuest = singleGuest;
        } else {
            nbGuest = rowData['request'].numberOfGuest + " voyageurs";
        }
        return (
            <View>
                <View>
                  <TouchableHighlight
                  underlayColor='#dddddd'
                    onPress={() => this.onHostingRequestPressed(
                        rowData['guest'].firstName,
                        rowData['guest'].lastName,
                        rowData['guest'].age(),
                        rowData['request'].startingDate,
                        rowData['request'].endingDate,
                        nbGuest,
                        rowData['request'].message
                        )}>
                    <View style={styles.hostingRow}>
                        {avatar}
                        <View>
                            <Text style={{fontWeight: 'bold'}}>{rowData['guest'].firstName} {rowData['guest'].lastName}</Text>
                            <View style={styles.inlineBlocks}>
                                <Icon name='calendar' size={15} style={styles.icon}/>
                                <Text
                                numberOfLines={1}>{rowData['request'].startingDate.getDate() + ' ' + monthNames[rowData['request'].startingDate.getMonth()]} au {rowData['request'].endingDate.getDate() + ' ' + monthNames[rowData['request'].endingDate.getMonth()]}</Text>
                            </View>
                            <View style={styles.inlineBlocks}>
                                <Icon name='users' size={15} style={styles.icon}/>
                                <Text
                                numberOfLines={1}>{nbGuest}</Text>
                            </View>
                        </View>
                        <View>
                        <Icon name='angle-right'size={45} style={styles.chevronRight}/>
                        </View>
                    </View>
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
                dayHeadings={['S', 'M', 'T', 'W', 'T', 'F', 'S']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                eventDates={this.state.eventDates}       // Optional array of moment() parseable dates that will show an event indicator
                events={this.state.eventDates}// Optional array of event objects with a date property and custom styles for the event indicator
                monthNames={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}// Defaults to english names of months
                nextButtonText={<Icon name='chevron-right' size={20}/>}           // Text for next button. Default: 'Next'
                onDateSelect={(date) => this.onDateSelected(date)} // Callback after date selection
                onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                onTouchNext={this.onTouchNext}    // Callback for next touch event
                onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                prevButtonText={<Icon name='chevron-left' size={20}/>}           // Text for previous button. Default: 'Prev'
                scrollEnabled={true}              // False disables swiping. Default: False
                showControls={true}               // False hides prev/next buttons. Default: False
                showEventIndicators={true}        // False hides event indicators. Default:False
                startDate={this.state.currentDate}          // The first month that will display. Default: current month
                titleFormat={'MMMM YYYY'}         // Format for displaying current month. Default: 'MMMM YYYY'
                today={this.state.currentDate}              // Defaults to today
                weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
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
                            <Text>{this.state.nbGuests}</Text>
                        </View>
                        <View>
                            <Text>Message de {this.state.firstName}</Text>
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
