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


export default (props) => (
  <Header>
    <Left>
      <Button
        transparent
        onPress={() => props.logout()}
      >
          <Text>Log out</Text>
      </Button>
  </Left>
  <Body>
    <Title>NBA News</Title>
  </Body>
  <Right>
      <Button
        transparent
        onPress={() => props.feed()}
      >
        <Text>News</Text>
        <Icon name="refresh" />
      </Button>
    </Right>
  </Header>
)
