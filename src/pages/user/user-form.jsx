import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Select, Input} from 'antd'

const Item = Form.Item
const Option = Select.Option

/**
 * 添加/修改用户的form组件
 */
export default class UserForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }
    
    formRef = React.createRef()
    UNSAFE_componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render() {
        const {roles, user} = this.props
        const formItemLayout = {
            lableCol: {span: 4},
            wrapperCol: {span: 15},
        }
        return (
            <Form ref={this.formRef} {...formItemLayout} initialValues={{
                username: user.username,
                phone: user.phone,
                email: user.email,
                role_id: user.role_id   
            }}>
                <Item label='用户名' name='username' rules={[{required: true, whitespace: true, message: '请输入用户名'}]}>
                    <Input placeholder='请输入用户名' />
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码' name='password' rules={[{required: true, whitespace: true, message: '请输入密码'}]}>
                            <Input type='password' placeholder='请输入密码' />
                        </Item>
                    )
                }
                <Item label='手机号' name='phone' rules={[{required: true, whitespace: true, message: '请输入手机号'}]}>
                    <Input placeholder='请输入手机号' />
                </Item>
                <Item label='邮箱' name='email' rules={[{required: true, whitespace: true, message: '请输入邮箱'}]}>
                    <Input placeholder='请输入邮箱' />
                </Item>
                <Item label='角色' name='role_id' rules={[{required: true, whitespace: true, message: '请选择角色'}]}>
                    <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}