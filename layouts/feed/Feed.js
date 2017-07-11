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
  Input
} from 'native-base';
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
      showNews: []
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

  componentDidMount(){
    this.loadNews();
 }

  render(){
    // const endMsg = this.props.teams.length === 0 ? "There aren't any teams yet!" : "That's all the posts for now!"
    console.log("THE NEWS MADE IT: ", this.state.news.slice(this.state.start_pos, (this.state.start_pos+10)))
    console.log("API KEY: ", NBA_API_KEY)
    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} />
        <Container>
       <Header hasTabs />
       <Tabs initialPage={1}>
         <Tab heading="Team News">
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
         </Tab>
         <Tab heading="Team Players">
          {/* search bar to look for players based on team to pick for matchup of stats  */}
           <Container>
             <Header searchBar rounded>
                 <Item>
                   <Icon name="ios-search" />
                   <Input placeholder="Search" />
                   <Icon name="ios-people" />
                 </Item>
                   <Button transparent>
                     <Text>Search</Text>
                   </Button>
             </Header>
           </Container>
         </Tab>
       </Tabs>
     </Container>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
