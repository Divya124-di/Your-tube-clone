// reducers/theme.js
const themeReducer = (state = "dark", action) => {
  switch (action.type) {
    case "SET_THEME":
      return action.payload;
    default:
      return state;
  }
};

export default themeReducer;
