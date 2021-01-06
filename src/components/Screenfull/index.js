import React, {Component} from 'react';
import screenfull from 'screenfull';

class ScreenFull extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true
    };
  }
  componentDidMount() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.changeFullShow);
    }
  }
  componentWillUnmount() {
    screenfull.off('change', this.changeFullShow);
  }
  changeFullShow = () => {
    this.setState({
      isShow: !screenfull.isFullscreen
    });
  };
  handleChangeState = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };
  render() {
    return (
      <div
        className="screen-wrap cursor"
        style={{display: 'inline-block', fill: 'rgba(0, 0, 0, 0.65)', verticalAlign: 'middle', marginLeft: '14px'}}
        onClick={this.handleChangeState}
        title="全屏">
        <svg
          t="1590133227479"
          className="screenfull-svg"
          viewBox="0 0 1024 1024"
          version="1.1"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          style={{display: this.state.isShow ? 'block' : 'none'}}>
          <path id="svg_1" d="m928.512,959.744a32,32 0 0 1 -32,-32l0,-256a32,32 0 0 1 64,0l0,256a32,32 0 0 1 -32,32z" />
          <path
            id="svg_2"
            d="m960.512,927.744a32,32 0 0 1 -32,32l-256,0a32,32 0 0 1 0,-64l256,0a32,32 0 0 1 32,32zm-864.768,-863.488a32,32 0 0 1 32,32l0,256a32,32 0 0 1 -64,0l0,-256a32,32 0 0 1 32,-32z"
          />
          <path id="svg_3" d="m63.744,96.256a32,32 0 0 1 32,-32l256,0a32,32 0 0 1 0,64l-256,0a32,32 0 0 1 -32,-32z" />
          <path
            id="svg_4"
            d="m958.030718,91.777575a32,32 0 0 1 -32,32l-256,0a32,32 0 0 1 0,-64l256,0a32,32 0 0 1 32,32z"
          />
          <path
            id="svg_5"
            d="m926.030718,59.777575a32,32 0 0 1 32,32l0,256a32,32 0 0 1 -64,0l0,-256a32,32 0 0 1 32,-32z"
          />
          <path
            id="svg_6"
            d="m940.622718,69.250038a32,32 0 0 1 0,45.248l-247.936,247.936a32,32 0 0 1 -45.248,-45.248l247.936,-247.936a31.936,31.936 0 0 1 45.248,0z"
          />
          <path
            id="svg_7"
            d="m61.649508,930.478492a32,32 0 0 1 32,-32l256,0a32,32 0 0 1 0,64l-256,0a32,32 0 0 1 -32,-32z"
          />
          <path
            id="svg_8"
            d="m93.649508,962.478492a32,32 0 0 1 -32,-32l0,-256a32,32 0 0 1 64,0l0,256a32,32 0 0 1 -32,32z"
          />
          <path
            id="svg_9"
            d="m79.121508,945.070492a32,32 0 0 1 0,-45.248l247.936,-247.936a32,32 0 0 1 45.248,45.248l-247.936,247.936a32,32 0 0 1 -45.248,0z"
          />
        </svg>
        <svg
          t="1590133734869"
          className="screenfull-svg"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1862"
          width="20"
          height="20"
          style={{display: this.state.isShow ? 'none' : 'block'}}>
          <path
            d="M928.512 959.744a32 32 0 0 1-32-32v-256a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32z"
            fill=""
            p-id="1863"></path>
          <path
            d="M960.512 927.744a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32zM95.744 64.256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0v-256a32 32 0 0 1 32-32z"
            fill=""
            p-id="1864"></path>
          <path
            d="M63.744 96.256a32 32 0 0 1 32-32h256a32 32 0 0 1 0 64h-256a32 32 0 0 1-32-32z"
            fill=""
            p-id="1865"></path>
          <path
            d="M384.064 671.744a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32z"
            fill=""
            p-id="1866"></path>
          <path
            d="M352.064 639.744a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0v-256a32 32 0 0 1 32-32z"
            fill=""
            p-id="1867"></path>
          <path
            d="M366.656 657.216a32 32 0 0 1 0 45.248L118.72 950.4a32 32 0 0 1-45.248-45.248l247.936-247.936a31.936 31.936 0 0 1 45.248 0z"
            fill=""
            p-id="1868"></path>
          <path
            d="M639.616 352.512a32 32 0 0 1 32-32h256a32 32 0 0 1 0 64h-256a32 32 0 0 1-32-32z"
            fill=""
            p-id="1869"></path>
          <path
            d="M671.616 384.512a32 32 0 0 1-32-32v-256a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32z"
            fill=""
            p-id="1870"></path>
          <path
            d="M657.088 367.104a32 32 0 0 1 0-45.248l247.936-247.936a32 32 0 0 1 45.248 45.248l-247.936 247.936a32 32 0 0 1-45.248 0z"
            fill=""
            p-id="1871"></path>
        </svg>
      </div>
    );
  }
}

export default ScreenFull;
