import React from 'react';
import {
  Text,
  Button,
  Icon,
  Header,
  Title,
  Left,
  Right,
  Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';

export default (props) => (
  <Header>
    <Left>
      <Button
        transparent
        onPress={() => props.logout()}
      >
          <Text>Logout</Text>
      </Button>
  </Left>
  <Button
    transparent
    style={styles.newsButton}
    onPress={() => Actions.feed()}>
      <Text>News</Text>
    </Button>
  <Button
    transparent
    onPress={() => Actions.gallery()}>
      <Text>Gallery</Text>
    </Button>
  <Right>
    <Button
      transparent
      onPress={() => Actions.argue()}>
      <Text>Argue</Text>
    </Button>
    </Right>
  </Header>
)
