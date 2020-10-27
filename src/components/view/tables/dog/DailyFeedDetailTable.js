import React,{ Component } from 'react';
import classnames from 'classnames';
export default class DailyFeedDetailTable extends React.Component{

	render(){
		const { changeLeft,detailSource} = this.props;
		return(
			<div className={classnames('off-detail')} style={{left:changeLeft?'360px':'100%'}}>
				<div className="detail-table">  详细 {detailSource.id}</div>
			</div>
		)
	}
}


// WEBPACK FOOTER //
// ./src/components/view/tables/dog/DailyFeedDetailTable.js