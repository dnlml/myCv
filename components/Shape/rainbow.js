export const rainbow = {
  uniforms: {
    "time": { value: 1.0 },
    "resolution": { value: [970.0, 1066.0] }
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    varying vec3 fPosition;
    varying vec3 fNormal;
    varying vec3 vPosition;

    //you can use functions in shaders as you would expect.
    vec3 color() {

      vec3 color = vec3(0.0, 0.0, 0.0);

      //built in functions  http://www.shaderific.com/glsl-functions/
      color.x = sin(time * 50.0) * vPosition.x;
      color.y = cos(time * 20.0) * vPosition.y;
      color.z =  sin(time * 50.0) * cos(time * 20.0);

      return color;
    }

    void main()
    {
      gl_FragColor = vec4(color(), 1.0);
    }
  `
}