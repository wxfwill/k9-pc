import React, { Component } from 'react';
import { Row, Col, Card, Button, Input, InputNumber, message, Popconfirm } from 'antd';
import NoData from 'components/NoData/index';
import 'style/pages/performance/TitleSetting/index.less';
class TitleSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      defaultData: [],
      keyIndex: 0,
      dataLen: 0,
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['绩效考核', '头衔设置'] });
    this.getAll();
  }
  //获取所有头衔
  getAll = () => {
    React.$ajax.getData('/api/integral-title/getAll').then((res) => {
      if (res && res.code == 0) {
        this.setState({
          dataSource: [...res.data],
          defaultData: [...res.data],
          dataLen: res.data.length,
        });
      }
    });
  };
  //添加头衔
  addTitles = () => {
    let { dataSource, keyIndex } = this.state;
    let rank = 1;
    if (dataSource && dataSource.length > 0) {
      let len = dataSource.length;
      if (len > 1) {
        rank = Number(dataSource[len - 2].end) + 1; //新增项默认在前一项的值上加1
      }
      dataSource.splice(len - 1, 0, {
        end: rank,
        start: rank,
        title: '',
        keyIndex: keyIndex,
        isNew: true,
      });
    } else {
      dataSource.push({ end: '', start: 1, title: '', keyIndex: keyIndex, isNew: true });
    }
    this.setState({
      dataSource: dataSource,
      keyIndex: keyIndex + 1,
      dataLen: dataSource.length,
    });
  };
  //删除头衔
  deleteTitles = (data) => {
    const { dataSource } = this.state;
    dataSource && dataSource.length > 0
      ? dataSource.map((item, i) => {
          if (item.isNew) {
            if (item.keyIndex == data.keyIndex) {
              dataSource.splice(i, 1);
            }
          } else {
            if (item.id == data.id) {
              dataSource.splice(i, 1);
            }
          }
        })
      : null;
    this.setState({
      dataSource: dataSource,
      dataLen: dataSource.length,
    });
  };
  //获取头衔等级名称
  getTitle = (e, data) => {
    this.getFormData(data, function (item) {
      item.title = e.target.value;
    });
  };
  //获取门槛最小值
  getStartMin = (e, data) => {
    this.getFormData(data, function (item) {
      item.start = e;
    });
  };
  //获取门槛最大值
  getEndMax = (e, data) => {
    this.getFormData(data, function (item) {
      item.end = e;
    });
  };
  getFormData = (data, callback) => {
    let { dataSource } = this.state;
    dataSource && dataSource.length > 0
      ? dataSource.map((item) => {
          if (item.isNew) {
            if (item.keyIndex == data.keyIndex) {
              callback(item);
            }
          } else {
            if (item.id == data.id) {
              callback(item);
            }
          }
        })
      : null;
    this.setState({
      dataSource: dataSource,
    });
  };
  //提交
  onSubmit = () => {
    let { dataSource, dataLen } = this.state;
    let isPass = true;
    dataSource.map((item, index) => {
      if (dataLen - 1 !== index) {
        if (!item.title || item.start == null || item.end == null) {
          isPass = false;
        }
      }
    });
    if (!isPass) {
      message.error('数据填写不完整，请填写完整之后提交！');
      return;
    }
    const len = dataSource.length;
    dataSource[len - 1].start = dataSource[len - 2].end + 1; //最后一项的最小值等于倒数第二项的最大值加1
    React.$ajax.postData('/api/integral-title/create', { titles: dataSource }).then((res) => {
      if (res && res.code == 0) {
        message.success('提交成功！');
        this.getAll();
      }
    });
  };
  // 取消
  onCancel = () => {
    const { defaultData } = this.state;
    this.setState({
      dataSource: [...defaultData],
      dataLen: defaultData.length,
      keyIndex: 0,
    });
  };
  render() {
    const { dataSource, dataLen } = this.state;
    return (
      <Row className="title-setting">
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            <table border="1" bordercolor="#e8e8e8" className="set-table">
              <thead>
                <tr>
                  <th>头衔等级名称</th>
                  <th>门槛</th>
                  <th>
                    <Button type="primary" icon="plus" onClick={this.addTitles}>
                      添加头衔
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSource && dataSource.length > 0 ? (
                  dataSource.map((item, index) => {
                    return (
                      <tr key={index + '' + item.keyIndex}>
                        <td>
                          <Input
                            value={item.title}
                            placeholder="请输入头衔等级名称"
                            onChange={(e) => this.getTitle(e, item)}
                            className="txt-c"
                          />
                        </td>
                        <td>
                          {dataLen - 1 == index ? (
                            '剩下'
                          ) : (
                            <div>
                              <InputNumber
                                min={1}
                                max={10000}
                                value={item.start}
                                onChange={(e) => this.getStartMin(e, item)}
                              />
                              <b> — </b>
                              <InputNumber
                                min={1}
                                max={10000}
                                value={item.end}
                                onChange={(e) => this.getEndMax(e, item)}
                              />
                              <span> 名</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {dataLen - 1 == index ? null : (
                            <Popconfirm title="确定删除?" onConfirm={() => this.deleteTitles(item)}>
                              <Button type="danger" size="small">
                                删除
                              </Button>
                            </Popconfirm>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3">
                      <NoData />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="btns">
              <Button type="primary" onClick={this.onSubmit}>
                确定
              </Button>
              <Popconfirm title="确定取消?" onConfirm={() => this.onCancel()}>
                <Button style={{ marginLeft: 16 }}>取消</Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default TitleSetting;
