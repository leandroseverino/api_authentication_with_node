import React, { Component } from 'react';
import { reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import CustomInput from './CustomInput';
import * as actions from '../actions';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    async onSubmit(formData) {
        await this.props.signUp(formData);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }
    
    async responseGoogle(res) {

        await this.props.oauthGoogle(res.accessToken);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }

    async responseFacebook(res) {
        console.log('res do facebook', res);
        
        await this.props.oauthFacebook(res.accessToken);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }

    render() {

        const { handleSubmit } = this.props;

        return (
            <div className="row">
                <div className="col">
                    <form onSubmit={ handleSubmit( this.onSubmit ) }>
                        <fieldset>
                            <Field 
                                name="email"
                                type="text"
                                id="email"
                                label="Enter your email"
                                placeholder="example@example.com"
                                component={ CustomInput } />
                        </fieldset>
                        <fieldset>
                            <Field 
                                name="password"
                                type="password"
                                placeholder="put your password"
                                label="Enter your password"
                                id="password"
                                component={ CustomInput } />
                        </fieldset>

                        { 
                            this.props.errorMessage ? 
                            <div className="alert alert-danger"> { this.props.errorMessage } </div> 
                            : 
                            null 
                        }

                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
                <div className="col">
                    <div className="text-center">
                        <div className="alert alert-primary">
                            Or Sign Up using third-party services.
                        </div>
                        <FacebookLogin 
                            appId="568805240211657"
                            textButton="Facebook"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn btn-outline-primary"
                        />
                        <GoogleLogin
                            clientId="232024416450-k91ij4gcs1t5src7jjoejfd7fq0ls18p.apps.googleusercontent.com"
                            buttonText="Google"
                            className="btn btn-outline-danger"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        errorMessage: state.auth.errorMessage
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup'})
)(SignUp)