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

import SinglePost from '../../components/SinglePost';
import FeedNavbar from '../../components/FeedNavbar';
import { loadTeams } from '../../redux/reducers/teams';
import { logoutUser } from '../../redux/reducers/users';
import styles from './styles';

const mapStateToProps = ({ teams }) => ({ teams });

const mapDispatchToProps = { loadTeams, logoutUser };

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
  componentDidMount(){
    this.props.loadTeams();
    console.log("THE TEAMS SHOULD BE HERE: " + this.props.teams)
  }

  render(){
    // const endMsg = this.props.teams.length === 0 ? "There aren't any teams yet!" : "That's all the posts for now!"

    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} refresh={this.props.loadTeams} />
        <Content>
          <List>
            {/* {
              !!this.props.teams.length && this.props.teams.map(renderTeam)
            } */}
          </List>
          <Text style={styles.end}>Should be teams in teh console</Text>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
