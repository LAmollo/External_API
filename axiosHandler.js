// axiosHandler.js

axios.interceptors.request.use(config => {
    console.log('Request started', config);
    document.body.style.cursor = 'progress'; // Set cursor to progress
    return config;
  }, error => {
    console.error('Request error', error);
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => {
    console.log('Request successful', response);
    document.body.style.cursor = 'default'; // Set cursor to default
    return response;
  }, error => {
    console.error('Response error', error);
    document.body.style.cursor = 'default'; // Ensure cursor is reset
    return Promise.reject(error);
  });
  
  export default axios;
  
  