import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';
import {
  Radio,
  List,
  Avatar,
  Skeleton,
  Row,
  Col,
  Icon,
  Spin,
  Button,
  Card,
  Tag,
  Select,
  Form,
  Tabs,
  Input,
  message,
  DatePicker
} from 'antd';
import GridUserInfoTable from './GridUserInfoTable';
// import GridTable from './GridTable';
import moment from 'moment';
import {tMap} from 'components/view/common/createGridMap';

// const Panel = Collapse.Panel;
const antIcon = <Icon type="loading" style={{fontSize: 30}} spin />;
const Option = Select.Option;
// const OptGroup = Select.OptGroup;
// const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
// card
// const {Meta} = Card;

const mockDate = [];
for (var i = 0; i < 50; i++) {
  mockDate.push(i);
}

require('style/view/monitoring/gridRaid.less');
const jc_path = require('images/jc_48_48.png');

class _GridRaid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jc_path: jc_path, //默认警员的头像
      selectOne: {}, // 当前编辑的警员
      selectPeoples: [],
      limit: null,
      loading: true,
      selPeopleDlgVisible: false,
      selPeopleForm: {},
      selPeopleOptions: [],
      searchPlace: null, //搜索地点
      searchArea: {},
      allPeoples: [],
      showAllPeo: false,
      radiusList: [],
      radiusList2: [
        {id: 5, name: '5公里', value: 3},
        {id: 10, name: '10公里', value: 4},
        {id: 20, name: '20公里', value: 5},
        {id: 30, name: '30公里', value: 6}
      ],
      radius: 0, //搜索半径 默认 10 km
      parts: 0, //栅格等分 3 x 3
      allPeopleH: 450, //展示所有人员的弹窗高度
      allPeopleTop: 0, //选择人员弹框 top
      allPeopleLeft: 0, //选择人员弹框 left
      curSearchRect: null, //当前在修改的栅格
      currentArea: null, //当前修改区域
      showDeleteBtn: false,
      teamList: [],
      selectTeamId: '',
      reportUserList: [],
      reportUserId: ''
    };
    this.TMap = null;
    this.markerList = [];
    this.labelList = [];
    this.reactMarkers = {}; //存储所有栅格中的marker
    this.rectIndex = 1; //当前编辑栅格 index
  }
  componentDidMount() {
    const _this = this;

    _this.gridSearchTaskSaveDTO = {
      userAreas: [] //人员区域信息
    }; //区域搜索任务信息

    this.timmer = setTimeout(function () {
      _this.setState({
        loading: false
      });
    }, 1000);

    this.getAllTeam();
    this.getGridSearchSet().then(() => {
      let options = {
        labelText: '',
        OverlayType: 'MARKER',
        radius: this.state.radius,
        parts: this.state.parts
      };
      if (typeof this.props.location.query !== 'undefined') {
        options = {
          labelText: '',
          ...this.props.location.query
        };
      }

      this.TMap = new tMap(options);
      this.TMap.drawingManager(); //绘图功能
      // TMap.setBeatMark();
      $('#clear').click(function () {
        this.TMap.clearOverlay(); //清除覆盖物
      });
      $('#clearCoord').click(function () {
        this.TMap.clearCoord(); //取消坐标点标注
      });
      $('#clearGrid').click(function () {
        this.TMap.clearGrid(); //清除网格
      });
      $('#createMakers').click(function () {
        this.TMap.createMakers(); //多点标注
      });
      $('#setPolyline').click(function () {
        this.TMap.drawingPolyline(); //画线
      });

      this.TMap.setPolyline();

      this.TMap.showSelPeopleDlg = function (rect) {
        //点击搜索矩形区域,弹出对话框
        console.log(rect, 'mouseup');
        _this.setState({searchArea: rect});
        _this.dragOnePeople(rect);
        // _this.setState({selPeopleDlgVisible:true});
      };
      this.TMap.showAllPeople = function (event, rect, targetArea) {
        //点击搜索矩形区域,弹出对话框
        _this.showAllPeople(event, rect, targetArea);
      };
    });

    // this.getGridSearchUsers(); //加载下拉框中的用户

    // 对话框部分
    this.handleSelectPeopleOk = function () {
      console.log('this.currSelUser');
      console.log(_this.currSelUser);
      _this.setState({selPeopleDlgVisible: false}); //隐藏对话框
      _this.refs.child.addUser(_this.currSelUser); //调用子组件在右侧显示人员列表

      let userId = -1;
      _this.selPeopleArr.forEach(function (item) {
        if (item.number == _this.currSelUser.key) {
          userId = item.id;
        }
      });

      _this.gridSearchTaskSaveDTO.userAreas.push({
        userId: userId,
        areaNo: _this.currSelUser.areaNo,
        number: _this.currSelUser.key,
        userName: _this.currSelUser.label,
        area: _this.state.searchArea,
        referencePoint: _this.state.searchArea.latLng
      });

      //创建一个Marker,标识执勤人员的位置
      // var marker = new qq.maps.Marker({
      //   position: _this.state.searchArea.latLng,
      //   map: this.TMap.map,
      //   visible: true,
      //   title: _this.currSelUser.key + '-' + _this.currSelUser.label,
      //   icon: new qq.maps.MarkerImage(jc_path, new qq.maps.Size(48, 48))
      //   //animation:qq.maps.MarkerAnimation.BOUNCE
      // });
    };

    this.handleSelectPeopleCancel = function () {
      _this.setState({selPeopleDlgVisible: false});
    };

    this.selectPeople = function (userArea) {
      userArea.areaNo = _this.state.searchArea.index; //搜索区域网格编号
      _this.currSelUser = userArea; //当前选中的人
    };
  }
  componentWillUnmount() {
    clearTimeout(this.timmer);
  }

  //提交网格化搜索
  subGridSearchTask = () => {
    const {history} = this.props;
    const {selectPeoples, reportUserId} = this.state;
    this.props.form.validateFields((err, values) => {
      if (selectPeoples.length <= 0) {
        message.info('请分配人员！');
        return;
      }
      if (!err) {
        var params = {
          drawShapeDTO: this.TMap.drawShape,
          taskName: values.taskName,
          content: values.content,
          reportUserId: reportUserId,
          taskDate: moment(values.taskDate).format('x')
        };

        params.userAreaDTOs = selectPeoples.map((t) => {
          return {
            userId: t.id,
            areaNo: t.index,
            number: t.number,
            userName: t.name,
            area: t.searchArea,
            referencePoint: t.searchArea.latLng
          };
        });
        React.$ajax
          .postData('/api/cmdMonitor/saveGridTask', {...params})
          .then(() => {
            message.success('发布成功！页面即将跳转...', 2, function () {
              history.push({pathname: '/app/monitoring/grid/list'});
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };

  resetMapSearch = (parts) => {
    // 选择搜索半径 重新绘制搜索网格
    console.log(parts);
    const {radiusList} = this.state;
    // this.setState({parts: value});
    radiusList.forEach((item) => {
      if (item.parts == parts) {
        this.setState({radius: item.radius, parts: parts}, () => {
          this.repaint();
        });
        // this.repaint();
      }
    });
  };
  showAllPeople = (event, rect, targetArea) => {
    //点击栅格 展示所有人员选择列表
    const {allPeopleH} = this.state; //弹窗高度
    this.rectIndex = rect.index;
    let top = event.cursorPixel.y;
    const left = event.cursorPixel.x;
    const containerH = document.getElementById('container').offsetHeight;
    top = top + allPeopleH > containerH ? containerH - allPeopleH : top;
    this.setState({
      showAllPeo: !this.state.showAllPeo,
      allPeopleTop: top,
      allPeopleLeft: left,
      targetEvent: event,
      curSearchRect: rect,
      currentArea: targetArea
    });
  };
  checkOnePeople = () => {
    const {targetEvent, curSearchRect, currentArea} = this.state;
    this.dragOnePeople(targetEvent, curSearchRect, currentArea);
    // this.setState({showAllPeo: !this.state.showAllPeo, curSearchRect: null, currentArea: null, selectOne: null})
  };
  dragOnePeople = (targetEvent, searchArea, currentArea) => {
    //栅格填充已选人员
    const _this = this;
    const rectIndex = searchArea.index;
    const {selectOne, selectPeoples, reportUserList, allPeoples} = this.state;
    console.log(reportUserList);

    if (!_.isEmpty(selectOne)) {
      const newSelectOne = {...selectOne, index: searchArea.index, searchArea};
      // 同一个区域不能添加同一个人
      let isAddFlag = true;
      let hasMarker = false; //判断是否已生成marker
      selectPeoples.forEach((item) => {
        // if(item.number==newSelectOne.number && item.index==newSelectOne.index){
        //     message.info('同一个区域不能添加同一个人!');
        //     isAddFlag=false;
        // }
        if (item.index == newSelectOne.index) {
          hasMarker = true;
          if (item.number == newSelectOne.number) {
            message.info('同一个区域不能添加同一个人!');
            isAddFlag = false;
          }
        }
      });
      if (!isAddFlag) {
        return;
      }
      selectPeoples.push(newSelectOne);
      //上报人员列表
      let isHase = true;
      reportUserList.forEach((item) => {
        if (item.number == newSelectOne.number) {
          isHase = false;
        }
      });
      if (isHase) {
        reportUserList.push(newSelectOne);
      }
      console.log(reportUserList, 'reportUserList');
      // this.setState({selectOne: null}); //添加后清除所选人员
      this.setState({selectPeoples, reportUserList});
      allPeoples.forEach((item) => {
        // 可选列表隐藏已选人员
        if (item.id == selectOne.id) {
          item.hide = true;
        }
      });
      this.setState({allPeoples});
      // 生成marker
      if (!hasMarker) {
        //该区域没有选择人员
        var decoration_marker = new qq.maps.MarkerDecoration(searchArea.index + '', new qq.maps.Point(0, -24));
        var marker = new qq.maps.Marker({
          position: currentArea.getBounds().getCenter(),
          map: this.TMap.map,
          decoration: decoration_marker,
          visible: true,
          title: `${selectOne.name}-${selectOne.number}`,
          icon: new qq.maps.MarkerImage(jc_path, new qq.maps.Size(48, 48)),
          id: selectOne.id,
          index: rectIndex
          //animation:qq.maps.MarkerAnimation.BOUNCE
        });
        this.TMap.Event.addListener(marker, 'click', function (event) {
          console.log(event);
          _this.showAllPeople(targetEvent, searchArea, currentArea);
          // let index = event.target.content;
          // _this.showAllPeople(event, rectangle[i], label_name);
        });
        var label = new qq.maps.Label({
          content: `${selectOne.name}-${selectOne.number}`,
          map: this.TMap.map,
          offset: new qq.maps.Size(-40, 3),
          position: currentArea.getBounds().getCenter(),
          style: {
            width: '100%',
            color: '#fff',
            fontSize: '10px',
            background: ' transparent',
            border: 'none',
            wordWrap: 'break-word'
          },
          visible: true,
          zIndex: 1000,
          id: selectOne.id,
          index: rectIndex
        });
        this.TMap.Event.addListener(label, 'click', function (event) {
          console.log(event);
          _this.showAllPeople(targetEvent, searchArea, currentArea);
          // let index = event.target.content;
          // _this.showAllPeople(event, rectangle[i], label_name);
        });
        this.markerList.push(marker);
        this.labelList.push(label);
        this.reactMarkers[rectIndex] = [newSelectOne];
      } else {
        //同一区域已经有选择人员
        this.reactMarkers[rectIndex].push(newSelectOne);
        let labelName = '';
        this.reactMarkers[rectIndex].forEach((item, index) => {
          let itemName = '';
          if (index < 2) {
            itemName = `${item.name}-${item.number} <br>`;
          } else if (index >= 2) {
            if (index == 2) {
              itemName = `${item.name}-${item.number}`;
            } else if (index == 3) {
              itemName = '. . .';
            }
          }
          labelName += itemName;
        });
        let label, marker;
        this.markerList.forEach((item, index) => {
          if (label) {
            return;
          }
          if (item.index == rectIndex) {
            label = this.labelList[index];
            marker = item;
          }
        });
        label.setContent(labelName);
        marker.setTitle(labelName);
      }
      // marker.setTitle(`${selectOne.name}-${selectOne.number}`);
      // marker.setVisible(true);
      // 生成人名及编号
    }
  };
  handleLimit = (limit) => {
    this.setState({limit: limit});
  };

  getGridSearchUsers() {
    //获取下拉框中的用户列表
    var params = {
      rid: Math.random()
    };

    var me = this;
    React.$ajax
      .postData('/api/userCenter/gridSearchUser', {...params})
      .then((res) => {
        me.selPeopleArr = res.data; //保存到当前对象中,后面要获取这个用户的id
        const selPeopleOptions = [];
        res.data.forEach((item) => {
          selPeopleOptions.push(
            <Option key={item.id} value={item.number}>
              {item.name}
            </Option>
          );
        });

        me.setState({selPeopleOptions: selPeopleOptions});

        if (res.code == 0) {
          this.setState({allPeoples: res.data});
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getTeamPeople = (id, qryStr = '') => {
    const teamId = id == 0 || id ? id : this.state.selectTeamId;
    React.$ajax.postData(config.apiUrl + '/api/userCenter/getUserByPatrolsTeam', {teamId, qryStr}).then((res) => {
      if (res.code == 0) {
        this.setState({allPeoples: res.data});
      }
    });
  };

  renderSelectNums = (id) => {
    //更新展示该人员已选次数
    let nums = 0;
    const {selectPeoples} = this.state;
    selectPeoples.forEach((item) => {
      if (item.id == id) {
        nums++;
      }
    });
    if (nums) {
      return <div className="peo_num">{nums}</div>;
    }
    return '';
  };
  deleteSelectPeoSec = (item) => {
    //删除已选区域人员 sec
    console.log(item);
    let marker;
    let label;
    const {selectPeoples} = this.state;
    const filter_markerList = [];
    const filter_labelList = [];
    const filter_curReactMarkers = [];
    const filter_selectPeoples = [];
    const filter_reportUserList = [];

    let curReactMarkers = this.reactMarkers[item.index];
    let isOnly = false;
    if (curReactMarkers && curReactMarkers.length == 1) {
      isOnly = true;
    }

    this.markerList.forEach((mItem) => {
      // 对应的marker
      if (!marker && mItem.index == item.index) {
        marker = mItem;
      } else {
        filter_markerList.push(mItem);
      }
    });

    this.labelList.forEach((lItem) => {
      //对应的marker下的label
      if (!label && lItem.index == item.index) {
        label = lItem;
      } else {
        filter_labelList.push(lItem);
      }
    });

    curReactMarkers.forEach((rItem) => {
      //对应栅格里的人员
      if (rItem.id != item.id) {
        filter_curReactMarkers.push(rItem);
      }
    });

    selectPeoples.forEach((sItem) => {
      // 删除选中的人员 & 删除上报人员
      let hasFind = false;
      if (item.id == sItem.id && item.index == sItem.index) {
        hasFind = true;
        // if (item.index) {
        // }
      }
      if (!hasFind) {
        filter_selectPeoples.push(sItem);
      }
    });

    const listHas = {}; //重组上报人员
    filter_selectPeoples.forEach((item) => {
      // eslint-disable-next-line no-empty
      if (listHas[item.number]) {
      } else {
        filter_reportUserList.push(item);
        listHas[item.number] = true;
      }
    });

    if (isOnly) {
      label.setMap(null); // 删除地图标记
      marker.setMap(null);
      delete this.reactMarkers[item.index];
    } else {
      filter_markerList.push(marker);
      filter_labelList.push(label);
      let labelName = '';
      filter_curReactMarkers.forEach((item, index) => {
        let itemName = '';
        if (index < 2) {
          itemName = `${item.name}-${item.number} <br>`;
        } else if (index >= 2) {
          if (index == 2) {
            itemName = `${item.name}-${item.number}`;
          } else if (index == 3) {
            itemName = '. . .';
          }
        }
        labelName += itemName;
      });
      label.setContent(labelName);
      marker.setTitle(labelName);
    }

    this.markerList = filter_markerList;
    this.labelList = filter_labelList;
    curReactMarkers = filter_curReactMarkers;
    this.reactMarkers[item.index] = curReactMarkers;
    this.setState({selectPeoples: filter_selectPeoples, reportUserList: filter_reportUserList});
  };
  deleteSelectPeo = () => {
    //删除已选区域人员
    // eslint-disable-next-line react/no-string-refs
    const GridUserInfoTable = this.refs.child;
    const {selectedRows} = GridUserInfoTable.state;
    let {selectPeoples, allPeoples} = this.state;
    //  debugger
    const filter_selectPeoples = [];

    selectPeoples.forEach((item) => {
      // 删除选中的人员
      let hasFind = false;
      selectedRows.forEach((rowItem) => {
        if (item.id == rowItem.id && item.index == rowItem.index) {
          hasFind = true;
        }
      });

      if (!hasFind) {
        filter_selectPeoples.push(item);
      }
    });
    allPeoples.forEach((allItem) => {
      //可选人员列表展示删除人员
      selectedRows.forEach((rowItem) => {
        if (allItem.id == rowItem.id) {
          delete allItem.hide;
        }
      });
    });
    selectPeoples = filter_selectPeoples;
    this.setState({selectPeoples: filter_selectPeoples});

    const filter_markerList = [];
    this.markerList.forEach((mItem) => {
      // 删除地图标记
      let hasFind = false;
      selectedRows.forEach((rowItem) => {
        if (mItem.id == rowItem.id) {
          mItem.setMap(null);
          hasFind = true;
        }
      });
      if (!hasFind) {
        filter_markerList.push(mItem);
      }
    });

    this.markerList = filter_markerList;

    const filter_labelList = [];

    this.labelList.forEach((lItem) => {
      let hasFind = false;
      selectedRows.forEach((rowItem) => {
        if (lItem.id == rowItem.id) {
          lItem.setMap(null);
          hasFind = true;
        }
      });
      if (!hasFind) {
        filter_labelList.push(lItem);
      }
    });

    this.labelList = filter_labelList;

    GridUserInfoTable.state.selectedRows = [];
  };

  clearAllSelect = () => {
    const {allPeoples} = this.state;
    this.setState({selectPeoples: [], showAllPeo: false});
    this.markerList.forEach((t) => {
      t.setMap(null);
    });
    this.labelList.forEach((t) => {
      t.setMap(null);
    });
    allPeoples.forEach((item) => {
      delete item.hide;
    });
    this.markerList = [];
    this.labelList = [];
    this.reactMarkers = {};
  };
  repaint = () => {
    const {radius, parts} = this.state;
    this.clearAllSelect();
    this.TMap = new tMap({zoom: 5, labelText: '', OverlayType: 'MARKER', radius: radius, parts: parts});
    this.TMap.drawingManager(); //绘图功能
    this.onSearch();
    this.TMap.showSelPeopleDlg = (rect) => {
      //点击搜索矩形区域,弹出对话框
      this.setState({searchArea: rect});
      this.dragOnePeople(rect);
      // _this.setState({selPeopleDlgVisible:true});
    };
    this.TMap.showAllPeople = (event, rect, targetArea) => {
      //点击搜索矩形区域,弹出对话框
      this.showAllPeople(event, rect, targetArea);
    };
  };
  // /api/userCenter/getAllPatrolsTeam
  getAllTeam = () => {
    React.$ajax.postData('/api/userCenter/getAllPatrolsTeam').then((res) => {
      if (res.code == 0) {
        this.setState({teamList: res.data, selectTeamId: res.data[0].id});
        this.getTeamPeople(res.data[0].id);
      }
    });
  };
  getGridSearchSet = () => {
    //2020 获取网格化搜捕配置
    return new Promise((reslove, reject) => {
      React.$ajax
        .postData('/api/cmdMonitor/gridSearchSet')
        .then((res) => {
          const radiusList = JSON.parse(res.data.pvalue.replace(/\\'/g, '"'));
          const radius = radiusList[0].radius;
          const parts = radiusList[0].parts;
          this.setState({radiusList: radiusList, radius: radius, parts: parts});
          reslove();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        });
    });
  };

  //地点搜索
  onSearch = (value) => {
    const {searchPlace} = this.state;
    if (value) {
      this.setState({searchPlace: value});
    }
    if (value || searchPlace) {
      this.TMap.searchService().search(value || searchPlace);
    }
  };

  render() {
    // const { collapsed } = this.props.systomState;
    const collapsed = false;
    const {getFieldDecorator} = this.props.form;
    const {
      allPeopleH,
      allPeoples,
      selectPeoples,
      showAllPeo,
      allPeopleTop,
      allPeopleLeft,
      showDeleteBtn,
      teamList,
      selectTeamId,
      reportUserList,
      radiusList,
      parts
    } = this.state;
    const title = (
      <div className="card_title">
        <span>网格搜捕</span>
        <span onClick={this.repaint}>重新绘制</span>&nbsp;
      </div>
    );
    const tabSearch = [
      <div className="tabSearch" style={{marginBottom: '10px'}} key="tab_1">
        <span style={{marginRight: '15px'}}>区域人员</span>
        <Input.Search
          placeholder="姓名/警号"
          style={{width: 200}}
          enterButton
          onSearch={(value) => {
            this.getTeamPeople(null, value);
          }}
        />
      </div>,
      <div className="tabSearch" key="tab_2">
        <span style={{marginRight: '15px'}}>选择小队</span>
        <Select
          style={{width: 200, paddingBottom: '10px'}}
          dropdownStyle={{zIndex: '99999'}}
          value={selectTeamId}
          onChange={(value) => {
            this.setState({selectTeamId: value});
            this.getTeamPeople(value);
          }}>
          {teamList.map((item, index) => {
            return (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </div>
    ];
    return (
      <div className="GridRaid" style={{left: collapsed ? '92px' : '212px'}}>
        <Spin
          indicator={antIcon}
          size="large"
          tip="数据加载中..."
          spinning={this.state.loading}
          style={{position: 'absolute', top: '50%', left: '50%', zIndex: '9999'}}
        />

        <Row gutter={24} id="container">
          <Card
            title={title}
            bordered={false}
            extra={
              <Tag color="#2db7f5" onClick={this.props.history.goBack}>
                <Icon type="rollback" />
                返回
              </Tag>
            }
            style={{
              width: 360,
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: '9999',
              maxHeight: 600,
              overflow: 'auto'
            }}>
            <div style={{marginBottom: 18}}>
              <Search placeholder="地点搜索" onSearch={(value) => this.onSearch(value)} enterButton />
            </div>
            <Form horizontal="true">
              <FormItem label="搜索半径：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('searchArea', {
                  rules: [{required: true, message: '请选择搜索半径'}],
                  initialValue: parts
                })(
                  <Select
                    placeholder="搜索半径"
                    onChange={(value) => {
                      this.resetMapSearch(value);
                    }}>
                    {radiusList &&
                      radiusList.map((item) => (
                        <Option key={item.radius} value={item.parts}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>

              <FormItem label="任务名称：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('taskName', {
                  rules: [
                    {required: true, message: '请输入任务名称...'},
                    {max: 50, message: '任务名称长度不超过50'}
                  ],
                  initialValue: ''
                })(<Input placeholder="请输入任务名称..." />)}
              </FormItem>
              <FormItem label="任务内容：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('content', {
                  rules: [
                    {required: true, message: '请输入任务内容...'},
                    {max: 1000, message: '任务内容长度不超过1000'}
                  ],
                  initialValue: ''
                })(<Input placeholder="请输入任务内容..." />)}
              </FormItem>
              <FormItem label="执行时间：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('taskDate', {
                  rules: [{required: true, message: '请选择时间'}],
                  initialValue: null
                })(<DatePicker format="YYYY-MM-DD " />)}
              </FormItem>
              <FormItem label="上报人员：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                {getFieldDecorator('combatType', {
                  rules: [{required: true, message: '请选择上报人员'}],
                  initialValue: undefined
                })(
                  <Select
                    placeholder="上报人员"
                    onChange={(value) => {
                      this.setState({reportUserId: value});
                    }}>
                    {reportUserList &&
                      reportUserList.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>

              <FormItem style={{display: 'none'}} label="任务人员：" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({showAllPeo: !showAllPeo});
                  }}>
                  分配人员
                </Button>
              </FormItem>
            </Form>
            <Row>
              <Col span={11}></Col>
              <Col span={3}>
                <Button type="primary" size="small" onClick={this.subGridSearchTask}>
                  发布
                </Button>
              </Col>
            </Row>
            <Tabs defaultActiveKey="1">
              <TabPane tab="区域人员" key="1">
                <GridUserInfoTable
                  isCheck={false}
                  selectPeoples={selectPeoples}
                  contralDeleteBtn={(status) => {
                    this.setState({showDeleteBtn: status});
                  }}
                  // eslint-disable-next-line react/no-string-refs
                  ref="child"
                />
              </TabPane>
            </Tabs>
            <Row>
              <Col span={14}></Col>
              <Col span={4}>
                {showDeleteBtn ? (
                  <Button type="primary" size="small" onClick={this.deleteSelectPeo}>
                    删除
                  </Button>
                ) : (
                  ''
                )}
              </Col>
              <Col span={4}>
                <Button size="small" onClick={this.clearAllSelect}>
                  清空
                </Button>
              </Col>
            </Row>
          </Card>
          {/* <Card title={'控制中心'} bordered={false}  bordered style={{ width: 150,position:'absolute',top:'0',right:'0',zIndex:'9999'}}>
                      <Tag id="clear" color="#f50">重新绘制</Tag>
                      <Tag id="clearGrid" color="#2db7f5">清除网格</Tag>
                      <Tag id='clearCoord' color="#2db7f5">取消坐标点标注</Tag>
                      <Tag id="createMakers" color="#2db7f5">多点标注</Tag>
                      <Tag id="makersClick" color="#2db7f5">判断</Tag>
                      <Tag id="setPolyline" color="#2db7f5">画线</Tag>
                    </Card>
                   <Collapse onChange={this.callback.bind(this)} style={{position:'absolute',bottom:'0',left:'0',right:"0",zIndex:'9999'}}>
                      <Panel header={<Tag color="#2db7f5">搜捕信息流水</Tag>} key="1">
                        <GridTable/>
                      </Panel>
                    </Collapse>
                  */}
        </Row>
        <Row gutter={24} id="peo_container">
          <div
            className="showAllPeoCard"
            style={{
              display: showAllPeo ? 'block' : 'none',
              width: 335,
              height: allPeopleH,
              overflow: 'hidden',
              position: 'absolute',
              top: allPeopleTop,
              left: allPeopleLeft,
              zIndex: '9999'
            }}>
            <Card
              bordered={false}
              bodyStyle={{paddingTop: 0}}
              style={{width: 335, height: allPeopleH - 50, overflow: 'auto'}}>
              <div className="avator_card" style={{padding: 5}}>
                <List
                  className="demo-loadmore-list"
                  loading={false}
                  bordered
                  size="small"
                  itemLayout="horizontal"
                  dataSource={this.reactMarkers[this.rectIndex]}
                  locale={{emptyText: '暂无配置'}}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Icon
                          onClick={() => {
                            this.deleteSelectPeoSec(item);
                          }}
                          type="delete"
                          key="delete"
                        />
                      ]}>
                      <Skeleton avatar title={false} loading={false} active>
                        <List.Item.Meta avatar={<Avatar src={jc_path} />} title={item.name} />
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane tab={tabSearch} key="1" style={{width: '100%'}}>
                  <Row>
                    {allPeoples.map((t) => {
                      return (
                        <div
                          className="peo_item"
                          key={t.id}
                          onClick={() => {
                            this.checkOnePeople(t);
                          }}
                          onMouseDown={() => {
                            this.setState({selectOne: t});
                          }}>
                          {this.renderSelectNums(t.id)}
                          <div className="cover_peo"></div>
                          <img src={this.state.jc_path} />
                          <div className="peo_dec">
                            {t.name}-{t.number}
                          </div>
                        </div>
                      );
                    })}
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
            <Card
              bodyStyle={{paddingTop: 0}}
              style={{width: 335, height: 50}}
              actions={[
                <Radio.Button
                  key={'large'}
                  onClick={() => {
                    this.setState({showAllPeo: false});
                  }}
                  value="large">
                  确定
                </Radio.Button>
              ]}></Card>
          </div>
        </Row>
      </div>
    );
  }
}

const GridRaid = connect()(_GridRaid);

export default Form.create()(GridRaid);

// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/GridRaid.js
