import React from 'react';
import {
  Container,
  Content,
  Icon,
  Text,
  Button,
  Thumbnail
} from 'native-base';
import { View, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles'
import logo from '../../assets/giphy.gif'
import background from '../../assets/bball.jpg'


export default () => (
  <ImageBackground source={background} style={styles.image}>
  <Container style={styles.container}>
    <Content>
      <View style={styles.iconBox}>
        <Thumbnail style={styles.icon} large source={logo} />
        <Text style={styles.welcome}>Argue</Text>
        <Text style={styles.welcome}>Smarter</Text>

      </View>
      <View style={styles.buttonContainer}>
        <Button
          rounded
          large
          style={styles.button}
          onPress={() => Actions.login()}
        >
          <Text>Log In</Text>
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          rounded
          large
          style={styles.button}
          onPress={() => Actions.signup()}
        >
          <Text>Sign Up</Text>
        </Button>
      </View>
      <Text note style={styles.or}>App Created By Justin Rhoads</Text> 
    </Content>
  </Container>
  </ImageBackground>
)
