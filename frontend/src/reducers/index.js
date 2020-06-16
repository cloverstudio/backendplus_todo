import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import * as types from "../actions/actionTypes";

import ui from "./ui";
import user from "./user";
import loginuser from "./loginuser";

import todo from "./todo";

const testReducer = (state = "", action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default () =>
  combineReducers({
    todo,

    ui,
    user,
    testReducer,
    loginuser,
  });
