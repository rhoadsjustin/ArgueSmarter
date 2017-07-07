import React from 'react';
import {
  Container,
  Content,
  Icon,
  Text,
  Button,
} from 'native-base';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from './styles'


export default () => (
  <Container style={styles.container}>
    <Content>
      <View style={styles.iconBox}>
        <Icon
          style={styles.icon}
          ios="ios-mic-off"
          android="md-happy"
        />
        <Text style={styles.welcome}>Argue Smarter</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          rounded
          small
          style={styles.button}
          onPress={() => Actions.login()}
        >
          <Text>Jump back in the convo</Text>
        </Button>
        <Button
          rounded
          small
          style={styles.button}
          onPress={() => Actions.signup()}
        >
          <Text>Join the convo</Text>
        </Button>
      </View>
    </Content>
  </Container>
)
