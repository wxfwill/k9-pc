import React,{ Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Card, Row, Col, Avatar, Checkbox, List, Spin, Divider, Badge, Tag, Tooltip  } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';

import 'style/app/dogManage/breedinfo.less'
class Breedinfo extends Component{
  constructor(props){
    super(props);
    this.state= {
      breedList: [],
      pageSize:5,
      currPage:1,
      data: [],
      totalPage:0
    }
  }
  componentDidMount() {
      this.getBreedList()
  }

  getBreedList = (params = {pageSize:this.state.pageSize,currPage:this.state.currPage}) => {
    const breed = this.props.location.pathname.indexOf('breed')>0;
    const url = breed? '/api/breed/listPage':  '/api/breed/listReproducePage';
      httpAjax('post',config.apiUrl+url, params).then((res) => {
            this.setState({breedList: [...this.state.breedList, ...res.list], totalPage: res.totalPage})
        
      })
  }
  deleteItem = (item) => {
    // deleteReproduceByIds
    const breed = this.props.location.pathname.indexOf('breed')>0;

    httpAjax('post',config.apiUrl+`/api/breed/${breed?'deleteBreedByIds':'deleteReproduceByIds'}`, {ids:[item.id]}).then((res) => {
    if(res.code ==0 ) {
        message.info('删除成功！')
        this.setState({
            breedList: [],
            currPage: 1,
        }, this.getBreedList({pageSize: this.state.pageSize, currPage: 1}))
    } else {
        message.error('删除失败！')
    }
  })
  }
  loadMore = () => {
    const {currPage,pageSize} = this.state;
    this.setState({currPage: currPage+1}, this.getBreedList({
        currPage: currPage+1,
        pageSize,
    }))
  }
  renderDogList = (type='maleDog',dogInfo) => {
    if(type=='maleDog') {
        return [ <img src={`${config.apiUrl}/api/dog/img?id=${dogInfo.id}`} />,
        <div className="left_dec">
            <div className="left_h">{dogInfo.name ? dogInfo.name :'--'}</div>
            <div className="">性别：公</div>
            <div className="">品种：{dogInfo.breed ? dogInfo.breed :'--'}</div>
            <div className="">出生日期：{dogInfo.birthday?moment(dogInfo.birthday).format('YYYY-MM-DD'):'--'}</div>
            <div style={{marginLeft:'-90px'}}>芯片号：{dogInfo.chipCode?dogInfo.chipCode:'--' }</div>
        </div>]
    } else {
        return [ <img src={`${config.apiUrl}/api/dog/img?id=${dogInfo.id}`} />,
        <div className="left_dec">
            <div className="left_h">{dogInfo.name ? dogInfo.name :'--'}</div>
            <div>性别：母</div>
            <div>品种：{dogInfo.breed ? dogInfo.breed :'--'}</div>
            <div>出生日期：{dogInfo.birthday?moment(dogInfo.birthday).format('YYYY-MM-DD'):'--'}</div>
            <div style={{marginLeft:'-90px'}}>芯片号：{dogInfo.chipCode?dogInfo.chipCode:'--' }</div>
        </div>]
    }
  }
  
  renderExtra = (item) => {
    const breed = this.props.location.pathname.indexOf('breed')>0;
    if(breed) {
        return  [<Link to={{pathname: '/app/dog/breedEdit', query: {editItem: item }}}><Button  type='primary' style={{marginRight: 10}}>编辑信息</Button></Link>,  
        <Popconfirm title='确认删除此信息?'onConfirm={()=>this.deleteItem(item)}><Button>删除</Button></Popconfirm>]
    } else {
        return  [//<Link to={{pathname: '/app/dog/reproduceEdit', query: {editItem: item }}}><Button  type='primary' style={{marginRight: 10}}>编辑繁育信息</Button></Link>,
        <Link to={{pathname: `/app/dog/reproduceEdit/${item.id}`, query: {editItem: item }}}><Button  type='primary' style={{marginRight: 10}}>编辑幼犬信息</Button></Link>,  
        <Popconfirm title='确认删除此信息?'onConfirm={()=>this.deleteItem(item)}><Button>删除</Button></Popconfirm>]
    }
   
  }
  renderMid = (item) => {
    const breed = this.props.location.pathname.indexOf('breed')>0;
    if(breed) {
        return  <div className="card_right">
        <div className="breed_l">配种地点：{item.place}</div>
        <div className="breed_l">配种时间：{item.breedTime?moment(item.breedTime).format('YYYY-MM-DD'):'--'}</div>
        <div className="breed_l">母犬发情时间：{item.estrusTime?moment(item.estrusTime).format('YYYY-MM-DD'):'--'}</div>
    </div>
    } else {
        return  <div className="card_right reproduce_c_right">
            <div>
                <span className="reproduce_tag">出生日期：{item.birthday?moment(item.birthday).format('YYYY-MM-DD'):'--'}</span>
                <span className="reproduce_tag">繁衍期：{item.period}</span>
                <span className="reproduce_tag">仔犬公母数：{this.mapDogChild(item.pupInfos, 'str')}</span>
            </div>
        
        <div>
        {this.mapDogChild(item.pupInfos)}
        </div>
    </div>
    }
  }

  mapDogChild = (list, type) => {
      let str1 = 0, str0 = 0;
    const nameArr = list.map((t) => {
        if(t.sex == 1) {
            str1++;
        } else {
            str0++;
        }
        return  <Tag key={t.id}>{t.name}</Tag>;
    });
    if(type=='str') {
        return `${str1}公${str0}母`
    }
    return nameArr
  }

  renderList = (list) => {
     const breed = this.props.location.pathname.indexOf('breed')>0;
    return  list.map((item) => {
        return <Col xl={24} lg={24} md={24} sm={24} xs={24} key={item.id+'breed'}>
        <Card bordered={true}
        style={{marginBottom: 10}}
         title={breed?`${item.maleDog.name}配种记录`:`${item.femaleDog.name}繁育记录`}
         extra={this.renderExtra(item)}
         bodyStyle={{padding:0, }}
        >
        <div className="card_body">
            <div className="card_left">
               {breed?this.renderDogList('maleDog', item.maleDog):this.renderDogList('femaleDog', item.femaleDog ?item.femaleDog : {"id":item.femaleDogId})}
            </div>
               
            {this.renderMid(item)}

            <div className="card_left" style={{position: 'absolute',top:0,right: 0,border: 'none',borderLeft: '1px solid #ccc'}}>
            {breed?this.renderDogList('femaleDog', item.femaleDog ?item.femaleDog : {"id":item.femaleDogId} ):this.renderDogList('maleDog', item.maleDog)}
            </div>
        </div>
        </Card>
      </Col>
      })
  }
  render(){
      const breed = this.props.location.pathname.indexOf('breed')>0;
    return (
      <div className="DutyComponent Officer breedInfo">
       <div style={{marginBottom:'20px'}}>
            <Button type='primary' style={{marginRight:'20px'}}>
                <Link to={{pathname: `/app/dog/${breed?'breedAdd':'reproduceAdd'}`, query: {targetText:'新增' }}}>{breed? '新增配种记录':'新增繁殖记录' }</Link>
            </Button>
        </div>
        <Row gutter={24}>
        {this.renderList(this.state.breedList)}
          {
            this.state.totalPage <= this.state.currPage ? '': <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {this.state.loading &&  <Spin />} <Button onClick={this.loadMore}>加载更多</Button> </div>
        }
        {
            this.state.breedList.length == 0 ? <div style={{ textAlign: 'center', color:'#999', marginTop: 12, height: 32, lineHeight: '32px' }}> 暂无数据</div>:''
        }
        </Row>
      </div>
    )
  }
}

export default Breedinfo;


// WEBPACK FOOTER //
// ./src/components/admin/dogManage/breed/BreedInfo.js