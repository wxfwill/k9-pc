import React, { Component } from 'react';

class RequestTeamProps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamData: [
        {
          name: '迟到',
          value: '迟到',
        },
        {
          name: '早退',
          value: '早退',
        },
        {
          name: '旷工',
          value: '旷工',
        },
        {
          name: '正常',
          value: '正常',
        },
      ],
    };
  }
  render() {
    return <div className="common-wrap">{this.props.render(this.state)}</div>;
  }
}

export default RequestTeamProps;
