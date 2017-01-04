import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const Register = () => (
  <View style={styles.container}>
    <Text>Register page</Text>
    <Text onPress={Actions.pop}>Back</Text>
  </View>
);

export default Register;
