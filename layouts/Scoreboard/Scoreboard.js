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
import { View, ScrollView, ActivityIndicator, Button as ButtonR, WebView, ImageBackground, TouchableHighlight } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY, MSF_AUTH } from 'react-native-dotenv'
import { Actions } from 'react-native-router-flux'
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import Images from '../img/index';
import background from '../../assets/floorBkgrnd.jpg'
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
                longGameDate: '',
                shortDate: ''
            }

        }
        loadGames() {
            var input = MSF_AUTH;
            console.log("HERE'S the input", input);

            return fetch(`https://api.mysportsfeeds.com/v1.2/pull/nba/2018-playoff/scoreboard.json?fordate=${this.state.gameDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${MSF_AUTH}`
                }
            })
                .then((res) => {
                    let data = res._bodyInit;
                 console.log(JSON.parse(data));
                  return cleanGameData = JSON.parse(data)
                })
                .then((cleanGameData) => gamesList = cleanGameData["scoreboard"].gameScore.map(game => {
                   
                    return {
                        awayTeam: game.game.awayTeam.Abbreviation,
                        awayTeamScore: game.awayScore,
                        awayTeamCity: game.game.awayTeam.City,
                        awayTeamID: game.game.awayTeam.ID,
                        awayTeamName: game.game.awayTeam.Name,
                        homeTeam: game.game.homeTeam.Abbreviation,
                        homeTeamCity: game.game.homeTeam.City,
                        homeTeamID: game.game.homeTeam.ID,
                        homeTeamName: game.game.homeTeam.Name,
                        homeTeamScore: game.homeScore,
                        gameCompleted: game.isCompleted,
                        gameInProgress: game.isInProgress,
                        gameIsUnplayed: game.isUnplayed,
                        gameID: game.ID,
                        gameDate: this.state.gameDate,
                        gameLocation: game.game.location,
                        gameStartTime: game.game.time
                    }
                }))
                .then((gamesList) => this.setState({
                    games: gamesList
                },
                console.log("Here's the games List: ", gamesList))) 
            .catch((err) => {console.log("error", err)})
        }

        goBackADay(){
            var currentDateSelected = this.state.longGameDate;
            var yesterday = new Date(currentDateSelected.setDate(currentDateSelected.getDate() - 1));
            var shortYestrday = yesterday.toLocaleString('zu-ZA').slice(0, 10);
            yesterday = yesterday.toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');
            console.log(yesterday);
            this.setState({
                gameDate: yesterday,
                shortDate: shortYestrday
            }, () => {this.loadGames()})
        }
    goForwardADay() {
        var currentDateSelected = this.state.longGameDate;
        var tomorrow = new Date(currentDateSelected.setDate(currentDateSelected.getDate() + 1));
        var shortTomrrow = tomorrow.toLocaleString('zu-ZA').slice(0, 10);
        tomorrow = tomorrow.toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');
        console.log(tomorrow);
        this.setState({
            gameDate: tomorrow,
            shortDate: shortTomrrow
        }, () => { this.loadGames() })
    }

        componentWillMount(){
            var today = new Date().toLocaleString('zu-ZA').slice(0, 10).replace(/-/g, '');
            var shortToday = new Date().toLocaleString('zu-ZA').slice(0, 10);
            var longToday = new Date();
            // var today = longToday.toISOString().substring(0, 10);
            console.log(today);
            this.setState({
                gameDate: today,
                longGameDate: longToday,
                shortDate: shortToday
            }, () => {
                this.loadGames()
            })
            // this.loadGames()
        }
        render(){
            console.log("HERE ARE THE GAMES: ", this.state.games)

            return (
                <ImageBackground source={background} style={{
                    width: 425,
                    height: 800
                }}>
                <Container>
                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingTop: 10}}>
                            <Button onPress={this.goBackADay.bind(this)} style={{ backgroundColor: 'transparent' }}>
                                    <Icon name="ios-arrow-dropleft" />
                                </Button>
                    <Text style={{ alignSelf: 'center', fontSize: 18, paddingTop: 20}}>{this.state.shortDate}</Text>
                                <Button onPress={this.goForwardADay.bind(this)} style={{backgroundColor: 'transparent'}}>
                                    <Icon name="ios-arrow-dropright" />
                                </Button>
                        </View>
                        <ScrollView contentContainerStyle={{flex: 0, height: '100%'}}>
                    <Container style={{ flex: 1, justifyContent: 'space-around'  ,flexDirection: 'row', flexWrap: 'wrap' }}>
                        {/* TODO: input field for game Date or calendar button */}
                            { this.state.games.map((game, i) => {
                                let gameCompleted = game.gameCompleted
                                let awayTeamImage = game.awayTeam
                                let homeTeamImage = game.homeTeam
                                return (
                                    <TouchableHighlight key={i} style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', margin: 10, width: 150, height: 175, borderRadius: 10 }} onPress={() => Actions.boxscore({ gameInfo: this.state.games[i] })}> 
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
                                            </CardItem>
                                        </Card>
                                        </TouchableHighlight>
                                
                                )
                                i++;
                            })}
                </Container>
                        </ScrollView>
            </Container>
            </ImageBackground>
            )
        }



}

export default connect(mapStateToProps)(Scoreboard);