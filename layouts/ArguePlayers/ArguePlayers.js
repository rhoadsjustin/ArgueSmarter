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
import { NBA_API_KEY } from 'react-native-dotenv'


const mapStateToProps = state => ({
  user: state.user,
  arguePlayers: state.arguePlayers
})


class ArguePlayers extends Component {
  constructor(props){
    super(props);
    let player = this.props.navigationState["arguePlayers"]
    this.state = {
      player1: player[0],
      player2: player[1],
      player1Stats: {},
      player2Stats: {},
      year: '',
      isLoading: true,
      canArgue: true
    }
  }
  loadPlayersStats() {
    this.loadPlayerOne()
    this.loadPlayerTwo()
  }

  loadPlayerOne() {
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/PlayerSeasonStatsByPlayer/2017/${this.state.player1}`, {
     method: 'GET',
     headers: {
       'Ocp-Apim-Subscription-Key': NBA_API_KEY,
     }
   })
   .then((response) => {
     let data = response._bodyInit
     console.log("THIS IS THE STATS: ", JSON.parse(data))
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
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/PlayerSeasonStatsByPlayer/2017/${this.state.player2}`, {
     method: 'GET',
     headers: {
       'Ocp-Apim-Subscription-Key': NBA_API_KEY,
     }
   })
   .then((response) => {
     let data = response._bodyInit
     console.log("THIS IS THE STATS: ", JSON.parse(data))
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
                  <Text>FG%: {this.state.player1Stats.FieldGoalsPercentage}%</Text>
                  <Text>3PTFG%: {this.state.player1Stats.ThreePointersPercentage}%</Text>
                  <Text>FT%: {this.state.player1Stats.FreeThrowsPercentage}</Text>
                  <Text>ORB: {this.state.player1Stats.OffensiveReboundsPercentage}</Text>
                  <Text>PER: {this.state.player1Stats.PlayerEfficiencyRating}</Text>
                  <Text>BLK: {this.state.player1Stats.BlocksPercentage}</Text>
                  <Text>+/-: {this.state.player1Stats.PlusMinus}</Text>
            </Body>
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
                  <Text>FG%: {this.state.player2Stats.FieldGoalsPercentage}%</Text>
                  <Text>3PTFG%: {this.state.player2Stats.ThreePointersPercentage}%</Text>
                  <Text>FT%: {this.state.player2Stats.FreeThrowsPercentage}</Text>
                  <Text>ORB: {this.state.player2Stats.OffensiveReboundsPercentage}</Text>
                  <Text>PER: {this.state.player2Stats.PlayerEfficiencyRating}</Text>
                  <Text>BLK: {this.state.player2Stats.BlocksPercentage}</Text>
                  <Text>+/-: {this.state.player2Stats.PlusMinus}</Text>
              </Body>
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
