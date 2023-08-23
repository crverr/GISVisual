# gis_visual

## 介绍
中国移动线上实习可视化项目，基于人口大数据和GIS技术的地价评估的前端可视化展示

## 软件架构
软件架构说明


## 安装教程

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
地理数据由GeoServer提供，包括人口、房价等信息，前端地图展示利用openlayer库WMS/WFS请求图层 
构建地图框架，封装地图图层控件和图例控件，实现地图图层切换控制及对应图例展示 
实现点击图层进行要素查询功能，展示数据面板，
构建可视化大屏模板，利用ECharts绘制图表，将人口分布、房价等数据以多形式图表呈现。
```
