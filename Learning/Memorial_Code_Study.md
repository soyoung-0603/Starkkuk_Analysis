# 코드 학습 · 추모 기록을 입력에서 화면까지 따라가기

확인일 **2026-11-24 (한국시간)** · 대상 [별꾹 공개 웹 클라이언트](https://starkkuk.com/) · 6차

이 교재는 공개 빌드에서 확인한 함수 연결을 따라간다. 초기 비로그인 캡처에서는 ‘추모하기’ 그룹과 관련 DOM을 확인했다. 개인 기록 열람, 글 작성, 사진 전송, 신고, 촬영·공유 등 실제 완료 동작은 관찰하지 않았다. 이전 구조와 계정·배정 분석을 전제로 한다. [서비스 아키텍처](../00_Service_Architecture.md) · [계정·배정 학습](Account_Locker_Code_Study.md) · [추모 기록과 권한](../Systems/Memorial_Gallery_Letters.md) · [사진·캡처 기술](../Systems/Photo_Media_Pipeline.md)

## 1. 출발점은 버튼이 아니라 버튼을 연결하는 코드

소스 검색식은 `niche-write`, `renderMemorial`, `onRecord`, `applyMemorial` 순서다. 첫 이름은 DOM 선택자, 두 번째는 패널을 채우는 함수, 세 번째는 패널이 앱에 반환한 콜백, 마지막은 앱의 상태 반영 함수다. `click` 한 번이 바로 서버에 글을 쓰지는 않는다. 패널이 먼저 선택 키와 기대 버전을 고정하고 기록을 조회한다. 기록이 도착했을 때 현재 패널인지 검사하고 그때 필요한 이벤트를 신규 DOM에 붙인다. [app.js 2165·2503행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [memorial.js 17~42·75~76행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js)

| 사용자 행동 | 이벤트 → 함수 | 검증 및 비동기 경계 | 상태·화면 반영과 실패 |
|---|---|---|---|
| 프로필 사진 선택·저장 | 파일 `change` → `photoData`, 폼 `submit` → 프로필 저장 → `onPhoto` | 파일 존재와 처리 상태 확인. 브라우저 디코딩·전처리 뒤 드래프트 생성. 폼에서 이름·날짜 확인, 새 기록 버전으로 사진 저장 | 폼의 미리보기는 로컬 임시 상태다. 두 요청 중 사진만 실패할 수 있어 이미 반영된 프로필과 구분해야 한다. [pet-profile-ui.js 51~63행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) · [app.js 2083·2211~2219행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 추모 패널 사진 교체 | 사진 등록 `click` → 파일 `change` → `photoData` → 패널의 `request` | 현재 패널, 선택 파일·잠금 확인. 기본 전처리 뒤 대표 사진 변경을 기다린다. | 성공 응답으로 패널·상태·3D 액자를 갱신한다. 실패하면 패널 안내, 입력 초기화, 재선택을 허용한다. [memorial.js 31~42행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 722~752·1849~1867행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 사진 확대 | 이미지가 있는 버튼 `click` → `classList.toggle` | 새 데이터 조회 없이 CSS 클래스와 `aria-expanded` 변경 | 같은 사진을 확대·축소한다. 대표 사진이 없으면 빈 표시가 있으며 독립 갤러리 탐색 로직은 확인되지 않았다. [memorial.js 33~37행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) |
| 보호자 글 작성·수정 | 글 버튼 `click` → `editor('parent')` → 폼 `submit` | `record.mine`와 현재 렌더 검증. `FormData`로 값을 모으고 이름·본문 공백을 검사한다. 단일 글 필드 변경을 기다린다. | 저장한 기록을 패널에 다시 그리고 선택된 아이의 3D 편지판 발췌를 갱신한다. 저장 실패는 폼에서 알리고 잠금을 푼다. [memorial.js 43~44·67~76행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 750·1653~1673행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 방문 추모글 게시·삭제 | 폼 `submit` 또는 삭제 버튼 `click` → `request` | `canComment()`로 입력 조건 확인. 삭제 버튼 표시는 기록 또는 글의 `mine`을 사용하며 클릭 후 확인창을 거친다. | 응답의 댓글 배열로 다시 그린다. 실패하면 최신 화면과 입력을 보존하고 오류를 알려 준다. 읽기 전용 방문자 이름과 서버의 실제 작성 자격은 별개다. [memorial.js 20~22·33~40·58~74행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) |
| 댓글 작성 차단 | 체크 상태 `change` → 버전 포함 설정 저장 → `onRecord` | 토글 조작 전 값을 보관하고 현재 패널·작업 잠금을 확인한다. 응답의 설정 버전을 앱이 다시 비교한다. | 성공은 응답값으로 확정한다. 실패는 체크 상태를 되돌린다. 기존 글이 남는다고 안내한다. [memorial.js 32·45~56행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 722~740행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 추모하기 클릭 / 홀에서 촛불·헌화 | 추모하기 `click` → 횟수 요청 → `onRemember`. 홀 버튼 `click` → `startOffering` → 완료 콜백 | 첫 경로는 배정·요청 세대·진행 상태 검사. 둘째는 카메라와 3D 연출 가능 여부·접근 거리 검사 | 횟수 응답 뒤 배경과 연출을 갱신한다. 저장 성공 뒤 연출만 실패하는 복구 문구가 있다. 홀 의식은 이 호출 경로 기준으로 3D 물체·자세·소리 및 완료 알림을 갱신한다. [tribute-ui.js 4~31행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5706ec2a3d8affa9b3887175/tribute-ui.js) · [app.js 2371~2441·2615행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [candle-memorial.js 195~255행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6048c8b4d99eeb49d3fefcd7/candle-memorial.js) |
| 장면 촬영·공유 | `click` → `shoot` → `capture` → 별도 공유 `click` | 화면·렌더러·진행 상태 확인. 동기 프레임 복사 이후 비동기 PNG 인코딩, 공유 지원 여부 검사 | 미리보기·다운로드·공유 UI. 촬영 실패는 재촬영 안내, 공유 실패는 다운로드·길게 눌러 저장 안내가 있다. 화면을 나가면 오래된 미리보기 결과를 폐기한다. [niche-photo.js 17~53행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js) · [niche-capture.mjs 20~88행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/178e70744f12bb6706f3c2f5/niche-capture.mjs) |

## 2. 실제 코드에서 JavaScript 문법 읽기

### 값이 준비되는 시간

- **이벤트**는 브라우저가 알려주는 일이다. 폼의 `submit`과 파일 입력의 `change`는 별개다. `preventDefault()`로 브라우저 기본 폼 전송을 중단한 뒤 스크립트가 값을 검사하고 요청한다. `FormData`는 이름이 있는 폼 값들을 가져오는 API다. [memorial.js 41~42·69~73행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js)
- **Promise**는 아직 오지 않은 성공 값이나 오류를 나타낸다. `await`는 비동기 함수 안에서 그 결과가 도착할 때까지 이후 문장을 미룬다. 브라우저 전체가 멈추지는 않는다. 사진 파일을 읽는 동안에도 사용자가 화면을 떠날 수 있다는 점이 중요하다. [photo-input.mjs 8~21행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/904f7c0ddf5b269cc8d5a851/photo-input.mjs) · [niche-photo.js 28~41행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js)
- **콜백**은 다른 함수에 전달해 적절한 때 실행할 함수다. 캔버스 `toBlob`은 PNG가 준비되면 콜백을 실행한다. `niche-capture.mjs`는 이 콜백을 Promise로 감싸 호출부가 `await`할 수 있게 한다. `onRecord`는 다른 예다. 패널이 응답을 그릴 때 앱에게 기록을 전달한다. [niche-capture.mjs 53~58행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/178e70744f12bb6706f3c2f5/niche-capture.mjs) · [memorial.js 31행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 2165행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js)
- **동기 작업이 먼저 필요한 경우.** 장면을 그린 직후 픽셀을 다른 캔버스로 복사해야 클릭 시점의 구도를 유지할 수 있다. PNG 인코딩에 앞서 렌더러 설정을 복원한다. 셀카 코드도 아바타 자세와 카메라를 저장했다가 정리한다. [niche-capture.mjs 26~47·74~87행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/178e70744f12bb6706f3c2f5/niche-capture.mjs) · [niche-selfie.mjs 25~64행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/67c6599771a6c97c23238257/niche-selfie.mjs)

### 다른 화면을 덮어쓰지 않는 조건

- **상태**는 지금 선택한 아이, 그 아이의 기록, 진행 중 표시처럼 UI가 읽는 값이다. **캐시**는 이미 조회한 사진이나 목록을 다시 쓰기 위한 임시 사본이다. `nicheMemorials`는 현재 공간의 아이별 기록을 들고 있고 `locker-photos.js`는 여러 공간 액자용 사진을 캐시한다. 앱은 사진 변경 시 관련 목록과 사진 캐시를 각각 갱신한다. [app.js 722~752행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [locker-photos.js 7~15·55~74행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bb7677c26d7a17ea7d835357/locker-photos.js)
- **렌더 세대**나 `epoch`는 ‘이 응답이 지금 화면의 작업인가’를 검사한다. **버전**은 ‘이 데이터가 내가 아는 기록과 같은 시점인가’를 검사한다. 패널을 닫아 다시 열면 같은 데이터 버전이어도 렌더 세대는 달라진다. 다른 사람이 데이터를 바꿨다면 화면이 같아도 버전이 달라질 수 있다. [memorial.js 16~22·75~76행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 722~752행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js)
- **부분 실패**는 먼저 끝난 변경이 남는데 이후 작업이 실패하는 경우다. 프로필과 사진이 별도 요청인 경로에서 발생할 수 있다. 클라이언트는 첫 응답을 반영한 뒤 두 번째 저장의 실패를 사용자에게 전달한다. **되돌리기**는 댓글 설정 체크박스에서 볼 수 있다. 로컬에서 먼저 보인 체크 상태를 저장 실패 때 이전 값으로 돌린다. [pet-profile-ui.js 54~63행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) · [memorial.js 45~56행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js)

원본의 짧은 발췌로 구분할 수 있다. `"record.mine||record.commentsBlocked!==true"`는 폼을 보여 줄지 판단하는 식이다. `"onRecord(record,change)"`는 새 기록을 앱에 넘기는 지점이다. 두 식만으로 서버 권한이나 데이터 보존 방식을 설명할 수는 없다. [memorial.js 21·31행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js)

## 3. 독립 JavaScript 예제

아래 네 예제는 교육용 자체 코드이며 **미실행**이다. 앱 모듈, 서비스 URL과 테스트 계정 없이 사용할 수 있도록 필요한 DOM이나 함수는 인자로 받는다. 자료는 실습용 임의 값으로 가정한다.

### 예제 1. 사진 고르기와 미리보기

파일 선택과 화면 출력을 연결한다. 사진을 교체하거나 화면을 닫을 때 Blob의 임시 URL을 해제한다. MIME 검사는 교육용 최소 검사다. 실제 전처리에서는 파일 바이트, 용량과 디코딩을 추가로 확인한다.

```javascript
function attachImagePreview(input, image, showStatus) {
  let previewUrl = null;

  function clear() {
    image.removeAttribute("src");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  function selectFile() {
    clear();
    const file = input.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showStatus("JPEG, PNG, WebP 중 하나를 선택하세요.");
      return;
    }

    previewUrl = URL.createObjectURL(file);
    image.src = previewUrl;
    showStatus("미리보기를 준비했어요.");
  }

  input.addEventListener("change", selectFile);
  return () => {
    input.removeEventListener("change", selectFile);
    clear();
  };
}
```

### 예제 2. 편지 초안을 메모리에 보관하기

패널을 다시 그릴 때 입력칸을 바꿔 붙여도 같은 객체를 넘기면 초안을 복원할 수 있다. 페이지를 다시 열면 이 메모리 초안은 사라진다. 아래 예제의 초안 보존은 독립 설계이며 별꾹에서 영구 초안을 확인했다는 뜻이 아니다.

```javascript
function attachLetterDraft(textarea, preview, draft) {
  function update() {
    draft.text = textarea.value;
    preview.textContent = draft.text.trim().slice(0, 60);
  }

  textarea.value = draft.text ?? "";
  update();
  textarea.addEventListener("input", update);
  return () => textarea.removeEventListener("input", update);
}
```

### 예제 3. 게시 요청 중 버튼 잠그기

`savePost`는 실습용 저장 함수를 전달받는다. `isCurrentView`는 화면이 전환됐을 때 오래된 결과로 새 화면을 바꾸지 않게 도와준다. `drawSaved`가 받은 값은 저장 성공 응답이다.

```javascript
function attachPostForm(form, savePost, drawSaved, showStatus, isCurrentView) {
  const button = form.querySelector('button[type="submit"]');
  let saving = false;

  async function submit(event) {
    event.preventDefault();
    if (saving || !isCurrentView()) return;

    const message = String(new FormData(form).get("message") ?? "").trim();
    if (!message || message.length > 200) {
      showStatus("본문은 1~200자로 입력하세요.");
      return;
    }

    saving = true;
    button.disabled = true;
    try {
      const saved = await savePost({ message });
      if (isCurrentView()) drawSaved(saved);
    } catch {
      if (isCurrentView()) showStatus("저장하지 못했어요. 입력은 남아 있어요.");
    } finally {
      saving = false;
      button.disabled = false;
    }
  }

  form.addEventListener("submit", submit);
  return () => form.removeEventListener("submit", submit);
}
```

### 예제 4. 사진만 실패하면 그 단계만 다시 시도하기

프로필 성공과 사진 성공을 별도로 표시한다. 반환된 재시도 함수는 이미 저장된 프로필의 ID로 사진 단계만 다시 실행한다. 아래 예제는 순서를 보여 주며 영구 저장이나 동시 변경 처리의 구현은 저장 함수에 맡긴다.

```javascript
async function saveProfileAndPhoto(profile, photo, services, showStatus) {
  const savedProfile = await services.saveProfile(profile);
  showStatus("프로필을 저장했어요.");

  async function savePhotoOnly() {
    try {
      await services.savePhoto(savedProfile.id, photo);
      showStatus("사진도 저장했어요.");
      return { profile: savedProfile, photoSaved: true };
    } catch {
      showStatus("프로필은 저장됐어요. 사진만 다시 시도할 수 있어요.");
      return { profile: savedProfile, photoSaved: false, retry: savePhotoOnly };
    }
  }

  return savePhotoOnly();
}
```

## 4. 코드 읽기 연습과 확인 범위

| 연습 문제 | 근거에서 도출할 답 |
|---|---|
| 사진을 고르고 ‘저장’을 누르지 않았다면? | 계정 프로필 편집 화면에서는 초안만 바뀐다. 추모 패널과 공간 프로필에는 파일 변경 직후 저장하는 별도 경로가 있다. [pet-profile-ui.js 51~63행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) · [memorial.js 41~42행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) · [app.js 2211~2219행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 패널을 닫은 뒤 이전 조회가 도착한다면? | `WeakMap` 세대와 패널 이름을 검사한다. DOM 적용 방지는 이미 시작한 모든 요청의 네트워크 취소와는 별개다. [memorial.js 16~22·31·75~76행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) |
| 촬영에 성공했는데 공유가 안 된다면? | 공유는 별도 클릭이므로 PNG 파일 받기·길게 눌러 저장을 사용할 수 있다. 공유 시트의 실제 동작은 기기별로 검증해야 한다. [niche-photo.js 28~51행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8976452c83343942dffbf241/niche-photo.js) |
| 버튼이 보이면 그 역할에 저장 권한이 있다는 뜻인가? | 확인한 것은 데이터에 따른 표시 조건과 요청 코드다. 서버 역할 검사, 데이터베이스와 보관 기간, 인증 사용자의 실제 성공 여부는 미확인이다. [memorial.js 20~22·31~36·67~76행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/8303386815792b082ce80924/memorial.js) |

7차에서는 광장의 `plazaComments`와 추모함의 `comments[]`를 비교한 뒤, `presence`의 표시 이름·재연결과 글 작성자 표시를 추적하고, 마지막으로 조회·폴링·실시간 전송이 어떻게 다른 화면 갱신을 만드는지 정리할 수 있다. [plaza-boards-ui.js 2~3·27~34행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/57d83d47ccb6428364f3da4b/plaza-boards-ui.js) · [presence.js 62·128·138·266행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cb6a99e7c4103839707d0ab5/presence.js) · [app.js 2165·2615~2617행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js)

## 근거 기록

버전이 고정된 공개 JS의 원문 행 번호를 링크했다. 초기 화면·DOM과 가져온 정적 파일은 각각 기존 REA `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`, 보완 REA `ev_77cf6124a7da890a66a01dcbccef541df27e25ebb8b2b7bb1d2301f43a634afa`에 근거한다. 홀의 촛불·헌화 모듈은 `ev_5b1da4167eef5fe33889e97a8e749e0dc83c8dff2eedcba5e21f5692f55a8e4e`에서 확인했다. 이 교재의 예제는 정적 검토 범위다.
