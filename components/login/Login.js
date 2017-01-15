import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FakeData from '../../models/FakeData';
import Button from 'apsl-react-native-button'
import Toast from 'react-native-root-toast';

import realm from '../../models/realm';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textInputLabel: {
        color: 'white',
    },
    button: {
        backgroundColor: "#009286", 
        borderColor: 'transparent',
    },
    warning: {
        color: '#F94351',
        fontSize: 15,
        backgroundColor: 'transparent',
        marginTop: 10
    },
    labelButton: {
        color: 'white', 
        fontSize: 17
    },
    loginForm: {
        padding: 30
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: "center"
    },
    headerContainer: {
        backgroundColor: 'transparent',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5
    },
    headerBaseline: {
        fontSize: 25,
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white'
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
                this.refs.email.clear();
                this.refs.password.clear();
                Actions.tabbar();
            }
        } else {
            this.setState({
                message: "Veuillez rentrer des identifiants corrects"
            });
        }
    }

    render(){
        FakeData.write();

        return (
            <View style={[styles.container]}>
                <Image style={[styles.backgroundImage, {width: Dimensions.width}]} source={require('../../resources/bg.png')}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>CouchUT</Text>
                        <Text style={styles.headerBaseline}>Parcourez le monde en rencontrant des UTCéens</Text>
                    </View>
                    <View style={styles.loginForm}>
                        <Sae label={'Email'} ref="email" labelStyle={styles.textInputLabel} inputStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} iconColor={'white'} iconName={'user'} autoCapitalize="none" autoCorrection={false}/>
                        <Sae label={'Mot de passe'} secureTextEntry={true} ref="password" style={styles.textInput} labelStyle={styles.textInputLabel} iconClass={FontAwesomeIcon} inputStyle={styles.textInputLabel} iconColor={'white'} iconName={'unlock'}/>
                        <Text style={styles.warning}>{this.state.message}</Text>
                        <Button style={[styles.button, {marginTop: 20}]} onPress={() => this.authenticate()}><Text style={styles.labelButton}>Se connecter</Text></Button>
                    </View>
                </Image>
            </View>
        );
    }
}
