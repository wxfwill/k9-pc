import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import BreadcrumbsHoc from './IndexHoc';
import routerArr from '../../router/allRouter';
require('style/view/common/Breadcrumbs.less');

const BreadcrumbsComponent = ({breadcrumbs, isShowGridMap}) => {
  console.log(isShowGridMap);
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

const Breadcrumbs = withRouter((props) => {
  const {location, isShowGridMap} = props;
  return BreadcrumbsHoc(location, routerArr, isShowGridMap)(BreadcrumbsComponent);
});

const mapStateToProps = (state) => ({
  isShowGridMap: state.commonReducer.isShowGridMap
});
const mapDispatchToProps = () => ({
  // changeNavNameAction: (bread) => dispatch()
});

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
