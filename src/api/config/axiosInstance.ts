import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.123.100:3030",
});

