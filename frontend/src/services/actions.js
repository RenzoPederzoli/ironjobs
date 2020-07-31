import axios from 'axios';

let baseURL;

process.env.NODE_ENV === 'production'
  ? (baseURL = 'window.location.origin')
  : (baseURL = 'http://localhost:5000');

const service = axios.create({ withCredentials: true, baseURL });

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
  addJob: async (job) => {
    return await service.post(`/users/addjob`, job)
  },
  getLinkedinJobs: async (location, searchTerm) => {
    return await service.get(`/linkedin-results/${location}/${searchTerm}`)
  },
  getIndeedJobs: async (location, searchTerm) => {
    return await service.get(`/indeed-results/${location}/${searchTerm}`)
  }
  // getLinkedinJobs: async (location,searchTerm)=>{
  //   socket.emit('get data', {location, searchTerm})
  //   socket.on('recieve data', (data=>{
  //     console.log('data recieved', data)
  //     return data
  //   }))
  // },
  // socket:socket
};

export default actions;