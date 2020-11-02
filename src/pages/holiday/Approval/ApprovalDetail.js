
import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message,Tag,Card,Collapse,Row,Col,Select,DatePicker,Form,Input,Tooltip,Calendar } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import moment from 'moment';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class ApprovalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
         
        }
    }
    componentDidMount(){

    }

    
    render() {
     
        return(
            <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="This is panel header 1" key="1">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <p>{text}</p>
            </Panel>
          </Collapse>)
    }
}

export default ApprovalDetail;


// WEBPACK FOOTER //
// ./src/components/admin/holiday/Approval/ApprovalDetail.js