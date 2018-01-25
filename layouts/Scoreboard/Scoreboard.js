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
import { View, ScrollView, ActivityIndicator, Button as ButtonR } from 'react-native';
import TextField from '../../components/TextField';
import styles from './styles';
import FeedNavbar from '../../components/FeedNavbar'
import { NBA_API_KEY } from 'react-native-dotenv'
import { Actions } from 'react-native-router-flux'
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import Images from './img/index';

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
            return fetch(`https://api.fantasydata.net/v3/nba/scores/JSON/GamesByDate/${this.state.gameDate}`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': NBA_API_KEY,
                }
            })
                .then((res) => {
                    let data = res._bodyInit;
                  console.log(JSON.parse(data))
                  return cleanGameData = JSON.parse(data)
                })
                .then((cleanGameData) => gamesList = cleanGameData.map(game => {
                    return {
                        id: game.GameID,
                        awayTeamID: game.AwayTeamID,
                        awayTeamScore: game.AwayTeamScore,
                        awayTeam: game.AwayTeam,
                        homeTeamID: game.HomeTeamID,
                        homeTeamScore: game.HomeTeamScore,
                        homeTeam: game.HomeTeam,
                        overAndUnder: game.OverUnder,
                        isFinished: game.IsClosed,
                        gameDateTime: game.DateTime
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
            yesterday = yesterday.toISOString().substring(0, 10);
            console.log(yesterday);
            this.setState({
                gameDate: yesterday
            }, () => {this.loadGames()})
        }
    goForwardADay() {
        var currentDateSelected = this.state.longGameDate;
        var tomorrow = new Date(currentDateSelected.setDate(currentDateSelected.getDate() + 1));
        tomorrow = tomorrow.toISOString().substring(0, 10);
        console.log(tomorrow);
        this.setState({
            gameDate: tomorrow
        }, () => { this.loadGames() })
    }

        componentDidMount(){
            var longToday = new Date();
            var today = longToday.toISOString().substring(0, 10);
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
            return (
                <Container >
                    <FeedNavbar logout={this.props.logoutUser} />
                    <Text style={{ alignSelf: 'center', fontSize: 18}}>{this.state.gameDate}</Text>
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
                                                    <Text style={styles.gameInfoText}>{game.awayTeam} vs. {game.homeTeam}</Text>
                                                    <Text style={styles.gameInfoText}>Final: {game.awayTeamScore} - {game.homeTeamScore}</Text>
                                                    </Body>
                                                 </CardItem>
                                            <CardItem style={styles.scoreBoard}>
                                                <Text style={styles.gameInfoText}>O/U: {game.overAndUnder}</Text>
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