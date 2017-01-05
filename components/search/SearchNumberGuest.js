import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";

var styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#009286",
    }
});

class SearchNumberGuest extends React.Component {


    render(){
        return (
            <View style={styles.modalContainer}>
                <Text>Search number of guest modal</Text>
            </View>
        );
    }
}

module.exports = SearchNumberGuest;
