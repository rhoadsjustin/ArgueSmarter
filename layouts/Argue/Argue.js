import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  Button,
  List,
  ListItem,
  Thumbnail,
  Body,
  Left,
  Right,
  Header,
  Icon,
  Input,
  Item,
  Spinner
} from 'native-base';
import { View, ScrollView, ActivityIndicator, Button as ButtonR } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY } from 'react-native-dotenv'
import { Actions } from 'react-native-router-flux'


const mapStateToProps = state => ({
  user: state.user,
  arguePlayers: state.arguePlayers,
  arguePlayersPhotos: state.arguePlayersPhotos
})


class Argue extends Component {
  constructor(){
    super();
    this.state = {
      arguePlayers: [],
      players: [],
      searchPlayers: '',
      filteredPlayers: [],
      isLoading: true,
      canArgue: true,
      pressed: false,
      playerSelected: '',
      arguePlayersPhotos: []
    }
  }

  searchByName() {
    console.log("THIS IS THE SEARCH: ", this.state.searchPlayers)
    console.log("IS THIS NULL: ", (this.state.searchPlayers != null))
    if(this.state.searchPlayers != null) {
      let playersFiltered = this.state.players.filter((player) => {
        let name = player.firstName + ' ' + player.lastName
        let found = name.includes(this.state.searchPlayers)
        return found
      })
      this.setState({
        filteredPlayers: playersFiltered
      })
    } else {
      this.setState({
        filteredPlayers: this.state.players
      })
    }
    console.log(this.state.filteredPlayers);
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
   .then((playersList) => this.setState({
     players: playersList,
     filteredPlayers: playersList,
     isLoading: false
   }))
   .catch((error) => {
     console.log("couldn't load the players for that team", error)
   })
   }

  selectedPlayer(player) {
    this.setState({
      selectedPlayer: player.id
    })
    console.log("CLICKED!!!!! THE CARD SHOULD CHANGE")
  }

  playersToArgueAbout(player) {
    if(this.state.arguePlayers.length < 2) {
      this.state.arguePlayers.push(player.id)
      this.state.arguePlayersPhotos.push(player.photo)
      return
    } else {
      this.setState({
        canArgue: false
      })
      this.state.arguePlayers.push(player.id)
      this.state.arguePlayersPhotos.push(player.photo)
      this.state.arguePlayers.shift()
      this.state.arguePlayersPhotos.shift()
      return
    }
    console.log("PLAYERS TO ARGUE BOUT: ", this.state.arguePlayers)
    console.log("THIS STATE SHOULD CHANGE: ", this.state.canArgue)
  }
  componentDidMount(){
    this.loadPlayers()
  }

  render(){
    return (
      <Container style={styles.container}>
        <FeedNavbar />
        <Content>
          {/* searchbar for finding the players to argue about  */}
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search by Player Name"
                onChangeText={(query) => {this.setState({searchPlayers: query})}}
              />
                <Icon name="ios-person" />
              </Item>
              <Button transparent
                onPress={() => this.searchByName()}>
                <Icon name="ios-navigate" />
              </Button>
            </Header>
            <View>
              <Button
                rounded
                iconRight
                disabled={this.state.canArgue}
                style={styles.button}
                onPress={ (arguePlayers) => Actions.arguePlayers({arguePlayers: this.state.arguePlayers})}>
                <Text>Go Argue</Text>
                <Icon name="ios-exit-outline" />
              </Button>
            </View>
        <ScrollView style={styles.scroll}>
          <ActivityIndicator animating={this.state.isLoading} />
          { this.state.filteredPlayers.map((player) => {
            return (
              <ListItem
                avatar
                key={player.id}
                style={player.id === this.state.playerSelected ? styles.playerPressed : styles.player }
                onPress={() => {this.playersToArgueAbout(player); this.selectedPlayer(player)}}
                >
                <Left>
                  <Thumbnail source={{ uri: player.photo }} />
                </Left>
                <Body>
                  <Text>{player.firstName} {player.lastName}</Text>
                  <Text note>Years in the League: {player.experience}</Text>
                  <Text note>Jersey #: {player.jersey}</Text>
                  <Text note>Position: {player.position}</Text>
                  <Text note>College: {player.college}</Text>
                </Body>
                <Right>
                  <Text note>Team: {player.team}</Text>
                  <Text note>Argue: <Icon name="ios-man" /></Text>
                </Right>
              </ListItem>
            )
          })}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Argue);
