# 계정과 추모함 코드 읽기 교재

2026년 11월 23일 KST의 [별꾹 공개 클라이언트](https://starkkuk.com/)를 사례로 계정 상태, 이벤트, 비동기 요청, 저장과 캐시를 읽는 교재다. 앞부분의 짧은 인용에는 원본 위치를 붙였다. **독립 예제**는 가상의 도서관·연습실 데이터만 사용한다. 예제를 이 문서에 수록했으며 별도 예제 파일이나 실행 결과는 만들지 않았다.

비로그인으로 실제 확인한 범위는 첫 방문 계정 조회, 관·구역 가용성 안내, 꾸미기의 로그인 안내다. 그 뒤 등록·저장·인증 복귀는 공개 구현을 읽은 결과다. 실제 서버 권한과 데이터베이스, 처리 성공을 가정하지 않는다.

## 1. 일곱 동작을 한 줄씩 따라가기

| 행동 | 이벤트 | 함수 호출 | 요청 | 상태 변경 | UI 반영 |
|---|---|---|---|---|---|
| 첫 방문 | 모듈 평가, Promise 완료 | `refresh → accountReady → initializeLockerAddress` | 계정 GET부터. 조건에 따라 개인 목록과 관 목록 GET | 계정과 목록 스냅샷 대입 | 로그인/내 계정 버튼, 초기 장면, 로딩 제거 |
| 로그인과 복귀 | 계정 버튼 클릭, 제공자 버튼 클릭, 이후 새 페이지 평가 | `openAccount/render → requireAccount`가 자리 의도를 관리하고, 제공자 핸들러가 브라우저 이동을 시작 | 로그인 시작 주소로 전체 문서 이동, 돌아왔을 때 새 계정 GET | 세션의 자리 힌트 읽고 제거, 계정·관 목록 다시 설정 | 미완료 등록 의도가 조건을 만족하면 해당 자리 안내로 이동할 수 있음 |
| 분양 공간 탐색 | 분양받기 클릭, 관 버튼 클릭, 구역 select 변경 | `openPanel → createAllocationPicker.open → load → accept` | 일반·관별 가용성 GET. 구역 변경과 자리 하이라이트 자체는 로컬 | 관, 구역, 사용 불가 자리 Set, 현재 선택 | 남은 자리와 비활성화·선택 상태 표시 |
| 자리 선택과 등록 시도 | 자리 버튼 클릭, 다음 단계 클릭, 나중의 form submit | `choose → chooseAllocation → selectNiche → claimLocker` | 가용성 재조회 → 목록 GET → 유효한 제출 때 POST | 먼저 선택만 변경하고 성공 응답 이후 배정 행 반영 | 로그인 안내, 다른 자리 선택 또는 등록 결과 |
| 반려동물과 외형 저장 | 폼 입력·제출, 꾸미기 저장 버튼 | `edit → submit → onRecord`, 별도 `openPetCustomizer → onSave` | 등록 POST 또는 수정 PUT, 세부 외형 PUT. 필요한 경우 사진 PUT은 별도 | 반환된 자리·동물·버전, 목록과 로컬 표시 상태 | 저장 중/성공/오류 문구, 아바타와 화면 갱신 |
| 다른 화면 이동 및 재조회 | 관 전환, `popstate`, 새로고침 클릭, 타이머 | `setScene/openLockerAddress → refreshLockers → load/loadDetails` | 필요해진 관·계정의 목록 또는 상세 GET | 요청 당시 세대와 현재 화면을 비교하고 일치할 때 적용 | 불필요한 이전 화면 갱신 방지, 현재 관 표시만 갱신 |
| 인증·자리·저장 오류 | 응답 상태·예외·취소·검증 실패 | `catch`, `onUnauthorized`, `renderPanel`, `finally` | 필요한 경우 계정·목록 읽기 재시도. 등록 POST 자동 반복 근거는 없음 | 낡은 결과 제외, 작업 잠금 해제, 대상 불일치 시 선택 제거 | 계정창, 다른 자리 안내, 오류 또는 그대로 유지된 화면 |

‘사용자가 눌렀다’와 ‘서버가 저장했다’ 사이에는 여러 상태가 있다. 예컨대 자리 카드 클릭은 로컬 선택이고, 다음 단계 클릭은 조회이며, 실제 배정은 폼 제출 뒤 응답을 성공으로 판정할 때 앱에 반영된다. 이 구분으로 다른 기능의 버튼도 읽을 수 있다. [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 38~56·75~84행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 608~634·760·838·2115행.

## 2. 비동기 계정 조회와 복귀

### 원본에서 볼 부분

```javascript
export const accountReady=refresh();
```

[auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 72행에서 `refresh`를 즉시 호출한다. `async` 함수는 나중에 값이나 예외로 끝나는 **Promise**를 반환한다. 그 반환값을 상수로 붙잡으면 여러 기능이 같은 시작 작업을 기다릴 수 있다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 2751행의 `.then(initializeLockerAddress)`는 이 Promise가 완료되면 넘긴 함수를 호출한다. 함수 자체를 인자로 넘기는 것이 **콜백**이며 괄호까지 써 즉시 호출하는 것과 시점이 다르다.

`await`는 해당 async 함수의 나머지 진행을 잠시 멈춘다. 페이지 전체 입력과 그리기는 계속 진행한다. 그래서 계정창을 열 수 있고, 로드 완료 직후 상태가 바뀔 수도 있다. `refresh`가 오류를 잡는 구조에서는 대기가 끝났다고 인증 성공인 것은 아니다. 호출자는 `isSignedIn()`이나 화면의 실패 상태를 함께 본다. [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 66~80행.

**이벤트와 세션 저장.** 계정 버튼의 `click`은 계정창을 열고 제공자 클릭은 페이지 이동을 시작한다. 게스트가 특정 자리에서 로그인을 요구받은 경우의 힌트는 세션 저장소에 쓴다. 페이지를 다시 읽으면 메모리 객체는 초기화되지만, 같은 탭의 채널 키로 잠시 기록한 의도는 복귀 코드가 읽을 수 있다. `auth_error`는 문구를 고르는 입력이다. 로그인 상태는 별도 계정 응답에서 판단한다. [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 79~96·125~138행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 532~554행.

### 독립 예제 A · 도서관 세션을 한 번 읽고 복귀 의도 소비

```javascript
const view = { phase: "loading", reader: null, error: "" };
const locker = new Map(); // 이 예제에서만 쓰는 임시 저장소

async function restoreReader(readSession) {
  try {
    view.reader = await readSession();
    view.phase = view.reader ? "member" : "guest";
  } catch {
    view.reader = null;
    view.phase = "unavailable";
    view.error = "회원 상태를 확인하지 못했습니다.";
  }
  return view.reader;
}

function makeLibrary(readSession, knownRooms) {
  const ready = restoreReader(readSession);

  return {
    async openRoom(roomId) {
      const reader = await ready;
      if (!reader) {
        locker.set("return-room", roomId);
        return { screen: "sign-in" };
      }
      return { screen: "room", roomId };
    },
    async landing() {
      const reader = await ready;
      const roomId = locker.get("return-room");
      locker.delete("return-room");
      if (!reader || !knownRooms.has(roomId)) return { screen: "home" };
      return { screen: "room", roomId };
    }
  };
}

// 가상의 읽기 함수: async () => null 또는 async () => ({ id: "reader-1" })
// 정상 복귀라면 새로운 화면 인스턴스에서 별도의 readSession 결과를 사용한다.
```

호출자가 `readSession` 함수를 주입한다. Map은 브라우저 세션 저장소를 쓰지 않는 교재용 대체물이다. `landing`은 저장된 의도를 한 번 소비하고 새 계정과 알려진 방인지 다시 확인한다. 이 예제의 목적은 복귀 상태와 로그인 상태가 별개임을 읽는 것이다.

## 3. 이벤트 위임과 자리 중복

### 원본에서 볼 부분

```javascript
if(!root||token!==revision)return;
```

[allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 43·51행에서 이 검사는 DOM이 남아 있는지, 기다리기 시작할 때의 번호와 현재 번호가 같은지 묻는다. 번호를 늘리는 것만으로 네트워크가 취소되지는 않는다. 도착한 결과를 현재 화면에 적용하지 않는 데 쓰인다.

이 파일의 클릭 이벤트는 버튼마다 복제하기보다 컨테이너에서 받는다. `closest('button')`으로 눌린 아이콘 등이 어떤 버튼에 속하는지 확인하고 `dataset`으로 명령을 고른다. `void load(...)`는 이벤트 핸들러에서 기다리지 않을 것이라는 표현이다. 실패 메시지는 호출된 비동기 함수 내부가 맡는다. `await onChoose(id)`는 현재 코드가 결과 처리의 끝을 기다리는 콜백이라서 `finally`에서 잠금 해제 타이밍을 결정할 수 있다. [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 38~56·75~90행.

### 독립 예제 B · 연습실 후보 확인과 실제 예약

```javascript
function createRoomSelection({ listFree, book, show }) {
  let choice = null;
  let revision = 0;
  let busy = false;

  return {
    choose(room) {
      if (busy) return;
      choice = room;
      revision += 1;
      show("후보를 골랐습니다.");
    },
    leave() {
      choice = null;
      revision += 1;
    },
    async confirm() {
      if (busy || choice === null) return;
      const room = choice;
      const startedAt = revision;
      busy = true;
      try {
        const free = await listFree();
        if (startedAt !== revision) return;
        if (!free.has(room)) {
          choice = null;
          show("다른 방을 골라 주세요.");
          return;
        }

        const result = await book(room);
        if (startedAt !== revision) return;
        show(result.ok ? "예약 완료" : "방 상태가 바뀌었습니다.");
      } catch {
        if (startedAt === revision) show("현재 상태를 다시 확인해 주세요.");
      } finally {
        busy = false;
      }
    }
  };
}

// listFree와 book은 테스트에서 가짜 값을 반환하는 함수로 바꿀 수 있다.
// 예: listFree는 Set을 반환하고 book은 { ok: false }를 반환할 수 있다.
```

읽기에서 빈자리라고 나와도 그 직후 다른 사람이 예약할 수 있다. 이 예제는 `book`이 최종 거절할 수 있음을 보여 준다. `leave`는 오래된 응답의 화면 반영을 막지만 이미 시작한 예약 작업을 취소하거나 되돌리지는 않는다. UI의 중복 버튼 잠금과 서버의 동시 요청 처리는 다른 문제다.

## 4. 프로필 저장과 두 번째 요청의 실패

### 원본에서 볼 부분

```javascript
if(hasPhoto)await onPhoto(photo,saved.id,saved.petId,versionOf(saved));
```

[pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 61행이다. 앞의 58행에서 `onRecord`가 성공한 프로필을 앱에 반영한다. 61행은 바뀐 사진이 있는 경우에만 **새로 저장한 동물과 버전**으로 두 번째 작업을 진행한다. 파일 선택 이벤트, 대표 정보 변경 요청과 사진 변경 요청의 생명주기가 다르다.

`event.preventDefault()`는 폼의 기본 제출을 막아 페이지를 이동시키지 않는다. `{...selection}`은 제출 당시의 키와 버전을 얕게 복사한다. 중첩된 객체의 하위 값까지 분리해야 한다면 별도 복제가 필요하다. 교재 사례의 선택은 단순키 위주다. 장면과 반려동물도 요청 뒤에 다시 검사하는 이유는, 사용자가 기다리는 중에 다른 화면을 볼 수 있기 때문이다. [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 38~64행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 2071~2087·2211~2215행.

### 독립 예제 C · 서재 표시 설정과 배너의 두 단계 저장

```javascript
async function saveReadingProfile(
  services,
  previous,
  form,
  bannerChanged
) {
  const title = form.title.trim();
  if (!title) throw new Error("서재 이름을 입력하세요.");

  const saved = await services.saveProfile({
    id: previous.id,
    version: previous.version,
    title
  });
  services.showProfile(saved);

  if (!bannerChanged) return { profile: saved, banner: "unchanged" };

  try {
    await services.saveBanner(saved.id, saved.version, form.banner);
    return { profile: saved, banner: "saved" };
  } catch {
    return { profile: saved, banner: "failed" };
  }
}

// services에는 메모리 객체를 처리하는 가짜 함수를 전달할 수 있다.
// 실패를 재현하려면 saveBanner만 Error를 던지게 하는 상황을 생각해 본다.
```

여기서 `bannerChanged`가 false면 두 번째 호출이 없다. true이고 `form.banner`가 null이면 명시적 제거를 요청할 수 있다는 모델이다. 두 번째 작업이 실패해도 첫 성공을 반환에 남겼다. 학습 예제의 반환 형식은 원본의 실패 메시지나 API 형식과 관계없다.

## 5. 캐시, Promise 공유, 오래된 응답 제외

### 원본에서 볼 부분

```javascript
if(flight)return flight.promise;
```

[locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 57행의 `flight`는 진행 중 작업이다. 목록 파일은 결과 캐시와 작업 캐시를 별도로 둔다. 진행 중인 동일 작업에 또 응답할 필요가 생기면 같은 Promise를 돌려준다. 이미 완료한 응답에서 ETag를 얻으면 조건부 요청에 사용하고, 304이면 기존 본문을 재사용한다. `cache:'no-store'` 요청 옵션이 이 모듈의 Map까지 자동 삭제하지 않는다.

두 목록을 `Promise.all`로 기다리면 둘 다 성공한 뒤 결과 배열을 입력 순서로 얻는다. 실패 하나가 전체 Promise를 거절할 수 있으며 다른 요청을 자동 중단하지는 않는다. 해당 코드에서 중단은 `AbortController`와 시간 제한을 명시적으로 사용하는 별도 동작이다. 계정·관이 바뀐 응답을 거부하는 세대 검사, 공개·개인 응답의 동일한 목록 revision 검사, 동물의 행 버전은 서로 다른 문제를 푼다. [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 19~32·53~93행.

### 독립 예제 D · 같은 분관 조회를 공유하고 분관 이동을 처리

```javascript
function makeShelfLoader(readShelf) {
  const snapshots = new Map();
  let generation = 0;
  let pending = null;

  return {
    changeBranch() {
      generation += 1;
      pending = null;
    },
    load(branch) {
      const start = generation;
      if (pending?.branch === branch && pending.generation === start) {
        return pending.promise;
      }

      const ticket = { branch, generation: start };
      const cached = snapshots.get(branch);
      ticket.promise = Promise.resolve()
        .then(() => readShelf(branch, cached?.tag))
        .then(result => {
          if (generation !== start || pending !== ticket) return null;
          if (result.unchanged) {
            if (!cached) throw new Error("재사용할 목록이 없습니다.");
            return cached.items;
          }

          snapshots.set(branch, { tag: result.tag, items: result.items });
          return result.items;
        })
        .finally(() => {
          if (pending === ticket) pending = null;
        });

      pending = ticket;
      return ticket.promise;
    }
  };
}

// readShelf는 { unchanged: true } 또는 { tag, items }를 반환하는 가짜 함수다.
// 지연 응답은 Promise를 나중에 resolve하는 것으로 가정해 순서를 손으로 추적한다.
```

같은 대상의 요청을 두 곳에서 호출하면 `pending.promise`가 같고 결과도 같다. 분관 변경으로 세대가 증가하거나 새 요청이 앞서면 옛 결과는 null이 된다. `finally`에서 현재 작업인지 비교하는 이유는 이전 작업이 뒤늦게 끝나 새 작업을 지우지 않게 하기 위해서다. 실제 서비스의 뷰 병합·사용자 권한·HTTP 헤더는 이 예제 범위 밖이다.

## 6. 상태 객체와 요청 래퍼 읽기

| JavaScript 구문 | 실제 사례와 읽는 방법 |
|---|---|
| 기본 매개변수 | `readNiche(id, petId='primary')`는 두 번째 값을 생략했을 때 대표 동물을 읽는다. 분양의 `hall=null`은 관 하나가 아니라 관 목록이라는 약속이다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 608·698행. |
| 구조 분해와 펼치기 | 가입한 자리·동물 폼의 요청 객체는 추가 여부에 따라 `petId`와 버전 필드를 포함한다. `normalize`로 반환된 표시 상태에 날짜와 모델 설명자를 덧붙인다. [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 54~60행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 698~704행. |
| 선택적 연결과 null 병합 | `account.user?.id`는 사용자 객체가 없을 때의 오류를 피한다. 날짜 등에 `??`를 쓰는 코드에서는 null/undefined일 때만 대체값으로 간다. 빈 문자열 또는 0을 falsy로 보는 `||`와 다르다. [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 74행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 704행. |
| Map·Set·WeakMap | 선택 UI의 Set은 금지된 자리 포함 여부를 읽는다. 목록의 Map은 뷰별 캐시·ID별 레코드 검색에 쓰이고, WeakMap은 결과 객체를 세대에 연결한다. [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 24~36행, [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 9~10·63~71·93행. |
| Date와 타이머 | 프로필 복귀 힌트에는 시각을 두고, 목록 폴링은 완료 뒤 다음 타이머를 잡아 요청이 겹치지 않게 설계한다. [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 31~39행, [locker-poll.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/10de7f10ee12ae264f3bc477/locker-poll.js) 3~19행. |
| `try/catch/finally` | 요청 직후 성공 여부를 판정하고, catch는 실패 문구나 재조회, finally는 버튼 잠금·타이머·작업 참조 정리를 맡는다. 화면이 바뀌었는지 조건을 다시 확인하는 분기도 읽어야 한다. [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 54~63행, [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 60~77행. |
| 래퍼와 HTTP 성공 검사 | `channelFetch`가 내부에서 실제 fetch를 호출한다. 라우팅과 특정 제한 응답을 맡고, 보통 호출자가 `response.ok`와 JSON을 읽는다. 401, 403, 네트워크 예외는 서로 다른 흐름이다. [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) 15~27행, [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 66~69행. |
| `JSON.stringify`와 `JSON.parse` | JS 객체는 요청이나 저장소에 보낼 때 문자열로 변환하고 읽을 때 다시 파싱한다. 잘못된 JSON, 저장 금지나 용량 초과, 알 수 없는 필드를 기본값에 맞추는 일에는 별도 처리가 필요하다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 598·764·1174행, [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fa3b0edd438780bfc581b2a/state.mjs) 43~46행. |
| `structuredClone` | 상세 화면의 선물 배치 배열이나 외형 편집 초안을 화면에 열 때 독립 데이터로 만든다. 전역 레코드를 그대로 편집했을 때 취소가 어려워지는 상황을 피하는 패턴이다. [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 760행, [pet-customizer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/855cc44fc89a36f2b21ae765/pet-customizer.js) 63행. |

### 독립 예제 E · 로컬 초안 복구와 기본값

```javascript
function readDeskDraft(storageValue) {
  let input;
  try {
    input = JSON.parse(storageValue ?? "null");
  } catch {
    input = null;
  }

  const data = input && typeof input === "object" ? input : {};
  const theme = ["paper", "ink"].includes(data.theme) ? data.theme : "paper";
  const width = Number.isFinite(data.width)
    ? Math.min(900, Math.max(320, data.width))
    : 640;

  return { theme, width };
}

// 잘못된 JSON, null, 유효한 값을 각각 넘겼다고 가정해 반환값을 비교한다.
// 이 초안의 반환 객체를 저장 성공이나 계정 권한과 연결하지 않는다.
```

## 7. 손으로 추적할 연습 문제

| 질문 | 풀이에서 확인할 값 |
|---|---|
| 비로그인으로 빈자리를 골랐는데 계정창이 열렸다. 자리 등록 POST가 이미 나갔는가? | 현재 진행한 이벤트가 자리 선택, 다음 단계, 등록 폼 제출 중 무엇인지 본다. 코드상 게스트 분기는 계정 힌트와 안내까지다. |
| 초기 계정 GET이 500이면 `accountReady.then`은 무조건 건너뛰는가? | `refresh`가 예외를 잡고 어떤 값을 반환하는지 본다. 실패 메시지와 Promise 완료를 구분한다. |
| A관을 열자마자 B관으로 이동하고 A의 상세 요청이 늦게 도착했다. | 관·세대·현재 요약 키의 세 조건을 본다. 전송을 중단하지 못한 경우에도 적용을 거를 수 있다. |
| 공개·개인 목록이 모두 HTTP 200인데 합칠 수 없는 경우는? | 같은 목록 revision이어야 한다. 한쪽이 데이터 변경 이전의 결과일 수 있다. |
| 저장이 실패했다고 보이지만 다시 들어가니 이름이 새 값이다. | 프로필 저장 후 사진 저장이 실패했는지 확인한다. 두 단계 사이의 앱 반영 시점을 읽는다. |
| 브라우저의 로컬 상태에 `created:true`가 있으면 편집할 수 있는가? | 표시용 정상화 데이터와 응답의 소유·편집 플래그, 서버 인가를 따로 읽는다. |
| 서버가 같은 자리를 중복 배정하지 않는지 어떻게 판정하는가? | 클라이언트의 조회와 오류 처리를 확인할 수 있다. 서버 구현이나 권한 있는 검증 결과 없이 원자성을 결론 내리지는 않는다. |

## 8. 근거를 다시 찾는 순서

| 학습 주제 | 배포 파일 / 코드 위치 |
|---|---|
| 계정 상태와 처음 기다리는 작업 | [auth.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/638a587348d25d3c651a65c5/auth.js) 66~80·125~138행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 532~554·2751행 |
| 이벤트와 선택의 비동기 세대 | [allocation-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b90e0457106e26665d40d1b/allocation-ui.js) 22~56·75~90행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 608~634·760·838·2103~2115행 |
| 폼, 대상 캡처와 사진 순서 | [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) 38~64·69~76행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 2071~2087·2211~2215행 |
| 피드, 캐시와 갱신 | [locker-feed.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f3f2bdc9099ea5ec46fbdbe8/locker-feed.js) 8~94행, [snapshot-delta.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/09a385d34e94f5359f8f58f3/snapshot-delta.mjs) 1~11행, [locker-poll.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/10de7f10ee12ae264f3bc477/locker-poll.js) 3~19행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 784~836·2659행 |
| 로컬 상태와 채널 | [state.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fa3b0edd438780bfc581b2a/state.mjs) 25~26·43~46행, [channel-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9a4d2ac2d547be4a1f8aa637/channel-client.mjs) 1~32행, [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) 698~706·1174행 |

초기 실행 근거는 REA `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`과 [공개 사용자 흐름 조사](../03_Service_Flow_Pricing.md)다. 공개 소스 추가 확인은 `ev_b00e341ca3ae69c4648e6cf544c5529bae64e6137f9d998bc35873a6acb15e2c`에 기록했다. 위 함수는 배포본의 행 번호 기준이며 소스 갱신 때 달라질 수 있다.

[계정·소유권·프로필 상세](../Systems/Authentication_Profiles.md) · [추모함 배정·캐시 상세](../Systems/Locker_Allocation.md)

