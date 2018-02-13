import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import Router from './config/routes';
import { Provider, connect } from 'react-redux';
import configureStore from './redux/store';

const store = configureStore();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('ArgueSmarter', () => App);
