/*
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
*/
import jsonp from 'jsonp';
import {message} from 'antd'
import ajax from './ajax';

const Base = '';

// 登陆
export const reqLogin = (username, password) => ajax(Base + '/login', {username, password}, 'POST');

// 获取一级/二级分类的列表
export const reqCategories = (parentId) => ajax(Base + '/manage/category/list', {parentId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(Base + '/manage/category/add', {categoryName, parentId}, 'POST');

// 更新分类
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax(Base + '/manage/category/update', {categoryName, categoryId}, 'POST');

// 获取一个分类
export const reqCategory = (categoryId) => ajax(Base + '/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(Base + '/manage/product/list', {pageNum, pageSize})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(Base + '/manage/product/updateStatus', {productId, status}, 'POST')

/*
    搜索商品分页列表（根据商品名称/商品描述）
    searchType: 搜索的类型，productName/productDesc
*/ 
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(Base + '/manage/product/search', {
    pageNum, pageSize, [searchType]: searchName
})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(Base + '/manage/img/delete', {name}, 'POST')

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(Base + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(Base + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(Base + '/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax(Base + '/manage/role/update', role, 'POST')

// 获取所有用户列表
export const reqUsers = () => ajax(Base + '/manage/user/list')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(Base + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax(Base + '/manage/user/delete', {userId}, 'POST')

/*
    json请求的接口请求函数
    由于百度调整了api，所以请求不到数据
*/
export const reqWeather = (districtId) => {
    return new Promise((resolve, reject) => {
        if (!districtId) { // 假数据
            const dayPictureUrl = 'http://api.map.baidu.com/images/weather/day/qing.png'
            const weather = '晴'
            resolve({dayPictureUrl, weather})
            return
        }
        const url = `http://api.map.baidu.com/weather/v1/?district_id=${districtId}&data_type=fc&ak=15kNv5xW8bzQat9UfSsVbKhyicIjWZ2B`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 0) {
                const {dayPictureUrl, weather} = data.result.forecasts[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}

// reqWeather(110100)
/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */