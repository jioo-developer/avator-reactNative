import axiosInstance from "./config/axiosInstance";

async function getHats(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/hats");

  return data;
}

async function getFaces(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/faces");

  return data;
}

async function getTops(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/tops");

  return data;
}

async function getBottoms(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/bottoms");

  return data;
}

async function getHands(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/hands");

  return data;
}

async function getSkins(): Promise<string[]> {
  const { data } = await axiosInstance.get("/avatar/skins");

  return data;
}

export { getBottoms, getFaces, getHands, getHats, getSkins, getTops };

