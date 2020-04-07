import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { Menu } from 'antd';
// import {
//     HomeOutlined,
//     AppstoreOutlined,
//     BarsOutlined,
//     ToolOutlined,
//     UserOutlined,
//     SafetyOutlined,
//     AreaChartOutlined,
//     LineChartOutlined,
//     PieChartOutlined,
//     BarChartOutlined,
// } from '@ant-design/icons';


import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';

const { SubMenu } = Menu;
/*
    左侧导航的组件
*/
class LeftNav extends Component {
    /*
        根据menu数据数组生成对应的标签数组
        map + 递归调用
    */ 
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
           if (!item.children) {
               return (
                <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
               )
           } else {
               return (
                <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <span>{item.title}</span>
                        </span>
                    }
                >
                    {this.getMenuNodes(item.children)}
                </SubMenu>
               )
           }
        })
    }
    /*
        根据menu数据数组生成对应的标签数组
        reduce + 递归调用
    */
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                // 查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                // 如果存在，说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre;
        }, [])
    }

    constructor(props) {
        super(props)
        this.menuNodes = this.getMenuNodes(menuList)
    }
    
    render () {
        // 当前请求路由路径
        let path = this.props.location.pathname;
        // console.log(`render() ${path}`)
        if (path.indexOf('/product') === 0) {   // 当前请求的是商品或其子路由界面
            path = '/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey;
        return (
            <div className='left-nav'>
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav);