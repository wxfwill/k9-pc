import React from 'react';
import {Link} from 'react-router-dom';
import {Table, message, Tag, Badge, Button, Icon, Menu, Dropdown} from 'antd';
import EditableTable from './EditableTable';
import Immutable from 'immutable';
require('style/view/common/deployTable.less');
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class PerformanceRuleTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      current: '',
      pageSize: 5,
      currPage: 1,
      dataSource: [],
      loading: false,
      filter: '',
      menuList: [],
      performanceId: ''
    };
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
      performanceId: e.key.split('_')[1]
    });
  };
  componentWillMount() {
    this.fetch({pageSize: 5, currPage: 1, yearMonth: ''});
  }

  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    React.$ajax.performance
      .performanceCheckType({...params, id: 1})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({
          menuList: res.data,
          current: 'id_' + res.data[0].id,
          performanceId: res.data[0].id,
          loading: false,
          pagination
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const {menuList, current, performanceId} = this.state;
    return (
      <div>
        <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
          {menuList.length > 0
            ? menuList.map((item) => <Menu.Item key={'id_' + item.id}>{item.name}</Menu.Item>)
            : null}
        </Menu>
        <div style={{marginTop: '16px'}}>
          <EditableTable performanceId={performanceId} />
        </div>
      </div>
    );
  }
}
export default PerformanceRuleTable;
