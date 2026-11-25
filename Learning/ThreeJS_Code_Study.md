# Three.js 코드 학습 · 입력과 장면을 연결하는 독립 예제

확인일 **2026-11-25 (한국시간)** · 8차

별꾹의 공개 코드를 바탕으로 개념을 설명하고, 실습에는 따로 만든 기하와 데이터를 사용한다. 최초 화면의 Three.js 캔버스는 기존 REA에서 관찰했다. 개별 공간의 모든 상호작용과 맞춤 모델 렌더는 코드 경로에 근거하며 실측하지 않았다. [렌더링](../Systems/Three_Rendering.md) · [공간](../Systems/World_Environment.md) · [캐릭터](../Systems/Pet_Character_Animation.md) · [입력·카메라](../Systems/Movement_Camera_Interaction.md) · [활동·효과](../Systems/Activities_Events.md)

## 1. 코드에서 한 프레임 따라가기

| 개념 | 계산과 결과 | 원본에서 읽을 지점 |
|---|---|---|
| 좌표계와 벡터 | 월드 X/Z를 바닥, Y를 위로 쓴다. ‘목표 − 현재’는 방향과 거리를 가진 벡터다. 정규화하면 길이 1인 방향만 남는다. | [app.js 2263·2313·2541~2543행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| Geometry·Material·Mesh | 점과 면이 Geometry, 빛과 표면을 계산하는 규칙이 Material이다. Mesh가 둘을 묶어 해당 위치·각도·스케일에 그린다. | [app.js 1221~1229행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [architecture.js 5~20행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/558a0e46d0078cb91d4146b0/architecture.js) |
| Group과 행렬 | 다리 Group에 붙은 발은 그룹 내부 위치를 유지하면서 그룹의 회전에 함께 따라간다. 로컬 행렬이 월드에 합성되며, 정적 배치에서는 부모 월드 행렬의 역행렬을 곱해 같은 외형을 부모 기준 인스턴스로 옮긴다. | [avatar.js 6~40행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/e4716f71b2eb05fa15928960/avatar.js) · [static-batch.js 18~45행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/29617a6f29e55d9c6b62567d/static-batch.js) |
| 삼각함수와 위상 | 사인파는 음수~양수를 주기적으로 오간다. 한 쌍에 π를 더하면 반대 발의 움직임을 만들 수 있다. 이동 거리를 더할수록 걸음 위상이 진행된다. | [pet-companions.js 244~247행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/5fe19a95f540ae4cd25ee8ec/pet-companions.js) · [app.js 2543행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| Raycasting과 화면 좌표 | DOM 좌표를 뷰포트 기준 NDC −1~1로 바꾼다. 카메라를 기준으로 쏜 광선이 Mesh나 평면과 만나는 점이 선택 후보가 된다. 클릭의 의미는 앱이 정의한다. | [app.js 2285~2313행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |
| 보간과 `dt` | 시간 차를 초로 바꾼 후 속도를 곱한다. `1 − exp(−k × dt)`는 프레임 간격이 달라져도 일정한 시간 스케일로 목표에 가까워지는 보간 계수다. | [app.js 2535~2549행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) · [camera-rig.js 115~125행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/4c30cab07bf2bd8a893903b3/camera-rig.js) |
| Skeleton과 Mixer | 키프레임 트랙의 현재 값을 뼈 계층에 반영한다. 여러 클립을 섞을 수 있으며, 임시 시선과 쓰다듬기 보정은 믹서 이후에 적용할 수 있다. | [custom-pet-avatar.js 142~201행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/057d202915dcdedf4e952f7e/custom-pet-avatar.js) |
| 리소스 수명 | 장면에서 객체를 빼도 GPU 버퍼의 해제는 따로 해야 한다. 공유 재질과 텍스처는 소유 범위를 정한 뒤 장면 전체를 폐기할 때 한 번씩 해제한다. | [app.js 1381~1393행](https://starkkuk-media.asdfstudio-cs.workers.dev/builds/2300b2b383d429b089959a6f/app.js) |

## 2. 독립 예제 A · 작은 광장, 관절, 선택, 이동과 카메라

**문법 검사 대상이며 브라우저 미실행.** 호스트 HTML의 `canvas#demo`가 화면에 배치되고, 로컬에 이미 준비된 Three.js를 ES 모듈 `three`로 해석할 수 있다고 가정한다. `button#swap`은 선택적 장면 전환 버튼이다. 코드에 별꾹 URL·데이터·에셋은 없다.

- 바닥·벽·기둥은 기본 Geometry다. 클릭 가능한 기둥은 태그를 갖고 클릭 시 색이 바뀐다.
- 바닥은 직접 교차점을 사용하며 -5~5로 좌표를 제한한다. 이 제한은 경로 탐색이나 벽 통과 방지까지 구현하지 않는다.
- 발 위상은 실제 이동량으로 증가한다. 카메라는 캐릭터 목표점과 거리에서 계산한 위치에 지수 보간한다.
- 장면을 바꿀 때 카메라·렌더러는 유지하고 이전 장면이 소유한 버퍼·재질만 돌려준다. 종료 시 이벤트, 프레임, 렌더러도 해제한다.

```javascript
import * as THREE from "three";

const canvas = document.querySelector("#demo");
const swapButton = document.querySelector("#swap");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
const ray = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const destination = new THREE.Vector3();
const intersection = new THREE.Vector3();
const step = new THREE.Vector3();
const eye = new THREE.Vector3();
const focus = new THREE.Vector3();

function createRoom(alternate) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(alternate ? 0xe4eef8 : 0xf2e9dc);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x72816e, 2));
  const sun = new THREE.DirectionalLight(0xfff2d5, 2);
  sun.position.set(4, 7, -2);
  scene.add(sun);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0xa3b9a1 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const column = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 1.6, 0.65),
    new THREE.MeshStandardMaterial({ color: 0xe08b55 })
  );
  column.position.set(alternate ? -2 : 2, 0.8, -2.5);
  column.userData.action = "highlight";
  scene.add(column);

  const actor = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.57, 1),
    new THREE.MeshStandardMaterial({ color: 0x5b79a2 })
  );
  body.position.y = 0.64;
  actor.add(body);

  const legGeometry = new THREE.BoxGeometry(0.15, 0.39, 0.15);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3b4e68 });
  const legs = [];
  for (const [x, z] of [[-0.24, 0.33], [0.24, 0.33], [-0.24, -0.33], [0.24, -0.33]]) {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.39, z);
    const foot = new THREE.Mesh(legGeometry, legMaterial);
    foot.position.y = -0.18;
    pivot.add(foot);
    actor.add(pivot);
    legs.push(pivot);
  }
  scene.add(actor);
  return { scene, actor, legs, column };
}

function disposeRoom(scene) {
  const geometries = new Set();
  const materials = new Set();
  scene.traverse(object => {
    if (!object.isMesh) return;
    geometries.add(object.geometry);
    for (const material of [].concat(object.material)) materials.add(material);
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  scene.clear();
}

let alternate = false;
let room = createRoom(alternate);
let phase = 0;
let previousTime = null;
let frameId = 0;

function resize() {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function select(event) {
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  pointer.set(
    2 * (event.clientX - bounds.left) / bounds.width - 1,
    1 - 2 * (event.clientY - bounds.top) / bounds.height
  );
  ray.setFromCamera(pointer, camera);
  const hit = ray.intersectObject(room.column, false)[0];
  if (hit?.object.userData.action === "highlight") {
    const color = hit.object.material.color;
    color.setHex(color.getHex() === 0xead06c ? 0xe08b55 : 0xead06c);
    return;
  }
  if (ray.ray.intersectPlane(ground, intersection)) {
    destination.set(
      THREE.MathUtils.clamp(intersection.x, -5, 5),
      0,
      THREE.MathUtils.clamp(intersection.z, -5, 5)
    );
  }
}

function swapRoom() {
  const previousRoom = room;
  alternate = !alternate;
  room = createRoom(alternate);
  destination.set(0, 0, 0);
  phase = 0;
  disposeRoom(previousRoom.scene);
}

function animate(now) {
  const dt = previousTime === null ? 0 : Math.min(0.05, (now - previousTime) / 1000);
  previousTime = now;
  step.subVectors(destination, room.actor.position);
  const distance = step.length();
  const moved = Math.min(distance, dt * 2.5);
  if (moved > 0.0001) {
    step.normalize();
    room.actor.position.addScaledVector(step, moved);
    room.actor.rotation.y = Math.atan2(step.x, step.z);
    phase += moved * 2 * Math.PI / 1.15;
  }

  room.legs.forEach((leg, index) => {
    const offset = index === 0 || index === 3 ? 0 : Math.PI;
    leg.rotation.x = moved > 0.0001
      ? Math.sin(phase + offset) * 0.38
      : leg.rotation.x * Math.exp(-dt * 12);
  });

  focus.copy(room.actor.position).add(new THREE.Vector3(0, 0.7, 0));
  eye.copy(focus).add(new THREE.Vector3(3.8, 3, 5.5));
  if (dt === 0) camera.position.copy(eye);
  else camera.position.lerp(eye, 1 - Math.exp(-dt * 4));
  camera.lookAt(focus);
  renderer.render(room.scene, camera);
  frameId = requestAnimationFrame(animate);
}

export function stopDemo() {
  cancelAnimationFrame(frameId);
  window.removeEventListener("resize", resize);
  canvas.removeEventListener("click", select);
  swapButton?.removeEventListener("click", swapRoom);
  disposeRoom(room.scene);
  renderer.dispose();
}

window.addEventListener("resize", resize);
canvas.addEventListener("click", select);
swapButton?.addEventListener("click", swapRoom);
resize();
frameId = requestAnimationFrame(animate);
```

## 3. 독립 예제 B · 사용자가 고른 로컬 GLB와 AnimationMixer

**문법 검사 대상이며 모델과 브라우저는 미실행.** `attachLocalActor(host, file)`에 실습자가 만든 독립 GLB를 File 객체로 넘긴다. 예제는 파일을 메모리에서 해석하고 외부 URL을 막는다. 호스트의 프레임에서 `update(dt)`를 호출하고 장면 교체나 예제 A의 정리 전에 반환된 `dispose()`를 호출한다. 모델 디코더가 추가로 필요한 압축 리소스는 여기에 설정하지 않았다.

```javascript
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export async function attachLocalActor(host, file) {
  if (!file || !/\.glb$/i.test(file.name)) {
    throw new TypeError("실습용 GLB 파일을 선택하세요.");
  }
  const manager = new THREE.LoadingManager();
  manager.setURLModifier(url => {
    if (/^(data:|blob:)/i.test(url)) return url;
    throw new Error("독립 GLB의 내장 리소스만 사용할 수 있어요.");
  });

  const loader = new GLTFLoader(manager);
  const gltf = await loader.parseAsync(await file.arrayBuffer(), "");
  const model = gltf.scene;
  const mixer = new THREE.AnimationMixer(model);
  const clip = gltf.animations.find(item => /idle/i.test(item.name))
    ?? gltf.animations[0];
  if (clip) mixer.clipAction(clip).play();
  host.add(model);

  let disposed = false;
  return {
    update(dt) {
      if (!disposed) mixer.update(Math.min(0.1, Math.max(0, dt)));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      host.remove(model);

      const unique = new Set();
      model.traverse(object => {
        if (object.geometry) unique.add(object.geometry);
        if (object.skeleton) unique.add(object.skeleton);
        for (const material of [].concat(object.material ?? [])) {
          unique.add(material);
          for (const value of Object.values(material)) {
            if (value?.isTexture) unique.add(value);
          }
        }
      });
      for (const resource of unique) resource.dispose();
    }
  };
}
```

## 4. 실습에서 가려낼 확인 범위와 9차 접점

| 확인하고 싶은 질문 | 이번 단계의 판정 및 검증 과제 |
|---|---|
| 실제 서비스에서 어느 정도 부드러운가 | 프레임·모션 코드만 확인했다. 독립 예제의 작은 씬에서도 저속 장치·탭 복귀·크기 변경·짧은 정지 후 이동이 급격해지는지 별도로 확인할 수 있다. |
| 메뉴를 열 때 모든 3D 입력이 정지하는가 | 경로별 가드와 취소 콜백이 확인됐다. 터치 캡처·키보드 입력·드래그 중 장면 변경의 실제 동작은 미관찰이다. |
| 맞춤 모델의 어느 부분이 제작·검수 단계에서 결정되는가 | 클라이언트에서 승인 상태, 파일과 클립 소비, 렌더 보정을 읽었다. 파일 원본 제작·자동화 여부, 승인 권한과 실제 검수 규칙은 미확인이다. |
| 결제·운영 상태가 3D에 연결되는 곳 | 다음 단계의 코드 연결점은 신청·수정 UI → 승인된 모델 참조 → 가시 프레임의 로딩, 후원 메뉴 → 별자리/표식의 상태 갱신, 제휴 진입 권한 → 월드 모드다. 실제 금액, 정산·환불·운영자 검수와 개인정보 처리 기준은 공개 UI 또는 별도 허용된 증거가 있어야 한다. |

기존 관찰과 새 정적 REA `ev_e0372954d3510cc68d6bd8d96e538e4f2684c06a11a1751141fd933a88456f69`, 렌더·정적 배치 `ev_c8009b841fd62bc727c2e04a0a6982c8d4b6df9b8603abf9387239e9232706e3`, 캐릭터 `ev_ce465912a6ecb1a7e58670a1578001c0da3fd801edd9b239046bad2f74ee9ea3`를 사용했다. 두 독립 예제의 검사 결과는 문법 검사와 브라우저/모델 미실행으로 구분한다. [모듈 범위와 후속 순서](../Architecture/3D_Module_Coverage.md)
