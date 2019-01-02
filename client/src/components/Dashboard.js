import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Dashboard extends Component {

    async componentDidMount() {
        await this.props.getSecret();
    }

    render() {
        return (
            <div>
                Dashboard page
                Our secret: <h3>{ this.props.secret }</h3>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        secret: state.dash.secret
    }
}

export default connect(mapStateToProps, actions)(Dashboard);