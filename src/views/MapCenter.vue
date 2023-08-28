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
  WebGLPoints as WebGLPointsLayer,
} from "ol/layer";
import LayerSwitcher from "ol-layerswitcher";
import olLayerSwitcher from "ol-ext/control/LayerSwitcher";
import {
  ImageWMS,
  OSM,
  XYZ,
  TileWMS,
  Vector as VectorSource,
} from "ol/source";
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
import { click, pointerMove } from "ol/events/condition";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import { get as getProjection, Projection, toLonLat } from "ol/proj";
import TileGridWMTS from "ol/tilegrid/WMTS";
import { toStringHDMS } from "ol/coordinate";
import shJson from "@/static/shanghai.json";
import layerStrJson from "@/static/layerStructure.json";
import olExtLegend from "ol-ext/legend/Legend";
import legendImage from "ol-ext/legend/Image";
import olExtLegendControl from "ol-ext/control/Legend";

export default {
  name: "MapLayer",
  data() {
    return {
      map: null,
      legend: null,
      layers: [],              //图层集合
      layerList: [],          //图层组集合
      features: [], //要素信息
      overlay: null,
      container: null,
      shJsonData: shJson,
      layerStrData: layerStrJson,
      wfsUrl: "/geo/wfs", //wfs服务地址
      color: [
        "#ff14c3",
        "#ff621d",
        "#ffed02",
        "#00ff67",
        "#fdae61",
        "#2b83ba",
        "#abdda4",
        "#d7191c",
        "#ababab",
        "#00ffff",
        "#85ff9c",
      ],
    };
  },
  mounted() {
    // this.initMapWMS();
    //初始化底图
    this.initMapLayer();
    //初始化图例
    this.initLegend();   
  },
  methods: {
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
        url: "/geo/wms",
        params: {
          LAYERS: "crj:houseprice_point_sh_2020",
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
          url: "/geo/wms",
          params: {
            LAYERS: "crj:grid_pop_hp_sh_2020",
            STYLES: "",
            VERSION: "1.1.0",
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
    //WMS服务加载图像图层模块
    createImageLayer(title, visible, layerName, propertyName, type = "", style = "") {
      /*
      params:
        type | baseLayer:   是否独占，单选/多选
        layerName： 图层名
        visible:  是否可见
        title：图层标题
        style: 图层样式
      */
      return new ImageLayer({
        title: title,
        visible: visible,
        baseLayer: type,
        propertyName: propertyName,
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
    //方法1：通过内置api使用WFS加载矢量图层
    getFeaturesByOl(title, visible, layerName, propertyName,type) {
      /*
        title: 图层标题
        type:   单选/多选
        visible:  是否可见
        layerName: 图层名
        propertyName: 图层属性
      */

      //如有指定单个字段，则添加id和几何geom字段
      if (propertyName !== "") {
        var newPropertyName = propertyName + ",geom";
      }

      //请求url
      const baseUrl =
        this.wfsUrl +
        "?service=wfs&version=1.1.0&request=GetFeature&typeName=" +
        layerName +
        "&outputFormat=application/json" +
        (propertyName ? "&propertyName=" + newPropertyName : "");

      //加载策略——根据范围和分辨率加载
      const vectorSourceByBbox = new VectorSource({
        format: new GeoJSON(),
        url: (extent, resolution, projection) => {
          const proj = projection.getCode();
          const url =
            baseUrl +
            "&srsname=" +
            proj +
            "&bbox=" +
            extent.join(",") +
            "," +
            proj;
          return url;
        },
        strategy: bboxStrategy,
      });

      //加载策略——一次性加载所有features
      const vectorSource = new VectorSource({
        format: new GeoJSON(),
        projection: "EPSG:4326",
        url: baseUrl,
      });

      //根据是否有点数范围来选择加载的layer类型
      if (range.length > 0) {
        //创建wfs图层
        return new WebGLPointsLayer({
          title: title,
          visible: visible,
          type: type,
          source: vectorSource,
          style: this.hightlightStyle(range, propertyName),
        });
      } else {
        //创建wfs图层
        return new VectorLayer({
          title: title,
          visible: visible,
          type: type,
          source: vectorSourceByBbox,
          style: this.getFeatureNameColor(),
        });
      }
    },
    //WFS服务加载方法2：通过axios使用WFS加载矢量图层
    createLayerByAxios() {
      const params = {
        service: "wfs",
        version: "1.1.0",
        request: "GetFeature",
        typeName: "crj:grid_sh_2020",
        outputFormat: "application/json",
        propertyName: "index,grid_code,pop20,geom",
      };
      this.axios({
        url: "/geo/wfs",
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
    //WFS Features的样式
    getFeatureNameColor() {
      return new Style({
        fill: new Fill({
          color: "#4e98f444",
        }),
        stroke: new Stroke({
          color: "#b7e5ff",
          width: 1,
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
          radius: 3,
          fill: new Fill({
            color: "aqua",
            opacity: 0.5,
          }),
        }),
      });
    },
    //点的高亮样式
    hightlightStyle(range, propertyName) {
      let newRange = [];
      range.forEach((item, index) => {
        newRange.push(item);
        newRange.push(this.color[index]);
      });
      let color = ["interpolate", ["linear"], ["get", propertyName]].concat(
        newRange
      );
      console.log(color);
      const style = {
        symbol: {
          symbolType: "circle", //图标形状可选值为：circle/triangle/square/image
          size: [
            "interpolate",
            ["linear"],
            ["get", "population"],
            range[0],
            5,
            range[range.length - 1] + 1,
            28,
          ],
          color: color,
          // color: [
          //   'interpolate',
          //   ['linear'],
          //   ['get', "unitprice"],
          //   3,
          //   '#ff14c3',
          //   38282 ,
          //   '#ff621d',
          //   56568 ,
          //   '#ffed02',
          //   77404,
          //   '#00ff67',
          //   110702,
          //   "#fdae61",
          //   360577,
          //   "#d7191c"],
          offset: [0, 0],
          opacity: 0.95,
        },
      };
      return style;
    },
    //整合图层列表 分别使用WMS和WFS请求
    getLayerList2() {
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
    //整合图层列表 直接使用WMS请求图层
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

      let layerList = [darkxyz];

      //遍历一级目录
      this.layerStrData.forEach((fitem, fid) => {
        //二级目录层
        let sLayers = [];
        //遍历二级目录
        fitem.childs.forEach((sitem, sid) => {
          //二级目录是否还有子目录
          if (sitem.hasOwnProperty("childs")) {
            //三级目录——图层
            let tLayers = [];
            //遍历三级目录
            sitem.childs.forEach((titem, tid) => {
              //三级目录是否有指定字段
              let property = titem.hasOwnProperty("property")
                ? titem.property
                : "";
              //图层名
              let file =
                "crj:" +
                (titem.hasOwnProperty("file")
                  ? titem.file
                  : sitem.file + "_" + property);
              let layer = this.createImageLayer(
                titem.name,
                sitem.visible,
                file,
                property,
                fitem.type
              );

              //WFS请求
              //二级目录是否统一的数据文件
              // let file = "crj:" + (titem.hasOwnProperty("file") ? titem.file : sitem.file);
              // let layer = this.createLayerByOl(titem.name, sitem.visible, fitem.type, file, property);

              tLayers.push(layer);
              this.layers.push(layer);
            });
            //二级目录组
            const sencondGroup = new LayerGroup({
              title: sitem.name,
              fold: "close",
              layers: tLayers,
            });
            sLayers.push(sencondGroup);
          }
          //二级目录没有子目录
          else {
            //二级目录是否有指定字段
            let property = sitem.hasOwnProperty("property")
              ? sitem.property
              : "";
            //WMS请求
            let layer = this.createImageLayer(
              sitem.name,
              sitem.visible,
              "crj:" + sitem.file,
              property,
              fitem.type
            );

            // let range = sitem.hasOwnProperty("range") ? sitem.range : []
            //let layer = this.createLayerByOl(sitem.name, sitem.visible, fitem.type, "crj:" + sitem.file, property, range);
            sLayers.push(layer);
            this.layers.push(layer);
          }
        });

        const firstGroup = new LayerGroup({
          title: fitem.name,
          fold: "close",
          layers: sLayers,
        });

        layerList.push(firstGroup);
      });
      return layerList;
    },
    //多图层初始化地图模块
    initMapLayer() {
      //获取图层列表
      let layerList = this.getLayerList();

      this.layerList = layerList

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


      // const layerswitcher = new LayerSwitcher({
      //   activationMode: "click",
      //   tipLabel: "Légende",
      //   groupSelectStyle: "child",
      //   reverse: true,
      // });

      let that = this;
      const olsw = new olLayerSwitcher({
        // displayInLayerSwitcher: function (l) { return false; },
        trash: true,
        oninfo: function (l) {
          alert(l.get("title"));
        },
        onchangeCheck: function (l) {
          that.addLegend()
        },
      });

      this.map.addControl(olsw);

      //绘制上海行政区域边界
      this.addAreaBoundary();

      //添加overlayer弹窗
      this.addOverlay();

      //WFS请求：定义一个选择器，用于查询要素信息
      // this.addSelect();

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

      //WMS服务请求查询要素信息
      await this.getWMSFeatures(e);
      //WFS服务请求查询要素信息
      // this.getWFSFeatures(e);

      //渲染的html内存
      let html = "";
      let features = this.features;
      console.log(features);
      //删除某个属性
      if (features) {
        if (features.hasOwnProperty("geometry")) {
          Reflect.deleteProperty(features, "geometry");
        }
        let template = `
          <p>要素信息：</p>
          <% for(let i=0; i<data.supplies.length; i++) { %>
              <p><%= data.supplies[i][0] %> : <code><%= data.supplies[i][1]%></code> </p>
          <% } %>
        `;
        let parse = eval(this.compile(template));
        html = parse({ supplies: Object.entries(features) });
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
    //WMS请求要素信息
    getWMSFeatures(e) {
      const viewResolution = this.map.getView().getResolution();
      let urls = [];
      let propertyNames = []; //需要展示的字段
      //多个图层：遍历每个图层，仅在可见的情况下才查询要素信息
      this.layers.forEach((layer) => {
        if (layer.getVisible()) {
          // console.log(layer);
          propertyNames.push(layer.values_.propertyName);
          let url = layer
            .getSource()
            .getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:4326", {
              INFO_FORMAT: "application/json",
            });
          // console.log(url, ' ',layer.getZIndex())
          urls.push(url);
        }
      });

      //单个图层
      // url = this.layer.getSource.getFeatureInfoUrl(
      //   e.coordinate,
      //   viewResolution,
      //   "EPSG:4326",
      //   { INFO_FORMAT: "application/json" }
      // );

      //单个请求url
      // if (url) {
      //   //请求数据
      //   return this.axios.get(url).then((res) => {
      //     //要素信息存储
      //     this.features = res.data.features;
      //     console.log(res.data.features);
      //   });
      // }

      //多个请求
      if (urls.length) {
        let that = this;
        let urlsReq = urls.map((url) => that.axios.get(url));
        let featuresList = {};
        return that.axios.all(urlsReq).then(
          that.axios.spread((...arg) => {
            //所有请求都执行完毕
            Array.from([...arg]).forEach((res, index) => {
              //查看每个请求返回的数据,如果有数据就添加
              let { features } = res.data;
              if (features.length) {
                //指定属性（字段）
                let pn = propertyNames[index];
                // console.log(features[0].properties['parking']);
                // console.log(pn, features[0].properties[pn]);
                let data =
                  pn == ""
                    ? features[0].properties
                    : { [pn]: features[0].properties[pn] };
                featuresList = Object.assign(featuresList, data);
              }
            });

            this.features = featuresList;
            console.log(this.features);
          })
        );
      }
    },
    //WFS请求要素信息方法1
    addSelect() {
      const select = new Select({
        condition: click,
      });
      this.map.addInteraction(select);
      select.on("select", (e) => {
        let coordinate = e.mapBrowserEvent.coordinate; //获取选择的坐标
        let properties = e.selected[0].getProperties(); //获取当前要素的所有属性
        // this.features = properties;    //点击查询要素信息
        let features = e.target.getFeatures().getArray();
        // if (features.length > 0) {
        //   this.features = features
        // }
        console.log(features);
        console.log(properties);
      });
    },
    //WFS请求要素信息方法2
    getWFSFeatures(e) {
      if (this.map.hasFeatureAtPixel(e.pixel)) {
        let features = this.map.getFeaturesAtPixel(e.pixel, {
          hitTolerance: 1,
        });
        this.features = features[0].values_;
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
        title: "行政区",
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
    //初始化图例
    initLegend() {
      let legend = new olExtLegend({
        title: "图例",
        margin: 2,
        maxWidth: 300,
      });
      let legendCtrl = new olExtLegendControl({
        legend: legend,
        collapsed: false,
      });

      legend.setStyle(this.getFeatureNameColor())
      this.map.addControl(legendCtrl);
      this.legend = legend;
      this.addLegend();
    },
    //添加图例
    addLegend() {
      //清空图例
      this.legend.getItems().clear()

      // console.log(this.layerList);

      //遍历所有图层
      this.layers.forEach((layer, index) => {

        //图层可见
        if (layer.getVisible()) {
          const graphicUrl = layer.getSource().getLegendUrl();
          const title = layer.values_.title;
          //这两个图层不需要图例
          if (["行政区-市", "行政区-区县", "外环线", "内环线", "中环线"].indexOf(title) !== -1 ) return;

          let layerLegend = new olExtLegend({ layer: layer });
          layerLegend.addItem(
            new legendImage({
              title: title,
              src: graphicUrl,
            })
          );
          this.legend.addItem(layerLegend);
          // img.src = graphicUrl;
        }
      });
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
    height: 100%;

    /deep/.ol-layerswitcher {
      top: 14.5em;
      right: 27%;
    }
    /deep/.ol-legend {
      bottom: auto;
      left: 27%;
      top: 14.5em;
      padding: 4px;
    }
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