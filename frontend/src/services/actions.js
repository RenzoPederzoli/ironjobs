import axios from 'axios';
import io from "socket.io-client";

let baseURL;

process.env.NODE_ENV === 'production'
  ? (baseURL = 'window.location.origin')
  : (baseURL = 'http://localhost:5000');

const service = axios.create({ withCredentials: true, baseURL });

var socket = io.connect(baseURL)


const actions = {
  isLoggedIn: async () => {
    return await service.get('/is-logged-in')
  },
  signUp: async (user) => {
    return await service.post('/signup', user)
  },
  logIn: async (user) => {
    return await service.post('/login', user)
  },
  logOut: async () => {
    return await service.get('/logout')
  },
  // getLinkedinJobs: async (location, searchTerm) => {
  //   return await service.get(`/search-results/${location}/${searchTerm}`)
  // },
  getLinkedinJobs: async (location,searchTerm)=>{
    socket.emit('get data', {location, searchTerm})
    socket.on('recieve data', (data=>{
      console.log('data recieved', data)
      return data
    }))
  }
};
export default actions;