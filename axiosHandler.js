// axiosHandler.js
import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = 'live_CdfYUk5OZFFCG9I3eDKEc3Wnr6LOv21HIJHgznTXWvIToKYbE8zoRpBygRUbEjKY';

axios.interceptors.request.use(config => {
  document.body.style.cursor = 'progress';
  document.getElementById('progressBar').style.width = '0%'; // Reset progress bar
  console.log('Request started');
  return config;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  document.body.style.cursor = 'default';
  document.getElementById('progressBar').style.width = '100%'; // Set progress bar to 100% on response
  console.log('Request finished');
  return response;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

export default axios;

  
  