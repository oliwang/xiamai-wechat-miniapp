# DEPLOYMENT 部署文档

## 如何下载代码

## 如何将代码导入到开发者工具

## 哪些参数需要修改

## 哪些云函数需要部署
- itemContentSecurityCheck
- login
- opengid
- get_user_items
- get_user_fav_items
- get_user_active_items
- get_groups
- get_group_members
- get_group_items_by_gid
- get_group_items

## 涉及到的外部服务
使用了[Lin-UI](https://github.com/TaleLin/lin-ui)和[wxml-to-canvas](https://github.com/wechat-miniprogram/wxml-to-canvas)，做了一些小改动。
虾麦repo中的代码可以直接运行，如果自己写的话：

- [Lin-UI](https://github.com/TaleLin/lin-ui)
瀑布流卡片布局需要自己写卡片item的组件，我的写法可以在components/product里看到。这个写法来自Lin-UI repo中的water-flow example。

- [wxml-to-canvas](https://github.com/wechat-miniprogram/wxml-to-canvas)
直接使用
- [wxml-to-canvas](https://github.com/wechat-miniprogram/wxml-to-canvas)
- [wxml-to-canvas](https://github.com/wechat-miniprogram/wxml-to-canvas)

# 云数据库中需要创建哪些数据
需要先创建4张表格

- users 用户
- items 物品
- user-favorite 用户收藏
- user-group 用户微信群

# 云存储中需要上传哪些文件
在生成海报时，我们会用到程序的二维码图片，需要上传到云存储中的images文件夹中。


# 后台需要配置哪些服务


```
.
├── README.md
├── cloudfunctionTemplate
│   └── get_group_items_by_gid.json
├── cloudfunctions
│   ├── callback
│   ├── echo
│   ├── get_group_items
│   ├── get_group_items_by_gid
│   ├── get_group_members
│   ├── get_groups
│   ├── get_pending_items
│   ├── get_user_active_items
│   ├── get_user_fav_items
│   ├── get_user_items
│   ├── itemContentSecurityCheck
│   ├── login
│   ├── openapi
│   └── opengid
├── miniprogram
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── components
│   │   ├── column-title
│   │   ├── content-card
│   │   ├── content-title
│   │   ├── detail-navi-card
│   │   ├── lin-ui
│   │   ├── navi-card
│   │   ├── navi-content
│   │   ├── navi-title
│   │   ├── product
│   │   └── tabs-card
│   ├── images
│   ├── miniprogram_npm
│   │   ├── eventemitter3
│   │   ├── widget-ui
│   │   └── wxml-to-canvas
│   ├── node_modules
│   │   ├── eventemitter3
│   │   ├── widget-ui
│   │   └── wxml-to-canvas
│   ├── package-lock.json
│   ├── package.json
│   ├── pages
│   │   ├── add_item
│   │   ├── edit_user_info
│   │   ├── favorite
│   │   ├── generate_image
│   │   ├── group
│   │   ├── index
│   │   ├── item
│   │   ├── nearby
│   │   ├── profile
│   │   └── user
│   ├── sitemap.json
│   └── style
│       └── guide.wxss
└── project.config.json

```
