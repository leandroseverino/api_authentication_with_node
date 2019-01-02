import React, { Component } from 'react';
import { connect } from 'react-redux';


export default (OriginalComponent) => {
    class MixedComponent extends Component {

        checkAuthenticated() {
            if (!this.props.isAuth && !this.props.jwtToken) {
                console.log('User is not authenticated !');
                this.props.history.push('/');
            } 
        }

        componentDidMount() {
            this.checkAuthenticated();
        }

        componentDidUpdate() {
            this.checkAuthenticated(); 
        }

        render() {
            return <OriginalComponent {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {
            isAuth: state.auth.isAuthenticated,
            jwtToken: state.auth.token
        }
    }

    return connect(mapStateToProps)(MixedComponent);
};