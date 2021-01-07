import React, {Component} from 'react';
import {Menu, Dropdown, Layout, Icon, Input, Checkbox} from 'antd';
import classNames from 'classnames';
import HeaderComponent from 'components/HeaderComponent';

require('style/index.less');
require('style/pages/GridDisplayMap.less');

const CheckboxGroup = Checkbox.Group;

const defaultCheckedList = ['1', '2'];

class GridMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      dropList: [
        {key: null, name: '全部区域'},
        {key: '1', name: '网格1'},
        {key: '2', name: '网格2'},
        {key: '3', name: '网格3'},
        {key: '4', name: '网格4'},
        {key: '5', name: '网格5'}
      ],
      selectName: '全部区域',
      selecId: ''
    };
    this.plainOptions = [
      {label: this.getListTxt(), value: '1'},
      {label: this.getListTxt(), value: '2'},
      {label: this.getListTxt(), value: '3'}
    ];
  }
  handleDrop = (item) => {
    console.log(item);
    console.log(item.key);
    this.setState({selectName: item.item.props.name, selecId: item.key});
  };
  dropMenu = () => {
    return this.state.dropList && this.state.dropList.length > 0 ? (
      <Menu onClick={this.handleDrop} selectable>
        {this.state.dropList.map((item) => {
          return (
            <Menu.Item key={item.key} name={item.name}>
              <span className="cursor">{item.name}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    ) : null;
  };
  onChange = (checkedList) => {
    console.log(checkedList);
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.plainOptions.length,
      checkAll: checkedList.length === this.plainOptions.length
    });
  };
  onCheckAllChange = (e) => {
    console.log(e);
    const arr = [];
    this.plainOptions.map((item) => {
      arr.push(item.value);
    });
    this.setState({
      checkedList: e.target.checked ? arr : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };
  getListTxt = () => {
    return (
      <div className="user-list">
        <img src={require('images/one.jpg')} alt="user" className="user" />
        <div className="user-con">
          <p className="desc">
            <span className="name">
              谢灵运 <i>队长</i>
            </span>
            <span className="hb">
              海拔：<i>449m</i>
            </span>
          </p>
          <p className="time">
            最新定位时间:
            <i>2020-12-21 14:29:24</i>
          </p>
        </div>
      </div>
    );
  };
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
  handleChangeInput = (event) => {
    const val = event.target;
    console.log(val.value);
    this.queryGroupUser('');
  };
  async handleChangeNumber(e) {
    e.persist();
    return e;
  }
  render() {
    return (
      <Layout className={classNames('indexComponent')} style={{height: '100%'}}>
        <HeaderComponent isShowCollaps={false} />
        <Layout style={{height: 'calc(100% - 64px)'}}>
          <div className="rootMap">
            <div className="leftMap" id="rootMap">
              两步路地图展示
            </div>
            <div className="rightOption">
              <div className="dropdown-wrap">
                <Dropdown overlay={this.dropMenu()} trigger={['click']} placement="bottomCenter">
                  <span className="cursor">
                    <i className="text">{this.state.selectName}</i>
                    <Icon type="down" />
                  </span>
                </Dropdown>
                <Input
                  className="input-wrap"
                  placeholder="请输入姓名或警号搜索"
                  prefix={<Icon type="search" style={{color: '#BBBCBD'}} />}
                  onChange={(event) => this.handleChangeNumber(event).then(this.handleChangeInput)}
                  allowClear></Input>
              </div>

              <div className="all-checkout">
                <div>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}>
                    显示轨迹(默认全部)
                  </Checkbox>
                </div>
                <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default GridMap;
