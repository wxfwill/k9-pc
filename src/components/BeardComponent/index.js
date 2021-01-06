import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router-dom';

const CustomBreadcrumb = (props) => {
  return props.arr.length > 0 ? (
    <div id="Breadcrumb" style={{padding: '10px 25px 10px 24px'}}>
      <Breadcrumb>
        {/* <Breadcrumb.Item>
          <Link to="/index">首页</Link>
        </Breadcrumb.Item> */}
        {props.arr.map((res) => {
          if (typeof res === 'object') {
            return (
              <Breadcrumb.Item key={res.path}>
                <Link to={res.path}>{res.title}</Link>
              </Breadcrumb.Item>
            );
          } else {
            return <Breadcrumb.Item key={res}>{res}</Breadcrumb.Item>;
          }
        })}
      </Breadcrumb>
    </div>
  ) : null;
};

CustomBreadcrumb.propTypes = {
  arr: PropTypes.array.isRequired
};

function shouldRender(nextProps, prevProps) {
  if (nextProps.arr.join() === prevProps.arr.join()) {
    return true;
  }
  return false;
}

export default React.memo(CustomBreadcrumb, shouldRender);
