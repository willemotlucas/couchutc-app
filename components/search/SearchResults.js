import React from 'react';
import {View, Text, StyleSheet, ListView, Image, TouchableHighlight, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import { Card, CardImage, CardTitle, CardContent, CardAction } from 'react-native-card-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import Realm from 'realm';
import User from '../../models/User';
import Home from '../../models/Home';
import HostingRequest from '../../models/HostingRequest';

var styles = StyleSheet.create({
    resultsContainer: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    title: {
        fontSize: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: 5
    },
    content: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    contentText: {
        flex: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: 5,
    },
    noResults: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    noResultsText: {
        fontSize: 18
    }
});

let realm = new Realm({schema: [User, Home, HostingRequest]});
const { width, height } = Dimensions.get('window');

class SearchResults extends React.Component {

    constructor(props) {
        super(props);

        let results = realm.objects('User').filtered(`hosting = true AND home.city = "${props.city}" AND home.maxGuestNumber >= ${props.nbGuest}`);
        
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(results),
        };

        if(results.length == 0)
            this.state.noResults = true;

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight onPress={() => Actions.search_details({user: rowData, startDate: this.props.startDate, endDate: this.props.endDate, nbGuest: this.props.nbGuest})}>
                <View>
                    <Card >
                        <CardImage>
                            <Image style={{width: width - 10, height: 200}} source={{uri: rowData.home.photos[0].value}}>
                                <Text style={styles.title}>{rowData.firstName} {rowData.lastName}, {rowData.age()} ans</Text>
                                <View style={styles.content}>
                                    <Text style={styles.contentText}><Icon name="globe" size={15}/> {rowData.home.city}, {rowData.home.country}</Text>
                                    <Text style={styles.contentText}><Icon name="bed" size={15}/> {rowData.home.sleepingAccomodation}</Text>
                                </View>
                            </Image>
                        </CardImage>
                    </Card>
                </View>
            </TouchableHighlight>
        ) 
    }

    renderResults() {
        if(this.state.noResults){
            return (
                <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>Aucun hébergement trouvé</Text>
                </View>
            );
        } else {
            return (<ListView style={{marginBottom: 50}} dataSource={this.state.dataSource} renderRow={this.renderRow}/>);
        }
    }

    render(){
        return this.renderResults();
    }
}

module.exports = SearchResults;
