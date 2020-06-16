import shajs from "sha.js";
import { push } from "connected-react-router";

import * as types from "./actionTypes";
import api from "../lib/api";
import * as conf from "../lib/conf";
import * as utils from "../lib/utils";
import * as constants from "../lib/constants";
import * as actions from "./index";
import history from "../lib/history";

export function load({ page, sortKey, sortOrder, filterString }) {
  console.log(page, sortKey, sortOrder);

  return async (dispatch, getState) => {
    dispatch(actions.ui.showLoading());

    try {
      if (!page || page < 0) page = 1;

      if (!sortKey) sortKey = "";
      if (!sortOrder) sortOrder = "";

      const response = await api.get(
        "/todo?page=" +
          page +
          "&sort=" +
          sortKey +
          "&order=" +
          sortOrder +
          "&filters=" +
          filterString
      );

      if (!response || !response.list) {
        dispatch(actions.ui.showToastError("Failed to load list."));
        dispatch(actions.ui.hideLoading());
        return;
      }

      const list = response.list;
      const count = response.count;
      const references = response.references;
      const pagingRowCount = response.pagingRowCount;

      dispatch({
        type: types.TODO_LOAD_LIST,
        list: list,
        count,
        pagingRowCount,
        references,
      });

      dispatch(actions.ui.hideLoading());
    } catch (e) {
      console.error(e);
      dispatch(actions.ui.showToastError("Failed to load list."));
      dispatch(actions.ui.hideLoading());
    }
  };
}

export function add(params) {
  return async (dispatch, getState) => {
    dispatch(actions.ui.showLoading());

    try {
      const response = await api.post("/todo", params);

      if (response && response.todo) {
        dispatch(actions.ui.showToastInfo("Successfuly added."));
      } else {
        dispatch(actions.ui.showToastError(response));
      }

      dispatch(actions.ui.hideLoading());

      history.push("/todo");
    } catch (e) {
      dispatch(actions.ui.showToastError("Failed to add."));
      dispatch(actions.ui.hideLoading());
    }
  };
}

export function loadOne(id) {
  return async (dispatch, getState) => {
    dispatch(actions.ui.showLoading());

    try {
      const response = await api.get(`/todo/${id}`);
      console.log("response", response);

      dispatch({
        type: types.TODO_LOAD_DETAIL,
        detail: response.todo,
        references: response.references,
      });

      dispatch(actions.ui.hideLoading());
    } catch (e) {
      console.error(e);
      dispatch(actions.ui.showToastError("Failed to load."));
      dispatch(actions.ui.hideLoading());
    }
  };
}

export function unLoad() {
  return {
    type: types.TODO_LOAD_DETAIL,
    detail: {},
    references: [],
  };
}

export function deleteOne(id) {
  return async (dispatch, getState) => {
    dispatch(actions.ui.showLoading());

    try {
      const response = await api.delete(`/todo/${id}`);

      if (response && response.deleted) {
        dispatch(actions.ui.showToastInfo("Deleted successfully."));
      } else {
        dispatch(actions.ui.showToastError("Failed to delete ."));
      }

      dispatch(actions.ui.hideLoading());

      history.push("/todo");
    } catch (e) {
      console.error(e);
      dispatch(actions.ui.showToastError("Failed to delete ."));
      dispatch(actions.ui.hideLoading());
    }
  };
}

export function update(params) {
  return async (dispatch, getState) => {
    dispatch(actions.ui.showLoading());

    try {
      const response = await api.put("/todo", params);

      if (response && response.todo) {
        dispatch(actions.ui.showToastInfo("Updated successfully."));
      } else {
        dispatch(actions.ui.showToastError(response));
      }

      dispatch(actions.ui.hideLoading());

      history.push("/todo");
    } catch (e) {
      console.error(e);
      dispatch(actions.ui.showToastError("Failed to update."));
      dispatch(actions.ui.hideLoading());
    }
  };
}
