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
  Thumbnail,
  Left,
  Right
} from 'native-base';
import { WebView, Linking, ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import FeedNavbar from '../../components/FeedNavbar';
import { logoutUser } from '../../redux/reducers/users';
import styles from './styles';
import { NBA_API_KEY } from 'react-native-dotenv'


function mapStateToProps(state) {
  return { teams: state.teams}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUser }, dispatch)
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
   return fetch(`https://api.fantasydata.net/v3/nba/stats/JSON/Players/${this.state.searchQuery}`, {
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
     key: player.PlayerID,
     firstName: player.FirstName,
     lastName: player.LastName,
     position: player.Position,
     positionCategory: player.PositionCategory,
     college: player.College,
     photo: player.PhotoUrl
   }
 }))
 .then((playersList) => this.setState({
   players: playersList
 }))
 .catch((error) => {
   console.log("couldn't load the players for that team", error)
 })
 }

onHandleSubmit() {
  this.loadPlayersByTeam();
}
  componentDidMount(){
    this.loadNews();
}

  render(){
    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} />
       <Tabs initialPage={0}>
         <Tab heading="Team News">
           <ScrollView>
             { this.state.news.slice(this.state.start_pos, (this.state.start_pos+10)).map((newsStory) => {
               return (
                 <Card key={newsStory.key}>
                   <CardItem header>
                     <Text>{newsStory.title}</Text>
                   </CardItem>
                   <CardItem>
                     <Text note>Date Posted: {newsStory.updated}</Text>
                   </CardItem>
                   <CardItem>
                     <Body>
                       <Text>
                         {newsStory.content}
                       </Text>
                     </Body>
                   </CardItem>
                   <CardItem footer>
                       <Text>{newsStory.source}</Text>
                   </CardItem>
                 </Card>
               )
             }) }
           </ScrollView>
         </Tab>
         <Tab heading="Team Players">
          {/* search bar to look for players based on team */}
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
                          key={player.key}
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
