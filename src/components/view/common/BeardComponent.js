import React from 'react';
import { Breadcrumb, Icon ,message ,Tag } from 'antd';

require('style/view/common/beard.less');
const BeardComponent = ({location , menus, history }) => {
  const breads = [];
  let showBack = false;
  let isntIndex = !location.pathname.includes('index');
  let isMap = !location.pathname.includes('grid');
  menus.forEach(function(item,index){
    if(item.pathname&&item.pathname==location.pathname){
      breads.push({name: item.title}) 
    }else{
      item.sub&&item.sub.forEach(function(list,indexs){
        if(list.pathname&&list.pathname==location.pathname){
          breads.push({name: list.title});
        }else if(location.pathname==`${list.pathname}Add`){
          breads.push({name:`${list.title}-新增`});
          showBack = true;
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
