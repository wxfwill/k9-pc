import React, {Component} from 'react';
import {Modal, Button} from 'antd';

/**查看视频播放对话框 */
// const v1 = require("images/video/10112.mp4");
// const v2 = require("images/video/102.mp4");
class VideoCameraDlg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  getInitialState() {
    return {visible: false};
  }

  handleOk = () => {
    this.setState({
      visible: false,
      videoSource: null
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      videoSource: null
    });
  };

  // viewVideo(v){
  //     let mp4='';
  //     if(v.vid==1){
  //         mp4=v1;
  //     }
  //     if(v.vid==2){
  //         mp4=v2
  //     }
  //     this.setState({videoSource:mp4,visible:v.visible});
  // }

  render() {
    return (
      <div>
        <Modal title="查看犬舍视频" visible={this.state.visible} onCancel={this.handleCancel} onOk={this.handleOk}>
          <video
            loop
            height="260"
            width="500"
            ref={(el) => {
              if (el == null) return;
              el.load();
              el.play();
            }}>
            <source src={this.state.videoSource} type={'video/mp4'} />
          </video>
        </Modal>
      </div>
    );
  }
}

export default VideoCameraDlg;

// WEBPACK FOOTER //
// ./src/components/admin/dogHouse/DogHouseCom/VideoCameraDlg.js
