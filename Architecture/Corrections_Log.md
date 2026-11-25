
# 별꾹 분석 정정 기록

2026-11-25 KST. 9차 원문은 보존하고, 해당 시점의 REA 증거와 10차 배포 관찰을 구분해 기록한다.

## 09-01. 본문 신규 확보의 분류

| 대조 항목 | 확인 결과 |
|---|---|
| 기존 요약 7행 | 총 25개 중 기존 요청/import 22개, 신규 모듈 3개. [9차 요약](09_Module_Coverage.md) |
| 정정 | **기존 요청 또는 import에서 본문으로 23개**, **9차 새 모듈 본문 2개**. 신규 본문 25개는 유효하다. |
| 검산 방법 | 9차 1절의 **모듈별 데이터 행**에 한해 두 상태를 셌다. 2절의 설명에서 다시 등장하는 모듈과, 본문 없이 import로만 확인한 `constellation-campfire-layout.mjs`는 신규 본문에 중복 집계하지 않았다. 8차 import 확인에 있던 `pet-lifelike-policy.mjs`와 `partner-ground-ui.js`도 기존 추적 범위에 포함된다. [8차 범위표](3D_Module_Coverage.md), [9차 상태표](09_Module_Coverage.md). |
| 실제 신규 본문 2개 | `milk-formation-assets.js` 및 `constellation-campfire.js`. 소스 존재는 9차 REA 본문에서 확인했다. [milk-formation-assets.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/325c4b9fd48d143a2dde6fd0/milk-formation-assets.js) 1~60행, [constellation-campfire.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/0be03f18397a5f42c91d254a/constellation-campfire.js) 1~82행. |

REA 본문 근거는 제작 검수 묶음 `ev_67356fc1e8d868a6733aa917e8a4870a12471c482f1be793f13a47a3c411d216`와 후원·별자리 묶음 `ev_92489eb01f6b8d6c872c45b0669d46b6a26b18e49090f53bb54790756c5db6c7`이다. 25개를 포함한 9차 전체 분석 행은 기존 본문 재확인 8개와 이전 본문 재사용 13개를 합쳐 46개다.

## 09-02. 맞춤 모델 로더의 import URL

| 조사 시점의 호출 코드 | 실제 import URL 및 결론 |
|---|---|
| 9차 기본 캐릭터 코드 `loadPetModel` 185행 | [9차 로더 057d202915dcdedf4e952f7e](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js). [9차 pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/3445e8a7e6c22ced351a4a69/pet-avatar.js), REA `ev_ce465912a6ecb1a7e58670a1578001c0da3fd801edd9b239046bad2f74ee9ea3`. |
| 9차 편대 코드 `createMilkSkinFormation` 23행 | [9차 로더 057d202915dcdedf4e952f7e](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js). [milk-skin-formation.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/1b2fea7fa9d3f38f80df6532/milk-skin-formation.js), REA `ev_67356fc1e8d868a6733aa917e8a4870a12471c482f1be793f13a47a3c411d216`. |
| 10차 공개 실행에서 제공된 아바타 모듈의 `loadPetModel` 185행 | [10차 로더 b8b364569998c23aa4780b9b](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/b8b364569998c23aa4780b9b/custom-pet-avatar.js). [pet-avatar.js](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/a61b9ce5a1a1f3754dc842e6/pet-avatar.js). REA `ev_6d651a3a46f91fcb8ab93cfa1ed8406f4d3984dc807df62d3862e05ca80ae684`의 호출 코드와 `ev_56d08ece8a3696bf41bee897e8d122207accec37a04940f1ca615260f8276308`의 로더 본문. |

9차 표의 “별도 빌드” 해석은 오류였다. 9차의 두 참조는 **동일 URL**이다. 10차의 다른 URL은 이후 배포에서 발견한 사실이다. 10차 비로그인 실행에서는 맞춤 GLB나 로더 동적 실행을 재현하지 않았고 현행 편대 모듈이 어느 모델 로더를 호출하는지도 이 정정에 포함하지 않는다.
