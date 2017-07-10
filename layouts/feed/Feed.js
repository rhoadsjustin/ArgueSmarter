import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Container,
  Content,
  List,
  Button,
  Icon,
  Text,
} from 'native-base';
import { bindActionCreators } from 'redux';
import SinglePost from '../../components/SinglePost';
import FeedNavbar from '../../components/FeedNavbar';
import { loadTeams } from '../../redux/reducers/teams';
import { logoutUser } from '../../redux/reducers/users';
import styles from './styles';

function mapStateToProps(state) {
  return { teams: state.teams}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadTeams }, dispatch)
}
const renderTeam = (team, index) => (
  <SinglePost
    uniqueID={team['_id']}
    key={team.key}
    name={team.name}
    city={team.city}
    teamPicture={team.WikipediaLogoUrl}
    division={team.division}
  />
)

class Feed extends Component {
  constructor(){
    super()
    this.state = {
      teams: [
        {
          name: '',
          city: '',
          key: '',
          conference: '',
          division: '',
          logo: '',
        }
      ]
    }
  }
   loadTeams() {
    return fetch('https://api.fantasydata.net/v3/nba/scores/JSON/teams', {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': '',
    }
  })
    .then((response) => {
      let data = response._bodyInit;
      console.log("This is the teams: ", JSON.parse(data))
      return prettyData = JSON.parse(data)
    })
    .then((prettyData) => prettyTeams = prettyData.map(team => {
      return {
        name: team.Name,
        city: team.City,
        key: team.Key,
        conference: team.Conference,
        division: team.Division,
        logo: team.WikipediaLogoUrl
      }
      console.log("team created", team)
    }))
    .then((prettyTeams) => this.setState({
      teams: prettyTeams
    }))
    .catch((error) => {
      console.log("couldn't load the teams", error)
    });
  }

  componentDidMount(){
    this.loadTeams();
 }

  render(){
    // const endMsg = this.props.teams.length === 0 ? "There aren't any teams yet!" : "That's all the posts for now!"
    console.log("THE TEAMS MADE IT: ", this.state.teams)
    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} />
        <Content>
          <List>
            {
              !!this.state.teams.length && this.state.teams.map(renderTeam)
            }
          </List>
          <Text style={styles.end}>Should be teams in teh console</Text>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
