import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import BreadcrumbsHoc from './IndexHoc';
import routerArr from '../../router/allRouter';
require('style/view/common/Breadcrumbs.less');

const BreadcrumbsComponent = ({ breadcrumbs }) => {
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

const Breadcrumbs = withRouter((props) => {
  const { location } = props;
  return BreadcrumbsHoc(location, routerArr)(BreadcrumbsComponent);
});

export default Breadcrumbs;
