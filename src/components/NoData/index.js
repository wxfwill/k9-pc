import React, { Component } from 'react';
import 'style/NoData/index.less';
import CustomTable from 'components/table/CustomTable';
const noImg = require('images/no-data.svg');

class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      TableHeder: [],
      tableObj: {},
    };
  }
  componentDidMount() {
    //如果没有数据返回，则默认显示10条空数据
    const tab = this.props.TableHeder;
    let dataSource = [];
    let TableHeder = [];
    if (tab && tab.length > 0) {
      let obj = {};
      tab.map((item) => {
        obj[item.dataIndex] = '--';
        TableHeder.push({ title: item.title, dataIndex: item.dataIndex });
      });
      for (let i = 0; i < 10; i++) {
        dataSource.push(util.DeepClone(obj));
      }
      dataSource.map((item, index) => {
        item.id = index + 1;
      });
      this.setState({
        dataSource: dataSource,
        TableHeder: TableHeder,
      });
    }
  }
  render() {
    return (
      <div>
        {this.props.TableHeder ? (
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id;
            }}
            dataSource={this.state.dataSource}
            loading={false}
            columns={this.state.TableHeder}
            isBordered={true}
            isRowSelects={false}
            isScroll={this.props.isScroll}
          ></CustomTable>
        ) : (
          <div className="no-data-wrap">
            <img className="no-logo" src={noImg} alt="无数据" />
            <div className="no-txt">暂无数据</div>
          </div>
        )}
      </div>
    );
  }
}

export default NoData;
