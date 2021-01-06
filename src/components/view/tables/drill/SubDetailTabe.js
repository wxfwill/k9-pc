import React, {Component} from 'react';
import classnames from 'classnames';
import {Collapse, Icon, Tag, Row, Col, Table, Card} from 'antd';
import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;

class CureDetailTabl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      baseData: [],
      title: '警犬实战扑咬与防暴训练'
    };
  }
  componentWillMount() {
    const {caption} = this.props;
    this.fetch(caption);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
  }
  handleShow() {
    this.props.handleShow();
  }
  fetch(params) {
    React.$ajax
      .postData('/api/trainingSubject/getTrainingSubjectById', {id: params})
      .then((res) => {
        this.setState({
          loading: false,
          baseData: res.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderhead(caption) {
    if (caption.length > 0) {
      const MonthYear = caption.split('_')[1];
      return (
        <div>
          <Icon type="calendar" />
          &nbsp;&nbsp;&nbsp;
          <Tag color="#2db7f5">{MonthYear}</Tag>
        </div>
      );
    }
  }
  baseHeader() {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">警犬实战扑咬与防暴训练</Tag>
      </div>
    );
  }
  render() {
    const {changeLeft, caption} = this.props;
    const {baseData, loading} = this.state;
    const dataSource = [];
    dataSource.push(baseData);
    const date = new Date(baseData.dogBirthday);
    const YMD = date.toLocaleString().split(' ')[0];
    //let HMS = date.toString().split(' ')[4];
    const morbidityTime = YMD; //+' '+HMS;
    const recordsColumns = [
      {
        title: '训练名称',
        dataIndex: 'trainSubjectName',
        key: 'trainSubjectName'
      },
      {
        title: '训练等级',
        dataIndex: 'trainLevel'
      },
      {
        title: '训练目标',
        dataIndex: 'trainTarget'
      },
      {
        title: '训练内容',
        dataIndex: 'trainContent',
        render: (text) => {
          return <img className="detail-table-pc" src={`/api/trainingSubject/img?trainContent=` + text} />;
        }
      },
      {
        title: '指定动作',
        dataIndex: 'trainStandard'
      }
    ];
    return (
      <div className={classnames('off-detail')} style={{left: changeLeft ? '360px' : '100%'}}>
        <div className="detail-table">
          <Card title={this.state.title}>
            {/*<span>创建时间:20180201</span>*/}
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel showArrow={false} header={this.baseHeader()} key="1">
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Table
                      rowKey="id"
                      loading={loading}
                      columns={recordsColumns}
                      dataSource={dataSource}
                      pagination={false}
                      bordered
                      rowKey="id"
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Card>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right" />
        </span>
      </div>
    );
  }
}

export default CureDetailTabl;

// WEBPACK FOOTER //
// ./src/components/view/tables/drill/SubDetailTabe.js
