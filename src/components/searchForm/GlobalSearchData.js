import React, { Component } from 'react';

class RequestMinxinData extends Component {
  constructor(props) {
    super(props);
    this.state = { teamData: [], userNameArr: [] };
  }
  componentDidMount() {
    // 查询中队信息
    if (this.props.isTeamData) {
      this.queryAllTeam();
    }
    // 查询姓名
    if (this.props.isUserName) {
      this.queryGroupUser('');
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.teamData.length > 0 && nextState.userNameArr.length > 0) {
      return true;
    }
    return false;
  }
  queryGroupUser = util.Debounce(
    (keyword) => {
      React.$ajax.common.queryGroupUser({ keyword }).then((res) => {
        if (res.code == 0) {
          let resObj = res.data;
          let arr = [];
          for (let key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key],
              });
            }
          }
          this.setState({ userNameArr: arr });
        }
      });
    },
    300,
    false
  );
  queryAllTeam = () => {
    React.$ajax.common.queryAllGroups().then((res) => {
      if (res.code == 0) {
        let resObj = res.data;
        let newArr = [];
        for (let key in resObj) {
          let obj = { id: key, name: resObj[key] };
          newArr.push(obj);
        }
        this.setState({ teamData: newArr });
      }
    });
  };
  render() {
    return <div className="common-wrap">{this.props.render(this.state)}</div>;
  }
}

export default RequestMinxinData;
