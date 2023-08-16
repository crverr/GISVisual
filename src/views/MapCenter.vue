<template>
  <!-- 地图图层 -->
  <div class="map-view-wrapper">
    <div class="map" id="map" ref="map"></div>
    <div id="mouse-position"></div>
    <div id="popup" class="ol-popup">
      <a href="" id="popup-closer" class="ol-popup-closer" @click="closePopup">x</a>
      <div id="popup-content" class="popup-content"></div>
      <div class="ol-popup-title">
        <span>{{ popupText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import { Image as ImageLayer } from "ol/layer";
import { ImageWMS, OSM, XYZ, WMTS, TileWMS } from "ol/source";
import { fromLonLat, transform } from "ol/proj";
import {
  defaults as ControlDefaults,
  ZoomSlider,
  MousePosition,
  Zoom,
  ScaleLine,
} from "ol/control";
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import {
  defaults as InteractionDefaults,
  DragPan,
  MouseWheelZoom,
  DragZoom,
} from "ol/interaction";
import DragRotateAndZoom from "ol/interaction/DragRotateAndZoom";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import * as olLoadingstrategy from "ol/loadingstrategy";
import { get as getProjection, Projection, toLonLat } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";
import TileGridWMTS from "ol/tilegrid/WMTS";
import { createStringXY } from "ol/coordinate";
import { toStringHDMS } from "ol/coordinate";
import axios from 'axios';
export default {
  name: "MapLayer",
  data() {
    return {
      map: null,
      layer: null,
      popupText: "",
      features: [],      //要素信息
      overlay: null,
      container: null
    };
  },
  mounted() {
    this.initMapWMS();
  },
  methods: {
    //初始化地图
    initMapLayer() {
      try {
        const container = this.$refs.map;
        const ipgeserver = "https://localhost:8899";
        const map_config = {
          //矢量切片服务器地址
          // vectorTile_url:"http://172.17.11.103:8323/geoserver/gwc/service/wmts",
          vectorTile_url:
            ipgeserver +
            "/geoserver/crj/gwc/service/wmts/1.0.0/VectorTile%3Avtmap@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
          // 矢量切片服务的图层名称
          layerName_vt: "crj:grid_pop_hp_sh_2020",
          //图层地址
          wms_data_url: ipgeserver + "/geoserver/DP/wms",
          // 图层名称
          wms_name: "dpRailway",
          // 图片图层地址
          railwaywmsUrl: ipgeserver + "/geoserver/DP/wms",
          // 图片图层名称
          railwaywmsLname: "DP:dpRailway",
          // 矢量图层地址
          stationwfsUrl:
            ipgeserver +
            "/geoserver/DP/ows?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=5000&",
          // 矢量图层名称
          stationwfsLname: "DP%3AstationData",
        };
        // [113.631419, 34.753439]是地理坐标 郑州为中心
        const map_center = transform(
          [121.38464355, 31.155578],
          "EPSG:4326",
          "EPSG:3857"
        );
        // 创建视图
        const view = new View({
          center: map_center,
          zoom: 8,
          maxZoom: 15,
          minZoom: 4,
        });
        // 创建瓦片图层
        const vector_layer = new VectorTileLayer({
          id: "vector_layer",
          source: new VectorTileSource({
            format: new MVT(),
            url: map_config.vectorTile_url,
          }),
          style: createlxmapStyle(view),
        });

        // 创建地图
        this.map = new Map({
          interactions: defaults(/*{doubleClickZoom:false}*/).extend([
            new DragRotateAndZoom(),
          ]),
          target: container,
          layers: [vector_layer],
          view: view,
        });
        // 添加图片图层
        const railwayLayer = new ImageLayer({
          id: "railwayLayer",
          zIndex: 4,
          source: new ImageWMS({
            url: map_config.railwaywmsUrl,
            params: {
              LAYERS: map_config.railwaywmsLname,
            },
            ratio: 2.0,
            serverType: "geoserver",
          }),
        });
        this.map.addLayer(railwayLayer);
        // 创建矢量图层
        const stationLayer = new VectorLayer({
          zIndex: 2,
          maxResolution: 10000,
          minResolution: 15,
          source: new VectorSource({
            format: new GeoJSON(),
            url: function (extent) {
              return (
                map_config.stationwfsUrl +
                "typeName=" +
                map_config.stationwfsLname +
                "&outputFormat=application/json&srsname=EPSG:3857&" +
                "bbox=" +
                extent.join(",") +
                ",EPSG:3857"
              );
            },
            strategy: olLoadingstrategy.bbox,
          }),
          style: function (feature, resolution) {
            return StationStyle(feature, resolution);
          },
        });

        // 创建的图层均要添加到map上
        this.map.addLayer(stationLayer);
      } catch (e) {
        console.log(e);
      }
    },
    initMap() {
      const container = this.$refs.map;
      let epgs = "EPSG:4326";
      const projection = getProjection(epgs);
      const extent = projection.getExtent();
      const size = getWidth(extent) / 256;
      const resolutions = new Array(22);
      const matrixIds = new Array(22);
      for (let z = 0; z < 22; z++) {
        resolutions[z] = size / Math.pow(2, z + 1);
        matrixIds[z] = epgs + ":" + z;
      }
      this.map = new Map({
        target: container,
        interactions: defaults(/*{doubleClickZoom:false}*/).extend([
          new DragRotateAndZoom(),
        ]),
        view: new View({
          center: [112, 31],
          zoom: 6,
          projection: epgs,
        }),
        layers: [
          // 底图用Open Street Map 地图
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: new WMTS({
              url: "http://localhost:8899/geoserver/gwc/service/wmts",
              layer: "crj:grid_pop_hp_sh_2020",
              matrixSet: epgs,
              format: "image/png",
              projection: projection,
              tileGrid: new TileGridWMTS({
                origin: getTopLeft(extent),
                resolutions: resolutions,
                matrixIds: matrixIds,
              }),
              style: "default",
            }),
          }),
        ],
      });
    },
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
    initMap3() {
      const container = this.$refs.map;
      var gridsetName = "EPSG:4326";
      var gridNames = [
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
      var baseUrl = "geoserver/gwc/service/wmts";
      var style = "";
      var format = "image/png";
      var infoFormat = "text/html";
      var layerName = "crj:grid_pop_hp_sh_2020";
      var projection = new Projection({
        code: "EPSG:4326",
        units: "degrees",
        axisOrientation: "neu",
      });
      var resolutions = [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
        0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
        1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
        2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6,
        2.682209014892578e-6, 1.341104507446289e-6, 6.705522537231445e-7,
        3.3527612686157227e-7,
      ];

      let params = {
        VERSION: "1.0.0",
        LAYER: layerName,
        STYLE: style,
        TILEMATRIX: gridNames,
        TILEMATRIXSET: gridsetName,
        SERVICE: "WMTS",
        FORMAT: format,
      };
      var constructSource = () => {
        var url = baseUrl + "?";
        for (var param in params) {
          url = url + param + "=" + params[param] + "&";
        }
        url = url.slice(0, -1);

        var source = new VectorTileSource({
          url: url,
          layer: params["LAYER"],
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
        });
        return source;
      };

      var layer = new VectorTileLayer({
        source: constructSource(),
      });

      var view = new View({
        center: [0, 0],
        zoom: 2,
        resolutions: resolutions,
        projection: projection,
        extent: [-180.0, -90.0, 180.0, 90.0],
      });

      var map = new Map({
        layers: [layer],
        target: container,
        view: view,
      });
      map
        .getView()
        .fit(
          [
            120.85234069824219, 30.69257926940918, 121.97152709960938,
            31.870302200317383,
          ],
          map.getSize()
        );
    },
    initMapWMS() {
      //底图
      let ditu = new TileLayer({
        title: "底图",
        source: new XYZ({
          url: "http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          // url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
        }), //这个会出现底图
      });
      const wmsSource = new ImageWMS({
        ratio: 1,
        url: "http://localhost:8899/geoserver/crj/wms",
        params: {
          LAYERS: "crj:grid_pop_hp_sh_2020",
          STYLES: "",
          VERSION: "1.1.1",
          FORMAT: "image/png",
        },
      });
      let untiled = new ImageLayer({
        source: wmsSource,
      });
      let tiled = new TileLayer({
        visible: false,
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
      this.layer = wmsSource;
      let projection = new Projection({
        code: "EPSG:4326",
        units: "degrees",
        axisOrientation: "neu",
      });
      const view = new View({
        projection: projection,
        // projection: "EPSG:4326",
        center: [121, 31.5],
        zoom: 8,
      });

      let MousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: "EPSG:4326",
        className: "custom-mouse-position",
        target: document.getElementById("mouse-position"),
        undefinedHTML: "&nbsp;",
      });

      this.map = new Map({
        interactions: InteractionDefaults().extend([new DragRotateAndZoom()]),
        controls: ControlDefaults({
          zoom: true,
        }).extend([
          new Zoom(),
          new ScaleLine(),
          new ZoomSlider(),
          MousePositionControl,
        ]),
        //引入地图
        layers: [ditu, untiled],
        target: "map",
        view: view,
      });

      //弹框Overlay对象
      this.overlay = new Overlay({
        element: document.getElementById("popup"),      //绑定的DOM对象
        autoPan: true,            // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {       //自动平移效果的动画时间 9毫秒
          duration: 250,        
        },
      });
      //将弹窗添加到map地图中
      this.map.addOverlay(this.overlay);


      let _that = this;
      //获取弹框的节点DOM
      const closer = document.getElementById('popup-closer');
      //弹窗的关闭事件
      closer.onclick = ()=>{
        //将overlay对象的setPosition赋值为undefined即可隐藏。
        _that.overlay.setPosition(undefined)
        closer.blur()
        return false
      }
      

      //地图鼠标悬停监听
      // this.map.on("pointermove", (e)=>{
      //   console.log("pointermove");
      //    if (e.dragging) { return; }
      //    const data = untiled.getData(e.pixel);
      //    const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
      //    me.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      // })
      // 地图缩放监听
      this.map.on("moveend", (e) => {
        console.log("movveend");
      });

      //监听地图单击时间
      this.map.on("singleclick", this.mapClick);


    },
    //点击地图提取要素信息并展示
    mapClick(e) {
      //弹窗的内容节点DOM
      const content = document.getElementById("popup-content")
      const coordinate = e.coordinate;
      let hdms = toStringHDMS(toLonLat(coordinate))     //转换为经纬度显示
      content.innerHTML = `
      <p>经纬度: <code>"+ ${hdms} + "</code></p>
      <p>坐标: X:${(parseInt(coordinate[0]*100)/100).toFixed(2)} &nbsp;&nbsp; Y: ${(parseInt(coordinate[1]*100)/100).toFixed(2)}</p>
      <p>要素信息：
        <span></span>
      </p>
      `;
      this.overlay.setPosition(coordinate);     //把 overlay 显示到指定的 x,y坐标


      const viewResolution = this.map.getView().getResolution();
      const url = this.layer.getFeatureInfoUrl(
        e.coordinate,
        viewResolution,
        "EPSG:4326",
        { INFO_FORMAT: "application/json" }
      );
      if (url) {
        axios.get(url).then((res) => {
          console.log(res.data.features);
          if (res.data.features) {
            this.features = res.data.features;
            if (this.features.length) {
              console.log(this.features[0].properties);
            }
          }
        });
      }
    },
    //弹窗关闭
    closePopup() {
      
    }
  },
};
</script>
<style lang="less" scoped>
.map-view-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .map {
    width: 713px;
    height: 488px;
  }
  .ol-popup {
      position: absolute;
      background-color: white;
      -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
      filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #cccccc;
      bottom: 12px;
      left: -50px;
      .popup-content {
        width: 400px;
        text-align: left;
      }
      .ol-popup-closer {
          text-decoration: none;
          position: absolute;
          top: 2px;
          right: 8px;

      }
  }
}
</style>