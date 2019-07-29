import React, { Component } from 'react';
import {Router} from 'react-native-router-flux';
import {Provider} from 'react-redux';
import PropTypes from 'prop-types';
import scenes from '../routes/scenes';
// import scenesDriver from '../routes/scenesDriver';

export default class AppContainer extends Component{
    static propTypes = {
        store: PropTypes.object.isRequired
    }

    render(){
        return(
            <Provider store={this.props.store}>
            <Router scenes={scenes} />
            </Provider>
        );
    }
}
