import * as THREE from 'three';
// 如果需要变更视角，也就是变更相机位置，那么需要控制器，ThreeJS中具有许多控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function getWidthHeight(el: HTMLElement) {
  const { width: w, height: h } = getComputedStyle(el);
  const width = parseFloat(w);
  const height = parseFloat(h);
  return { width, height, aspect: width / height };
}

/**
 * ThreeJS中有许多概念，这些概念都来自计算机图像和建模
 * 无论是哪一种都离不开三种：场景、相机、渲染
 *
 * 1. 创建场景
 * 2. 创建相机
 * 3. 创建/引入物体
 * 4. 场景添加相机、物体 （可分别添加）
 * 5. 渲染器渲染场景、相机、物体
 */
export default function useThree(el: HTMLElement = document.body) {
  const { width, height, aspect } = getWidthHeight(el);

  // 场景
  const scene = new THREE.Scene();
  // 相机
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
  camera.position.set(0, 0, 10);
  // 添加相机
  scene.add(camera);
  // 创建渲染器 antialias 抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  // 挂载到真实DOM上
  el.appendChild(renderer.domElement);

  // 通过渲染器渲染场景、物体、相机
  renderer.render(scene, camera);

  const resize = () => {
    /**
     * 窗口自动适应，考虑四个因素
     * 1. 更新相机比例
     * 2. 更新投影矩阵
     * 3. 更新渲染窗口
     * 4. 更新像素比例
     */
    const { width: w, height: h, aspect: a } = getWidthHeight(el);
    camera.aspect = a; // 更新摄像头比例
    camera.updateProjectionMatrix(); // 更新投影矩阵
    renderer.setPixelRatio(window.devicePixelRatio); // 更新像素比例
    renderer.setSize(w, h); // 更新渲染的窗口大小
  };

  window.addEventListener('resize', resize);
  el.addEventListener('dblclick', () => {
    /**
     * 双击屏幕进入全屏，再次双击退出元素
     * fullscreen记录是否全屏
     * fullscreenElement记录全屏的元素
     * requestFullScreen请求全屏
     */
    if (document.fullscreenElement) {
      document.exitFullscreen(); // 文档对象退出全屏
    } else {
      renderer.domElement.requestFullscreen();
    }
  });

  // 创建轨道控制器，需要相机和渲染的元素，相机是为了获取视角，dom是为了渲染视角
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  // 设置阻尼效果
  orbitControls.enableDamping = true;
  // 设置缩放范围
  orbitControls.maxDistance = 600;
  orbitControls.minDistance = 20;
  orbitControls.zoomSpeed = 2;
  // 设置键盘
  orbitControls.keys = { LEFT: '37', UP: '38', RIGHT: '39', BOTTOM: '40' };

  const render = () => {
    renderer.render(scene, camera);
    orbitControls.update();
    requestAnimationFrame(render);
  };

  const renderThree = (url: string) => {
    const texture = new THREE.TextureLoader().load(url);
    /**
     * 环境贴图（背景）
     * envMap，一般来说纹理有六张，或者一张全景图，一张全景图使用TextureLoader加载，并且需要指定mapping方法
     * https://threejs.org/docs/index.html?q=texture#api/zh/constants/Textures
     */
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    const light = new THREE.AmbientLight();
    scene.add(light);

    /**
     * 全景图
     */
    const sphereGeometry = new THREE.SphereGeometry(10, 100, 100);
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    /**
     * 球面点反转，向内
     */
    sphereGeometry.scale(16, 16, -16);
    scene.add(sphere);

    /**
     * 初始将相机移动到目标对象
     * 将目标对象设置为原点
     */
    camera.position.set(0, 0, 600);
    orbitControls.target.set(0, 0, 0);
  };
  render();

  return { renderThree, render };
}
