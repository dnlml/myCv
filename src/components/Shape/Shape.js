import { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { fresnel } from './fresnel';
import { labyrinth } from './labyrinth';
import { rainbow } from './rainbow';

const initialSceneState = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  camera: false,
  mesh: false,
  light: false,
  ambLight: false,
  scene: new THREE.Scene(),
  renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true }),
};

const initialMouseState = {
  dx: 0,
  dy: 0,
  sx: window.innerHeight / 2,
  sy: window.innerWidth / 2,
};

const sceneReducer = (state, action) => {
  switch (action.type) {
    case 'set_screen_width':
      return {
        ...state,
        screenWidth: window.innerWidth
      }

    case 'set_screen_height':
      return {
        ...state,
        screenHeight: window.innerHeight
      }

    case 'set_camera':
      return {
        ...state,
        camera: action.payload.camera
      }

    case 'set_mesh':
      return {
        ...state,
        mesh: action.payload.mesh
      }

    case 'set_light':
      return {
        ...state,
        light: action.payload.light
      }

    case 'set_amb_light':
      return {
        ...state,
        ambLight: action.payload.ambLight
      }

    default:
      return {
        ...state
      }
  }
}

const mouseReducer = (state, action) => {
  switch (action.type) {
    case 'set_sx':
      return {
        ...state,
        sx: action.payload.sx
      }

    case 'set_sy':
      return {
        ...state,
        sy: action.payload.sy
      }

    default:
      return {
        ...state
      }
  }
};

const initMesh = (scene, sceneDispatcher) => {
  // const uniforms = THREE.UniformsUtils.clone(rainbow.uniforms);
  // const uniforms = THREE.UniformsUtils.clone(labyrinth.uniforms);
  const uniforms = THREE.UniformsUtils.clone(fresnel.uniforms);
  // const rainbowParams = { fragmentShader: rainbow.fragmentShader, vertexShader: rainbow.vertexShader, uniforms: uniforms };
  const fresnelParams = { fragmentShader: fresnel.fragmentShader, vertexShader: fresnel.vertexShader, uniforms: uniforms };
  // const labyrinthParams = { fragmentShader: labyrinth.fragmentShader, vertexShader: labyrinth.vertexShader, uniforms: uniforms };
  // const rainbowMaterial = new THREE.ShaderMaterial(rainbowParams);
  const fresnelMaterial = new THREE.ShaderMaterial(fresnelParams);
  // const labyrinthMaterial = new THREE.ShaderMaterial(labyrinthParams);
  // const met = new THREE.MeshLambertMaterial({ color: 0x262626 });

  const geom = new THREE.SphereGeometry( 2, 256, 256 );

  const mesh = new THREE.Mesh(geom, fresnelMaterial);
  // const mesh = new THREE.Mesh(geom, fresnelMaterial);
  // const mesh = new THREE.Mesh(geom, met);
  // mesh.rotation.x = normalize(0, 0, window.innerHeight, 4 * Math.PI / 10, 6 * Math.PI / 10);
  // mesh.rotation.z = normalize(0, 0, window.innerWidth, 4 * Math.PI / 100, -4 * Math.PI / 100);
  sceneDispatcher({type: 'set_mesh', payload: { mesh }});
  scene.add(mesh);
}

const initAmbLight = (scene, sceneDispatcher) => {
  const ambLight = new THREE.HemisphereLight(0xffffff, 0.1);
  sceneDispatcher({ type: 'set_amb_light', payload: { ambLight } });

  scene.add(ambLight);
};

const initLight = (scene, sceneDispatcher) => {
  const light = new THREE.PointLight(0xffffff, 1, 0, 2);
  light.position.x = 0;
  light.position.y = 0;
  light.position.z = 4;
  sceneDispatcher({ type: 'set_light', payload: { light } });
  scene.add(light);

  // const sphereSize = 0.1;
  // const pointLightHelper = new THREE.PointLightHelper( light, sphereSize, 0xff0000 );
  // scene.add( pointLightHelper );
};

const normalize = (x, istart, istop, ostart, ostop) => {
  return ostart + (ostop - ostart) * ((x - istart) / (istop - istart));
};

const ShapeStyles = styled.div`
  grid-row: 1;
  grid-column: 1;
  width: 100vw;
  height: 100vh;
`;

const animate = (time, mesh = false, scene, camera, renderer, requestRef) => {
  if (mesh && scene && camera) {
    const velocity = 1500;
    const amplitude = 0.1;
    mesh.position.y = Math.sin(time / velocity) * amplitude;
    scene && camera && renderer.render(scene, camera);
    requestRef.current = requestAnimationFrame(time => { animate(time, mesh, scene, camera, renderer, requestRef) });
  }
}

export const Shape = () => {
  const circleContainer = useRef(null);
  const [sceneState, sceneDispatcher] = useReducer(sceneReducer, initialSceneState);
  const [mouseState, mouseDispatcher] = useReducer(mouseReducer, initialMouseState);
  const { mesh, screenHeight, screenWidth, light, scene, camera, renderer } = sceneState;
  const { sx, sy } = mouseState;
  const requestRef = useRef();

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer.setSize(screenWidth, screenHeight);
    sceneDispatcher({ type: 'set_camera', payload: { camera }});
    circleContainer.current.appendChild(renderer.domElement);
    window.addEventListener('mousemove', (e) => {
      mouseDispatcher({ type: 'set_sx', payload: { sx: e.pageX } });
      mouseDispatcher({ type: 'set_sy', payload: { sy: e.pageY } });
    });

    // scene.add(new THREE.AxisHelper( 5 ));
    initMesh(scene, sceneDispatcher);
    initAmbLight(scene, sceneDispatcher);
    initLight(scene, sceneDispatcher);
    scene.background = new THREE.Color(0x262626)
    // const helper = new THREE.CameraHelper(camera);
    // scene.add(helper);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(time => { animate(time, mesh, scene, camera, renderer, requestRef) });
  }, [scene, camera, mesh]);

  useEffect(() => {
    // if (!mesh) return;
    // mesh.rotation.x = normalize(ndy, 0, screenHeight, 6 * Math.PI / 10, -6 * Math.PI / 10);
    // mesh.rotation.z = normalize(ndx, 0, screenWidth, 4 * Math.PI / 100, -4 * Math.PI / 100);

    if (!light) return;
    light.position.x = normalize(sx, 0, screenWidth, -5.5, 5.5);
    light.position.y = normalize(sy, 0, screenHeight, 3, -3);

    if (!mesh) return;
    const { time_g, time_r } = mesh.material.uniforms;
    time_g.value = sx / screenWidth * 1.0;
    time_r.value = sy / screenHeight * 1.0;

    scene && camera && renderer.render(scene, camera);
  }, [mouseState]);

  // mesh && animateMesh(mesh, Date.now().toString().slice(-1));

  return (
    <ShapeStyles ref={circleContainer}>
    </ShapeStyles>
  )
}