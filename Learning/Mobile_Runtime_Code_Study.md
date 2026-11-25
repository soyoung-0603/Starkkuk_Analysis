
# 모바일 런타임 코드 학습

2026-11-25 KST. 웹 기반 3D 앱의 화면 상태, 네트워크 상태, 자원 상태를 코드에서 읽는 법과 로컬 실습을 정리했다. 실제 서비스의 원본 코드나 고객 데이터를 예제에 쓰지 않았다.

## 흐름을 읽는 기준

1. **앱 시작과 렌더 시작.** HTML의 로딩 요소와 Canvas 생성은 서로 다른 시점이다. 앱은 모듈 import와 해당 계정·공간 확인 후 첫 렌더를 요청한다. 실제 화면 대기 시간은 요청 완료 시점, CPU/GPU 처리, 데이터 준비와 캔버스 표시의 차이를 따라 읽는다. [boot.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1e41c00bd11390449702df86/boot.js) 36~46행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 532~564·1195~1208·2752행.
2. **요청 취소와 새 화면 보호.** 취소는 자원·대기 시간을 아낀다. 취소 시점보다 응답이나 디코딩이 먼저 끝날 수 있으므로 선택·계정·화면 번호를 별도로 비교한다. 앱의 조회에 `generation`·계정 키, 추모 기록에 `memorialRevision`, 접속 상태에 `visibilityEpoch`가 각각 있다. 번호의 소비 범위가 같은지 먼저 확인한다. [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59f6a087dbd27f69d544cc4e/locker-feed.js) 8~35행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/badddc113c1ef830a03b6dd9/app.js) 723~755행, [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59d9f0b49f2ec6ffd1900960/presence.js) 131~158·191~205행.
3. **실패와 재시도.** 백오프는 실패 직후 요청이 겹치는 빈도를 줄인다. 만료·403·검증 오류와 일시 장애의 처리가 같지 않다. 쓰기 응답 유실 때는 실제 요청의 영속 여부 확인이나 멱등 키가 필요하다. 실습은 순수 읽기·모의 응답에 쓰는 재시도만 실행한다. [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59d9f0b49f2ec6ffd1900960/presence.js) 140·191~198행, [play-support-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/79ac4112e839d43578e9c947/play-support-client.mjs) 41~54·96~117행.
4. **캐시의 소유자.** ETag는 본문의 변경 여부를 재검증하는 값이고, 304의 본문 해석은 저장된 응답이 있는지에 따라 달라진다. Cache Storage는 원본과 별도인 브라우저 비동기 저장소다. 브라우저 HTTP 캐시, 서버 자원 버전, 앱 메모리 캐시, Service Worker는 다른 계층이다. [sw.js](https://starkkuk.com/sw.js) 1~10행, [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59f6a087dbd27f69d544cc4e/locker-feed.js) 19~35행.
5. **모델과 라이프사이클.** Three.js에서 장면에서 빼는 동작과 geometry, material, texture, skeleton, mixer를 정리하는 동작이 별도다. 공유 자원은 참조가 남아 있을 수 있다. 독립 실습의 모의 모델은 해제 순서를 확인한다. [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a61b9ce5a1a1f3754dc842e6/pet-avatar.js) 184~215행, [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8b364569998c23aa4780b9b/custom-pet-avatar.js) 19~23·98~118·194~216행.

## 로컬 실습 맵

| 읽을 함수 | 확인하는 일반 원리 | 검증 |
|---|---|---|
| `createScreenLoader` | `AbortController`의 signal과 응답을 채택할 세대 비교를 함께 시험한다. | 기존 요청이 취소를 따르지 않아도 결과가 무시되는 경합 확인. [runtime.mjs](Labs/10_Mobile_Runtime/runtime.mjs) 2~32행. |
| `readPreferences` | 저장 형식 v1에서 새 버전으로 변환한다. 실패 시 기본값·메모리 값만 쓰며 알 수 없는 형식을 덮어쓰지 않는다. | 정상/깨진 JSON/미지원 버전/쓰기 예외 assert. [runtime.mjs](Labs/10_Mobile_Runtime/runtime.mjs) 36~57행. |
| `retry` | 제한 횟수의 일시 장애 처리와 AbortSignal을 확인한다. | 영구 실패와 대기 중 취소 검증. [runtime.mjs](Labs/10_Mobile_Runtime/runtime.mjs) 60~92행. |
| `watchVisibility` | DOM 이벤트에서 현재 상태를 읽고 실제 업데이터에는 바뀐 상태만 전달한다. | Node의 EventTarget과 browser 초기 실행에 연결. OS 앱 백그라운드 복귀는 미실행. [runtime.mjs](Labs/10_Mobile_Runtime/runtime.mjs) 94~105행. |
| `createModelSlot` | 모델 선택이 바뀌면 즉시 기존/늦은 모델의 소유권을 해제한다. | 역순 완료·닫기·오류 대체 검증. [runtime.mjs](Labs/10_Mobile_Runtime/runtime.mjs) 107행 이후. |
| `cacheFixture`와 `demo-sw.mjs` | 로컬 테스트 리소스를 cache-first로 읽고, 정상 응답만 저장하는 기본 전략이다. | Node의 모의 캐시와 Chrome에서 실질 등록·제어·캐시 적중 검증. [worker-strategy.mjs](Labs/10_Mobile_Runtime/worker-strategy.mjs), [demo-sw.mjs](Labs/10_Mobile_Runtime/demo-sw.mjs). |

명령·예상 결과·실측 결과는 [실습 README](Labs/10_Mobile_Runtime/README.md)에 있다. Node 10개 테스트와 로컬 Chrome 캐시 시험을 통과했다. 실제 GPU 자원을 만드는 Three.js 실습과 별꾹 네트워크 세션의 장애 검증은 하지 않았다.

## 11차 교재로 연결

기능 설명을 반복하는 대신 사용자 동작에서 시작해 (1) 진입 HTML/메뉴, (2) 호출 이벤트와 버전이 붙은 모듈, (3) 상태의 소유자, (4) 렌더·DOM 반영, (5) 오류와 정리, (6) 어떤 증거로 검증했는지까지 한 줄기씩 연결하는 방식이 적합하다. 다음 교재에서는 모듈의 파일명과 **정확한 빌드 URL**을 모두 저장하고, [9차 정정](../Architecture/Corrections_Log.md)처럼 이전 증거와 새 배포를 분리해야 동일 파일명 재등장을 새로운 기능으로 잘못 세지 않는다. [10차 범위표](../Architecture/10_Module_Coverage.md)
