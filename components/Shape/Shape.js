import { useEffect, useReducer, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  SphereGeometry,
  Mesh,
  Vector3,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  HemisphereLight,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PointLight,
  Color,
  CubeTextureLoader,
  UniformsUtils,
  ShaderMaterial
} from "three";
import { fresnel } from './fresnel';
import { sceneReducer } from '../../state/Shape/sceneReducer';
import { mouseReducer } from '../../state/Shape/mouseReducer';

const initialSceneState = {
  screenWidth: 0,
  screenHeight: 0,
  camera: false,
  mesh: false,
  light: false,
  ambLight: false,
  scene: null,
  renderer: null,
};

const initialMouseState = {
  sx: 0,
  sy: 0,
};

const initMesh = (scene, sceneDispatcher) => {
  // const loader = new CubeTextureLoader();
  // loader.setPath('/new3/');

  // const textureCube = loader.load([
  //   'danEtna.jpg', 'danEtna.jpg',
  //   'danEtna.jpg', 'danEtna.jpg',
  //   'danEtna.jpg', 'danEtna.jpg'
  // ]);
  const { uniforms: fresnelUniform, fragmentShader, vertexShader } = fresnel;

  const uniforms = UniformsUtils.clone(fresnelUniform);
  const fresnelParams = { fragmentShader, vertexShader, uniforms };
  const fresnelMaterial = new ShaderMaterial(fresnelParams);

  const geom = new SphereGeometry( 1, 256, 256 );
  const mesh = new Mesh(geom, fresnelMaterial);
  sceneDispatcher({type: 'set_mesh', payload: { mesh }});
  scene.add(mesh);
}

const initAmbLight = (scene, sceneDispatcher) => {
  const ambLight = new HemisphereLight(0xffffff, 1.0);
  sceneDispatcher({ type: 'set_amb_light', payload: { ambLight } });

  scene.add(ambLight);
};

const initLight = (scene, sceneDispatcher) => {
  const light = new PointLight(0xffffff, 1, 0, 2);
  light.position.set(0,0,4);
  sceneDispatcher({ type: 'set_light', payload: { light } });
  scene.add(light);

  // const sphereSize = 0.1;
  // const pointLightHelper = new THREE.PointLightHelper( light, sphereSize, 0xff0000 );
  // scene.add( pointLightHelper );
};

const floating = (time, mesh = false, scene, camera, renderer, requestRef) => {
  const velocity = 1500;
  const amplitude = 0.1;
  if (mesh) {
    mesh.position.y = Math.sin(time / velocity) * amplitude;
    renderer.render(scene, camera);
    requestRef.current = requestAnimationFrame(time => { floating(time, mesh, scene, camera, renderer, requestRef) });
  }
}

const ShapeStyles = styled.div`
  grid-row: 1;
  grid-column: 1;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  transition: opacity 5s;

  ${({ visible }) => visible && css`
    opacity: 1;
  `}
`;

export const Shape = () => {
  const [visible, setVisible] = useState(false);
  const circleContainer = useRef(null);
  const [sceneState, sceneDispatcher] = useReducer(sceneReducer, initialSceneState);
  const [mouseState, mouseDispatcher] = useReducer(mouseReducer, initialMouseState);
  const { mesh, scene, camera, renderer, light } = sceneState;
  const { sx, sy } = mouseState;
  const requestRef = useRef();
  const pos = useRef(new Vector3());
  const mouse = useRef(new Vector3());

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, screenWidth / screenHeight, 0.1, 1000);
    const renderer = new WebGLRenderer({ antialias: true, alpha: true })

    camera.position.z = 5;
    renderer.setSize(screenWidth, screenHeight);

    sceneDispatcher({ type: 'set_camera', payload: { camera }});
    sceneDispatcher({ type: 'set_scene', payload: { scene }});
    sceneDispatcher({ type: 'set_renderer', payload: { renderer }});

    circleContainer.current.appendChild(renderer.domElement);

    document.addEventListener('mousemove', (e) => {
      const { position } = camera;
      mouse.current.set((e.clientX / screenWidth) * 2 - 1, - (e.clientY / screenHeight) * 2 + 1, 0.5);
      mouse.current.unproject(camera);
      mouse.current.sub(position).normalize();
      const distance = - position.z / mouse.current.z;
      pos.current.copy(position).add(mouse.current.multiplyScalar(distance));
      mouseDispatcher({ type: 'set_sx', payload: { sx: pos.current.x } });
      mouseDispatcher({ type: 'set_sy', payload: { sy: pos.current.y } });
    });

    initMesh(scene, sceneDispatcher);
    initAmbLight(scene, sceneDispatcher);
    initLight(scene, sceneDispatcher);

    renderer.render(scene, camera);

    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(time => { floating(time, mesh, scene, camera, renderer, requestRef) });
  }, [scene, camera, mesh]);

  useEffect(() => {
    if (!light) return;
    light.position.x = sx;
    light.position.y = sy;

    if (!mesh) return;
    // console.log(mesh.material.color = new Color(1.0, Math.abs(Math.sin(sx/10 * 1.0)), Math.abs(Math.sin(sy/10 * 1.0)) ));

    renderer.render(scene, camera);

  }, [mouseState]);

  return (
    <ShapeStyles ref={circleContainer} visible={visible}></ShapeStyles>
  )
}