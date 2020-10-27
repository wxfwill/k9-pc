import React,{Component} from 'react';
import classNames from 'classnames';
import {Link ,withRouter} from 'react-router-dom';
import { Layout, Menu, Icon ,Row , Col ,Badge, Button, message} from 'antd';
import httpAjax from 'libs/httpAjax';
const { Header } = Layout;
const SubMenu = Menu.SubMenu;


class HeaderComponent extends Component{
	constructor(props){
		super(props);
	}
	menuClick(data){
		let { history } = this.props;
		let { item, key, keyPath } = data;
		if(key=="logout"){
			let hide = message.loading('正在退出系统...', 0);
			httpAjax('post',config.apiUrl+'/api/userCenter/logout').then((res)=>{
      	if(res.code==0){
      		hide();
      		util.cookieUtil.unset('token');
      		history.push('/');
      	}
      }).catch(function(err){
        console.log(err)
      })
		}
	}
	render(){
		const {logoSrc,logoText} = this.props.headerMsg;
		const { name } = this.props.loginState;
		const { toggleCollapsed } = this.props;
		return(
			<Header className="header">
	      <div className="logo">
	        <Row
	          //align='middle'
	          type="flex" 
	          justify="space-between"
	        >
	          <Col span={18} >
	            <img  src={ logoSrc } alt="logo"/>
	            <Button type="primary" className="collapsed" onClick={toggleCollapsed}>
          			<Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
        			</Button>
	          </Col>
	          <Col>
	            <Menu
	              mode="horizontal"
	              className={classNames('usermsg')}
	              onClick={this.menuClick.bind(this)}
	            > 
	              <Menu.Item key="notification">
	                <Link to="/todo"><Badge  count={7}><Icon type="notification" /></Badge></Link>
	              </Menu.Item>
	              <SubMenu title={<span> <Icon type="user" />{name}</span>}>
	                <Menu.Item key="profile">
	                  <Link to="/profile">资料</Link>
	                </Menu.Item>
	                <Menu.Item key="logout">
	                  <Icon type="poweroff" />
	                  注销
	                </Menu.Item>
	              </SubMenu>
	            </Menu>
	          </Col>
	        </Row>
	      </div>
	    </Header>
		)
	}
}

export default withRouter(HeaderComponent);