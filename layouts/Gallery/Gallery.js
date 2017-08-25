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
import DefaultLogo from '../../assets/giphy.gif';


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
    this.state = {
      matchups: [],
      isLoading: true,
    }
  }

  getMatchups() {
    return fetch(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/object-type/matchups`, {
      method: 'GET'
    })
      .then((response) => {
        let data = response._bodyInit
        let prettyData = JSON.parse(data)
        console.log("LOOK at THIS: ", prettyData.objects)
        let prettierData = prettyData.objects
        return prettierData
      })
      .then((prettierData) => prettyMatchups = prettierData.map(matchup => {
        return {
          key: matchup._id,
          player1name: matchup.metadata.playerone,
          player1votes: matchup.metadata.playeronevotes,
          player1photo: matchup.metadata.playeronephoto || 'https://github.com/rhoadsjustin/ArgueSmarter/blob/master/assets/giphy.gif?raw=true',
          player2name: matchup.metadata.playertwo,
          player2votes: matchup.metadata.playertwovotes,
          player2photo: matchup.metadata.playertwophoto || 'https://github.com/rhoadsjustin/ArgueSmarter/blob/master/assets/giphy.gif?raw=true',
          postedBy: matchup.metadata.postedby
        }
      }))
      .then((prettyMatchups) => this.setState({
        matchups: prettyMatchups
      }))
      .catch(err => console.error(`Couldn't get the matchups`, err))
    }


  componentDidMount(){
    this.getMatchups();
  }

  render(){
    let matchupsList = this.state.matchups
    console.log("THIS: ", matchupsList)
    return (
      <Container style={styles.container}>
        <FeedNavbar logout={this.props.logoutUser} />
        <Content>
            <List>
          { matchupsList.map((matchup) => {
                return (
            <ListItem avatar key={matchup.key}>
              <Left>
                <Thumbnail source={{uri: matchup.player1photo}} />
              </Left>
              <Body>
                <Text>{matchup.player1name} vs {matchup.player2name}</Text>
                <Text>Votes: {matchup.player1votes} vs. Votes: {matchup.player2votes}</Text>
                <Text note>Posted By: {matchup.postedBy}</Text>
              </Body>
              <Right>
                <Thumbnail source={{uri: matchup.player2photo}} />
              </Right>
            </ListItem>
          )}
        )}
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArguePlayers);
