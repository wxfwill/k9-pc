import React from 'react';
import { Breadcrumb, Icon ,message ,Tag } from 'antd';

require('style/view/common/beard.less');
const BeardComponent = ({location , menus, history }) => {
  const breads = [];
  let showBack = false;
  let pageArr = ['Schedule','Detail','AddUser','UserData','EditUser','Add','View','Edit','Todo'];
  let isntIndex = !location.pathname.includes('index');
  let isMap = !location.pathname.includes('grid');
  let cacheKey = '';
  let jumpObj={
    Schedule:'智能排班',
    Detail:'详情',
    AddUser:'新增',
    UserData:'详情',
    EditUser:'编辑',
    Add:'新增',
    View:'查看',
    Edit:'编辑',
    Todo: '执行',
  }
  function jump(item,text){
    breads.push({name:`${item.title}-${text}`});
    showBack = true;
  }
  function judge(location,item,pageArr){
    for(var i=0,page;page=pageArr[i];i++){
      if(location==item+page){
        cacheKey=page;
        return true
      }
    }
    return false;
  }
  menus.forEach(function(item,index){
    if(item.pathname&&item.pathname==location.pathname){
      breads.push({name: item.title}) 
    }else if(judge(location.pathname,item.pathname,pageArr)){
      jump(item,jumpObj[pageArr[index]]);
    }else{
     
      item.sub&&item.sub.forEach(function(list,indexs){
        if(list.pathname&&list.pathname==location.pathname){
          breads.push({name: list.title});
        }else if(judge(location.pathname,list.pathname,pageArr)){
          jump(list,jumpObj[cacheKey]);
        }
      })  
    }    
  })
  return (
    <div style={{ padding: '10px 25px 10px 0px', letterSpacing: '3px' }}>
      {isntIndex&&isMap?<div>
        <span style={{ float: 'left' }}>
          <span className='nav-icon'></span>
        </span>
        <Breadcrumb style={{float:'left',marginRight:'15px'}}>
          {breads.map((item, key) => { return <Breadcrumb.Item key={key}>{item.name && item.name}</Breadcrumb.Item>})}
        </Breadcrumb>
        {showBack?<Tag color="#2db7f5" onClick={history.goBack}><Icon type="rollback" />返回</Tag>:null}
      </div>:null}
    </div>
  )
}

export default BeardComponent;
