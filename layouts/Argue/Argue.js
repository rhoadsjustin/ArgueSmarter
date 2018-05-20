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
import { Actions } from 'react-native-router-flux'
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';



const mapStateToProps = state => ({
  user: state.user,
  p1: state.p1,
  p2: state.p2
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUser }, dispatch)
}

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
      playerTwoSelected: ''
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

  initialPlayers() {
    let initialResults = this.state.players.slice(0, 30).map((player) => {
      return player
    })
    console.log(initialResults)
    this.setState({
      filteredPlayers: initialResults
    })
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
     isLoading: false
   }, () => this.initialPlayers()))
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

  render(){
    return (
      <Container>
        <Content>
          {/* searchbar for finding the players to argue about  */}
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search by Player Name"
                onChangeText={(query) => {this.setState({searchPlayers: query})}}
              />
              </Item>
              <Button transparent
                onPress={() => this.searchByName()}>
                <Icon name="ios-navigate" />
              </Button>
            </Header>
          <View style={styles.argueContainer}>
            <Text style={styles.argue} title>Arguing:</Text>
            <Text style={styles.playerText}>{this.state.p1.name}</Text>
            <Text style={styles.vs} title>VS:</Text>
            <Text style={styles.playerText}>{this.state.p2.name}</Text>
          </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ActivityIndicator animating={this.state.isLoading} size='large'/>
          { this.state.filteredPlayers.map((player) => {
            return (
              <Card
                  key={player.id}
                  style={player.id === this.state.playerOneSelected || player.id === this.state.playerTwoSelected ? styles.playerPressed : styles.player }
                  onPress={() => this.playersToArgueAbout(player)}
                  >
                  <CardItem header>
                    <Text style={styles.playerInfoText}>{player.firstName} {player.lastName}</Text>
                  </CardItem>
                  <CardItem>
                    <Thumbnail source={{ uri: player.photo }} />
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text note style={styles.playerInfoText}>Team: {player.team}</Text>
                      <Text note style={styles.playerInfoText}>Position: {player.position}</Text>
                    </Body>
                  </CardItem>
                  <CardItem footer>
                    <Text>Click to Argue</Text>
                  </CardItem>
              </Card>
            )
          })}
        </ScrollView>
          <View>
            <Button
              rounded
              iconRight
              disabled={this.state.canArgue}
              style={styles.button}
              onPress={(arguePlayers) => Actions.arguePlayers({ p1: this.state.p1, p2: this.state.p2 })}>
              <Text>Go Argue</Text>
              <Icon name="ios-exit-outline" />
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Argue);
