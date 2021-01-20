import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
} from "../constants/orderConstants";
import axios from "axios";
// createOrder action
//it accepts an entire order
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_CREATE_REQUEST action
    dispatch({ type: ORDER_CREATE_REQUEST });
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
    // POST request
    //order is the second argument with the data we want to update with
    const { data } = await axios.post(`/api/orders`, order, config);
    // after register dispatch the ORDER_CREATE_SUCCESS
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// getOrderDetails action
//it accepts an order id
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_DETAILS_REQUEST action
    dispatch({ type: ORDER_DETAILS_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        // GET request so Content-Type is not necessary
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // GET request
    const { data } = await axios.get(`/api/orders/${id}`, config);
    // after register dispatch the ORDER_DETAILS_SUCCESS
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
