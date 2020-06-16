import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import {
  Layout,
  Menu,
  Icon,
  Table,
  Breadcrumb,
  Button,
  Tag,
  Tooltip,
} from "antd";

import Base from "../../components/base";
import Truncate from "../../components/truncate";
import history from "../../lib/history";
import customFilterTextBox from "../../components/customFilterTextbox";

import * as conf from "../../lib/conf";
import * as utils from "../../lib/utils";
import * as actions from "../../actions";
import * as constants from "../../lib/constants";

export default (props) => {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterString, setFilterString] = useState(null);

  const dispatch = useDispatch();

  const globalState = {
    loading: useSelector((state) => state.ui.loading),
    list: useSelector((state) => state.todo.list),
    references: useSelector((state) => state.todo.references),
    count: useSelector((state) => state.todo.count),
    rowCount: useSelector((state) => state.todo.pagingRowCount),
  };

  const localActions = {
    checkToken: () => dispatch(actions.login.checkToken()),
    load: () =>
      dispatch(actions.todo.load({ page, sortKey, sortOrder, filterString })),
    refreshMaster: (type) => dispatch(actions.master.refresh(type)),
  };

  useEffect(() => {
    (async () => {
      await localActions.checkToken();
      await localActions.load();
    })();
  }, []);

  useEffect(() => {
    localActions.load();
  }, [page, sortKey, sortOrder, filterString]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.columnKey != sortKey) setSortKey(sorter.columnKey);

    if (sorter.order != sortOrder) setSortOrder(sorter.order);

    if (pagination.current != page) setPage(pagination.current);

    Object.keys(filters).map((paramName) => {
      if (Array.isArray(filters[paramName])) {
        if (filters[paramName].length > 0)
          filters[paramName] = filters[paramName].map((val) => val);
        else delete filters[paramName];
      }
    });

    const newFilterString = JSON.stringify(filters);
    console.log("newFilterString", newFilterString);

    if (newFilterString != filterString) setFilterString(newFilterString);
  };

  let tableColumns = [
    {
      title: "ID",
      key: "id",
      sorter: (a, b) => null,
      sortDirections: ["descend", "ascend"],
      render: (tmp, row) => (
        <span>
          <Link to={`/todo/detail/${row.id}`}>{row.id}</Link>
        </span>
      ),
    },

    {
      title: "Task",

      title: "Task",
      key: "task",

      sorter: (a, b) => null,
      sortDirections: ["descend", "ascend"],

      render: (tmp, row) => (
        <span>
          <Truncate text={row.task} />
        </span>
      ),

      ...customFilterTextBox("task", "Task"),
    },

    {
      title: "Due Date",

      title: "Duedate",
      key: "duedate",

      sorter: (a, b) => null,
      sortDirections: ["descend", "ascend"],

      render: (tmp, row) => (
        <span>
          {row.duedate
            ? moment.utc(row.duedate).format(constants.dateFormat)
            : null}
        </span>
      ),
    },

    {
      title: "Modified",
      key: "modified_at",
      sorter: (a, b) => null,
      sortDirections: ["descend", "ascend"],
      render: (tmp, row) => (
        <Tooltip
          placement="topLeft"
          title={utils.formatDate(row.modified_at)}
          arrowPointAtCenter
        >
          {utils.formatDateShort(row.modified_at)}
        </Tooltip>
      ),
    },
    {
      title: "Created",
      key: "created_at",
      sorter: (a, b) => null,
      sortDirections: ["descend", "ascend"],
      render: (tmp, row) => (
        <Tooltip
          placement="topLeft"
          title={utils.formatDate(row.created_at)}
          arrowPointAtCenter
        >
          {utils.formatDateShort(row.created_at)}
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (tmp, row) => (
        <span>
          <Link to={`/todo/edit/${row.id}`}>Edit </Link>
          &nbsp;<Link to={`/todo/delete/${row.id}`}>Delete</Link>
        </span>
      ),
    },
  ];

  useEffect(() => {}, [globalState.references]);

  const totalPageCount = Math.ceil(globalState.count / globalState.rowCount);
  const pages = [];

  for (let i = 0; i < totalPageCount; i++) {
    pages.push(i + 1);
  }

  return (
    <Base
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Todo</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Button
        id="add-button"
        type="danger"
        size="large"
        icon="plus"
        shape="circle"
        onClick={(e) => history.push("/todo/add")}
      />

      {(() => {
        // add dynamic filters
        tableColumns = tableColumns.map((column) => {
          return column;
        });
      })()}

      {globalState.list.length > 0 ? (
        <Table
          columns={tableColumns}
          dataSource={globalState.list}
          pagination={{
            defaultCurrent: page,
            defaultPageSize: globalState.rowCount,
            total: globalState.count,
          }}
          onChange={handleTableChange}
        />
      ) : (
        <Table
          columns={tableColumns}
          dataSource={globalState.list}
          onChange={handleTableChange}
        />
      )}
    </Base>
  );
};
