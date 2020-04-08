/*
    商品管理路由
*/
import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

import './product.less'

export default class Product extends Component {
    render () {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact />
                <Route path='/product/detail' component={ProductDetail} />
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}