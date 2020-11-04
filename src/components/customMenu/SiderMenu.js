import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem = ({ id, key, title, icon, pathname, ...props }) => {
  if (pathname.split('/').length == 1) {
    pathname = ('/view/404' + Math.random()).split('.').join('');
  }
  return (
    <Menu.Item className="asd" key={key || pathname} {...props}>
      <Link to={pathname}>
        {icon && <Icon type={icon} />}
        <span className="nav-text">{title}</span>
      </Link>
    </Menu.Item>
  );
};

const renderSubMenu = ({ id, key, title, icon, pathname, sub, ...props }) => (
  <Menu.SubMenu
    key={key || pathname}
    title={
      <span>
        {icon && <Icon type={icon} />}
        <span className="nav-text">{title}</span>
      </span>
    }
    {...props}
  >
    {sub && sub.map((item) => renderMenuItem(item))}
  </Menu.SubMenu>
);

export default ({ menus, ...props }) => (
  <Menu {...props}>
    {menus && menus.map((item) => (item.sub && item.sub.length ? renderSubMenu(item) : renderMenuItem(item)))}
  </Menu>
);
