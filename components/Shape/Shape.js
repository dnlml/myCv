import { useEffect, useReducer, useRef, useState, useContext } from "react";
import styled, { css } from "styled-components";
import {
  SphereGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  HemisphereLight,
  PointLight,
  UniformsUtils,
  ShaderMaterial
} from "three";
import { fresnel } from './fresnel';
import { sceneReducer } from '../../state/Shape/sceneReducer';
import { mouseReducer } from '../../state/Shape/mouseReducer';
import { ContactContext } from '../../state/Contact/context/ContactContext';
import { normalize } from '../../utils/normalize';

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
  const {dispatch: setContactColors} = useContext(ContactContext);
  const [visible, setVisible] = useState(false);
  const circleContainer = useRef(null);
  const [sceneState, sceneDispatcher] = useReducer(sceneReducer, initialSceneState);
  const [mouseState, mouseDispatcher] = useReducer(mouseReducer, initialMouseState);
  const { mesh, scene, camera, renderer, light } = sceneState;
  const { sx, sy } = mouseState;
  const requestRef = useRef();

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

    initMesh(scene, sceneDispatcher);
    initAmbLight(scene, sceneDispatcher);
    initLight(scene, sceneDispatcher);

    renderer.render(scene, camera);

    circleContainer.current.appendChild(renderer.domElement);

    setTimeout(() => {
      setVisible(true);
    }, 1000);

    document.addEventListener('mousemove', (e) => {
      const x = normalize(e.clientX, 0, screenWidth, 0, Math.PI/2);
      const y = normalize(e.clientY, 0, screenHeight, 0, Math.PI/2);
      mouseDispatcher({ type: 'set_sx', payload: { sx: x } });
      mouseDispatcher({ type: 'set_sy', payload: { sy: y } });
      setContactColors({ type: 'set_g', payload: { g: Math.abs(Math.sin(x)) } });
      setContactColors({ type: 'set_b', payload: { b: Math.abs(Math.sin(y)) } });
    });
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(time => { floating(time, mesh, scene, camera, renderer, requestRef) });
  }, [scene, camera, mesh]);

  useEffect(() => {
    if (!light) return;
    light.position.x = sx;
    light.position.y = sy;

    if (!mesh) return;
    let { time_g, time_b } = mesh.material.uniforms;
    time_g.value = sx;
    time_b.value = sy;
    renderer.render(scene, camera);

  }, [mouseState]);

  return (
    <ShapeStyles ref={circleContainer} visible={visible}></ShapeStyles>
  )
}