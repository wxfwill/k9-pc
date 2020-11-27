import React, { Component } from 'react';
import { message } from 'antd';

const defaultParam = {};
const ExportFileHoc = (params = defaultParam) => (CustomCom) => {
  return class extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {}
    exportExcel = (url, data) => {
      if (!url) {
        throw new Error('url是必填参数哦');
      }
      React.$ajax.fileDataPost(url, data).then((res) => {
        if (res.type && res.type.includes('application/json')) {
          let reader = new FileReader();
          reader.onload = (e) => {
            if (e.target.readyState == 2) {
              let res1 = {};
              res1 = JSON.parse(e.target.result);
              res1 && message.info(res1.msg);
            }
          };
          reader.readAsText(res);
        } else {
          util.createFileDown(res);
        }
      });
    };
    render() {
      return <CustomCom {...this.props} exportExcel={this.exportExcel}></CustomCom>;
    }
  };
};

export default ExportFileHoc;
