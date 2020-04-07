import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {formatDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api/index'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import './index.less';
/*
    顶部组件
*/
class Header extends Component {
    state = {
        currentTime: formatDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', // 天气图片url
        weather: '' // 天气文本
    }

    getTime = () => {
        this.interval = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather()
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => (path.indexOf(cItem.key) === 0))
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    layout = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗?',
            onOk: () => {
                // 注意this
                // console.log('OK', this);
                // 删除user
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到登录
                this.props.history.replace('/login')
            }
        });
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render () {
        const {currentTime, dayPictureUrl, weather} = this.state
        const username = memoryUtils.user.username
        // 得到当前需要显示的title
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.layout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)