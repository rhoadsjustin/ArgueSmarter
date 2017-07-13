import React from 'react';
import { StyleSheet, Text, View, AppRegistry, AsyncStorage } from 'react-native';
import Router from './config/routes';
import { Font, AppLoading } from 'expo';
import { Provider, connect } from 'react-redux';
import store from './redux/store';
import { NBA_API_KEY } from 'react-native-dotenv'


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    }
  }
  getInitialState() {
    return {
      asyncPlayers: []
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

  componentDidMount() {
    this.loadPlayers()
  }

  loadPlayers() {
   return fetch('https://api.fantasydata.net/v3/nba/stats/JSON/Players', {
     method: 'GET',
     headers: {
       'Ocp-Apim-Subscription-Key': NBA_API_KEY,
     }
   })
   .then((response) => {
     let data = response._bodyInit
     console.log("THIS IS THE PLAYERS: ",JSON.parse(data))
     return cleanPlayers = JSON.parse(data)
   })
   .then((cleanPlayers) => playersList = cleanPlayers.map(player => {
     return {
       id: player.PlayerID,
       firstName: player.FirstName,
       lastName: player.LastName,
       position: player.Position,
       positionCategory: player.PositionCategory,
       college: player.College,
       photo: player.PhotoUrl,
       experience: player.Experience,
       team: player.Team,
       jersey: player.Jersey
     }
   }))
   .then((playersList) => {
     AsyncStorage.setItem(asyncPlayers, playersList).then(
       this.setState({
         asyncPlayers: playersList,
       }))
     })
   .catch((error) => {
     console.log("couldn't load the players for that team", error)
   })
   }

  render() {
    console.log("THEY ACTUALLY LOADED HERE: ", this.state.asyncPlayers)
    if(!this.state.isReady) {
      return <AppLoading />;
    }
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

AppRegistry.registerComponent('main', () => App);
