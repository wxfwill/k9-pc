import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;
class GlobalTaskType extends Component {
  constructor(props) {
    super(props);
    this.state = { taskType: [] };
  }
  componentDidMount() {
    this.getTaskData(this.props.taskCode);
  }
  // 获取任务类型
  getTaskData = (code) => {
    React.$ajax.getData('/api/integral-rule/queryRulesByRootCode', { rootCode: code }).then((res) => {
      if (res && res.code == 0) {
        this.setState({ taskType: res.data[0].children });
      }
    });
  };
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <FormItem label="奖励类型" {...thirdLayout} hasFeedback>
        {getFieldDecorator(this.props.taskLabel)(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
            {this.state.taskType.map((item) => {
              return (
                <Option key={item.id} value={item.ruleName}>
                  {item.ruleName}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
    );
  }
}

export default GlobalTaskType;
