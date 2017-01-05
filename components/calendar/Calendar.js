import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import CalendarComponent from 'react-native-calendar';
import Icon from 'react-native-vector-icons/FontAwesome';

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
});

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        var dates = [];
        var currentDate = new Date().toJSON().slice(0,10);
        this.state = {
            currentDate: currentDate,
        }
    }

    onDateSelect(date) {

    }

    render(){
        return (
            <View style={styles.container}>
                <CalendarComponent
                customStyle={calendarStyles} // Customize any pre-defined styles
                dayHeadings={['S', 'M', 'T', 'W', 'T', 'F', 'S']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                //eventDates={}       // Optional array of moment() parseable dates that will show an event indicator
                events={[{date:'2017-01-01'}]}// Optional array of event objects with a date property and custom styles for the event indicator
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
            </View>
        );
    }
}

module.exports = Calendar;
