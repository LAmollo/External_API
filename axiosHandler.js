// axiosHandler.js

axios.interceptors.request.use(config => {
    console.log('Request started', config);
    document.body.style.cursor = 'progress'; // Set cursor to progress
    return config;
  }, error => {
    console.error('Request error', error);
    return Promise.reject(error);
  });
  
  