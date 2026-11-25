
# 모바일 UI·입력·기기 기능

확인일 2026-11-25 KST. 공개 웹 런타임은 데스크톱 헤드리스 Chromium 158.0.8127.88의 **뷰포트 변경 실험**이다. 1280×720/DPR1과 390×844/DPR3에서 시작 화면의 Canvas와 메뉴 버튼이 나타났다. 390×844 조건의 추가 실행에서는 로딩 레이어 제거도 확인됐다. 모바일 UA·터치 센서·화면 회전·가상 키보드는 에뮬레이션하지 않았고 Android/iOS 실기기 테스트도 없었다. 메뉴 열기 시도는 시간 초과를 반환해 닫기·이동·카메라 변화는 실행 관찰에서 미확인이다. [실행 기록](../Architecture/10_Module_Coverage.md)

## 반응형 레이아웃과 입력 영역

| 영역 | 정적 근거와 화면 의미 |
|---|---|
| Canvas와 로딩 레이어 | `#app`/`#world`를 화면에 고정한다. `#world`의 `touch-action:none`은 브라우저의 기본 제스처와 3D 조작의 충돌을 줄인다. Canvas는 표시 요소의 폭·높이를 채운다. 로딩 장식은 높이 740·620·500px 기준으로 간격과 크기를 조절하고, 저감 모션 환경에서 로딩 배경 애니메이션을 줄인다. [style.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0f52073776395e83c71f9094/style.css) 3~14행. |
| 폭과 높이 대응 | 폭 600·900·1,000px 전후에 패널·조작 버튼 배치가 달라진다. HUD에서는 폭 360px 이하와 높이 720·620px 이하, 높이 500px 이하이면서 폭 620px 이상 조건이 따로 있다. 화면 방향 판단 대신 폭·높이 조건의 조합으로 가로 공간을 다룬다. [style.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0f52073776395e83c71f9094/style.css) 19~38·76~80행, [hud-layout.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/892776c33230b59fc811674d/hud-layout.css) 133~158·198행. |
| 노치·동적 뷰포트 | HUD 위치는 `env(safe-area-inset-*)`를 여백 계산에 반영하고, 목록은 `100dvh`에서 필요한 상·하단 높이를 빼서 한도를 잡는다. 드로어와 대화창은 오버플로 스크롤을 가지며, 단축키 레일의 `touch-action:pan-x`가 가로 스크롤을 허용한다. 이는 지원 브라우저가 제공하는 뷰포트와 여백 값에 의존한다. [hud-layout.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/892776c33230b59fc811674d/hud-layout.css) 3~11·75·104~115행, [hud-menu.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7a799c22a289ff4d1fb5944a/hud-menu.css) 5·22~23행, [hud-shortcuts.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/75a41f6af9286fbf97e25506/hud-shortcuts.css) 20~35·123~129행. |
| 포커스와 레이어 | `createHudMenu`가 상단 버튼과 메뉴 DOM을 연결한다. `createHudShortcuts`는 최대 8개와 현재 기능 가용성을 검사한다. 편집 대화상자는 `showModal()`과 닫기 버튼 포커스를 사용한다. rail과 대화 안에서 pointer·click·일부 key의 전파를 막고, 장면·메뉴가 바뀌면 편집 모드를 해제한다. 닫은 뒤 상황이 허용되면 기존 버튼에 포커스를 돌린다. [hud-menu.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a178cf63653ecaf57bf2143/hud-menu.js) 22~45행, [hud-shortcuts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/929b1c699d4e6f8338a6e9f2/hud-shortcuts.js) 13~31·38~50·63~94행. |
| 회전 및 리사이즈 | `resize()`가 `innerWidth/innerHeight`로 카메라 비율과 projection을 갱신한다. 렌더러의 drawing buffer에는 다시 계산한 화면 비율을 적용하며, 활성화된 셀피 화면은 닫거나 취소한다. `window.resize` 이벤트 연결은 확인했다. 플랫폼 회전 센서 사용이나 iOS 키보드 이동량의 실측은 없다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 2528~2530행. |

## 조이스틱, 포인터, 핀치

- `pad.onpointerdown` 및 `dragPad`가 포인터를 캡처하고 화면 중심에서의 입력을 조이스틱 벡터로 바꾼다. `pointerup`, `pointercancel`, 캡처 유실, `blur/focus`, `pagehide/pageshow`, `visibilitychange`가 벡터와 키 상태를 초기화한다. 키보드와 마우스·터치가 같은 이동 상태를 공유하며 대화상자나 조작 차단 상태는 앱에서 먼저 거른다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 2240~2262행.
- `pointerdown`은 두 포인터의 좌표를 기억하고, `pointermove`는 추모함 바깥에서 새 거리와 이전 거리의 차를 `rig.zoom`에 전달한다. 단일 포인터 드래그는 카메라 회전이며 6px 이동 기준으로 탭/드래그를 구별한다. 추모함 뷰의 `OrbitControls`는 별도의 각도·거리 한도가 있다. Canvas의 포인터 전이와 운영체제 핀치 이벤트 차이는 실기기에서 미검증이다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 1210~1212·2290~2319행.
- 메뉴와 사진·보관함·대화 같은 오버레이는 장면 입력과 분리된다. 이동 상태를 버리고 카메라나 겹친 기능을 중단하는 경로가 있는 반면, 작업마다 닫기와 포커스 복원 시점은 다르다. 다시 열었을 때 이전 UI의 입력을 복원하는지 여부는 화면별 동작을 비교해야 한다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 2254·2292~2294·2318·2544행, [hud-shortcuts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/929b1c699d4e6f8338a6e9f2/hud-shortcuts.js) 63~91행.

## 주요 모바일 UI

| 기능 | 정적 동작 | 공개 실행 한계 |
|---|---|---|
| 아이의 추억 메시지 | 대화창은 PC 고정 폭을 사용하며 600px 이하에서 좌우 여백을 둔 하단 패널, 높이 500px 이하에서 거의 전면을 쓰는 패널로 바뀐다. 히스토리 영역은 내부 스크롤이고 overscroll 전파를 제한한다. DOM의 답장 입력은 계정 자격과 메시지 상태에 의존한다. `Ctrl/Meta+Enter`는 IME 조합 중에는 제출하지 않는다. 이 대화 모듈에서 별도 `visualViewport` 키보드 추적은 확인하지 못했다. [pet-chat.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb90b8d22c2f65842ee09c9a/pet-chat.css) 4·8·13~14행, [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd4d8bfb2e95af4a301f2e49/pet-chat.js) 8·32·44~50행. | 로그인 대화 창, 시스템 키보드, 글자 조합, 송신 미실행. |
| 사진 선택 | 파일 입력의 첫 파일을 읽고 저장 중 입력 잠금, 전처리 및 에러 안내, 최종 입력값 초기화를 수행한다. 이미지 파일은 브라우저 디코더·캔버스의 제약을 받으며 HEIF 인식과 실제 디코드 성공은 기기별로 달라질 수 있다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 2146·2212~2220행, [photo-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7cc288d05ccb50668676e338/photo-input.mjs) 3~21행, [사진 처리](Photo_Media_Pipeline.md). | 파일 선택·업로드 미실행. |
| 캔버스 촬영·기기 공유 | 결과의 `Blob/File` 및 임시 URL을 만들고 다운로드 또는 `navigator.share({files})` 경로가 연결된다. 공유 지원 여부를 검사하며 취소·실패 시 파일 저장/길게 누르기 안내를 사용할 수 있다. 창 닫기와 장면 변경에서 임시 URL을 해제한다. [niche-photo.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9d462ae0f5de5c830fda95d8/niche-photo.js) 8~20·28~51행. | 사진 사용 및 기기 공유창을 실행하지 않았다. |
| 캐릭터 편집 | 프리뷰는 해당 모드에서 포인터 제어를 가져가고 메인 Canvas의 조작 경로를 막는다. 현재 UI 모달·반응형 적용과 외형 저장 정책은 별도 경로다. 공개 계정 UI 접근 조건이 적용되는 편집은 실행하지 않았다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 2292~2294·2536행, [pet-customizer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/855cc44fc89a36f2b21ae765/pet-customizer.js) [8차 교재](../Learning/ThreeJS_Code_Study.md). | 편집 프리뷰·핀치·저장 실기기 동작 미확인. |
| 일반 메뉴와 홈 화면 안내 | 상단 버튼·사이드 패널·스크롤 영역·안내 카드는 코드에서 확인했다. 외부 브라우저의 UA와 뷰포트가 서로 다른 감지 입력이다. 메뉴 버튼과 Canvas 존재를 관찰했다. [hud-menu.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7a799c22a289ff4d1fb5944a/hud-menu.css) 4~23행, [install.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/04ac9ef5e12baa98fef30b13/install.js) 13~33·45~69행. | 클릭 이후 펼침·키보드 포커스·주소창·단축키 레일의 실제 픽셀 비교는 미확인. |

모바일 CSS가 일치해도 렌더러의 모바일 조건은 UA·터치·메모리 판정에 따로 의존한다. 좁은 가상 화면 결과를 그림자 비활성화, 기기 GPU 또는 Safari 호환성 실측에 대입할 수 없다. [렌더링 프로필 분석](Loading_Caching_Performance.md)
