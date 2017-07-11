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
  Right
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
      players: []
    }
  }

  onSubmit() {
    if (this.state.player1 && this.state.player2){
      this.props.createArgument({
        user: this.props.user,
        content: this.state.content,
      })
    } else {
      this.setState({error: 'You have to write something!'});
    }
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
     console.log("THIS IS THE PLAYERS: ", JSON.parse(data))
     return cleanPlayers = JSON.parse(data)
   })
   .then((cleanPlayers) => playersList = cleanPlayers.map(player => {
     return {
       id: player.GlobalTeamID,
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
     console.log("player created: ", player)
   }))
   .then((playersList) => this.setState({
     players: playersList
   }))
   .catch((error) => {
     console.log("couldn't load the players for that team", error)
   })
   }

  componentDidMount(){
    this.loadPlayers();
  }

  render(){
    return (
      <Container style={styles.container}>
        <FeedNavbar />
        <Content>
          <Text style={styles.formMsg}>{this.state.error}</Text>
          <ScrollView>
          { this.state.players.map((player) => {
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
