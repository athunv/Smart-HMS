import axios from 'axios'


export const BASE_URLs = 'http://127.0.0.1:8000'

export const LoginApi =(data)=>{
    return axios.post(`${BASE_URLs}/login/`,data)
}