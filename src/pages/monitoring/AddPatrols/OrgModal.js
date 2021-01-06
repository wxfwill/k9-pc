import React, {Component} from 'react';
import {Radio, Form, Input, Modal} from 'antd';
const FormItem = Form.Item;
const OrgModal = Form.create()((props) => {
  const {visible, onCancel, onCreate, form} = props;
  const {getFieldDecorator} = form;
  return (
    <Modal visible={visible} title="添加任务来源" okText="Create" onCancel={onCancel} onOk={onCreate}>
      <Form layout="vertical">
        <FormItem label="Title">
          {getFieldDecorator('title', {
            rules: [{required: true, message: 'Please input the title of collection!'}]
          })(<Input />)}
        </FormItem>
        <FormItem label="Description">{getFieldDecorator('description')(<Input type="textarea" />)}</FormItem>
        <FormItem className="collection-create-form_last-form-item">
          {getFieldDecorator('modifier', {
            initialValue: 'public'
          })(
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default OrgModal;

// WEBPACK FOOTER //
// ./src/components/view/monitoring/AddPatrols/OrgModal.js
