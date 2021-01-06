import React, {Component} from 'react';

class RequestTeamProps extends Component {
  constructor(props) {
    super(props);
    this.state = {teamData: []};
  }
  componentDidMount() {
    // 查询中队信息
    this.queryAllTeam();
  }
  queryAllTeam = () => {
    React.$ajax.common.queryAllGroups().then((res) => {
      if (res.code == 0) {
        const resObj = res.data;
        const newArr = [];
        for (const key in resObj) {
          const obj = {id: key, name: resObj[key]};
          newArr.push(obj);
        }
        this.setState({teamData: newArr});
      }
    });
  };
  render() {
    return <div className="common-wrap">{this.props.render(this.state)}</div>;
  }
}

export default RequestTeamProps;
