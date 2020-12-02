import React, { Component } from 'react';
import { DatePicker, Form, Icon } from 'antd';
import { getSingle } from './util';

import Cover from './components/Cover'; //封面
import BackCover from './components/BackCover'; //封底
import Catalogue from './components/Catalogue'; //目录
import PerformanceAssessment from './components/PerformanceAssessment'; //绩效考核
import Transport from './components/Transport'; //工作用车
import AttendanceCar from './components/AttendanceCar'; //出勤用车
import AttendanceManagement from './components/AttendanceManagement'; //考勤管理-请假/离深/补休
import RewardItems from './components/RewardItems'; //奖励事项
import DailyInformation from './components/DailyInformation'; //日报信息
import DogFoodApply from './components/DogFoodApply'; //犬粮申请
import AidRecipients from './components/AidRecipients'; //通用物资领用
import BlankPage from './components/BlankPage'; //最后一页
import Navigation from './components/Navigation'; //悬浮目录
import SearchDate from './components/SearchDate'; //搜索日期

import moment from 'moment';

import 'style/pages/archives/index.less';

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const nowDate = new Date();
const cYear = nowDate.getFullYear(); //当前年份
const cMonth = nowDate.getMonth() + 1; //月份
const cDay = nowDate.getDate(); //日
const cYMD = cYear + '-' + cMonth + '-' + cDay; //当前日期
const defSatrtDate = cYear + '-01-01 00:00:00'; //默认开始时间
const defEndDate = cYMD + ' 23:59:59'; //默认结束时间

const dateFormat = 'YYYY-MM-DD';
const dateArr = [moment(defSatrtDate, dateFormat), moment(defEndDate, dateFormat)];

class Archivew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: defSatrtDate,
      endDate: defEndDate,
      userId: 1,
      allInforList: [{ bookName: '封面' }, { bookName: '目录' }], //所有信息列表
      bookList: [], //翻页集合
      atLeft: [],
      numbAdd: 1,
    };
  }
  componentDidMount() {
    const userId = util.urlParse(this.props.location.search).userId;
    this.setState({ userId: userId ? userId : 1 }, () => {
      this.getAllInfor();
    });
  }
  //获取时间
  getPicker = (e) => {
    if (e && e.length > 0) {
      this.setState(
        {
          startDate: e[0].format('YYYY-MM-DD') + ' ' + '00:00:00',
          endDate: e[1].format('YYYY-MM-DD') + ' ' + '23:59:59',
        },
        () => {
          let { numbAdd } = this.state;
          if (numbAdd > 1) {
            this.setState(
              {
                allInforList: [{ bookName: '封面' }, { bookName: '目录' }], //所有信息列表
                bookList: [], //翻页集合
                numbAdd: 1,
                atLeft: [],
              },
              () => {
                this.getAllInfor();
              }
            );
          }
        }
      );
    }
  };
  //日期转换成时间戳
  getTime = (time) => {
    const date = new Date(time);
    return date.getTime();
  };
  //获取绩效考核详情列表
  getSelfEvaluationList = (startDate, endDate, userId) => {
    const reqObj = {
      repDateStart: startDate, //上报时间始
      repDateEnd: endDate, //上报时间止
      userId: [userId], //用户ID(list)
    };
    return React.$ajax.postData('/api/performanceAssessment/getSelfEvaluationList', reqObj);
  };
  //获取工作用车信息
  pageDocCarUseReportInfo = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/report/pageDocCarUseReportInfo', reqObj);
  };
  //获取出勤用车信息
  pageDocAttendanceCar = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/report/pageDocAttendanceCar', reqObj);
  };
  //获取奖励详情列表
  getRewardSyncList = (startDate, endDate, userId) => {
    const reqObj = {
      startDate: startDate, //开始时间
      endDate: endDate, //结束时间
      userIds: [userId], //用户Id（list）
    };
    return React.$ajax.postData('/api/reward/getRewardSyncList', reqObj);
  };
  //获取日报信息
  pageDocDailyWork = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/report/pageDocDailyWork', reqObj);
  };
  //获取请假/离深/补休
  exportLeaveAfterSyncInfo = (startDate, endDate, userId) => {
    const reqObj = {
      startDate: startDate, //开始时间
      endDate: endDate, //结束时间
      userIds: [userId], //用户ID
    };
    return React.$ajax.postData('/api/leaveAfterSync/getLeaveAfterSyncList', reqObj); //getLeaveAfterSyncList
  };

  //获取所有的信息
  getAllInfor = () => {
    let { startDate, endDate, userId } = this.state;
    startDate = this.getTime(startDate);
    endDate = this.getTime(endDate);
    let SelfEvaluationList = [], //绩效考核
      DocCarUseReportInfo = [], //工作用车
      DocAttendanceCar = [], //出勤用车
      RewardSyncList = [], //奖励事项
      DocDailyWork = [], //日报信息
      LeaveAfterSyncInfo = [], //请假/离深/补休
      DogFoodInfo = [
        {
          bookName: '犬粮申请',
          noData: true,
          $indexes: true,
        },
      ], //犬粮申请
      AidRecipientsInfo = [
        {
          bookName: '通用物资领用',
          noData: true,
          $indexes: true,
        },
      ], //通用物资领用
      BackCoverArr = [{ bookName: '封底' }],
      BlankPageArr = [{ bookName: '最后一页' }];
    Promise.all([
      this.getSelfEvaluationList(startDate, endDate, userId), //获取绩效考核详情
      this.pageDocCarUseReportInfo(startDate, endDate, userId), //获取工作用车信息
      this.pageDocAttendanceCar(startDate, endDate, userId), //获取出勤用车信息
      this.getRewardSyncList(startDate, endDate, userId), //获取奖励详情列表
      this.pageDocDailyWork(startDate, endDate, userId), //获取日报信息
      this.exportLeaveAfterSyncInfo(startDate, endDate, userId), //获取请假/离深/补休
    ]).then((res) => {
      if (res && res.length > 0) {
        res.map((resObj, index) => {
          if (resObj && resObj.code == 0) {
            switch (index) {
              case 0:
                console.log(resObj, '绩效考核');
                SelfEvaluationList = getSingle(resObj.data, '绩效考核');
                break;
              case 1:
                console.log(resObj, '工作用车');
                DocCarUseReportInfo = getSingle(resObj.data.list, '工作用车');
                break;
              case 2:
                console.log(resObj, '出勤用车');
                DocAttendanceCar = getSingle(resObj.data.list, '出勤用车');
                break;
              case 3:
                console.log(resObj, '奖励事项');
                RewardSyncList = getSingle(resObj.data, '奖励事项');
                break;
              case 4:
                console.log(resObj, '日报信息');
                DocDailyWork = getSingle(resObj.data.list, '日报信息');
                break;
              case 5:
                console.log(resObj, '请假/离深/补休');
                LeaveAfterSyncInfo = getSingle(resObj.data, '请假/离深/补休');
                break;
            }
          }
        });
      }
      let allInforListArr = [
        ...this.state.allInforList,
        ...SelfEvaluationList,
        ...DocCarUseReportInfo,
        ...DocAttendanceCar,
        ...RewardSyncList,
        ...DocDailyWork,
        ...LeaveAfterSyncInfo,
        ...DogFoodInfo,
        ...AidRecipientsInfo,
      ];
      if (allInforListArr.length % 2 === 0) {
        //如果数据是单数，再加一个空白页
        allInforListArr = [...allInforListArr, ...BlankPageArr, ...BackCoverArr];
      } else {
        allInforListArr = [...allInforListArr, ...BackCoverArr];
      }
      //获取所有信息列表集合
      this.setState(
        {
          allInforList: allInforListArr,
        },
        () => {
          //所有信息列表拆分成书本左右两页
          const { allInforList } = this.state;
          let bookList = [];
          allInforList.map((item, index) => {
            if (index % 2 == 0) {
              bookList.push({ paper: [allInforList[index], allInforList[index + 1]] });
            }
          });
          this.setState(
            {
              bookList: bookList,
            },
            () => {
              console.log(this.state.bookList, 'bookListbookListbookListbookList');
              this.state.bookList;
            }
          );
        }
      );
    });
  };

  //判断页面显示的内容
  showContent = (obj, cIndex) => {
    if (!obj) {
      return;
    }
    let cont = '';
    const currentIndex = cIndex < 10 ? '0' + cIndex : cIndex;
    switch (obj.bookName) {
      case '封面':
        cont = <Cover detailInfor={obj} currentIndex={currentIndex} userId={this.state.userId} />;
        break;
      case '目录':
        cont = <Catalogue detailInfor={obj} currentIndex={currentIndex} jumpDirectory={this.jumpDirectory} />;
        break;
      case '绩效考核':
        cont = <PerformanceAssessment detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '工作用车':
        cont = <Transport detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '出勤用车':
        cont = <AttendanceCar detailInfor={obj} currentIndex={currentIndex} />;
        break;
      // case '考勤管理':
      //   cont = <AttendanceManagement detailInfor={obj} currentIndex={currentIndex} />;
      //break;
      case '奖励事项':
        cont = <RewardItems detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '日报信息':
        cont = <DailyInformation detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '请假/离深/补休':
        cont = <AttendanceManagement detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '犬粮申请':
        cont = <DogFoodApply detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '通用物资领用':
        cont = <AidRecipients detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '最后一页':
        cont = <BlankPage currentIndex={currentIndex} />;
        break;
      case '封底':
        cont = <BackCover detailInfor={obj} currentIndex={currentIndex} />;
        break;
    }
    return cont;
  };

  //翻页
  getPage = (curI) => {
    const { bookList, numbAdd } = this.state;
    const len = bookList ? bookList.length : 0;
    let i = numbAdd;
    if (i == 1 || i == len + 1) {
      //翻到第一页或最后一页的时候
      if (i == 1) {
        this.forward(i);
      } else {
        this.backwards(i);
      }
    } else {
      if (curI == 1) {
        this.backwards(i);
      } else {
        this.forward(i);
      }
    }
  };
  //向前翻页
  forward = (i, callBack) => {
    let newAtLelft = this.state.atLeft;
    newAtLelft.push(i);
    i++;
    this.setState(
      {
        atLeft: newAtLelft,
        numbAdd: i,
      },
      () => {
        callBack && callBack();
      }
    );
  };
  //向后翻页
  backwards = (i, callBack) => {
    let newAtLelft = this.state.atLeft;
    newAtLelft.pop(i);
    i--;
    this.setState(
      {
        atLeft: newAtLelft,
        numbAdd: i,
      },
      () => {
        callBack && callBack();
      }
    );
  };
  //从目录跳转
  jumpDirectory = (name) => {
    let { bookList, numbAdd } = this.state;
    let cindex = '',
      papindex = '';
    bookList.map((item, index) => {
      item.paper.map((el, eli) => {
        if (el.$indexes && el.bookName == name) {
          cindex = index;
          papindex = eli;
        }
      });
    });
    if (numbAdd < cindex + 1 + papindex) {
      this.forward(numbAdd, () => this.jumpDirectory(name));
    }
    if (numbAdd > cindex + 1 + papindex) {
      this.backwards(numbAdd, () => this.jumpDirectory(name));
    }
  };

  render() {
    const { bookList, atLeft, numbAdd } = this.state;
    console.log(atLeft);
    console.log(atLeft.indexOf(1));
    return (
      <div className="record-main">
        <div className="return-link" onClick={() => this.props.history.push('/app/archivew/list')}>
          <img src={require('images/archives/return.png')} />
          返回
        </div>
        <div className="record-box">
          {/* <div className="clearfix get-date">
            <Form.Item label="查询时间：" labelAlign="right" {...formItemLayout} className="fr">
              <RangePicker value={dateArr} format={dateFormat} onChange={(e) => this.getPicker(e)} />
            </Form.Item>
          </div> */}
          <div className="record-book">
            {/* 悬浮目录 */}
            {numbAdd > 1 && numbAdd < bookList.length + 1 ? <Navigation jumpDirectory={this.jumpDirectory} /> : null}
            {/* 搜索日期 */}
            {/* {numbAdd > 1 && numbAdd < bookList.length + 1 ? <SearchDate /> : null} */}
            <div className="page-arr">
              {bookList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={['page-list', atLeft.indexOf(index + 1) > -1 ? 'page-left' : 'page-right'].join(' ')}
                    style={numbAdd == 1 ? { left: '25%' } : numbAdd == bookList.length + 1 ? { left: '75%' } : {}}
                  >
                    {item.paper && item.paper.length > 0
                      ? item.paper.map((el, i) => {
                          return (
                            <div
                              key={i}
                              className="pic"
                              style={{ transform: `translateZ(${(2 * index + i) / 10}px)` }}
                              onClick={() => {
                                this.getPage(i);
                              }}
                            >
                              <div className="pic-list">{this.showContent(el, 2 * index + i)}</div>
                            </div>
                          );
                        })
                      : null}
                  </div>
                );
              })}
            </div>
            {numbAdd > 1 && <Icon type="left-circle" className="arrows left-arrows" onClick={() => this.getPage(1)} />}
            {numbAdd < bookList.length + 1 && (
              <Icon type="right-circle" className="arrows right-arrows" onClick={() => this.getPage(0)} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Archivew;
