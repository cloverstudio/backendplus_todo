import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Creatable from "react-select/lib/Creatable";
import DateTime from "react-datetime";
import moment from "moment";
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
  Row,
  Col,
  Alert,
  Tooltip,
} from "antd";
const { Title, Text } = Typography;

import Truncate from "../../components/truncate";
import Base from "../../components/base";
import history from "../../lib/history";
import * as constants from "../../lib/constants";
import * as actions from "../../actions";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import * as validate from "../../lib/validate";

export default (props) => {
  const [id, setId] = useState(props.match.params.id);

  const [task, setTask] = useState("");

  const [duedate, setDuedate] = useState("");

  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const globalState = {
    loading: useSelector((state) => state.ui.loading),
    todo: useSelector((state) => state.todo.detail),
  };

  const localActions = {
    loadOne: (id) => dispatch(actions.todo.loadOne(id)),
    unLoad: () => dispatch(actions.todo.unLoad()),
    checkToken: () => dispatch(actions.login.checkToken()),
    update: (params) => dispatch(actions.todo.update(params)),
    showModal: (params) => dispatch(actions.ui.showModal(params)),
  };

  useEffect(() => {
    (async () => {
      await localActions.checkToken();
      await localActions.loadOne(id);
    })();

    return () => {
      localActions.unLoad();
    };
  }, []);

  useEffect(() => {
    if (!globalState.todo) return;

    if (globalState.todo.task) {
      setTask(globalState.todo.task);
    }

    if (globalState.todo.duedate) {
      globalState.todo.duedate
        ? setDuedate(moment.utc(globalState.todo.duedate).format("YYYY-MM-DD"))
        : null;
    }

    if (globalState.todo.description) {
      setDescription(globalState.todo.description);
    }
  }, [globalState.todo]);

  const update = async () => {
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

    let options = {};

    await localActions.update({
      id: id,

      task: task,

      duedate: duedate,

      description: description,
    });

    setTask("");

    setDuedate("");

    setDescription("");
  };

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
          <Breadcrumb.Item>Edit ({id})</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Title level={2}>Edit Todo</Title>
      <Text> Please modify fields to be changed.</Text>
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
            defaultValue=""
            value={task ? task : ""}
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Due Date">
          <DatePicker
            id="duedate"
            format="YYYY-MM-DD"
            name="duedate"
            placeholder="Due Date"
            defaultValue=""
            value={duedate ? moment.utc(duedate) : ""}
            onChange={(date, dateString) => setDuedate(dateString)}
          />
        </Form.Item>

        <Form.Item label="description">
          <Input.TextArea
            id="description"
            name="description"
            placeholder="description"
            defaultValue=""
            value={description ? description : ""}
            onChange={(e) => setDescription(e.target.value)}
            rows="9"
          />
        </Form.Item>

        <Form.Item {...constants.defailtFormLoayout.button}>
          <Button
            icon={globalState.loading ? "loading" : "check"}
            type="primary"
            onClick={() => {
              update();
            }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Base>
  );
};
