/*
    更新分类的form组件
*/
import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

export default class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef()

    UNSAFE_componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render() {
        const {categoryName} = this.props
        return (
            <Form ref={this.formRef} initialValues={{categoryName}}>
                <Item name='categoryName' rules= {[
                    {required: true, whitespace: true, message: '请输入分类名称'}
                ]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}