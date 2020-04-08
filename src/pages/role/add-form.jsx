/**
 * 添加角色form组件
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input} from 'antd'

const Item = Form.Item

export default class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired  // 传递form引用
    }

    form = React.createRef()
    componentWillMount() {
        this.props.setForm(this.form)
    }

    render () {
        const formItemLayout = {
            lableCol: {span: 4},
            wrapperCol: {span: 15}
        }
        return (
            <Form ref={this.form} {...formItemLayout} initialValues={{roleName: ''}}>
                <Item label='角色名称' name='roleName' rules={[
                    {required: true, whitespace: true, message: '角色名称必须输入'}    
                ]}>
                    <Input placeholder='请输入角色名称' />
                </Item>
            </Form>
        )
    }
}