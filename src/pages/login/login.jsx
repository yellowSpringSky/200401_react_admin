import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';

import './login.less';
import logo from '../../assets/images/logo.png';
import {reqLogin} from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

/*
    登录的路由组件
*/
class Login extends Component {
       
    render () {
        // 如果用户已经登陆，自动跳转到管理界面
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to='/' />;
        }

        this.formRef = React.createRef();

        const onFinish = async values => {
            // console.log('Finish:', values);
            const {username, password} = values;
            const result = await reqLogin(username, password);// {status: 0, data: } {status: 1, msg: 'xxx'}
            if (result.status === 0) {
                message.success('登陆成功');
                
                const user = result.data;
                memoryUtils.user = user; // 保存在内存
                storageUtils.saveUser(user); // 保存在local

                // 跳转到管理页面（不需要回退到登录界面）
                this.props.history.replace('/');
            } else {
                message.error(result.msg);
            }
        };

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="login"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登陆</h2>
                    <Form ref={this.formRef} name="control-ref" className="login-form" initialValues={{ username: 'admin' }} onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[
                                {required: true, whitespace: true, message: '请输入用户名!',},
                                {min: 4, message: '用户名最少4位!',},
                                {max: true, message: '用户名最多12位!',},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成!'}
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        // console.log(`value: ${value}`);
                                        if (!value) {
                                            return Promise.reject('密码必须输入!');
                                        } else if (value.length < 4) {
                                            return Promise.reject('密码长度不能小于4位!');
                                        } else if (value.length > 12) {
                                            return Promise.reject('密码长度不能大于12位!');
                                        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                            return Promise.reject('密码必须是英文、数字或下划线组成!');
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                }),
                            ]}
                        >
                            <Input 
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                登陆
                            </Button>
                        )}
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

export default Login;

/*
    1、前台表单验证
    2、收集表单输入数据
*/