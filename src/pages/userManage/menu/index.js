import React, { Component } from 'react';
import CustomTable from 'components/table/CustomTable';

import { Card, message, Modal, Popconfirm } from 'antd';
import AddEditModel from './AddEditModel';
import { menuOperate } from './operateData';
const { confirm } = Modal;
class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0,
      pid: 0,
      type: '新增菜单',
      tableData: [],
    };
  }
  handleFormData = (data) => {
    let { id, pid, type, icon, level, moduleIndex } = this.state;
    data.available = data.available == 1 ? true : false;
    if (type == '编辑菜单') {
      // 编辑
      let obj = Object.assign({}, data, { id, pid, icon, level, moduleIndex });
      console.log(obj);
      this.addEditMenu(obj, '编辑成功');
    } else {
      // 新增
      let obj = Object.assign({}, data, { pid: id, icon, level, moduleIndex });
      console.log(obj);
      this.addEditMenu(obj, '新增成功');
    }
  };
  handleAdd = (row) => {
    let { icon, level, moduleIndex } = row;
    icon = '';
    this.setState({ type: '新增菜单', id: row.id, icon, level, moduleIndex }, () => {
      this.childEle.openModel();
    });
  };
  componentDidMount() {
    this.getMenuTree();
  }
  handleEdit = (row) => {
    // e.stopPropagation();
    console.log(row);
    let { icon, level, moduleIndex } = row;
    console.log();
    this.setState({ type: '编辑菜单', id: row.id, pid: row.pid, icon, level, moduleIndex }, () => {
      this.childEle.openModel(row);
    });
  };
  // 菜单树
  getMenuTree = () => {
    React.$ajax.getData('/api/sys/sys-module/queryMenuTree', {}).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let resData = res.data ? res.data : [];
        this.setState({ tableData: resData });
      }
    });
  };
  // 菜单详情
  getMenuDetal = (id) => {
    React.$ajax.getData('/api/sys/sys-module/queryMenuTree', { id }).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
      }
    });
  };
  // 删除菜单
  delteMenu = (id) => {
    React.$ajax.getData('/api/sys/sys-module/delCascade', { id }).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        this.getMenuTree();
      }
    });
  };
  // 新增/编辑
  addEditMenu = (per, txt) => {
    React.$ajax.postData('/api/sys/sys-module/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.childEle.handleCancel();
          this.getMenuTree();
        });
      }
    });
  };
  handleDelteMenu = (row) => {
    console.log(row);
    confirm({
      title: '提示',
      content: '确认删除当前节点及子节点吗',
      onOk: () => {
        this.delteMenu(row.id);
      },
      onCancel() {},
    });
  };
  render() {
    return (
      <div>
        <Card title="系统菜单维护" bordered={false}>
          <AddEditModel
            onRef={(ref) => (this.childEle = ref)}
            type={this.state.type}
            editFormData={this.handleFormData}
          />
          {this.state.tableData && this.state.tableData.length > 0 ? (
            <CustomTable
              setTableKey={(row) => {
                return 'key-' + row.id;
              }}
              dataSource={this.state.tableData}
              loading={this.state.loading}
              columns={menuOperate(this.handleAdd, this.handleEdit, this.handleDelteMenu)}
              isBordered={true}
              isRowSelects={false}
              isAllRows={false}
            ></CustomTable>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default MenuList;
