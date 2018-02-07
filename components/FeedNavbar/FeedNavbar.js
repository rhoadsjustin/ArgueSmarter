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
    <Text>{props.title}</Text>
    <Left>
      <Button
        transparent
        onPress={() => Actions.profile()}>
        {/* todo: add scene for profile page */}
          <Icon name="ios-contact" style={styles.icon} />
      </Button>
  </Left>
  <Button
    transparent
    onPress={() => Actions.feed()}>
      <Icon name="ios-paper" style={styles.icon}/>
    </Button>
  <Button
    transparent
    onPress={() => Actions.gallery()}>
      <Icon name="ios-people" style={styles.icon} />
    </Button>
    <Button
      transparent
      onPress={() => Actions.scoreboard()}>
      <Icon name="ios-podium" style={styles.icon} />
    </Button>
  <Right>
    <Button
      transparent
      onPress={() => Actions.argue()}>
      <Icon name="ios-contacts" style={styles.icon} />
    </Button>
    </Right>
  </Header>
)
