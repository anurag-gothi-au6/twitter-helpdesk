import { TOGGLE_AUTH_STATE, UPDATE_USER,HELPDESK_USER } from "../actionTypes";

const initialState = {
    isLoggedIn: false,
    jwt: "",
    user: null,
    helpdeskUser:null || JSON.parse(window.localStorage.getItem('user'))
};

const userReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TOGGLE_AUTH_STATE:
            console.log('in reducer',payload)
            if (payload.boolean) window.localStorage.setItem("rp_token", payload.jwt);
            return { ...state,user:payload.user,jwt:payload.jwt,isLoggedIn:payload.boolean}
        case UPDATE_USER:
            return {...state,user:payload}
        case HELPDESK_USER:
            window.localStorage.setItem("user",JSON.stringify(payload))
            window.localStorage.setItem("loggedInTime",String(new Date()))
            return {...state,helpdeskUser:payload}
        default:
            return { ...state };
    }
};

export default userReducer;
