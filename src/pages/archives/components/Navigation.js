//悬浮目录
import React, { Component } from 'react';
import { Icon } from 'antd';
import 'style/pages/archives/components/Navigation.less';
const muluList = [
  { name: '绩效考核信息', value: '绩效考核', isCurrent: true },
  { name: '工作用车信息', value: '工作用车' },
  { name: '出勤用车信息', value: '出勤用车' },
  // { name: '考勤管理信息', value: '考勤管理' },
  { name: '奖励事项信息', value: '奖励事项' },
  { name: '日报信息', value: '日报信息' },
];
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
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
    const { isShow } = this.state;
    return (
      <div className="navigation-main">
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
