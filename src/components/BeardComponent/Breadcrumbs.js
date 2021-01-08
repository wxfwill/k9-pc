import React from 'react';
import {withRouter} from 'react-router-dom';
import BreadcrumbsHoc from './IndexHoc';
import routerArr from '../../router/allRouter';
import {is, fromJS} from 'immutable';
require('style/view/common/Breadcrumbs.less');

const BreadcrumbsComponent = ({breadcrumbs}) => {
  console.log(breadcrumbs);
  return breadcrumbs.length > 1 ? (
    <div className="customBread">
      <span className="leftBlue"></span>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.props.path} className="txt">
          {/* <Link to={breadcrumb.props.path}>{breadcrumb}</Link> */}
          {breadcrumb}
          {index < breadcrumbs.length - 1 && <i> / </i>}
        </span>
      ))}
    </div>
  ) : null;
};

function blArr(arr) {
  let res = [];
  arr.map((item) => {
    res.push(item.props);
  });
  return res;
}

function shouldRender(nextProps, prevState) {
  let ImnextProps = fromJS(blArr(nextProps.breadcrumbs));
  let ImprevState = fromJS(blArr(prevState.breadcrumbs));
  if (is(ImnextProps, ImprevState)) {
    return true;
  }
  return false;
}

let MemoCom = React.memo(BreadcrumbsComponent, shouldRender);

const Breadcrumbs = withRouter((props) => {
  const {location} = props;
  return BreadcrumbsHoc(location, routerArr)(MemoCom);
});

export default Breadcrumbs;

// export default React.memo(Breadcrumbs, shouldRender);
