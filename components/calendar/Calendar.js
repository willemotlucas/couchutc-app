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

import Realm from 'realm';
import User from '../../models/User';
import Home from '../../models/Home';
import HostingRequest from '../../models/HostingRequest';

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
        left: 130
    }
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

let realm = new Realm({schema: [User, HostingRequest]});

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        var dates = [];
        var currentDate = new Date().toJSON().slice(0,10);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url}
        );

        var eventDates = [];
        let hostingRequests = realm.objects('HostingRequest');
        //let results = hostingRequests.filtered(`host_id = ${}`);

        Object.keys(hostingRequests).forEach(function(key) {
            var startingDate = hostingRequests[key].startingDate;
            var endingDate = hostingRequests[key].endingDate;
            var currentDate = new Date(startingDate.getTime());

            while (currentDate <= endingDate) {
                eventDates.push(new Date(currentDate).toJSON().slice(0,10));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        this.state = {
            currentDate: currentDate,
            eventDates: eventDates,
            dataSource: dataSource.cloneWithRows({}),
            hostingRequests: hostingRequests
        }
    }

    onDateSelect(date) {
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
        

        console.log(requestsForSelectedDate);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url}
        );
        this.setState({
            dataSource: dataSource.cloneWithRows(requestsForSelectedDate)
        });
    }

    onHostingRequestPressed() {
        alert('coucou');
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData['guest'].profilePicture == null) {
            avatar = <Icon name='user' size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            avatar = <Image source={{uri: '././resources/users.png'}}/>
        }
        return (
            <View>
                <View>
                  <TouchableHighlight
                  underlayColor='#dddddd'
                    onPress={() => this.onHostingRequestPressed()}>
                    <View style={styles.hostingRow}>
                        {avatar}
                        <View>
                            <Text style={{fontWeight: 'bold'}}>{rowData['guest'].firstName} {rowData['guest'].lastName}</Text>
                            <View style={styles.inlineBlocks}>
                                <Icon name='calendar' size={15} style={styles.icon}/>
                                <Text
                                numberOfLines={1}>{rowData['request'].startingDate.toJSON().slice(0,10)} au {rowData['request'].endingDate.toJSON().slice(0,10)}</Text>
                            </View>
                            <View style={styles.inlineBlocks}>
                                <Icon name='users' size={15} style={styles.icon}/>
                                <Text
                                numberOfLines={1}>{rowData['request'].numberOfGuest} voyageurs</Text>
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
                onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
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
            </View>
        );
    }
}

module.exports = Calendar;
