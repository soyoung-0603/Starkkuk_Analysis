
# 9차 모듈 분석 범위

확인일 2026-11-25 KST. [기존 272개 공개 스크립트 목록](Module_Inventory.md)과 [8차 3D 범위표](3D_Module_Coverage.md), 2·3·5·6차 기능별 근거를 대조했다. 이 문서는 **9차에서 확인한 변화**를 기록한다. 범위표의 행 수는 이번에 읽은 모듈과 재사용 근거의 수이며, 새로 발견한 전체 서비스 모듈 수나 네트워크 요청 수를 의미하지 않는다.

- 요청한 모듈 **43개**, 직접 연결되는 보조 모듈 **3개**, 합계 **46개**의 해당 코드 경로를 본문 근거로 추적했다.
- 이번에 본문을 신규로 확보·확인한 것은 **25개**다. 그중 **22개**는 기존 요청 또는 import에 있었고, **3개**는 기존 목록의 동일 파일 식별자가 없는 이번 분석의 추가 모듈이다.
- 기존 본문 **8개**를 다시 확보해 필요한 부분을 확인했다. 나머지 **13개**는 이전 단계의 REA 본문으로 연결을 확인했다. 예를 들어 사진 입력과 인코딩은 8차 범위표에서 요청만 확인했다고 표시되지만 6차 본문 근거가 있다. 제작 안내와 결제 모듈에도 같은 방식으로 먼저 이전 보고서를 대조했다. [사진 처리 6차](../Systems/Photo_Media_Pipeline.md), [캐릭터 2차](../02_Character_System.md), [이용 흐름 3차](../03_Service_Flow_Pricing.md)
- **정적 코드 확인**은 표에 적은 함수·이벤트 범위를 뜻한다. 로그인 세션, 실제 가격, 제작 신청, 검수 승인, 결제·정산, 차감, 대화 전송 등의 **실행 관찰**은 이루어지지 않았다. 목록의 각 URL은 분석한 배포 빌드다.

## 1. 모듈별 증거와 범위

| 공개 모듈 | 9차 상태 | 본문의 해당 위치 또는 범위 |
|---|---|---|
| [pet-model-request.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/724d6a8dea87aaad1417f9f4/pet-model-request.js) | 기존 본문 재확인 | 13~125행 폼·초안·상태 및 쓰기 |
| [pet-model-reference-photos.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/88c24b0a1f03efec708410d2/pet-model-reference-photos.js) | 기존 본문 재확인 | 1~32행 참고 사진 선택·전처리 |
| [pet-model-revision.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/342bae9be0d1200b21b46ec9/pet-model-revision.js) | 기존 본문 재확인 | 1~34행 수정 요청·버전·후속 적용 |
| [pet-model-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a443b0eeaf6817eb5a6321b0/pet-model-copy.mjs) | 기존 본문 재확인 | 2~41행 기본값과 요청·결제 상태 문구 |
| [pet-management-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2e155a3e2c904bd70ef0d019/pet-management-ui.js) | 기존 요청/import에서 본문으로 | 5~18행 등록 양식 데이터, 19~33행 삭제 UI의 역할 경계 |
| [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js) | 기존 본문 재사용 | 188~215행 모델 선택·장착·대체 |
| [custom-pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) | 기존 본문 재사용 | 13~26·142~216행 모델 참조·GLB·리그·캐시 |
| [pet-model-textures.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/f0681877323a5639b914e43b/pet-model-textures.js) | 기존 본문 재사용 | 3~16행 KTX2 동적 로딩과 지원 판정 |
| [pet-motion-settings.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4d89711d294b5863e59ea2e5/pet-motion-settings.mjs) | 기존 본문 재사용 | 2~23행 동작 설정 필드·본 매핑 |
| [pet-lifelike.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/6bd905dcf58b329203753766/pet-lifelike.js) | 기존 본문 재사용 | 8행 이후 액터와 표현 연결의 기존 근거 |
| [pet-lifelike-policy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c4fb190811e25a83fdcba98/pet-lifelike-policy.mjs) | 기존 요청/import에서 본문으로 | 1~103행 외형·동작 보정 정책 |
| [milk-skin-formation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2fea7fa9d3f38f80df6532/milk-skin-formation.js) | 기존 요청/import에서 본문으로 | 4~70행 적용 모델 필터, 모델 행렬·로딩 |
| [milk-skin-review.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/615fda2a30b8591a337453b7/milk-skin-review.js) | 기존 요청/import에서 본문으로 | 5~124행 공개 검토 화면, 후보와 적용 상태 |
| [milk-skin-status.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/027266a918d6943f45ecc744/milk-skin-status.mjs) | 기존 요청/import에서 본문으로 | 1~48행 검수 필터와 비교 상태 |
| [milk-formation-assets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/325c4b9fd48d143a2dde6fd0/milk-formation-assets.js) | 9차 새 모듈 본문 | 1~60행 연출의 정적 자원 참조 |
| [app.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) | 기존 본문 재사용 | 759~762·2109~2115행 제휴 역할과 배정, 2699~2713행 카페와 대화, 2781~2865행 제휴·후원 공간·신청·가방 |
| [support.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4f012c7cc92c341c3cd61ee0/support.js) | 기존 본문 재확인 | 38~247행 후원 입력·정정·이력과 상태 |
| [support-receipt-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b07e38f2cfb63bedfcfa8125/support-receipt-input.mjs) | 기존 요청/import에서 본문으로 | 1~23행 증빙 사진 전처리 및 이벤트 |
| [play-support.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ebf0c4b3891317cc9c1d0435/play-support.mjs) | 기존 본문 재확인 | 1~88행 Play UI·결제 진행·복구 |
| [play-support-client.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/79ac4112e839d43578e9c947/play-support-client.mjs) | 기존 요청/import에서 본문으로 | 4~119행 환경 감지·상품 목록·토큰 확인 |
| [constellation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0aa8fa22ac8269889ed9406d/constellation.js) | 기존 본문 재사용 | 13·42·123~153행 후원자 표시 및 공간 갱신 |
| [constellation-layout.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/074c027c0173faf7d6e8ca1c/constellation-layout.mjs) | 기존 요청/import에서 본문으로 | 1~68행 별자리 배치 데이터 |
| [constellation-campfire.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0be03f18397a5f42c91d254a/constellation-campfire.js) | 9차 새 모듈 본문 | 2~82행 공간 모닥불 로컬 연출 |
| [kkuki-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/17a6258121f0ca55c259feb1/kkuki-catalog.mjs) | 기존 요청/import에서 본문으로 | 1~14행 재화·상품과 가격 |
| [kkuki-reward.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/08d1eaa1aeba288ac43c1d1a/kkuki-reward.js) | 기존 요청/import에서 본문으로 | 1~28행 보상 요청·실패와 표시 |
| [kkuki-shop.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae4b8e53f1fa7c7aaf794cb8/kkuki-shop.js) | 기존 요청/import에서 본문으로 | 4~57행 상점 조회·구매·사용과 보관함 |
| [attendance.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/382ca375e51f93b43db2c0b0/attendance.js) | 기존 요청/import에서 본문으로 | 9~87행 출석·보상·팝업 환경설정 |
| [attendance-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/ae95360b169a03e150d40f3c/attendance-copy.mjs) | 기존 요청/import에서 본문으로 | 1~5행 출석 팝업 문구 |
| [daily-activities-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fd7e68acd397b8a4028c0b6b/daily-activities-copy.mjs) | 기존 요청/import에서 본문으로 | 1~7행 일일 활동 문구 |
| [gift-inventory.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3e343dcd26613f728b8fbd42/gift-inventory.js) | 기존 본문 재사용 | 36~108행 선물 가방과 배치 콜백 |
| [gift-trash.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a2082f899c3d2a59a6b800f1/gift-trash.js) | 기존 요청/import에서 본문으로 | 6~34행 3D 조작의 삭제 대상 UI |
| [locker-decor-catalog.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5e90e636f79ad29e2f5b2a9f/locker-decor-catalog.mjs) | 기존 요청/import에서 본문으로 | 2~43행 장식 품목과 슬롯 |
| [cafe-orders.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/fe07f6b01966ca78f4f037e8/cafe-orders.mjs) | 기존 요청/import에서 본문으로 | 1~63행 로컬 주문, 소비와 복구 |
| [petnight-customer.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a4eeafe30447621e26141b4b/petnight-customer.js) | 기존 본문 재사용 | 6~26행 역할 조건·인증 폼과 입장 콜백 |
| [petnight-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/59033aa044351908c46e2766/petnight-world.js) | 기존 본문 재사용 | 5·117~134행 전용관 오브젝트와 클릭 |
| [partner-center.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/244ed923b69de2adc7a274fb/partner-center.js) | 기존 본문 재사용 | 31~121·230~285행 공간 전환·역할·갱신·종료 |
| [partner-center-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2455010a6c580427a591d83e/partner-center-world.js) | 기존 본문 재사용 | 245~258행 데이터 → 3D 표식 |
| [partner-ground-world.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/c58ab9b7c390ab16d5c8d38e/partner-ground-world.js) | 기존 본문 재사용 | 11·23·67·98~100행 공간과 상세 범위 관리 |
| [partner-ground-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/97b9de3e564b144c7c2f5de6/partner-ground-ui.js) | 기존 요청/import에서 본문으로 | 5·19~63행 아이 목록·상세 및 운영 UI |
| [dev-studio/facade.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3122115618306157fdc71edc/dev-studio/facade.js) | 기존 요청/import에서 본문으로 | 3~9행 시설 외관 |
| [dev-studio/models.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/d963dfedf25bc50862250049/dev-studio/models.js) | 기존 요청/import에서 본문으로 | 35~45행 모델 라이브러리와 리소스 해제 |
| [pet-chat.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0a5b2cc8aba470fa17f661ef/pet-chat.js) | 기존 요청/import에서 본문으로 | 6~61행 대화 자격·자유 입력·읽음·폴링 |
| [pet-chat-copy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/51a5a5771859749cc4b2bc1f/pet-chat-copy.mjs) | 기존 요청/import에서 본문으로 | 1~7행 대화·AI·기본형 안내 |
| [photo-input.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/904f7c0ddf5b269cc8d5a851/photo-input.mjs) | 기존 본문 재확인 | 3~21행 파일 검증·디코드 |
| [photo-encoding.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a999c7e35755d788f901ef07/photo-encoding.mjs) | 기존 본문 재확인 | 3~14행 이미지 길이 제한과 포맷 |
| [pet-reaction.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0046ffd5fd8dbe7d7bccceec/pet-reaction.mjs) | 기존 요청/import에서 본문으로 | 2~21행 별도 UI 연출과 상호작용 반응 |

## 2. 추가로 발견한 참조와 상세 분석 보류

| 발견 또는 재대조 | 현재 증거 | 남은 일 |
|---|---|---|
| `milk-formation-assets.js` | **9차 새 모듈 본문.** 연출을 위해 쓰는 정적 자원 참조. 모듈은 읽었고 모델이나 이미지 본체는 받지 않았다. [milk-formation-assets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/325c4b9fd48d143a2dde6fd0/milk-formation-assets.js) 1행 이후. | 자원별 로드 실패나 모바일 화면 성능은 미확인이다. |
| `constellation-campfire.js` | **9차 새 모듈 본문.** 별자리의 모닥불 객체를 구성한다. [constellation-campfire.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0be03f18397a5f42c91d254a/constellation-campfire.js) 2~82행. | 모닥불 레이아웃 의존성은 아래와 같이 import에서 확인했다. |
| `constellation-campfire-layout.mjs` | **추가 모듈, import 확인.** 모닥불 빌더가 배치 상수를 읽는다. 파일 본문은 이번에 확보하지 않았다. [constellation-campfire.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0be03f18397a5f42c91d254a/constellation-campfire.js) 2행. [레이아웃 참조 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2497cc1cde502660b6565a49/constellation-campfire-layout.mjs) | 배치 위치·모바일 효과의 세부 연결은 다음 성능 조사에서 필요할 때 확인한다. |
| `pet-lifelike-policy.mjs` 및 `partner-ground-ui.js` | **기존 8차 import → 본문 확인.** 앱 정책과 제휴 지상 UI를 분석했다. [pet-lifelike-policy.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/9c4fb190811e25a83fdcba98/pet-lifelike-policy.mjs), [partner-ground-ui.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/97b9de3e564b144c7c2f5de6/partner-ground-ui.js) | 실모델 및 비공개 운영 흐름은 정적 UI 본문으로 확인할 수 없다. |
| 다른 빌드의 `custom-pet-avatar.js` | **동적 import URL 확인.** `milk-skin-formation.js`가 별도 빌드 URL의 모델 로더를 사용한다. 메인 앱에서 분석한 로더와 URL이 다르므로 독립 버전으로 기록한다. [milk-skin-formation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2fea7fa9d3f38f80df6532/milk-skin-formation.js) 23행. [별도 로더 URL](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) | 별도 배포본의 세부 동작과 차이는 미확인이다. |
| `pet-reaction.mjs` | **기존 요청 목록 → 본문 확인.** 별도 캐릭터 상호작용 반응을 식별했다. 대화 스크립트가 이 반응 함수로 보내는 직접 경로는 발견하지 않았다. [pet-reaction.mjs](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0046ffd5fd8dbe7d7bccceec/pet-reaction.mjs) 2~21행. | 말풍선·동작 연결은 공개 화면에서 관찰할 수 있을 때 재확인한다. |
| 앱 마켓 상품 현지 가격 및 정산 | **접근 제한/미확인.** 한국 App Store 상세를 검색 도구에서 직접 열지 못했고, 공개 페이지에서 현행 결제 금액을 관찰하지 않았다. [결제·후원 보고서](../Systems/Payment_Sponsorship.md), [한국 App Store](https://apps.apple.com/kr/app/%EB%B3%84%EA%BE%B9/id6832807561) | iOS 결제 브리지, 지역별 실제 상품 목록, 거래 정산 자료는 검증 근거가 별도로 필요하다. |
| AI 대화·제작 제공자 및 서버 운영 | **상충하는 공개 안내·미확인.** 대화 코드에 AI 분기와 공급자명 안내가 있다. 공개 정책의 외부 전송 안내는 그 문구와 다르다. 제작 코드에 모델 공급자 원본 처리와 Tripo 단서가 있다. [대화 보고서](../Systems/Pet_Conversation.md), [제작 보고서](../Systems/Custom_Model_Pipeline.md), [정책](https://starkkuk.com/privacy.html) | 현재 활성 여부, 운영 지침, 실제 공급자에 전달되는 데이터, 제작자 업무 분담은 공개 JavaScript로 판정할 수 없다. |

## 3. REA 증거 식별자

| 2026-11-25 확보한 정적 REA 묶음 | 증거 식별자 |
|---|---|
| 신청, 참고 사진, 수정, 관리와 이미지 | `ev_bf03d7aaa51a8ffb7ecefa534ded7854acdd5c2679ec687e7ac1cdf8598a8bb7` |
| 실감형 정책과 제작 검수·대형 연출 | `ev_67356fc1e8d868a6733aa917e8a4870a12471c482f1be793f13a47a3c411d216` |
| 후원·Play·별자리 | `ev_92489eb01f6b8d6c872c45b0669d46b6a26b18e49090f53bb54790756c5db6c7` |
| 꾹키·출석·일일 활동 | `ev_3f3dd41a22e66160691dab0cf0c5b8b48d2a46b27abd98476111339ee5dbfc93` |
| 장식·카페·포캣멍·스튜디오 | `ev_45c09f7b8031cde42c5dcbb64709805205796270f8c421717f8fb50b113e5643` |
| 대화·안내·별도 반응 | `ev_821196bf7ae53368c64af12b54f8fea83b8abeceebe3b2a9f0b216b224d874ab` |

기존 본문이 출처인 경우 [8차 범위표 증거](3D_Module_Coverage.md), [별꾹 00 아키텍처](../00_Service_Architecture.md), [2차 캐릭터](../02_Character_System.md), [3차 이용과 가격](../03_Service_Flow_Pricing.md) 및 각 기능 보고서의 코드 URL과 행 번호를 따라간다. 외부 자료의 검색·열람 결과와 정적 REA 증거는 각 기능 보고서에 구분했다.

## 4. 10차 모바일·성능·전체 통합 검토

| 순서 | 분석 대상 | 검증할 항목 |
|---|---|---|
| 1 | 앱 초기 진입, 기기별 화면, 웹·설치형 배포 · `app.js`, `render-profile.mjs`, 공개 manifest/서비스 워커가 발견되는 경우 해당 파일 | 모바일 키보드·회전·대화상자 포커스, 웹과 Play 배포 감지, 설치 안내, 가시성 복귀, 업데이트 및 오프라인 안내를 읽기 전용으로 관찰. iOS·Android·일반 웹에서 같은 경로로 보이는 UI를 구분한다. |
| 2 | 가벼운 실기기 렌더와 비동기 복구 · `custom-pet-avatar.js`의 두 빌드, `pet-model-textures.js`, `milk-skin-formation.js`, `constellation.js`, `constellation-campfire-layout.mjs` | 공개 장면 한정 초기 로드, 첫 프레임, 모바일 품질 단계, 늦게 도착한 모델 ref의 폐기, 텍스처 실패, 화면 전환과 자원 해제. 측정 조건과 코드상의 최적화를 함께 기록한다. 개인정보나 모델을 수집할 필요가 없는 한도에서 검증한다. |
| 3 | 입력·미디어·탭 복귀 · `photo-input.mjs`, `photo-encoding.mjs`, `support-receipt-input.mjs`, `play-support-client.mjs`, `pet-chat.js` | 합성 이미지와 모의 응답으로 모바일 파일 선택·재선택·형식·긴 이름·키보드와 화면 복구를 분리해 확인한다. 공개 가격, 앱 마켓 상품가, 로그인 이후 서버 값은 동일한 근거로 혼용하지 않는다. 대화 정책의 공개 안내 차이도 다시 대조한다. |
| 4 | 통합 상태 추적 · `channel-client.mjs`, `state.mjs`, `locker-feed.js`, `presence-transport.mjs`, `kkuki-shop.js`, `partner-center.js` | 계정/방/아이 전환 중 이전 응답, 취소와 재시도, 재화와 인벤토리의 다른 저장 위치, 읽음·3D 표시의 순서. 유료·관리·대화 상태는 승인된 테스트 환경 또는 모의 응답으로 확인할 과제다. |
| 5 | 남은 코드 범위 대조 · [초기 요청 목록](Module_Inventory.md), [8차 범위표](3D_Module_Coverage.md), 이 문서 | 실제 발견된 manifest/워커, 모바일 CSS와 환경 감지, 새 버전으로만 보이는 import, `petnight-staff.js`의 관련 함수, 미확인 별자리 배치를 증거 우선순위로 재검토한다. 초기 요청과 후속 동적 로딩을 각각 기록한다. |
