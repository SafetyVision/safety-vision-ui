import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;
axios.defaults.baseURL= window.location.origin;

export default axios
