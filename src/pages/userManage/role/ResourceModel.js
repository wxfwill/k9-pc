import React, { Component } from 'react';
import { Modal, Tree, message } from 'antd';
const { TreeNode } = Tree;
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
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    // this.getMenuTree();
  }
  // 菜单树
  getMenuTree = (id) => {
    React.$ajax.getData('/api/sys/sys-module/queryMenuTree', {}).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let resData = res.data ? res.data : [];
        let resArr = this.digui(resData);
        console.log(this.digui(resData));
        this.setState({ menuTree: resArr });
        // resData.map()
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
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  };
  onCheck = (checkedKeys) => {
    console.log('复选框');
    console.log(checkedKeys);
    this.setState({ checkedKeys });
  };
  openModel = (id) => {
    this.setState({ visible: true, roleId: id }, () => {
      // this.getBindMenuId(id);
      this.getMenuTree(id);
    });
  };
  // 获取已绑定的菜单id
  getBindMenuId = (id) => {
    React.$ajax.getData('/api/sys/role-module/getMenuIdByRoleId', { roleId: id }).then((res) => {
      if (res && res.code == 0) {
        let resData = res.data ? res.data : [];
        this.setState({ checkedKeys: resData, expandedKeys: resData });
      }
    });
  };
  // 绑定菜单
  handleBindMenu = () => {
    let per = {
      menuId: this.state.checkedKeys,
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
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            selectable={false}
          >
            {this.renderTreeNodes(this.state.menuTree)}
          </Tree>
        ) : null}
      </Modal>
    );
  }
}

export default TreeModel;
