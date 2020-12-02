//悬浮目录
import React, { Component } from 'react';
import { Icon } from 'antd';
import 'style/pages/archives/components/SearchDate.less';
class SearchDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
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

  setIsShow = () => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  render() {
    const { isShow, opacity } = this.state;
    return (
      <div className="search-date" style={{ opacity: opacity }}>
        <Icon type="calendar" onClick={this.setIsShow} />
      </div>
    );
  }
}
export default SearchDate;
