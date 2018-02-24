import React, { Component } from 'react';
import { ListItem, Body, Text, Right } from 'native-base';
import { View } from 'react-native';
class TeamStats extends Component {
    constructor(props){
        super(props)
    }
    render(){
        console.log("Here's the props at the team stats", this.props.players)

        return (
                <View>
                    {
                        this.props.players.map(player => {
                        return (
                        <ListItem avatar>
                            <Body>
                                <Text>{player.name}</Text>
                                <Text note>PTS: {player.PTS}</Text>
                                <Text note>REB: {player.reb}</Text>
                            </Body>
                            <Right>
                                <Text note>FG% {player.FGPCT}</Text>
                            </Right>
                        </ListItem>
                        )
                        })
                    }
                </View>
                )
}

}

export default TeamStats;