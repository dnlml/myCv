export const sceneReducer = (state, action) => {
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