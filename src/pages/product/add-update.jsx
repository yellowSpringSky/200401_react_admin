/*
    商品的添加/更新子路由组件
*/
import React, {Component} from 'react';
import {Card, Form, Input, Button, Cascader, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategories, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input

export default class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    constructor(props) {
        super(props)
        
        // 取出携带的state
        const product = this.props.location.state // 如果是添加则没值，否则有值
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 保存商品
        this.product = product || {}
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categories) => {
        // 根据categories生成options数组
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false   // 不是叶子(暂且这样，之后会更新)
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategories = await this.getCategories(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联对应的一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({options})
    }

    /**
     * 异步获取一级/二级分类列表，并显示
     * async函数的返回值是一个新的promise对象，promise的结果和值有async的结果来决定
     */
    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                return categories   // 返回二级列表 ===> 当前async函数返回的promise就会成功且value为categories
            }
        }
    }
    
    /**
     *  加载下一级列表的回调函数 
     */
    loadData = async (selectedOptions) => {
        // 得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // 显示loading
        targetOption.loading = true
        // 根据选中的分类，请求获取二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategories && subCategories.length > 0) {
            // 生成二级列表
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到一级
            targetOption.children = childOptions
        } else {    // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        // 更新options状态
        this.setState({
            options: [...this.state.options]
        })
    }

    // 验证价格的自定义验证函数
    validatePrice = (_, value) => {
        if (value*1 > 0) {
            return Promise.resolve();
        } else {
            return Promise.reject('价格必须大于0');
        }
    }
    
    // 表单验证通过后提交
    onFinish = async (values) => {
        // 1、收集数据，并封装成product对象
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        if (this.isUpdate) {    // 如果是更新，需要添加_id
            product._id = this.product._id
        }

        // 2、调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3、根据结果显示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
        }
    }

    componentDidMount() {
        this.getCategories('0')
    }

    render () {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        // 用于接收级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {  // 商品是一个一级分类的商品
                categoryIds.push(categoryId)
            } else {    // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2},   // 左侧label的宽度
            wrapperCol: { span: 8}  // 右侧包裹的宽度
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined sytle={{fontSize: 20}} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.onFinish} 
                    initialValues={{
                        name: product.name, 
                        desc: product.desc, 
                        price: product.price,
                        categoryIds
                    }} >
                    <Item label='商品名称' name='name' rules={[
                        {required: true, message: '必须输入商品名称'}
                    ]}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item label='商品描述' name='desc' rules={[
                        {required: true, message: '必须输入商品描述'}
                    ]}>
                        <TextArea placeholder='请输入商品描述' autoSize={{minRows: 2, maxRows: 6}} />
                    </Item>
                    <Item label='商品价格' name='price' rules={[
                        {required: true, message: '必须输入商品价格'},
                        {validator: this.validatePrice}
                    ]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item label='商品分类' name='categoryIds' rules={[ 
                        {required: true, message: '必须指定商品分类'} 
                    ]}>
                        <Cascader placeholder='请指定商品分类' 
                            options={this.state.options}    // 需要显示的列表数据数组
                            loadData={this.loadData}    // 当选中某个列表项，加载下一个列表的监听回调
                        />
                    </Item>
                    <Item label='商品图片' name='pictures'>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}