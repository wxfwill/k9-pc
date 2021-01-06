import React, {Component} from 'react';
import {Table, Button, Tag, Badge} from 'antd';
import {Link} from 'react-router-dom';
import moment from 'moment';
const localSVG = require('images/banglocation.svg');

const columns = [
  {
    dataIndex: 'userName',
    key: 'userName'
  }
];

class TaskInfoListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInfo: {}
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.setState({taskInfo: this.props.getTaskInfo()});
  }

  render() {
    if (!this.state.taskInfo) {
      return <div></div>;
    }

    var ti = this.state.taskInfo;
    console.log(ti);
    return (
      <div style={{paddingLeft: 18}}>
        <p>
          <span>区域位置：</span>
          {ti.location || ti.patrolsLocation}
        </p>
        <p>
          <span>任务名称：</span>
          {ti.taskName}
        </p>
        <p>
          <span>上报人员：</span>
          {ti.reportUserName || '--'}
        </p>
        <p>
          <span>发布时间：</span>
          {ti.publishDate ? moment(ti.publishDate).format('YYYY-MM-DD HH:mm:ss') : '--'}
        </p>
        <p>
          <span>发布人员：</span>
          {ti.operator ? ti.operator : '--'}
        </p>
        <p>
          <span>任务内容：</span>
          {ti.taskContent}
        </p>
      </div>
    );
  }
}
export default TaskInfoListView;
