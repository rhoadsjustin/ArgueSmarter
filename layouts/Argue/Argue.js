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
  Item
} from 'native-base';
import { View, ScrollView } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY } from 'react-native-dotenv'


const mapStateToProps = state => ({
  user: state.user,
})


class Argue extends Component {
  constructor(){
    super();
    this.state = {
      player1: '',
      player2: '',
      players: [],
      searchPlayers: '',
      filteredPlayers: []
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
     filteredPlayers: playersList
   }))
   .catch((error) => {
     console.log("couldn't load the players for that team", error)
   })
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
        <ScrollView>
          { this.state.filteredPlayers.map((player) => {
            return (
              <ListItem avatar key={player.id}>
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
