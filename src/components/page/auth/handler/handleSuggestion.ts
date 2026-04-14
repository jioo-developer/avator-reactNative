// 기본 이메일 도메인 리스트
const DEFAULT_DOMAINS = [
    "gmail.com",
    "naver.com",
    "daum.net",
    "hanmail.net",
    "kakao.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
] as const;

export default function handleSuggestion(value: string) {
    // value를 '@' 기준으로 분리 (localPart: 앞, domainPart: 뒤)
    const [localPart = "", domainPart = ""] = value.split("@");

    const domainQuery = domainPart.trim().toLowerCase(); // 도메인 입력값 정규화

    const hasAtSymbol = value.includes("@"); // '@' 포함 여부
    const hasLocalPart = localPart.length > 0; // 로컬 파트 존재 여부
    const hasOnlyOneDomainInput = !domainPart.includes("@"); // '@'가 하나만 있는지 체크

    // 사용자가 입력한 도메인이 목록에 있는 도메인과 "완전히 일치"하는지 확인
    // → 이미 완성된 상태라면 자동완성 추천을 보여줄 필요 X
    const isCompleteDomain =
        domainQuery.length > 0 &&
        DEFAULT_DOMAINS.some((domain) => domain.toLowerCase() === domainQuery);

    // 추천을 보여줄 수 있는 조건
    const canShowSuggestions =
        hasAtSymbol && // '@'가 있고
        hasLocalPart && // 앞부분도 있고
        hasOnlyOneDomainInput && // '@'가 하나만 있고
        !isCompleteDomain; // 이미 완성된 도메인이 아니어야 함

    // 추천 가능한 상태라면,
    // 입력 중인 도메인을 기준으로 prefix 매칭하여 자동완성 후보 생성
    const matchedDomains = canShowSuggestions
        ? DEFAULT_DOMAINS.filter((domain) => domain.startsWith(domainQuery))
        : [];

    // 최대 8개까지 추천 이메일 생성
    const suggestions = matchedDomains
        .slice(0, 8)
        .map((domain) => `${localPart}@${domain}`);

    return { suggestions }
}
