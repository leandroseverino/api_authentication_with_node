import axios from 'axios';
import { AUTH_SIGN_UP, AUTH_ERROR, AUTH_SIGN_OUT } from './types';

export const oauthGoogle = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:5000/users/oauth/google', {
                access_token: data
            });
    
            dispatch({
                type: AUTH_SIGN_UP,
                payload: res.data.token
            });
    
            localStorage.setItem('JWT_TOKEN', res.data.token);    
        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
                payload: 'Email is alredy in use'
            });
        }
        
        
    }
}

export const oauthFacebook = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:5000/users/oauth/facebook', {
                access_token: data
            });
    
            dispatch({
                type: AUTH_SIGN_UP,
                payload: res.data.token
            });
    
            localStorage.setItem('JWT_TOKEN', res.data.token);    
        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
                payload: 'Email is alredy in use'
            });
        }
        
        
    };
}

export const signUp = data => {
    return async dispatch => {

        try {
            const res = await axios.post('http://localhost:5000/users/signup', data);
            console.log('response', res);

            dispatch({
                type: AUTH_SIGN_UP,
                payload: res.data.token
            });

            localStorage.setItem('JWT_TOKEN', res.data.token);

        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
                payload: 'Email is alredy in use'
            });
        }
    };
}

export const signOut = () => {
    return dispatch => {
        localStorage.removeItem('JWT_TOKEN');

        dispatch({
            type: AUTH_SIGN_OUT,
            payload: ''
        });
    };
}