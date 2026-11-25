# 별꾹 공개 웹 JavaScript 모듈 목록

2026년 11월 23일 KST에 [별꾹](https://starkkuk.com/)에서 확보한 REA 초기 요청 기록과 공개 소스를 기준으로 정리했다. **실행 관찰**은 표시되거나 실제 UI를 연 경우, **코드 확인**은 소스에서 찾은 경로, **요청 목록**은 브라우저가 파일 주소를 요청한 경우다. 로그인 이후 쓰기와 서버 내부 구현은 검증 범위에 포함되지 않는다.

## 기능별 주요 모듈

### 1. 전체 화면과 메뉴

- **관찰.** 첫 화면과 메뉴, 분양 패널, 계정 안내, 별빛·맞춤 3D 안내를 열었다. 초기 DOM에는 대화상자 33개가 있었고 장면·권한에 따라 일부는 숨겨졌다.
- **연결.** [hud-menu.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0e5af2d2eae1750b3f989600/hud-menu.js)의 `createHudMenu`는 상단·하단 기능 버튼을 메뉴 그룹에 배치한다. `tailstar:hud-menu-open/close` 이벤트와 버튼 자체 콜백을 사용한다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js)의 `openPanel → renderPanel`은 공통 패널의 내용을 바꾼다. 각각 16~19·33~89행, 2083~2199행.
- **데이터와 한계.** 메뉴 전용 API 호출은 이 경로에서 확인되지 않는다. 개별 메뉴가 자기 상태를 읽는다. 이벤트별 전체 가시성은 [화면 지도](Screen_Map.md)에서 판정을 분리했다.

### 2. 로그인·회원정보·프로필

- **관찰.** 계정 안내 화면을 열었고 첫 방문의 `GET /api/auth/me` 200을 관찰했다. 인증 자체는 실행하지 않았다.
- **연결.** [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 31~52·66~96·112~135행의 `accountReady`, `refreshAccount`, `requireAccount`, `accountHeaders`가 앱과 쓰기 UI의 계정 경계를 만든다. `tailstar-login-required`를 사용하고, 연결·탈퇴 대화상자 모듈을 import한다.
- **데이터와 한계.** 사용자 객체, 권한 플래그, 요청용 토큰의 사용이 코드에 있다. OAuth 상태, 서버 세션 수명, 계정 연결과 삭제 성공은 미확인이다.

### 3. 추모함 및 공간 배정

- **관찰.** 관·구역·빈자리 안내를 열었다. 첫 방문의 `GET /api/lockers` 2건을 관찰했다.
- **연결.** [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 22~75행의 `createAllocationPicker`는 `request`와 `onChoose`를 앱에서 받는다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 610·760~838·2629~2635행의 `allocationRequest`, `selectNiche`, `refreshLockers`, `claimLocker`가 조회, 진입, 저장을 연결한다. [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 8~94행이 목록과 지연 상세를 관리한다.
- **데이터와 한계.** 자리 가용성, 관별 요약, 개인 목록, 선택 상세, 버전과 할당 식별자. `/api/locker-availability`, `/api/lockers`, `/api/lockers/move`의 요청 코드가 있다. 중복 배정 방지와 권한 정책의 서버 구현은 미확인이다.

### 4. 반려동물 등록과 캐릭터

- **관찰.** 꾸미기 진입에서 계정 안내를 확인했고 최초 요청에서 아바타 관련 파일이 로딩됐다. 등록·저장은 미실행.
- **연결.** [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 45~56행과 [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 698~704·854~902·1827·2083행의 `readNiche`, `openPetCustomizer`, `createPet`가 추모함 프로필을 `pet-companions` 및 외형 편집기로 보낸다. 편집기는 동적 import다.
- **데이터와 한계.** 종·색·귀·무늬·크기, 외형 설정, 선택 모델 설명자. `/api/locker-pets` POST·PUT 코드 확인. 필드별 서버 검증은 미확인이다. [기존 캐릭터 보고서](../02_Character_System.md)

### 5. 3D 공간·카메라·조명·이동

- **관찰.** 첫 화면 3D 캔버스와 이동 UI 관찰. 각 관의 조명 전환과 충돌은 전수 실행하지 않았다.
- **연결.** [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 1186~1203·1921~2003·2253~2320·2535~2549행의 `setScene`, `animate`, 포인터·키 입력. [camera-rig.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4c30cab07bf2bd8a893903b3/camera-rig.js) 3~17행의 `createCameraRig`는 포즈와 거리 조절을 맡는다. 앱은 관별 builder, `world-movement`, 카메라 장애물 모듈을 함께 참조한다.
- **데이터와 한계.** 열린 장면과 좌표·방향, 카메라 설정은 브라우저에 있다. 원격 이동·방 상태는 접속 동기화 경로로 연결된다. 실기기 프레임 비용은 미측정이다.

### 6. 산책·쓰다듬기 등 상호작용

- **관찰.** 하단 버튼이 보였다. 자기 반려동물로 활동을 끝까지 실행한 자료는 없다.
- **연결.** [walk-together-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e45c858a27d4f28552bb4433/walk-together-entry.js) 6~22·59~83행의 `createWalkTogetherEntry`가 초대 대화상자 이벤트를 내보낸다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 430~460·2557·2657·2867행은 별도 동행 산책 주소, 쓰다듬기, 돌봄을 조율한다. [petting.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f2eb0aa75380bb5e2abcfe01/petting.js) 6·29~43·47~65행은 `createPetting`으로 포인터 접촉·회전과 화면 열기·닫기를 처리한다.
- **데이터와 한계.** 쓰다듬기 장면의 포인터 처리 자체에 독립 전송 요청은 확인되지 않았다. 돌봄·달리기에는 [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) 227~247행의 `POST /api/social` 경로가 있다. 조건과 서버 처리 결과는 미관찰이다.

### 7. 사진·추억 갤러리·편지·추모글

- **관찰.** 초기 추모 UI 레이블과 사진 관련 요소를 확인했다. 타인 상세 사진·편지·추모글은 읽거나 보관하지 않았다.
- **연결.** [memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) 10~22·31~76행의 `memorialRequest`와 `renderMemorial`은 기록·편지·방문 글과 사진 변경을 처리한다. 앱은 `onPhoto`, `onRecord`로 추모함 표시를 갱신한다. [niche-photo.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js) 8~49행의 `createNichePhotoUI`는 추모 공간을 촬영하고 기기에서 저장·공유하는 별도 경로다. [tribute-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5706ec2a3d8affa9b3887175/tribute-ui.js) 4~28행은 추모 기록과 카운터를 연결한다.
- **데이터와 한계.** `/api/memorial`, `/api/tributes` 코드 확인. ‘갤러리’는 프로필 사진·추모 기록 피드·공간 사진·광장 사진을 구분해 기록했다. 독립 통합 갤러리와 그 데이터 모델은 미확인이다.

### 8. 커뮤니티와 사용자 간 상호작용

- **관찰.** 광장·커뮤니티 메뉴와 일부 초기 GET, `POST /api/presence`를 관찰했다. 특정 이용자·글·사진을 수집하지 않았다.
- **연결.** [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) 35·68~74·128~205·266~272행의 `connectPresence`는 방·방문자·포즈를 조정한다. [presence-transport.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs) 4~33행의 `createPresenceTransport`는 HTTP와 선택적 소켓을 연결한다. [plaza-boards-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) 14·26~33·61~84행의 `createPlazaBoardsUI`가 광장 위치, 피드, 페이징과 편집기를 연결한다.
- **데이터와 한계.** `/api/presence`, `/api/social`, `/api/plaza-boards`, `/api/content-check`의 코드가 있다. 별친·별스토리·오늘의 별·조약돌·추억 메시지는 DOM·import 또는 초기 요청까지 확인한 경로가 섞여 있다. 공지·게시 정책 및 실시간 전송 성공은 미확인이다.

### 9. 맞춤 3D 신청·검수·적용

- **관찰.** 비로그인 신청 안내와 예시 항목을 확인했다. 개인정보 제출, 관리자 검수와 실제 모델 적용은 미관찰.
- **연결.** [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) 16~20·54~95·107~125행의 `createPetModelRequest`와 `tailstar:pet-model-open/close`. 신청 상태 문구·수정 모듈과 승인 모델을 받는 [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) 184~215행의 `buildPetAvatar`가 별개의 단계에서 동작한다.
- **데이터와 한계.** `/api/pet-models` 요청 선언, 신청 상태와 `userModel` 설명자 확인. 실제 승인 업데이트와 제작 파이프라인은 미확인이다. [제작·이용·가격](../03_Service_Flow_Pricing.md)

### 10. 후원·결제·기업 제휴 UI

- **관찰.** 웹 별빛 화면에서 별자리 등록과 이체 안내 확인. 결제·예약 연동·입장 인증은 미실행.
- **연결.** [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) 11~51행은 별빛 대화상자에 웹 이체 또는 앱용 `mountPlaySupport`를 붙인다. `tailstar:support-open/close`가 움직임을 정리한다. [petnight-customer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a4eeafe30447621e26141b4b/petnight-customer.js) 6~33행은 `openPetnightVerification`을 통해 계정 재조회와 조건부 입장을 연결한다.
- **데이터와 한계.** 앱 상품·구매 상태, 계좌 입금 확인, 펫나잇 입장 코드의 클라이언트 경로가 있다. 상품가·후원 계약·실결제는 별도 증거가 필요한 영역이다. [제작·이용·가격](../03_Service_Flow_Pricing.md)

### 11. 저장·상태 갱신·캐시·오류 처리

- **관찰.** 초기 요청에서 한 항목이 401이었다. 비로그인 ‘우리 아이’ 화면에서 정보 조회 실패와 다시 시도 안내를 관찰했다.
- **연결.** [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fa3b0edd438780bfc581b2a/state.mjs) 25~55행의 `normalize`, 앱의 `save`, [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 8~94행의 `invalidate/load/loadMine/loadDetails`, [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) 6~27행의 경로·상태 분기.
- **데이터와 한계.** 로컬·세션 저장, 요청 취소, ETag/델타, 세대 이전 응답 무시, 계정과 방 변경에 따른 초기화가 코드에 있다. 모든 모듈이 같은 캐시를 공유한다고 볼 수 없고, 오류 확률이나 서버 일관성은 미측정이다.

### 12. 모바일 화면과 PWA

- **관찰.** 기존 데스크톱 브라우저에서 홈 화면 제안, 웹 매니페스트와 서비스 워커 파일 요청을 확인했다. 모바일 설치 자체는 미실행.
- **연결.** [install.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/801e78d0be6a1bb3a11b5d87/install.js) 7~68행의 `beforeinstallprompt`, `appinstalled`, `register`. [sw.js](https://starkkuk.com/sw.js) 1~9행은 시작 문서로의 같은 출처 GET 탐색에 네트워크 우선과 연결 실패 안내를 사용한다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 1194~1203·2527행은 브라우저 특성과 화면 크기에 따라 캔버스를 조절한다.
- **데이터와 한계.** 설치 안내 보류 기록, 언어별 루트, 화면 픽셀 비율이 관련된다. 모바일별 설치 가용성·서비스 워커 실제 활성화·오프라인 이용을 검증한 결과는 없다.

## 초기 방문에서 요청된 전체 스크립트 경로

아래 **272개**는 REA 초기 방문의 `resource_type=script` 280건을 집계한 결과다. CDN의 빌드 접두사와 쿼리 문자열을 제거한 상대 경로로 묶었다. 같은 경로의 리다이렉트 전후와 반복 요청은 요청 수에 남겼다. 대표 URL은 확인 가능한 배포 응답을 우선했다. 마지막 열의 ‘본문 읽음’은 기존과 이번 조사 기록에서 해당 모듈 본문을 확보했다는 뜻이다. 나머지 이름의 영역 분류는 탐색용이며 기능을 검증했다는 뜻이 아니다. `dev-studio`, 직원, 관리 관련 명칭은 공개 초기 요청 사실만 기록하며 실제 접근 권한을 뜻하지 않는다.

### 계정·추모함·사진·기록 (44개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [account-deletion-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d2c5dcef774ab6df33c920ce/account-deletion-ui.mjs) | 1 | request-85 · 200 | 요청 목록 |
| [account-link-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/36e555caa7872847b53f5e47/account-link-ui.mjs) | 1 | request-86 · 200 | 요청 목록 |
| [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) | 1 | request-185 · 200 | 본문 읽음 |
| [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) | 1 | request-80 · 200 | 본문 읽음 |
| [candle-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8b4fa88be848c1c6bdcc1150/candle-layout.mjs) | 1 | request-313 · 200 | 요청 목록 |
| [candle-memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6048c8b4d99eeb49d3fefcd7/candle-memorial.js) | 1 | request-187 · 200 | 요청 목록 |
| [candle-orbit.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/249a6178f81924e578a8eb6d/candle-orbit.mjs) | 1 | request-190 · 200 | 요청 목록 |
| [candle-walk-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/dbc0291103fc26e596d4882a/candle-walk-layout.mjs) | 1 | request-189 · 200 | 요청 목록 |
| [candle-walk.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e85327607bf6f2275dc44824/candle-walk.js) | 1 | request-188 · 200 | 요청 목록 |
| [companion-lockers.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4ffbc87bf375a7b80467c498/companion-lockers.mjs) | 1 | request-146 · 200 | 요청 목록 |
| [family-invite.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/21717727ff26fd628e508148/family-invite.js) | 1 | request-142 · 200 | 요청 목록 |
| [letter-excerpt.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ef084faf9bf4165084a7ed21/letter-excerpt.mjs) | 1 | request-179 · 200 | 요청 목록 |
| [locker-caption.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/04a18b86d7e383f7d73b3fa9/locker-caption.js) | 1 | request-182 · 200 | 요청 목록 |
| [locker-clear-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb67c5df2c7a52126a3dc031/locker-clear-ui.js) | 1 | request-159 · 200 | 요청 목록 |
| [locker-decor-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5e90e636f79ad29e2f5b2a9f/locker-decor-catalog.mjs) | 1 | request-326 · 200 | 요청 목록 |
| [locker-decor-placement.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/137211db2a97d0496d6efa85/locker-decor-placement.js) | 1 | request-327 · 200 | 요청 목록 |
| [locker-decor-surfaces.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3538fc28455bc5028d6e6095/locker-decor-surfaces.js) | 1 | request-247 · 200 | 요청 목록 |
| [locker-decor-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ff3d4d8e5bd1f481498a4537/locker-decor-ui.js) | 1 | request-248 · 200 | 요청 목록 |
| [locker-decor.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/624e849fad57c91467dbee1a/locker-decor.js) | 1 | request-246 · 200 | 요청 목록 |
| [locker-doors.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7b531eb6a707c9b43c803430/locker-doors.js) | 1 | request-178 · 200 | 요청 목록 |
| [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) | 1 | request-143 · 200 | 본문 읽음 |
| [locker-labels.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/996a893c1fcdbdee00613cf6/locker-labels.js) | 1 | request-181 · 200 | 요청 목록 |
| [locker-navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9d892d756353fbcffb84a6fc/locker-navigation.mjs) | 1 | request-192 · 200 | 요청 목록 |
| [locker-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb7677c26d7a17ea7d835357/locker-photos.js) | 1 | request-195 · 200 | 요청 목록 |
| [locker-picker.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1eb403d26ce7bea519ddcdad/locker-picker.js) | 1 | request-184 · 200 | 요청 목록 |
| [locker-poll.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/10de7f10ee12ae264f3bc477/locker-poll.js) | 1 | request-139 · 200 | 요청 목록 |
| [locker-report.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d5c4c3bff6d5d5ed04309279/locker-report.js) | 1 | request-160 · 200 | 요청 목록 |
| [locker-share.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29b719b174185925519c3da6/locker-share.mjs) | 1 | request-186 · 200 | 요청 목록 |
| [locker-summary.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/173badde4100b4933be1e0c6/locker-summary.mjs) | 1 | request-289 · 200 | 요청 목록 |
| [memorial-candle-backdrop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a31a79d75bca26772f982489/memorial-candle-backdrop.js) | 1 | request-110 · 200 | 요청 목록 |
| [memorial-sites.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4259d56938eca07682aee93e/memorial-sites.mjs) | 1 | request-223 · 200 | 요청 목록 |
| [memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) | 1 | request-232 · 200 | 본문 읽음 |
| [niche-capture.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/178e70744f12bb6706f3c2f5/niche-capture.mjs) | 1 | request-161 · 200 | 요청 목록 |
| [niche-font.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5448643a4abb5d526d386dee/niche-font.js) | 1 | request-138 · 200 | 요청 목록 |
| [niche-photo.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js) | 1 | request-162 · 200 | 본문 읽음 |
| [niche-selfie.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/67c6599771a6c97c23238257/niche-selfie.mjs) | 1 | request-169 · 200 | 요청 목록 |
| [niche-sky.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/37faf8bca29a62ce2d0a27a7/niche-sky.js) | 1 | request-111 · 200 | 요청 목록 |
| [photo-encoding.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a999c7e35755d788f901ef07/photo-encoding.mjs) | 1 | request-84 · 200 | 요청 목록 |
| [photo-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/904f7c0ddf5b269cc8d5a851/photo-input.mjs) | 1 | request-273 · 200 | 요청 목록 |
| [photo-source.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7c1f7a010ec2d1faec8408c1/photo-source.mjs) | 1 | request-137 · 200 | 요청 목록 |
| [reservations.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e98a31f48fed83ff6b1a3b80/reservations.mjs) | 1 | request-196 · 200 | 요청 목록 |
| [tribute-ceremony.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/90ab85578e0f19f3414d7217/tribute-ceremony.js) | 1 | request-177 · 200 | 요청 목록 |
| [tribute-light.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7451bfcf37701dcd06a04ecd/tribute-light.js) | 1 | request-176 · 200 | 요청 목록 |
| [tribute-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5706ec2a3d8affa9b3887175/tribute-ui.js) | 1 | request-175 · 200 | 본문 읽음 |

### 기반·채널·PWA (20개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) | 1 | request-101 · 200 | 본문 읽음 |
| [boot.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9eb79b05d000f37c9762986b/boot.js) | 2 | request-66 · 200 | 본문 읽음 |
| [browser-compat.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/067d7af69561901d54006bfb/browser-compat.mjs) | 1 | request-71 · 200 | 요청 목록 |
| [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) | 1 | request-67 · 200 | 본문 읽음 |
| [channel-entry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6efd01555121fe0e7f65b45c/channel-entry.mjs) | 1 | request-68 · 200 | 요청 목록 |
| [channel-picker.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d031dd4c7a87911080a966ac/channel-picker.js) | 2 | request-65 · 200 | 요청 목록 |
| [dates.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/86d86e504b9c1c4975711d9a/dates.mjs) | 1 | request-230 · 200 | 요청 목록 |
| [external-browser.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/007b6f18814d8f3ae7baf1d8/external-browser.js) | 1 | request-75 · 200 | 요청 목록 |
| [i18n-app.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c51bcfac152da47d6df95125/i18n-app.mjs) | 1 | request-76 · 200 | 요청 목록 |
| [i18n-shared.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/adf5edd1099e13bfec8101c2/i18n-shared.mjs) | 1 | request-77 · 200 | 요청 목록 |
| [i18n.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c6d2686093628f4201eb2bbb/i18n.mjs) | 1 | request-70 · 200 | 요청 목록 |
| [install.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/801e78d0be6a1bb3a11b5d87/install.js) | 2 | request-45 · 200 | 본문 읽음 |
| [popup-once.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e7913c89edfb4c9117ddacc0/popup-once.mjs) | 1 | request-73 · 200 | 요청 목록 |
| [privacy-notice.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/952745e15561314694d83aa7/privacy-notice.js) | 2 | request-43 · 200 | 요청 목록 |
| [seo-navigation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9eee6dd12ebf672663ca6485/seo-navigation.js) | 1 | request-158 · 200 | 요청 목록 |
| [site-stats.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2fee9065459547b60b2882f4/site-stats.js) | 1 | request-72 · 200 | 요청 목록 |
| [sns-links.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8b7c6672eebd16ab7ad1d4b/sns-links.js) | 2 | request-64 · 200 | 요청 목록 |
| [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fa3b0edd438780bfc581b2a/state.mjs) | 1 | request-250 · 200 | 본문 읽음 |
| [sw.js](https://starkkuk.com/sw.js) | 1 | request-251 · 200 | 본문 읽음 |
| [telemetry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f47455b4f1332aabd0963590/telemetry.js) | 2 | request-63 · 200 | 요청 목록 |

### 공간·환경·조작 (76개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [arboretum.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bcbb0a0f0760230c21d74596/arboretum.js) | 1 | request-321 · 200 | 요청 목록 |
| [architecture.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/558a0e46d0078cb91d4146b0/architecture.js) | 1 | request-234 · 200 | 요청 목록 |
| [audio-settings.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0289edf89b22a154e9b84bec/audio-settings.js) | 1 | request-240 · 200 | 요청 목록 |
| [avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e4716f71b2eb05fa15928960/avatar.js) | 1 | request-191 · 200 | 요청 목록 |
| [beach-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd9abb28e6277b6daebbad5f/beach-audio.js) | 1 | request-221 · 200 | 요청 목록 |
| [beach-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cc1e6c612add50f447c6a5e5/beach-layout.mjs) | 1 | request-220 · 200 | 요청 목록 |
| [beach.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/62e6eeef35cacf93097dfc2c/beach.js) | 1 | request-203 · 200 | 요청 목록 |
| [camera-obstruction-bounds.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a115d105ad6d6317b2679af/camera-obstruction-bounds.js) | 1 | request-237 · 200 | 요청 목록 |
| [camera-obstruction.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/96dd8349a2b5869c4d1aca64/camera-obstruction.js) | 1 | request-236 · 200 | 요청 목록 |
| [camera-rig.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4c30cab07bf2bd8a893903b3/camera-rig.js) | 1 | request-235 · 200 | 본문 읽음 |
| [candy-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a3a7cbe6afc076bbbce2fe3/candy-layout.mjs) | 1 | request-208 · 200 | 요청 목록 |
| [candy.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/829ae3cd3eb7894703598c65/candy.js) | 1 | request-207 · 200 | 요청 목록 |
| [cloud-atmosphere.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d8282d9253d6feedfec46306/cloud-atmosphere.mjs) | 1 | request-218 · 200 | 요청 목록 |
| [cloud-layout-factory.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ed55fe1865705663953823f8/cloud-layout-factory.mjs) | 1 | request-265 · 200 | 요청 목록 |
| [cloud-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b575c2f194656ffcd02aaad6/cloud-layout.mjs) | 1 | request-219 · 200 | 요청 목록 |
| [cloud.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/144b6cb45b656bb3fbba0b10/cloud.js) | 1 | request-204 · 200 | 요청 목록 |
| [constellation-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/074c027c0173faf7d6e8ca1c/constellation-layout.mjs) | 1 | request-166 · 200 | 요청 목록 |
| [forest-hall.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ec5b1fe6c943e66626bef9ad/forest-hall.js) | 1 | request-127 · 200 | 요청 목록 |
| [forest-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/55116729873fb85bfe58144d/forest-layout.mjs) | 1 | request-126 · 200 | 요청 목록 |
| [forest-notes.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8eedfe853b671d6c13826b5e/forest-notes.js) | 1 | request-128 · 200 | 요청 목록 |
| [garden-ambience.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c961a7259b630e48d099bce6/garden-ambience.js) | 1 | request-200 · 200 | 요청 목록 |
| [garden-apartments.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b130e7a44b1e9cfc5e4191c7/garden-apartments.js) | 1 | request-318 · 200 | 요청 목록 |
| [garden-atmosphere.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/06ab6963fb838160b89b1f20/garden-atmosphere.js) | 1 | request-201 · 200 | 요청 목록 |
| [garden-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/75c40c84594bf0a944ab732b/garden-layout.mjs) | 1 | request-229 · 200 | 요청 목록 |
| [garden-pet-path.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a1f29e9759d45c389f6e2ec9/garden-pet-path.mjs) | 1 | request-292 · 200 | 요청 목록 |
| [garden-village-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ac2d6296d02c10f002d037ed/garden-village-layout.mjs) | 1 | request-157 · 200 | 요청 목록 |
| [garden-village.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e71dade61856b01858ff310/garden-village.js) | 1 | request-319 · 200 | 요청 목록 |
| [garden.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/658e736a8a4a6728ee418b72/garden.js) | 1 | request-199 · 200 | 요청 목록 |
| [grove-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/49fc60a0b3a5bdc5ac551b41/grove-appearance.mjs) | 1 | request-323 · 200 | 요청 목록 |
| [grove-fireflies.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2b6f7e1787e3bda016268b0e/grove-fireflies.js) | 1 | request-322 · 200 | 요청 목록 |
| [grove-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f393165c350b75300085c724/grove-layout.mjs) | 1 | request-227 · 200 | 요청 목록 |
| [grove-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2301d6417f92f29d8fda2aad/grove-ui.js) | 1 | request-225 · 200 | 요청 목록 |
| [grove.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c531b74924095b7f5bf72a41/grove.js) | 1 | request-224 · 200 | 요청 목록 |
| [hall-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e449349a663bb4f1b5350268/hall-layout.mjs) | 1 | request-231 · 200 | 요청 목록 |
| [hall-select.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/38d6e325217e8b5fd7f70518/hall-select.js) | 1 | request-210 · 200 | 본문 읽음 |
| [hud-menu.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0e5af2d2eae1750b3f989600/hud-menu.js) | 1 | request-163 · 200 | 본문 읽음 |
| [hud-shortcuts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0ff6d576091efcb98408042f/hud-shortcuts.js) | 1 | request-168 · 200 | 요청 목록 |
| [interaction-hints.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/35b5dd631e69baf67aaa9017/interaction-hints.js) | 1 | request-183 · 200 | 요청 목록 |
| [library-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/28298076f10d296ba43c6077/library-layout.mjs) | 1 | request-105 · 200 | 요청 목록 |
| [library.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/947551657d599684369cdfec/library.js) | 1 | request-106 · 200 | 요청 목록 |
| [meadow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a4cc7b0bdef42e32ce88e11/meadow-layout.mjs) | 1 | request-222 · 200 | 요청 목록 |
| [meadow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/69c7941950a2aebf2a6a2383/meadow.js) | 1 | request-202 · 200 | 요청 목록 |
| [moonlight-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5cc1812fcdf3278119bd5507/moonlight-layout.mjs) | 1 | request-108 · 200 | 요청 목록 |
| [moonlight.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a14fb7dc3422d5ca61b65f47/moonlight.js) | 1 | request-109 · 200 | 요청 목록 |
| [movement-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/583ec8f3387c9c707c537017/movement-settings.mjs) | 1 | request-193 · 200 | 요청 목록 |
| [music-controls.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/441681adb8d2e4b9bff161b7/music-controls.js) | 1 | request-239 · 200 | 요청 목록 |
| [music-tracks.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/62f1919aa0289f563d713cf4/music-tracks.mjs) | 1 | request-325 · 200 | 요청 목록 |
| [music.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c810c559d8764e3a0816cfcb/music.js) | 1 | request-238 · 200 | 요청 목록 |
| [navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0dc53911b1dadb58e3c01ecc/navigation.mjs) | 1 | request-242 · 200 | 요청 목록 |
| [observatory-finishes.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7e1fb5a8924d3ff1efdf2387/observatory-finishes.js) | 1 | request-258 · 200 | 요청 목록 |
| [observatory-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0268ce033ee1093a16ae6f1e/observatory-layout.mjs) | 1 | request-103 · 200 | 요청 목록 |
| [observatory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d0ff6a1cb737ee74f0aff3f1/observatory.js) | 1 | request-104 · 200 | 요청 목록 |
| [placement.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8a32dcb052063facce2b2ae0/placement.mjs) | 1 | request-241 · 200 | 요청 목록 |
| [portal-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/060a28736e96282eeca588bc/portal-layout.mjs) | 1 | request-264 · 200 | 요청 목록 |
| [portal-title.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e2a6738a97601e9744dc2496/portal-title.js) | 1 | request-282 · 200 | 요청 목록 |
| [rainbow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a27e05555c936ee24d669744/rainbow-layout.mjs) | 1 | request-217 · 200 | 요청 목록 |
| [rainbow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/137c19064f871ac905c5b2e1/rainbow.js) | 1 | request-205 · 200 | 요청 목록 |
| [render-profile.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd18146b6d19e993d020232f/render-profile.mjs) | 1 | request-141 · 200 | 본문 읽음 |
| [room-shapes.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c92dd147fd6e948cbb4b37f5/room-shapes.mjs) | 1 | request-268 · 200 | 요청 목록 |
| [room-surface.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/199afdda12028e5d860b32ba/room-surface.js) | 1 | request-115 · 200 | 요청 목록 |
| [seating.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f6157584c4acc3f84c5250e2/seating.js) | 1 | request-233 · 200 | 요청 목록 |
| [snow-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8c3b3722df24ff61b222a5b7/snow-audio.js) | 1 | request-211 · 200 | 요청 목록 |
| [snow-care.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1c0887c6f5d8a4bd095cee49/snow-care.js) | 1 | request-212 · 200 | 요청 목록 |
| [snow-effects.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b3240114d46a487f91adec34/snow-effects.js) | 1 | request-320 · 200 | 요청 목록 |
| [snow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e489beb821eadfc93d8e5d4d/snow-layout.mjs) | 1 | request-209 · 200 | 요청 목록 |
| [snow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/725222def04f98878dafbf7f/snow.js) | 1 | request-206 · 200 | 요청 목록 |
| [snowman-activity.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1f0df51a2982418df2f08f04/snowman-activity.js) | 1 | request-214 · 200 | 요청 목록 |
| [snowman-model.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ab26bf8ef316126a03ef5a7/snowman-model.js) | 1 | request-213 · 200 | 요청 목록 |
| [snowman-space.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/760ce5bc758356b468eb592e/snowman-space.mjs) | 1 | request-216 · 200 | 요청 목록 |
| [snowman-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bdeb8cb1f562d80bf31b7a1c/snowman-world.js) | 1 | request-215 · 200 | 요청 목록 |
| [static-batch.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29617a6f29e55d9c6b62567d/static-batch.js) | 1 | request-228 · 200 | 요청 목록 |
| [themed-portals.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bdc5ce501b0b7c5671e4a83/themed-portals.js) | 1 | request-283 · 200 | 요청 목록 |
| [travel-portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/762c88805d8d936f8f378a27/travel-portal.js) | 1 | request-132 · 200 | 요청 목록 |
| [vault.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/072b9e757b0ec0f428b0f5c7/vault.js) | 1 | request-324 · 200 | 요청 목록 |
| [world-motion-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4293c00ac29158a11c0c4b6c/world-motion-client.mjs) | 1 | request-328 · 200 | 요청 목록 |
| [world-movement.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0acd6ad644ad550302baa7f4/world-movement.mjs) | 1 | request-243 · 200 | 요청 목록 |

### 공개 이벤트·시설과 도구 후보 (27개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [attendance-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae95360b169a03e150d40f3c/attendance-copy.mjs) | 1 | request-263 · 200 | 요청 목록 |
| [attendance.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/382ca375e51f93b43db2c0b0/attendance.js) | 1 | request-119 · 200 | 요청 목록 |
| [cafe-activity.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0bd97c47c10d39e92cf9f27d/cafe-activity.js) | 1 | request-155 · 200 | 요청 목록 |
| [cafe-orders.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fe07f6b01966ca78f4f037e8/cafe-orders.mjs) | 1 | request-297 · 200 | 요청 목록 |
| [cafe-ready-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b9f81bf41e1fa8811e4829c9/cafe-ready-sound.js) | 1 | request-156 · 200 | 요청 목록 |
| [cafe-staff.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a8ec3afac34bd22e0228ebb7/cafe-staff.js) | 1 | request-346 · 200 | 요청 목록 |
| [cafe-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2547aff0b02a21609b47c886/cafe-ui.js) | 1 | request-154 · 200 | 요청 목록 |
| [chapel/event.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c6d2d25a71fab26b2290fb5a/chapel/event.mjs) | 1 | request-284 · 200 | 요청 목록 |
| [chapel/portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/eea144a5496178034282aa39/chapel/portal.js) | 1 | request-134 · 200 | 요청 목록 |
| [construction/entry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6497daa1297d9746afc69218/construction/entry.mjs) | 1 | request-287 · 200 | 요청 목록 |
| [construction/event-portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/dd48762431153a0ddd87e4e3/construction/event-portal.js) | 1 | request-133 · 200 | 요청 목록 |
| [contest-config.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0396d51df36c3b9934c080d3/contest-config.mjs) | 1 | request-337 · 200 | 요청 목록 |
| [contest-preview.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/506470a0911e2a68ca2c9f4c/contest-preview.mjs) | 1 | request-336 · 200 | 요청 목록 |
| [contest-results.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d914b71e90b2b4d373d8ad22/contest-results.mjs) | 1 | request-334 · 200 | 요청 목록 |
| [contest-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/eacd396d57bf79b5c9046a15/contest-ui.js) | 1 | request-271 · 200 | 요청 목록 |
| [daily-activities-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fd7e68acd397b8a4028c0b6b/daily-activities-copy.mjs) | 1 | request-311 · 200 | 요청 목록 |
| [dev-studio/facade.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3122115618306157fdc71edc/dev-studio/facade.js) | 1 | request-275 · 200 | 요청 목록 |
| [dev-studio/models.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d963dfedf25bc50862250049/dev-studio/models.js) | 1 | request-335 · 200 | 요청 목록 |
| [lantern-icon.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2aa2e18588beaeab3189d08e/lantern-icon.mjs) | 1 | request-304 · 200 | 요청 목록 |
| [pebble-actions.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1a052c07e6d77650160012fd/pebble-actions.js) | 1 | request-174 · 200 | 요청 목록 |
| [pebble-garden.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d61eb3932a515c6a922a5eb5/pebble-garden.js) | 1 | request-172 · 200 | 요청 목록 |
| [pebble-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e8a60e8e61bc50cccf7692c/pebble-layout.mjs) | 1 | request-312 · 200 | 요청 목록 |
| [pebble-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/022a20e2e267a1c49366935f/pebble-ui.js) | 1 | request-173 · 200 | 요청 목록 |
| [ritual-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2401da7b6733defa4986ae/ritual-sound.js) | 1 | request-180 · 200 | 요청 목록 |
| [temple-ceremony/entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a40a65e8804655eb248e086/temple-ceremony/entry.js) | 1 | request-74 · 200 | 요청 목록 |
| [temple-ceremony/schedule.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0c8fe5d80d6b920242cd35f9/temple-ceremony/schedule.mjs) | 1 | request-78 · 200 | 요청 목록 |
| [temple/layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/896289b08981cc2d73d01b74/temple/layout.mjs) | 1 | request-83 · 200 | 요청 목록 |

### 반려동물·맞춤 모델·활동 (49개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [gift-inventory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e343dcd26613f728b8fbd42/gift-inventory.js) | 1 | request-129 · 200 | 요청 목록 |
| [gift-placement-guide.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a9a4f2099fec256c5fc458c7/gift-placement-guide.js) | 1 | request-130 · 200 | 요청 목록 |
| [gift-trash.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a2082f899c3d2a59a6b800f1/gift-trash.js) | 1 | request-117 · 200 | 요청 목록 |
| [kkuki-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/17a6258121f0ca55c259feb1/kkuki-catalog.mjs) | 1 | request-261 · 200 | 요청 목록 |
| [kkuki-reward.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/08d1eaa1aeba288ac43c1d1a/kkuki-reward.js) | 1 | request-262 · 200 | 요청 목록 |
| [kkuki-shop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae4b8e53f1fa7c7aaf794cb8/kkuki-shop.js) | 1 | request-118 · 200 | 요청 목록 |
| [milk-skin-formation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2fea7fa9d3f38f80df6532/milk-skin-formation.js) | 1 | request-151 · 200 | 요청 목록 |
| [milk-skin-review.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/615fda2a30b8591a337453b7/milk-skin-review.js) | 1 | request-152 · 200 | 요청 목록 |
| [milk-skin-status.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/027266a918d6943f45ecc744/milk-skin-status.mjs) | 1 | request-298 · 200 | 요청 목록 |
| [pet-activity-model.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6b76c16bfbaeefe7ebcb8fe2/pet-activity-model.mjs) | 1 | request-285 · 200 | 요청 목록 |
| [pet-appearance-model.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/297cc4e6c2fac531772a8436/pet-appearance-model.js) | 1 | request-295 · 200 | 본문 읽음 |
| [pet-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ea5a9c58220e6694b1c6419/pet-appearance.mjs) | 1 | request-286 · 200 | 본문 읽음 |
| [pet-avatar-extras.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/352db75ecb339d15fef2788c/pet-avatar-extras.js) | 1 | request-294 · 200 | 요청 목록 |
| [pet-avatar-mammals.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ca2a133b175313a812d5d835/pet-avatar-mammals.js) | 1 | request-340 · 200 | 본문 읽음 |
| [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) | 1 | request-144 · 200 | 본문 읽음 |
| [pet-camera-gaze.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b782814155a4332e7ab79718/pet-camera-gaze.js) | 1 | request-303 · 200 | 요청 목록 |
| [pet-carry-pose.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/61d986d1ee3bd96cfa53b1de/pet-carry-pose.js) | 1 | request-291 · 200 | 요청 목록 |
| [pet-carry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/41870d51782c8ff35b4d7577/pet-carry.js) | 1 | request-148 · 200 | 요청 목록 |
| [pet-chat-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/51a5a5771859749cc4b2bc1f/pet-chat-copy.mjs) | 1 | request-314 · 200 | 요청 목록 |
| [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a5b2cc8aba470fa17f661ef/pet-chat.js) | 1 | request-197 · 200 | 요청 목록 |
| [pet-coat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/591bc2ccc48da07c7b4032d4/pet-coat.js) | 1 | request-293 · 200 | 본문 읽음 |
| [pet-companions.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fe19a95f540ae4cd25ee8ec/pet-companions.js) | 1 | request-145 · 200 | 본문 읽음 |
| [pet-crayon.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8caa5a2ba75961be010de8e/pet-crayon.js) | 1 | request-339 · 200 | 요청 목록 |
| [pet-crayon.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a3f06f3498bf60ac7616386c/pet-crayon.mjs) | 1 | request-344 · 200 | 본문 읽음 |
| [pet-management-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2e155a3e2c904bd70ef0d019/pet-management-ui.js) | 1 | request-170 · 200 | 요청 목록 |
| [pet-model-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a443b0eeaf6817eb5a6321b0/pet-model-copy.mjs) | 1 | request-308 · 200 | 본문 읽음 |
| [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) | 1 | request-310 · 200 | 본문 읽음 |
| [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) | 1 | request-167 · 200 | 본문 읽음 |
| [pet-model-revision.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/342bae9be0d1200b21b46ec9/pet-model-revision.js) | 1 | request-309 · 200 | 본문 읽음 |
| [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js) | 1 | request-102 · 200 | 본문 읽음 |
| [pet-motion-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d89711d294b5863e59ea2e5/pet-motion-settings.mjs) | 1 | request-338 · 200 | 본문 읽음 |
| [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) | 1 | request-116 · 200 | 본문 읽음 |
| [pet-reaction.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0046ffd5fd8dbe7d7bccceec/pet-reaction.mjs) | 1 | request-315 · 200 | 요청 목록 |
| [pet-ride-pose.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8b667171433f032294da51a2/pet-ride-pose.js) | 1 | request-288 · 200 | 요청 목록 |
| [pet-ride.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e18bf6b091339667a3777084/pet-ride.js) | 1 | request-147 · 200 | 요청 목록 |
| [pet-size.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f5c3ee414f4391e2292c5d79/pet-size.mjs) | 1 | request-149 · 200 | 본문 읽음 |
| [pet-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d567e9e55809d68a5a8388d/pet-sound.js) | 1 | request-316 · 200 | 요청 목록 |
| [pet-species.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4b911a7216d2563f36ae9def/pet-species.mjs) | 1 | request-140 · 200 | 본문 읽음 |
| [petting-comparison.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/029aca83ad49397e5661c8bd/petting-comparison.js) | 1 | request-317 · 200 | 요청 목록 |
| [petting.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f2eb0aa75380bb5e2abcfe01/petting.js) | 1 | request-198 · 200 | 본문 읽음 |
| [tree-rest.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/667d2056ee67ded79adfa9d2/tree-rest.mjs) | 1 | request-226 · 200 | 요청 목록 |
| [walk-care-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7740e997ada7c857b84d6842/walk-care-layout.mjs) | 1 | request-296 · 200 | 요청 목록 |
| [walk-care.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/38165cfcb8cd89f00b5734e7/walk-care.js) | 1 | request-153 · 200 | 요청 목록 |
| [walk-pet-behavior.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/32e24314dd6aaa9f79127d47/walk-pet-behavior.mjs) | 1 | request-300 · 200 | 요청 목록 |
| [walk-pet-wander.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2237ebb12b9a9bb7f70f3ea6/walk-pet-wander.mjs) | 1 | request-302 · 200 | 요청 목록 |
| [walk-play-hearts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4431785b988488ab54e90270/walk-play-hearts.js) | 1 | request-301 · 200 | 요청 목록 |
| [walk-play.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b1bd33d7eb886e5019541c30/walk-play.js) | 1 | request-150 · 200 | 요청 목록 |
| [walk-together-context.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/adf934ad086cee13fc0b90a8/walk-together-context.mjs) | 1 | request-136 · 200 | 요청 목록 |
| [walk-together-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e45c858a27d4f28552bb4433/walk-together-entry.js) | 1 | request-135 · 200 | 본문 읽음 |

### 광장·소통·접속 상태 (37개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [my-posts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7921bbb166a9588a8c16965a/my-posts.js) | 1 | request-269 · 200 | 요청 목록 |
| [nickname-label.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e894fe00efc161dc2b9735b2/nickname-label.js) | 1 | request-171 · 200 | 요청 목록 |
| [player-visibility.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b1b578b0a82ab7befa475967/player-visibility.mjs) | 1 | request-267 · 200 | 요청 목록 |
| [plaza-boards-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) | 1 | request-122 · 200 | 본문 읽음 |
| [plaza-boards-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b2842ee2f9e04ad927430932/plaza-boards-world.js) | 1 | request-276 · 200 | 요청 목록 |
| [plaza-comments.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c7780c2d88aef845fe4edcc/plaza-comments.js) | 1 | request-272 · 200 | 요청 목록 |
| [plaza-drawing.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/babafb60eb43060120ccd220/plaza-drawing.js) | 1 | request-274 · 200 | 요청 목록 |
| [plaza-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/26612745a41aa3a485239c79/plaza-entry.js) | 1 | request-124 · 200 | 요청 목록 |
| [plaza-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b090ae853a7fe76b6c69527f/plaza-layout.mjs) | 1 | request-120 · 200 | 요청 목록 |
| [plaza-map.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8f051047984f25ece37c480f/plaza-map.mjs) | 1 | request-266 · 200 | 요청 목록 |
| [plaza-pet-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/37fa564a306d96184251c5cb/plaza-pet-motion.mjs) | 1 | request-343 · 200 | 요청 목록 |
| [plaza-pet-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/09e4dc6cca17d1ddf9e67e35/plaza-pet-ui.js) | 1 | request-125 · 200 | 요청 목록 |
| [plaza-pets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd1c272f30e9fe7ecd60db02/plaza-pets.js) | 1 | request-277 · 200 | 본문 읽음 |
| [plaza-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f71da449ab11b071c789ad08/plaza-world.js) | 1 | request-121 · 200 | 요청 목록 |
| [presence-delta.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a906949d59b7ed7a6d85134/presence-delta.mjs) | 1 | request-345 · 200 | 요청 목록 |
| [presence-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c1c26e9f7fa75a3ce4a68e74/presence-motion.mjs) | 1 | request-194 · 200 | 요청 목록 |
| [presence-protocol.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/31fcd953f5b855dfc6b18d97/presence-protocol.mjs) | 1 | request-332 · 200 | 요청 목록 |
| [presence-transport.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs) | 1 | request-329 · 200 | 본문 읽음 |
| [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) | 1 | request-244 · 200 | 본문 읽음 |
| [reunion-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c45ec4b14dd8f0f30a1460b/reunion-entry.js) | 1 | request-131 · 200 | 요청 목록 |
| [reunion-live-protocol.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/489f560f56cfed23e99c43d5/reunion-live-protocol.mjs) | 1 | request-347 · 200 | 요청 목록 |
| [reunion-realtime.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/14ec48c5e3d7e431bfae6d22/reunion-realtime.js) | 1 | request-330 · 200 | 요청 목록 |
| [snapshot-delta.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/09a385d34e94f5359f8f58f3/snapshot-delta.mjs) | 1 | request-290 · 200 | 요청 목록 |
| [social-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c15ee9996fc6fbc3a8b8a730/social-copy.mjs) | 1 | request-270 · 200 | 요청 목록 |
| [social-presets.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3ad26ee02a8a00036d2d35df/social-presets.mjs) | 1 | request-348 · 200 | 요청 목록 |
| [social.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/85ceca4c296ca59271744cf0/social.js) | 1 | request-331 · 200 | 요청 목록 |
| [star-friends-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/84369113b04db48e4ce4788a/star-friends-copy.mjs) | 1 | request-307 · 200 | 요청 목록 |
| [star-friends-navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b26dd5ed6aae99c94f054598/star-friends-navigation.mjs) | 1 | request-165 · 200 | 요청 목록 |
| [star-friends.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/52a07091160d03a9687bb409/star-friends.js) | 1 | request-164 · 200 | 요청 목록 |
| [today-stars-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/53cfec2f7bcde135c3ed0f79/today-stars-copy.mjs) | 1 | request-279 · 200 | 요청 목록 |
| [today-stars-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/418c498ec132549ef8fc832f/today-stars-feed.js) | 1 | request-280 · 200 | 요청 목록 |
| [today-stars-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb798f7e537ba4766d08a40f/today-stars-world.js) | 1 | request-278 · 200 | 요청 목록 |
| [today-stars.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/293fd53262524135b49b2a09/today-stars.js) | 1 | request-123 · 200 | 요청 목록 |
| [visit-ranking.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ba9302ff0ad75bbb15fa9866/visit-ranking.js) | 1 | request-305 · 200 | 요청 목록 |
| [visit-stay-format.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6614be3107a03b4fababf35f/visit-stay-format.mjs) | 1 | request-306 · 200 | 요청 목록 |
| [visit-stay-label.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6f0d5cc07372e9ca4510f11e/visit-stay-label.js) | 1 | request-333 · 200 | 요청 목록 |
| [visitor-names.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ab7c5a7d53f5bdacafc39328/visitor-names.mjs) | 1 | request-107 · 200 | 요청 목록 |

### 후원·제휴 (12개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [partner-ground-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1a519a2f55149db9c436a41b/partner-ground-appearance.mjs) | 1 | request-342 · 200 | 본문 읽음 |
| [partner-ground-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/831177a5724a6444c4038899/partner-ground-avatar.js) | 1 | request-341 · 200 | 본문 읽음 |
| [partner-ground-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7a4351f395a1cd1b71a05723/partner-ground-layout.mjs) | 1 | request-352 · 200 | 요청 목록 |
| [partner-ground-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ca6ae4c25d12a71d57495128/partner-ground-motion.mjs) | 1 | request-351 · 200 | 요청 목록 |
| [petnight-customer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a4eeafe30447621e26141b4b/petnight-customer.js) | 1 | request-113 · 200 | 본문 읽음 |
| [petnight-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ce26653e871f9e07894d7403/petnight-layout.mjs) | 1 | request-112 · 200 | 요청 목록 |
| [petnight-staff.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6e76ed1cdb55e0b02564379f/petnight-staff.js) | 1 | request-259 · 200 | 요청 목록 |
| [petnight-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59033aa044351908c46e2766/petnight-world.js) | 1 | request-114 · 200 | 요청 목록 |
| [play-support-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/79ac4112e839d43578e9c947/play-support-client.mjs) | 1 | request-81 · 200 | 요청 목록 |
| [play-support.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ebf0c4b3891317cc9c1d0435/play-support.mjs) | 1 | request-82 · 200 | 본문 읽음 |
| [support-receipt-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b07e38f2cfb63bedfcfa8125/support-receipt-input.mjs) | 1 | request-79 · 200 | 요청 목록 |
| [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) | 1 | request-69 · 200 | 본문 읽음 |

### 기타 (1개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [tree-home-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/290d1777080cb0a31391a466/tree-home-layout.mjs) | 1 | request-349 · 200 | 요청 목록 |

### 외부 렌더링·도우미 (6개)

| 공개 모듈 대표 URL | 요청 수 | 대표 요청·상태 | 조사 수준 |
|---|---:|---|---|
| [vendor/BufferGeometryUtils.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb2d3a3bca1770e540cfa655/vendor/BufferGeometryUtils.js) | 1 | request-281 · 200 | 요청 목록 |
| [vendor/GLTFLoader.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/091b522ef07f7f619bb1f001/vendor/GLTFLoader.js) | 1 | request-257 · 200 | 요청 목록 |
| [vendor/OrbitControls.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d929a2b733f5c1825282f1f4/vendor/OrbitControls.js) | 1 | request-249 · 200 | 요청 목록 |
| [vendor/SkeletonUtils.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2b6c2bae5312823ca42286dd/vendor/SkeletonUtils.js) | 1 | request-350 · 200 | 요청 목록 |
| [vendor/three.core.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4ae0e9752a73114c492ea23d/vendor/three.core.js) | 1 | request-299 · 200 | 요청 목록 |
| [vendor/three.module.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e390621736c3b55667fef003/vendor/three.module.js) | 3 | request-254 · 200 | 요청 목록 |

## 초기 요청 밖에서 찾은 예

| 구분 | 모듈과 근거 |
|---|---|
| 본문도 확인한 지연 모듈 | [pet-customizer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/855cc44fc89a36f2b21ae765/pet-customizer.js)와 [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js), [pet-lifelike.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bd905dcf58b329203753766/pet-lifelike.js)는 앞선 캐릭터 조사에서 공개 파일을 문서로 읽었다. 초기 화면 실행은 미확인. |
| 동적 import 선언 확인 | 나무집 `tree-home.js`, 포캣멍관 `partner-center.js`, 별자리 `constellation.js`, 재회 `reunion-game.js`, 숨바꼭질 `hide-seek-game.js`. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 2623·2797·2827·2927·2993행. |
| 조건부 에셋 도구 | `vendor/KTX2Loader.js`는 [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js) 6행에서 조건에 따라 import. 사용자의 GLB 요청·로딩은 확인하지 않았다. |

REA 초기 요청은 `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`을 기준으로 했다. 이번 추가 본문은 `ev_f06b2c128254f6a13fc1c9871b23d3abff7b67eee56dcb14a26b4f7152f82b78`, `ev_2fa62100d46ca5cdaa95b62db5cb34a56749e8862823f7d35cb57687f3fc3219`, `ev_e96707ada38a85aa02155848faf9b3f5c9fb108e653187e7b7d6a054de4f43bb`에 있다. 부트 이후 계정·언어·이벤트 조건으로 늦게 읽는 스크립트의 전체 집합은 미확인이다. [전체 구조](../00_Service_Architecture.md) · [의존 관계](Module_Dependencies.md) · [데이터 흐름](Data_Flow.md).

