import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Calendar from 'react-native-day-picker';
import Button from 'react-native-button';

import DateFormat from '../common/DateFormat';

var styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#009286",
    },
    datesContainer: {
        flexDirection: 'row',
        flex: 0.1,
        marginLeft: 20
    },
    calendarContainer: {
        flex: 0.5
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        height: 40
    },
    end: {
        alignItems: 'flex-end',
        height: 40,
        color: 'white',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        paddingTop: 5,
        margin: 10
    },
    saveButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: '#009286',
        color: 'white',
        fontSize: 20,

        // padding: 10,
        // marginLeft: 10,
        // marginRight: 10,
        // paddingTop: 10
    },
    dates: {
        flex: 0.45,
        fontSize: 18,
        color: 'white'
    },
    datesSeparator: {
        color: 'white',
        fontSize: 25,
        flex: 0.1
    }
});

var monthsLocale = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
var weekDaysLocale = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

class SearchDate extends React.Component {

    constructor() {
        super();
        this.state = {
            startDate: null,
            startDateString: "Date d'arrivée",
            endDate: null,
            endDateString: "Date de départ",
            numberOfDateSelected: 0
        }

        this.handleDateChanged = this.handleDateChanged.bind(this);
        this.onSaveButtonPressed = this.onSaveButtonPressed.bind(this);
    }

    handleDateChanged(current, previous) {

        if(current != undefined && previous == undefined) {
            this.setState({
                startDate: new Date(current),
                startDateString: DateFormat.getDateInLongStringWithDay(current),
                numberOfDateSelected: this.state.numberOfDateSelected + 1
            });            
        }

        if(current != undefined && previous != undefined) {
            if(current > previous && this.state.numberOfDateSelected == 1) {
                this.setState({
                    startDate: new Date(previous),
                    startDateString: DateFormat.getDateInLongStringWithDay(previous),
                    endDate: new Date(current),
                    endDateString: DateFormat.getDateInLongStringWithDay(current),
                    numberOfDateSelected: this.state.numberOfDateSelected + 1
                });
            } else if (this.state.numberOfDateSelected == 2){
                this.setState({
                    startDate: new Date(current),
                    startDateString: DateFormat.getDateInLongStringWithDay(current),
                    endDate: null,
                    endDateString: "Date de départ",
                    numberOfDateSelected: 1
                });
            } else if(this.state.numberOfDateSelected == 1 && previous > current){
                this.setState({
                    startDate: new Date(current), 
                    startDateString: DateFormat.getDateInLongStringWithDay(current)
                });
            }
        }
    }

    onSaveButtonPressed() {
        var startDate = this.state.startDate;
        var endDate = this.state.endDate;

        // if(startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf())){
            this.props.onPickDate(startDate, endDate);
            this.props.closeModal(false);
        // }
    }

    render() {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.datesContainer}>
                    <Text style={styles.dates}>{this.state.startDateString}</Text>
                    <Text style={styles.datesSeparator}>/</Text>
                    <Text style={styles.dates}>{this.state.endDateString}</Text>
                </View>
                <Calendar
                    style={styles.calendarContainer}
                    monthsCount={12}
                    startFromMonday={true}
                    startDate={new Date()}
                    width={350}
                    monthsLocale={DateFormat.getLongMonths()}
                    weekDaysLocale={DateFormat.getShortWeekDays()}
                    isFutureDate={true}
                    onSelectionChange={this.handleDateChanged}
                    bodyBackColor={"#009286"}
                    bodyTextColor={"#FFF"}
                    headerSepColor={'#FFF'}
                    dayCommonBackColor={'#009286'}
                    dayDisabledBackColor={'#009286'}
                    dayDisabledTextColor={'#009286'}
                    dayCommonTextColor={'#FFF'}
                    daySelectedBackColor={'#FFF'}
                    daySelectedTextColor={'#009286'}
                    dayInRangeBackColor={'#FFF'}
                    dayInRangeTextColor={'#009286'}
                    monthTextColor={'#FFF'}
                />
                <Button style={styles.end} onPress={this.onSaveButtonPressed}>Valider</Button>
            </View>
        );
    }
}

module.exports = SearchDate;
