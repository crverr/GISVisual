<template>
  <!-- 地图图层 -->
  <div class="map-view-wrapper">
    <div class="map" id="map" ref="map"></div>
    <div id="mouse-position"></div>
    <div id="popup" class="ol-popup">
      <div class="popup-title">数据面板</div>
      <a href="" id="popup-closer" class="ol-popup-closer">x</a>
      <div id="popup-content" class="popup-content"></div>
    </div>
    <div ref="legend" id="legend"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "ol-ext/dist/ol-ext.min.css";
import { Map, View, Overlay, Feature } from "ol";
import { Style, Stroke, Fill, Circle, Text } from "ol/style";
import { Polygon, MultiPolygon } from "ol/geom";
import {
  Image as ImageLayer,
  Group as LayerGroup,
  Tile as TileLayer,
  Vector as VectorLayer,
} from "ol/layer";
import LayerSwitcher from "ol-layerswitcher";
import { BaseLayerOptions, GroupLayerOptions } from "ol-layerswitcher";
import {
  ImageWMS,
  OSM,
  XYZ,
  WMTS,
  TileWMS,
  Vector as VectorSource,
} from "ol/source";

import { fromLonLat, transform } from "ol/proj";
import {
  defaults as ControlDefaults,
  ZoomSlider,
  MousePosition,
  Zoom,
  ScaleLine,
} from "ol/control";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import {
  defaults as InteractionDefaults,
  DragPan,
  MouseWheelZoom,
  DragZoom,
  Select,
} from "ol/interaction";
import DragRotateAndZoom from "ol/interaction/DragRotateAndZoom";

import GeoJSON from "ol/format/GeoJSON";
import * as olLoadingstrategy from "ol/loadingstrategy";
import { get as getProjection, Projection, toLonLat } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";
import TileGridWMTS from "ol/tilegrid/WMTS";
import { toStringHDMS } from "ol/coordinate";
import shJson from "@/static/shanghai.json";
import layerStrJson from '@/static/layerStructure.json'
import OlExtLegend from "ol-ext/legend/Legend";
import OlExtLegendControl from "ol-ext/control/Legend";
import { time } from 'echarts';

export default {
  name: "MapLayer",
  data() {
    return {
      map: null,
      layer: null,
      layers: null,
      features: [], //要素信息
      overlay: null,
      container: null,
      shJsonData: shJson,
      layerStrData: layerStrJson,
      wfsUrl: "http://localhost:8899/geoserver/wfs"        //wfs服务地址
    };
  },
  mounted() {
    // this.initMapWMS();
    this.initMapLayer();
    // this.addLegend()
  },
  methods: {
    initMapWMTS() {
      const container = this.$refs.map;
      let gridsetName = "EPSG:4326";
      let gridNames = [
        "EPSG:4326:0",
        "EPSG:4326:1",
        "EPSG:4326:2",
        "EPSG:4326:3",
        "EPSG:4326:4",
        "EPSG:4326:5",
        "EPSG:4326:6",
        "EPSG:4326:7",
        "EPSG:4326:8",
        "EPSG:4326:9",
        "EPSG:4326:10",
        "EPSG:4326:11",
        "EPSG:4326:12",
        "EPSG:4326:13",
        "EPSG:4326:14",
        "EPSG:4326:15",
        "EPSG:4326:16",
        "EPSG:4326:17",
        "EPSG:4326:18",
        "EPSG:4326:19",
        "EPSG:4326:20",
        "EPSG:4326:21",
      ];
      let baseUrl = "http://localhost:8899/geoserver/crj/gwc/service/wmts";
      let style = "";
      let format = "image/png";
      // let format = "application/json;type=geojson";
      let infoFormat = "text/html";
      let layerName = "crj:grid_pop_hp_sh_2020";
      let projection = new Projection({
        code: "EPSG:4326",
        units: "degrees",
        axisOrientation: "neu",
      });
      let resolutions = [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
        0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
        1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
        2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6,
        2.682209014892578e-6, 1.341104507446289e-6, 6.705522537231445e-7,
        3.3527612686157227e-7,
      ];

      let params = {
        SERVICE: "WMTS",
        VERSION: "1.0.0",
        LAYER: layerName,
        STYLE: style,
        TILEMATRIX: gridsetName,
        TILEMATRIXSET: gridsetName,
        FORMAT: format,
      };
      let constructSource = () => {
        let url = baseUrl + "?";
        for (let param in params) {
          url = url + param + "=" + params[param] + "&";
        }
        url = url.slice(0, -1);
        let source = new WMTS({
          url: url,
          layer: params["LAYER"],
          matrixSet: params["TILEMATRIXSET"],
          format: params["FORMAT"],
          projection: projection,
          tileGrid: new TileGridWMTS({
            tileSize: [256, 256],
            extent: [-180.0, -90.0, 180.0, 90.0],
            origin: [-180.0, 90.0],
            resolutions: resolutions,
            matrixIds: params["TILEMATRIX"],
          }),
          wrapX: true,
          style: params["STYLE"],
        });
        return source;
      };

      let layer = new VectorTileLayer({
        source: constructSource(),
      });

      let view = new View({
        center: [0, 0],
        zoom: 2,
        resolutions: resolutions,
        projection: projection,
        extent: [-180.0, -90.0, 180.0, 90.0],
      });

      this.map = new Map({
        controls: ControlDefaults({ attribution: false }).extend([
          new MousePosition(),
          new ScaleLine(),
          new ZoomSlider(),
        ]),
        layers: [layer],
        target: container,
        view: view,
      });
      this.map
        .getView()
        .fit(
          [
            120.85234069824219, 30.69257926940918, 121.97152709960938,
            31.870302200317383,
          ],
          this.map.getSize()
        );
    },
    //单个图层初始化模块
    initMapWMS() {
      let layerNames = [
        "crj:houseprice_point_sh_2020_2",
        "crj:grid_hp_test",
        "",
      ];
      // 自定义瓦块样式
      const style = new Style({
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.5)",
        }),
        stroke: new Stroke({
          color: "#ccc",
          width: 1,
        }),
      });
      //地图底图
      const ditu = new TileLayer({
        title: "底图",
        source: new XYZ({
          // url: "http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          // url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        }), //这个会出现底图
      });
      const wmsSource = new ImageWMS({
        ratio: 1,
        url: "/sb/wms",
        params: {
          LAYERS: "crj:houseprice_point_sh_2020_2",
          STYLES: "",
          VERSION: "1.1.0",
          FORMAT: "image/png",
        },
      });
      //图片图层
      let untiled = new ImageLayer({
        source: wmsSource,
        zIndex: 999,
      });

      //切片图
      let tiled = new TileLayer({
        visible: true,
        source: new TileWMS({
          url: "http://localhost:8899/geoserver/crj/wms",
          params: {
            LAYERS: "crj:grid_pop_hp_sh_2020",
            STYLES: "",
            VERSION: "1.1.1",
            FORMAT: "image/png",
            tiled: true,
            exceptions: "application/vnd.ogc.se_inimage",
          },
        }),
      });
      this.layer = untiled;
      let projection = new Projection({
        code: "EPSG:4326",
        units: "degrees",
        axisOrientation: "neu",
      });
      const view = new View({
        //投影坐标系
        projection: projection,
        // projection: "EPSG:4326",
        //中心点
        center: [121.5, 31.2],
        //缩放比例
        zoom: 9,
      });

      this.map = new Map({
        interactions: InteractionDefaults().extend([new DragRotateAndZoom()]),
        controls: ControlDefaults({
          zoom: true,
        }).extend([new Zoom(), new ScaleLine(), new ZoomSlider()]),
        //引入地图
        layers: [ditu, untiled],
        target: "map",
        view: view,
      });

      //WFS 加载矢量图层
      this.getFeaturesByOl();
      //添加overlayer弹窗
      this.addOverlay();

      //监听地图单击事件
      this.map.on("singleclick", this.mapClick);

      //绘制上海行政区域边界
      this.addAreaBoundary();
    },
    //创建图像图层模块
    createImageLayer(title, visible, layerName, type = "", style = "") {
      /*
      params:
        type:   单选/多选
        layerName： 图层名
        visible:  是否可见
        title：图层标题
        style: 图层样式
      */
      return new ImageLayer({
        title: title,
        visible: visible,
        type: type,
        source: new ImageWMS({
          ratio: 1,
          url: "/sb/wms",
          params: {
            LAYERS: layerName,
            STYLES: "",
            VERSION: "1.1.0",
            FORMAT: "image/png",
          },
        }),
        style: style,
        // zIndex: zIndex
      });
    },
    //创建底图模块
    createditu(title, visible) {
      let source = null;
      if (title == "OSM") {
        source = new OSM();
      } else if (title == "XYZ") {
        source = new XYZ({
          // url: "http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
        });
      } else if (title == "darkXYZ") {
        title = "底图";
        source = new XYZ({
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        });
      }
      return new TileLayer({
        title: title,
        // type: "base",
        visible: visible,
        source: source,
      });
    },
    //整合图层列表
    getLayerList() {
      //底图
      const osm = this.createditu("OSM", false);
      const xyz = this.createditu("XYZ", false);
      const darkxyz = this.createditu("darkXYZ", true);
      //底图组
      const baseMaps = new LayerGroup({
        title: "Base maps",
        fold: "open",
        layers: [osm, xyz, darkxyz],
      });

      let layerList = [darkxyz]

      //遍历一级目录
      this.layerStrData.forEach((fitem,fid)=>{
        //二级目录层
        let sLayers = []
        //遍历二级目录
        fitem.childs.forEach((sitem, sid)=>{

          //二级目录是否还有子目录
          if(sitem.hasOwnProperty("childs")) {
            //三级目录——图层
            let tLayers = []
            //遍历三级目录
            sitem.childs.forEach((titem, tid)=>{
              let layer = null
              //如果是"基础要素"使用WMS加载
              if(fitem.name === "基础要素") {
                layer = this.createImageLayer(titem.name, false, 'crj:'+titem.file, fitem.type);
              } //否则使用WFS加载
              else {
                layer = this.getFeaturesByOl(titem.name, false,'crj:'+sitem.file, titem.property, fitem.type)
              }
              tLayers.push(layer)
            })
            //二级目录组
            const sencondGroup = new LayerGroup({
              title: sitem.name,
              fold: "close",
              layers: tLayers
            })
            sLayers.push(sencondGroup)

          } else {
            let layer = null
            if(fitem.name == "基础要素") {
              layer = this.createImageLayer(sitem.name, false, 'crj:'+sitem.file, fitem.type);
            } else {
              layer = this.getFeaturesByOl(sitem.name, false,'crj:'+sitem.file, sitem.property, fitem.type)
            }
            sLayers.push(layer)
          }

        })

        const firstGroup = new LayerGroup({
          title: fitem.name,
          fold: "close",
          layers: sLayers,
        });

        layerList.push(firstGroup)

      })
      return layerList

    },
    //方法1：通过内置api使用WFS加载矢量图层
    getFeaturesByOl(title, visible, layerName, propertyName,type) {
      /*
        title: 图层标题
        type:   单选/多选
        visible:  是否可见
        layerName: 图层名
        propertyName: 图层属性

      */
      // const layerTypeName = "crj:grid_sh_2020"; //图层名
      // const propertyName = "index,grid_code,pop20";
      const baseUrl = this.wfsUrl +"?service=wfs&version=1.1.0&request=GetFeature&typeName=" +
        layerName +
        "&outputFormat=application/json&propertyName=" +
        propertyName;
      //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
      const vector = new VectorLayer({
        title: title,
        visible: visible,
        type: type,
        source: new VectorSource({
          format: new GeoJSON(),
          projection: "EPSG:4326",
          url: baseUrl,
        }),
        style: this.getFeatureNameColor(),
      });
      return vector
    },
    //WFS Features的样式
    getFeatureNameColor() {
      var style_highlighted = new Style({
        fill: new Fill({
          color: "red",
        }),
        stroke: new Stroke({
          color: "white",
          width: 2,
        }),
        text: new Text({
          fill: new Fill({
            color: "yellow",
          }),
          stroke: new Stroke({
            color: "orange",
            width: 4,
          }),
          scale: 1.2,
        }),
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: "pink",
            opacity: 0.5,
          }),
        }),
      });
      return style_highlighted;
    },
    //方法2：通过axios使用WFS加载矢量图层
    getFeaturesByAxios() {
      const params = {
        service: "wfs",
        version: "1.1.0",
        request: "GetFeature",
        typeName: "crj:grid_sh_2020",
        outputFormat: "application/json",
        propertyName: "index,grid_code,pop20,geom",
      };
      this.axios({
        url: "http://localhost:8899/geoserver/wfs",
        methods: "GET",
        params: params,
      })
        .then((res) => {
          //定义数据源为矢量数据源
          var vectorSource = new VectorSource();

          //定义矢量图层
          var vectorLayer = new VectorLayer({
            source: vectorSource,
            name: "vector",
            style: this.getFeatureNameColor(),
          });
          vectorSource.addFeatures(new GeoJSON().readFeatures(res.data));
          this.map.addLayer(vectorLayer);
        })
        .catch((error) => {
          console.log("请求失败，失败信息：" + error);
        });
    },
    //多图层初始化地图模块
    initMapLayer() {
      // 自定义瓦块样式
      const style = new Style({
        fill: new Fill({
          color: "yellow", //填充颜色
        }),
        stroke: new Stroke({
          width: 5, //边界宽度
          color: [71, 137, 227, 1], //边界颜色
        }),
      });

      let layerList = this.getLayerList();


      //基础要素图层列表
      const baseLayerNames = ["crj:region_city_sh", "crj:region_county_sh"];

      const layerNames = [
        "crj:houseprice_point_sh_2020",
        "crj:grid_pop_hp_sh_2020",
        "crj:grid_poi_sh_2020_pop",
        "crj:grid_poi_sh_2020_catering",
        "crj:grid_poi_sh_2020_houseprice",
        "crj:grid_poi_sh_2020_market",
        "crj:grid_poi_sh_2020_school",
      ];

      //图层实例
      const housePirce = this.createImageLayer(
        "房价样本点",
        true,
        layerNames[0]
      );
      const gridPop = this.createImageLayer("gridPop", false, layerNames[1]);
      const city = this.createImageLayer("city", false, layerNames[2], style);
      const country = this.createImageLayer("country", false, layerNames[3]);
      const poiPop = this.createImageLayer("人口", false, layerNames[4]);
      const poiCater = this.createImageLayer("餐饮", false, layerNames[5]);
      const poiHousePirce = this.createImageLayer("房价", false, layerNames[6]);
      const poiSMarket = this.createImageLayer("购物", false, layerNames[7]);
      const poiSchool = this.createImageLayer("学校", false, layerNames[8]);

      const layers = [
        poiPop,
        poiCater,
        poiHousePirce,
        poiSMarket,
        poiSchool,
        housePirce,
        gridPop,
        city,
        country,
      ];


      let img = housePirce.getSource().getLegendUrl();
      console.log(img);
      // console.log(getIconStyle(img));

      this.layers = layers;

      const Overlays = new LayerGroup({
        title: "基础要素",
        fold: "open",
        layers: layers,
      });

      const Overlays2 = new LayerGroup({
        title: "聚类分析",
        fold: "open",
        combine: true,
        layers: [],
      });

      const Overlays3 = new LayerGroup({
        title: "回归分析",
        fold: "open",
        combine: true,
        layers: [],
      });

      const view = new View({
        // projection: projection,
        projection: "EPSG:4326",
        center: [121.5, 31.2],
        zoom: 9,
      });

      this.map = new Map({
        interactions: InteractionDefaults().extend([new DragRotateAndZoom()]),
        controls: ControlDefaults({
          zoom: false,
        }).extend([]),
        //引入地图
        layers: layerList, ///[darkxyz, Overlays, Overlays2, Overlays3],
        target: this.$refs.map,
        view: view,
      });

      const layerswitcher = new LayerSwitcher({
        activationMode: "click",
        tipLabel: "Légende",
        groupSelectStyle: "none",
        reverse: true,
      });

      this.map.addControl(layerswitcher);

      //绘制上海行政区域边界
      this.addAreaBoundary();

      //添加overlayer弹窗
      this.addOverlay();

      //监听地图单击事件
      this.map.on("singleclick", this.mapClick);

      //监听地图拖动事件
      this.map.on("movestart", (e) => {
        //弹窗隐藏
        this.overlay.setPosition(undefined);
      });
    },
    //点击地图提取要素信息并展示
    async mapClick(e) {
      //弹窗的内容节点DOM
      const content = document.getElementById("popup-content");
      // 鼠标点击的坐标位置
      const coordinate = e.coordinate;

      // 将地理坐标格式化为半球、度、分和秒的形式
      let hdms = toStringHDMS(toLonLat(coordinate));

      //请求查询要素信息
      await this.getFeatures(e);

      let html = "";
      if (this.features.length) {
        let { properties } = this.features[0];
        const keys = Object.keys(properties);
        let template = `
          <p>要素信息：</p>
          <% for(let i=0; i<data.supplies.length; i++) { %>
              <p><%= data.supplies[i][0] %> : <code><%= data.supplies[i][1]%></code> </p>
          <% } %>
        `;
        let parse = eval(this.compile(template));
        html = parse({ supplies: Object.entries(properties) });
      }

      content.innerHTML = `
      <p>经纬度: <code>"+ ${hdms} + "</code></p>
      <p>坐标: X:${(parseInt(coordinate[0] * 100) / 100).toFixed(
        2
      )} &nbsp;&nbsp; Y: ${(parseInt(coordinate[1] * 100) / 100).toFixed(2)}</p>
      ${html}
      `;
      //把 overlay 显示到指定的 x,y坐标
      this.overlay.setPosition(coordinate);
    },
    //添加弹窗
    addOverlay() {
      //获取弹框的节点DOM
      const container = document.getElementById("popup");
      const closer = document.getElementById("popup-closer");

      //弹框Overlay对象
      this.overlay = new Overlay({
        element: container, //绑定的DOM对象
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          //自动平移效果的动画时间 9毫秒
          duration: 250,
        },
      });
      //将弹窗添加到map地图中
      this.map.addOverlay(this.overlay);
      let _that = this;
      //弹窗的关闭事件
      closer.onclick = () => {
        //将overlay对象的setPosition赋值为undefined即可隐藏。
        _that.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.overlay.on("mousedown", (e) => {
        console.log(e);
      });
    },
    //请求要素信息
    getFeatures(e) {
      const viewResolution = this.map.getView().getResolution();
      let url = "";

      //多个图层：遍历每个图层，仅在可见的情况下才查询要素信息
      this.layers.forEach((layer) => {
        if (layer.getVisible()) {
          url = layer
            .getSource()
            .getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:4326", {
              INFO_FORMAT: "application/json",
            });
        }
      });

      //单个图层
      // url = this.layer.getSource.getFeatureInfoUrl(
      //   e.coordinate,
      //   viewResolution,
      //   "EPSG:4326",
      //   { INFO_FORMAT: "application/json" }
      // );

      //请求url
      if (url) {
        //请求数据
        return this.axios.get(url).then((res) => {
          this.features = res.data.features;
        });
      }
    },
    //绘制行政区域边界
    addAreaBoundary() {
      let geo = this.shJsonData.features;
      // let geo = new GeoJSON().readFeatures(this.shJsonData)
      let features = [];

      geo.forEach((g) => {
        let lineData = g.geometry;
        let routeFeature = "";
        if (lineData.type === "MultiPolygon") {
          routeFeature = new Feature({
            geometry: new MultiPolygon(lineData.coordinates),
          });
        } else if (lineData.type === "Polygon") {
          routeFeature = new Feature({
            geometry: new Polygon(lineData.coordinates),
          });
        }
        routeFeature.setStyle(
          new Style({
            fill: new Fill({
              color: "#4e98f444", //填充颜色
            }),
            stroke: new Stroke({
              width: 2, //边界宽度
              color: [71, 137, 227, 1], //边界颜色
            }),
          })
        );
        features.push(routeFeature);
      });
      // 设置图层
      this.routeLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
      });
      // 添加图层
      this.map.addLayer(this.routeLayer);
    },
    //模板编译
    compile(template) {
      const evalExpr = /<%=(.+?)%>/g;
      const expr = /<%([\s\S]+?)%>/g;

      template = template
        .replace(evalExpr, "`); \n  echo( $1 ); \n  echo(`")
        .replace(expr, "`); \n $1 \n  echo(`");

      template = "echo(`" + template + "`);";

      let script = `(function parse(data){
        let output = "";

        function echo(html){
          output += html;
        }

        ${template}

        return output;
      })`;

      return script;
    },
    //添加图例
    addLegend() {
      const updateLegend = (resolution) => {
        const img = document.getElementById("legend");
        this.layers.forEach((layer) => {
          if (layer.getVisible()) {
            const graphicUrl = layer.getSource().getLegendUrl(resolution);
            img.src = graphicUrl;
          }
        });
      };
      const resolution = this.map.getView().getResolution;
      updateLegend(resolution);

      this.map.getView().on("change:resolution", (e) => {
        console.log(e);
        // const resolution = e.getView().getResolution
        // updateLegend(resolution)
      });

      // legend = new OlExtLegend({
      //   title: "图例",
      //   margin: 5
      // })
    },
  },
};
</script>
<style lang="less" scoped>
.map-view-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  // z-index: 1;
  /deep/.layer-switcher {
    top: 14.5em;
    right: 27%;
  }
  .map {
    width: 100%;
    height: 780px; //100%;  //
  }
  .ol-popup {
    position: relative;
    background-color: rgba(9, 24, 46, 0.5);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px #25c1ff);

    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 200px;
    color: #f0fbff;
    cursor: pointer;
    overflow: hidden;

    &::after,
    &::before {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    &::after {
      border-top-color: white;
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    &::before {
      border-top-color: #ccc;
      border-width: 11px;
      left: 48px;
      margin-left: -11px;
    }
    .popup-title {
      background-color: rgba(9, 24, 46, 0.5);
      margin-bottom: 10px;
      padding: 8px 0;
      font-size: 16px;
    }
    .popup-content {
      width: 300px;
      text-align: left;
      max-height: 300px;
      overflow: auto;
      padding: 0 10px 15px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 8px;
      color: #f0fbff;
    }
  }
}
</style>