/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import SiderMenu from 'components/view/common/SiderMenu';

const { Sider } = Layout;

class SliderCustom extends Component {
   constructor(props){
    super(props)
    this.state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
   }
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    //    this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const { pathname } = props.location;
        let menuUrl = pathname;
        if(pathname.includes('Add')){
          menuUrl = pathname.substr(0,pathname.lastIndexOf('Add'));
        }
        this.setState({
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: menuUrl
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render() {
        const { menus , collapsed} = this.props;
        return (
            <Sider
                trigger={null}
                width={200}
                breakpoint="lg"
                collapsed={collapsed}
                style={{ background: 'rgb(53,64,82)' ,overflowY:'auto',height:'100%',overflowX:'hidden'}}
            >
                <SiderMenu
                    menus={menus}
                    onClick={this.menuClick}
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.firstHide ? null : [this.state.openKey]}
                    onOpenChange={this.openMenu}
                    style={{height: '100%', borderRight: 0}}
                />
            </Sider>
        )
    }
}

export default withRouter(SliderCustom);