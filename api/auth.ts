import axiosInstance from "@/api/axios";
import { getSecureStore } from "@/utils/secureStore";

type RequestUser = {
    email: string;
    password: string;
}

async function postsSignUp(body: RequestUser) {
    const { data } = await axiosInstance.post("/auth/signup", body);
    return data;
}

async function postsLogin(body: RequestUser): Promise<{ accessToken: string }> {
    const { data } = await axiosInstance.post("auth/login", body);
    return data;
}

async function getUserInfo() {
    const accessToken = await getSecureStore("accessToken");
    const { data } = await axiosInstance.get("auth/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
}

export { getUserInfo, postsLogin, postsSignUp };

