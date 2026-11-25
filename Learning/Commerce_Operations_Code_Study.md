
# 맞춤 제작·결제·운영 코드 학습

2026-11-25 KST. 별꾹 공개 코드에서 UI, 비동기 응답, 재조회, 3D 표시를 연결하는 부분을 읽는 교재다. 표는 REA로 확인한 정적 호출 경로다. 신청·승인·결제·차감·대화는 실행하지 않았다. 아래 JavaScript 다섯 예제는 가상 데이터와 메모리만 사용한다. 예제의 상태명, 자료 구조, 금액은 독립적인 학습 설계다.

## 1. 사용자 행동부터 최종 화면까지 따라가기

| 시작 | 이벤트 → 함수 → 요청 또는 로컬 처리 | 비동기 상태, 화면 결과와 복구 |
|---|---|---|
| 제작 신청에서 아이 선택 및 제출 | 신청 폼의 `submit(event)` → 입력·사진 검증 → 읽어 둔 계정과 대상 아이 재확인 → 사진 준비 후 신청 쓰기 → `load()`로 현재 목록 조회. 사진 처리 결과는 비동기이며 기존 사진을 참조하는 경로도 있다. [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) 54~123행. [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) 처음부터 끝까지. | 쓰기 중 제출 방지, 계정/패널 세대 비교, 신청 ID와 버전별 초안 취급, 성공 뒤 목록 교체. 전송 성공과 최종 모델 승인 사이에는 제작 단계가 남는다. |
| 제작비 또는 후원에서 이체 증빙을 선택 | 제작비와 후원은 별도 폼·초안이다. 사진 입력 이벤트 → 전처리 → 자기 신청/후원에 대한 제출 경로 → 서버 상태 재조회. 후원 폼은 `showReport()`로 본인 상태에 따라 재작성 또는 보완 안내를 선택한다. [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) 107~122행. [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) 135~169, 219~247행. | 완료 플래그는 화면의 입력 잠금을 해제한다. 심사 상태를 응답으로 갱신하는 구조이므로 증빙 선택, 제출 성공, 입금 인정의 시점이 구별된다. 401·보완 버전 변경 때는 계정/상태를 새로 읽는 분기를 확인했다. |
| 서버 반환 상태가 모델 표시로 연결 | 앱이 갱신한 프로필의 모델 참조 → `pet-avatar.js` 승인 상태 검사 → `acquirePetModel(descriptor, options)` → 로컬 아바타의 모델 준비·오류 상태. [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) 188~215행. [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) 203~216행. | 비동기 로딩을 기다리는 동안 기본형이 남을 수 있고, 실패하면 대체 표시 경로가 있다. 승인 응답의 존재만으로 현재 GPU에서 그릴 수 있게 됐다는 결론은 낼 수 없다. |
| 꾹키 상점에서 항목 선택, 획득품 사용 | 상점 열기 → `load(body)` 및 본인 카탈로그/잔액 화면 → 구매·사용 동작 → 반환된 재화·항목 상태 갱신. 가방의 선물 배치는 별도 공간 상태 변경이다. [kkuki-shop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae4b8e53f1fa7c7aaf794cb8/kkuki-shop.js) 4~34행. [gift-inventory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e343dcd26613f728b8fbd42/gift-inventory.js) 80~105행. | 가상 재화 부족과 가방 정원은 서로 다른 조건이다. 잔액, 구매 보관함, 배치된 장식은 각각의 갱신 근거를 따라가야 중복 차감 여부나 실제 현금 연계를 오해하지 않는다. |
| 포캣멍 전용 방 이동 | 버튼 이벤트 → `setRoom(next, remember)` → 권한 표시 조건 → 공간 데이터와 모듈을 병렬로 준비 → 응답이 같은 방·전환 번호인지 확인 → 새 공간 및 이력 적용. [partner-center.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/244ed923b69de2adc7a274fb/partner-center.js) 92~105, 230~236행. | `Promise.all` 결과를 받아도 사용자가 이미 다른 곳에 있으면 화면을 바꾸지 않는다. 실제 권한 검증은 서버의 미확인 경계다. |
| 우리 아이 대화 열기·답장 | 메일 아이콘/알림 → `open()` → `readLatest()` → 메시지와 자격 표시 → 답장 입력 및 nonce → 자기 대화 세션 응답을 병합한다. [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a5b2cc8aba470fa17f661ef/pet-chat.js) 6~11, 32~48, 51~59행. | 폴링 응답, 읽음 처리, 입력 중 응답은 다른 경로다. 코드에서 확인한 3D 연결은 장면/대화창 입력 제어 쪽이다. 아래 예제의 캐릭터 감정은 독립 예제에만 있다. [별꾹 대화 보고서](../Systems/Pet_Conversation.md) |

## 2. 여섯 개념을 읽는 법

- **상태 머신.** 상태와 이벤트가 정해져 있고, 현재 상태에서 허용된 이벤트만 다음 상태를 만든다. 신청 심사, 증빙 심사, 모델 장착은 시간이 서로 다른 세 과정이다. 먼저 응답 필드가 어느 과정에 속하는지 확인한다.
- **비동기 처리.** `Promise`는 아직 도착하지 않은 값이나 실패를 나타낸다. `await` 뒤 코드는 미래에 다시 실행된다. 그 사이 계정·선택한 반려동물·화면이 바뀔 수 있으므로 시작 시 읽은 식별자와 세대를 비교하는 코드가 필요하다.
- **트랜잭션.** 잔액 차감과 항목 발급처럼 함께 성공해야 하는 변경을 하나의 단위로 다룬다. UI 버튼 잠금이나 한 JavaScript 함수에서의 연속 대입은 탭, 서버 프로세스, 외부 결제망에 걸친 원자성을 입증하지 못한다.
- **멱등성.** 동일한 의미의 요청을 재전송해도 효과가 여러 번 발생하지 않는 성질이다. 식별자가 같을 때 이전 결과를 반환하고, 식별자와 요청 내용 조합이 바뀌면 거부하는 방법이 있다. 원격 서비스에서는 영속 저장과 동시성 제어 확인이 필요하다.
- **검증.** 사진 형식·문자 수·구매 수량은 클라이언트가 빠르게 안내할 수 있다. 권한, 잔액의 최종 판단, 영수증 확인은 서버가 어떤 입력을 어떤 거래에 연결하는지 알아야 판단할 수 있다.
- **재시도.** 타임아웃은 응답을 받지 못했다는 뜻이다. 서버가 처리했을 가능성이 있으므로 같은 요청 식별자를 쓰거나 읽기 경로로 결과를 확인해야 한다. 버전 충돌이라면 최신 상태를 읽은 다음 사용자가 변경을 다시 확인할 수 있게 한다.

## 3. 독립 JavaScript 예제

검증 범위는 각 코드 블록에 대한 `node --check -` 문법 검사다. 아래 예제는 실행 검증을 하지 않았으며 파일·사진·모델·서버·결제 시스템을 사용하지 않는다.

### 예제 1. 제작 신청과 검수의 상태 머신

화면은 반환된 새 객체를 받은 뒤에만 변경한다. 이 예제는 유효한 버전에서 한 단계씩 이동하도록 제한한다.

```javascript
const transitions = {
  draft: { submit: "queued" },
  queued: { review: "checking" },
  checking: { accept: "accepted", requestEdit: "needsEdit" },
  needsEdit: { resubmit: "queued" },
  accepted: {}
};

function moveApplication(application, event, expectedVersion) {
  if (application.version !== expectedVersion) {
    throw new Error("최신 신청을 먼저 읽어 주세요.");
  }

  const allowed = Object.hasOwn(transitions, application.status)
    ? transitions[application.status]
    : {};
  if (!Object.hasOwn(allowed, event)) {
    throw new Error("현재 상태에서 할 수 없는 동작입니다.");
  }
  const nextStatus = allowed[event];

  return { ...application, status: nextStatus, version: application.version + 1 };
}

const draft = { id: "demo-A", status: "draft", version: 1 };
const applicationView = moveApplication(draft, "submit", draft.version);
```

### 예제 2. 가상 결제 확인과 중복 요청

같은 요청 식별자와 주문·금액 조합으로 호출하면 진행 중인 Promise 또는 그 결과를 같이 쓴다. 실패 후 같은 식별자로 시도할 수 있다. 이 예제에는 단일 탭의 메모리만 있다.

```javascript
const attempts = new Map();
const orders = new Map([["DEMO-ORDER", { amount: 7, status: "waiting" }]]);

function simulatePaymentCheck({ requestId, orderId, amount }) {
  if (!requestId) return Promise.reject(new Error("요청 번호가 필요합니다."));
  const fingerprint = JSON.stringify([orderId, amount]);
  const previous = attempts.get(requestId);

  if (previous) {
    return previous.fingerprint === fingerprint
      ? previous.promise
      : Promise.reject(new Error("이미 사용한 요청 번호입니다."));
  }

  const promise = Promise.resolve().then(() => {
    const order = orders.get(orderId);
    if (!order || order.amount !== amount) {
      throw new Error("가상 주문 정보가 일치하지 않습니다.");
    }

    if (order.status === "confirmed") return { ...order };
    const confirmed = { ...order, status: "confirmed" };
    orders.set(orderId, confirmed);
    return { ...confirmed };
  }).catch(error => {
    attempts.delete(requestId);
    throw error;
  });

  attempts.set(requestId, { fingerprint, promise });
  return promise;
}
```

### 예제 3. 승인된 모델 참조와 화면 갱신

로더와 화면을 콜백으로 받는다. 늦게 도착한 결과는 해제하고, 현 선택에서 실패하면 기본 캐릭터 상태를 되돌려준다. 승인 상태와 로딩 플래그의 분리가 핵심이다.

```javascript
function createModelPresenter(loadMock, draw) {
  let ticket = 0;
  let currentModel = null;

  return async function apply(descriptor) {
    const version = ++ticket;
    currentModel?.dispose();
    currentModel = null;
    draw({ kind: "base" });

    if (descriptor?.decision !== "accepted") return;

    try {
      const model = await loadMock(descriptor.id);
      if (version !== ticket) {
        model.dispose();
        return;
      }

      currentModel = model;
      draw({ kind: "custom", model });
    } catch {
      if (version === ticket) draw({ kind: "base", loadFailed: true });
    }
  };
}

const showModel = createModelPresenter(
  async id => ({ id, dispose() {} }),
  view => console.log(view.kind)
);
```

### 예제 4. 가상 잔액 차감과 인벤토리

상점 품목 검증과 잔액 검사를 모두 통과한 후 교체할 상태를 한 번에 만든다. 반환값으로 화면을 그리면 기존 값이 중간에 차감된 상태를 보여주는 일이 없다.

```javascript
const catalog = new Map([["paper-star", 3], ["tiny-mug", 6]]);

function buyWithPoints(state, itemKey, commandId) {
  const existing = state.receipts.get(commandId);
  if (existing) {
    if (existing !== itemKey) throw new Error("요청 번호가 겹칩니다.");
    return state;
  }

  const cost = catalog.get(itemKey);
  if (cost === undefined) throw new Error("품목을 찾을 수 없습니다.");
  if (state.points < cost) throw new Error("포인트가 부족합니다.");

  const receipts = new Map(state.receipts);
  receipts.set(commandId, itemKey);

  return {
    points: state.points - cost,
    inventory: [...state.inventory, { id: commandId, item: itemKey }],
    receipts
  };
}

const account = { points: 8, inventory: [], receipts: new Map() };
const nextAccount = buyWithPoints(account, "paper-star", "demo-buy-01");
```

### 예제 5. 답장 UI와 가상 캐릭터 상태

고정된 응답을 Promise로 전달한다. 화면에서 나가면 이전 응답을 버리고, 같은 제출이 진행 중이면 입력을 건너뛴다. `pose` 문자열은 가상의 표현 상태다.

```javascript
function createStoryPanel(render, mockReply) {
  let ticket = 0;
  let waiting = false;

  return {
    async send(raw) {
      const message = raw.trim();
      if (!message || message.length > 120 || waiting) return;
      const current = ++ticket;
      waiting = true;
      render({ pose: "listening", busy: true });

      try {
        const reply = await mockReply(message);
        if (current === ticket) render({ pose: "wave", text: reply, busy: false });
      } catch {
        if (current === ticket) render({ pose: "rest", error: true, busy: false });
      } finally {
        if (current === ticket) waiting = false;
      }
    },

    close() {
      ticket++;
      waiting = false;
      render({ pose: "rest", busy: false });
    }
  };
}

const panel = createStoryPanel(
  state => console.log(state.pose),
  async () => "오늘도 함께 걸었던 길이 생각나요."
);
```

## 4. 문턱값을 바꿔 보며 공부할 항목

같은 버전으로 두 번 승인 요청을 했을 때의 결과, 모델 A를 기다리던 중 모델 B를 선택했을 때의 화면, 가상 결제 요청이 늦게 응답했을 때 버튼을 잠그는 시점, 재화 차감에 실패했을 때 보이는 잔액을 순서대로 예상해 볼 수 있다. 브라우저 실행, 타이머 재현, 원격 결제 및 다중 탭 검증은 수행하지 않았다.

제작 상태·결제 상태에 해당하는 실제 필드와 줄 번호는 [맞춤 제작](../Systems/Custom_Model_Pipeline.md), [결제와 후원](../Systems/Payment_Sponsorship.md)에서 확인할 수 있다. 재화와 공간 배치 흐름은 [재화와 인벤토리](../Systems/Virtual_Economy_Inventory.md), 제휴·운영용 공유 상태는 [제휴 운영](../Systems/Partnership_Operations.md)에 있다.
