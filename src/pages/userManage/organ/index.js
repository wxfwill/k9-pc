import React, {Component} from 'react';
import CustomTable from 'components/table/CustomTable';

import {Card, message, Modal, Popconfirm} from 'antd';
import AddEditModel from './AddEditModel';
import {menuOperate} from './operateData';
const {confirm} = Modal;
class OrganList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0,
      pid: 0,
      type: '新增机构',
      tableData: []
    };
  }
  handleFormData = (data) => {
    data.orgType = data.orgType ? data.orgType[1] : null;
    const {id, pid, type, level, orgIndex} = this.state;
    if (type == '编辑机构') {
      // 编辑
      const obj = Object.assign({}, data, {id: id.toString(), pid: pid.toString(), level, orgIndex});
      console.log(obj);
      this.addEditMenu(obj, '编辑成功');
    } else {
      // 新增
      const obj = Object.assign({}, data, {pid: id.toString(), level, orgIndex});
      console.log(obj);
      this.addEditMenu(obj, '新增成功');
    }
  };
  handleAdd = (row) => {
    const {level, orgIndex} = row;
    this.setState({type: '新增机构', id: row.id, level, orgIndex}, () => {
      this.childEle.openModel();
    });
  };
  componentDidMount() {
    this.getOrganTree();
  }
  handleEdit = (row) => {
    // e.stopPropagation();
    console.log(row);
    const {level, orgIndex} = row;
    this.setState({type: '编辑机构', id: row.id, pid: row.pid, level, orgIndex}, () => {
      this.childEle.openModel(row);
    });
  };
  // 机构树
  getOrganTree = () => {
    React.$ajax.getData('/api/sys/sys-org/queryOrgTree', {}).then((res) => {
      if (res && res.code == 0) {
        const resData = res.data ? res.data : [];
        this.setState({tableData: resData});
      }
    });
  };
  // 删除机构
  delteMenu = (id) => {
    React.$ajax.getData('/api/sys/sys-org/delCascade', {id}).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        message.success('删除成功', 0.5, () => {
          this.getOrganTree();
        });
      }
    });
  };
  // 新增/编辑
  addEditMenu = (per, txt) => {
    React.$ajax.postData('/api/sys/sys-org/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.childEle.handleCancel();
          this.getOrganTree();
        });
      }
    });
  };
  handleDelteMenu = (row) => {
    confirm({
      title: '提示',
      content: '确认删除当前机构吗',
      onOk: () => {
        this.delteMenu(row.id);
      },
      onCancel() {}
    });
  };
  render() {
    return (
      <div>
        <Card title="机构维护" bordered={false}>
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
              isBordered
              isRowSelects={false}
              isAllRows={false}></CustomTable>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default OrganList;
