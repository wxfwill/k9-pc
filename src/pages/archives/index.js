import React, { Component } from 'react';
import { Icon } from 'antd';
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
import GetMask from './components/GetMask'; // 口罩领取
import ClinicMaterial from './components/ClinicMaterial'; // 诊疗点物资领取
import WalkieTalkieMaterial from './components/WalkieTalkieMaterial'; // 对讲机领取
import ElectricGun from './components/ElectricGun'; // 电击枪领取
import KitchenMaterial from './components/KitchenMaterial'; // 厨房物资领取
import DogTransferInfo from './components/DogTransferInfo'; // 犬只调动审批
import MonitoringViewInfo from './components/MonitoringViewInfo'; // 监控查看申请
import BlankPage from './components/BlankPage'; //最后一页
import Navigation from './components/Navigation'; //悬浮目录
import SearchDate from './components/SearchDate'; //搜索日期

import 'style/pages/archives/index.less';

const nowDate = new Date();
const cYear = nowDate.getFullYear(); //当前年份
const cMonth = nowDate.getMonth() + 1; //月份
const cDay = nowDate.getDate(); //日
const cYMD = cYear + '-' + cMonth + '-' + cDay; //当前日期
const defSatrtDate = cYear + '-01-01 00:00:00'; //默认开始时间
const defEndDate = cYMD + ' 23:59:59'; //默认结束时间

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
    // const userId = null;
    this.setState({ userId: userId ? userId : null }, () => {
      this.getAllInfor();
    });
  }
  getPicker = (startDate, endDate) => {
    this.setState(
      {
        startDate: startDate,
        endDate: endDate,
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
  // 通用物资领取
  AidRecipientsList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocGoodsCommon', reqObj);
  };
  // 厨房物资领取
  KitchenMaterialList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocGoodsKitchen', reqObj);
  };
  //诊疗点物资申领
  ClinicMaterialList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocGoodsTherapy', reqObj);
  };
  // 电击枪领用
  ElectricGunList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocElectricGun', reqObj);
  };
  // 对讲机领用
  WalkieTalkieMaterialList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId, //用户ID
      },
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocInterPhone', reqObj);
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
      AidRecipientsInfo = [], //通用物资领用
      GetMaskInfo = [{ bookName: '口罩领用', noData: true, $indexes: true }], // 口罩领用
      ClinicMaterialArr = [], // 诊疗点物资领取
      WalkieTalkieMaterialArr = [], // 对讲机领取
      ElectricGunArr = [], // 电击枪领取
      KitchenMaterialArr = [], // 厨房物资领取
      DogTransferInfoArr = [{ bookName: '犬只调动审批', noData: true, $indexes: true }], // 犬只调动审批
      MonitoringViewInfoArr = [{ bookName: '监控查看申请', noData: true, $indexes: true }], // 监控查看申请
      BackCoverArr = [{ bookName: '封底' }],
      BlankPageArr = [{ bookName: '最后一页' }];
    Promise.all([
      this.getSelfEvaluationList(startDate, endDate, userId), //获取绩效考核详情
      this.pageDocCarUseReportInfo(startDate, endDate, userId), //获取工作用车信息
      this.pageDocAttendanceCar(startDate, endDate, userId), //获取出勤用车信息
      this.getRewardSyncList(startDate, endDate, userId), //获取奖励详情列表
      this.pageDocDailyWork(startDate, endDate, userId), //获取日报信息
      this.exportLeaveAfterSyncInfo(startDate, endDate, userId), //获取请假/离深/补休
      this.AidRecipientsList(startDate, endDate, userId), // 通用物资领取
      this.KitchenMaterialList(startDate, endDate, userId), // 厨房物资领取
      this.ClinicMaterialList(startDate, endDate, userId), //诊疗点物资领取
      this.ElectricGunList(startDate, endDate, userId), //电击枪领用
      this.WalkieTalkieMaterialList(startDate, endDate, userId), //对讲机领用
    ]).then((res) => {
      if (res && res.length > 0) {
        console.log(res);
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
              case 6:
                console.log(resObj, '通用物资');
                AidRecipientsInfo = getSingle(resObj.data.list, '通用物资领用');
                break;
              case 7:
                console.log(resObj, '厨房物资领用');
                KitchenMaterialArr = getSingle(resObj.data.list, '厨房物资领用');
                break;
              case 8:
                console.log(resObj, '诊疗点物资领用');
                ClinicMaterialArr = getSingle(resObj.data.list, '诊疗点物资领用');
                break;
              case 9:
                console.log(resObj, '电击枪领用');
                ElectricGunArr = getSingle(resObj.data.list, '电击枪领用');
                break;
              case 10:
                console.log(resObj, '对讲机领用');
                WalkieTalkieMaterialArr = getSingle(resObj.data.list, '对讲机领用');
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
        ...GetMaskInfo,
        ...ClinicMaterialArr,
        ...WalkieTalkieMaterialArr,
        ...ElectricGunArr,
        ...KitchenMaterialArr,
        ...DogTransferInfoArr,
        ...MonitoringViewInfoArr,
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
          console.log(allInforList);
          let bookList = [];
          allInforList.map((item, index) => {
            if (index % 2 == 0) {
              bookList.push({ paper: [allInforList[index], allInforList[index + 1]] });
            }
          });
          console.log(bookList);
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
      case '口罩领用':
        cont = <GetMask detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '诊疗点物资领用':
        cont = <ClinicMaterial detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '对讲机领用':
        cont = <WalkieTalkieMaterial detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '电击枪领用':
        cont = <ElectricGun detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '厨房物资领用':
        cont = <KitchenMaterial detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '犬只调动审批':
        cont = <DogTransferInfo detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '监控查看申请':
        cont = <MonitoringViewInfo detailInfor={obj} currentIndex={currentIndex} />;
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
    const { bookList, atLeft, numbAdd, startDate, endDate } = this.state;
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
            {numbAdd > 1 && numbAdd < bookList.length + 1 ? (
              <SearchDate startDate={startDate} endDate={endDate} getPicker={this.getPicker} />
            ) : null}
            <div className="page-arr">
              {bookList.map((item, index) => {
                console.log(bookList);
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
