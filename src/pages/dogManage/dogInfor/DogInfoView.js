import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Table,Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal, AutoComplete, Divider, Tag,Collapse } from 'antd';
import moment from 'moment';
import _ from 'underscore';

import "style/app/dogInfo/dogInfoView.less"

const Panel = Collapse.Panel;

class DogInfoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reproduceList: [],
            breedList: [],
            treeList: [],
            vaccineList: [],
            dogInfo:{},
            isBreed: false
        }
        this.dogId = sessionStorage.getItem("dogId");
    }
    componentDidMount() {
        this.getFamilyTree();
        this.getDogInfo();
        // this.getReproduce();
        // this.getBreed();
        this.getVaccineList();
    }
    getDogInfo = () => {
        React.$ajax.postData('/api/dog/info', {id: this.dogId}).then((res) => {
            this.setState({dogInfo: res.data});
            if(res.data.sex == 1) {
                this.setState({isBreed: true}, this.getReproduce());
                
            } else {
                this.setState({isBreed: false}, this.getBreed())
            }
        })
    }
    ///api/breed/闪电stReproduceByDogId // 繁殖记录
    getReproduce = () => {
        React.$ajax.postData('/api/breed/listReproduceByDogId', {dogId: this.dogId}).then((res) => {
            this.setState({reproduceList: res.data})
        })
    }
    // listBreedRecordByDogId 
    getBreed = () => {
        React.$ajax.postData('/api/breed/listBreedRecordByDogId', {dogId: this.dogId}).then((res) => {
            this.setState({breedList: res.data})
        })
    }
    // /api/dog/getLineageByDogId
    getFamilyTree = () => {
        React.$ajax.postData('/api/dog/getLineageByDogId', {id: this.dogId}).then((res) => {
            this.setState({treeList: res.data})
        });
    }
    // /api/vaccineRecord/listVaccineRecordByDogId
    getVaccineList = () => {
        React.$ajax.postData('/api/vaccineRecord/listVaccineRecordByDogId', {dogId: this.dogId}).then((res) => {
            this.setState({vaccineList: res.data})
        });
    }
    render() {
        const {reproduceList, breedList, vaccineList, dogInfo,treeList} = this.state;
        const reproduceColumns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '公犬名称',
            dataIndex: 'femaleDog',
            key: 'id',
            render: (record) => record.name
          }, {
            title: '产仔时间',
            dataIndex: 'breedTime',
            key: 'breedTime',
            render: record => moment(record).format('YYYY-MM-DD')
          }, {
            title: '产仔数',
            dataIndex: 'id',
            key: 'id',
            render: (record, index) => { return index.femaleChlNumber+index.maleChlNumber }
          }, {
            title: '仔犬公母犬数',
            dataIndex: 'id',
            key: 'id',
            render: (record, index) => {return `${index.femaleChlNumber}公${index.maleChlNumber}母`}
          }, {
            title: '繁衍期',
            dataIndex: 'period',
            key: Math.random(),
          }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
          }];

        const breedColumns = [{
            title: '序号',
            dataIndex: 'id',
            key: Math.random(),
          }, {
            title: '母犬名称',
            dataIndex: 'femaleDog',
            key: Math.random(),
            render: (record) => record.name
          }, {
            title: '产仔时间',
            dataIndex: 'estrusTime',
            key: Math.random(),
            render: record => moment(record).format('YYYY-MM-DD')
          }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
          }];
          const VaccineColumns = [{
            title: '序号',
            dataIndex: 'id',
            key: Math.random(),
          }, {
            title: '药物名称',
            dataIndex: 'vaccineType',
            key: Math.random(),
          }, {
            title: '注射时间',
            dataIndex: 'vaccineTime',
            key: Math.random(),
            render: record => moment(record).format('YYYY-MM-DD')
          },];
        return <div>
        <Row gutter={24}>
            <Col span={24}>
                <Card  bordered={true}>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="犬只信息" key="1">
                    {

                    ! _.isEmpty(dogInfo) ?  <div className="dog_info_view">

                        <img src={`${config.apiUrl}/api/dog/img?id=${this.dogId}`} />
                        <div className="fold_info" >
                            <div className="fold_h1">{`${dogInfo.name}-${dogInfo.breedName}-${dogInfo.number}`}</div>
                            <div className="fold_dec">
                                <div className="dec_content">
                                    <span className="dec_label">性别：{dogInfo.sex ? dogInfo.sex == 1?'公':'母' : ''}</span>
                                    <span  className="dec_label">出生日期：{dogInfo.birthdayStr}</span>
                                    <span  className="dec_label">训导员：{`${dogInfo.trainerName}-${dogInfo.trainerNumber}`}</span>
                                </div>
                                <div className="dec_content">
                                    <span  className="dec_label">芯片号：{dogInfo.chipCode}</span>
                                    <span  className="dec_label">服役单位：{dogInfo.serviceUnitName}</span>
                                    <span  className="dec_label"></span>
                                </div>
                            </div>
                            <div className="unfold_dec">
                                <div className="dec_content">
                                    <span className="dec_label">手环：{dogInfo.braceletName}</span>
                                    <span  className="dec_label">犬只毛色：{dogInfo.colorName}</span>
                                    <span  className="dec_label">犬只毛型：{dogInfo.woolTypeName}</span>
                                </div>
                                <div className="dec_content">
                                    <span className="dec_label">外貌特征：{dogInfo.appearance}</span>
                                    <span  className="dec_label">犬舍：{dogInfo.roomName}</span>
                                    <span  className="dec_label">训练等级：{dogInfo.trainingLevelStr}</span>
                                </div>
                                <div className="dec_content">
                                    <span className="dec_label">种犬等级：{dogInfo.studLevelStr}</span>
                                    <span  className="dec_label">近交系数：{dogInfo.inbreedingCoefficient}</span>
                                    <span  className="dec_label">繁殖单位：{dogInfo.breedUnit}</span>
                                </div>
                                <div className="dec_content">
                                    <span className="dec_label">犬只归属：{dogInfo.originStr}</span>
                                    <span  className="dec_label">服役状态：{dogInfo.serviceStatusStr}</span>
                                    <span  className="dec_label">直系亲属：{`父：${dogInfo.fatherName}母：${dogInfo.motherName}`}</span>
                                </div>
                                <div className="dec_content">
                                    <span className="dec_label">备注：{dogInfo.remark}</span>
                                    <span className="dec_label">体检表：{
                                        dogInfo.medicalReportName == 'none'?'':<a href={'/api/dog/dlmedicalReport?id='+dogInfo.id} 
                                    target="_blank" rel="noopener noreferrer">{dogInfo.medicalReportName}</a>
                                    }
                                    </span>
                                    <span  className="dec_label"></span>
                                </div>
                            </div>
                        </div>
                    </div>:''
                    }
                    </Panel>
                    <Panel header="血统图谱" key="2">
                    {
                        treeList.length>0?<Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="血统图谱" key="1">
                            <div className="family_tree">
                                <div className="father_tree">
                                <span className="fParent spanOverflow">{treeList[0]&&treeList[0].fParent}</span>
                                    <div className="tree_bg">
                                        <span className="tree_bg_top second_overflow">{treeList[0]&&treeList[0].father}</span>
                                        <span className="tree_bg_bot second_overflow">{treeList[0]&&treeList[0].mother}</span>
                                    </div>  
                                    <div className="tree_bg second_tree">
                                        <span className="tree_bg_top second_tree_inner" style={{width: 'maxContent'}}>{treeList[0]&&treeList[0].fFather}</span>
                                        <span className="tree_bg_bot second_tree_inner" style={{width: 'maxContent'}}>{treeList[0]&&treeList[0].fMother}</span>
                                    </div> 
                                    <div className="tree_bg three_tree">
                                        <span className="tree_bg_top second_tree_inner" style={{width: 'maxContent'}}>{treeList[0]&&treeList[0].mFather}</span>
                                        <span className="tree_bg_bot second_tree_inner" style={{width: 'maxContent'}}>{treeList[0]&&treeList[0].mMother}</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="family_tree">
                                <div className="father_tree">
                                <span className="fParent spanOverflow">{treeList[1]&&treeList[1].mParent}</span>
                                    <div className="tree_bg">
                                        <span className="tree_bg_top second_overflow">{treeList[1]&&treeList[1].father}</span>
                                        <span className="tree_bg_bot second_overflow">{treeList[1]&&treeList[1].mother}</span>
                                    </div>  
                                    <div className="tree_bg second_tree">
                                        <span className="tree_bg_top second_tree_inner" style={{width: 'maxContent'}}>{treeList[1]&&treeList[1].fFather}</span>
                                        <span className="tree_bg_bot second_tree_inner" style={{width: 'maxContent'}}>{treeList[1]&&treeList[1].fMother}</span>
                                    </div> 
                                    <div className="tree_bg three_tree">
                                        <span className="tree_bg_top second_tree_inner" style={{width: 'maxContent'}}>{treeList[1]&&treeList[1].mFather}</span>
                                        <span className="tree_bg_bot second_tree_inner" style={{width: 'maxContent'}}>{treeList[1]&&treeList[1].mMother}</span>
                                    </div> 
                                </div>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>:''
                    }
                    </Panel>
                    <Panel header="繁育记录" key="3">
                        <Tabs defaultActiveKey="1">
                        {
                            this.state.isBreed ?  <Tabs.TabPane tab="繁育记录" key="1">
                            <Table dataSource={reproduceList} columns={reproduceColumns} pagination={false} />
                            </Tabs.TabPane> : <Tabs.TabPane tab="配种记录" key="1">
                                <Table dataSource={breedList} columns={breedColumns} pagination={false} />
                            </Tabs.TabPane>
                        }  
                        </Tabs>
                    </Panel>
                    <Panel header="防治记录" key="4">
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="防治记录" key="1">
                            <Table dataSource={vaccineList} columns={VaccineColumns} pagination={false} />
                            </Tabs.TabPane>
                        </Tabs>
                    </Panel>
                </Collapse>    
                </Card>
            </Col>
        </Row>

                </div>
    }
}

export default DogInfoView;


// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogInfor/DogInfoView.js