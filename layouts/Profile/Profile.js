import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Button as ButtonR } from 'react-native';
import { Text, Container } from 'native-base';
import FeedNavbar from '../../components/FeedNavbar'
import { Action } from 'react-native-router-flux'
import { logoutUser } from '../../redux/reducers/users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';



const mapStateToProps = state => ({
    user: state.user,
    p1: state.p1,
    p2: state.p2
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logoutUser }, dispatch)
}

class Profile extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <Container>
                    <Text>
                        This is the profile view
                    </Text>
            </Container>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);