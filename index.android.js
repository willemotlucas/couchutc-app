/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import {Scene, Router, Actions, Modal} from 'react-native-router-flux';

import Login from './components/login/Login';
import Register from './components/signup/Register';
import Search from './components/search/Search';
import SearchCity from './components/search/SearchCity';
import Profile from './components/profile/Profile';
import Calendar from './components/calendar/Calendar';
import Messages from './components/chat/Messages';
import Conversation from './components/chat/Conversation';
import TabView from './components/common/TabView';
import TabIcon from './components/common/TabIcon';

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
    backgroundColor: '#009286',
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
          <Scene key="messages" navigationBarStyle={styles.navigationBarStyle} title="Rechercher" initial={true} titleStyle={styles.titleStyle} icon={TabIcon} leftButtonIconStyle = {{ tintColor:'white'}}>
            <Scene key="message_home" component={Messages} title="Messages"/>
            <Scene key="message_details" hideTabBar component={Conversation} title="Détails de la conversation"/>
          </Scene>
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
