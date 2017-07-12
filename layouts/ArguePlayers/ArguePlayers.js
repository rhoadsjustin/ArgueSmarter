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
  Spinner,
  Card,
  CardItem
} from 'native-base';
import { View, ScrollView, ActivityIndicator, Button as ButtonR } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY, COSMIC_SLUG, COSMIC_WRITE_KEY } from 'react-native-dotenv'
import { Action } from 'react-native-router-flux'


const mapStateToProps = state => ({
  user: state.user,
  p1: state.p1,
  p2: state.p2
})


class ArguePlayers extends Component {
  constructor(props){
    super(props);
    // let player = this.props.navigationState["arguePlayers"]
    // let playerPhoto = this.props.navigationState["arguePlayersPhotos"]
    let player1Selected = this.props.navigationState["p1"]
    let player2Selected = this.props.navigationState["p2"]
    console.log(this.props.navigationState)
    this.state = {
      player1: player1Selected,
      player2: player2Selected,
      player1Stats: {},
      player2Stats: {},
      year: '',
      isLoading: true,
      canArgue: true,
    }
  }
  loadPlayersStats() {
    this.loadPlayerOne()
    this.loadPlayerTwo()
    this.postMatchup()
  }
  postMatchup() {
    return fetch(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/add-object`, {
      method: 'POST',
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify({
        write_key: COSMIC_WRITE_KEY,
        title: 'matchup1',
        singular: 'Matchup',
        type_slug: 'matchups',
        metafields: [
          {
            key: 'playerOne',
            type: 'text',
            value: this.state.playerOne,
            required: true
          },
          {
            key: 'playerTwo',
            type: 'text',
            value: this.state.playerTwo,
            required: true
          }
              ]
          })
        })
      .then((response) => { console.log("IT POSTED")})
      .catch(err => console.error(`Creating matchup unsuccessful`, err))
    }
  loadPlayerOne() {
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/PlayerSeasonStatsByPlayer/2017/${this.state.player1.id}`, {
     method: 'GET',
     headers: {
       'Ocp-Apim-Subscription-Key': NBA_API_KEY,
     }
   })
   .then((response) => {
     let data = response._bodyInit
     return cleanStats = JSON.parse(data)
   })
   .then((cleanStats) => this.setState({
     player1Stats: cleanStats
   }))
   .catch((error) => {
     console.log("couldn't load the player", error)
   })
  }

  loadPlayerTwo() {
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/PlayerSeasonStatsByPlayer/2017/${this.state.player2.id}`, {
     method: 'GET',
     headers: {
       'Ocp-Apim-Subscription-Key': NBA_API_KEY,
     }
   })
   .then((response) => {
     let data = response._bodyInit
     return cleanStats = JSON.parse(data)
   })
   .then((cleanStats) => this.setState({
     player2Stats: cleanStats
   }))
   .catch((error) => {
     console.log("couldn't load the player", error)
   })
  }


  componentDidMount(){
    this.loadPlayersStats()
  }

  render(){
    return (
      <Container style={styles.container}>
        <FeedNavbar />
        <Content>
          <Card>
            <CardItem header>
              <Text>Name: {this.state.player1Stats.Name}</Text>
            </CardItem>
            <CardItem>
              <Body>
                  <Text>Team: {this.state.player1Stats.Team}</Text>
                  <Text>Position: {this.state.player1Stats.Position}</Text>
                  <Text>FG: {this.state.player1Stats.FieldGoalsPercentage}%</Text>
                  <Text>3PTFG: {this.state.player1Stats.ThreePointersPercentage}%</Text>
                  <Text>FT: {this.state.player1Stats.FreeThrowsPercentage}%</Text>
                  <Text>ORB: {this.state.player1Stats.OffensiveReboundsPercentage}</Text>
                  <Text>PER: {this.state.player1Stats.PlayerEfficiencyRating}</Text>
                  <Text>BLK: {this.state.player1Stats.BlocksPercentage}</Text>
                  <Text>+/-: {this.state.player1Stats.PlusMinus}</Text>
            </Body>
            <Right>
              <Thumbnail large square style={styles.image} source={{uri: this.state.player1.photo}} />
            </Right>
            </CardItem>
            <CardItem footer>
              <Text>Who's Better?</Text>
            </CardItem>
         </Card>
        </Content>
        <Content>
          <Card>
            <CardItem header>
              <Text>Name: {this.state.player2Stats.Name}</Text>
            </CardItem>
            <CardItem>
              <Body>
                  <Text>Team: {this.state.player2Stats.Team}</Text>
                  <Text>Position: {this.state.player2Stats.Position}</Text>
                  <Text>FG: {this.state.player2Stats.FieldGoalsPercentage}%</Text>
                  <Text>3PTFG: {this.state.player2Stats.ThreePointersPercentage}%</Text>
                  <Text>FT: {this.state.player2Stats.FreeThrowsPercentage}%</Text>
                  <Text>ORB: {this.state.player2Stats.OffensiveReboundsPercentage}</Text>
                  <Text>PER: {this.state.player2Stats.PlayerEfficiencyRating}</Text>
                  <Text>BLK: {this.state.player2Stats.BlocksPercentage}</Text>
                  <Text>+/-: {this.state.player2Stats.PlusMinus}</Text>
              </Body>
              <Right>
                <Thumbnail large square style={styles.image} source={{uri: this.state.player2.photo}} />
              </Right>
            </CardItem>
            <CardItem footer>
              <Text>Who's Better?</Text>
            </CardItem>
         </Card>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(ArguePlayers);
