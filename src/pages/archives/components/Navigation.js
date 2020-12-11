//悬浮目录
import React, { Component } from 'react';
import { Icon } from 'antd';
import { muluList } from '../localData';
import 'style/pages/archives/components/Navigation.less';
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      opacity: 0,
    };
  }
  componentDidMount() {
    let timer = setTimeout(() => {
      //悬浮目录延迟出现
      this.setState({
        opacity: 1,
      });
      clearTimeout(timer);
    }, 1000);
  }
  //从目录跳转
  jumpDirectory = (e, name) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.jumpDirectory && this.props.jumpDirectory(name);
  };

  setIsShow = () => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  render() {
    const { isShow, opacity } = this.state;
    return (
      <div className="navigation-main" style={{ opacity: opacity }}>
        <Icon type={isShow ? 'close' : 'menu'} onClick={this.setIsShow} />
        {isShow && (
          <ul className="nav">
            {muluList.length > 0
              ? muluList.map((item, index) => {
                  return (
                    <li key={index} onClick={(e) => this.jumpDirectory(e, item.value)}>
                      {item.name}
                    </li>
                  );
                })
              : null}
          </ul>
        )}
      </div>
    );
  }
}
export default Navigation;
