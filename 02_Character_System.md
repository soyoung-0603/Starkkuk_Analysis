# 별꾹 반려동물 3D 캐릭터 시스템

2026년 11월 23일 기준이다. [기존 기술 조사](./01_Tech_Stack.md)의 REA 관찰 기록을 재사용하고, 외형 편집·모델 신청·애니메이션 관련 공개 JavaScript 14개를 추가로 읽었다.

별꾹에는 **공통 기하와 외형 설정으로 조립하는 기본형**과 **승인 상태를 받은 GLB를 불러오는 맞춤형**이 있다. 기본형은 다리·꼬리 등 부위의 변환을 코드로 계산한다. 맞춤형은 GLB의 본 애니메이션을 재생하면서 상황에 따라 절차형 보정을 더한다. 공개 코드에 외부 사진 기반 3D 제작 서비스와 관리자 검토를 가리키는 단서가 있지만, 실제 모델의 자동 생성·수작업 범위는 확인할 수 없다.

| 판정 | 조사 결과 |
|---|---|
| **실행 관찰** | 기존 비로그인 첫 방문에서 Three.js r180 캔버스가 생성됐고 기본 아바타 모듈과 공유 털 PNG가 요청됐다. 추가 REA 관찰에서 공개 JavaScript 14개가 HTTP 200으로 응답했다. |
| **코드 확인** | 외형 옵션 적용, 기본형 편집기, 제작 신청과 수정, 승인 상태에 따른 GLB 로딩, 리그 검사, 클립 재생과 본 보정이 코드에 구현돼 있다. |
| **미관찰** | 실제 신청·검토·승인, 맞춤 GLB 다운로드와 화면 표시, 개별 동물의 애니메이션과 최종 모델 내부 구조. 초기 비로그인 기록의 GLB 요청은 0건이다. |

추가 확인은 기존 관찰에서 로딩된 정적 모듈 11개와, 공개 JavaScript가 직접 참조한 지연 로딩 모듈 3개에 한정했다. REA의 임시 브라우저에서 각 파일을 문서로 열어 본문을 확인했다. 제작 폼이나 계정 흐름을 실행하지 않았으며 API·사용자 모델·사진의 본문은 수집하지 않았다.

## 1. 기본 캐릭터의 외형과 조합

### 1.1 프로필 옵션과 공통 모델

일반 프로필에는 동물 종, 기본 색, 귀 형태, 무늬, 전체 크기가 있다. 공통 아바타 생성기는 종에 맞는 머리·몸·다리·귀·꼬리 등을 그룹 아래 배치한다. 기본 구형 기하를 재사용하면서 일부 메시의 정점과 부위별 크기·위치를 바꾼다. 강아지·고양이·햄스터·알파카 이외의 동물은 추가 생성기로 분기한다. 초기 기록에서 선택에 따라 개별 기본형 GLB가 요청된 증거는 없다. E1 902행, E2 8·39~43·117~180행, E5 45·56행, E6 2~18행.

| 요소 | 확인한 구현 |
|---|---|
| 동물 종·품종 | E6에 강아지, 고양이, 햄스터, 알파카, 기니피그, 물고기, 페릿, 토끼, 거북이, 앵무새, 고슴도치, 도마뱀, 닭 13종이 있다. 일반 프로필에서 독립적인 품종 필드는 확인되지 않았다. 광장 쪽 강아지·고양이 프리셋은 외형 유형을 고르는 별도 기능이다. |
| 체형 | 전체 크기와 몸 폭·길이를 별도로 적용한다. 일반 크기 렌더 범위는 0.7~1.3이다. 고양이는 관리자용 확장 범위와 이미 저장된 큰 값의 편집 예외가 있다. 세부 편집의 몸 폭·길이는 각각 0.8~1.2 배율로 정의된다. E3 3~15행, E4 41~45행, E7 1~8행. |
| 얼굴 | 얼굴 크기·폭·길이, 눈 크기·간격, 코·입 크기를 조절한다. 얼굴 부착 메시의 배치와 크기를 바꾸고, 몸·귀처럼 계층 변환이 필요한 부위는 그룹이나 메시의 스케일을 바꾼다. E2 69~71·108~115행, E3 3~15행, E4 41~45행. |
| 귀 | 일반 프로필의 귀 선택은 강아지에 표시된다. 기본 조합의 고양이는 뾰족한 귀, 강아지는 뾰족한 귀 또는 내려오는 귀로 분기한다. 세부 편집은 해당 부위가 있는 경우 귀 크기·길이 조절을 노출한다. E2 132~152행, E5 45행, E8 24~25행. |
| 꼬리 | 종별 기본 피벗·형태가 있고, 세부 편집에서 0.7~1.35 배율을 적용한다. 광장 프리셋은 위치, 굵기, 기울기, 풍성한 모양도 바꾼다. E2 145~169행, E3 15행, E4 45행, E11 25~26행. |
| 털색 | 프로필의 기본 색을 재질과 생성 텍스처에 사용한다. 얼굴, 몸, 가슴·목, 꼬리, 좌우 눈·귀, 발 등에 개별 색을 지정할 수 있다. 새 색을 적용할 때 재질을 복제하고, 일부 털 부위는 기존 무늬 맵을 해제한다. 눈은 원래의 하이라이트와 알파를 활용해 다시 채색한다. E2 42·85~105행, E3 17~25행, E4 11~38행. |
| 무늬 | 일반 프로필은 강아지·고양이·햄스터·알파카에 무늬 선택을 표시한다. 기본형 코드에는 단색, 얼룩, 양말, 삼색 분기가 있다. 얼룩은 표면 좌표로 색을 섞고, 양말은 발 텍스처에 밝은 그라데이션을 만들며, 삼색은 연속적인 3D 좌표에서 패치를 선택해 UV 이음새를 줄인다. 종별로 같은 부위에 동일한 결과가 난다고 볼 수는 없다. E2 85~105·117~127·173~176행, E5 45행, E6 18행. |
| 직접 색칠 | 편집기에는 색칠 탭이 있고, 저장용 데이터는 부위별 획으로 표현된다. 정상화 코드가 획과 점에 상한을 두며, 픽셀 데이터는 부위별 128×128 해상도로 그린다. 실시간 프로필에 사용하는 별도 표현은 색칠 리비전 참조를 전달한다. E8 22~30행, E9 1~40행. |

E3의 정상화는 알려진 조절 키와 범위를 검사하고 배율을 소수 둘째 자리로 반올림한다. 기본 배율 1은 생략하며, 허용된 부위의 6자리 HEX 색상을 보존한다. E8은 승인된 맞춤형을 표시 중일 때 세부 외형 입력을 비활성화한다. 기본형 사용 옵션을 선택하면 해당 조합으로 돌아갈 수 있다. E3 27~53행, E8 24~42·56~64행.

### 1.2 광장·제휴 공간의 별도 프리셋

광장 계열은 강아지 4종 외형과 고양이 4종 외형을 정의한다. 강아지는 포근한 형태·쫑긋 귀·짧은 다리·복슬한 형태, 고양이는 매끈한 형태·둥근 얼굴·장모·접힌 귀로 구분한다. 각 프리셋은 몸·머리 비례, 다리 길이, 귀와 꼬리의 형태를 함께 바꾼다. 8개 털색과 4개 무늬가 별도로 정의된다. 이 목록은 일반 추모 캐릭터 편집에 동일한 품종 옵션이 있다는 근거가 아니다. E10 1~41행, E11 6~40행.

가까운 모델은 공통 아바타에서 부위 변환과 목·볼 메시를 조정한다. 외형 키로 템플릿을 재사용하며, 먼 동물은 저해상도 부위를 인스턴싱한 실루엣으로 나타내는 경로가 있다. 기본 아바타의 6층 짧은 털 셰이더는 광장 근거리 변형 코드에서 숨긴다. E11 27~41행, E12 10~27·31~54행 및 기존 보고서 3.4절.

## 2. 맞춤 GLB의 신청, 승인 상태, 화면 표시

| 흐름 | 공개 코드에서 확인한 동작 |
|---|---|
| 신청 준비 | 계정 상태와 대상 반려동물에 맞춰 신청 UI를 구성한다. 대표 사진, 제작 요청사항, 동의와 필요한 입금 증빙을 받으며 추가 참고 사진을 처리하는 모듈이 있다. E13 54~67·107~123행, E16. |
| 제작 상태 안내 | 입금 대기·확인, 보완 필요, 제작, 움직임 보정·관리자 확인, 미리보기 관련 상태 및 적용 문구가 있다. 이는 클라이언트가 표현하는 상태 집합이다. 서버의 전이 순서와 담당자 승인 절차는 확인하지 못했다. E14 25·35~39행. |
| 수정 요청 | 공개 UI 코드는 권한 플래그가 있는 신청에서 메시지와 선택 사진으로 수정 요청을 제출하고 상태를 다시 읽는다. 신청 수정과 완성 모델의 공개 승인 여부는 서로 다른 단계다. E13 39~40·107~123행, E15 1~7·28~33행. |
| 런타임 승인 확인 | 앱은 반려동물 프로필의 `userModel`을 전달한다. 일반 화면에서는 설명자의 `approved` 상태가 필요하고, 명시적인 미리보기 경로에는 별도 조건이 있다. `appearance.useBaseModel`이 켜져 있으면 기본형을 선택한다. 이는 클라이언트 소비 조건이다. 서버가 누가 어떤 권한으로 승인할 수 있는지는 미확인이다. E1 704행, E2 184~198행, E17 13~17·203~212행. |
| 로딩과 검사 | 보이는 캐릭터의 갱신 시점에 로더를 동적으로 불러온다. 로더는 허용한 주소 형식을 검사하고 자체 포함 GLB v2만 받아들인다. 헤더·길이·외부 리소스 참조, 메시·스킨·재질과 텍스처 예산을 검사한다. 현재 코드는 Draco나 Meshopt가 필수 확장인 입력을 거부한다. 지원 조건에 맞으면 KTX2 대응 GPU용 변형을 우선 시도하고 원본 경로로 돌아간다. E2 184~200행, E17 9~33·59~83행, E18 4~16행. |
| 리그와 배치 | GLTFLoader 파싱 뒤 스켈레톤을 복제하고 크기·방향·바닥 기준을 정규화한다. 일반 표시에는 스킨과 유효 보행, 쓰다듬기 반응 조건을 충족해야 한다. 로더의 코드상 상한에는 64 MiB 입력, 삼각형 6만, 재질 24개, 본 160개가 있다. 이 값들은 클라이언트의 거부 기준이며 실제 모델의 측정치가 아니다. E17 9·64~83·142~162·203~214행. |
| 교체와 실패 복구 | 로딩에 성공하면 기본형 부위를 숨기고 맞춤 actor를 추가한다. 로딩 중이나 교체에 실패한 경우 기본형을 유지한다. 모델이 캐시에서 퇴출되면 기본형을 다시 표시하고, 일부 오류는 지연 후 재시도한다. 화면을 떠날 때 로딩 취소와 자원 해제 경로가 있다. E2 189~215행, E17 85~116·203~216행. |

문서의 신청 상태 `applied`와 렌더러의 모델 상태 `approved`는 각각 공개 코드에서 확인된다. 전자를 후자로 변환하는 서버 계약, 미리보기가 사용자에게 실제로 열리는 조건, 승인 유효 기간, 모델별 공개 범위는 관찰하지 못했다. GLB 주소 형식은 코드로만 읽었다.

## 3. 애니메이션 처리 비교

| 항목 | 기본형 | 맞춤형 |
|---|---|---|
| 구동 데이터 | 종별 보폭·주기·꼬리 흔들림 계수와 다리·머리·꼬리 피벗. | 스킨 메시, 본, GLB의 애니메이션 클립, 선택적인 별도 보행 GLB의 클립, 모델별 조정값. |
| 보행과 속도 | 이동 상태와 시간에 따라 사인파로 다리·꼬리 각도와 몸 높이를 계산한다. 원거리 동행 동물에 대한 포즈 갱신 빈도 제한도 있다. | `AnimationMixer`로 본 트랙을 구동한다. 설명자의 클립 이름 매핑을 우선하고 이름 패턴을 보조로 쓴다. 별도 보행 자산의 애니메이션 배열을 합칠 수 있지만, 이 동작만으로 임의 스켈레톤 간 리타기팅까지 입증되지는 않는다. |
| 상태 전환 | 이동·대기·휴식에 따라 부위 변환을 적용하고 필요시 돌봄·냄새 맡기 포즈를 덧입힌다. | 보행·속보·대기·쓰다듬기·휴식 후보를 찾는다. 클립을 약 0.2초에 걸쳐 전환하며, 호환 메타데이터와 속보 클립이 있을 때 속도에 따른 전환과 위상 연결을 사용한다. 루트 본 위치 트랙의 수평 이동은 고정해 장면 이동과 분리한다. |
| 반응과 보정 | 코드로 머리·꼬리 등 부위의 회전과 위치를 조절한다. | 전용 쓰다듬기 또는 휴식 클립이 없으면 찾은 머리·꼬리 본에 절차형 반응을 적용한다. 조건에 맞는 리그에는 숨쉬기·귀 움직임도 더할 수 있다. 본별 강도·회전·위치, 머리·몸·보폭·꼬리 강도, 템포와 높이 보정을 지원한다. |
| 표시 가능 판단 | 공통 생성기로 즉시 구성하는 기본형이다. | 코드상 보행은 스키닝과 움직이는 본 4개 이상, 쓰다듬기는 조건에 맞는 머리 본 또는 유효한 반응 클립이 필요하다. |

근거는 E2 8~10·172~181행, E12 47~54행, E19 241~250행, E17 118~199·203~214행, E20 1~22행, E21 52~65행이다. 현재 특정 맞춤 GLB의 클립 이름·길이·개수, 본 배치, 스킨 가중치, 모프 타깃과 실제 재생 품질에는 관찰 자료가 없다.

## 4. 수작업과 자동 생성에 대한 증거 평가

1. **서비스 안내에 명시된 내용.** 신청 문구에는 사진의 외부 제작 서비스 전송 동의, 사진에 잘 보이지 않는 부분을 위한 추가 요청사항, 제작과 움직임 보정·관리자 확인, 완성 후 수정 요청이 있다. 외부 서비스를 이용할 수 있고 사람이 확인하는 절차를 안내한다는 증거다. E14 8~17·25·29~37행, E15 1~7·28~33행.
2. **특정 외부 서비스 단서.** 공개 로더의 텍스처 처리 주석에 Tripo 원본이 언급되며 `providerOriginal` 값에 따라 원본 색상 맵을 보존하고 보조 맵을 줄이는 경로가 있다. Tripo는 자체 공식 문서에서 사진 기반 3D 자동 생성 기능을 제공한다고 설명한다. 따라서 자동 생성 결과를 받아 처리하는 경로와 양립하는 강한 단서다. 주석과 처리 분기만으로 별꾹의 실제 발주, API 사용 방식이나 개별 작업 이력을 확인할 수는 없다. E17 35~55·75·208행. [Tripo Image to 3D](https://www.tripo3d.ai/product-doc/model-generation/image-to-3d)
3. **판정.** 외부 생성 결과에 움직임 보정과 검토를 더하는 혼합 방식은 가능한 해석이다. 기본형의 절차 생성은 직접 확인했지만, 맞춤형 메시·텍스처·리깅·애니메이션 각각의 자동화 수준은 확인 불가다. 전면 수작업, 전자동, 특정 도구의 전면 사용을 뒷받침할 작업 이력이나 모델 출처 기록은 없다. 관리자 검토 문구만으로 직접 모델링을 했다고 판단할 수 없다.

## 5. 독립 구현에 필요한 기술

아래는 자체 캐릭터와 에셋을 전제로 한 기술 요구사항이다. 별꾹의 내부 설계를 나타내지 않는다.

| 구성 | 필요한 기술과 설계 |
|---|---|
| 기본 아바타 | 자체 제작한 종별 베이스 메시나 파라메트릭 기하, 미리 정한 파트·피벗 좌표, 형태 변형, PBR 재질, 파트별 색과 마스크, 무늬 합성. 버전이 있는 외형 설정을 저장하고 이전 값도 재현할 수 있게 한다. |
| 움직임 | 이동·대기·휴식·접촉 이벤트를 공통 상태로 정의한다. 기본형의 절차 포즈와 맞춤형의 스킨 클립이 동일한 상태 입력을 소비하게 한다. 맞춤 모델은 공통 본 이름·기준 자세·단위·전방축 또는 명시적 매핑이 필요하다. 속도와 발 접촉, 꼬리나 귀 같은 선택 부위를 실제 리그에 맞춰 조정한다. |
| 맞춤 제작 | 사진 동의와 보관 범위, 원본 사진의 제한된 접근, 제작 큐, 리토폴로지·UV·재질·리깅·스킨 가중치·동작 검사. 사진 기반 자동 생성은 선택 사항이며, 결과물을 같은 검수 기준에 맞춰 점검한다. |
| 모델 검수와 게시 | GLB 구조 및 자체 포함 정책, 스킨·클립·본 매핑 검증, 기하·재질·텍스처 예산, 미리보기, 승인 권한 검증, 승인된 버전 게시와 되돌리기. 서버가 권한과 상태를 검증하고 클라이언트는 승인된 설명자에 맞춰 표시한다. [Khronos glTF 2.0 규격](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) |
| 전달과 성능 | 가시 모델부터 지연 로딩, 선택 가능한 압축 텍스처와 호환 변형, 에셋 버전별 캐시, 근거리 상세 모델과 원거리 인스턴싱, 화면 해상도 조절, GPU 자원 해제, 실패 시 기본형. 모바일 실기기에서 첫 화면 시간, 프레임 시간, 최대 메모리, 재접속 복구를 측정한다. |
| 사용자 경험 | 사진 편집·검수 화면과 3D 표시를 별도 흐름으로 둔다. 사용자가 결과를 확인하고 기본형으로 돌아갈 수 있게 하며, 저사양·그래픽 초기화 실패에는 정적 이미지나 기본 정보 화면을 제공한다. |

## 6. 기술 비교

2026년 11월 23일에 확인한 공식 문서의 플랫폼과 기능을 바탕으로 이 프로젝트에 적용할 때의 장단점을 평가했다. 엔진 간 실제 속도·용량·배터리 차이는 측정하지 않았다.

### 6.1 렌더링 엔진과 플랫폼

| 기술 | 네이티브 모바일 앱 | 모바일 웹 | 선택 기준과 공식 근거 |
|---|---|---|---|
| **Unity** | iOS·Android 패키징과 씬·리그·애니메이션 편집, 네이티브 SDK 연결에 유리하다. 빌드와 스토어 배포, 메모리 최적화가 필요하다. | Unity 6.6 공식 문서는 일부 iOS Safari와 Android Chrome을 지원 대상으로 명시한다. 엔진 다운로드·초기화, 메모리, WebView 포함 여부를 실기기에서 평가해야 한다. | 앱과 웹의 씬 공유가 중요할 때 후보. 임의의 런타임 GLB를 받을 때 사용할 로더 및 확장 지원을 검증한다. [Unity 매뉴얼](https://docs.unity3d.com/Manual/index.html), [Unity Web 브라우저 호환성](https://docs.unity.com/en-us/engine/6000.6/manual/platform-specific/webgl/intro/browsercompatibility) |
| **Unreal Engine** | iOS·Android 개발과 패키징을 지원한다. 정교한 캐릭터·조명·애니메이션 도구가 강점이고, 모바일 렌더링 기능 차이와 열·용량에 맞춘 별도 조정이 필요하다. | 공식 Pixel Streaming은 서버에서 렌더하고 WebRTC로 브라우저에 전달한다. 사용자는 설치 없이 접근할 수 있고, 운영자는 GPU 서버 비용과 네트워크 지연을 부담한다. | 고품질 네이티브 장면이나 스트리밍이 제품 목표일 때 검토. [Epic 모바일 문서](https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-mobile-development-in-unreal-engine), [Pixel Streaming](https://dev.epicgames.com/documentation/en-us/unreal-engine/pixel-streaming-in-unreal-engine) |
| **Godot** | Android·iOS 내보내기와 자체 에디터를 이용할 수 있다. 네이티브 SDK나 플러그인 연동은 팀이 사전 검증한다. | Godot 4의 웹 내보내기는 WASM과 WebGL 2를 요구한다. 웹 렌더러와 C# 지원 제약, 스레드 사용 시 필요한 브라우저 격리 설정을 고려한다. | 오픈소스 엔진과 에디터, 앱·웹 자산 공유를 중시할 때 검토. [Godot Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html), [Godot iOS](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html), [Godot 웹 내보내기](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) |
| **Three.js** | 웹 장면을 WebView에 넣을 수 있다. 이 경우 3D는 WebView 내 브라우저 환경에서 실행되고 앱 패키징·OS 기능 연동은 별도 작업이다. | 기존 HTML UI에 가볍게 결합하기 좋다. GLTFLoader, AnimationMixer, KTX2를 선택해 구성할 수 있다. 편집기와 캐릭터·자원 관리 도구는 팀이 마련한다. | 한 마리와 작은 공간부터 시작하는 웹 중심 제품에 적합하다. [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [Three.js AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html) |
| **Babylon.js** | WebView 외에 Babylon Native를 검토할 수 있다. 브라우저 API 의존 코드와 모바일 통합 호환성은 별도 확인이 필요하다. | 씬 로더와 glTF 플러그인, 애니메이션과 디버깅 도구가 통합된 브라우저 엔진이다. 필요한 기능에 맞춰 번들 크기와 초기 로딩을 관리한다. | 기능이 많은 맞춤 모델 뷰어나 팀의 디버깅 도구가 중요한 경우 검토. [Babylon.js glTF 로더](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF), [Babylon Native](https://github.com/BabylonJS/BabylonNative) |
| **PlayCanvas** | 앱이 필요하면 웹 씬을 WebView로 패키징하는 구성을 검토한다. OS 브리지와 빌드·스토어 배포는 추가 작업이다. | 브라우저 기반 에디터, 에셋 가져오기와 JavaScript 엔진을 제공한다. WebGL 2와 지원 브라우저를 고려하고 WebGPU는 지원 기기에서 검증한다. | 기획·아트 인력이 웹 장면을 함께 편집하는 경우 강점이 있다. [PlayCanvas 엔진](https://developer.playcanvas.com/user-manual/engine/), [에셋 가져오기](https://developer.playcanvas.com/user-manual/editor/assets/import-pipeline/), [브라우저 지원](https://developer.playcanvas.com/user-manual/engine/supported-browsers/) |

**모바일 웹 배포**는 링크로 바로 접근하고 서버 배포 시 업데이트를 전달하기 쉽다. 일반 HTML 위에 신청이나 접근성 UI를 자연스럽게 제공할 수 있다. 비용은 첫 다운로드와 디코딩, Safari·Android·인앱 브라우저별 GPU·메모리 편차, 탭 중단과 컨텍스트 복구에 있다. 기본형을 먼저 표시하고, 로그인 여부와 무관하게 3D 초기화가 실패해도 주요 콘텐츠에 접근할 수 있어야 한다.

**네이티브 모바일 앱**은 기본 에셋 동봉, 오프라인 동작, 파일·사진 접근, 앱 수명주기와 OS SDK 연동을 제품 수준에서 제어하기 쉽다. 설치, 앱 크기, 스토어 심사와 업데이트, iOS·Android별 실기기 검증의 비용이 따른다. WebView 앱은 스토어 배포와 브리지의 이점을 얻을 수 있지만 3D 장면의 브라우저 제약을 함께 고려해야 한다.

### 6.2 에셋 제작 도구

| 도구 | 잘 맞는 단계 | 이 프로젝트에서 확인할 점 |
|---|---|---|
| **Blender** | 베이스 모델링, UV, 리깅·웨이트, 키프레임, glTF/GLB 내보내기까지 한 도구에서 연결. | 소규모 팀의 기본 후보. 셰이더·제약을 내보낼 때 필요한 베이크, 스킨·클립과 원점 유지 여부를 확인한다. [Blender glTF 2.0 매뉴얼](https://docs.blender.org/manual/sl/4.5/addons/import_export/scene_gltf2.html) |
| **Maya** | 정교한 사족 보행 리그, 스키닝과 애니메이션 제작, 클립과 곡선 수정. | 캐릭터 아티스트가 이미 Maya 파이프라인을 쓸 때 유리하다. 도구 비용과 GLB까지 사용할 내보내기·변환 경로를 검토한다. [Autodesk Maya](https://www.autodesk.com/products/maya/overview/) |
| **ZBrush** | 얼굴과 털 덩어리, 귀처럼 유기적인 형태의 고해상도 조형과 리메시. | 원형 조형에 쓰고, 모바일용 저폴리 메시·UV·스킨·클립은 다음 공정에서 검수한다. [Maxon ZBrush 리메시 문서](https://help.maxon.net/zbr/en-us/Content/html/user-guide/3d-modeling/modeling-basics/creating-meshes/remeshing/remeshing.html) |
| **Substance 3D Painter** | UV 기반 털색·부위 무늬·재질 맵 도색, 고해상도 디테일 베이크, PBR 텍스처 출력. | 승인 모델의 표면 디테일이 중요할 때 추가한다. 출력 채널과 해상도, 압축 뒤 품질을 실제 렌더러에서 맞춰 본다. [Adobe 베이크 문서](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/baking/how-to-bake-mesh-maps), [Adobe 내보내기 문서](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/export/export) |

링크로 바로 들어오는 모바일 웹을 우선한다면 **Three.js + Blender**가 기본형 조합과 소수 GLB를 검증할 때 합리적이다. 에셋·애니메이션 검사 도구가 중요하면 Babylon.js, 브라우저 에디터를 통한 협업이 중요하면 PlayCanvas를 함께 비교할 수 있다. 앱 설치와 오프라인 이용이 제품의 전제라면 **Unity + Blender**를 먼저 실기기에서 검증할 만하다. 같은 자체 제작 GLB와 동일한 동작을 사용해 iOS·Android의 초기 로딩과 상호작용 프레임 시간을 비교하면, 배포 형태와 엔진 선택을 나눠 판단할 수 있다.

## 7. 증거와 남은 검증 범위

- **초기 공개 화면** `ev_e8e4a74b0ad89f009cd896d4d38573ee8cb6e03418c2bdd911dda03a3f21cc28`.
- **공개 코드 A, 기존 소스 11개** `ev_bf9168a52ef048976158750eba958a21a49ff8411b2fc03b095161b79a4089ed`.
- **공개 코드 B, 추가 소스 10개** `ev_53a9f49586a9d154814c453379219f76767ec9f0e10b9e7778ee579d5a3e5ca7`.
- **공개 코드 C, 추가 소스 4개** `ev_d8e00b9775e0399e05ce5fce6eebd953f3bcdd5c9bbf12610117be442e7960e4`.

E1~E21은 아래 공개 소스와 연결된다. 행 번호는 확보한 본문의 줄바꿈 기준이다. 빌드가 바뀌면 코드와 행 번호가 달라질 수 있다. REA 기록은 연결 메모리에 있으며, 추가 원본 파일은 저장하지 않았다.

| 근거 | 공개 JavaScript | REA 관찰 |
|---|---|---|
| E1 | [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) | 공개 코드 A |
| E2 | [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) | 공개 코드 A |
| E3 | [pet-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6ea5a9c58220e6694b1c6419/pet-appearance.mjs) | 공개 코드 A |
| E4 | [pet-appearance-model.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/297cc4e6c2fac531772a8436/pet-appearance-model.js) | 공개 코드 A |
| E5 | [pet-profile-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3a3f10267566a34e124eacc2/pet-profile-ui.js) | 공개 코드 C |
| E6 | [pet-species.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4b911a7216d2563f36ae9def/pet-species.mjs) | 공개 코드 B |
| E7 | [pet-size.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f5c3ee414f4391e2292c5d79/pet-size.mjs) | 공개 코드 C |
| E8 | [pet-customizer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/855cc44fc89a36f2b21ae765/pet-customizer.js) | 공개 코드 C |
| E9 | [pet-crayon.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a3f06f3498bf60ac7616386c/pet-crayon.mjs) | 공개 코드 B |
| E10 | [partner-ground-appearance.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1a519a2f55149db9c436a41b/partner-ground-appearance.mjs) | 공개 코드 B |
| E11 | [partner-ground-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/831177a5724a6444c4038899/partner-ground-avatar.js) | 공개 코드 A |
| E12 | [plaza-pets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/bd1c272f30e9fe7ecd60db02/plaza-pets.js) | 공개 코드 A |
| E13 | [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) | 공개 코드 B |
| E14 | [pet-model-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a443b0eeaf6817eb5a6321b0/pet-model-copy.mjs) | 공개 코드 B |
| E15 | [pet-model-revision.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/342bae9be0d1200b21b46ec9/pet-model-revision.js) | 공개 코드 B |
| E16 | [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) | 공개 코드 B |
| E17 | [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) | 공개 코드 B |
| E18 | [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js) | 공개 코드 A |
| E19 | [pet-companions.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fe19a95f540ae4cd25ee8ec/pet-companions.js) | 공개 코드 B |
| E20 | [pet-motion-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d89711d294b5863e59ea2e5/pet-motion-settings.mjs) | 공개 코드 B |
| E21 | [pet-lifelike.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bd905dcf58b329203753766/pet-lifelike.js) | 공개 코드 C |

실제 맞춤 모델과 애니메이션을 검증하려면 소유하거나 사용 권한이 있는 테스트 모델을 정상 화면에서 표시한 기록이 필요하다. 제작 방식의 판정에는 운영자가 제공한 제작 이력, 공급 서비스 처리 기록 또는 단계별 작업 자료가 필요하다. 이번 조사에서 확보한 것은 사용자에게 전달되는 클라이언트의 동작 조건과 공개 안내다.

