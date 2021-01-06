import React, {Component} from 'react';
import {Upload, Icon, message} from 'antd';
import {connect} from 'react-redux';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(
  (state) => ({token: state.loginReducer.token})
  // (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class CustomUpload extends React.Component {
  state = {
    loading: false,
    imageUrl: (() => {
      if (this.props.photoUrl) {
        return `${process.env.BASE_URL}/api/user/showImg?fileName=${this.props.photoUrl}`;
      }
      return null;
    })(),
    file: null,
    icon: null
  };
  componentDidMount() {
    // ;
  }
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('图片格式错误');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大不超过2M!');
    }
    window.File = false;
    const formData = new FormData();
    formData.append('file', file);
    this.setState({
      formData,
      file
    });
    return isJpgOrPng && isLt2M;
  };
  handleCustomRequest = (option) => {
    const {onSuccess, onError, file, onProgress} = option;
    const param = new FormData();
    param.append('file', file);
    React.$ajax.postData('/api/user/uploadImg', param).then((res) => {
      this.setState({loading: false});
      if (res && res.code == 0) {
        onSuccess(res, file);
        message.success('上传成功');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.setState({imageUrl: reader.result});
          this.props.parent.getchildmsg(res.data);
        });
        reader.readAsDataURL(file);
      } else {
        message.success('上传失败');
      }
    });
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
    }
  };
  setSvg = (url) => {};
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{this.state.loading ? '上传中' : '开始上传'}</div>
      </div>
    );
    const {imageUrl} = this.state;
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={this.handleCustomRequest}
        accept=".png, .jpg, .jpeg"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}>
        {imageUrl ? <img src={imageUrl} alt="icon" style={{width: '100%', height: '88px'}} /> : uploadButton}
      </Upload>
    );
  }
}

export default CustomUpload;
