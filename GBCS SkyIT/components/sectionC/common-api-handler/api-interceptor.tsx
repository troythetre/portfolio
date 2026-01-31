import axios from 'axios';
import { BASEURL } from '../../../constants';

const axiosapihandler = axios.create({
  baseURL: `${BASEURL}`,
});

// Add a request interceptor
axiosapihandler.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('google_api_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Add a response interceptor
axiosapihandler.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //handleToken();

        const token = localStorage.getItem('google_api_token');

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        console.log('Error while refreshing the token: ', error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosapihandler;
