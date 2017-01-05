import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View} from "react-native";
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: View.propTypes.style,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
});

const TabView = (props, context) => {
  return (
    <View style={[styles.container, props.sceneStyle ]}>
      <Button onPress={Actions.pop}>Back</Button>
      <Button onPress={() => { Actions.calendar(); }}>Switch to calender</Button>
      <Button onPress={() => { Actions.search(); }}>Switch to search</Button>
      <Button onPress={() => { Actions.profile(); }}>Switch to profile</Button>
      <Button onPress={() => { Actions.messages(); }}>Switch to messages</Button>
    </View>
  );
};

TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;
