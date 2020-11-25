import React, { Component } from 'react';
import CustomTable from 'components/table/CustomTable';
import { Card, Button, Popconfirm } from 'antd';
import AddEditModel from './AddEditModel';

const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];
class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: '新增菜单',
    };
  }
  handleAdd = (e) => {
    e.stopPropagation();
    this.setState({ type: '新增菜单' }, () => {
      this.childEle.openModel();
    });
    console.log('新增');
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['用户管理', '菜单列表'] });
  }
  handleEdit = (e) => {
    e.stopPropagation();
    this.setState({ type: '编辑菜单' }, () => {
      this.childEle.openModel();
    });
  };
  handleConfirm = (e) => {
    e.stopPropagation();
    console.log('确认了===');
  };
  onCancel = (e) => {
    e.stopPropagation();
  };
  render() {
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '菜单类型',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '排序',
        dataIndex: 'key',
        key: 'address',
      },
      {
        title: '菜单地址',
        dataIndex: 'address',
        width: '30%',
        key: 'address1',
      },
      {
        title: '操作',
        dataIndex: 'hhh',
        width: '30%',
        key: 'hhh',
        render: () => {
          return (
            <div>
              <Button type="primary" size="small" onClick={this.handleAdd}>
                新增
              </Button>
              <Button type="primary" size="small" style={{ margin: '0 10px' }} onClick={this.handleEdit}>
                编辑
              </Button>
              <Popconfirm
                placement="top"
                title="确认删除吗？"
                onConfirm={this.handleConfirm}
                onCancel={this.onCancel}
                onClick={(e) => e.stopPropagation()}
                okText="确定"
                cancelText="取消"
              >
                <Button type="danger" size="small">
                  删除
                </Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Card title="机构维护" bordered={false}>
          <AddEditModel onRef={(ref) => (this.childEle = ref)} type={this.state.type} />
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.key;
            }}
            dataSource={data}
            loading={this.state.loading}
            columns={columns}
            isBordered={true}
            isRowSelects={false}
            isAllRows={true}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}

export default MenuList;
