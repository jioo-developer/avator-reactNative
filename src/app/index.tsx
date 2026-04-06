import useAuth from "@/hooks/queries/auth/useAuth";
import { Redirect } from "expo-router";

export default function Page() {
  const { auth, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    // 앱 시작 시 세션/토큰을 확인하는 동안에는 라우팅을 보류한다.
    // (여기서 Redirect를 해버리면 인증 결과에 따라 화면이 깜빡일 수 있음)
    return null;
  }

  if (!auth.id) {
    // 비로그인 상태면 인증 플로우로 보낸다.
    return <Redirect href="/auth" />;
  }

  // 로그인 상태면 보호된 탭 홈으로 보낸다.
  return <Redirect href="/(protected)/(tabs)/home" />;
}
