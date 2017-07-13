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
import { View, ScrollView, ActivityIndicator, Button as ButtonR, AsyncStorage } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY } from 'react-native-dotenv'
import { Actions } from 'react-native-router-flux'


const mapStateToProps = state => ({
  user: state.user,
  p1: state.p1,
  p2: state.p2
})


class Argue extends Component {
  constructor(){
    super();
    this.state = {
      players: [],
      searchPlayers: '',
      filteredPlayers: [],
      isLoading: true,
      canArgue: true,
      pressed: false,
      playerSelected: '',
      p1picked: false,
      p2picked: false,
      p1: {
        name: '',
        id: '',
        photo: ''
      },
      p2: {
        name: '',
        id: '',
        photo: ''
      },
      playerOneSelected: '',
      playerTwoSelected: '',
      asyncPlayers: []
    }
  }

  searchByName() {
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

  playersToArgueAbout(player) {
    let name = player.firstName + ' ' + player.lastName
    if(!this.state.p1picked) {
      this.setState({
        p1: {
          name: name,
          id: player.id,
          photo: player.photo
        },
        p1picked: true,
        playerOneSelected: player.id
      })
    } else if(!this.state.p2picked) {
      this.setState({
        p2: {
          name: name,
          id: player.id,
          photo: player.photo
        },
        p2picked: true,
        playerTwoSelected: player.id,
        canArgue: false
      })
    } else if(this.state.p1picked && this.state.p2picked){
        if(player.id === this.state.p1.id) {
          this.setState({ p1picked: false })
        } else if(player.id === this.state.p2.id) {
          this.setState({ p2picked: false })
        }
    }
  }


  componentDidMount(){
    this.loadPlayers()
  }

  componentWillMount(){
    AsyncStorage.getItem(asyncPlayers).then((value) => {
      this.setState({asyncPlayers: value});
    }).then(() => {
      console.log("LOCAL STORAGE PLAYERS: ", this.state.asyncPlayers);
    })
      .done();
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
                onPress={ (arguePlayers) => Actions.arguePlayers({p1: this.state.p1, p2: this.state.p2})}>
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
                style={player.id === this.state.playerOneSelected || player.id === this.state.playerTwoSelected ? styles.playerPressed : styles.player }
                onPress={() => this.playersToArgueAbout(player)}
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
                  <Text>Click to Argue</Text>
                </Right>
              </ListItem>
            )
          })}
        </ScrollView>
        <View style={styles.argueContainer}>
          <Text style={styles.argue} title>Arguing:</Text>
          <Text style={styles.playerText}>{this.state.p1.name}</Text>
          <Text style={styles.vs} title>VS:</Text>
          <Text style={styles.playerText}>{this.state.p2.name}</Text>
        </View>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Argue);
