# 코드 학습 · 광장 커뮤니티와 실시간 아바타

확인일 **2026-11-25 (한국시간)** · [별꾹 공개 웹 클라이언트](https://starkkuk.com/) · 7차

이 교재는 사용자의 클릭과 이동이 각각 어떤 이벤트·요청·상태를 거쳐 화면에 표시되는지 따라간다. 이전 REA 초기 기록에서 광장과 접속 HTTP 응답을 확인했다. 광장 글·댓글의 실제 쓰기, 소켓 성공, 다른 이용자와의 상호작용은 실행 관찰하지 않았다. [서비스 구성](../00_Service_Architecture.md) · [광장·소셜 상세](../Systems/Community_Social.md) · [실시간 접속 상세](../Systems/Realtime_Presence_Networking.md)

## 1. 사용자 행동에서 화면까지

| 따라갈 동작 | 이벤트 → 요청 → 상태·화면 | 예외를 읽을 위치 |
|---|---|---|
| 광장 판을 눌러 글 보기 | Three.js 메시 클릭 → `activateWorldInteraction` → `open(boardId)` → 가까우면 `read`, 멀면 `onWalk` 후 재호출 → GET → 카드 및 더 보기 커서 | 다른 장면·저장 중 여부, 오래된 화면 세대, 연결 오류, 다시 불러오기. [app.js 2271·2745행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [plaza-boards-ui.js 21~22·53~72·83~88행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) |
| 광장 사진 게시 | 파일 `change` → `preparePhoto` → 미리보기, 폼 `submit` → `api` → 응답 후 `read`와 월드 썸네일 갱신 | 사진 처리 중과 저장 중에는 제출 차단. 큰 요청, 시간 초과, 비정상 응답이면 폼을 표시한 채 재시도할 수 있다. [plaza-boards-ui.js 30~37·75~81행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) · [plaza-boards-world.js 35~40행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b2842ee2f9e04ad927430932/plaza-boards-world.js) |
| 댓글과 답글 보기·게시 | 댓글 열기 → `plazaComments` → 게시물 ID로 조회 → 답글은 부모 ID 사용 → 로그인 검사와 입력 확인 → 명령 응답으로 행 삽입·카운트 갱신 | `seen`으로 중복 목록 항목 제외, 같은 명령 재시도는 같은 `nonce` 사용. 삭제가 성공하면 해당 화면의 스레드 상태를 다시 읽는다. [plaza-boards-ui.js 48~50행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) · [plaza-comments.js 3~55행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c7780c2d88aef845fe4edcc/plaza-comments.js) |
| 도착한 다른 이용자 보기 | 초기화·수명 이벤트 → `sync` → 좌표·방 상태 전송 → 응답 목록 → `peers Map`에 3D 객체 연결 → 프레임마다 위치·이름·포즈 반영 | 방/세대 불일치 또는 타임스탬프 역전 검사. 잠깐 실패하면 이전 목록을 유지할 수 있으며 로컬 만료 조건 후 정리한다. [presence.js 129~205·272~299행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) |
| 가까운 사람에게 마음 전하기 | 아바타 클릭 → `pickInteraction` → `openTarget` → 사용자 버튼 → `act` → 소셜 요청 → `receive` → 말풍선·동작 | 3D 광선·거리·가시성 검사와 UI 잠금이 있다. 즉시 명령 응답과 접속 동기화가 같은 이벤트를 가져오면 ID로 중복 실행을 막는다. [presence.js 67~88·188·267~268행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) · [social.js 85~119·124~149행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/85ceca4c296ca59271744cf0/social.js) |
| 별친에게 찾아가기 | 별친 목록 → `goToFriend` → 위치 조회 → 앱 콜백 → 장면·도착 지점 확인 → 이동과 `changeScene` | 목록의 `online/canLocate`와 현재 화면 세대를 확인한다. 이동 지점이 없거나 허용 장면이 아니면 안내한다. 서버가 실제로 공개하는 위치의 범위는 미확인이다. [star-friends.js 63~65·82행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/52a07091160d03a9687bb409/star-friends.js) · [app.js 3057~3083행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |

## 2. JavaScript와 Three.js 개념을 실제 함수에 붙이기

- **이벤트와 콜백.** 클릭·폼 제출·파일 선택은 브라우저에서 발생한 이벤트다. 앱이 넘기는 `onWalk`와 `onChange`는 전달받은 모듈이 알맞은 시점에 호출하는 함수다. 게시판 UI는 월드 객체 생성법을 몰라도 `onChange()`를 호출해 썸네일 갱신을 요청할 수 있다. [app.js 2745행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [plaza-boards-ui.js 47·81~84행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js)
- **Promise와 시간의 순서.** Promise는 나중에 결정될 성공 값이나 실패를 나타낸다. `await` 뒤의 코드는 응답 후에 이어지므로, 그 사이에 사용자가 패널이나 방을 바꿀 수 있다. 게시판의 `epoch`는 현재 화면이 맞는지, 실시간의 `seq`는 해당 소켓 요청과 응답이 짝을 이루는지, 샘플의 타임스탬프는 좌표가 이전 값보다 새것인지 각각 판단한다. [plaza-boards-ui.js 19~27·61~67행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) · [presence-transport.mjs 11~21·25~29행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs) · [presence-motion.mjs 32~40행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c1c26e9f7fa75a3ce4a68e74/presence-motion.mjs)
- **폴링과 WebSocket.** 폴링에서는 클라이언트가 타이머에 맞춰 다시 질문한다. WebSocket은 열린 연결에서 메시지를 주고받는 통로다. 일반 접속 소켓은 이 앱에서 일련번호가 있는 요청·응답으로 쓰인다. 별도 월드 모션은 연결된 방의 위치 프레임을 받을 수 있다. 소켓 연결 성공은 실제 초기 HTTP 관찰과 구분한다. [presence.js 131~145·198행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) · [presence-transport.mjs 4~33행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs) · [world-motion-client.mjs 8~38행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4293c00ac29158a11c0c4b6c/world-motion-client.mjs)
- **상태 스냅샷과 델타.** 스냅샷은 한 시점의 참가자 상태다. 델타는 그 기준 이후의 변경을 담는다. 이전 배열의 어떤 행·열이 변했는지 해석하려면 올바른 기준이 필요하다. 소켓이 바뀌면 이전 연결의 기준을 버린다. [presence-protocol.mjs 1~10행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/31fcd953f5b855dfc6b18d97/presence-protocol.mjs) · [presence-delta.mjs 1~29행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a906949d59b7ed7a6d85134/presence-delta.mjs) · [presence-transport.mjs 4~18행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/157cf728c4c673d5eb3c3ae2/presence-transport.mjs)
- **보간·외삽과 Three.js 객체.** 보간은 앞뒤 좌표를 섞어 중간 시간을 그린다. 외삽은 다음 값이 없을 때 이미 보인 속도로 아주 짧게 내다본다. 피어의 샘플, 앱의 `Object3D.position`, 카메라에 투영된 이름 라벨은 서로 다른 단계다. `Raycaster`는 화면 선택에서 장면의 객체와 광선이 만나는지 검사한다. [presence-motion.mjs 42~89행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c1c26e9f7fa75a3ce4a68e74/presence-motion.mjs) · [presence.js 75~88·273~299행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js)
- **캐시 무효화와 중복 요청 방지.** 네트워크에서 이미 읽은 값을 또 쓰는 것과 아직 진행 중인 Promise를 함께 기다리는 것은 다르다. 오늘의 별은 두 경우를 각각 `cache`와 `pending`에 저장한다. 쓰기 후 무효화는 오래된 사본이 계속 화면에 쓰이지 않게 한다. 별스토리 게시 후에는 3D 판 갱신과 화면 재조회가 따로 있다. [today-stars-feed.js 2~10행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/418c498ec132549ef8fc832f/today-stars-feed.js) · [today-stars.js 53~59행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/293fd53262524135b49b2a09/today-stars.js) · [plaza-boards-ui.js 81행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js)

## 3. 외부 요청 없는 교육용 JavaScript

아래 코드는 별꾹 원본과 별개로 작성한 **독립 예제이며 모두 미실행**이다. 실제 계정·사이트·사진·데이터를 사용하지 않는다. 필요한 렌더 함수는 인자로 받거나 값을 반환한다. 각 예제는 메모리와 타이머만 쓴다.

### 예제 1. 게시글 목록과 댓글, 진행 중 중복 로드 방지

같은 게시판에 두 개의 ‘더 보기’ 클릭이 들어오면 진행 중 Promise를 공유한다. 댓글은 게시글 키에 붙인다. 목록을 다시 그릴 때는 반환된 복사본이나 저장 후 다시 읽은 댓글을 표시할 수 있다.

```javascript
function makeDemoBoard() {
  const posts = [{ id: "demo-1", title: "연습 게시글" }];
  const comments = new Map();

  return {
    async list() {
      return posts.map(post => ({ ...post }));
    },
    async commentsFor(postId) {
      return (comments.get(postId) ?? []).map(comment => ({ ...comment }));
    },
    async addComment(postId, value) {
      if (!posts.some(post => post.id === postId)) {
        throw new Error("게시글을 찾지 못했어요.");
      }
      const text = String(value).trim();
      if (!text || text.length > 120) {
        throw new Error("댓글은 1~120자여야 해요.");
      }
      const thread = comments.get(postId) ?? [];
      const comment = { id: thread.length + 1, text };
      comments.set(postId, [...thread, comment]);
      return { ...comment };
    }
  };
}

function sharePendingLoad(load) {
  let pending = null;
  return function refresh() {
    if (!pending) {
      pending = Promise.resolve().then(load).finally(() => {
        pending = null;
      });
    }
    return pending;
  };
}
```

실습에서는 `const board = makeDemoBoard()`와 `const refresh = sharePendingLoad(board.list)`를 조립한다. 동시에 두 번 호출한 `refresh()`가 같은 Promise인지 확인한다. 새 글 제출 버튼의 잠금은 별도로 다룰 수 있다.

### 예제 2. 두 가상 사용자의 위치, 역순과 다른 방의 응답 제외

각 사용자의 최근 수신 시각은 독립적으로 관리한다. 이전 시각을 가진 표본이나 다른 방 표본은 버린다. 잘못된 좌표를 렌더층에 넣지 않도록 유한 수인지 확인한다.

```javascript
function makeDemoRoom(initialRoom) {
  let room = initialRoom;
  const tracks = new Map();

  return {
    moveTo(nextRoom) {
      room = nextRoom;
      tracks.clear();
    },
    accept(sample) {
      if (sample.room !== room || !sample.id) return false;
      if (![sample.time, sample.x, sample.z].every(Number.isFinite)) return false;

      const track = tracks.get(sample.id) ?? [];
      const last = track.at(-1);
      if (last && sample.time <= last.time) return false;

      tracks.set(sample.id, [...track.slice(-1), { ...sample }]);
      return true;
    },
    trackFor(id) {
      return (tracks.get(id) ?? []).map(sample => ({ ...sample }));
    }
  };
}

const demoRoom = makeDemoRoom("연습방");
demoRoom.accept({ id: "가상 A", room: "연습방", time: 1000, x: 0, z: 0 });
demoRoom.accept({ id: "가상 A", room: "연습방", time: 1100, x: 2, z: 0 });
demoRoom.accept({ id: "가상 B", room: "연습방", time: 1100, x: -1, z: 2 });
const acceptedLate = demoRoom.accept({
  id: "가상 A", room: "연습방", time: 1050, x: 20, z: 0
});
// 실행한다면 acceptedLate는 false이고 A의 최신 x는 2를 유지한다.
```

같은 이름의 방으로 다시 돌아오는 실습이라면 방 문자열 외에 진입 세대를 따로 전달한다. 이전 방에 있던 요청과 현재 방이 이름을 공유할 수 있기 때문이다.

### 예제 3. 로컬 모의 연결 실패와 재시도

연결 제공자를 인자로 받는다. 예제 제공자는 첫 실패 후 가짜 연결을 만들고, 가짜 연결이 끊기면 재연결을 예약한다. `stop`은 예약을 지우고 나중에 도착한 연결도 닫는다.

```javascript
function startLocalReconnect(connect, showStatus) {
  let stopped = false;
  let timer = null;
  let active = null;
  let retryDelay = 200;

  function schedule() {
    if (stopped || timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      void attempt();
    }, retryDelay);
    retryDelay = Math.min(2000, retryDelay * 2);
  }

  async function attempt() {
    if (stopped) return;
    try {
      const connection = await connect();
      if (stopped) {
        connection.close();
        return;
      }
      active = connection;
      retryDelay = 200;
      showStatus("연결됨");
      connection.onDisconnect(() => {
        if (stopped || active !== connection) return;
        active = null;
        showStatus("연결 끊김");
        schedule();
      });
    } catch {
      if (stopped) return;
      showStatus("다시 연결하는 중");
      schedule();
    }
  }

  void attempt();
  return function stop() {
    stopped = true;
    clearTimeout(timer);
    active?.close();
    active = null;
  };
}

function makeFakeProvider() {
  let initialFailure = true;
  return async function connect() {
    if (initialFailure) {
      initialFailure = false;
      throw new Error("로컬 연결 실패");
    }
    let disconnectTimer;
    return {
      onDisconnect(callback) {
        disconnectTimer = setTimeout(callback, 600);
      },
      close() {
        clearTimeout(disconnectTimer);
      }
    };
  };
}
```

실습에서는 `startLocalReconnect(makeFakeProvider(), console.log)`가 돌려주는 함수를 종료 시 호출한다. 별꾹의 HTTP 복귀·소켓 재시도 주기를 모의하려면 별도의 가짜 전송 경로와 수신 값을 추가할 수 있다.

### 예제 4. 원격 위치를 중간 시점에서 그리기

두 샘플 사이 선형 보간을 사용한다. Three.js에서는 반환된 값으로 객체의 좌표를 지정할 수 있고, 2D 캔버스에서는 점을 그릴 수 있다. 새 값이 없으면 마지막 위치를 유지한다.

```javascript
function interpolatePosition(track, playbackTime) {
  if (!track.length) return null;

  const first = track[0];
  const last = track.at(-1);
  if (first === last || playbackTime <= first.time) {
    return { x: first.x, z: first.z };
  }
  if (playbackTime >= last.time) {
    return { x: last.x, z: last.z };
  }

  const rightIndex = track.findIndex(sample => sample.time >= playbackTime);
  const a = track[rightIndex - 1];
  const b = track[rightIndex];
  const weight = (playbackTime - a.time) / (b.time - a.time);

  return {
    x: a.x + (b.x - a.x) * weight,
    z: a.z + (b.z - a.z) * weight
  };
}

// 예제 2와 함께 읽을 때 A의 시각 1050 위치는 (1, 0)이다.
```

위치 샘플이 시간 순으로 들어온다는 전제다. 렌더 시각을 최신 수신보다 조금 늦게 잡으면 앞뒤 값이 확보될 가능성이 커진다. 실습에서는 이 지연과 움직임의 자연스러움을 비교할 수 있다.

## 4. 코드와 관찰을 구분하는 확인표

| 판정 | 학습에서 얻을 수 있는 답 |
|---|---|
| 실제 관찰 | 비로그인 초기 광장과 서비스의 HTTP 접속 갱신 성공 기록. 초기 GET과 DOM으로 상세 화면 및 쓰기 기능 완료를 증명할 수 없다. |
| 코드 확인 | 게시글과 광장 댓글의 요청 키, 피드 커서와 응답 세대, 피어 목록과 모션 선택, 소켓 번호와 델타 적용, 시점 보간, 화면 숨김 후 정리 |
| 추정 | 캐시·델타·세부 모션 전송은 자원과 반응 시간의 균형을 고려한 것으로 읽힌다. 실제 절감량·지연·프레임 수치는 미측정이다. |
| 미확인 | 운영 WebSocket 연결과 실제 간격, 서버 권한·검사·보관, 별친 위치 공개 조건, 동시 사용자 동작과 장애 시 경험, 글 수정·개별 차단 기능 |

## 5. 8차 3D 공간·상호작용·이벤트 분석에 넘길 과제

| 순서 | 모듈·위치 | 확인 과제 |
|---|---|---|
| 1. 클릭 가능한 월드 | `app.js` 2271·2295~2317행, `plaza-boards-world.js` 7~20행, `plaza-entry.js` 3~25행 | 광선 검사 → 겹친 객체 우선순위 → 이동 후 콜백 → 패널·시설 열기. 포인터·터치·가려진 UI에서 분기가 유지되는지 확인한다. |
| 2. 공간 교체와 카메라 | `app.js` 1791·1921~2023·2535~2549·2659행, `plaza-world.js` 174~177행, `camera-rig.js` 및 `plaza-layout.mjs` | 장면·방·카메라의 경계, 문·길·표식의 클릭 위치, 이동 충돌과 카메라 장애물, 장면 교체 후 텍스처·클릭 대상 정리를 추적한다. |
| 3. 행사와 전용 월드 | `app.js` 2827~2831·2927~2931행, `reunion-realtime.js` 5~48행, `presence.js` 273~299행 | 지연 로딩 장면 진입·취소·뒤로 가기, 기본 포즈와 전용 애니메이션 전환, 모바일·탭 복귀 시 UI/카메라 복원 확인. 참여가 상태를 바꾸는 경우 공개 코드와 실행 관찰을 구분한다. |
| 4. 장면 갱신 비용 | `avatar.js` 117~131행, `today-stars-world.js` 8~22행 | 가까운 피어·원거리·시야 밖에서 표시와 자세가 언제 바뀌는지, 이미지 교체 과정과 자원 정리를 비교한다. |

8차 출처 링크. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [plaza-boards-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b2842ee2f9e04ad927430932/plaza-boards-world.js) · [plaza-entry.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/26612745a41aa3a485239c79/plaza-entry.js) · [plaza-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f71da449ab11b071c789ad08/plaza-world.js) · [plaza-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b090ae853a7fe76b6c69527f/plaza-layout.mjs) · [camera-rig.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4c30cab07bf2bd8a893903b3/camera-rig.js) · [reunion-realtime.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/14ec48c5e3d7e431bfae6d22/reunion-realtime.js) · [presence.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) · [avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e4716f71b2eb05fa15928960/avatar.js) · [today-stars-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb798f7e537ba4766d08a40f/today-stars-world.js)

기존 REA 초기 캡처 `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`, 이번 게시판 `ev_b1a914bd83154f727a4ba7f9f38e71ce2adc8ce9f6827e3649f8ceeb8b8e4d52`, 접속·보간 `ev_06758cbf1f01b6ca71d69ce5cd580051070a495fceec4420ac5bf5797b14cc80`, 앱 `ev_e0372954d3510cc68d6bd8d96e538e4f2684c06a11a1751141fd933a88456f69` 및 세부 모션 `ev_0e92ec95fa2325ea0d5a25d51e23fefc47a5f624bfe804fca88e1a918905e511`를 사용했다. 행 번호는 각 공개 배포본 기준이다.
