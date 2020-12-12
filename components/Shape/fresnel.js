export const fresnel = {
  uniforms: {
    "mFresnelBias": { type: "f", value: 0.1 },
    "mFresnelPower": { type: "f", value: 3.0 },
    "mFresnelScale": { type: "f", value: 1.0 },
    "time_g": { type: "f", value: 50.0 },
    "time_b": { type: "f", value: 50.0 },
    "tCube": { type: "t", value: null }
  },
  fragmentShader:`
    uniform samplerCube tCube;
    uniform float time_g;
    uniform float time_b;

    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {
      vec4 reflectedColor = vec4( 1.0, abs(sin(time_g * 1.0)), abs(sin(time_b * 1.0)), 1.0);
      vec4 refractedColor = vec4( 0.38, 0.38, 0.38, 1.0 );

      refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
      refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
      refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

      gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
    }
  `,
  vertexShader: `
    uniform float mFresnelBias;
    uniform float mFresnelScale;
    uniform float mFresnelPower;
    uniform float time_g;
    uniform float time_b;

    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

      vec3 I = worldPosition.xyz - cameraPosition;

      vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

      gl_Position = projectionMatrix * mvPosition;
    }
    `
};