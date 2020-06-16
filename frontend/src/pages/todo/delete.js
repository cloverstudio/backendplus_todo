import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  Icon,
  List,
  Typography,
  Divider,
  Button,
  Alert,
  Tag,
} from "antd";

const { Title, Text } = Typography;

import * as conf from "../../lib/conf";
import Base from "../../components/base";
import history from "../../lib/history";
import * as constants from "../../lib/constants";
import * as actions from "../../actions";
import * as utils from "../../lib/utils";

export default (props) => {
  const [id, setId] = useState(props.match.params.id);
  const [model, setModel] = useState(null);

  const [listDataSource, setListDataSource] = useState([]);

  const dispatch = useDispatch();

  const globalState = {
    loading: useSelector((state) => state.ui.loading),
    todo: useSelector((state) => state.todo.detail),
    references: useSelector((state) => state.todo.references),
  };

  const localActions = {
    loadOne: (id) => dispatch(actions.todo.loadOne(id)),
    checkToken: () => dispatch(actions.login.checkToken()),
    deleteOne: (id) => dispatch(actions.todo.deleteOne(id)),
  };

  useEffect(() => {
    (async () => {
      await localActions.checkToken();
      await localActions.loadOne(id);
    })();
  }, []);

  useEffect(() => {
    if (!globalState.todo) return;

    setListDataSource([
      {
        label: "Id",
        content: <span>{globalState.todo.id}</span>,
      },

      {
        label: "Task",
        content: <span>{globalState.todo.task}</span>,
      },

      {
        label: "Due Date",
        content: (
          <span>
            {globalState.todo.duedate
              ? moment
                  .utc(globalState.todo.duedate)
                  .format(constants.dateFormat)
              : null}
          </span>
        ),
      },

      {
        label: "description",
        content: <span>{globalState.todo.description}</span>,
      },

      {
        label: "Modified At",
        content: <span>{utils.formatDate(globalState.todo.modified_at)}</span>,
      },
      {
        label: "Created At",
        content: <span>{utils.formatDate(globalState.todo.created_at)}</span>,
      },
    ]);
  }, [globalState.todo]);

  useEffect(() => {}, [globalState.references]);

  return (
    <Base
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/todo">Todo</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Delete ({globalState.todo.id})</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Title level={2}>Delete</Title>
      <Text>Delete ({globalState.todo.id})</Text>
      <Divider />
      <Alert
        message="Warning"
        description="Are you sure you want to permanently remove this record ?"
        type="warning"
        showIcon
      />
      <List
        itemLayout="horizontal"
        dataSource={listDataSource}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.label} description={item.content} />
          </List.Item>
        )}
      />
      <Button
        type="primary"
        icon={globalState.loading ? "loading" : "delete"}
        onClick={(e) => localActions.deleteOne(id)}
      >
        Delete
      </Button>
      &nbsp;
      <Button type="danger" icon="caret-left" onClick={(e) => history.goBack()}>
        Cancel
      </Button>
    </Base>
  );
};
