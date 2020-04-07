/**
 * 更新角色权限form组件
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Tree} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends Component {
    static propTyes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    // 为父组件提交获取最新menus数据的方法
    getMenus = () => this.state.checkedKeys

    // 选中某个node时的回调
    onCheck = checkedKeys => {
        console.log('onCheck()', checkedKeys);
        this.setState({checkedKeys});
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render () {
        const {role} = this.props
        // debugger
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15},
        }
        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree 
                    checkable 
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                > 
                    <TreeNode title='平台权限' key='all'>
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}