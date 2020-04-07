/*
    后台管理的路由组件
*/

import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils';

import LeftNav from '../../components/left-nav';
import Header from '../../components/header';

import Category from '../category/category';
import Home from '../home/home';
import Product from '../product/product';
import User from '../user/user';
import Role from '../role/role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';


const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render () {
        const user = memoryUtils.user;
        // 如果内存中没有存储user
        if (!user || !user._id) {
            // 自动跳转到登陆（在render()中）
            return <Redirect to='/login' />;
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: '20px', backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/user' component={User} />
                            <Route path='/role' component={Role} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}