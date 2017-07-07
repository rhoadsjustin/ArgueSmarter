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
  }

  render(){
    const endMsg = this.props.teams.length === 0 ? "There aren't any teams yet!" : "That's all the posts for now!"

    return (
      <Container>
        <FeedNavbar logout={this.props.logoutUser} refresh={this.props.loadTeams} />
        <Content>
          <List>
            {
              !!this.props.posts.length && this.props.posts.map(renderPost)
            }
          </List>
          <Text style={styles.end}>{endMsg}</Text>
        </Content>
        <Button
          rounded
          style={styles.button}
          onPress={() => Actions.newPost()}
        >
          <Icon
            name="create"
            style={{padding: 5}}
          />
        </Button>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
