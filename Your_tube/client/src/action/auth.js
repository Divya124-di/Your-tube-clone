import * as api from "../Api";
import { setcurrentuser } from "./currentuser";

export const login = (authdata) => async (dispatch) => {
  try {
    const { data } = await api.login(authdata); // ⬅️ backend returns { result, token, theme, ... }

    localStorage.setItem("Profile", JSON.stringify(data)); // ✅ saves whole user data + token + theme

    dispatch({ type: "AUTH", data }); // ✅ Redux auth

    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile")))); // ✅ set current user

    if (data.theme) {
      dispatch({ type: "SET_THEME", payload: data.theme }); // ✅ dispatch theme to reducer
    }
  } catch (error) {
    alert(error);
  }
};
