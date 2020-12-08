export const mouseReducer = (state, action) => {
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