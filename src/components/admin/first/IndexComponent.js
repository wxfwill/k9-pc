import React, {Component} from 'react';
import {Breadcrumb} from 'antd';

class IndexComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
        <div style={{padding: 24, background: '#fff', minHeight: 360}}>444Bill is a cat.</div>
      </div>
    );
  }
}
export default IndexComponent;
