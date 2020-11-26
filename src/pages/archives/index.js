import React, { Component } from 'react';
import { DatePicker, Form } from 'antd';

import Cover from './components/Cover'; //封面
import BackCover from './components/BackCover'; //封面
import Catalogue from './components/Catalogue'; //目录
import PerformanceAssessment from './components/PerformanceAssessment'; //绩效考核
import Transport from './components/Transport'; //工作用车
import AttendanceCar from './components/AttendanceCar'; //出勤用车
import AttendanceManagement from './components/AttendanceManagement'; //考勤管理
import RewardItems from './components/RewardItems'; //奖励事项
import DailyInformation from './components/DailyInformation'; //日报信息

import moment from 'moment';

import 'style/pages/archives/index.less';

const { MonthPicker, RangePicker } = DatePicker;
const formItem = Form.Item;

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

const dateFormat = 'YYYY-MM-DD';
const dateArr = [moment('2020-01-01 00:00:00', dateFormat), moment('2020-11-25 23:59:59', dateFormat)];

class Archivew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '2020-01-01 00:00:00',
      endDate: '2020-11-25 23:59:59',
      userId: 5,
      allInforList: [{ bookName: '封面' }, { bookName: '目录' }], //所有信息列表
      bookList: [], //翻页集合
      atLeft: [],
      numbAdd: 1,
    };
  }
  componentDidMount() {
    this.getAllInfor();
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
          this.getAllInfor();
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
      BackCoverArr = [{ bookName: '封底' }];
    Promise.all([
      this.getSelfEvaluationList(startDate, endDate, userId), //获取绩效考核详情
      this.pageDocCarUseReportInfo(startDate, endDate, userId), //获取工作用车信息
      this.pageDocAttendanceCar(startDate, endDate, userId), //获取出勤用车信息
      this.getRewardSyncList(startDate, endDate, userId), //获取奖励详情列表
      this.pageDocDailyWork(startDate, endDate, userId), //获取日报信息
    ]).then((res) => {
      if (res && res.length > 0) {
        res.map((resObj, index) => {
          if (resObj && resObj.code == 0) {
            switch (index) {
              case 0:
                console.log(resObj, '绩效考核');
                SelfEvaluationList = this.getSingle(resObj.data, '绩效考核');
                break;
              case 1:
                console.log(resObj, '工作用车');
                DocCarUseReportInfo = this.getSingle(resObj.data.list, '工作用车');
                break;
              case 2:
                console.log(resObj, '出勤用车');
                DocAttendanceCar = this.getSingle(resObj.data.list, '出勤用车');
                break;
              case 3:
                console.log(resObj, '奖励事项');
                RewardSyncList = this.getSingle(resObj.data, '奖励事项');
                break;
              case 4:
                console.log(resObj, '日报信息');
                DocDailyWork = this.getSingle(resObj.data.list, '日报信息');
                break;
            }
          }
        });
      }
      console.log(SelfEvaluationList, DocCarUseReportInfo, DocAttendanceCar, RewardSyncList, DocDailyWork);
      //获取所有信息列表集合
      this.setState(
        {
          allInforList: [
            ...this.state.allInforList,
            ...SelfEvaluationList,
            ...DocCarUseReportInfo,
            ...DocAttendanceCar,
            ...RewardSyncList,
            ...DocDailyWork,
            ...BackCoverArr,
          ],
        },
        () => {
          console.log(this.state.allInforList, 'alllllllll');
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
            }
          );
        }
      );
    });
  };
  //获取单个详情列表
  getSingle = (arr, name) => {
    let newArr = [];
    if (arr && arr.length > 0) {
      arr.map((item, index) => {
        item.bookName = name;
        if (index == 0) {
          item.$indexes = true;
        }
        newArr.push(item);
      });
    } else {
      newArr = [
        {
          bookName: name,
          noData: true,
          $indexes: true,
        },
      ];
    }
    return newArr;
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
        cont = <Cover detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '目录':
        cont = <Catalogue detailInfor={obj} currentIndex={currentIndex} />;
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
      case '考勤管理':
        cont = <AttendanceManagement detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '奖励事项':
        cont = <RewardItems detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '日报信息':
        cont = <DailyInformation detailInfor={obj} currentIndex={currentIndex} />;
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
  forward = (i) => {
    let newAtLelft = this.state.atLeft;
    newAtLelft.push(i);
    i++;
    this.setState({
      atLeft: newAtLelft,
      numbAdd: i,
    });
  };
  //向后翻页
  backwards = (i) => {
    let newAtLelft = this.state.atLeft;
    newAtLelft.pop(i);
    i--;
    this.setState({
      atLeft: newAtLelft,
      numbAdd: i,
    });
  };

  render() {
    const { bookList, atLeft, numbAdd } = this.state;
    return (
      <div className="record-main">
        <div className="record-box">
          <div className="clearfix get-date">
            <Form.Item label="查询时间：" labelAlign="left" {...formItemLayout} className="fr">
              <RangePicker
                //defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                //format={dateFormat}
                value={dateArr}
                format={dateFormat}
                onChange={(e) => this.getPicker(e)}
              />
            </Form.Item>
          </div>
          <div className="record-book">
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
          </div>
        </div>
      </div>
    );
  }
}
export default Archivew;
