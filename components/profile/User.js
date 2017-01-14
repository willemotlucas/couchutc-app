import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TouchableHighlight} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "apsl-react-native-button";
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';

import realm from '../../models/realm';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50,
        backgroundColor: "#FAFAFA"
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#CACACA",
        marginTop: 13,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    label: {
        fontSize: 18
    }, 
    header: {
        backgroundColor: '#00A799',
        height: 150,
        alignItems: 'center'
    },
    text: {
        backgroundColor: 'white',
        fontSize: 15,
        padding: 5
    },
    section: {
        marginTop: 10,
        marginBottom: 10
    },
    content: {
        padding: 5
    },
    modal: {
        height: 125,
        width: 300,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 10
    },
    link: {
        fontSize: 16
    },
    inlineBlock: {
        flexDirection: 'row',
        marginTop: 5
    },
    icon: {
        marginRight: 10
    }
});

class User extends React.Component {
    constructor(props) {
        super(props);

        const user = realm.objects('User').filtered(`id = "${this.props.user}"`)[0];
        const home = user.home;

        this.state = {
            user: user,
            home: home
        }

        this.openEditProfilePicture = this.openEditProfilePicture.bind(this);
    }

    openEditProfilePicture() {
        this.refs.choosePictureFrom.open();
    }

    closeEditProfilePicture() {
        this.refs.choosePictureFrom.close();
    }

    getPictureFromCamera() {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
        });
        this.refs.choosePictureFrom.close();
    }

    getPictureFromGallery() {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
        });
        this.refs.choosePictureFrom.close();
    }

    logout() {
        realm.write(() => {
          let authUser = realm.objects('AuthenticatedUser');
          realm.delete(authUser);
        });
        Actions.login({type: 'reset'});
    }

    render() {
        var profilePicture = this.state.user.profilePicture;
        if (this.state.user.profilePicture == null) {
            profilePicture = <Image style={{width: 70, height: 70}} source={require('../../resources/user.png')}/>;
        } else {
            profilePicture = <Image style={{width: 70, height: 70}} source={profilePicture}/>;
        }
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity
                        onPress={() => this.openEditProfilePicture()}
                        >
                            <View style={styles.circle}> 
                                {profilePicture}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.title}>{this.state.user.firstName} {this.state.user.lastName}</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.section}>
                            <Text style={styles.label}>Date de naissance</Text>
                            <Text style={styles.text}>{this.state.user.birthday.toLocaleDateString('fr')}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Lieu de vie</Text>
                            <Text style={styles.text}>{this.state.home.city}, {this.state.home.country}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Branche</Text>
                            <Text style={styles.text}>{this.state.user.speciality}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Numéro de téléphone</Text>
                            <Text style={styles.text}>{this.state.user.phoneNumber}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Biographie</Text>
                            <Text style={styles.text}>{this.state.user.biography}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.label}>Pays visités</Text>
                            <Text style={styles.text}>{this.state.user.visitedCountries}</Text>
                        </View>
                        <Button style={{backgroundColor: '#F94351', borderColor: 'transparent'}} onPress={() => this.logout()}><Text style={{color: 'white', fontSize: 20}}>Déconnexion</Text></Button>
                    </View>
                </ScrollView>
                <Modal style={styles.modal} position={"center"} ref={"choosePictureFrom"}>
                    <Text style={styles.label}>Choisir une photo de profil</Text>
                    <TouchableHighlight underlayColor="white" onPress={() => this.getPictureFromCamera()}>
                        <View style={styles.inlineBlock}>
                            <Icon style={styles.icon} name="camera" size={20}/>
                            <Text style={styles.link}>Prendre une photo</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="white" onPress={() => this.getPictureFromGallery()}>
                        <View style={styles.inlineBlock}>
                            <Icon style={styles.icon} name="picture-o" size={20}/>
                            <Text style={styles.link}>Choisir dans la gallerie</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight  underlayColor="white" onPress={() => this.closeEditProfilePicture()}>
                        <Text style={styles.link}>Annuler</Text>
                    </TouchableHighlight>
                </Modal>
            </View>
        );
    }
}

module.exports = User;