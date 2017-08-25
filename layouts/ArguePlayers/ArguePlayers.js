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
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUser }, dispatch)
}

const mapStateToProps = state => ({
  user: state.user,
  p1: state.p1,
  p2: state.p2
})


class ArguePlayers extends Component {
  constructor(props){
    super(props);
    let player1Selected = this.props.navigationState["p1"]
    let player2Selected = this.props.navigationState["p2"]
    this.state = {
      player1: player1Selected,
      player2: player2Selected,
      player1Stats: {},
      player2Stats: {},
      year: '',
      isLoading: true,
      canArgue: true,
      player1votes: 0,
      player2votes: 0,
      isPosted: false
    }
  }
  loadPlayersStats() {
    this.loadPlayerOne()
    this.loadPlayerTwo()
  }
  postMatchup() {
    console.log("THIS IS PLAYER 1 NAME: ", this.state.player1.name)
    return fetch(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/add-object`, {
      method: 'POST',
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify({
        write_key: COSMIC_WRITE_KEY,
        title: `${this.state.player1.id}${this.state.player2.id}`,
        singular: "Matchup",
        type_slug: 'matchups',
        metafields: [
          {
            key: 'playerone',
            type: 'text',
            value: this.state.player1.name,
            required: true
          },
          {
            key: 'playeronephoto',
            type: 'text',
            value: this.state.player1.photo
          },
          {
            key: 'playertwo',
            type: 'text',
            value: this.state.player2.name,
            required: true
          },
          {
            key: 'playertwophoto',
            type: 'text',
            value: this.state.player2.photo
          },
          {
            key: 'playeronevotes',
            type: 'text',
            value: this.state.player1votes,
          },
          {
            key: 'playertwovotes',
            type: 'text',
            value: this.state.player2votes,
          },
          {
            key: 'postedby',
            type: 'text',
            value: this.props.user.username,
          }

              ]
          })
        })
      .then((response) => { console.log("IT POSTED")})
      .then(this.setState({
        isPosted: true
      }))
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
    console.log(this.props.user);
    return (
      <Container style={styles.container}>
        <FeedNavbar logout={this.props.logoutUser} />
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
              <Button small rounded primary onPress={ () => {this.setState({ player1votes: this.state.player1votes+1})}}><Text>Vote for {this.state.player1.name}</Text></Button>
              <Right>
                <Text>
                  Total Votes: {this.state.player1votes}
                </Text>
              </Right>
            </CardItem>
         </Card>
        </Content>
        <Button disabled={this.state.isPosted} rounded style={styles.button} onPress={() => this.postMatchup()}><Text>Submit Matchup</Text></Button>
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
              <Button small rounded primary onPress={ () => {this.setState({ player2votes: this.state.player2votes+1})}}><Text>Vote for {this.state.player2.name}</Text></Button>
              <Right>
                <Text>
                  Total Votes: {this.state.player2votes}
                </Text>
              </Right>
            </CardItem>
         </Card>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArguePlayers);
