import React, { Component } from 'react';
import { Row, Col, Card, Tooltip, Icon, Radio, Button, Form, Carousel, Table, message } from 'antd';
import Moment from 'moment';
import echart from 'echarts';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { transformOptions, EchartPie } from './chart/chartPie';
import { tMap } from 'components/view/common/map';
import TodayCard from './card/TodayCard';
import 'style/view/page/newIndex.less';
const list = [
  { label: '带班领导', value: '--' },
  {
    label: '值班',
    value: '--',
  },
  {
    label: '值班辅警',
    value: '--',
  },
  {
    label: '值班中队',
    value: '--',
  },
];
const dogList = [
  {
    title: '全部犬只',
    num: '--',
    bgColor: '#49a9ee',
    type: 'all',
  },
  {
    title: '出勤犬只',
    num: '--',
    bgColor: '#98d87d',
    type: 'duty',
  },
  {
    title: '服役犬只',
    num: '--',
    bgColor: '#ffd86e',
    type: 'service',
  },
];

const mockXl = [
  {
    bgColor: '#49a9ee',
    name: '训练场',
    num: '--',
    unit: '头',
    percent: '--%',
  },
  {
    bgColor: '#98d87d',
    name: '室内',
    num: '--',
    unit: '头',
    percent: '--%',
  },
];
const mockJb = [
  {
    bgColor: '#49a9ee',
    name: '已处理',
    num: '0',
    unit: '条',
    percent: '--%',
  },
  {
    bgColor: '#ffd86e',
    name: '待处理',
    num: '0',
    unit: '条',
    percent: '--%',
  },
];

const mockDf = [
  {
    name: '小明',
    score: '100',
    ranking: '1',
  },
  {
    name: '小网',
    score: '99',
    ranking: '2',
  },
  {
    name: '小网',
    score: '98',
    ranking: '2',
  },
  {
    name: '小网',
    score: '97',
    ranking: '2',
  },
];

class NewIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AreaDogNum: [],
      trainSituationData: mockXl,
      rankData: [],
      cureTips: [],
      cureCycleList: mockJb,
      dutyList: [],
      dogsInfo: dogList,
      dogPoints: [],
      zoomLevel: 0,
      mouseoverPoint: {},
      dogDrill: [],
      mouseover: false,
    };
    this.drillEchart = null;
    this.cureEchar = null;
    this.TMap = null;
    this.MarkList = [];
    this.MapLableArr = [];
    this.center = { lat: 22.557140481350014, lng: 114.08466517925262 };
    this.allDogs = 0;
    this.allDogsMapLabel = null;
    this.dogPoints = [];
    this.baseList = [];
    this.websocket = null;
  }

  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: [] });
    const { lat, lng } = this.center;

    this.drillEchart = echart.init(this.refs.drillCycle);
    this.drillEchart.setOption(transformOptions(mockXl));

    this.cureEchart = echart.init(this.refs.cureCycle);
    this.cureEchart.setOption(transformOptions(mockJb));
    this.TMap = new tMap({ labelText: '', lat, lng, zoom: 11, id: 'container' });
    this.getAreaDogs();
    this.getDogCureData();
    this.getTeamData();
    this.getDutyData();
    this.getDogsInfo();
    this.getTrainSituation();
    this.TMap.initEvents('zoom_changed', this.mapZoomChange);
    // if(!window.k9_webSocketServer) {
    //     this.websocket = new WebSocket(`ws://${config.host}/ws/webSocketServer?userId=${user.id}`);
    //     window.k9_webSocketServer = 'webSocketServer';
    // }
  }
  componentWillReceiveProps(nextProps) {
    const socketMsg = this.props.socketMsg;
  }
  socketOnmessage = (resData) => {
    const self = this;
    if (resData.code == 0 && resData.msgType == 'locationMap') {
      self.TMap.clear(self.dogPoints);
      self.TMap.clear(self.baseList);
      self.dogPoints = [];
      // self.setState({dogPoints: resData.data && resData.data.dogLocations})
      resData.data.dogOnlineList.forEach((item) => {
        let label = '';
        if (self.state.zoomLevel < 13) {
          label = self.drawMapLabel(item, `<div class="dogs_point"></div>`);
        } else {
          label = self.drawMapLabel(item, '<div class="dogs_img"></div>');
        }
        qq.maps.event.addDomListener(label, 'mouseover', (e) => self.mouseoverDogsPoint(e, item));
        qq.maps.event.addDomListener(label, 'mouseout', (e) => {
          self.setState({ mouseoverPoint: {}, mouseover: false });
        });

        self.dogPoints.push(label);
      });
      self.baseList = resData.data.bases.map((item) => {
        return self.drawMapLabel(
          item,
          item.dogNumber == 1
            ? ''
            : `<div class="dog_base"><div class="base_dec"><div>${item.areaName}</div><div>${
                item.dogNumber ? item.dogNumber : ''
              }</div></div></div>`
        );
      });
    }
  };
  componentWillUnmount() {
    // this.websocket.close();
    // this.websocket.send(JSON.stringify({msgType:"map_end"}));
  }
  mouseoverDogsPoint = (e, item) => {
    this.setState({
      mouseoverPoint: {
        pixel: {
          x: e.pixel.x - 50,
          y: e.pixel.y - 180,
        },
        item,
      },
      mouseover: true,
    });
  };
  mapZoomChange = (map) => {
    const { lat, lng } = this.center;
    const { AreaDogNum } = this.state;
    const zoomLevel = map.getZoom();
    this.setState({ zoomLevel });
    // map.setCenter(new qq.maps.LatLng(lat,lng));
    if (zoomLevel <= 10) {
      this.TMap.clear(this.MapLableArr);
      this.allDogsMapLabel = this.drawMapLabel({ areaName: '深圳市', dogNumber: this.allDogs, lat, lng });
    } else {
      this.TMap.clear([this.allDogsMapLabel]);
      AreaDogNum.forEach((item) => {
        let label = this.drawMapLabel(item);
        this.MapLableArr.push(label);
      });
    }
  };
  renderLabel = (list) => {
    return (
      list &&
      list.map((item, index) => {
        return (
          <div key={index + 'k9_label'} className="k9_label">
            <span>{item.label}:</span>
            <span>{item.value}</span>
          </div>
        );
      })
    );
  };
  renderDogCard = (list) => {
    return (
      list &&
      list.map((item, index) => {
        return (
          <Link to={{ pathname: '/app/dog/info', query: { type: item.type } }} key={index + 'doglist'}>
            <div className="k9_card" style={{ background: item.bgColor }}>
              <span className="k9_card_img"></span>
              <div className="card_title">{item.title}</div>
              <div className="dog_num">
                <span>{item.num}</span>
                <i>（头）</i>
              </div>
            </div>
          </Link>
        );
      })
    );
  };
  renderCarousel = (list) => {
    return (
      <Carousel autoplay vertical="true">
        {list &&
          list.map((item, index) => {
            return (
              <div key={index + 'Carousel'}>
                <p style={{ marginBottom: 5, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.p1}</p>
                <p style={{ marginBottom: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.p2}</p>
              </div>
            );
          })}
      </Carousel>
    );
  };
  getAreaDogs = () => {
    React.$ajax.home.dogAreaStatistics().then((res) => {
      if (res.code == 0) {
        const AreaDogNum = res.data;
        this.setState({ AreaDogNum });

        AreaDogNum.forEach((item) => {
          this.allDogs += item.dogNumber;
          let label = this.drawMapLabel(item);
          this.MapLableArr.push(label);
        });
      }
    });
    // httpAjax('post', config.apiUrl + '/api/overView/dogAreaStatistics').then((res) => {
    //   if (res.code == 0) {
    //     const AreaDogNum = res.data;
    //     this.setState({ AreaDogNum });

    //     AreaDogNum.forEach((item) => {
    //       this.allDogs += item.dogNumber;
    //       let label = this.drawMapLabel(item);
    //       this.MapLableArr.push(label);
    //     });
    //   } else {
    //     message.error('系统错误，稍后再试');
    //   }
    // });
  };
  getDogsInfo = () => {
    React.$ajax.home.getDogCountNum().then((res) => {
      if (res.code == 0) {
        const dogsInfo = [
          {
            title: '全部犬只',
            num: res.data.totalNum,
            bgColor: '#49a9ee',
            type: 'all',
          },
          {
            title: '出勤犬只',
            num: res.data.onDutyNum,
            bgColor: '#98d87d',
            type: 'duty',
          },
          {
            title: '服役犬只',
            num: res.data.serviceNum,
            bgColor: '#ffd86e',
            type: 'service',
          },
        ];
        this.setState({ dogsInfo });
      }
    });
    // httpAjax('post', config.apiUrl + '/api/dog/getDogCountNum').then((res) => {
    //   if (res.code == 0) {
    //     const dogsInfo = [
    //       {
    //         title: '全部犬只',
    //         num: res.data.totalNum,
    //         bgColor: '#49a9ee',
    //         type: 'all',
    //       },
    //       {
    //         title: '出勤犬只',
    //         num: res.data.onDutyNum,
    //         bgColor: '#98d87d',
    //         type: 'duty',
    //       },
    //       {
    //         title: '服役犬只',
    //         num: res.data.serviceNum,
    //         bgColor: '#ffd86e',
    //         type: 'service',
    //       },
    //     ];
    //     this.setState({ dogsInfo });
    //   }
    // });
  };
  getDogCureData = () => {
    React.$ajax.home.treatmentSituation().then((res) => {
      if (res.code == 0) {
        const { type1, type2, tips } = res.data;
        const cureCycleList = [
          {
            bgColor: '#49a9ee',
            name: '已处理',
            num: type1,
            unit: '条',
          },
          {
            bgColor: '#ffd86e',
            name: '待处理',
            num: type2,
            unit: '条',
          },
        ];
        let cureTips = [];
        tips.forEach((item, i) => {
          if (i % 2 == 0) {
            let obj = {
              p1: tips[i],
              p2: tips[i + 1] || ' ',
            };
            cureTips.push(obj);
          }
        });
        this.cureEchart.setOption(transformOptions(cureCycleList));
        this.setState({ cureCycleList, cureTips });
      }
    });

    // httpAjax('post', config.apiUrl + '/api/overView/treatmentSituation').then((res) => {
    //   if (res.code == 0) {
    //     const { type1, type2, tips } = res.data;
    //     const cureCycleList = [
    //       {
    //         bgColor: '#49a9ee',
    //         name: '已处理',
    //         num: type1,
    //         unit: '条',
    //       },
    //       {
    //         bgColor: '#ffd86e',
    //         name: '待处理',
    //         num: type2,
    //         unit: '条',
    //       },
    //     ];
    //     let cureTips = [];
    //     tips.forEach((item, i) => {
    //       if (i % 2 == 0) {
    //         let obj = {
    //           p1: tips[i],
    //           p2: tips[i + 1] || ' ',
    //         };
    //         cureTips.push(obj);
    //       }
    //     });
    //     this.cureEchart.setOption(transformOptions(cureCycleList));
    //     this.setState({ cureCycleList, cureTips });
    //   }
    // });
  };

  getTeamData = () => {
    React.$ajax.home.listTrainerRank().then((res) => {
      this.setState({ rankData: res.data });
    });
  };
  // /api/train/getTrainSituation
  getTrainSituation = () => {
    React.$ajax.home.getTrainSituation().then((res) => {
      if (res.code == 0) {
        const newData = [
          {
            bgColor: '#49a9ee',
            name: '基地内',
            num: res.data.indoorNum,
            unit: '头',
            percent:
              res.data.indoorNum == 0
                ? 0
                : (100 * (res.data.indoorNum / (res.data.indoorNum + res.data.outdoorNum))).toFixed(0) + '%',
          },
          {
            bgColor: '#98d87d',
            name: '基地外',
            num: res.data.outdoorNum,
            unit: '头',
            percent:
              res.data.outdoorNum == 0
                ? 0
                : (100 * (res.data.outdoorNum / (res.data.indoorNum + res.data.outdoorNum))).toFixed(0) + '%',
          },
        ];
        let cureTips = [];
        res.data.logs.forEach((item, i) => {
          if (i % 2 == 0) {
            let obj = {
              p1: res.data.logs[i],
              p2: res.data.logs[i + 1] || ' ',
            };
            cureTips.push(obj);
          }
        });
        this.drillEchart.setOption(transformOptions(newData));
        this.setState({ trainSituationData: newData, dogDrill: cureTips });
      }
    });
  };
  getDutyData = () => {
    React.$ajax.home.getTodayOnDuty().then((res) => {
      const dutyList = [
        { label: '带班领导', value: res.data.onDutyLeaderName },
        {
          label: '值班',
          value: res.data.onDutyUserName,
        },
        {
          label: '值班辅警',
          value: res.data.onDutyPoliceName,
        },
        {
          label: '值班中队',
          value: res.data.onDutyTeam,
        },
      ];
      this.setState({ dutyList });
    });
  };
  drawMapLabel = (item, content) => {
    return new qq.maps.Label({
      content: content || this.drawPointStyle(item.areaName, item.dogNumber),
      map: this.TMap.map,
      offset: new qq.maps.Size(-40, 3),
      position: new qq.maps.LatLng(item.lat, item.lng),
      style: {
        border: 'none',
        background: 'transparent',
      },
      visible: true,
      zIndex: 1000,
    });
  };
  drawPointStyle = (areaName, dogNumber) => {
    return `<div class="map_point_content">
        <div class="map_bg"></div>
        <div class="map_point">${areaName}<br />${dogNumber} (头)</div>
        </div>`;
  };
  render() {
    const sorceColor = { 1: 'red', 2: 'orange', 3: '#ffce08' };
    const mouseoverColumns = [
      {
        dataIndex: 'label',
        key: Math.random(),
      },
      {
        dataIndex: 'value',
        key: Math.random(),
      },
    ];
    const columns = [
      {
        title: '训导员',
        dataIndex: 'userName',
        key: 'userName',
        rowClassName: 'tab_header',
      },
      {
        title: '综合得分',
        dataIndex: 'totalScore',
        key: 'key',
        rowClassName: 'tab_row',
      },
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'userId',
        rowClassName: 'tab_row',
        render: (a, b, i) => {
          return <span style={{ color: sorceColor[i + 1], fontWeight: 800 }}>{i + 1}</span>;
        },
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const {
      rankData,
      cureCycleList,
      cureTips,
      dutyList,
      dogsInfo,
      mouseoverPoint,
      dogDrill,
      mouseover,
      trainSituationData,
    } = this.state;
    const mouseOverData = [
      {
        key: 1,
        label: '犬名',
        value: mouseoverPoint.item && mouseoverPoint.item.name,
      },
      {
        key: 2,
        label: 'ID',
        value: mouseoverPoint.item && mouseoverPoint.item.number,
      },
      {
        key: 3,
        label: '训导员',
        value: mouseoverPoint.item && mouseoverPoint.item.trainerName,
      },
      {
        key: 4,
        label: '单位',
        value: mouseoverPoint.item && mouseoverPoint.item.subordinateArea,
      },
    ];
    return (
      <div className="newIndex">
        <div className="newindex-top">
          <div style={{ width: '360px' }}>
            {/* <Link to="/archivew">
              <Button type="primary">跳转档案</Button>
            </Link> */}

            <Card
              title="今日值班"
              extra={Moment().format('YYYY-MM-DD')}
              style={{ width: 360, marginBottom: '10px' }}
              bodyStyle={{ padding: '10px 24px' }}
            >
              {this.renderLabel(dutyList)}
            </Card>
            <div>{this.renderDogCard(dogsInfo)}</div>
          </div>
          <div className="index_map">
            <div className="map_title">
              <div style={{ marginLeft: '40px' }}>犬只分布情况</div>
              <div style={{ marginRight: '40px' }}>
                <Button.Group>
                  <Button>全部犬只</Button>
                  <Button>园区情况</Button>
                </Button.Group>
              </div>
            </div>
            <div className="map_dom" id="container"></div>
            <div
              className="mouseover_dev"
              style={{
                display: mouseover ? 'block' : 'none',
                left: `${mouseoverPoint.pixel && mouseoverPoint.pixel.x}px`,
                top: `${mouseoverPoint.pixel && mouseoverPoint.pixel.y}px`,
              }}
            >
              {mouseoverPoint.item ? (
                <img src={`${config.apiUrl}/api/dog/img?id=${mouseoverPoint.item && mouseoverPoint.item.id}`} />
              ) : (
                ''
              )}

              <Table
                rowKey={(row) => {
                  return 'key_' + row.key;
                }}
                pagination={false}
                rowClassName="mo_table"
                showHeader={false}
                dataSource={mouseOverData}
                columns={mouseoverColumns}
              />
            </div>
          </div>
        </div>
        <div className="index_footer">
          <Card title="警犬训练概况" bodyStyle={{ padding: '0 24px' }}>
            {EchartPie(trainSituationData)}
            {/*提示信息 {this.renderCarousel(dogDrill)}*/}
          </Card>
          <Card title="犬病诊疗概况" bodyStyle={{ padding: '0 24px' }}>
            {EchartPie(cureCycleList, 'cureCycle')}
            {/*   {this.renderCarousel(cureTips)}*/}
          </Card>
          <Card title="绩效考核排名" bodyStyle={{ padding: '0' }}>
            <div style={{ height: 254, overflow: 'auto', padding: '0 24px', marginbottom: 1 }}>
              <Table
                rowKey={(row) => {
                  return 'key_' + row.userId;
                }}
                pagination={false}
                columns={columns}
                dataSource={rankData}
              />
            </div>
          </Card>
          <Card title="最新消息" bodyStyle={{ padding: '0 24px' }}>
            <TodayCard />
          </Card>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg,
  token: state.loginReducer.token,
});
export default connect(mapStateToProps)(NewIndex);
