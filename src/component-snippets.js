const snippets = {
    "wxml": {
        "body":
`<!--$1-->
<text>$1</text>`
    },
    "wxss": {
        "body": "/* $1 */"
    },
    "js": {
        "body": 
`// $1
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})`
    },
    "json": {
        "body": 
`{
  "component": true,
  "usingComponents": {}
}`
    }
}

module.exports = snippets