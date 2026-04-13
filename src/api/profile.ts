import { Profile } from "@/types";
import axiosInstance from "./config/axiosInstance";

async function getProfile(id: number): Promise<Profile> {
    const { data } = await axiosInstance.get(`/auth/${id}`);
    return data;
}

async function editProfile(body: Partial<Profile>): Promise<Profile> {
    const { data } = await axiosInstance.patch("/auth/me", body);
    return data;
}

export { editProfile, getProfile };

