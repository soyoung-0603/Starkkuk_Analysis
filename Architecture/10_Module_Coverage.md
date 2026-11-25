
# 10차 모바일·런타임 분석 범위

확인일 2026-11-25 KST. 1~9차 [초기 모듈 목록](Module_Inventory.md), [3D 범위](3D_Module_Coverage.md), [9차 증분](09_Module_Coverage.md), 기존 Systems·Learning 보고서와 REA 근거를 대조했다. 아래 표는 이번 주제에서 사용한 증거다. 동일 파일명의 다른 빌드를 구별하고, 공개 페이지에 배포된 스크립트와 테스트에서 선택한 소스 본문을 각각 추적했다. 전체 모듈 검증은 11차에 남아 있다.

## 주요 및 지원 모듈의 본문

주요 **23개**의 관련 본문을 확인했다. 현행 해시가 관찰된 15개는 새 배포 본문을 확보했고, 나머지 8개는 동일 URL 증거 또는 고정 워커 경로를 대조했다. 추가 **18개**는 연관 JavaScript·CSS의 현행 본문을 확보했다. 이 41행은 분석 범위이며 신규 모듈의 총수를 뜻하지 않는다. 다음 표와 별도로 현행 manifest 본문을 확인했다. 같은 배포 빌드라도 모든 기능의 실행을 의미하지 않는다.

| URL | 증거 상태 | 확인한 진입점·범위 |
|---|---|---|
| [boot.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1e41c00bd11390449702df86/boot.js) | 현행 빌드 본문 | 36~49행 시작·가드·지연 표시 |
| [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) | 현행 빌드 본문 | 532~564·1195~1208·1382~1394·2240~2318·2528~2536·2752행 초기화, 입력 및 장애 |
| [sw.js](https://starkkuk.com/sw.js) | 고정 경로 본문·요청 | 1~10행 루트 탐색, 생성형 안내 |
| [install.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/04ac9ef5e12baa98fef30b13/install.js) | 현행 빌드 본문 | 7~69행 설치 모드·제안·등록 |
| [browser-compat.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/54b3935e42ec8fc1b6d68e0b/browser-compat.mjs) | 현행 빌드 본문 | 3~27행 타임아웃·UA·외부 브라우저 |
| [external-browser.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7e7908b7c54d55250e452830/external-browser.js) | 현행 빌드 본문 | 12~52행 안내·URL 이동·수명 이벤트 |
| [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) | 동일 URL 본문 재확인 | 1~32행 채널 경로·저장 키·요청 래퍼 |
| [channel-entry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6efd01555121fe0e7f65b45c/channel-entry.mjs) | 동일 URL 본문 재확인 | 12~44행 언어 선택·채널 전환 |
| [channel-picker.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d031dd4c7a87911080a966ac/channel-picker.js) | 동일 URL 본문 재확인 | 3~29행 UI와 수동 선택 |
| [render-profile.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd18146b6d19e993d020232f/render-profile.mjs) | 기존 동일 URL 본문 재사용 | 1~6행 크기와 기기 특성 기반 품질 분기 |
| [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a3b1d88b0925d721cd7937e4/state.mjs) | 현행 빌드 본문 | 25~55행 버전 키·설정 정상화 |
| [play-support.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2ae68e188b3efcf2ed1770e0/play-support.mjs) | 현행 빌드 본문 | 10~89행 빌링 UI와 의존 |
| [play-support-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/79ac4112e839d43578e9c947/play-support-client.mjs) | 기존 동일 URL 본문 재사용 | 4~18·22~54·55~117행 환경·상품·재확인 |
| [hud-menu.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a178cf63653ecaf57bf2143/hud-menu.js) | 현행 빌드 본문 | 22~45행 메뉴 구조와 연결 |
| [hud-shortcuts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/929b1c699d4e6f8338a6e9f2/hud-shortcuts.js) | 현행 빌드 본문 | 13~31·38~94행 버튼·저장·키 입력·정리 |
| [privacy-notice.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5ba686bd277c8cc01d43ba50/privacy-notice.js) | 현행 빌드 본문 | 2~32행 로딩 종료 시 공지 |
| [telemetry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/065ad84158c7bb39c938fa29/telemetry.js) | 현행 빌드 본문 | 9~17·26~32행 통계·공지 경로 |
| [account-deletion-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/624cdc9e5c8a09b36aca9cf8/account-deletion-ui.mjs) | 현행 빌드 본문 | 9~51행 미리보기·동의·진행 및 완료 응답 |
| [account-link-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/36e555caa7872847b53f5e47/account-link-ui.mjs) | 동일 URL 본문 재확인 | 19~98·104~139행 코드·소유자·취소 |
| [family-invite.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4acdc000a12079c76c638e65/family-invite.js) | 현행 빌드 본문 | 7~32행 초대 접수와 세션 |
| [i18n.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5aeaf3adaf1051c3af4dcdb7/i18n.mjs) | 현행 빌드 본문 | 3~23행 현행 번역 및 포맷 |
| [i18n-app.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2fc60977dc85d50935fdac24/i18n-app.mjs) | 현행 빌드 본문 | 1행 이후 화면 문구 사전 |
| [i18n-shared.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/adf5edd1099e13bfec8101c2/i18n-shared.mjs) | 동일 URL 본문 재확인 | 1행 이후 공용 문구 사전 |
| [style.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0f52073776395e83c71f9094/style.css) | 현행 빌드 본문 | 3~38·76~80행 레이아웃·미디어 쿼리 |
| [hud-layout.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/892776c33230b59fc811674d/hud-layout.css) | 현행 빌드 본문 | 3~11·75·133~158·198행 HUD의 폭·높이·safe area |
| [hud-menu.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7a799c22a289ff4d1fb5944a/hud-menu.css) | 현행 빌드 본문 | 4~23행 메뉴의 레이어와 스크롤 |
| [hud-shortcuts.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/75a41f6af9286fbf97e25506/hud-shortcuts.css) | 현행 빌드 본문 | 20~35·123~129·177~202행 단축키 레일 |
| [pet-chat.css](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb90b8d22c2f65842ee09c9a/pet-chat.css) | 현행 빌드 본문 | 4·8·13~14행 대화창 폭·높이와 스크롤 |
| [site-stats.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ce99c035a180af240bb71eb3/site-stats.js) | 현행 빌드 본문 | 26~75행 조회의 가시성 정리 |
| [pet-chat-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2de9907e39e33bd1dbd60ab9/pet-chat-copy.mjs) | 현행 빌드 본문 | 3~7행 AI 조건부 안내 문구 |
| [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd4d8bfb2e95af4a301f2e49/pet-chat.js) | 현행 빌드 본문 | 12~18·32~59행 대화의 수명·설정 |
| [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59f6a087dbd27f69d544cc4e/locker-feed.js) | 현행 빌드 본문 | 8~35·39~95행 ETag·세대·캐시 |
| [niche-photo.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9d462ae0f5de5c830fda95d8/niche-photo.js) | 현행 빌드 본문 | 8~20·28~51행 캡처·공유·해제 |
| [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a61b9ce5a1a1f3754dc842e6/pet-avatar.js) | 현행 빌드 본문 | 184~215행 로더 import와 기본형 |
| [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59d9f0b49f2ec6ffd1900960/presence.js) | 현행 빌드 본문 | 131~158·191~205행 백오프·수명 이벤트 |
| [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd6d0eb0452f2c2bb42cc56a/auth.js) | 현행 빌드 본문 | 66~80·108~123행 계정·연결·탈퇴·로그아웃 |
| [popup-once.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e7913c89edfb4c9117ddacc0/popup-once.mjs) | 현행 빌드 본문 | 1~41행 IndexedDB·대체 저장소 |
| [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8b364569998c23aa4780b9b/custom-pet-avatar.js) | 현행 빌드 본문 | 9~23·59~118·194~216행 모델·압축·자원 임대 |
| [memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29091d5b1fc50374fbcef132/memorial.js) | 현행 빌드 본문 | 10~36·67행 기록 요청·갱신 |
| [photo-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7cc288d05ccb50668676e338/photo-input.mjs) | 현행 빌드 본문 | 3~21행 파일 준비·정리 |
| [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bbc9c8fcbb822e9b279892d2/pet-model-textures.js) | 현행 빌드 본문 | 3~17행 압축 GPU 텍스처의 지원 조건·변형 경로 |

[공개 manifest](https://starkkuk.com/manifest.webmanifest) 2~15행은 REA 원본의 6번 단계 DOM 원문에서 확인했다. 공개 홈의 기본 HTML은 이전 HTML 근거와 현재 시작 DOM/정적 파일 요청을 연결했다. 전체 HTML 원문·네이티브 패키지는 확보하지 않았다. [1차 HTML 근거](../01_Tech_Stack.md), [모바일 배포 보고서](../Systems/Mobile_PWA_Distribution.md).

## 정적 REA 증거

| 근거 묶음 | REA 증거 ID |
|---|---|
| 부트 구버전·워커·manifest | `ev_2d2c6f4783a113cff4706c5393c221ca9b50ea7d74982363fa2191c1ad1f6569` |
| 채널·상태·HUD·개인정보 초기 비교 | `ev_72c5f5ea87278f35323615cc38e1cf1f0955ff32b98ecec8c4ee89bdf6a74bde` |
| 계정·초대·i18n 초기 비교 | `ev_d422efb42586b1c1ccde0c1483734ae40d64a7fe5e2f0934094580445903c83e` |
| 현행 부트와 앱 | `ev_37c2a4f8f785e2c03b5c4cd94a157424467acca72208c8eee16f3d1196b95d4f` |
| 현행 모바일 CSS | `ev_11db3e265e3490d1c809d9478bc47d53b60568752725c6888dc468db20ae0562` |
| 현행 설치·호환·HUD·상태 | `ev_ccc96e874f0a467cd0e638475a0aa6fc949ce6a57a41a5433e97e1ecb1a5728d` |
| 현행 개인정보·통계·탈퇴·대화 | `ev_38490c168af20fdbe8ffa547ef81b8b743525a8bd265c9e4ae045b2be566ef8e` |
| 현행 조회·미디어·아바타·실시간·Play·i18n | `ev_6d651a3a46f91fcb8ab93cfa1ed8406f4d3984dc807df62d3862e05ca80ae684` |
| 현행 계정·팝업·모델·추모·사진 | `ev_56d08ece8a3696bf41bee897e8d122207accec37a04940f1ca615260f8276308` |
| 현행 압축 텍스처 보조 모듈 | `ev_20555a51b4b70bd66cc6786d0cfe752e22b4447cf7cb6d8f1601c96db1e74864` |

관련 이전 본문은 [배정 조회](../Systems/Locker_Allocation.md), [사진](../Systems/Photo_Media_Pipeline.md), [실시간](../Systems/Realtime_Presence_Networking.md), [렌더](../Systems/Three_Rendering.md), [장면](../Systems/World_Environment.md), [이동](../Systems/Movement_Camera_Interaction.md), [결제](../Systems/Payment_Sponsorship.md), [대화](../Systems/Pet_Conversation.md)에 있다. 9차 집계와 모델 로더의 원본 대조는 [정정 기록](Corrections_Log.md)에 연결했다.

## 실행 관찰

| 실험 | 환경 및 횟수 | 결과 및 증거 |
|---|---|---|
| 공개 홈 PC 크기 | Windows 기반 격리 Chromium 158.0.8127.88, 1280×720, DPR1, 신규 프로필 1회 | Canvas·메뉴 요소 가시성, manifest·SW 200 확인. 메뉴 클릭 5초 제한에서 시간 초과. 이후 단계 취소. REA `ev_6b602ce0de3ce47fddd15794e645dcb9ef2632c59ea984a92fe9dc65da963938`. |
| 공개 홈 좁은 크기 | 같은 브라우저, 390×844, DPR3, 신규 프로필 1회 | Canvas·메뉴 버튼 가시성과 manifest·SW 200 확인. 메뉴 클릭 시간 초과. 모바일 UA·터치 에뮬레이션 및 실제 모바일 기기는 사용하지 않았다. REA `ev_6e7f6e71236c0db16e4f455448b3d4cb4d785c29e00c560df31f238ce788275d`. |
| 좁은 화면 메뉴 재확인 | 같은 좁은 설정에서 로딩 레이어 제거를 기다린 후 Escape 및 공개 메뉴 제어를 시도한 별도 1회 | 로딩 제거 대기 통과. Escape 단계 성공은 오버레이가 실제로 닫혔다는 증거가 아니다. 메뉴 클릭에 다시 시간 초과가 났고 설치 안내와 닫기는 실행되지 않았다. REA `ev_0d13ff5589a0694e2df4095eb74c285891ab2ea16b3120ab8bc54f4441f5e25b`. |
| 독립 실습 | Windows Node 26.13.1, 로컬 Chrome 158.0.8127.88 | 정상·오류·경합 Node 10종 통과. 별도 루프백 Chromium 실습에서 Service Worker 등록·제어, Cache Storage 기록 및 재사용 검증 통과. 실제 서비스의 SW 실행 검증과 구분한다. [명령과 결과](../Learning/Labs/10_Mobile_Runtime/README.md). |

브라우저 실행에서 `service_workers:allow`를 사용했다. 요청 바디·응답 바디·헤더 값·저장소 값을 따로 수집하지 않았다. 페이지의 일반 초기 동작만 발생했고 직접 API 호출, 개인정보·모델 접근, 상태 변경을 실행하지 않았다. 시작 요청 수·단계 시간은 [성능 보고서](../Systems/Loading_Caching_Performance.md)에 있다. SW 요청 성공 외에 대상 페이지의 실제 제어, 설치, 주소창, 정상 이동·카메라 변화, 회전, 가시성 전환, 네트워크 장애 후 복구, FPS·전송량은 미확인이다.

## 11차 누적 검증과 통합 교재에 넘길 항목

| 우선순위 | 남은 모듈 또는 범위 | 남길 검증 자료 |
|---|---|---|
| 1 | [초기 272개 목록](Module_Inventory.md)의 요청 전용 행, [3D 지연 로딩 목록](3D_Module_Coverage.md), [9차 보류 목록](09_Module_Coverage.md). 예시로 `constellation-campfire-layout.mjs`와 `petnight-staff.js`의 관련 부분, 이번에 실제 메뉴에 나타나지 않은 동적 진입점. | 정확한 URL, 빌드·별칭, REA ID, 정적 본문/요청/import/실행, 사용자 역할, 행 또는 함수, 미확인 이유를 통합 표로 기록. 이번의 41행을 전체 모듈에 일반화하지 않는다. |
| 2 | 모바일 공개 화면의 메뉴·카메라, 회전, 터치·요소 가시성, OS 키보드, 다운로드·공유, 실제 SW 컨트롤러, 설치모드와 주소창. Android/iOS의 대응 기기, 브라우저 엔진, 스토어 설치. | 실제 기기·에뮬레이션을 분리한다. 공용 화면 동작만 확인하고, 가능할 경우 전송량·프레임 등은 브라우저·기기·캐시·반복 횟수와 함께 기록한다. |
| 3 | Apple/Play 네이티브 배포와 브리지, 푸시, 앱 업데이트, 공식 스토어 직접 목록. 현재 제작 모델의 지연 import와 편대 로더의 현행 버전. | 권한 있는 패키지 증거 또는 운영자 공개 문서가 있는 경우에만 비교한다. 9차 동일 URL과 10차의 버전 변경은 별도 기록한다. |
| 4 | 복구의 통합 사례 A–J, 계정 스위치·오류 재시도, 서버 원자성과 권한, 실제 대화 설정 안내. | 실제 사용자 데이터 대신 로컬 실습과 승인된 시험 환경에서 정상/오류/경합을 재현한다. 클라이언트의 검증·복구와 정책·서버 보장을 구분한다. |
| 5 | 전체 통합 코드 학습 교재. | 공개 시작 → 계정 → 공간·추모함 → 사진과 기록 → 실시간 → 3D → 경제/대화라는 순서에 사용자 이벤트·모듈·상태·저장·복구를 연결한다. 기존 교재와 새 실행 실습을 증거별로 연결한다. [10차 학습](../Learning/Mobile_Runtime_Code_Study.md). |
