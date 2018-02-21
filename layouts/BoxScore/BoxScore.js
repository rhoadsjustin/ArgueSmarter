import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Button as ButtonR, ImageBackground } from 'react-native';
import { Text, Container, Thumbnail, Content, Card, CardItem, Body, Left, Right, Button, Icon, Image } from 'native-base';
import FeedNavbar from '../../components/FeedNavbar'
import { Action } from 'react-native-router-flux'
import { logoutUser, currentUserInfo } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import images from '../img/index';
import background from '../../assets/bball.jpg'
import base64 from 'base-64';
import { MSF_AUTH } from 'react-native-dotenv'


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

    }
    getGameBoxScore() {
        // concatenate for game identifier
        var gameDate = this.props.gameInfo.gameDate;
        var awayTeam = this.props.gameInfo.awayTeam;
        var homeTeam = this.props.gameInfo.homeTeam;

        var gameIdentifier = gameDate + '-' + awayTeam + "-" + homeTeam;
        
        var input = MSF_AUTH;
        console.log("HERE'S the input", input);
        var encodedData = base64.encode(input);
        console.log(encodedData)
        return fetch(`https://api.mysportsfeeds.com/v1.2/pull/nba/2017-2018-regular/game_boxscore.json?gameid=${gameIdentifier}&teamstats=W,L,PTS,PTSA&playerstats=2PA,2PM,3PA,3PM,FTA,FTM`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${MSF_AUTH}`
            }
        })
        .then((res) => {
            let data = res._bodyInit
            console.log(JSON.parse(data))
            // return cleanGameData = JSON.parse(data)
        })
    }
    componentDidMount(){
        console.log("THE GAME INFO SHOULD BE HERE: ", this.props);
        this.getGameBoxScore();
    }
    render() {
        const favTeam = this.props.user.favTeam;
        return (
            <ImageBackground source={background} style={{
                width: 425,
                height: 800}}>
                <Container>
                    
                    <Content style={{ paddingTop: 30 }}>
                        <Card style={{ flex: 1 }}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={images[this.props.gameInfo.awayTeam]} />
                                    <Body>
                                        <Text>{this.props.gameInfo.awayTeamName} vs. {this.props.gameInfo.homeTeamName}</Text>
                                        <Text>Location: {this.props.gameInfo.gameLocation} </Text>
                                    </Body>
                                </Left>
                                <Right>
                                    <Thumbnail source={images[this.props.gameInfo.homeTeam]} />
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text>
                                    {this.props.gameInfo.awayTeamName} vs. {this.props.gameInfo.homeTeamName}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Button transparent textStyle={{ color: '#87838B' }}>
                                        <Icon name="logo-github" />
                                        <Text>1,926 stars</Text>
                                    </Button>
                                </Left>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            </ImageBackground>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(BoxScore);