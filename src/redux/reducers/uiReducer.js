import * as fromTYPES from '../types';

const initialState = {
    loading: false,
    openErrorsDialog: false
}

export const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case fromTYPES.LOADING_UI:
            return {
                ...state,
                loading: action.payload
            };

        case fromTYPES.OPEN_ERRORS_DIALOG:
            return {
                ...state,
                openErrorsDialog: action.payload
            }

        default:
            return false;
    }
}