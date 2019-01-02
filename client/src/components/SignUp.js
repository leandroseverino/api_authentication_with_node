import React, { Component } from 'react';
import { reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import CustomInput from './CustomInput';
import * as actions from '../actions';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(formData) {
        await this.props.signUp(formData);
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

                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
                <div className="col">
                    <div className="text-center">
                        <div className="alert alert-primary">
                            Or Sign Up using third-party services.
                        </div>
                        <button className="btn btn-primary">Facebook</button>
                        <button className="btn btn-danger">Google</button>
                    </div>
                </div>
            </div>
        );
    }
};

export default compose(
    connect(null, actions),
    reduxForm({ form: 'signup'})
)(SignUp)