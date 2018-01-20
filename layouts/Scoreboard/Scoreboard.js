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


class Scoreboard extends Component {
        constructor(){
            super();
            this.state = {
                games: [],
                gameDate: ''
            }

        }
        loadGames() {
            return fetch(`https://api.fantasydata.net/v3/nba/scores/JSON/GamesByDate/${this.state.gameDate}`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': NBA_API_KEY,
                }
            })
                .then((res) => {
                    let data = res._bodyInit;
                  console.log(JSON.parse(data))
                })
            .catch((err) => {console.log("error", err)})
        }

        componentDidMount(){
            var today = new Date();
            today = today.toISOString().substring(0, 10);
            console.log(today);
            this.setState({
                gameDate: today
            }, () => {
                this.loadGames()
            })
            // this.loadGames()
        }
        render(){
            return (
                <Container>
                    <FeedNavbar logout={this.props.logoutUser} />
                    {/* TODO: input field for game Date or calendar button */}
                </Container>
            )
        }



}

export default connect(mapStateToProps)(Scoreboard);