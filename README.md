# Avatar Community

아바타 꾸미기와 커뮤니티 피드 기능을 결합한 모바일 소셜 앱입니다. 커스텀 아바타를 만들고, 게시글·댓글·좋아요로 다른 사용자와 소통할 수 있습니다.

## 기술 스택

| 구분             | 기술                                                   |
| ---------------- | ------------------------------------------------------ |
| **프레임워크**   | Expo SDK ~54, React Native 0.81                        |
| **언어**         | TypeScript (strict)                                    |
| **라우팅**       | Expo Router ~6 (파일 기반, `src/app/`)                 |
| **서버 상태**    | TanStack React Query v5                                |
| **HTTP**         | Axios (인터셉터 기반 JWT 자동 주입 및 401 처리)        |
| **폼**           | React Hook Form                                        |
| **저장소**       | expo-secure-store (액세스 토큰)                        |
| **UI / 애니메이션** | react-native-reanimated, @gorhom/bottom-sheet, react-native-gesture-handler |
| **미디어**       | expo-image, expo-image-picker, react-native-svg        |
| **기타 UI**      | react-native-toast-message, @expo/react-native-action-sheet, react-native-pager-view |
| **문서/UI 개발** | Storybook (온디바이스 + 웹)                            |
| **린트**         | ESLint (eslint-config-expo)                            |

## 프로젝트 구조

```
src/
├── app/                          # Expo Router 페이지
│   ├── index.tsx                 # 진입점 (로그인 여부에 따라 리다이렉트)
│   ├── auth/                     # 인증 화면 (진입, 로그인, 회원가입)
│   ├── storybook.tsx             # Storybook 라우트
│   └── (protected)/              # 인증 필요 화면 (AuthRoute 래핑)
│       ├── (tabs)/               # 탭 네비게이션
│       │   ├── home/             # 피드 (무한 스크롤, 검색)
│       │   ├── my/               # 내 프로필·게시글·좋아요
│       │   └── setting/          # 설정
│       ├── post/                 # 게시글 생성·수정
│       ├── detail/[id]/          # 게시글 상세·댓글·대댓글
│       └── profile/              # 프로필 조회·수정·아바타 편집
├── api/                          # API 함수
│   ├── config/
│   │   ├── axiosInstance.ts      # Axios 인스턴스 (인터셉터, JWT, 401 처리)
│   │   └── queryClient.ts        # React Query 클라이언트
│   ├── auth.ts                   # 회원가입, 로그인, 내 정보
│   ├── post.ts                   # 게시글 CRUD, 좋아요, 조회수, 이미지, 투표
│   ├── comment.ts                # 댓글 CRUD, 댓글 좋아요
│   ├── profile.ts                # 프로필 조회·수정
│   └── avatar.ts                 # 아바타 파츠 목록, 미리보기 합성
├── hooks/                        # React Query 훅
│   ├── queries/
│   │   ├── auth/                 # useAuth, useGetUserInfo
│   │   ├── post/                 # usePost, useComment, useViewCount
│   │   └── myPage/               # 무한 스크롤 게시글·좋아요, 아바타, 프로필
│   ├── avatar/                   # useAvatarController
│   ├── detail/                   # useDetailActions
│   └── reply/                    # useReplyController
├── components/                   # 공통 컴포넌트
│   ├── (공통 UI)                  # FeedItem, SearchBar, InputField, CommonButton 등
│   └── _pageComponents/          # 페이지별 전용 컴포넌트
├── types/
│   └── index.ts                  # User, Profile, Post, Comment, Vote, AvatarItemState 등
├── constants/                    # 색상, React Query 키 팩토리
└── utils/                        # secureStore, ApiHeader, 이미지 헬퍼, debounce
```

## 스크립트

| 명령어                      | 설명                                          |
| --------------------------- | --------------------------------------------- |
| `npm start`                 | LAN 모드로 Expo 개발 서버 실행 (Expo Go 지원) |
| `npm run android`           | Android 에뮬레이터/디바이스 실행              |
| `npm run ios`               | iOS 시뮬레이터/디바이스 실행                  |
| `npm run web`               | 웹 브라우저 실행                              |
| `npm run lint`              | ESLint 실행                                   |
| `npm run storybook`         | Storybook 온디바이스 모드 (Expo Go)           |
| `npm run storybook-web`     | Storybook 웹 개발 서버 (포트 6006)            |
| `npm run storybook-generate`| Storybook 스토리 파일 목록 자동 생성          |

---

## API 소통 방식

백엔드 REST API(`EXPO_PUBLIC_API_BASE_URL` 또는 기본 `http://<LAN-IP>:3030`)와 Axios로 통신합니다.

### 1. Axios 인스턴스 (`src/api/config/axiosInstance.ts`)

- **요청 인터셉터**: `Authorization` 헤더가 없을 때 `expo-secure-store`에서 액세스 토큰을 읽어 자동 주입합니다. JWT `exp` 필드로 만료 여부를 사전 체크하며, 만료된 토큰이면 요청을 보내지 않고 `/auth`로 이동합니다.
- **응답 인터셉터**: 서버가 `401`을 반환하면 토큰을 삭제하고 `/auth`로 강제 이동합니다. 로그인·회원가입 엔드포인트의 `401`은 자격증명 오류이므로 제외합니다.
- **호스트 추론**: `EXPO_PUBLIC_API_BASE_URL` 미설정 시 Expo의 `hostUri`에서 LAN IP를 추출해 `http://<LAN-IP>:3030`으로 연결합니다.

### 2. 인증 흐름

1. **회원가입**: `POST /auth/signup` → 완료 후 로그인 화면으로 이동.
2. **로그인**: `POST /auth/signin` → `accessToken` 수신 → `secure-store` 저장 + Axios 기본 헤더 설정 → `GET /auth/me`로 유저 정보 캐싱 → 홈 이동.
3. **로그아웃**: 토큰 및 헤더 삭제 → `/auth`로 이동.
4. **인증 보호**: `(protected)/_layout.tsx`의 `AuthRoute`가 미인증 사용자를 `/auth`로 리다이렉트.

### 3. 페이지별 useQuery / useMutation 사용 내역

| 페이지/기능 | 훅 | API | 메서드 | 비고 |
| ----------- | -- | --- | ------ | ---- |
| **홈 (피드)** | `useGetInfinitePosts` | `/posts`, `/posts/search` | GET | `useInfiniteQuery`, 검색어 유무에 따라 엔드포인트 분기 |
| | `useIncreasePostView` | `/posts/:id/view` | POST | 상세 진입 시 조회수 증가, `POST.LIST` invalidate |
| | `useTogglePostLike` | `/likes/:postId` | POST | 좋아요 토글, `DETAIL`·`LIST` invalidate |
| **게시글 작성** | `useCreatePost` | `/posts` | POST | 성공 시 홈으로 이동 + `POST.LIST` invalidate + Toast |
| | `useUploadImages` | `/images` | POST | `multipart/form-data` 이미지 업로드, URL 배열 반환 |
| | `useCreateVote` | `/posts/:postId/vote/:voteOptionId` | POST | 투표 선택 시 `POST.DETAIL` invalidate |
| **게시글 수정** | `useUpdatePost` | `/posts/:id` | PATCH | `DETAIL`·`LIST` invalidate 후 이전 화면 이동 |
| **게시글 삭제** | `useDeletePost` | `/posts/:id` | DELETE | `POST.LIST` invalidate |
| **게시글 상세** | `useGetPostSuspense` | `/posts/:id` | GET | `useSuspenseQuery`, `staleTime: 0`, 항상 재요청 |
| **댓글** | `useCreateComment` | `/comments` | POST | `COMMENT.LIST` invalidate |
| | `useUpdateComment` | `/comments/:id` | PATCH | |
| | `useDeleteComment` | `/comments/:id` | DELETE | |
| | `useToggleCommentLike` | `/comment-likes/:commentId` | POST | 댓글 좋아요 토글 |
| **인증** | `useSignup` | `/auth/signup` | POST | 성공 시 로그인 화면으로 이동 |
| | `useLogin` | `/auth/signin` | POST | 토큰 저장 + `GET /auth/me` 캐싱 + Toast |
| | `useGetUserInfo` | `/auth/me` | GET | `useSuspenseQuery` |
| **프로필** | `useGetUserProfile` | `/auth/:id` | GET | 타인 프로필 조회 |
| | `useUpdateProfile` | `/auth/me` | PATCH | 성공 시 `AUTH.ME` 캐시 갱신 + `POST.ALL` invalidate |
| **내 페이지** | `useGetInfiniteMyPosts` | `/posts?authorId=me` | GET | `useInfiniteQuery`, 내 게시글 무한 스크롤 |
| | `useGetInfiniteUserPosts` | `/posts?authorId=:id` | GET | `useInfiniteQuery`, 타인 게시글 무한 스크롤 |
| | `useGetInfiniteLikedPost` | `/likes` | GET | `useInfiniteQuery`, 좋아요한 게시글 무한 스크롤 |
| **아바타** | `useGetAvatarItems` | `/avatar/:type` (hats·faces·tops·bottoms·hands·skins) | GET | 파츠별 ID 목록 조회 |
| | `fetchAvatarPreviewDataUri` | `/avatar/preview` | POST | 선택 파츠 조합 PNG 합성 → `ArrayBuffer` → Base64 Data URI 변환 |

### 4. 아바타 합성 방식

아바타 미리보기는 서버에서 파츠를 합성한 PNG를 반환하는 방식입니다.

| 단계 | 내용 |
| ---- | ---- |
| **파츠 선택** | 모자·얼굴·상의·하의·손·피부 탭에서 각각 ID 선택 |
| **미리보기 요청** | 선택된 파츠 ID를 `POST /avatar/preview` body로 전송, `responseType: "arraybuffer"` |
| **렌더링** | `ArrayBuffer` → Base64 인코딩 → `data:image/png;base64,...` Data URI로 `<Image>` 렌더 |
| **저장** | 최종 선택 파츠 ID들을 `PATCH /auth/me` body에 포함해 프로필에 저장 |

### 5. 이미지 업로드

게시글 이미지는 `multipart/form-data`로 서버에 직접 업로드합니다.

1. `expo-image-picker`로 이미지 선택 (최대 다중 선택).
2. `FormData`에 파일 추가 후 `POST /images` 요청 (`Content-Type: multipart/form-data`).
3. 서버가 반환한 URL 배열을 게시글 생성/수정 body의 `images` 필드에 포함.

### 6. 흐름 요약

1. 앱 진입 → `index.tsx`에서 토큰 유무 확인 → 인증 화면 또는 홈 탭으로 분기
2. Axios 인터셉터가 매 요청에 Bearer 토큰 자동 주입 + 만료 사전 체크
3. 훅(`useQuery` / `useMutation`)이 API 함수를 호출하고 React Query가 캐싱·무효화 담당
4. 401 응답 → `handleUnauthorized`로 토큰 삭제 + `/auth` 이동
