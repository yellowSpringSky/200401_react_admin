/*
    添加分类的form组件
*/
import React, {Component} from 'react';
import {Form, Input, Select} from 'antd';
import PropTypes from 'prop-types';


const Item = Form.Item;
const Option = Select.Option;

export default class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        categories: PropTypes.array.isRequired, // 一级分类的数组
        parentId: PropTypes.string.isRequired   // 父分类的ID
    }

    formRef = React.createRef();

    UNSAFE_componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render() {
        const {categories, parentId} = this.props
        return (
            <Form ref={this.formRef} initialValues={{parentId}}>
                <Item name='parentId'>
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categories.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item name='categoryName' rules= {[
                    {required: true, whitespace: true, message: '请输入分类名称'}
                ]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}