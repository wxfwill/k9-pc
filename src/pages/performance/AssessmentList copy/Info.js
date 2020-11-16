import React, { Component } from "react";

class Info extends Component {
  render() {
    return (
        <div>
         this is Info page
         <hr />
         id===={this.props.match.params.mainid}
        </div>
    );
  }
}

export default Info;
