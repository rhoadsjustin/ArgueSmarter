import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import Router from './config/routes';
import { Font, AppLoading } from 'expo';


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    }
  }
  async componentWillMount() {
    await Font.loadAsync({
      'ESPN-BoldItl' : require('./assets/fonts/esp_bdit.ttf'),
      'ESPN-Bold' : require('./assets/fonts/esp_bold.ttf'),
      'ESPN-Itl' : require('./assets/fonts/esp_ital.ttf'),
      'ESPN' : require('./assets/fonts/esp.ttf'),

    });

    this.setState({isReady: true});
  }
  render() {
    if(!this.state.isReady) {
      return <AppLoading />;
    }
    return (
        <Router />

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

AppRegistry.registerComponent('main', () => App);
