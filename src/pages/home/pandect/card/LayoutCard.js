import React, {Component} from 'react';
import {Row, Col, Card, Tooltip, Button} from 'antd';
import httpAjax from 'libs/httpAjax';
const ButtonGroup = Button.Group;
require('style/view/home/layoutCard.less');
class LayoutCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isArea: true,
      data: []
    };
  }
  componentWillMount() {
    this.getData(1);
  }
  getData(type) {
    httpAjax('post', config.apiUrl + '/api/overView/dogStatistics', {queryType: type})
      .then((res) => {
        const {code, data} = res;
        if (code == 0) {
          this.setState({
            data: data
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleCut(cate) {
    switch (cate) {
      case 'cate':
        this.setState(
          {
            isArea: false
          },
          () => {
            this.getData(2);
          }
        );
        break;
      case 'area':
        this.setState(
          {
            isArea: true
          },
          () => {
            this.getData(1);
          }
        );
        break;
      default:
        break;
    }
  }
  getExtra() {
    const _this = this;
    return (
      <div className="filter-wrapper">
        <span className={this.state.isArea ? 'active' : ''} onClick={() => this.handleCut('area')}>
          按区域
        </span>
        <span className={this.state.isArea ? '' : 'active'} onClick={() => this.handleCut('cate')}>
          按犬种
        </span>
      </div>
    );
  }
  render() {
    return (
      <div className="dog-lay">
        <Card
          title={<span className="card-title">犬只分布图</span>}
          bordered={false}
          extra={this.getExtra()}
          className="layout-card">
          <div className="thead">
            {this.state.isArea ? <span>区域</span> : <span>犬种</span>}
            <span>犬只数</span>
          </div>
          <ul>
            {this.state.data.map((item, index) => {
              return (
                <li key={index + 'list'} className={index % 2 == 0 ? 'odd' : 'even'}>
                  <span>{item.thead}</span>
                  <span>{item.dogNumber}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    );
  }
}
export default LayoutCard;
