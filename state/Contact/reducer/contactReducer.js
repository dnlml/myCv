export const contactReducer = (state, action) => {
  switch (action.type) {
    case 'set_g':
      const { g } = action.payload;

      return {
        ...state,
        g
      }

    case 'set_b':
      const { b } = action.payload;

      return {
        ...state,
        b
      }

    default:
      return state;
  }
};