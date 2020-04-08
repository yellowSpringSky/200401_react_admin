/*
    用户管理路由
*/
import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
import {PAGE_SIZE} from '../../utils/constants'

export default class User extends Component {
    state = {
        users: [],  // 所有用户列表
        roles: [],  // 所有角色列表
        isShow: false   // 是否显示确认框
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: user => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    /**
     * 根据role的数组，生成包含所有角色名的对象(属性名用角色id值)
     */
    initRoleNames = roles => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, [])
        // 保存
        this.roleNames = roleNames
    }

    /**
     * 显示添加界面
     */
    showAdd = () => {
        this.user = null    // 清除保存的user
        this.setState({isShow: true})
    }

    /**
     * 显示修改界面
     */
    showUpdate = user => {
        this.user = user    // 为更新操作准备数据
        this.setState({isShow: true})
    }

    /**
     * 获取用户列表
     */
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({users, roles})
        }
    }

    /**
     * 删除用户
     */
    deleteUser = user => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            }
        })
    }

    /**
     * 添加或修改用户
     */
    addOrUpdateUser = async () => {
        // 收集数据
        const user = await this.form.current.validateFields()
        this.setState({isShow: false})
        this.form.current.resetFields()
        if (this.user) {    // 更新操作，给user指定_id属性
            user._id = this.user._id
        }
        // 提交请求
        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render () {
        const {users, roles, isShow} = this.state
        const user = this.user || {}

        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{pageSize: PAGE_SIZE}}
                />
                <Modal 
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}    
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.current.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm 
                        setForm={form => this.form = form} 
                        roles={roles}
                        user={user}    
                    />
                </Modal>
            </Card>
        )
    }
}