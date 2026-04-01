import axiosInstance from "@/api/config/axios";

function setHeader(key: string, value: string) {
    axiosInstance.defaults.headers.common[key] = value;
}

function removeHeader(key: string) {
    if (axiosInstance.defaults.headers.common[key]) {
        delete axiosInstance.defaults.headers.common[key];
    }
}

export { removeHeader, setHeader };

