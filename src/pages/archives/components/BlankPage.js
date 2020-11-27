//奖励事项
import React, { Component } from 'react';
class BlankPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentIndex: nextProps.currentIndex,
    });
  }
  render() {
    const { currentIndex } = this.state;
    return (
      //   <div className="book-box">
      //     <div className="">
      //       <div className="book-cont">
      //         <div style={{ textAlign: 'center', lineHeight: '100%' }}>已经是最后一页了</div>
      //       </div>
      //     </div>
      //     <div className="page-foot">
      //       <span className="page-numb">{currentIndex}</span>
      //     </div>
      //   </div>
      <div className="cover-main">
        <i className="crease"></i>
      </div>
    );
  }
}
export default BlankPage;
