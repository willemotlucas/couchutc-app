import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FakeData from '../../models/FakeData';
import Button from 'apsl-react-native-button'
import Toast from 'react-native-root-toast';

import realm from '../../models/realm';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
    },
    textInput: {
        margin: 10,
    },
    textInputLabel: {
        color: '#009286'
    },
    button: {
        backgroundColor: "#009286", 
        borderColor: 'transparent',
        position: 'relative',
        top: 130
    },
    warning: {
        color: '#F94351',
        fontSize: 20,
        paddingLeft: 10
    }
});


export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: " "
        };
    }

    authenticate() {
        var email = this.refs.email.state.value;
        var password = this.refs.password.state.value;

        if (typeof email === 'string' && email.length > 0 && typeof password === 'string' && password.length > 0) {
            let results = realm.objects('User').filtered(`mail = "${email}" AND password = "${password}"`);

            if (results.length !== 1) {
                this.setState({
                    message: "Erreur : mauvais identifiants"
                });
            } else {
                realm.write(() => {
                    realm.create('AuthenticatedUser', {id: results[0].id});
                });
                Actions.tabbar();
            }
        }
    }

    render(){
        FakeData.write();

        return (
            <View style={[styles.container, this.props.style]}>
                <FontAwesomeIcon name="home" size={100} style={{alignSelf: 'center'}}/>
                <Sae label={'Email'} ref="email" style={styles.textInput} labelStyle={styles.textInputLabel} inputStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} iconColor={'#009286'} iconName={'user'}/>
                <Sae label={'Mot de passe'} ref="password" style={styles.textInput} labelStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} inputStyle={styles.textInputLabel} iconColor={'#009286'} iconName={'unlock'}/>
                <Text style={styles.warning}>{this.state.message}</Text>
                <Button style={styles.button} onPress={() => this.authenticate()}><Text style={{color: 'white'}}>Se connecter</Text></Button>
                <Button style={styles.button} onPress={() => Actions.register()}><Text style={{color: 'white'}}>S'inscrire</Text></Button>
            </View>
        );
    }
}
