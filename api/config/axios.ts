import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.35.178:3030",
});

export default axiosInstance;
