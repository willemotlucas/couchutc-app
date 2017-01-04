/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import {Scene, Router, Actions, Modal} from 'react-native-router-flux';

import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import Profile from './components/Profile';
import Calendar from './components/Calendar';
import Messages from './components/Messages';
import TabView from './components/TabView';
import TabIcon from './components/TabIcon';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#F6F6F6',
    borderTopColor: 'grey',
  },
  navigationBarStyle: {
    backgroundColor: '#00A799',
    borderBottomColor: 'transparent',
  },
  titleStyle: {
    color: 'white',
  }
});

const scenes = Actions.create(
  <Scene key="modal" component={Modal}>
    <Scene key="root">
      <Scene key="login" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} component={Login} initial title="Connexion"/>
      <Scene key="register" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} component={Register} title="Inscription"/>
      <Scene key="tabbar">
        <Scene key="main" tabs tabBarStyle={styles.tabBarStyle}>
          <Scene key="calendar" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} icon={TabIcon} component={Calendar} title="Calendrier"/>
          <Scene key="search" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} icon={TabIcon} component={Search} title="Rechercher" initial={true}/>
          <Scene key="profile" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} icon={TabIcon} component={Profile} title="Profil"/>
          <Scene key="messages" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle} icon={TabIcon} component={Messages} title="Messages"/>
        </Scene>
      </Scene>
    </Scene>
  </Scene>
);

export default class CouchUTC extends Component {
  render() {
    return (
      <Router scenes={scenes}/>
    );
  }
}

AppRegistry.registerComponent('CouchUTC', () => CouchUTC);
