/*
    品类管理路由
*/
import React, {Component} from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategories, reqUpdateCategory, reqAddCategory} from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {
    state = {
        loading: false, // 是否正在获取数据中
        categories: [], // 一级分类列表
        subCategories: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类Id
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }
    
    constructor(props) {
        super(props)
        this.initColumns()
    }

    /*
        初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',  // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数体内调用处理的函数并传入数据 */}
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton> : null}
                    </span>
                ),
            },
        ]
    }

    /*
        异步获取分类列表显示
    */
    getCategories = async (parentId) => {
        // 发送请求前，显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)
        // 获取响应后，隐藏loading
        this.setState({loading: false})
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') { // 一级分类列表
                this.setState({categories})
            } else { // 二级分类列表
                this.setState({subCategories: categories})
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*
        显示指定一级分类对象的二级子列表
    */
    showSubCategories = category => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            this.getCategories()
        })
    }

    /*
        显示一级分类列表
    */
    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    /*
        响应点击取消
    */
    handleCancel = () => {
        // 重置表单数据（效果滞后）
        if (this.addForm) {
            this.addForm.current.resetFields()
        } else {
            this.updateForm.current.resetFields()
        }
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    /*
        显示添加的确认框
    */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /*
        添加分类
    */
    addCategory = async () => {
        const values = await this.addForm.current.validateFields()
        // 1、隐藏确认框
        this.setState({showStatus: 0})
        // 收集数据
        const {parentId, categoryName} = values
        // 清除输入数据
        this.form.current.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
            if (parentId === this.state.parentId) { // 添加的分类就是当前分类列表下的分类
                this.getCategories()
            } else if (parentId === '0') { // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示
                this.getCategories('0')
            }
        }
    }

    /*
        显示更新的确认框
    */
    showUpdate = category => {
        // 保存分类对象
        this.category = category
        this.setState({
            showStatus: 2
        })
    }
    
    /*
        更新分类
    */
    updateCategory = async () => {
        const values = await this.updateForm.current.validateFields()
        // 1、隐藏确认框
        this.setState({showStatus: 0})
        // 2、发送请求
        const categoryId = this.category._id
        const {categoryName} = values // this.form.current.getFieldValue('categoryName')
        console.log(`updateCategory-categoryName ${categoryName}`)
        // 重置表单数据
        this.form.current.resetFields()
        const result = await reqUpdateCategory({categoryName, categoryId})
        if (result.status === 0) {
            // 3、重新显示列表
            this.getCategories()
        }
    }

    componentDidMount() {
        this.getCategories()
    }

    render () {
        const {categories, subCategories, parentId, parentName, loading, showStatus} = this.state
        const category = this.category || {}
        // console.log('render()' + category.name)
        // 左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: 5}} />
                <span>{parentName}</span>
            </span>
        )
        // 右侧标题
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered 
                    rowKey='_id' 
                    loading={loading} 
                    columns={this.columns} 
                    dataSource={parentId==='0' ? categories : subCategories} 
                    pagination={{pageSize: 8, showQuickJumper: true}}   
                />
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categories={categories} parentId={parentId} setForm={form => this.addForm = form} />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    {/* 这里需要特别注意 */}
                    {/* {category.name ? (<UpdateForm categoryName={category.name} setForm={form => this.updateForm = form} />) : null} */}
                    <UpdateForm categoryName={category.name} setForm={form => this.updateForm = form} />
                </Modal>
            </Card>
        )
    }
}