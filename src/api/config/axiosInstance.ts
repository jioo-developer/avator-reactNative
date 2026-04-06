import { deleteSecureStore, getSecureStore } from "@/utils/secureStore";
import axios from "axios";
import { router } from "expo-router";

const axiosInstance = axios.create({
    baseURL: "http://192.168.35.118:3030",
});

/**
 * 인터셉터에서 `/auth`로 replace할 때 루프를 막기 위해,
 * 루트 레이아웃이 expo-router pathname을 여기에 맞춘다.
 */
let currentPathname = "";

export function setCurrentPathname(path: string): void {
    currentPathname = path;
}

// 중복 handleUnauthorized 호출 방지 플래그
let isHandlingUnauthorized = false;

/**
 * Base64URL → Base64 변환 후 디코딩
 * JWT payload 파싱에 사용
 */
function base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    if (typeof atob === "function") return atob(padded);
    return Buffer.from(padded, "base64").toString("utf8");
}

/**
 * JWT 토큰의 만료 시각(ms)을 반환
 * JWT 형식이 아니거나 exp 필드가 없으면 null 반환
 */
function getJwtExpMs(token: string): number | null {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson) as { exp?: number };
        if (typeof payload.exp !== "number") return null;
        return payload.exp * 1000; // Unix timestamp(초) → ms 변환
    } catch {
        return null;
    }
}

/**
 * 인증 만료 처리
 * - 저장된 토큰 및 Authorization 헤더 삭제
 * - /auth 화면으로 강제 이동
 * - 토큰 삭제 실패 여부와 무관하게 라우팅은 반드시 실행
 */
async function handleUnauthorized(): Promise<void> {
    if (isHandlingUnauthorized) return;
    isHandlingUnauthorized = true;
    try {
        delete axiosInstance.defaults.headers.common.Authorization;
        await deleteSecureStore("accessToken");
    } catch {
        // 토큰 삭제 실패해도 인증 화면으로는 반드시 이동
    } finally {
        // 이미 /auth 계열 화면이면 replace로 스택/쿼리가 다시 돌면서 401 루프가 날 수 있음
        if (currentPathname !== "/auth" && !currentPathname.startsWith("/auth/")) {
            router.replace("/auth");
        }
        isHandlingUnauthorized = false;
    }
}

/**
 * 요청 인터셉터
 * - Authorization 헤더가 없는 요청에 한해 accessToken을 자동으로 주입
 * - 토큰이 JWT이고 exp 기준으로 이미 만료된 경우, 요청을 보내지 않고 인증 플로우로 이동
 */
axiosInstance.interceptors.request.use(async (config) => {
    const headers = config.headers as Record<string, unknown>;
    const hasAuthHeader = Boolean(headers.Authorization) || Boolean(headers.authorization);

    if (!hasAuthHeader) {
        const accessToken = await getSecureStore("accessToken");
        if (accessToken) {
            const expMs = getJwtExpMs(accessToken);

            // 만료 시각이 확인되고, 현재 시각보다 이전이면 만료로 판단
            if (typeof expMs === "number" && expMs <= Date.now()) {
                await handleUnauthorized();
                return Promise.reject(new Error("Unauthorized: accessToken expired"));
            }

            config.headers.set("Authorization", `Bearer ${accessToken}`);
        }
    }

    return config;
});

/**
 * 응답 인터셉터
 * - 서버에서 401을 반환한 경우 인증 만료로 처리
 * - 로그인/회원가입 엔드포인트의 401은 제외 (자격증명 오류이므로 강제 이동 불필요)
 */
axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status: number | undefined = error?.response?.status;
        const url: string | undefined = error?.config?.url;

        // 로그인·회원가입 요청의 401은 인증 만료가 아닌 자격증명 오류이므로 제외
        const isAuthEndpoint =
            typeof url === "string" &&
            (url.startsWith("/auth/signin") || url.startsWith("/auth/signup"));

        if (status === 401 && !isAuthEndpoint) {
            await handleUnauthorized();
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;