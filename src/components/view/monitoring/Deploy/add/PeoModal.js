import React, {Component} from 'react';
import {Row, Col, Radio, Form, Input, Modal, Transfer, Button, notification, Tag, Switch, Icon, Select} from 'antd';
import {firstLayout, secondLayout, thirdLayout} from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;
require('style/view/monitoring/peoModal.less');

class PeoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isclose: true, //是否关闭人员明细
      userData: [], //人员数据
      targetKeys: this.props.targetKeys, //选中的人员id
      BranchArr: [], //分局数组
      TeamArr: [],
      recardTags: [], //记录当前点击项是否点过
      limitBranch: true
    };
  }
  componentWillMount() {
    this.getSelectData();
  }
  componentDidMount() {
    this.getData();
  }
  getSelectData() {
    const _this = this;
    const typeOption = httpAjax('post', config.apiUrl + '/api/userCenter/getAllAgency');
    const LevelOption = httpAjax('post', config.apiUrl + '/api/userCenter/getAllPatrolsTeam');
    Promise.all([typeOption, LevelOption])
      .then((resArr) => {
        _this.setState({
          BranchArr: resArr[0].data,
          TeamArr: resArr[1].data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //取数据
  getData(address = '/api/userCenter/getCombatStaff') {
    this.setState({userData: []});
    httpAjax('post', config.apiUrl + address)
      .then((res) => {
        this.changeUserData(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  changeUserData(res) {
    const userData = [];
    const keyMark = 0;
    res.data.length > 0 &&
      res.data.forEach((item, index) => {
        Array.prototype.push.call(userData, {
          key: keyMark + item.id,
          name: item.name,
          description:
            typeof item.remark === 'undefined' || item.remark == '' || typeof item.remark === 'object'
              ? ''
              : `(${item.remark})`,
          chosen: Math.random() * 2 > 1
        });
      });
    this.setState({userData});
  }
  //确认按钮
  onOk() {
    const {onCreate} = this.props;
    const _this = this;
    const peopleMsg = [];
    this.state.userData.forEach((item, index) => {
      _this.state.targetKeys.forEach((items, indexs) => {
        if (items == item.key) {
          Array.prototype.push.call(peopleMsg, {name: item.name, key: item.key});
        }
      });
    });
    onCreate(peopleMsg);
  }
  //穿梭框中间按按钮
  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({targetKeys});
  };
  //重置按钮
  handleReset() {
    this.setState(
      {
        targetKeys: []
      },
      function () {
        this.getData('/api/userCenter/getCombatStaff');
      }
    );
  }
  //底部渲染按钮
  renderFooter = () => {
    return (
      <Button size="small" style={{float: 'right', margin: 5}} onClick={this.handleReset.bind(this)}>
        重置
      </Button>
    );
  };
  //是否可点
  isDisabled(boolean) {
    const userData = [];
    this.state.userData.forEach((item, index) => {
      Array.prototype.push.call(userData, {...item, disabled: boolean});
    });
    this.setState({userData});
  }
  closePsrsonMsg(key, personArr) {
    const _this = this;
    this.setState(
      {
        isclose: true
      },
      function () {
        typeof key === 'undefined' ? '' : notification.close(key);
        if (typeof personArr !== 'undefined') {
          _this.setState({
            targetKeys: Array.from(new Set(_this.state.targetKeys.concat(personArr)))
          });
        }
        _this.isDisabled(false);
      }
    );
  }
  close = () => {
    this.closePsrsonMsg();
  };
  closeTag(event) {
    console.log(event.target.parentNode.getAttribute('data-id'));
  }
  renderItem(item) {
    return {
      label: `${item.name}${item.description}`, // for displayed item
      value: item.description // for title and filter matching
    };
  }
  handleSwitchChange(checked) {
    this.setState({
      limitBranch: checked
    });
  }
  SelectBranch(value, option) {
    this.selectChangeData({address: '/api/userCenter/getUserByAgency', paramsKey: 'agencyId', paramsValue: value});
  }
  SelectTeam(value, option) {
    this.selectChangeData({address: '/api/userCenter/getUserByPatrolsTeam', paramsKey: 'teamId', paramsValue: value});
  }
  selectChangeData(params) {
    httpAjax('post', config.apiUrl + params.address, {[params.paramsKey]: params.paramsValue})
      .then((res) => {
        this.changeUserData(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  filterOption = (inputValue, option) => {
    return option.name.indexOf(inputValue) > -1;
  };

  render() {
    const {visible, onCancel, form, defaultUserIds} = this.props;
    return (
      <Modal
        visible={visible}
        title="添加作战人员"
        style={{top: 200}}
        okText="确定"
        onCancel={onCancel}
        onOk={this.onOk.bind(this)}
        width={658}
        maskClosable={false}
        className="PeoModal">
        <Form layout="vertical">
          <Row gutter={24}>
            <Col xxl={10} xl={10} lg={10} md={24} sm={24} xs={24}>
              <FormItem label={'分局：'} {...secondLayout}>
                <Select
                  placeholder="选择分局"
                  disabled={!this.state.limitBranch}
                  onSelect={this.SelectBranch.bind(this)}>
                  {this.state.BranchArr.length > 0 &&
                    this.state.BranchArr.map((item, index) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Col>
            <Col xxl={10} xl={10} lg={10} md={24} sm={24} xs={24}>
              <FormItem label={'分队：'} {...secondLayout}>
                <Select placeholder="选择分队" disabled={this.state.limitBranch} onSelect={this.SelectTeam.bind(this)}>
                  {this.state.TeamArr.length > 0 &&
                    this.state.TeamArr.map((item, index) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={24} sm={24} xs={24}>
              <FormItem {...secondLayout} className="fl-r">
                <Switch
                  checkedChildren="分局"
                  unCheckedChildren="分队"
                  defaultChecked
                  className="fl-r"
                  onChange={this.handleSwitchChange.bind(this)}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Transfer
          dataSource={this.state.userData}
          showSearch
          filterOption={this.filterOption}
          listStyle={{
            width: 250,
            height: 300
          }}
          operations={['确 认', '排 除']}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={this.renderItem.bind(this)}
          footer={this.renderFooter}
          //onSelectChange={this.selectChange.bind(this)}
        />
      </Modal>
    );
  }
}
export default PeoModal;
