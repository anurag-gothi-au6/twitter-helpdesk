import axios from "axios";
import { createHashHistory } from 'history' // or createBrowserHistory
import { apiUrl } from "../shared/vars";

const history = createHashHistory()


const ApiErrorCode = {
  INVALID_SHAPE: "INVALID_SHAPE",
  NOT_FOUND: "NOT_FOUND",
  EXISTS: "EXISTS",
  INVALID_AUTH: "INVALID_AUTH",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR"
};

// API CONFIGURATION

const API_URL = apiUrl;

class CustomApiClient {
  axiosObject;

  constructor() {
    this.axiosObject = axios.create({
      baseURL: API_URL,
      timeout: 15000
    });
  }

  async get(url) {
    const token = window.localStorage.getItem("rp_token");
    try {
      const r = await this.axiosObject.get(url,{
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token
        }
      });
      if(r.data.error){
        localStorage.removeItem('user')
        localStorage.removeItem('rp_token')
        history.push('/login')
        return
      }
      console.log(r.data)

      console.log(`%c[${r.status}] <--`, "color: green", r.data);

      return r.data;
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  async post(url, data = {}) {
    const token = window.localStorage.getItem("rp_token");
    try {
      console.log(token)
      console.log(`%c[POST] -->`, "color: blue", { url, data });
      console.log(data)
      const resp = await this.axiosObject.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token
        }
        //withCredentials: true
      });
      if(resp.data.error){
        localStorage.removeItem('user')
        localStorage.removeItem('rp_token')
        history.push('/login')
        return
      }
      console.log('resp header',resp)
      console.log(`%c[${resp.status}] <--`, "color: green", resp);

      return resp;
    } catch (err) {
      console.error(err);

      const { status, data: errorData } = err.response;

      if (
        status === 400 &&
        errorData.errorCode === ApiErrorCode.VALIDATION_ERROR
      ) {
        console.log("returning", err.response);

        return {
          s: false,
          errorCode: errorData.errorCode,
          message: errorData.message.message
        };
      }
      throw new Error(err)
    }
  }
}

export default new CustomApiClient();
