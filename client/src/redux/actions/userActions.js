import { TOGGLE_AUTH_STATE, UPDATE_USER, HELPDESK_USER } from '../actionTypes'


export const changeLoginState = (boolean, user = null, jwt = "") => {
    console.log(boolean)

    return {
        type: TOGGLE_AUTH_STATE,
        payload: { boolean, user, jwt }
    }

}

export const updateUser = (user) => {
    console.log(user)
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export const helpdeskUser = (user) => {
    return {
        type: HELPDESK_USER,
        payload: user
    }
}