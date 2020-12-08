import { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import {
  UniformsUtils,
  ShaderMaterial,
  SphereGeometry,
  Mesh,
  Vector3,
  PerspectiveCamera,
  Color,
  Scene,
  WebGLRenderer,
  HemisphereLight
} from "three";
import { fresnel } from './fresnel';
import { sceneReducer } from '../../state/Shape/sceneReducer';
import { mouseReducer } from '../../state/Shape/mouseReducer';

const initialSceneState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  camera: false,
  mesh: false,
  light: false,
  ambLight: false,
  scene: new Scene(),
  renderer: new WebGLRenderer({ antialias: true, alpha: true }),
};

const initialMouseState = {
  sx: window.innerHeight / 2,
  sy: window.innerWidth / 2,
};

const initMesh = (scene, sceneDispatcher) => {
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
  const ambLight = new HemisphereLight(0xffffff, 0.1);
  sceneDispatcher({ type: 'set_amb_light', payload: { ambLight } });

  scene.add(ambLight);
};

const floating = (time, mesh = false, scene, camera, renderer, requestRef) => {
  if (mesh && scene && camera) {
    const velocity = 1500;
    const amplitude = 0.1;
    mesh.position.y = Math.sin(time / velocity) * amplitude;
    scene && camera && renderer.render(scene, camera);
    requestRef.current = requestAnimationFrame(time => { floating(time, mesh, scene, camera, renderer, requestRef) });
  }
}

const ShapeStyles = styled.div`
  grid-row: 1;
  grid-column: 1;
  width: 100vw;
  height: 100vh;
`;

export const Shape = () => {
  const circleContainer = useRef(null);
  const [sceneState, sceneDispatcher] = useReducer(sceneReducer, initialSceneState);
  const [mouseState, mouseDispatcher] = useReducer(mouseReducer, initialMouseState);
  const { mesh, screenHeight, screenWidth, scene, camera, renderer } = sceneState;
  const { sx, sy } = mouseState;
  const requestRef = useRef();
  const pos = useRef(new Vector3());
  const mouse = useRef(new Vector3());

  useEffect(() => {
    const camera = new PerspectiveCamera(45, screenWidth / screenHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer.setSize(screenWidth, screenHeight);

    sceneDispatcher({ type: 'set_camera', payload: { camera }});
    circleContainer.current.appendChild(renderer.domElement);

    document.addEventListener('mousemove', (e) => {
      mouse.current.set((e.clientX / screenWidth) * 2 - 1, - (e.clientY / screenHeight) * 2 + 1, 0.5);
      mouse.current.unproject(camera);
      mouse.current.sub(camera.position).normalize();
      const distance = - camera.position.z / mouse.current.z;
      pos.current.copy(camera.position).add(mouse.current.multiplyScalar(distance));
      mouseDispatcher({ type: 'set_sx', payload: { sx: pos.current.x } });
      mouseDispatcher({ type: 'set_sy', payload: { sy: pos.current.y } });
    });

    initMesh(scene, sceneDispatcher);
    initAmbLight(scene, sceneDispatcher);
    scene.background = new Color(0x161616);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(time => { floating(time, mesh, scene, camera, renderer, requestRef) });
  }, [scene, camera, mesh]);

  useEffect(() => {
    if (!mesh) return;
    const { time_g, time_r } = mesh.material.uniforms;
    time_g.value = sx * 1.0;
    time_r.value = sy * 1.0;

    scene && camera && renderer.render(scene, camera);

  }, [mouseState]);

  return (
    <ShapeStyles ref={circleContainer}></ShapeStyles>
  )
}