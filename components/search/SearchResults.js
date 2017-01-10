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
    }
});

let realm = new Realm({schema: [User, Home, HostingRequest]});
const { width, height } = Dimensions.get('window');

class SearchResults extends React.Component {

    constructor(props) {
        super(props);

        let users = realm.objects('User');
        let results = users;//.filtered(`hosting = true AND home.city = "${props.city}" AND home.maxGuestNumber >= ${props.nbGuest}`);
        
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(results),
        };

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight onPress={() => Actions.search_details({user: rowData, startDate: this.props.startDate, endDate: this.props.endDate, nbGuest: this.props.nbGuest})}>
                <View>
                    <Card >
                        <CardImage>
                            <Image style={{width: width - 10, height: 200}} source={{uri: 'http://www.mademoiselleclaudine-leblog.com/wp-content/uploads/2014/11/SFD8B0C4B51B199404BAAEE3ABC34ED36AB.jpg'}}>
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

    render(){
        return (
              <ListView dataSource={this.state.dataSource} renderRow={this.renderRow}/>
        );
    }
}

module.exports = SearchResults;
