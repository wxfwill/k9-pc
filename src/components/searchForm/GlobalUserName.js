import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, TreeSelect, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const Option = Select.Option;
class GlobalName extends Component {
  constructor(props) {
    super(props);
    this.state = { teamData: [], userArr: [] };
  }
  componentDidMount() {
    // 查询中队信息
    if (this.props.isTeamData) {
      this.queryAllTeam();
    }
    // 查询姓名
    this.queryGroupUser('');
  }
  //   shouldComponentUpdate(nextProps, nextState) {
  //     if (nextState.teamData.length > 0 && nextState.userNameArr.length > 0) {
  //       return true;
  //     }
  //     return false;
  //   }
  queryGroupUser = util.Debounce(
    (keyword) => {
      React.$ajax.common.queryGroupUser({ keyword }).then((res) => {
        if (res.code == 0) {
          let resObj = res.data;
          let arr = [];
          for (let key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key],
              });
            }
          }
          this.setState({ userArr: arr });
        }
      });
    },
    300,
    false
  );
  handleTreeName = (val) => {
    console.log(val);
    console.log('valvalvalvalvalvalvalval');
  };
  handleFocus = () => {
    this.queryGroupUser('');
  };
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
      <FormItem label={this.props.labelName ? this.props.labelName + ':' : '姓名:'} {...thirdLayout}>
        {getFieldDecorator(this.props.userLabel, {
          initialValue: undefined,
        })(
          <TreeSelect
            showSearch
            dropdownClassName="cutomTreeSelect"
            style={{ width: '100%' }}
            filterTreeNode={() => true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            onSearch={(value) => {
              setFieldsValue({ [this.props.userLabel]: undefined });
              this.queryGroupUser(value);
            }}
            onFocus={this.handleFocus}
            onChange={this.handleTreeName}
          >
            {this.state.userArr && this.state.userArr.length > 0
              ? this.state.userArr.map((item) => {
                  return (
                    <TreeNode
                      className="innerTreeNode"
                      value={item.name}
                      title={item.name}
                      key={item.name}
                      selectable={false}
                    >
                      {item.children && item.children.length > 0
                        ? item.children.map((el) => {
                            return <TreeNode value={el.id} title={el.name} key={el.name} />;
                          })
                        : null}
                    </TreeNode>
                  );
                })
              : null}
          </TreeSelect>
        )}
      </FormItem>
    );
  }
}

export default GlobalName;
