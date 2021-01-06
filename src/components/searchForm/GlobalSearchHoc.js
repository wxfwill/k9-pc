import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;

const defaultParams = {};

const RequestHoc = (params = defaultParams) => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {teamData: [], userNameArr: [], allHouseData: []};
    }
    componentDidMount() {
      // 查询中队信息
      if (this.props.isTeamData) {
        this.queryAllTeam();
      }
      // 查询姓名
      if (this.props.isUserName) {
        this.queryGroupUser('');
      }
    }
    queryGroupUser = util.Debounce(
      (keyword) => {
        React.$ajax.common.queryGroupUser({keyword}).then((res) => {
          if (res.code == 0) {
            const resObj = res.data;
            const arr = [];
            for (const key in resObj) {
              if (resObj[key] && resObj[key].length > 0) {
                arr.push({
                  name: key,
                  children: resObj[key]
                });
              }
            }
            this.setState({userNameArr: arr});
          }
        });
      },
      300,
      false
    );
    queryAllTeam = () => {
      React.$ajax.common.queryAllGroups().then((res) => {
        if (res.code == 0) {
          const resObj = res.data;
          const newArr = [];
          for (const key in resObj) {
            const obj = {id: key, name: resObj[key]};
            newArr.push(obj);
          }
          this.setState({teamData: newArr});
        }
      });
    };
    handleSearch = () => {};
    selectHouseId = () => {};
    render() {
      return (
        <div>
          高阶函数用法
          <div>
            <WrappedComponent {...this.props} {...params}></WrappedComponent>
          </div>
        </div>
      );
    }
  };
};

export default RequestHoc;
