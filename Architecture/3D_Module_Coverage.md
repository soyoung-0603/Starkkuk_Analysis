# 8차 3D 분석 범위와 모듈별 근거

확인일 **2026-11-25 (한국시간)** · [별꾹 공개 웹 클라이언트](https://starkkuk.com/)

[초기 스크립트 인벤토리](Module_Inventory.md)의 272개 URL과 이번에 확보·재사용한 REA 소스의 **버전 고정 URL**을 대조했다. 기준 목록 중 **120개**는 대조할 본문을 확보했다. 목록 밖에는 본문을 확보한 **11개**와 읽은 모듈에서 import 선언을 확인한 **24개**가 있다. 공개 JS를 정적 문서로 읽었으며 그 과정에서 게임·서비스 API를 직접 호출하거나 이용자의 에셋을 저장하지 않았다.

## 상태 기준과 문서별 범위

| 상태 | 적용 범위 |
|---|---|
| 본문 분석 완료 | 이번 학습 범위에서 모듈의 주요 입력·판단·반환까지 본문을 대조했다. 모든 브라우저 동작의 실행 검증을 뜻하지 않는다. |
| 일부 함수 확인 | 대표 함수와 연결 위치를 확인했다. 하위 분기·실행 결과는 남은 범위다. |
| 요청 또는 import만 확인 | 초기 요청 또는 읽은 소스의 import 선언이 근거다. 파일명으로 동작을 확정하지 않았다. |
| 추가 분석 필요 | 공개 소스 또는 기존 본문 근거가 있으나 이번에 상세 추적하지 않았다. 이전에 다룬 계정·게시판 등 인접 기능도 포함된다. |
| 접근 불가 | 정확한 공개 URL을 재시도해도 읽지 못한 경우에만 붙인다. 이번 선별 대상에 해당 모듈은 없었다. |

초기 목록의 상태 분포는 요청 또는 import만 확인 127개, 추가 분석 필요 47개, 일부 함수 확인 84개, 본문 분석 완료 14개다.

| 범위 | 본문으로 확인한 부분 | 미관찰·후속 범위 |
|---|---|---|
| 광장·시설·게시판 표식 | 공용 Geometry와 거리 기반 클릭, HUD, 전시 | 각 시설 입장·전시 내용, 관리자 개발실 |
| 일반 관과 테마 관 | 바닥·건물·가구·외부 공간, 장면별 빌더·조명·경계 | 12개 관 전체 왕복, 실내 효과와 기기별 성능 |
| 천문관 | 코드 기하·층 이동과 외부 환경 GLB 로더 | 실제 로딩·디코딩·치수·원본 제작 공정 |
| 산책·수목원·나무집 | 공원/마을·3채널 수목원·나무집 연결, 공용 기하·인스턴스 | 활동별 전용 입력과 화면 왕복, 수목원 데이터 갱신 |
| 추모함·제휴관·포캣멍 | 근접 카메라와 선반, 제휴관 건물·센터/지상 분기 | 승인된 모델·제휴 권한·운영자 서버 상태 |
| 활동과 행사 | 촛불·헌화·카페·눈사람·별자리·재회·숨바꼭질 및 별도 페이지 진입 | 실제 상태 변경, 행사 운영 여부, 별도 페이지 내부 엔진·에셋 |
| 캐릭터·렌더링 | 사람/반려동물, 셰이더, 정적 배치, 포즈·카메라·자원 정리 | 클립·디바이스별 시각 차이, 프레임 시간·메모리 실측 |

[공간별 개별 근거](../Systems/World_Environment.md) · [렌더 초기화와 자원 정리](../Systems/Three_Rendering.md) · [캐릭터와 GLB](../Systems/Pet_Character_Animation.md) · [이동·카메라](../Systems/Movement_Camera_Interaction.md) · [활동·효과](../Systems/Activities_Events.md)

## 9차 맞춤 제작·결제·운영 분석 순서

| 순서 | 모듈과 연결 위치 | 남은 확인 |
|---|---|---|
| 1. 신청과 검수 | `pet-model-request.js`, `pet-model-reference-photos.js`, `pet-model-revision.js`와 기존 [맞춤 제작 흐름](../03_Service_Flow_Pricing.md). 이후 `pet-avatar.js` 184~215행에서 승인 표시와 가시 로드를 추적한다. | 공개 화면의 가격·단계·수정 조건을 날짜와 함께 재검증하고 실제 검수 권한, 제작·자동화 과정은 입증 가능한 범위로 남긴다. |
| 2. 후원·결제와 장면 효과 | `support.js`, `play-support.mjs`, `constellation.js`와 앱 2827~2831행. 후원 UI·응답과 별자리 표식·안내의 연결을 확인한다. | 사용자 결제액, 서비스 운영비, 기부·구매 구분, 외부 결제·취소·환불·정산은 공개 조건과 확인된 결과를 구분한다. |
| 3. 제휴 및 운영 | `petnight-customer.js`, `petnight-world.js`, `partner-center.js`, `partner-ground-world.js`. 코드의 이용자 표시·역할 조건·장면 전환 지점을 구분한다. | 이용자/운영자 권한과 모델 보관 정책은 미확인이다. 운영자 메뉴의 존재와 비공개 데이터 접근은 별개로 취급한다. |
| 4. 재사용용 시각 검증 | 장면 왕복 시 상세 텍스처와 모델이 정상 해제되는지, 자체 실습 GLB로 Mixer와 브라우저 재생을 검증한다. | 실제 사용자의 자료 없이 재현하는 것이 가능한 범위에 집중한다. 8차에서 시행한 예제 검사는 문법에 한정한다. |

[pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) · [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) · [pet-model-revision.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/342bae9be0d1200b21b46ec9/pet-model-revision.js) · [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) · [play-support.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ebf0c4b3891317cc9c1d0435/play-support.mjs) · [constellation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0aa8fa22ac8269889ed9406d/constellation.js) · [petnight-customer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a4eeafe30447621e26141b4b/petnight-customer.js) · [partner-center.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/244ed923b69de2adc7a274fb/partner-center.js)

## 초기 목록 밖의 지연 경로와 하위 import

URL로 대조했다. 지연 경로의 본문을 확보했다는 것은 사이트가 첫 방문에서 해당 코드를 실행했다는 뜻과 구분한다. import 전용 행은 본문 검토가 남아 있다. 아래 범위는 분석한 소스의 리터럴 import로 제한되며 실행 중 계산되는 로딩 경로 전체는 미확인이다.

| 추가 공개 모듈 | 발견 경로와 위치 | 상태 | 확인 범위 |
|---|---|---|---|
| [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) | 동적 import · `pet-avatar.js` 185행 | 일부 함수 확인 | 19~120,121~216행 |
| [pet-customizer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/855cc44fc89a36f2b21ae765/pet-customizer.js) | 동적 import · `app.js` 870행 | 일부 함수 확인 | 25~64행 |
| [tree-home.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bacb744aa9b616aa612cf114/tree-home.js) | 동적 import · `app.js` 2623행 | 일부 함수 확인 | 12~34,68~78행 |
| [partner-center.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/244ed923b69de2adc7a274fb/partner-center.js) | 동적 import · `app.js` 2797행 | 일부 함수 확인 | 78~113,230~234,262~286행 |
| [constellation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0aa8fa22ac8269889ed9406d/constellation.js) | 동적 import · `app.js` 2827행 | 일부 함수 확인 | 13~72행 |
| [hide-seek-game.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/06af66f17571e9c52b6b533a/hide-seek-game.js) | 동적 import · `app.js` 2993행 | 일부 함수 확인 | 15~36,50~116행 |
| [reunion-game.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/210d8082448b2a57f3c90804/reunion-game.js) | 동적 import · `app.js` 2927행 | 일부 함수 확인 | 19~53,158,215~296행 |
| [tree-home-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/27820546dbe9ecc06c2ac717/tree-home-world.js) | 지연 모듈의 하위 import · `tree-home.js` 8행 | 일부 함수 확인 | 5~45행 |
| [partner-center-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2455010a6c580427a591d83e/partner-center-world.js) | 지연 모듈의 하위 import · `partner-center.js` 12행 | 일부 함수 확인 | 18~54행 |
| [partner-ground-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c58ab9b7c390ab16d5c8d38e/partner-ground-world.js) | 동적 import · `partner-center.js` 102행 | 일부 함수 확인 | 59~75,96~115행 |
| [pet-lifelike.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bd905dcf58b329203753766/pet-lifelike.js) | 지연 모듈의 하위 import · `custom-pet-avatar.js` 6행 | 일부 함수 확인 | 8행 진입과 Actor 연결 |
| [milk-formation-assets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/325c4b9fd48d143a2dde6fd0/milk-formation-assets.js) | import · `custom-pet-avatar.js` 1행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [pet-crayon-editor.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ef10c5435fa46383a76d2650/pet-crayon-editor.js) | import · `pet-customizer.js` 1행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-center-age.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d193fc817e55acc7d074b4ee/partner-center-age.mjs) | import · `partner-center.js` 8행 · `partner-center-world.js` 5행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-center-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/95b299bab00591ffb95dc7d9/partner-center-motion.mjs) | import · `partner-center.js` 13행 · `partner-center-world.js` 4행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-ground-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/97b9de3e564b144c7c2f5de6/partner-ground-ui.js) | import · `partner-center.js` 14행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-memorial-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9b023a0fc5a9e8642db92bed/partner-memorial-layout.mjs) | import · `partner-center.js` 15행 · `partner-center-world.js` 9행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [constellation-campfire.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0be03f18397a5f42c91d254a/constellation-campfire.js) | import · `constellation.js` 8행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [constellation-campfire-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2497cc1cde502660b6565a49/constellation-campfire-layout.mjs) | import · `constellation.js` 9행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [constellation-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b3a2eaaad162d55a572ead67/constellation-audio.js) | import · `constellation.js` 10행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [hide-seek-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/135e313345097c9b4f8cc59e/hide-seek-layout.mjs) | import · `hide-seek-game.js` 10행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [hide-seek-scenery.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c6354acf28ccaecf3f3d3453/hide-seek-scenery.js) | import · `hide-seek-game.js` 11행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [hide-seek-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/55e7ab4e16e87431bbfe5a1f/hide-seek-audio.js) | import · `hide-seek-game.js` 12행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [hide-seek-effects.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/883c829f581f30dbbdad39f6/hide-seek-effects.js) | import · `hide-seek-game.js` 13행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-waiting-pets.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fe1cce62062663977add869e/reunion-waiting-pets.mjs) | import · `reunion-game.js` 2행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-carry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1402d58076a5f6d553e1a5fd/reunion-carry.mjs) | import · `reunion-game.js` 4행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-course.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fb7cda58828ccfacf4fd13da/reunion-course.mjs) | import · `reunion-game.js` 5행 · `reunion-game.js` 11행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f1ac717a46b6fec92d5f63be/reunion-ui.js) | import · `reunion-game.js` 12행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-collectibles.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5d73d1428560cfcf5c62ca91/reunion-collectibles.js) | import · `reunion-game.js` 13행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/337ea7874b01250382131c85/reunion-audio.js) | import · `reunion-game.js` 14행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [reunion-fetch.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e30e074c11df61eaea9ac58e/reunion-fetch.mjs) | import · `reunion-game.js` 16행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-center-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b2fe5e3c1a079e9243712b2e/partner-center-layout.mjs) | import · `partner-center-world.js` 3행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [partner-center-sky.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3534cb6e0247fa6396f78391/partner-center-sky.js) | import · `partner-center-world.js` 6행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [KTX2Loader.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bfb4433aef4294a3e4fcd0eb/vendor/KTX2Loader.js) | 동적 import · `pet-model-textures.js` 6행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |
| [pet-lifelike-policy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c4fb190811e25a83fdcba98/pet-lifelike-policy.mjs) | import · `pet-lifelike.js` 2행 | 요청 또는 import만 확인 | 별도 정적 본문 확인 필요 |

## 기존 272개 스크립트 URL 전수 대조

초기 요청 번호와 상태는 기존 인벤토리에서 보존했다. 기존 표의 분류명은 탐색 편의를 위해 재사용했으며 요청 목록만으로 분류의 기능이 입증되는 것은 아니다. 이번 자세한 위치는 공개 코드 행 기준이다.

### 계정·추모함·사진·기록 (44개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [account-deletion-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d2c5dcef774ab6df33c920ce/account-deletion-ui.mjs) | request-85 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [account-link-ui.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/36e555caa7872847b53f5e47/account-link-ui.mjs) | request-86 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) | request-185 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) | request-80 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [candle-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8b4fa88be848c1c6bdcc1150/candle-layout.mjs) | request-313 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [candle-memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6048c8b4d99eeb49d3fefcd7/candle-memorial.js) | request-187 · 200 | 일부 함수 확인 | 163~255행 |
| [candle-orbit.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/249a6178f81924e578a8eb6d/candle-orbit.mjs) | request-190 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [candle-walk-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/dbc0291103fc26e596d4882a/candle-walk-layout.mjs) | request-189 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [candle-walk.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e85327607bf6f2275dc44824/candle-walk.js) | request-188 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [companion-lockers.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4ffbc87bf375a7b80467c498/companion-lockers.mjs) | request-146 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [family-invite.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/21717727ff26fd628e508148/family-invite.js) | request-142 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [letter-excerpt.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ef084faf9bf4165084a7ed21/letter-excerpt.mjs) | request-179 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-caption.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/04a18b86d7e383f7d73b3fa9/locker-caption.js) | request-182 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-clear-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb67c5df2c7a52126a3dc031/locker-clear-ui.js) | request-159 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-decor-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5e90e636f79ad29e2f5b2a9f/locker-decor-catalog.mjs) | request-326 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-decor-placement.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/137211db2a97d0496d6efa85/locker-decor-placement.js) | request-327 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-decor-surfaces.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3538fc28455bc5028d6e6095/locker-decor-surfaces.js) | request-247 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-decor-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ff3d4d8e5bd1f481498a4537/locker-decor-ui.js) | request-248 · 200 | 일부 함수 확인 | 12~31,47~78행 |
| [locker-decor.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/624e849fad57c91467dbee1a/locker-decor.js) | request-246 · 200 | 일부 함수 확인 | 장식 표시 연결 |
| [locker-doors.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7b531eb6a707c9b43c803430/locker-doors.js) | request-178 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) | request-143 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [locker-labels.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/996a893c1fcdbdee00613cf6/locker-labels.js) | request-181 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9d892d756353fbcffb84a6fc/locker-navigation.mjs) | request-192 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb7677c26d7a17ea7d835357/locker-photos.js) | request-195 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-picker.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1eb403d26ce7bea519ddcdad/locker-picker.js) | request-184 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-poll.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/10de7f10ee12ae264f3bc477/locker-poll.js) | request-139 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-report.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d5c4c3bff6d5d5ed04309279/locker-report.js) | request-160 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-share.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29b719b174185925519c3da6/locker-share.mjs) | request-186 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [locker-summary.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/173badde4100b4933be1e0c6/locker-summary.mjs) | request-289 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [memorial-candle-backdrop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a31a79d75bca26772f982489/memorial-candle-backdrop.js) | request-110 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [memorial-sites.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4259d56938eca07682aee93e/memorial-sites.mjs) | request-223 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [memorial.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) | request-232 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [niche-capture.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/178e70744f12bb6706f3c2f5/niche-capture.mjs) | request-161 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [niche-font.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5448643a4abb5d526d386dee/niche-font.js) | request-138 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [niche-photo.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js) | request-162 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [niche-selfie.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/67c6599771a6c97c23238257/niche-selfie.mjs) | request-169 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [niche-sky.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/37faf8bca29a62ce2d0a27a7/niche-sky.js) | request-111 · 200 | 일부 함수 확인 | 4~19행 |
| [photo-encoding.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a999c7e35755d788f901ef07/photo-encoding.mjs) | request-84 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [photo-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/904f7c0ddf5b269cc8d5a851/photo-input.mjs) | request-273 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [photo-source.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7c1f7a010ec2d1faec8408c1/photo-source.mjs) | request-137 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [reservations.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e98a31f48fed83ff6b1a3b80/reservations.mjs) | request-196 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [tribute-ceremony.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/90ab85578e0f19f3414d7217/tribute-ceremony.js) | request-177 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [tribute-light.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7451bfcf37701dcd06a04ecd/tribute-light.js) | request-176 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [tribute-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5706ec2a3d8affa9b3887175/tribute-ui.js) | request-175 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |

### 기반·채널·PWA (20개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) | request-101 · 200 | 일부 함수 확인 | 1186~1219,1381~1393,1921~2023,2239~2317,2535~2553행 |
| [boot.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9eb79b05d000f37c9762986b/boot.js) | request-66 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [browser-compat.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/067d7af69561901d54006bfb/browser-compat.mjs) | request-71 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) | request-67 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [channel-entry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6efd01555121fe0e7f65b45c/channel-entry.mjs) | request-68 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [channel-picker.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d031dd4c7a87911080a966ac/channel-picker.js) | request-65 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [dates.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/86d86e504b9c1c4975711d9a/dates.mjs) | request-230 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [external-browser.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/007b6f18814d8f3ae7baf1d8/external-browser.js) | request-75 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [i18n-app.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c51bcfac152da47d6df95125/i18n-app.mjs) | request-76 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [i18n-shared.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/adf5edd1099e13bfec8101c2/i18n-shared.mjs) | request-77 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [i18n.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c6d2686093628f4201eb2bbb/i18n.mjs) | request-70 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [install.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/801e78d0be6a1bb3a11b5d87/install.js) | request-45 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [popup-once.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e7913c89edfb4c9117ddacc0/popup-once.mjs) | request-73 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [privacy-notice.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/952745e15561314694d83aa7/privacy-notice.js) | request-43 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [seo-navigation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9eee6dd12ebf672663ca6485/seo-navigation.js) | request-158 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [site-stats.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2fee9065459547b60b2882f4/site-stats.js) | request-72 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [sns-links.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8b7c6672eebd16ab7ad1d4b/sns-links.js) | request-64 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fa3b0edd438780bfc581b2a/state.mjs) | request-250 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [sw.js](https://starkkuk.com/sw.js) | request-251 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [telemetry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f47455b4f1332aabd0963590/telemetry.js) | request-63 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |

### 공간·환경·조작 (76개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [arboretum.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bcbb0a0f0760230c21d74596/arboretum.js) | request-321 · 200 | 일부 함수 확인 | 8~17, 식생 갱신행 |
| [architecture.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/558a0e46d0078cb91d4146b0/architecture.js) | request-234 · 200 | 일부 함수 확인 | 5~23,152~165행 |
| [audio-settings.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0289edf89b22a154e9b84bec/audio-settings.js) | request-240 · 200 | 일부 함수 확인 | 1~25행 |
| [avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e4716f71b2eb05fa15928960/avatar.js) | request-191 · 200 | 일부 함수 확인 | 6~40,117~131,134~180행 |
| [beach-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd9abb28e6277b6daebbad5f/beach-audio.js) | request-221 · 200 | 일부 함수 확인 | 3~79행 |
| [beach-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cc1e6c612add50f447c6a5e5/beach-layout.mjs) | request-220 · 200 | 일부 함수 확인 | 10~24행 |
| [beach.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/62e6eeef35cacf93097dfc2c/beach.js) | request-203 · 200 | 일부 함수 확인 | 4~163행 |
| [camera-obstruction-bounds.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a115d105ad6d6317b2679af/camera-obstruction-bounds.js) | request-237 · 200 | 본문 분석 완료 | 5~49행 |
| [camera-obstruction.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/96dd8349a2b5869c4d1aca64/camera-obstruction.js) | request-236 · 200 | 일부 함수 확인 | 77~110,187~260행 |
| [camera-rig.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4c30cab07bf2bd8a893903b3/camera-rig.js) | request-235 · 200 | 일부 함수 확인 | 3~21,43~86,88~125행 |
| [candy-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a3a7cbe6afc076bbbce2fe3/candy-layout.mjs) | request-208 · 200 | 일부 함수 확인 | 레이아웃 설정부 |
| [candy.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/829ae3cd3eb7894703598c65/candy.js) | request-207 · 200 | 일부 함수 확인 | 13~32,201~217행 |
| [cloud-atmosphere.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d8282d9253d6feedfec46306/cloud-atmosphere.mjs) | request-218 · 200 | 일부 함수 확인 | 4행 builder와 갱신 |
| [cloud-layout-factory.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ed55fe1865705663953823f8/cloud-layout-factory.mjs) | request-265 · 200 | 일부 함수 확인 | 3~13,40~78행 |
| [cloud-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b575c2f194656ffcd02aaad6/cloud-layout.mjs) | request-219 · 200 | 일부 함수 확인 | 1~2행 |
| [cloud.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/144b6cb45b656bb3fbba0b10/cloud.js) | request-204 · 200 | 일부 함수 확인 | 5~68행 |
| [constellation-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/074c027c0173faf7d6e8ca1c/constellation-layout.mjs) | request-166 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [forest-hall.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ec5b1fe6c943e66626bef9ad/forest-hall.js) | request-127 · 200 | 일부 함수 확인 | 5~20,193~196행 |
| [forest-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/55116729873fb85bfe58144d/forest-layout.mjs) | request-126 · 200 | 일부 함수 확인 | 11~52행 |
| [forest-notes.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8eedfe853b671d6c13826b5e/forest-notes.js) | request-128 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [garden-ambience.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c961a7259b630e48d099bce6/garden-ambience.js) | request-200 · 200 | 일부 함수 확인 | 2~19행 |
| [garden-apartments.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b130e7a44b1e9cfc5e4191c7/garden-apartments.js) | request-318 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [garden-atmosphere.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/06ab6963fb838160b89b1f20/garden-atmosphere.js) | request-201 · 200 | 일부 함수 확인 | 2~16행 |
| [garden-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/75c40c84594bf0a944ab732b/garden-layout.mjs) | request-229 · 200 | 일부 함수 확인 | 3~8,19~38행 |
| [garden-pet-path.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a1f29e9759d45c389f6e2ec9/garden-pet-path.mjs) | request-292 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [garden-village-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ac2d6296d02c10f002d037ed/garden-village-layout.mjs) | request-157 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [garden-village.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e71dade61856b01858ff310/garden-village.js) | request-319 · 200 | 일부 함수 확인 | 5~33,142,210행 |
| [garden.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/658e736a8a4a6728ee418b72/garden.js) | request-199 · 200 | 일부 함수 확인 | 6~48행 |
| [grove-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/49fc60a0b3a5bdc5ac551b41/grove-appearance.mjs) | request-323 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [grove-fireflies.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2b6f7e1787e3bda016268b0e/grove-fireflies.js) | request-322 · 200 | 일부 함수 확인 | 38~52행 |
| [grove-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f393165c350b75300085c724/grove-layout.mjs) | request-227 · 200 | 일부 함수 확인 | 2~24행 |
| [grove-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2301d6417f92f29d8fda2aad/grove-ui.js) | request-225 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [grove.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c531b74924095b7f5bf72a41/grove.js) | request-224 · 200 | 일부 함수 확인 | 13~76,93~108행 |
| [hall-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e449349a663bb4f1b5350268/hall-layout.mjs) | request-231 · 200 | 일부 함수 확인 | 3~57행 |
| [hall-select.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/38d6e325217e8b5fd7f70518/hall-select.js) | request-210 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [hud-menu.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0e5af2d2eae1750b3f989600/hud-menu.js) | request-163 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [hud-shortcuts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0ff6d576091efcb98408042f/hud-shortcuts.js) | request-168 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [interaction-hints.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/35b5dd631e69baf67aaa9017/interaction-hints.js) | request-183 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [library-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/28298076f10d296ba43c6077/library-layout.mjs) | request-105 · 200 | 일부 함수 확인 | 20~24행 |
| [library.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/947551657d599684369cdfec/library.js) | request-106 · 200 | 일부 함수 확인 | 71~174행 |
| [meadow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4a4cc7b0bdef42e32ce88e11/meadow-layout.mjs) | request-222 · 200 | 일부 함수 확인 | 8~22행 |
| [meadow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/69c7941950a2aebf2a6a2383/meadow.js) | request-202 · 200 | 일부 함수 확인 | 13~57,59~89행 |
| [moonlight-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5cc1812fcdf3278119bd5507/moonlight-layout.mjs) | request-108 · 200 | 일부 함수 확인 | 레이아웃 설정부 |
| [moonlight.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a14fb7dc3422d5ca61b65f47/moonlight.js) | request-109 · 200 | 일부 함수 확인 | 7,64~74행 |
| [movement-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/583ec8f3387c9c707c537017/movement-settings.mjs) | request-193 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [music-controls.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/441681adb8d2e4b9bff161b7/music-controls.js) | request-239 · 200 | 일부 함수 확인 | 볼륨 메뉴 연결 |
| [music-tracks.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/62f1919aa0289f563d713cf4/music-tracks.mjs) | request-325 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [music.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c810c559d8764e3a0816cfcb/music.js) | request-238 · 200 | 일부 함수 확인 | 25~31,59~101,117~187행 |
| [navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0dc53911b1dadb58e3c01ecc/navigation.mjs) | request-242 · 200 | 본문 분석 완료 | 19~91행 |
| [observatory-finishes.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7e1fb5a8924d3ff1efdf2387/observatory-finishes.js) | request-258 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [observatory-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0268ce033ee1093a16ae6f1e/observatory-layout.mjs) | request-103 · 200 | 일부 함수 확인 | 15~31행 |
| [observatory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d0ff6a1cb737ee74f0aff3f1/observatory.js) | request-104 · 200 | 일부 함수 확인 | 4~84행 |
| [placement.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8a32dcb052063facce2b2ae0/placement.mjs) | request-241 · 200 | 본문 분석 완료 | 3~18행 |
| [portal-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/060a28736e96282eeca588bc/portal-layout.mjs) | request-264 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [portal-title.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e2a6738a97601e9744dc2496/portal-title.js) | request-282 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [rainbow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a27e05555c936ee24d669744/rainbow-layout.mjs) | request-217 · 200 | 일부 함수 확인 | 레이아웃 설정부 |
| [rainbow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/137c19064f871ac905c5b2e1/rainbow.js) | request-205 · 200 | 일부 함수 확인 | 5,161~176행 |
| [render-profile.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd18146b6d19e993d020232f/render-profile.mjs) | request-141 · 200 | 본문 분석 완료 | 1~6행 |
| [room-shapes.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c92dd147fd6e948cbb4b37f5/room-shapes.mjs) | request-268 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [room-surface.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/199afdda12028e5d860b32ba/room-surface.js) | request-115 · 200 | 일부 함수 확인 | 8~35,37~65,69~103행 |
| [seating.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f6157584c4acc3f84c5250e2/seating.js) | request-233 · 200 | 본문 분석 완료 | 1~11행 |
| [snow-audio.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8c3b3722df24ff61b222a5b7/snow-audio.js) | request-211 · 200 | 일부 함수 확인 | 1~31행 |
| [snow-care.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1c0887c6f5d8a4bd095cee49/snow-care.js) | request-212 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [snow-effects.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b3240114d46a487f91adec34/snow-effects.js) | request-320 · 200 | 일부 함수 확인 | 2~39행 |
| [snow-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e489beb821eadfc93d8e5d4d/snow-layout.mjs) | request-209 · 200 | 일부 함수 확인 | 7~65행 |
| [snow.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/725222def04f98878dafbf7f/snow.js) | request-206 · 200 | 일부 함수 확인 | 7,155~161행 |
| [snowman-activity.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1f0df51a2982418df2f08f04/snowman-activity.js) | request-214 · 200 | 일부 함수 확인 | 34~123행 |
| [snowman-model.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ab26bf8ef316126a03ef5a7/snowman-model.js) | request-213 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [snowman-space.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/760ce5bc758356b468eb592e/snowman-space.mjs) | request-216 · 200 | 일부 함수 확인 | 눈사람 공간·크기 경계 |
| [snowman-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bdeb8cb1f562d80bf31b7a1c/snowman-world.js) | request-215 · 200 | 일부 함수 확인 | 19~50,67~124행 |
| [static-batch.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29617a6f29e55d9c6b62567d/static-batch.js) | request-228 · 200 | 본문 분석 완료 | 3~46행 |
| [themed-portals.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bdc5ce501b0b7c5671e4a83/themed-portals.js) | request-283 · 200 | 일부 함수 확인 | 장면 포털 연결 |
| [travel-portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/762c88805d8d936f8f378a27/travel-portal.js) | request-132 · 200 | 일부 함수 확인 | 15~27행 |
| [vault.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/072b9e757b0ec0f428b0f5c7/vault.js) | request-324 · 200 | 본문 분석 완료 | 3~4행 |
| [world-motion-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4293c00ac29158a11c0c4b6c/world-motion-client.mjs) | request-328 · 200 | 일부 함수 확인 | 4~44행 |
| [world-movement.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0acd6ad644ad550302baa7f4/world-movement.mjs) | request-243 · 200 | 본문 분석 완료 | 6~59행 |

### 공개 이벤트·시설과 도구 후보 (27개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [attendance-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae95360b169a03e150d40f3c/attendance-copy.mjs) | request-263 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [attendance.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/382ca375e51f93b43db2c0b0/attendance.js) | request-119 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [cafe-activity.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0bd97c47c10d39e92cf9f27d/cafe-activity.js) | request-155 · 200 | 일부 함수 확인 | 35~106행 |
| [cafe-orders.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fe07f6b01966ca78f4f037e8/cafe-orders.mjs) | request-297 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [cafe-ready-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b9f81bf41e1fa8811e4829c9/cafe-ready-sound.js) | request-156 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [cafe-staff.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a8ec3afac34bd22e0228ebb7/cafe-staff.js) | request-346 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [cafe-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2547aff0b02a21609b47c886/cafe-ui.js) | request-154 · 200 | 일부 함수 확인 | 11~51,144행 |
| [chapel/event.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c6d2d25a71fab26b2290fb5a/chapel/event.mjs) | request-284 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [chapel/portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/eea144a5496178034282aa39/chapel/portal.js) | request-134 · 200 | 일부 함수 확인 | 진입 표식 생성부 |
| [construction/entry.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6497daa1297d9746afc69218/construction/entry.mjs) | request-287 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [construction/event-portal.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/dd48762431153a0ddd87e4e3/construction/event-portal.js) | request-133 · 200 | 일부 함수 확인 | 5~32행 |
| [contest-config.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0396d51df36c3b9934c080d3/contest-config.mjs) | request-337 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [contest-preview.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/506470a0911e2a68ca2c9f4c/contest-preview.mjs) | request-336 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [contest-results.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d914b71e90b2b4d373d8ad22/contest-results.mjs) | request-334 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [contest-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/eacd396d57bf79b5c9046a15/contest-ui.js) | request-271 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [daily-activities-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fd7e68acd397b8a4028c0b6b/daily-activities-copy.mjs) | request-311 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [dev-studio/facade.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3122115618306157fdc71edc/dev-studio/facade.js) | request-275 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [dev-studio/models.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d963dfedf25bc50862250049/dev-studio/models.js) | request-335 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [lantern-icon.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2aa2e18588beaeab3189d08e/lantern-icon.mjs) | request-304 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pebble-actions.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1a052c07e6d77650160012fd/pebble-actions.js) | request-174 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pebble-garden.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d61eb3932a515c6a922a5eb5/pebble-garden.js) | request-172 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pebble-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e8a60e8e61bc50cccf7692c/pebble-layout.mjs) | request-312 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pebble-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/022a20e2e267a1c49366935f/pebble-ui.js) | request-173 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [ritual-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2401da7b6733defa4986ae/ritual-sound.js) | request-180 · 200 | 일부 함수 확인 | 의식 효과음 제어부 |
| [temple-ceremony/entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a40a65e8804655eb248e086/temple-ceremony/entry.js) | request-74 · 200 | 일부 함수 확인 | 5~34행 |
| [temple-ceremony/schedule.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0c8fe5d80d6b920242cd35f9/temple-ceremony/schedule.mjs) | request-78 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [temple/layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/896289b08981cc2d73d01b74/temple/layout.mjs) | request-83 · 200 | 일부 함수 확인 | 별도 사찰 레이아웃 |

### 반려동물·맞춤 모델·활동 (49개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [gift-inventory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e343dcd26613f728b8fbd42/gift-inventory.js) | request-129 · 200 | 일부 함수 확인 | 36~108행 |
| [gift-placement-guide.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a9a4f2099fec256c5fc458c7/gift-placement-guide.js) | request-130 · 200 | 일부 함수 확인 | 배치 가이드 입력부 |
| [gift-trash.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a2082f899c3d2a59a6b800f1/gift-trash.js) | request-117 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [kkuki-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/17a6258121f0ca55c259feb1/kkuki-catalog.mjs) | request-261 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [kkuki-reward.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/08d1eaa1aeba288ac43c1d1a/kkuki-reward.js) | request-262 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [kkuki-shop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae4b8e53f1fa7c7aaf794cb8/kkuki-shop.js) | request-118 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [milk-skin-formation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2fea7fa9d3f38f80df6532/milk-skin-formation.js) | request-151 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [milk-skin-review.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/615fda2a30b8591a337453b7/milk-skin-review.js) | request-152 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [milk-skin-status.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/027266a918d6943f45ecc744/milk-skin-status.mjs) | request-298 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-activity-model.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6b76c16bfbaeefe7ebcb8fe2/pet-activity-model.mjs) | request-285 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-appearance-model.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/297cc4e6c2fac531772a8436/pet-appearance-model.js) | request-295 · 200 | 본문 분석 완료 | 7~47행 |
| [pet-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ea5a9c58220e6694b1c6419/pet-appearance.mjs) | request-286 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-avatar-extras.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/352db75ecb339d15fef2788c/pet-avatar-extras.js) | request-294 · 200 | 일부 함수 확인 | 32~165행 |
| [pet-avatar-mammals.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ca2a133b175313a812d5d835/pet-avatar-mammals.js) | request-340 · 200 | 일부 함수 확인 | 6~26,110~146행 |
| [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) | request-144 · 200 | 일부 함수 확인 | 39~53,62~181,184~215행 |
| [pet-camera-gaze.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b782814155a4332e7ab79718/pet-camera-gaze.js) | request-303 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-carry-pose.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/61d986d1ee3bd96cfa53b1de/pet-carry-pose.js) | request-291 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [pet-carry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/41870d51782c8ff35b4d7577/pet-carry.js) | request-148 · 200 | 일부 함수 확인 | 19~46행 |
| [pet-chat-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/51a5a5771859749cc4b2bc1f/pet-chat-copy.mjs) | request-314 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a5b2cc8aba470fa17f661ef/pet-chat.js) | request-197 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-coat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/591bc2ccc48da07c7b4032d4/pet-coat.js) | request-293 · 200 | 본문 분석 완료 | 3,33~81행 |
| [pet-companions.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fe19a95f540ae4cd25ee8ec/pet-companions.js) | request-145 · 200 | 일부 함수 확인 | 22~78,204~250행 |
| [pet-crayon.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8caa5a2ba75961be010de8e/pet-crayon.js) | request-339 · 200 | 일부 함수 확인 | 16~42행 |
| [pet-crayon.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a3f06f3498bf60ac7616386c/pet-crayon.mjs) | request-344 · 200 | 본문 분석 완료 | 2~40행 |
| [pet-management-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2e155a3e2c904bd70ef0d019/pet-management-ui.js) | request-170 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-model-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a443b0eeaf6817eb5a6321b0/pet-model-copy.mjs) | request-308 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) | request-310 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) | request-167 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-model-revision.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/342bae9be0d1200b21b46ec9/pet-model-revision.js) | request-309 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js) | request-102 · 200 | 본문 분석 완료 | 3~16행 |
| [pet-motion-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d89711d294b5863e59ea2e5/pet-motion-settings.mjs) | request-338 · 200 | 본문 분석 완료 | 2~24행 |
| [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) | request-116 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-reaction.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0046ffd5fd8dbe7d7bccceec/pet-reaction.mjs) | request-315 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [pet-ride-pose.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8b667171433f032294da51a2/pet-ride-pose.js) | request-288 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [pet-ride.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e18bf6b091339667a3777084/pet-ride.js) | request-147 · 200 | 일부 함수 확인 | 26~52행 |
| [pet-size.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f5c3ee414f4391e2292c5d79/pet-size.mjs) | request-149 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [pet-sound.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d567e9e55809d68a5a8388d/pet-sound.js) | request-316 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [pet-species.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4b911a7216d2563f36ae9def/pet-species.mjs) | request-140 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [petting-comparison.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/029aca83ad49397e5661c8bd/petting-comparison.js) | request-317 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [petting.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f2eb0aa75380bb5e2abcfe01/petting.js) | request-198 · 200 | 일부 함수 확인 | 20~78행 |
| [tree-rest.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/667d2056ee67ded79adfa9d2/tree-rest.mjs) | request-226 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-care-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7740e997ada7c857b84d6842/walk-care-layout.mjs) | request-296 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-care.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/38165cfcb8cd89f00b5734e7/walk-care.js) | request-153 · 200 | 일부 함수 확인 | 118~180행 |
| [walk-pet-behavior.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/32e24314dd6aaa9f79127d47/walk-pet-behavior.mjs) | request-300 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-pet-wander.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2237ebb12b9a9bb7f70f3ea6/walk-pet-wander.mjs) | request-302 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-play-hearts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4431785b988488ab54e90270/walk-play-hearts.js) | request-301 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-play.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b1bd33d7eb886e5019541c30/walk-play.js) | request-150 · 200 | 일부 함수 확인 | 3~54행 |
| [walk-together-context.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/adf934ad086cee13fc0b90a8/walk-together-context.mjs) | request-136 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [walk-together-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e45c858a27d4f28552bb4433/walk-together-entry.js) | request-135 · 200 | 일부 함수 확인 | 6행 및 진입 콜백 |

### 광장·소통·접속 상태 (37개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [my-posts.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7921bbb166a9588a8c16965a/my-posts.js) | request-269 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [nickname-label.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e894fe00efc161dc2b9735b2/nickname-label.js) | request-171 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [player-visibility.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b1b578b0a82ab7befa475967/player-visibility.mjs) | request-267 · 200 | 본문 분석 완료 | 1~4행 |
| [plaza-boards-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) | request-122 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [plaza-boards-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b2842ee2f9e04ad927430932/plaza-boards-world.js) | request-276 · 200 | 일부 함수 확인 | 7~40행 |
| [plaza-comments.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c7780c2d88aef845fe4edcc/plaza-comments.js) | request-272 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [plaza-drawing.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/babafb60eb43060120ccd220/plaza-drawing.js) | request-274 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [plaza-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/26612745a41aa3a485239c79/plaza-entry.js) | request-124 · 200 | 일부 함수 확인 | 3~25행 |
| [plaza-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b090ae853a7fe76b6c69527f/plaza-layout.mjs) | request-120 · 200 | 일부 함수 확인 | 4~81행 |
| [plaza-map.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8f051047984f25ece37c480f/plaza-map.mjs) | request-266 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [plaza-pet-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/37fa564a306d96184251c5cb/plaza-pet-motion.mjs) | request-343 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [plaza-pet-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/09e4dc6cca17d1ddf9e67e35/plaza-pet-ui.js) | request-125 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [plaza-pets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd1c272f30e9fe7ecd60db02/plaza-pets.js) | request-277 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [plaza-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f71da449ab11b071c789ad08/plaza-world.js) | request-121 · 200 | 일부 함수 확인 | 10~55,101~107,174~177행 |
| [presence-delta.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a906949d59b7ed7a6d85134/presence-delta.mjs) | request-345 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [presence-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c1c26e9f7fa75a3ce4a68e74/presence-motion.mjs) | request-194 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [presence-protocol.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/31fcd953f5b855dfc6b18d97/presence-protocol.mjs) | request-332 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [presence-transport.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs) | request-329 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) | request-244 · 200 | 일부 함수 확인 | 75~126,265~299행 |
| [reunion-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c45ec4b14dd8f0f30a1460b/reunion-entry.js) | request-131 · 200 | 일부 함수 확인 | 진입 UI 연결 |
| [reunion-live-protocol.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/489f560f56cfed23e99c43d5/reunion-live-protocol.mjs) | request-347 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [reunion-realtime.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/14ec48c5e3d7e431bfae6d22/reunion-realtime.js) | request-330 · 200 | 일부 함수 확인 | 5~48행 |
| [snapshot-delta.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/09a385d34e94f5359f8f58f3/snapshot-delta.mjs) | request-290 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [social-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c15ee9996fc6fbc3a8b8a730/social-copy.mjs) | request-270 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [social-presets.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3ad26ee02a8a00036d2d35df/social-presets.mjs) | request-348 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [social.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/85ceca4c296ca59271744cf0/social.js) | request-331 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [star-friends-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/84369113b04db48e4ce4788a/star-friends-copy.mjs) | request-307 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [star-friends-navigation.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b26dd5ed6aae99c94f054598/star-friends-navigation.mjs) | request-165 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [star-friends.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/52a07091160d03a9687bb409/star-friends.js) | request-164 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [today-stars-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/53cfec2f7bcde135c3ed0f79/today-stars-copy.mjs) | request-279 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [today-stars-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/418c498ec132549ef8fc832f/today-stars-feed.js) | request-280 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [today-stars-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb798f7e537ba4766d08a40f/today-stars-world.js) | request-278 · 200 | 일부 함수 확인 | 8~22행 |
| [today-stars.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/293fd53262524135b49b2a09/today-stars.js) | request-123 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [visit-ranking.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ba9302ff0ad75bbb15fa9866/visit-ranking.js) | request-305 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [visit-stay-format.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6614be3107a03b4fababf35f/visit-stay-format.mjs) | request-306 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [visit-stay-label.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6f0d5cc07372e9ca4510f11e/visit-stay-label.js) | request-333 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [visitor-names.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ab7c5a7d53f5bdacafc39328/visitor-names.mjs) | request-107 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |

### 후원·제휴 (12개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [partner-ground-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1a519a2f55149db9c436a41b/partner-ground-appearance.mjs) | request-342 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [partner-ground-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/831177a5724a6444c4038899/partner-ground-avatar.js) | request-341 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [partner-ground-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/7a4351f395a1cd1b71a05723/partner-ground-layout.mjs) | request-352 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [partner-ground-motion.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ca6ae4c25d12a71d57495128/partner-ground-motion.mjs) | request-351 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [petnight-customer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a4eeafe30447621e26141b4b/petnight-customer.js) | request-113 · 200 | 추가 분석 필요 | 공개 본문 확보 · 8차 함수 추적 미완료 |
| [petnight-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ce26653e871f9e07894d7403/petnight-layout.mjs) | request-112 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [petnight-staff.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6e76ed1cdb55e0b02564379f/petnight-staff.js) | request-259 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [petnight-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59033aa044351908c46e2766/petnight-world.js) | request-114 · 200 | 일부 함수 확인 | 5~94행 |
| [play-support-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/79ac4112e839d43578e9c947/play-support-client.mjs) | request-81 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [play-support.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ebf0c4b3891317cc9c1d0435/play-support.mjs) | request-82 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |
| [support-receipt-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b07e38f2cfb63bedfcfa8125/support-receipt-input.mjs) | request-79 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) | request-69 · 200 | 추가 분석 필요 | 기존 보고서 본문 근거 · 8차 추적 보류/범위 외 |

### 기타 (1개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [tree-home-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/290d1777080cb0a31391a466/tree-home-layout.mjs) | request-349 · 200 | 일부 함수 확인 | 나무집 레이아웃과 경계 |

### 외부 렌더링·도우미 (6개)

| 공개 모듈 | 초기 요청 | 상태 | 위치·범위 |
|---|---|---|---|
| [vendor/BufferGeometryUtils.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb2d3a3bca1770e540cfa655/vendor/BufferGeometryUtils.js) | request-281 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [vendor/GLTFLoader.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/091b522ef07f7f619bb1f001/vendor/GLTFLoader.js) | request-257 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [vendor/OrbitControls.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d929a2b733f5c1825282f1f4/vendor/OrbitControls.js) | request-249 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [vendor/SkeletonUtils.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2b6c2bae5312823ca42286dd/vendor/SkeletonUtils.js) | request-350 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [vendor/three.core.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4ae0e9752a73114c492ea23d/vendor/three.core.js) | request-299 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |
| [vendor/three.module.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e390621736c3b55667fef003/vendor/three.module.js) | request-254 · 200 | 요청 또는 import만 확인 | 초기 요청 목록 · 이번 본문 미확인 |

## REA 출처

초기 요청의 기준은 `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`다. 앱과 광장 본문 `ev_e0372954d3510cc68d6bd8d96e538e4f2684c06a11a1751141fd933a88456f69`, 실시간 `ev_06758cbf1f01b6ca71d69ce5cd580051070a495fceec4420ac5bf5797b14cc80`, 아바타 및 전시 `ev_5c5d7fbc69d842aa4689b10e209b60c43fd0848e3216d43ef168fdb3c861d7ae`, 추가 모션 `ev_0e92ec95fa2325ea0d5a25d51e23fefc47a5f624bfe804fca88e1a918905e511`를 재사용했다. 공개 정적 파일을 묶어 요청한 8차 증거는 아래와 같다. URL을 이미 알고 있던 파일만 본문을 확인했고, 보고서에 있는 링크로 받은 실제 모델·사진 로딩을 시도하지 않았다.

| 묶음 | REA Evidence ID | 정적 본문 파일 |
|---|---|---|
| 1 | `ev_c8009b841fd62bc727c2e04a0a6982c8d4b6df9b8603abf9387239e9232706e3` | `render-profile.mjs`, `static-batch.js`, `camera-rig.js`, `camera-obstruction.js`, `camera-obstruction-bounds.js`, `world-movement.mjs`, `navigation.mjs`, `placement.mjs` |
| 2 | `ev_7c4bc06be8718166b109d740c78c4d683e005ed0e109a86648dae401bde8aee6` | `architecture.js`, `hall-layout.mjs`, `meadow.js`, `beach.js`, `cloud.js`, `rainbow.js`, `snow.js`, `candy.js` |
| 3 | `ev_7e55282eb6e469386bdc6434d48c0cd8159c2a81adfe7cd26abcecf6848b704c` | `forest-hall.js`, `moonlight.js`, `library.js`, `observatory.js`, `garden.js`, `grove.js`, `arboretum.js`, `vault.js` |
| 4 | `ev_ce465912a6ecb1a7e58670a1578001c0da3fd801edd9b239046bad2f74ee9ea3` | `pet-avatar.js`, `pet-avatar-mammals.js`, `pet-avatar-extras.js`, `pet-companions.js`, `pet-coat.js`, `pet-motion-settings.mjs`, `custom-pet-avatar.js`, `pet-customizer.js` |
| 5 | `ev_dd3ff22f5bf64039493417f2d78b443ac0df87e9b407d946dc17f251aba78b78` | `pet-crayon.js`, `pet-crayon.mjs`, `petting.js`, `pet-carry.js`, `pet-ride.js`, `walk-play.js`, `walk-care.js`, `gift-placement-guide.js` |
| 6 | `ev_9666fe801255e08365e9e0efcd2b16cb0a01bc36f4a1074e2f9af95ea330040a` | `music.js`, `audio-settings.js`, `garden-ambience.js`, `snow-effects.js`, `grove-fireflies.js`, `candle-memorial.js`, `snowman-activity.js`, `cafe-activity.js` |
| 7 | `ev_62fed7fad22d9f5818742d34bf650ce26c02635f2d08b337cb010c0a33ddc9a6` | `tree-home.js`, `partner-center.js`, `constellation.js`, `hide-seek-game.js`, `reunion-game.js`, `travel-portal.js`, `petnight-customer.js`, `room-surface.js` |
| 8 | `ev_46d0bcdb17f4c6a21abcb98eb44fa9af9d39a29f633d77e360e6e596494f5645` | `meadow-layout.mjs`, `beach-layout.mjs`, `cloud-layout.mjs`, `rainbow-layout.mjs`, `snow-layout.mjs`, `candy-layout.mjs`, `moonlight-layout.mjs` |
| 9 | `ev_734383d01b35402d2ae3ccf9159f2d6f236cc59080b256b69fa7790e9fc9dd15` | `garden-layout.mjs`, `garden-village.js`, `grove-layout.mjs`, `observatory-layout.mjs`, `library-layout.mjs`, `forest-layout.mjs` |
| 10 | `ev_2886197f2dd864c5b2ae07e1fb3893cedb02eeb52ca7c56420551f1744ded40a` | `tree-home-world.js`, `partner-center-world.js`, `cafe-ui.js`, `gift-inventory.js`, `music-controls.js`, `beach-audio.js`, `snow-audio.js` |
| 11 | `ev_7f307a64528235b257cd4723e1dec026b300181b862b631bd4d2f800a18237fa` | `gift-placement-guide.js`, `locker-decor.js`, `niche-sky.js`, `garden-atmosphere.js`, `snowman-world.js`, `walk-together-entry.js`, `ritual-sound.js` |
| 12 | `ev_a853764ba872209ea712ee205cefd5220d0923c2a5e3748adecf8ce97e14e5c0` | `petnight-world.js`, `locker-decor-ui.js`, `cloud-atmosphere.mjs`, `snowman-space.mjs`, `grove-appearance.mjs` |
| 13 | `ev_f4b35d1187b47840d79bf1eb6d2e2b077d60c6799b21e8bad731d6a575c026cd` | `event-portal.js`, `portal.js`, `layout.mjs`, `entry.js`, `garden-apartments.js`, `themed-portals.js`, `reunion-entry.js` |
| 14 | `ev_60111e1832e4575f2febc7f631e337626ad3efeaf3834f9932d713e6955e5ee1` | `partner-ground-world.js`, `tree-home-layout.mjs`, `cloud-layout-factory.mjs`, `seating.js`, `pet-appearance-model.js` |
| 15 | `ev_afe5073da2064529c37ab36179bcd3426e5056a2a001117dac3c5c82c5a02ce1` | `pet-model-textures.js`, `pet-lifelike.js`, `pet-carry-pose.js`, `pet-ride-pose.js`, `pet-sound.js` |
