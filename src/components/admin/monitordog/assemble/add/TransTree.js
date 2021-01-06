import React, {Component} from 'react';
import httpAjax from 'libs/httpAjax';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

class TransTree extends React.Component {
  state = {
    treeData: [
      {title: 'Expand to load', key: '0'},
      {title: 'Expand to load', key: '1'},
      {title: 'Tree Node', key: '2', isLeaf: true}
    ]
  };
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          {title: 'Child Node', key: `${treeNode.props.eventKey}-0`},
          {title: 'Child Node', key: `${treeNode.props.eventKey}-1`}
        ];
        this.setState({
          treeData: [...this.state.treeData]
        });
        resolve();
      }, 1000);
    });
  };
  renderTreeNodes = (data) => {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      console.log(item.name);
      return <TreeNode title={item.name} key={index} dataRef={item} />;
    });
  };
  render() {
    return (
      <Tree loadData={this.onLoadData} defaultExpandAll={false}>
        {[this.props.treeData].map((item, index) => {
          return <TreeNode title={item.name} key={Math.random()} dataRef={item} />;
        })}
      </Tree>
    );
  }
}

export default TransTree;
