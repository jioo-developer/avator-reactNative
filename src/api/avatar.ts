import type { AvatarItemState } from "@/types";
import axiosInstance from "./config/axiosInstance";

const TAB_LABELS = ["모자", "얼굴", "상의", "하의", "손", "피부"] as const;

const keys: (keyof AvatarItemState)[] = [
  "hatId",
  "faceId",
  "topId",
  "bottomId",
  "handId",
  "skinId",
];

// 아바타 파츠 목록 조회
async function getAvatarList(type: string): Promise<string[]> {
  const { data } = await axiosInstance.get<string[]>(`/avatar/${type}`);
  return data;
}

// 모자 파츠 ID 목록
async function getHats(): Promise<string[]> {
  return getAvatarList("hats");
}

// 얼굴 파츠 ID 목록
async function getFaces(): Promise<string[]> {
  return getAvatarList("faces");
}

// 상의 파츠 ID 목록
async function getTops(): Promise<string[]> {
  return getAvatarList("tops");
}

// 하의 파츠 ID 목록
async function getBottoms(): Promise<string[]> {
  return getAvatarList("bottoms");
}

// 손 파츠 ID 목록
async function getHands(): Promise<string[]> {
  return getAvatarList("hands");
}

// 스킨 파츠 ID 목록
async function getSkins(): Promise<string[]> {
  return getAvatarList("skins");
}

// ArrayBuffer를 Base64로 변환
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return globalThis.btoa(binary);
}

// 선택 파츠 조합 PNG 합성 미리보기 (POST /avatar/preview)
async function fetchAvatarPreviewDataUri(
  state: AvatarItemState,
  signal?: AbortSignal,
): Promise<string> {
  const body: Partial<AvatarItemState> = {};

  for (const key of keys) {
    const value = state[key]?.trim();
    if (value) body[key] = value;
  }

  const { data } = await axiosInstance.post<ArrayBuffer>(
    "/avatar/preview",
    body,
    {
      responseType: "arraybuffer",
      signal,
    },
  );
  const base64 = arrayBufferToBase64(data);
  return `data:image/png;base64,${base64}`;
}

export {
  fetchAvatarPreviewDataUri,
  getBottoms,
  getFaces,
  getHands,
  getHats,
  getSkins,
  getTops,
  TAB_LABELS
};

