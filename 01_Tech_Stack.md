# 별꾹 공개 웹 클라이언트 기술 조사

- 대상: https://starkkuk.com/
- 목적: 펫로스 정서 지원 앱 개발을 위한 경쟁 서비스 기술 조사, 특히 3D 반려동물 구현 방식 확인
- 관찰일: 2026-11-23, 초기 방문 시작 21:17:25 KST
- 환경: REA MCP rea-agents 6.10.1, 기존 Chrome/Chromium 157.0.8103.80, 임시 비로그인 프로필, 1280×720, ko-KR, Asia/Seoul
- 판정: **확인**은 DOM·요청 또는 공개 코드에서 직접 확인, **추정**은 해당 증거의 해석, **확인 불가**는 관찰·검증하지 못한 사항이다. 코드 존재와 해당 코드의 실제 실행은 구분한다.

## 핵심 결론

**관찰한 공개 첫 화면의 3D 기술은 Three.js r180 기반 WebGL이다.** HTML import map, 실제 생성된 canvas의 엔진 표시, 공개 앱 코드의 WebGLRenderer 생성 및 렌더 루프가 일치한다.

**기본 반려동물은 프로그램으로 조합하는 캐릭터이고, 별도의 사용자 맞춤 모델을 연결하는 경로도 있다.** 기본형은 공통 구형 기하, 부위별 크기·색·무늬와 털 셰이더를 조합한다. 맞춤형은 승인 상태의 모델 설명자가 있을 때 동적으로 로더를 불러와 기본형을 교체하도록 작성되어 있다. GLB와 GPU 텍스처 대응 경로는 공개 코드에서 확인했지만, 이번 비로그인 초기 방문에서 GLB 다운로드나 모델 내부 구조는 관찰하지 못했다.

React·Vue·Next.js·Unity·Babylon.js 사용을 뒷받침하는 증거는 조사 범위에서 발견하지 못했다. 이를 전체 서비스에서 해당 기술이 전혀 없다는 결론으로 확대하지 않는다.

## 1. REA 도구 가용성 및 조사 방법

### 1.1 도구 선택과 실행 결과

| 도구 | 목적 | 결과 |
|---|---|---|
| binary_session({}) | 연결 및 웹 도구 가용성 확인 | 성공. 웹 도구 available, 열린 바이너리 대상 없음 |
| capture_browser_scenario | 공개 URL을 실제 브라우저로 열어 DOM·접근성·요청 메타데이터 관찰 | 성공. 초기 URL 이동과 6초 대기만 수행 |
| get_evidence_bundle | 이미 확보한 REA 기록을 읽어 필요한 사실 확인 | 성공. 추가 사이트 요청 없이 기록 조회 |
| capture_browser_scenario | 초기 방문에서 이미 로딩된 관련 공개 JavaScript 11개의 본문 확인 | 성공. 스크립트를 문서로 열어 읽음. 원본 코드를 변경·재실행하지 않음 |

inspect_web_page와 analyze_web_bundle은 단순 URL이 아니라 loopback CDP endpoint와 target_id가 필요한 도구다. 이번에는 기존 디버깅 브라우저를 변경하지 않고, 설치된 Chrome을 REA가 임시 프로필로 실행하는 capture_browser_scenario 경로를 선택했다. REA의 URL 관찰 자체는 성공했으므로 브라우저 개발자 도구 대체 분석에 의존하지 않았다.

보조적으로 호스트의 Node fetch와 PowerShell HTTP 요청을 시도했으나 각각 “fetch failed”, “알려진 호스트가 없습니다. (starkkuk-media.asdfstudio-cs.workers.dev:443)”로 실패했다. 호스트 셸의 요청 경로에서 발생한 문제이며 REA 연결 실패나 사이트 전체 장애를 뜻하지 않는다. 이후 요청은 성공한 REA 브라우저 경로만 사용했다. Codex 설정 변경, 패키지 설치·업데이트는 하지 않았다.

### 1.2 요청 범위와 제한

초기 방문 한 번에 사이트 자체가 420건의 요청을 발생시켰다. 관찰 기준 script 280건, stylesheet 76건, image 36건, fetch 16건, 그 외 document/font/manifest/other가 포함된다. 리다이렉트 전후 URL이 별도 요청으로 집계될 수 있으므로 이 수치는 독립 파일 수와 다르다.

- 출처별: starkkuk.com 72건, starkkuk-media.asdfstudio-cs.workers.dev 348건.
- 상태별: 2xx 366건, 3xx 53건, 4xx 1건.
- 초기 관찰은 응답 본문·요청 본문·헤더 값을 수집하지 않았으며, 저장소 키·값과 사진 파일 본문도 조사하지 않았다.
- 후속 확인은 위 초기 방문에서 실제 요청된 기술 관련 JavaScript 11개만 문서로 읽었다. 요청 생성 스크립트 실행, 비공개 URL 추측, 디렉터리 열거, API 재호출은 하지 않았다.
- 로그인, 계정 생성, 쓰다듬기·선물·분양·글쓰기 등 상태 변경 동작은 수행하지 않았다. 브라우저가 초기화 과정에서 자동 발생시킨 API 요청만 메타데이터로 관찰했으며, 이용자 기록의 응답 내용은 읽지 않았다.
- 모델·텍스처·이용자 사진을 파일로 추출하거나 보관·재배포하지 않았다. 공개 코드도 별도 프로젝트 파일로 저장하지 않았다.
- 초기 기록은 1건의 미완료 요청 및 관찰 종료 이후 활동의 누락 가능성을 보고한다. 전체 서비스/모든 화면의 트래픽 목록이 아니다.
- 두 REA 브라우저 실행 모두 cleanup=terminated-owned-process로 종료되었다.

## 2. 웹사이트 기술 스택

| 항목 | 판정 | 구체적 증거 | 해석과 한계 |
|---|---|---|---|
| Three.js r180 | 확인: 런타임 DOM + 코드 | import map의 three → /vendor/three.module.js, canvas의 data-engine="three.js r180"; app.js 1186·1192·1200·1203행 | 실제 3D canvas와 렌더러 생성 코드가 일치 |
| WebGL | 확인: 코드 + canvas 생성 | app.js 1200행 THREE.WebGLRenderer, 1203행 world 영역에 canvas 삽입 | WebGL2 세부 context 속성·GPU 모델·실제 확장 지원 목록은 미측정 |
| 네이티브 JavaScript ES modules | 확인 | boot.js 및 app.js의 import/export, HTML의 type=module, 다수 .mjs 요청 | 번들 하나에 모든 UI를 넣기보다 다수 모듈을 직접 로딩하는 배포 형태 |
| 직접 DOM 조작형 UI | 확인: 조사 코드 | boot.js의 document.createElement·querySelector·이벤트 처리, app.js의 DOM/HUD 제어, main/world/header/navigation 요소 | 조사한 주 화면은 직접 DOM 조작 중심으로 판단 |
| React / Vue / Next.js / Nuxt | 미확인 | 초기 DOM에 _next·__NEXT_DATA__·_nuxt·대표 Vue 표식 없음. 선택한 모듈에서 해당 렌더러 증거 없음 | 개발 저장소·전체 모듈을 조사하지 않았으므로 완전 부재를 증명하지 않음 |
| Unity WebGL / Babylon.js | 미확인 | 조사 범위에서 Unity 로더·Unity 데이터/WASM 로딩이나 Babylon 엔진 증거 없음 | 이번 화면의 Three.js 사용은 확인되지만 다른 화면까지 배제하지 않음 |
| 별도 정적 미디어 호스트 | 확인 | 다수 script/style/image가 workers.dev의 builds/식별자/... 및 content/식별자.확장자로 로딩 | 호스트 이름으로 Cloudflare Workers 계열 전달 경로를 추정할 수 있으나 원본 저장소·백엔드 구조는 불명 |
| 설치형 웹 앱 관련 기능 | 확인: 표식과 로딩 | /manifest.webmanifest, install.js, beforeinstallprompt 관련 콘솔 메시지 | 실제 설치·오프라인 지원 수준·서비스워커 캐시 전략은 미검증 |

모듈 URL의 builds 식별자와 content의 긴 식별자는 버전별·내용별 정적 배포 및 캐시 활용을 시사한다. 단, 식별자의 생성 규칙, 실제 Cache-Control 정책, 캐시 적중률은 확인하지 않았다. 서버 프레임워크·데이터베이스·호스팅 원본은 공개 프런트엔드 정보만으로 확정하지 않는다.

## 3. 3D 리소스와 캐릭터 구조

### 3.1 파일 형식: 실제 요청과 코드 경로 구분

| 형식/리소스 | 정상 초기 방문에서 실제 요청 | 공개 코드에서 확인한 내용 | 결론 |
|---|---|---|---|
| GLB | 관찰 0건 | pet-model-textures.js 13~15행에 /api/pet-models/assets/32자리식별자.glb 및 언어별 -gpu4k-v1.glb 변환 경로 | GLB 지원 경로는 확인. 실제 사용자 모델의 파일·내용·다운로드 성공은 미확인 |
| GLTF / FBX | 관찰 0건 | 선택한 코드에서 이를 직접 사용하는 근거 없음 | 해당 형식 사용 여부 확인 불가 |
| KTX2 / Basis / WASM | 관찰한 해당 확장자 파일 0건 | pet-model-textures.js 4~10행에 KTX2Loader, Basis JS/WASM, 압축 텍스처 확장 점검 | 조건부 GPU 압축 텍스처 지원 코드 확인. 이번 세션의 실제 트랜스코딩은 미관찰 |
| 배경 JPG | 요청 확인 | oak veneer, Travertine, Marble, cotton jersey의 color/diffuse·normal·roughness 파일 | 재질 역할과 별도 이미지 기반 구조 확인 |
| 캐릭터 표면 PNG | 요청 확인 | pet-avatar.js 36행의 content/766f…fbf80.png와 초기 request-353 일치 | 공유 털 표면용 이미지 경로 확인. 원본 이미지 추출·시각 검사는 하지 않음 |
| 생성형 DataTexture / CanvasTexture | 네트워크 파일 아님 | pet-avatar.js 13~35행, plaza-pets.js 18~19행 | 눈·입·코 등 일부 표정 디테일과 이름표를 코드로 생성 |

GLB 경로의 파일명 “gpu4k”만으로 내부 텍스처가 실제 4096×4096인지, 용량·압축률이 얼마인지 판단하지 않는다. GLB가 텍스처와 애니메이션을 포함하는지 여부도 실제 파일을 읽지 않았으므로 확인 불가다.

### 3.2 기본 캐릭터: 공통 요소 조합

**확인: 코드.** pet-avatar.js 8행은 공통 SphereGeometry를 정의한다. 39행 이후 기본 아바타 생성 함수는 species·color·appearance를 받아 THREE.Group 아래에 머리·몸·다리·귀·꼬리 및 표정 요소를 구성한다. 일부 형태는 기하의 정점 위치를 변형하고, 다른 종은 별도 공통 모듈을 이용한다.

pet-appearance-model.js 11~25행은 이름을 기준으로 메시를 몸·머리·좌우 귀·눈·발·꼬리 등으로 분류한다. 28~45행은 부위 색, 몸 폭·길이, 얼굴 크기·폭·높이, 귀·꼬리 크기를 적용한다. 따라서 **기본형은 개체마다 독립적인 FBX/GLB를 불러오는 방식으로만 구성된 것이 아니라, 재사용 가능한 형태와 파라미터를 조합하는 방식**이다.

plaza-pets.js 15~17행은 외형 signature별 template을 저장하고 복제한다. 이 경로 역시 공통 캐릭터 템플릿의 재사용을 직접 뒷받침한다. 이는 해당 모듈의 설계에 대한 확인이며 모든 사용자 맞춤 모델이 같은 기하를 공유한다는 뜻은 아니다.

### 3.3 맞춤 모델: 기본형 위의 선택적 대체 경로

**확인: 코드.** pet-avatar.js 184~215행에서 다음 절차가 관찰된다.

1. 먼저 기본 절차형 아바타를 생성한다.
2. profile.userModel이 없거나 상태가 승인 조건을 만족하지 않으면 기본형을 반환한다. 기본형 사용 옵션도 있다.
3. 보이는 companion/petting 갱신 경로에서 로딩이 시작되도록 구성한다.
4. custom-pet-avatar.js를 동적으로 import하고 acquirePetModel을 호출한다.
5. 성공하면 기본형 자식을 숨기고 로딩된 actor.root를 추가한다.
6. 메모리/캐시 부족 또는 일부 네트워크 오류에 재시도·기본형 복귀 경로가 있다.

**추정:** 기본형과 별도 제작된 맞춤 모델을 함께 지원하는 혼합 구조다. 개체별 모델 설명자와 식별자 기반 GLB 주소 체계가 이를 지지한다.

**확인 불가:** 맞춤 모델 하나가 한 동물 전용인지, 여러 동물이 동일 메시를 공유하는지, 사진에서 자동 생성되는지, 수작업 제작인지, 모델 공급업체와 제작 도구는 무엇인지. 초기 화면에서는 동적 custom-pet-avatar.js와 실제 GLB가 요청되지 않았다. 선언되어 있다는 이유만으로 로더를 별도 호출하거나 사용자 모델 주소를 추측하지 않았다.

### 3.4 텍스처·털 표현

- **확인: 코드:** pet-avatar.js는 256×256 눈, 128×128 표정 눈, 96×96 코 등 DataTexture를 생성한다. 공유 털 PNG를 bumpMap으로 사용하며 실패 시 생성한 노이즈 텍스처로 대체한다. MeshPhysicalMaterial의 roughness·sheen·specularIntensity 설정이 있다.
- **확인: 코드:** pet-coat.js는 6개 층, 공유 기하와 InstancedMesh, gl_InstanceID를 이용하는 셰이더 수정을 구성한다. 얇게 중첩한 표면으로 짧은 털을 표현하는 shell 방식으로 해석된다.
- **확인: 코드:** pet-model-textures.js는 ASTC/BPTC/ETC/S3TC 확장 중 지원되는 것이 있을 때 KTX2 로더를 준비하며 worker 한도를 2로 설정한다.
- **미관찰:** 특정 캐릭터에서 털 셰이더가 실제 몇 번 그려졌는지, KTX2가 실제로 사용됐는지, GPU 메모리 사용량과 압축 포맷 선택 결과.

### 3.5 애니메이션

**확인: 코드.** plaza-pets.js 47~54행에서 dt 기반 갱신, 다리 회전의 사인파, 꼬리 흔들기, 머리 기울기, 걷기 시 상하 움직임, 몸 방향 보간이 보인다. 기본형 움직임에는 메시/부위 변환을 코드로 계산하는 절차형 애니메이션이 포함된다. pet-avatar.js 10행에는 종별 보폭·흔들림·꼬리 속도 계수가 있다.

**확인 불가:** 맞춤 GLB 안의 clip 이름·개수·길이, 스켈레톤/본 수, 스키닝·모프 타깃, 외부 애니메이션 파일 유무, 리타기팅 방식. 이번 자료로 맞춤 모델이 동일한 절차형 애니메이션을 사용한다고 단정할 수 없다.

## 4. 장면 렌더링과 캐릭터·배경 구성

### 4.1 렌더링 경로

app.js 1186~1203행에서 Scene, Fog, PerspectiveCamera, WebGLRenderer를 생성한다. 초기 카메라 설정은 시야각 52도, near 0.06, far 560이다. renderer는 HTML #world에 들어가고, 나머지 상단 상태·알림·이동 패드·공간 메뉴는 HTML UI로 겹쳐진다. “3D 공간 전체가 동영상/이미지 배경”인 구조를 뒷받침하는 증거는 없으며, 실시간 장면과 DOM HUD를 결합한 구조가 확인된다.

app.js 2535행 이후 animate 함수는 requestAnimationFrame을 예약하고 상태·움직임·카메라를 갱신한 뒤 renderer.render(scene,camera)를 호출한다. 코드를 읽어 확인한 루프이며 실제 FPS·프레임 시간은 측정하지 않았다.

### 4.2 배경과 조명

app.js 1221~1305행은 색상별 재질 캐시, 공유 Box/Sphere/Cylinder 등 기본 기하, 나무·석재·대리석·천 재질, 반복 텍스처와 normal/roughness map을 구성한다. 별도 환경 모듈을 불러오고 공간 전환에 따라 조명·환경 강도·노출을 바꾼다. 배경 전체를 하나의 대형 GLB로만 구성했다고 판단할 근거는 없다. 확인한 범위에서는 JavaScript로 조합하는 기하와 재질이 중요한 역할을 한다.

- Fog의 초기 범위는 80~160, 배경색은 #e7eedf이다.
- 출력 색 공간은 sRGB, tone mapping은 ACESFilmic, 초기 노출은 0.95다.
- Hemisphere/Directional 계열 조명 제어와 장면별 조명 값 변경이 코드에 존재한다.
- 코드로 구성한 스튜디오에서 PMREMGenerator로 환경 텍스처를 생성하는 경로가 있다. 이 사실만으로 HDR 파일을 다운로드한다고 보지 않는다.
- 배경에 배치되는 게시물 사진·사용자 추모 정보는 기술 분석 대상으로 읽거나 보관하지 않았다.

## 5. 확인 가능한 성능 최적화

아래는 **공개 코드에 구현된 전략**이다. 이번 세션에서 모든 분기가 실행됐거나 실제 성능이 개선됐다는 벤치마크 결과는 아니다.

| 전략 | 구체적 근거 | 범위·주의 |
|---|---|---|
| 디바이스별 해상도 제한 | render-profile.mjs 2~5행. UA·터치·메모리로 mobile 판별. 모바일 배율 상한 1.5와 화면 면적 기반 조절, 데스크톱 상한 1.6 | deviceMemory≤4도 mobile 판정에 포함. 모든 기기를 정확히 분류한다고 보장하지 않음 |
| 모바일 그림자 비활성화 | 같은 모듈의 shadows:!mobile, app.js 1203행 | 안티앨리어싱은 true로 유지 |
| 렌더러 전력 선호 설정 | app.js 1200행 powerPreference 값 low-power | GPU 선택의 힌트이며 실제 저전력 GPU 사용을 보장하지 않음 |
| 원거리 캐릭터 인스턴싱 | plaza-pets.js 13·26~45행. 15개 부위별 InstancedMesh, 공유 저해상도 기하·재질 | 전체 장면 draw call이 15라는 뜻은 아님 |
| 근거리 상세 모델 수 제한 | plaza-pets.js 51~53행. 거리 24 미만에서 가까운 최대 6개, 프레임당 최대 하나 생성 | 해당 광장 동물 모듈의 전략 |
| 원거리 표시 제한 | plaza-pets.js 32행 거리 95 초과 숨김, 54행 이름표 거리 13 제한 | Three.js 일반 frustum culling과 별개. 해당 instanced mesh는 frustumCulled=false |
| 움직임 계산 주기 분리 | plaza-pets.js 50~51행 움직임 누적 0.1초, 상세 후보 갱신 약 0.4초 | 네트워크 갱신 주기와 구분 |
| 외형 템플릿 재사용 | plaza-pets.js 15~17행 signature별 template 캐시·복제 | 비사용 template 정리 로직 존재. 캐시가 모든 상황에서 딱 10개로 제한된다고 단정하지 않음 |
| 숨김/문맥 손실 대응 | app.js animate의 document.hidden/contextLost 검사; plaza-pets.js 48행 | RAF 예약 자체를 모두 중지하는 것은 아님 |
| 정적 환경 처리 | app.js의 matrixAutoUpdate=false, batchStatic import 및 batchEnvironment 호출 | batching 모듈 내부를 조사하지 않아 정확한 병합·인스턴싱 알고리즘 미확인 |
| GPU 압축 텍스처 준비 | pet-model-textures.js의 KTX2·Basis 지원 검사와 worker 제한 | 실제 맞춤 GLB/KTX2 실행은 미확인 |
| 지연 로딩과 실패 복구 | boot.js의 동적 app import, pet-avatar.js의 맞춤 모델 지연 로딩·fallback·메모리 오류 재시도 | 초기 기본 모듈 요청 수는 여전히 많음 |
| 자원 해제 | pet-avatar.js, pet-coat.js, app.js의 geometry/material/texture dispose | 장시간 사용 시 메모리 누수가 없다는 증명은 아님 |

초기 420건의 요청은 모듈·스타일 수가 많음을 보여 주지만 로딩 성능이 나쁘다는 결론은 아니다. 압축 크기·캐시·병렬 전송·네트워크 조건을 측정하지 않았으며 LCP, INP, GPU 프레임 시간, 모바일 실기기 성능은 미검증이다.

## 6. 기술적 한계와 추가 검증

### 확인된 사실

- 공개 첫 화면이 Three.js r180 canvas를 생성하고 관련 모듈을 로딩한다.
- 공개 앱 코드는 WebGLRenderer·Scene·PerspectiveCamera 및 RAF 렌더링 루프를 구현한다.
- 기본 동물은 공통 기하와 외형 파라미터를 조합하며, 맞춤형 actor로 교체하는 별도 경로가 있다.
- GLB 주소 변환과 KTX2/Basis 지원 경로, 공유 재질 이미지, 절차형 부위 애니메이션, 거리별 인스턴싱이 코드에 존재한다.

### 추정으로 남는 사항

- 전체 주 화면이 범용 UI 프레임워크보다 순수 ES modules/DOM 조작 위주라는 해석.
- 맞춤 모델은 식별자 기반 별도 파일을 연결하는 구조라는 해석. 개체별 파일의 실제 유일성까지는 미확인.
- builds/content URL이 캐시 친화적 버전 배포를 위한 구조라는 해석.
- 위 최적화들이 실제 사용자 환경에서 충분한 성능을 제공하는지는 별도 측정 필요.

### 확인 불가 및 이번 조사에서 하지 않은 사항

- 서비스 내부 저장소, 서버 프레임워크, DB, 원본 모델 제작 파이프라인, 라이선스와 에셋 출처.
- 특정 모델의 삼각형·버텍스 수, 텍스처 실제 해상도, 본·clip·morph·GLB extension 목록.
- Unity/React/Vue 등이 다른 화면 또는 미관찰 경로에 전혀 없다는 전역 부재 증명.
- 사용자 맞춤 3D의 사진 재현 정확도, 생성형 AI 적용 여부, 자동 생성/수작업 비율.
- 실제 GPU 기능·렌더 통계, 안정 FPS, 메모리 피크, 기기 발열·배터리, 장시간 안정성.
- 로그인 화면 이후의 동작, 관리자 기능, 다른 이용자의 상세 추모 데이터.
- 취약점 탐색, 비공개 API 접근, 접근 제어 우회, 모델 주소 추측 및 에셋 추출.

### 허용 범위에서 가능한 후속 검증

1. 권한이 있는 테스트 계정과 자체 동물 자료로 맞춤 3D를 정상 표시한다. DevTools Network에서 정상 로딩된 모델의 URL·MIME·크기·완료 상태만 확인한다. 주소를 추측하거나 타인 모델을 열거하지 않는다.
2. 모델 내부 검증이 별도로 허용되는 경우에만 해당 테스트 모델의 glTF JSON 메타데이터로 meshes/materials/textures/animations/extensions를 확인한다. 원본 에셋을 재배포하지 않는다.
3. DevTools Performance 및 브라우저 렌더링 도구로 초기 로딩·유휴·걷기·근접 뷰를 각각 1회씩 기록한다. 동일 해상도와 실제 모바일 기기에서 프레임 시간·메모리·렌더 비용을 비교한다.
4. REA passive 도구를 사용할 경우 사용자가 연 디버깅 브라우저의 loopback CDP endpoint와 target_id를 선택한다. inspect_web_page는 소스·네트워크를 수동 관찰하고, 필요한 경우 analyze_web_bundle로 선택한 스크립트를 분석한다. 임의 포트 스캔이나 기존 브라우저 설정 변경은 하지 않는다.
5. 실제 API 데이터·사진을 포함하는 HAR 전체를 저장하는 대신 필요한 정적 리소스 메타데이터만 선별한다.

본 조사에서는 이 후속 절차를 실행하지 않았다.

## 7. 증거 목록과 재현 범위

### REA 증거

- 초기 페이지 관찰 원본: `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`
- 초기 요약 뷰: `ev_b8d90912baf5cc8e0e6cf4993385e1d236990ea1b3d240bccfe46783eb4db12e`
- 공개 코드 11개 관찰 원본: `ev_bf9168a52ef048976158750eba958a21a49ff8411b2fc03b095161b79a4089ed`
- 초기 DOM SHA-256: `27b18d401a475906b7fd52d11c8e12af8b9321f06e7925b952a8659627a183a1`
- 초기 DOM의 script: privacy-notice.js, install.js, telemetry.js, sns-links.js, channel-picker.js, boot.js?v=20261101-ios. import map은 three를 /vendor/three.module.js로 연결한다.
- 예시 요청 연결: request-101 app.js, request-102 pet-model-textures.js, request-141 render-profile.mjs, request-144 pet-avatar.js, request-277 plaza-pets.js, request-353 공유 털 PNG. 요청 ID는 해당 REA 초기 기록 안에서만 유효하다.

초기 접근성 기록은 공간과 메뉴·일반 공지만 확인했으며 이용자 본문은 보고서에 옮기지 않았다. API 관련 401 한 건은 사이트가 초기화 중 자동 요청한 pet-chat에서 발생했다. 해당 응답 본문을 열지 않았고, 재호출이나 우회를 시도하지 않았다. 이는 3D 렌더링 실패 또는 REA 연결 실패의 증거가 아니다.

공개 코드의 행 번호는 관찰한 파일의 줄바꿈 기준이다. 배포가 갱신되면 URL·행 번호·내용이 달라질 수 있다. 아래 본문 해시는 REA Response.body() 결과의 SHA-256이며 네트워크 압축 전송 바이트의 해시는 아니다. 도구는 응답 본문 수집 API가 경우에 따라 후속 로드를 할 수 있다는 제한을 보고한다. 따라서 초기 실행 당시 바이트와 후속 문서 조회의 바이트가 완전히 동일했다는 단정은 하지 않는다.

### 확인한 공개 소스 URL

- **boot.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9eb79b05d000f37c9762986b/boot.js)
- **app.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js)
- **pet-model-textures.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js)
- **render-profile.mjs**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/cd18146b6d19e993d020232f/render-profile.mjs)
- **pet-avatar.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js)
- **plaza-pets.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd1c272f30e9fe7ecd60db02/plaza-pets.js)
- **pet-appearance.mjs**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ea5a9c58220e6694b1c6419/pet-appearance.mjs)
- **pet-coat.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/591bc2ccc48da07c7b4032d4/pet-coat.js)
- **pet-appearance-model.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/297cc4e6c2fac531772a8436/pet-appearance-model.js)
- **pet-avatar-mammals.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ca2a133b175313a812d5d835/pet-avatar-mammals.js)
- **partner-ground-avatar.js**: [관찰된 공개 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/831177a5724a6444c4038899/partner-ground-avatar.js)

### 본문 식별 정보

| 공개 코드 | 본문 바이트 | SHA-256 |
|---|---:|---|
| boot.js | 4254 | `c5c017a3f44ebae22e084f33aa4eeff20023b36ec666571cc00b93da8934e873` |
| app.js | 281835 | `f9ca66969fb53173e4a16de729712bc71d3047ba3b0bcc5637fb949eaf490f75` |
| pet-model-textures.js | 1497 | `fe4feb24448c5c6d09ac5f2a262b972da9b320c5ec39281aee1bcc8bd767bdb0` |
| render-profile.mjs | 529 | `08b77de994b406f9cc3bb223b66a2b030e946e996f67d19bdab1a17d2328f706` |
| pet-avatar.js | 19413 | `76af7660e65a2d0f7589bde78c7e50ec4a4a7b541dd9018d2f981975740a37b4` |
| plaza-pets.js | 10056 | `d136aa5b2486e760eec7f6c92cbffeb05de537caa11e76799d090b42171ca025` |
| pet-appearance.mjs | 3742 | `b1bc7907ee5b77493f5736f83969b8089e30ff5511a2229750a442e045043984` |
| pet-coat.js | 4289 | `b9fdaeb97bb1aed41b41c1130c0db427a69d2592747911e1e10001b1cc7b5d5f` |
| pet-appearance-model.js | 3938 | `c136b21c51b84ea74c3d8eeb406e287bb0561a66f6f85123e0ff772d69a1ddff` |
| pet-avatar-mammals.js | 8820 | `003ae5df4e6f452bf5ea77d5115397f0b019f45e87228045ac3dfb043d75767a` |
| partner-ground-avatar.js | 4161 | `be3dd9043f8ed47bf5734294a7ab997206b6c999e5555ea9d3ff253fcfcbc9ce` |

REA Evidence는 연결 내 메모리 기록이며 영구 링크가 아니다. 요청 파일 외의 추가 아티팩트를 남기지 않기 위해 원본 DOM·응답 본문·Evidence bundle은 디스크에 내보내지 않았다. 조사 종료 시 reset_investigation({})으로 메모리 기록을 정리하려 했으나 자동 승인 검토가 거부했다. 저장 없이 증거·이력을 삭제하는 비가역적 작업에 대한 명시적 승인이 없다는 이유이며, 초기화는 수행되지 않았다. REA 기록은 연결 메모리에 보존되어 있고, 이후 서버 재시작에 따른 조회 가능성은 보장되지 않는다. 이 보고서의 관찰 내용·URL·해시가 남는 근거다. 초기화는 보고서 작성 완료에 필요하지 않아 재시도하지 않았다.

