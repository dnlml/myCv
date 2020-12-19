export const contactReducer = (state, action) => {
  switch (action.type) {
    case 'set_r':
      const { r } = action.payload;

      return {
        ...state,
        r
      }

    default:
      return state;
  }
};