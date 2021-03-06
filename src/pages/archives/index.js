import React, {Component} from 'react';
import {Icon} from 'antd';
import {getSingle} from './util';

import Cover from './components/Cover'; //封面
import BackCover from './components/BackCover'; //封底
import Catalogue from './components/Catalogue'; //目录
import PerformanceAssessment from './components/PerformanceAssessment'; //绩效考核
import Transport from './components/Transport'; //工作用车
import AttendanceCar from './components/AttendanceCar'; //出勤用车
import AttendanceManagement from './components/AttendanceManagement'; //考勤管理
import LeaveManagement from './components/LeaveManagement'; //请假/离深/补休
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
const cMonth = nowDate.getMonth() + 1 > 10 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1); //月份
const cDay = nowDate.getDate() > 10 ? nowDate.getDate() : '0' + nowDate.getDate(); //日
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
      allInforList: [{bookName: '封面'}, {bookName: '目录'}], //所有信息列表
      bookList: [], //翻页集合
      atLeft: [],
      numbAdd: 1
    };
  }
  componentDidMount() {
    const userId = util.urlParse(this.props.location.search).userId;
    // const userId = null;
    this.setState({userId: userId || null}, () => {
      this.getAllInfor();
    });
  }
  // 选择时间
  getPicker = (startDate, endDate) => {
    this.setState(
      {
        startDate: startDate,
        endDate: endDate
      },
      () => {
        const {numbAdd} = this.state;
        if (numbAdd > 1) {
          this.setState(
            {
              allInforList: [{bookName: '封面'}, {bookName: '目录'}], //所有信息列表
              bookList: [], //翻页集合
              numbAdd: 1,
              atLeft: []
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
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        repDateStart: startDate, //上报时间始
        repDateEnd: endDate, //上报时间止
        userId: [userId] //用户ID(list)
      }
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
        userId: userId //用户ID
      }
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
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/report/pageDocAttendanceCar', reqObj);
  };
  //获取奖励详情列表
  getRewardSyncList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userIds: [userId] //用户Id（list）
      }
    };
    return React.$ajax.postData('/api/reward/getPageRewardSync', reqObj);
  };
  //获取日报信息
  pageDocDailyWork = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/report/pageDocDailyWork', reqObj);
  };
  //考勤管理
  pageDocClock = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocClock', reqObj);
  };
  //获取请假/离深/补休
  exportLeaveAfterSyncInfo = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userIds: [userId] //用户ID
      }
    };
    return React.$ajax.postData('/api/leaveAfterSync/getPageLeaveAfterSync', reqObj); //getLeaveAfterSyncList
  };
  // 通用物资领取
  AidRecipientsList = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
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
        userId: userId //用户ID
      }
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
        userId: userId //用户ID
      }
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
        userId: userId //用户ID
      }
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
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocInterPhone', reqObj);
  };
  //犬粮申请
  pageDocMakeDogFood = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocMakeDogFood', reqObj);
  };
  //口罩领用
  pageDocMask = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocMask', reqObj);
  };
  //犬只调动审批
  pageDocDogTransfer = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocDogTransfer', reqObj);
  };
  //监控查看
  pageDocWatchMonitor = (startDate, endDate, userId) => {
    const reqObj = {
      ignorePageRequest: true, //是否忽略分页请求
      param: {
        startDate: startDate, //开始时间
        endDate: endDate, //结束时间
        userId: userId //用户ID
      }
    };
    return React.$ajax.postData('/api/work-wx-sp/pageDocWatchMonitor', reqObj);
  };

  //获取所有的信息
  getAllInfor = () => {
    let {startDate, endDate, userId} = this.state;
    startDate = this.getTime(startDate);
    endDate = this.getTime(endDate);
    let SelfEvaluationList = []; //绩效考核
    let DocCarUseReportInfo = []; //工作用车
    let DocAttendanceCar = []; //出勤用车
    let RewardSyncList = []; //奖励事项
    let DocDailyWork = []; //日报信息
    let AttendanceInfo = []; //考勤管理
    let LeaveAfterSyncInfo = []; //请假/离深/补休
    let DogFoodInfo = []; //犬粮申请
    let AidRecipientsInfo = []; //通用物资领用
    let GetMaskInfo = []; // 口罩领用
    let ClinicMaterialArr = []; // 诊疗点物资领取
    let WalkieTalkieMaterialArr = []; // 对讲机领取
    let ElectricGunArr = []; // 电击枪领取
    let KitchenMaterialArr = []; // 厨房物资领取
    let DogTransferInfoArr = []; // 犬只调动审批
    let MonitoringViewInfoArr = []; // 监控查看申请
    const BackCoverArr = [{bookName: '封底'}];
    const BlankPageArr = [{bookName: '最后一页'}];
    Promise.all([
      this.getSelfEvaluationList(startDate, endDate, userId), //获取绩效考核详情
      this.pageDocCarUseReportInfo(startDate, endDate, userId), //获取工作用车信息
      this.pageDocAttendanceCar(startDate, endDate, userId), //获取出勤用车信息
      this.getRewardSyncList(startDate, endDate, userId), //获取奖励详情列表
      this.pageDocDailyWork(startDate, endDate, userId), //获取日报信息
      this.pageDocClock(startDate, endDate, userId), //考勤管理
      this.exportLeaveAfterSyncInfo(startDate, endDate, userId), //获取请假/离深/补休
      this.AidRecipientsList(startDate, endDate, userId), // 通用物资领取
      this.KitchenMaterialList(startDate, endDate, userId), // 厨房物资领取
      this.ClinicMaterialList(startDate, endDate, userId), //诊疗点物资领取
      this.ElectricGunList(startDate, endDate, userId), //电击枪领用
      this.WalkieTalkieMaterialList(startDate, endDate, userId), //对讲机领用
      this.pageDocMakeDogFood(startDate, endDate, userId), //犬粮申请
      this.pageDocMask(startDate, endDate, userId), //口罩领用
      this.pageDocDogTransfer(startDate, endDate, userId), //犬只调动审批
      this.pageDocWatchMonitor(startDate, endDate, userId) //查看监控
    ]).then((res) => {
      if (res && res.length > 0) {
        console.log(res);
        res.map((resObj, index) => {
          if (resObj && resObj.code == 0) {
            switch (index) {
              case 0:
                SelfEvaluationList = getSingle(resObj.data.list, '绩效考核');
                break;
              case 1:
                DocCarUseReportInfo = getSingle(resObj.data.list, '工作用车');
                break;
              case 2:
                DocAttendanceCar = getSingle(resObj.data.list, '出勤用车');
                break;
              case 3:
                RewardSyncList = getSingle(resObj.data.list, '奖励事项');
                break;
              case 4:
                DocDailyWork = getSingle(resObj.data.list, '日报信息');
                break;
              case 5:
                AttendanceInfo = getSingle(resObj.data.list, '考勤管理');
                break;
              case 6:
                LeaveAfterSyncInfo = getSingle(resObj.data.list, '请假/离深/补休');
                break;
              case 7:
                AidRecipientsInfo = getSingle(resObj.data.list, '通用物资领用');
                break;
              case 8:
                KitchenMaterialArr = getSingle(resObj.data.list, '厨房物资领用');
                break;
              case 9:
                ClinicMaterialArr = getSingle(resObj.data.list, '诊疗点物资领用');
                break;
              case 10:
                ElectricGunArr = getSingle(resObj.data.list, '值班室电击枪领用');
                break;
              case 11:
                WalkieTalkieMaterialArr = getSingle(resObj.data.list, '值班室对讲机领用');
                break;
              case 12:
                DogFoodInfo = getSingle(resObj.data.list, '犬粮申请');
                break;
              case 13:
                GetMaskInfo = getSingle(resObj.data.list, '口罩领用');
                break;
              case 14:
                DogTransferInfoArr = getSingle(resObj.data.list, '犬只调动审批');
                break;
              case 15:
                MonitoringViewInfoArr = getSingle(resObj.data.list, '监控查看申请');
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
        ...AttendanceInfo,
        ...LeaveAfterSyncInfo,
        ...DogFoodInfo,
        ...AidRecipientsInfo,
        ...GetMaskInfo,
        ...ClinicMaterialArr,
        ...WalkieTalkieMaterialArr,
        ...ElectricGunArr,
        ...KitchenMaterialArr,
        ...DogTransferInfoArr,
        ...MonitoringViewInfoArr
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
          allInforList: allInforListArr
        },
        () => {
          //所有信息列表拆分成书本正反两页
          const {allInforList} = this.state;
          console.log(allInforList);
          const bookList = [];
          allInforList.map((item, index) => {
            if (index % 2 == 0) {
              bookList.push({paper: [allInforList[index], allInforList[index + 1]]});
            }
          });
          this.setState(
            {
              bookList: bookList
            },
            () => {
              console.log(this.state.bookList, 'bookListbookListbookListbookList');
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
        cont = <Cover detailInfor={obj} currentIndex={currentIndex} userId={this.state.userId} currentDate={cYMD} />;
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
      case '考勤管理':
        cont = <AttendanceManagement detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '奖励事项':
        cont = <RewardItems detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '日报信息':
        cont = <DailyInformation detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '请假/离深/补休':
        cont = <LeaveManagement detailInfor={obj} currentIndex={currentIndex} />;
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
      case '值班室对讲机领用':
        cont = <WalkieTalkieMaterial detailInfor={obj} currentIndex={currentIndex} />;
        break;
      case '值班室电击枪领用':
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
    const {bookList, numbAdd} = this.state;
    const len = bookList ? bookList.length : 0;
    const i = numbAdd;
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
    const newAtLelft = this.state.atLeft;
    newAtLelft.push(i);
    i++;
    this.setState(
      {
        atLeft: newAtLelft,
        numbAdd: i
      },
      () => {
        callBack && callBack();
      }
    );
  };
  //向后翻页
  backwards = (i, callBack) => {
    const newAtLelft = this.state.atLeft;
    newAtLelft.pop(i);
    i--;
    this.setState(
      {
        atLeft: newAtLelft,
        numbAdd: i
      },
      () => {
        callBack && callBack();
      }
    );
  };
  //从目录跳转
  jumpDirectory = (name) => {
    const {bookList, numbAdd} = this.state;
    let cindex = '';
    let papindex = '';
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
    const {bookList, atLeft, numbAdd, startDate, endDate} = this.state;
    return (
      <div className="record-main">
        <div className="return-link" onClick={() => this.props.history.push('/app/archivew/list')}>
          <img src={require('images/archives/return.png')} />
          返回
        </div>
        <div className="record-box">
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
                    style={numbAdd == 1 ? {left: '25%'} : numbAdd == bookList.length + 1 ? {left: '75%'} : {}}>
                    {item.paper && item.paper.length > 0
                      ? item.paper.map((el, i) => {
                          return (
                            <div
                              key={i}
                              className="pic"
                              // style={{
                              //   transform: `translateX(${(2 * index + i) / 50}px) translateZ(${
                              //     (2 * index + i) / 50
                              //   }px)`,
                              // }}
                              style={{
                                transform: `translateZ(${(2 * index + i) / 50}px)`
                              }}
                              onClick={() => {
                                this.getPage(i);
                              }}>
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
