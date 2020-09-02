import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { clientId } from '../../config/config';
import { useDispatch } from 'react-redux';
import * as fromTYPES from '../../redux/types';
import { useHistory } from 'react-router-dom';
import { googleLogin } from '../../redux/actions/userActions';

export const GoogleButton = () => {

    const dispatch = useDispatch();

    const history = useHistory();

    const onGoogleLoginsSuccess = ({ tokenId }) => {
        dispatch(googleLogin(tokenId, history));
    }
    const onFailure = (res) => {
        dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: "It's seems there is an error" });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText={'Login with google'}
                onSuccess={onGoogleLoginsSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                autoLoad={false}
                style={{ marginTop: '15px', width: '100% !important', height: '40px', backgroundColor: '#b43a1c' }}
                render={renderProps =>
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="google_btn">
                        Login in with Google
                    </button>}
                type="button"
            />

        </div>
    )
}
