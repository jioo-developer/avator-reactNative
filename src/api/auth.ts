import axiosInstance from "@/api/config/axiosInstance";
import type { RequestLogin, RequestUser } from "@/types";
import { getSecureStore } from "@/utils/secureStore";


async function postsSignUp(body: RequestUser) {
    const { data } = await axiosInstance.post("/auth/signup", body);
    return data;
}

async function postsLogin(body: RequestLogin): Promise<{ accessToken: string }> {
    const { data } = await axiosInstance.post("/auth/signin", body);
    return data;
}

async function getUserInfo() {
    const accessToken = await getSecureStore("accessToken");
    const { data } = await axiosInstance.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
}

export { getUserInfo, postsLogin, postsSignUp };

