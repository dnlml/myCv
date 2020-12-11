export const sceneReducer = (state, action) => {
  switch (action.type) {
    case 'set_scene':
      return {
        ...state,
        scene: action.payload.scene
      }
    case 'set_renderer':
      return {
        ...state,
        renderer: action.payload.renderer
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

    case 'set_amb_light':
      return {
        ...state,
        ambLight: action.payload.ambLight
      }

    case 'set_light':
      return {
        ...state,
        light: action.payload.light
      }

    default:
      return state;
  }
}