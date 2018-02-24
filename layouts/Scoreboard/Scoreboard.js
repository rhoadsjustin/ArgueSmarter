import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Card,
    CardItem,
    Image,
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
import { View, ScrollView, ActivityIndicator, Button as ButtonR, WebView } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY, MSF_AUTH } from 'react-native-dotenv'
import { Actions } from 'react-native-router-flux'
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import Images from '../img/index';
import base64 from 'base-64';

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
                gameDate: '',
                longGameDate: ''
            }

        }
        loadGames() {
            var input = MSF_AUTH;
            console.log("HERE'S the input", input);

            var encodedData = base64.encode(input);
            return fetch(`https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/daily_game_schedule.json?fordate=${this.state.gameDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${MSF_AUTH}`
                }
            })
                .then((res) => {
                    let data = res._bodyInit;
                 
                  return cleanGameData = JSON.parse(data)
                })
                .then((cleanGameData) => gamesList = cleanGameData["dailygameschedule"].gameentry.map(game => {
                   
                    return {
                        awayTeam: game.awayTeam.Abbreviation,
                        awayTeamCity: game.awayTeam.City,
                        awayTeamID: game.awayTeam.ID,
                        awayTeamName: game.awayTeam.Name,
                        homeTeam: game.homeTeam.Abbreviation,
                        homeTeamCity: game.homeTeam.City,
                        homeTeamID: game.homeTeam.ID,
                        homeTeamName: game.homeTeam.Name,
                        gameID: game.id,
                        gameDate: this.state.gameDate,
                        gameLocation: game.location,
                        gameStartTime: game.time
                    }
                }))
                .then((gamesList) => this.setState({
                    games: gamesList
                })) 
            .catch((err) => {console.log("error", err)})
        }

        goBackADay(){
            var currentDateSelected = this.state.longGameDate;
            var yesterday = new Date(currentDateSelected.setDate(currentDateSelected.getDate() - 1));
            yesterday = yesterday.toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');
            console.log(yesterday);
            this.setState({
                gameDate: yesterday
            }, () => {this.loadGames()})
        }
    goForwardADay() {
        var currentDateSelected = this.state.longGameDate;
        var tomorrow = new Date(currentDateSelected.setDate(currentDateSelected.getDate() + 1));
        tomorrow = tomorrow.toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');
        console.log(tomorrow);
        this.setState({
            gameDate: tomorrow
        }, () => { this.loadGames() })
    }

        componentDidMount(){
            var today = new Date().toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');

            var longToday = new Date();
            // var today = longToday.toISOString().substring(0, 10);
            console.log(today);
            this.setState({
                gameDate: today,
                longGameDate: longToday
            }, () => {
                this.loadGames()
            })
            // this.loadGames()
        }
        render(){
            console.log("HERE ARE THE GAMES: ", this.state.games)
            return (
                <Container >
                    <Text style={{ alignSelf: 'center', fontSize: 18, paddingTop: 20}}>{this.state.gameDate}</Text>
                        <ScrollView contentContainerStyle={{flex: 0}}>
                    <Container style={{ flex: 1, justifyContent: 'space-around'  ,flexDirection: 'row', flexWrap: 'wrap' }}>
                        {/* TODO: input field for game Date or calendar button */}
                            { this.state.games.map((game, i) => {
                                i++;
                                let awayTeamImage = game.awayTeam
                                let homeTeamImage = game.homeTeam
                                return (
                                    <View key={i} style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', margin: 10, width: 150, height: 175 }}>    
                                        <Card style={styles.scoreBoard}>
                                            <CardItem style={styles.scoreBoard}>
                                                <Left>
                                                    <Thumbnail size={20} source={Images[awayTeamImage]} />
                                                </Left>
                                                <Right>
                                                    <Thumbnail size={20} source={Images[homeTeamImage]} />
                                                </Right>
                                                </CardItem>
                                            <CardItem style={styles.scoreBoard}>
                                                    <Body>
                                                    <Text style={styles.gameInfoText}>{game.awayTeamName} vs. {game.homeTeamName}</Text>
                                                    <Text style={styles.gameInfoText}>Time: {game.gameStartTime}</Text>
                                                    </Body>
                                                 </CardItem>
                                            <CardItem style={styles.scoreBoard}>
                                                <Text style={styles.gameInfoText}>Location: {game.gameLocation}</Text>
                                                <Button onPress={() => Actions.boxscore({gameInfo: this.state.games[i]})}>
                                                    <Text style={styles.gameInfoText}>Boxscore</Text>
                                                </Button>
                                              </CardItem>
                                        </Card>
                                    </View>
                                )
                            })}
                </Container>
                        </ScrollView>
                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingBottom: 20}}>
                                <Button style={{ justifyContent: 'center', width: '40%'}} onPress={this.goBackADay.bind(this)}>
                                    <Text>Back</Text>
                                </Button>
                                <Button style={{ justifyContent: 'center', width: '40%' }} onPress={this.goForwardADay.bind(this)}>
                                    <Text>Forward</Text>
                                </Button>
                        </View>
            </Container>
            )
        }



}

export default connect(mapStateToProps)(Scoreboard);