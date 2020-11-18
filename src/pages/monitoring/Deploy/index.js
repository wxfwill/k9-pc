import React,{ Component } from 'react';
import { Row, Col, Card , Tag} from 'antd';
import { Route } from 'react-router-dom';
import DeploySearch from 'components/view/searchForm/DeploySearch';
import DeployTable from 'components/view/tables/DeployTable';


class Deploy extends Component{
  constructor(props){
    super(props);
    this.state ={
      
    }
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['指挥作战', '紧急调配'] });
  }
  limit = (filter) => {
    this.setState({
      ...filter,
    })
  }
  render(){
    const { match } = this.props; 
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card title='按条件搜索' bordered={false}>
                <DeploySearch limit={this.limit} />
              </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <DeployTable match={match} filter={this.state} />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Deploy;