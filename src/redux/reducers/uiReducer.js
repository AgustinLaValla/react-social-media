import * as fromTYPES from '../types';

const initialState = {
    loading: false,
    activateLinearProgress: false,
    openErrorsDialog: false,
    openEditUserDetailsDialog:false,
    openChatModal: false
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

        case fromTYPES.ACTIVATE_LINEAR_PROGRESS:
            return {
                ...state,
                activateLinearProgress: true
            }

        case fromTYPES.DEACTIVATE_LINEAR_PROGRESS:
            return {
                ...state,
                activateLinearProgress: false
            };

        case fromTYPES.OPEN_USER_DETAILS_DIALOG:
            return {
                ...state,
                openEditUserDetailsDialog: action.payload
            }

        case fromTYPES.OPEN_CHAT_MODAL:
            return {
                ...state,
                openChatModal: action.payload
            }

        default:
            return state;
    }
}