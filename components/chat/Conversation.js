import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'react-native-button';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    }
});

class Conversation extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>Conversation page with : {this.props.user}</Text>
                <Button onPress={() => this.props.onChange(false)}>Back </Button>
            </View>
        );
    }
}

module.exports = Conversation;