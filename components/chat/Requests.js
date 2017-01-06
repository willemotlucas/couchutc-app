import React from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    ListView,
    TouchableHighlight
} from "react-native";
import {Actions} from "react-native-router-flux";
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from 'apsl-react-native-button'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
    },
    modal: {
        flexDirection: 'row',
        marginTop: 15
    },
    modal3: {
        height: 475,
        width: 350
    },
    modalInnerContainer: {
        backgroundColor: '#fff', 
        marginTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    inlineBlocks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10
    },
    lineDetails: {
        marginBottom: 8
    },
    borderedText: {
        marginTop: 5,
        marginBottom: 15,
        borderWidth: 0.3,
        padding: 5,
        borderColor: 'grey',
        borderRadius: 5
    },
    buttons: {
        position: 'absolute', 
        bottom: 0,
        left: 20,
        width: 310,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

var requests = {
    1: {
        avatar: '',
        name: 'Mathieu Dublond',
        startingDate: '2017-01-01',
        endingDate: '2017-01-05',
        nbPersons: 2,
        received: true
    },
    2: {
        avatar: '',
        name: 'Paul Jacquit',
        startingDate: '2017-02-01',
        endingDate: '2017-02-05',
        nbPersons: 1,
        received: false
    }
};

const onButtonPress = () => {
    Alert.alert('Button has been pressed!');
};

class Requests extends React.Component {
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
        this.state = {
            dataSource: dataSource.cloneWithRows(requests),
            avatar: '',
            name: '',
            startingDate: '',
            endingDate: '',
            nbPersons: 0,
            received: true,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3
        };
    }

    openRequestDetails() {
        this.refs.detailsRequest.open();
    }

    closeRequestDetails() {
        this.refs.detailsRequest.close();
    }

    renderRow(rowData, sectionID, rowID) {
        var avatar = null;
        if (rowData.avatar == '') {
            avatar = <Icon name="user" size={50} style={{marginLeft: 15, marginRight: 15}}/>
        } else {
            //Add picture
        }
        var receivedPicture = null;
        if (!rowData.received) {
            receivedPicture = <MaterialIcons name='call-made' size={40} style={{color: '#00A799', position: 'absolute', right: 10, top: 15}}/>
        } else {
            receivedPicture = <MaterialIcons name='call-received' size={40} style={{color: 'red', position: 'absolute', right: 10, top: 15}}/>;
        }
        return (
              <View>
                <View style={styles.row}>
                    <TouchableHighlight onPress= {() => this.openRequestDetails()}
                    underlayColor='#dddddd'>
                        <View style={styles.requestRow}>
                            {avatar}
                            <View>
                                <Text>{rowData.name}</Text>
                                <View style={styles.inlineBlocks}>
                                    <Icon name="calendar" size={15} style={styles.icon}/>
                                    <Text>{rowData.startingDate} - {rowData.endingDate}</Text>
                                </View>
                                <View style={styles.inlineBlocks}>
                                    <Icon name="users" size={15} style={styles.icon}/>
                                    <Text>{rowData.nbPersons} voyageurs</Text>
                                </View>
                            </View>
                            {receivedPicture}
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
              </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
                <Modal style={[styles.modal, styles.modal3]} position={"top"} ref={"detailsRequest"} isDisabled={this.state.isDisabled}>
                    <View style={[styles.inlineBlocks, {position: 'absolute', top: 0}]}>
                        <Icon name="close" size={30} style={[styles.icon, {marginLeft: 10, marginRight: 40}]} onPress={() => this.closeRequestDetails()}/>
                        <Text style={{fontSize: 20}}>Détails de la demande</Text>
                    </View>
                    <View style={styles.modalInnerContainer}>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="user" size={35} style={styles.icon}/>
                            <View>
                                <Text style={{fontSize: 18}}>Mathieu Dublond</Text>
                                <Text>21 ans </Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="calendar" size={30}  style={styles.icon}/>
                            <View>
                                <Text>Arrivée :</Text>
                                <Text>Départ :</Text>
                            </View>
                        </View>
                        <View style={[styles.inlineBlocks, styles.lineDetails]}>
                            <Icon name="users" size={28} style={styles.icon} />
                            <Text>2 voyageurs</Text>
                        </View>
                        <View>
                            <Text>Message de Mathieu</Text>
                            <Text style={styles.borderedText} numberOfLines={6}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                            commodo consequat.</Text>
                        </View>
                    </View>
                    <View style={styles.buttons}>
                            <Button style={{backgroundColor: '#00A799', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}}>
                                Accepter la demande
                            </Button>
                            <Button style={{borderColor: '#00A799', height: 35}} textStyle={{fontSize: 15, color: '#00A799'}}>
                                Demander plus d'informations
                            </Button>
                            <Button style={{backgroundColor: 'red', borderColor: 'transparent', height: 35}} textStyle={{fontSize: 15, color: 'white'}}>
                                Refuser la demande
                            </Button>
                        </View>
                </Modal>
            </View>
        );
    }
}

module.exports = Requests;
