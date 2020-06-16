import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import DateTime from "react-datetime";
import {
  Breadcrumb,
  Icon,
  Typography,
  Divider,
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Select,
  Radio,
  Checkbox,
  Upload,
} from "antd";
const { Title, Text } = Typography;
const { Option } = Select;

import Base from "../../components/base";
import * as constants from "../../lib/constants";
import * as utils from "../../lib/utils";

import Toast from "../../components/toast";
import Modal from "../../components/modal";

import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";

import * as actions from "../../actions";
import * as validate from "../../lib/validate";

export default () => {
  const [task, setTask] = useState("");

  const [duedate, setDuedate] = useState("");

  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const globalState = {
    loading: useSelector((state) => state.ui.loading),
  };

  const localActions = {
    add: (params) => dispatch(actions.todo.add(params)),
    checkToken: () => dispatch(actions.login.checkToken()),
    showModal: (params) => dispatch(actions.ui.showModal(params)),
  };

  useEffect(() => {
    (async () => {})();
  }, []);

  const add = async () => {
    if (globalState.loading) return;

    // validation

    if (!task || task == "")
      return localActions.showModal({
        modalType: constants.ModalTypeError,
        message: "Task cannot be empty",
        title: "Validation Error",
      });

    if (duedate && !validate.isDate(duedate))
      return localActions.showModal({
        modalType: constants.ModalTypeError,
        message: "Due Date must be a date format.",
        title: "Validation Error",
      });

    await localActions.add({
      task: task,

      duedate: duedate,

      description: description,
    });

    setTask("");

    setDuedate("");

    setDescription("");
  };

  // update handler

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
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Title level={2}>Add New Todo</Title>
      <Text> Please input following fields</Text>
      <Divider />

      <Form
        {...constants.defailtFormLoayout.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form.Item label="Task">
          <Input
            id="task"
            name="task"
            placeholder="Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Due Date">
          <DatePicker
            id="duedate"
            format="YYYY-MM-DD"
            name="duedate"
            placeholder="Due Date"
            onChange={(date, dateString) => setDuedate(dateString)}
          />
        </Form.Item>

        <Form.Item label="description">
          <Input.TextArea
            id="description"
            name="description"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="9"
          />
        </Form.Item>

        <Form.Item {...constants.defailtFormLoayout.button}>
          <Button
            icon={globalState.loading ? "loading" : "plus"}
            type="primary"
            onClick={() => {
              add();
            }}
          >
            Add New Todo
          </Button>
        </Form.Item>
      </Form>
    </Base>
  );
};
