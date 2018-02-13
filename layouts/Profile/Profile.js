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



const mapStateToProps = state => ({
    user: state.user,
    p1: state.p1,
    p2: state.p2
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logoutUser, currentUserInfo }, dispatch)
}

class Profile extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount(){
        console.log(this.props.user);
    }
    render() {
        const favTeam = this.props.user.favTeam;
        return (
            <ImageBackground source={background} style={{
                width: 425,
                height: 800}}>
            <Container>
                <Content>
                <Card style={{ flex: 0, marginTop: 50 }}>
                            <CardItem style={{flexDirection: 'column'}}>
                                    <Text style={{ fontSize: 20, marginTop: 20, alignSelf: 'center'}}>ArgueSmarter Profile</Text>
                                <Left style={{flexDirection: 'row'}}>
                                    <Thumbnail source={{ uri: this.props.user.profilePicture.url }} style={{ width: 100, height: 100}}/>
                                    <Body>
                                        <Text style={{ fontSize: 16}}>Username: {this.props.user.name}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body style={{ alignItems: 'center'}}>
                                    <Thumbnail source={images["ATL"]} style={{ height: 200, width: 200, flex: 1 }} />
                                    <Text>
                                    Your Favorite Team: {favTeam}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                {/* things to add here later: arguments, favorite players, favorite teams upcoming games */}
                            </CardItem>
                        </Card>
                </Content>
            </Container>
            </ImageBackground>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);