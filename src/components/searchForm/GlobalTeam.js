import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;
class GlobalTeam extends Component {
  constructor(props) {
    super(props);
    this.state = { teamData: [] };
  }
  componentDidMount() {
    this.queryAllTeam();
  }
  queryAllTeam = () => {
    React.$ajax.common.queryAllGroups().then((res) => {
      if (res.code == 0) {
        let resObj = res.data;
        let newArr = [];
        for (let key in resObj) {
          let obj = { id: key, name: resObj[key] };
          newArr.push(obj);
        }
        this.setState({ teamData: newArr });
      }
    });
  };
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <FormItem label="中队:" {...thirdLayout}>
        {getFieldDecorator(this.props.teamLabel)(
          <Select placeholder="请选择" allowClear>
            {this.state.teamData.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
    );
  }
}

export default GlobalTeam;
