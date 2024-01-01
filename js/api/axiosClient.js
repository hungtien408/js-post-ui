import axios from 'axios';

const axiosClient = axios.create({
  baseUrl: 'https://js-post-api.herokuapp.com/api',
  header: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
