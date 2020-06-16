import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import ReduxThunk from "redux-thunk";

// import fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faArrowRight,
  faSpinner,
  faInfoCircle,
  faExclamationCircle,
  faList,
  faPlus,
  faSignOutAlt,
  faPencilAlt,
  faTrashAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUser,
  faKey,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faInfoCircle,
  faExclamationCircle,
  faList,
  faPlus,
  faSignOutAlt,
  faPencilAlt,
  faTrashAlt
);

import history from "./lib/history";

// load css
import css from "../scss/style.scss";

import Login from "./pages/login";
import UserList from "./pages/user/list";
import UserAdd from "./pages/user/add";
import UserDetail from "./pages/user/detail";
import UserDelete from "./pages/user/delete";
import UserEdit from "./pages/user/edit";

import TodoList from "./pages/todo/list";
import TodoAdd from "./pages/todo/add";
import TodoDetail from "./pages/todo/detail";
import TodoDelete from "./pages/todo/delete";
import TodoEdit from "./pages/todo/edit";

import Document from "./pages/document";

import NotFound from "./pages/notfound";

import createRootReducer from "./reducers";

const preloadedState = undefined;

const store = createStore(
  createRootReducer(), // root reducer with router state
  preloadedState,
  compose(applyMiddleware(ReduxThunk))
);

document.title = "Todo List | backend+";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/user" component={UserList} />
        <Route path="/user/add" component={UserAdd} />
        <Route path="/user/detail/:id" component={UserDetail} />
        <Route path="/user/delete/:id" component={UserDelete} />
        <Route path="/user/edit/:id" component={UserEdit} />

        <Route exact path="/todo" component={TodoList} />
        <Route path="/todo/add" component={TodoAdd} />
        <Route path="/todo/detail/:id" component={TodoDetail} />
        <Route path="/todo/delete/:id" component={TodoDelete} />
        <Route path="/todo/edit/:id" component={TodoEdit} />

        <Route exact path="/doc" component={Document} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
