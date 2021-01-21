import axios from "axios";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";
// login action requires and email and password
export const login = (email, password) => async (dispatch) => {
  try {
    // dispatch the login request action
    dispatch({ type: USER_LOGIN_REQUEST });
    // we want to send a header with the content-type:application/json
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    // after login dispatch the user login success
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // save the userInfo to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// logout action
export const logout = (dispatch) => {
  // remove user data from localstorage
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  // reset the order and user state
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
};
// register action
// register action requires name, email and password
export const register = (name, email, password) => async (dispatch) => {
  try {
    // dispatch the register request action
    dispatch({ type: USER_REGISTER_REQUEST });
    // we want to send a header with the content-type:application/json
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );
    // after register dispatch the user register success
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    //after registration we want the user to be logged in
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // when we login or register we get the user data and token back for both login action and register action
    // save the userInfo to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// get user details action
// getUserDetails action requires user id
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    // dispatch the USER_DETAILS_REQUEST action
    dispatch({ type: USER_DETAILS_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/users/${id}`, config);
    // after register dispatch the USER_DETAILS_SUCCESS
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// update user profile action
// updateUserProfile action requires entire user object
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    // dispatch the USER_UPDATE_PROFILE_REQUEST action
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // PUT request for updating,
    //user is the second argument with the data we want to update with
    const { data } = await axios.put(`/api/users/profile`, user, config);
    // after register dispatch the USER_UPDATE_PROFILE_SUCCESS
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    //for updating the navbar with updated name
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // set the user info in local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
