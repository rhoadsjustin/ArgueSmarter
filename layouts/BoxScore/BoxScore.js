import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Button as ButtonR, ImageBackground } from 'react-native';
import { Text, Container, Header, Thumbnail, Content, Card, CardItem, Body, Left, Right, Button, Icon, Image, List, ListItem, Tab, Tabs } from 'native-base';
import FeedNavbar from '../../components/FeedNavbar'
import { Action } from 'react-native-router-flux'
import { logoutUser, currentUserInfo } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import images from '../img/index';
import background from '../../assets/bball.jpg'
import base64 from 'base-64';
import { MSF_AUTH } from 'react-native-dotenv'
import TeamStats from '../../components/TeamStats'

const mapStateToProps = state => ({
    user: state.user,
    p1: state.p1,
    p2: state.p2
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logoutUser, currentUserInfo }, dispatch)
}

class BoxScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playersObj: {}, 
            loading: true
        }
    }
    getGameBoxScore() {
        // concatenate for game identifier
        var gameDate = this.props.gameInfo.gameDate;
        var awayTeam = this.props.gameInfo.awayTeam;
        var homeTeam = this.props.gameInfo.homeTeam;

        var gameIdentifier = gameDate + '-' + awayTeam + "-" + homeTeam;
        
        var input = MSF_AUTH;
        console.log("HERE'S the input", input);
        return fetch(`https://api.mysportsfeeds.com/v1.2/pull/nba/2018-playoff/game_boxscore.json?gameid=${gameIdentifier}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${MSF_AUTH}`
            }
        })
        .then((res) => {
            let data = res._bodyInit
            // console.log(JSON.parse(data))
            return cleanGameData = JSON.parse(data)
        })
        .then((cleanGameData) => {
            // console.log("Here's the awayTeamsPlayer Array", cleanGameData.gameboxscore.awayTeam.awayPlayers.playerEntry)
            let awayTeamPlayerArray = cleanGameData.gameboxscore.awayTeam.awayPlayers.playerEntry;
            let cleanAwayPlayersList = awayTeamPlayerArray.map(player => {
                // console.log('Heres each player object: ', player)
                return {
                    name: player.player.FirstName + ' ' + player.player.LastName,
                    playerID: player.player.ID,
                    position: player.player.Position,
                    assists: player.stats.Ast['#text'],
                    blocks: player.stats.Blk['#text'],
                    dreb: player.stats.DefReb['#text'],
                    oreb: player.stats.OffReb['#text'],
                    reb: player.stats.Reb['#text'],
                    stl: player.stats.Stl['#text'],
                    to: player.stats.Tov['#text'],
                    FGA2: player.stats.Fg2PtAtt['#text'],
                    FGM2: player.stats.Fg2PtMade['#text'],
                    FG2PCT: player.stats.Fg2PtPct['#text'], 
                    FGA3: player.stats.Fg3PtAtt['#text'],
                    FGM3: player.stats.Fg3PtMade['#text'],
                    FG3PCT: player.stats.Fg3PtPct['#text'],
                    FGA: player.stats.FgAtt['#text'],
                    FGM: player.stats.FgMade['#text'],
                    FGPCT: player.stats.FgPct['#text'],
                    FTA: player.stats.FtAtt['#text'],
                    FTM: player.stats.FtMade['#text'],
                    FTPCT: player.stats.FtPct['#text'],
                    MIN: player.stats.MinSeconds['#text'],
                    PTS: player.stats.Pts['#text'],
                    plusMinus: player.stats.PlusMinus['#text'],
                }
            })
            this.setState({
                awayPlayers: cleanAwayPlayersList
            })
        })
        .then(() => {
            let homeTeamPlayerArray = cleanGameData.gameboxscore.homeTeam.homePlayers.playerEntry;
            let cleanHomePlayersList = homeTeamPlayerArray.map((player, i) => {
                // console.log('Heres each player object: ', player)
                return {
                    name: player.player.FirstName + ' ' + player.player.LastName,
                    playerID: player.player.ID,
                    position: player.player.Position,
                    assists: player.stats.Ast['#text'],
                    blocks: player.stats.Blk['#text'],
                    dreb: player.stats.DefReb['#text'],
                    oreb: player.stats.OffReb['#text'],
                    reb: player.stats.Reb['#text'],
                    stl: player.stats.Stl['#text'],
                    to: player.stats.Tov['#text'],
                    FGA2: player.stats.Fg2PtAtt['#text'],
                    FGM2: player.stats.Fg2PtMade['#text'],
                    FG2PCT: player.stats.Fg2PtPct['#text'],
                    FGA3: player.stats.Fg3PtAtt['#text'],
                    FGM3: player.stats.Fg3PtMade['#text'],
                    FG3PCT: player.stats.Fg3PtPct['#text'],
                    FGA: player.stats.FgAtt['#text'],
                    FGM: player.stats.FgMade['#text'],
                    FGPCT: player.stats.FgPct['#text'],
                    FTA: player.stats.FtAtt['#text'],
                    FTM: player.stats.FtMade['#text'],
                    FTPCT: player.stats.FtPct['#text'],
                    MIN: player.stats.MinSeconds['#text'],
                    PTS: player.stats.Pts['#text'],
                    plusMinus: player.stats.PlusMinus['#text']
                }
            })
            return cleanHomePlayersList;
        })
        .then((cleanHomePlayersList) => {
            this.setState({
                homePlayers: cleanHomePlayersList,
                loading: false
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    componentDidMount(){
        this.getGameBoxScore();
    }
    render() {
        const favTeam = this.props.user.favTeam;
        const awayTeam = this.props.gameInfo.awayTeam;
        const homeTeam = this.props.gameInfo.homeTeam;

        const awayTeamStats = !this.state.loading ? this.state.awayPlayers.map((player, i) => {
            return (
                <ListItem avatar key={i} style={{ flexDirection: 'column', alignContent: 'center' }}>
                    <Text>{player.name}</Text>
                    <Body style={{ flexDirection: 'row' }}>
                        <Text note>PTS: {player.PTS}</Text>
                        <Text note>REB: {player.reb}</Text>
                        <Text note>AST: {player.assists}</Text>
                        <Text note>STL: {player.stl}</Text>
                        <Text note>FG% {player.FGPCT}</Text>

                    </Body>

                </ListItem>
            )
            i++;
        }) :
            <Text>Loading</Text>;
        
        const homeTeamStats = !this.state.loading ? this.state.homePlayers.map((player, i) => {
            i++;
            return (
                <ListItem avatar key={i} style={{ flexDirection: 'column', alignContent: 'center' }}>
                    <Text>{player.name}</Text>
                    <Body style={{ flexDirection: 'row' }}>
                        <Text note>PTS: {player.PTS}</Text>
                        <Text note>REB: {player.reb}</Text>
                        <Text note>AST: {player.assists}</Text>
                        <Text note>STL: {player.stl}</Text>
                        <Text note>FG% {player.FGPCT}</Text>
                    </Body>


                </ListItem>
            )
        }) :
            <Text>Loading</Text>
        return (
            <ImageBackground source={background} style={{
                width: 425,
                height: 800}}>
               <Header hasTabs/>
                    <Content style={{ paddingTop: 50 }}>
                        <Card style={{ flex: 1 }}>
                            <CardItem>
                                <Left>
                                    <Thumbnail style={{ backgroundColor: 'grey'}} source={images[awayTeam]} />
                                </Left>
                                    <Body>
                                        <Text>{this.props.gameInfo.awayTeamName} vs. {this.props.gameInfo.homeTeamName}</Text>
                                        <Text style={{fontSize: 20}}> {this.props.gameInfo.awayTeamScore} - {this.props.gameInfo.homeTeamScore} </Text>
                                    </Body>
                                <Right>
                                    <Thumbnail style={{ backgroundColor: 'grey'}} source={images[homeTeam]} />
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold'}}>Team Stats</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                             
                            </CardItem>
                            <List>
                            <Tabs initialPage={1}>
                                <Tab heading={this.props.gameInfo.awayTeamName}>
                                    <Body style={{ flexDirection: 'row'}}>
                                    <Thumbnail source={images[this.props.gameInfo.awayTeam]} />
                                    <Text>{this.props.gameInfo.awayTeamName}</Text>
                                    </Body>
                                    {awayTeamStats}
                                </Tab>
                                <Tab heading={this.props.gameInfo.homeTeamName}>
                                    <Body style={{ flexDirection: 'row' }}>
                                        <Thumbnail source={images[this.props.gameInfo.homeTeam]} />
                                        <Text>{this.props.gameInfo.homeTeamName}</Text>
                                    </Body>
                                    {homeTeamStats}
                                </Tab>
                            </Tabs>
                            </List>
                        </Card>
                    </Content>
                
            </ImageBackground>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(BoxScore);