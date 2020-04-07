import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {EditorState, convertToRaw, ContentState} from 'draft-js' 
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/**
 * 指定商品信息详情的富文本编辑器组件
 */
export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        const html = this.props.detail
        let editorState
        if (html) { // 如果有值，根据html格式字符串创建一个对应的编辑对象
            const blocksFromHtml = htmlToDraft(html)
            const {contentBlocks, entityMap} = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
            editorState = EditorState.createWithContent(contentState)
        } else { // 创建一个没有内容的编辑对象
            editorState = EditorState.createEmpty()
        }
        // 初始化状态
        this.state = {editorState}
    }

    /**
     * 当输入改变时立即保存状态数据
     */
    onEditorStateChange = (editorState) => {
        this.setState({editorState})
    }

    /**
     * 得到输入的富文本数据
     */
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallback = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url // 得到图片url
                    resolve({data: {link: url}})
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    render() {
        const {editorState} = this.state
        return (
            <Editor editorState={editorState} 
            editorStyle={{minHeight: 200, border: '1px solid black', paddingLeft: 10}} 
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
                image: {uploadCallback: this.uploadImageCallback, alt: {present: true, mandatory: true}}
            }}    
        />
        )
    }
}