import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Container,
  Content,
  Header,
  Tab,
  Tabs,
  List,
  Button,
  Icon,
  Text,
  Card,
  CardItem,
  Body,
  Item,
  Input,
  ListItem,
  Thumbnail
} from 'native-base';
import { WebView, Linking, ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import SinglePost from '../../components/SinglePost';
import FeedNavbar from '../../components/FeedNavbar';
import { loadTeams } from '../../redux/reducers/teams';
import { logoutUser } from '../../redux/reducers/users';
import styles from './styles';
import { NBA_API_KEY } from 'react-native-dotenv'

// import Tab1 from '../../components/FavPlayer';
// import TeamPlayers from '../../components/TeamPlayers';
// const NBA = ApiClient.init(NBA_API_KEY)

function mapStateToProps(state) {
  return { teams: state.teams}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadTeams }, dispatch)
}
const renderTeamNews = (news, index) => (
  <Tab1
    key={news.NewsID}
    content={news.Content}
    title={news.title}
    updated={news.Updated}
    source={news.Source}
    url={news.Url}
  />
)

class Feed extends Component {
  constructor(){
    super()
    this.state = {
      news: [],
      start_pos: 0,
      showNews: [],
      hasSearched: false,
      searchQuery: '',
      players: []
    }
  }
   loadNews() {
    return fetch('https://api.fantasydata.net/v3/nba/stats/JSON/News', {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': NBA_API_KEY,
    }
  })
    .then((response) => {
      let data = response._bodyInit;
      console.log("This is the news for all teams: ", JSON.parse(data))
      return prettyData = JSON.parse(data)
    })
    .then((prettyData) => prettyNews = prettyData.map(news => {
      return {
        key: news.NewsID,
        title: news.Title,
        updated: news.Updated,
        content: news.Content,
        source: news.Source,
        url: news.Url
      }
      console.log("newsStory created: ", news)
    }))
    .then((prettyNews) => this.setState({
      news: prettyNews
    }))
    .then(this.setState({
      showNews: this.state.news.slice(this.state.start_pos, (this.state.start_pos+5))
    }))
    .catch((error) => {
      console.log("couldn't load the news", error)
    });
  }

  loadPlayersByTeam() {
   console.log(`https://api.fantasydata.net/v3/nba/stats/JSON/Players/${this.state.searchQuery}`)
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/Players/${this.state.searchQuery}`, {
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
     photo: player.PhotoUrl
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

onHandleSubmit() {
  console.log("CLICKED THIS BUTTON");
  this.loadPlayersByTeam();
}
  componentDidMount(){
    this.loadNews();
}

// componentWillUpdate() {
//   if(this.state.players.length > 1) {
//
//   let playerView =
//   } else {
//     let playerView =  <Text>Search by abbreviations: 'LAL for Lakers, BKN for Nets, etc'</Text>
//
//   }
// }
  render(){
    console.log("THE NEWS MADE IT: ", this.state.news.slice(this.state.start_pos, (this.state.start_pos+10)))
    console.log("API KEY: ", NBA_API_KEY)
    console.log("Search Query: ", this.state.searchQuery)
    console.log("THESE ARE THE PLAYERS CREATED: ", this.state.players)

    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} />
       <Tabs initialPage={0}>
         <Tab heading="Team News">
           <ScrollView>
             { this.state.news.slice(this.state.start_pos, (this.state.start_pos+10)).map((newsStory) => {
               return (
                 <Card>
                   <CardItem header>
                     <Text>{newsStory.title}</Text>
                   </CardItem>
                   <CardItem>
                     <Body id={newsStory.key}>
                       <Text>
                         {newsStory.content}
                       </Text>
                     </Body>
                   </CardItem>
                   <CardItem footer>
                     <Text>{newsStory.source} || {newsStory.updated}</Text>
                   </CardItem>
                 </Card>
               )
             }) }
           </ScrollView>
         </Tab>
         <Tab heading="Team Players">
          {/* search bar to look for players based on team to pick for matchup of stats  */}
                <Container>
                  <Header searchBar rounded>
                    <Item>
                      <Icon name="ios-search" />
                      <Input placeholder="Search by Team"
                        onChangeText={(query) => this.setState({
                          searchQuery: query
                        })}
                      />
                        <Icon name="ios-people" />
                      </Item>
                      <Button transparent
                        onPress={() => this.onHandleSubmit()}>
                        <Text>Search</Text>
                      </Button>
                    </Header>
              <ScrollView>
                  { this.state.players.map((player) => {
                      return (
                        <ListItem
                          thumbnail={player.photo}>
                          <Thumbnail square size={80} source={{ uri: player.photo }} />
                          <Body>
                            <Text>{player.firstName} {player.lastName}</Text>
                            <Text note>Position: {player.position} || College: {player.college}</Text>
                          </Body>
                        </ListItem>
                      )}
                    )}
            </ScrollView>
            </Container>
           </Tab>
         </Tabs>
       </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
