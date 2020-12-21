import React, { Component } from 'react';
import { Modal, Tree, message } from 'antd';
const { TreeNode } = Tree;
let test = [];
class TreeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleId: null,
      expandedKeys: [], // 默认展开节点
      autoExpandParent: true,
      checkedKeys: [], // 选中节点
      menuTree: [], // 数据源
      allNodeArr: [],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    // this.getMenuTree();
  }
  // 筛选所有子节点
  requestList = (data) => {
    data &&
      data.map((item) => {
        if (item.children && item.children.length > 0) {
          this.requestList(item.children);
        } else {
          test.push(item.id);
        }
      });
    this.setState({ allNodeArr: test });
    return test;
  };
  uniqueTree = (uniqueArr, Arr) => {
    let uniqueChild = [];
    for (var i in Arr) {
      for (var k in uniqueArr) {
        if (uniqueArr[k] === Arr[i]) {
          uniqueChild.push(uniqueArr[k]);
        }
      }
    }
    return uniqueChild;
  };
  // 菜单树
  getMenuTree = (id) => {
    React.$ajax.getData('/api/sys/sys-module/queryMenuTree', {}).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let resData = res.data ? res.data : [];
        let resArr = this.digui(resData);
        console.log(this.digui(resData));
        this.setState({ menuTree: resArr });

        // 筛选所有的子节点
        this.requestList(resArr);
        // 当前绑定的菜单
        this.getBindMenuId(id);
      }
    });
  };
  // 递归tree
  digui = (arr) => {
    if (arr && arr.length > 0) {
      arr.map((item) => {
        if (item.children && item.children.length > 0) {
          this.digui(item.children);
        } else {
          item.children = [];
        }
      });
    }
    return arr;
  };
  onExpand = (expandedKeys, obj) => {
    this.setState({
      expandedKeys,
      autoExpandParent: obj.expanded,
    });
  };
  onCheck = (checkedKeys, info) => {
    console.log('复选框');
    console.log(info);
    let newCheckKeyRes = [...checkedKeys, ...info.halfCheckedKeys];
    console.log(newCheckKeyRes);
    this.setState({ checkedKeys, newCheckKeyRes });
    // this.setState({ checkedKeys: checkedKeys.checked });
  };
  openModel = (row) => {
    this.setState({ visible: true, roleId: row.id }, () => {
      // this.getBindMenuId(id);
      this.setState({ roleName: `${row.roleName}-菜单列表` });
      this.getMenuTree(row.id);
    });
  };
  // 获取已绑定的菜单id
  getBindMenuId = (id) => {
    React.$ajax.getData('/api/sys/role-module/getMenuIdByRoleId', { roleId: id }).then((res) => {
      if (res && res.code == 0) {
        let resData = res.data ? res.data : [];
        // this.setState({ checkedKeys: resData, expandedKeys: resData });
        let costomChild = this.uniqueTree(resData, this.state.allNodeArr);
        this.setState({ checkedKeys: costomChild, expandedKeys: costomChild });
      }
    });
  };
  // 绑定菜单
  handleBindMenu = () => {
    let per = {
      menuId: this.state.newCheckKeyRes,
      // menuId: this.state.checkedKeys,
      roleId: this.state.roleId,
    };
    React.$ajax.postData('/api/sys/role-module/bindMenu', per).then((res) => {
      if (res && res.code == 0) {
        message.success('保存成功', 0.5, () => {
          this.handleCancel();
        });
      }
    });
  };
  handleOk = () => {
    console.log('ok');
    this.handleBindMenu();
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} {...item} />;
    });
  render() {
    return (
      <Modal
        wrapClassName="customModel"
        title="角色资源分配"
        visible={this.state.visible}
        width={'660px'}
        centered={false}
        destroyOnClose={true}
        maskClosable={false}
        okText={'保存'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {this.state.menuTree && this.state.menuTree.length > 0 ? (
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            // defaultExpandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            // selectedKeys={this.state.checkedKeys}
            checkStrictly={false}
            selectable={false}
            // defaultExpandAll
          >
            {this.renderTreeNodes(this.state.menuTree)}
          </Tree>
        ) : null}
      </Modal>
    );
  }
}

export default TreeModel;
