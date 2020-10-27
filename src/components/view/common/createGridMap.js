import { debug } from "util";
const jc_path=require("images/jc_48_48.png");
/*param
    @labelText 我的位置文字标注
    @lat:纬度值
    @lng:经度值
  */
export const tMap = function (options) {
  this.polyline = null;
  this.polylinePathArr = [];//实时定位
  this.options = options;//配置参数
  this.Event = qq.maps.event;
  this.labelArray = [];//坐标标注数组
  this.gridArray = [];//网格线数组
  this.markerArray = []//标记数组
  this.rectArrs = []//网格区块数组
  this.center = this.getMapCenter(options.lat, options.lng);
  this.setMap(options);
  this.zoom = options.zoom;
  this.OverlayType = options.OverlayType; //绘图模式
  this.markers = null; // 所选中心区域
  this.coordinates = []; // 根据所选中心获取的四点
  this.radius = options.radius * 1000; //搜索半径
  this.parts = Math.sqrt(options.parts); //栅格等分数 
  this.circle = null; //根据所选中心绘制 所选半径的圆形区域
  this.circleBounds = null; //所选区域范围的经纬度  - 用来判断是否超出规定区域
  this.targetAreaArr = []; //依据中心点所画的栅格
}
//创建地图
tMap.prototype.setMap = function (options) {
  let _this = this;
  let labelText = this.options.labelText;
  _this.getCityCenter(this.lat, this.lng, labelText, options.zoom, options.id);
}
//获取城市列表接口设置中心点
tMap.prototype.getCityCenter = function (lat, lng, labelText, zoom, id) {
  let _this = this;
  console.log(zoom || 13);
  this.map = new qq.maps.Map(document.getElementById(id||'container'), {
    center: this.center,
    zoom: 13,
    mapTypeControlOptions: {
      //设置控件的地图类型ID，ROADMAP显示普通街道地图，SATELLITE显示卫星图像，HYBRID显示卫星图像上的主要街道透明层
      mapTypeIds: [
        qq.maps.MapTypeId.ROADMAP,
        qq.maps.MapTypeId.SATELLITE,
        qq.maps.MapTypeId.HYBRID
      ],
      position: qq.maps.ControlPosition.TOP_CENTER, //设置控件位置相对上方中间位置对齐
    },
    zoomControl: false,  //缩放控件
    panControl: false //平移控件
  });
  let label = new qq.maps.Label({
    position: new qq.maps.LatLng(lat, lng),
    map: _this.map,
    content: labelText,
    offset: new qq.maps.Size(8, -40)
  });
  console.log(this.map.getZoom())


}
tMap.prototype.drawPolyline = function(params) {
  new qq.maps.Polyline({
    map: this.map,
    //折线的路径
    path: [],
    //折线的颜色
    strokeColor: '#000000',
    //可以设置折线的透明度
    //strokeColor: new qq.maps.Color(0, 0, 0, 0.5),
    //折线的样式
    strokeDashStyle: 'dash',
    //折线的宽度
    strokeWeight: 3,
    //折线是否可见
    visible: true,
    //折线的zIndex
    zIndex: 99999999,
    ...params
});
} 
tMap.prototype.initEvents = function (Event, callback) {
  qq.maps.event.addListener(this.map, Event, () => callback(this.map))
}
//获取地图中心点创建地图
tMap.prototype.getMapCenter = function (lat, lng) {
  let _this = this;
  this.lat = typeof lat == 'undefined' ? 22.543099 : lat;
  this.lng = typeof lng == 'undefined' ? 114.057868 : lng;
  return new qq.maps.LatLng(this.lat, this.lng);
};
//设置跳动标记
tMap.prototype.setBeatMark = function () {
  if (typeof this.options.beatMark !== 'undefined' && this.options.beatMark === false) {
    return;
  }
  let _this = this;
  let anchor = new qq.maps.Point(10, 30);
  let size = new qq.maps.Size(32, 30);
  let origin = new qq.maps.Point(0, 0);
  let icon = new qq.maps.MarkerImage('http://lbs.qq.com/javascript_v2/sample/img/plane.png', size, origin, anchor);
  size = new qq.maps.Size(52, 30);
  let originShadow = new qq.maps.Point(32, 0);
  let shadow = new qq.maps.MarkerImage(
    'http://lbs.qq.com/javascript_v2/sample/img/plane.png',
    size,
    originShadow,
    anchor
  );
  let marker = new qq.maps.Marker({
    icon: icon,
    shadow: shadow,
    map: _this.map,
    position: _this.center,
    animation: qq.maps.MarkerAnimation.BOUNCE
  });
  return this;
}

//绘图功能
tMap.prototype.drawingManager = function () {
  let Tmap = this.map, _this = this;
  let drawingManager = new qq.maps.drawing.DrawingManager({
    drawingMode: this.OverlayType, //qq.maps.drawing.OverlayType.POLYGON
    drawingControl: true,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.MARKER,
        // qq.maps.drawing.OverlayType.CIRCLE,
        // qq.maps.drawing.OverlayType.POLYGON,
        // qq.maps.drawing.OverlayType.POLYLINE,
        // qq.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    polygonOptions: {
      fillColor: new qq.maps.Color(0, 0, 0, 0),
      strokeColor: new qq.maps.Color(88, 88, 88, 1),
      strokeWeight: 2,
      clickable: false,
      zIndex: 1
    }
  });

  this._drawingManager = drawingManager; //保留原生的drawingManager,其它地方需要用到
  drawingManager.setMap(Tmap);
  this.Event.addListener(drawingManager, 'markercomplete', function (event) { //绘制 marker标记 结束
    console.log(drawingManager, event, 'markercomplete');
    if(_this.markers){ //清除已绘制中心点 及 绘制的栅格
      _this.markers.setMap(null);
      _this.clearTargetAreaArr();
      // _this.circle.setMap(null);
    }
    _this.markers = event;
    let center = new qq.maps.LatLng(event.position.lat, event.position.lng);
    // _this.circle = new qq.maps.Circle({
    //   map: Tmap,
    //   center: center,
    //   radius: _this.radius,
    //   // fillColor: "", //默认填充透明色
    //   strokeWeight: 1
    // });
    // _this.map.fitBounds(_this.circle.getBounds())
    Tmap.setCenter(center);
    _this.getRectPaths(center, _this.radius);
    drawingManager.setDrawingMode(null); //

  });


  this.Event.addListener(drawingManager, 'polygoncomplete', function (event) { //绘制多边形结束
    console.log(event, 'polygoncomplete');
    let latArr = [], lngArr = [];
    $.each(event.path.elems, function (index, item) {
      latArr.push(item.lat);
      lngArr.push(item.lng);
    });

    let maxLat = Math.max(...latArr);
    let minLat = Math.min(...latArr);
    let maxLng = Math.max(...lngArr);
    let minLng = Math.min(...lngArr);
    drawingManager.setDrawingMode(null);//绘制完成退出编辑
    _this.createGrid(maxLat, minLat, maxLng, minLng); //绘制网格
    //_this.createTestMaker();  //注释掉
    _this.getLabelContent();
    //根据绘图路径画覆盖物,增加黑色的背景
    _this.polygon = new qq.maps.Polygon({
      path: event.path.elems,
      strokeColor: new qq.maps.Color(88, 88, 88, 1),
      strokeWeight: 1,
      fillColor: new qq.maps.Color(0, 0, 0, .5),
      map: _this.map
    });
    _this.polygon.setZIndex(1);
  });
}
// 计算相距 S km 的点的经纬度
tMap.prototype.getRectPaths = function(aob, distance){
  let _this = this;
  let coordinates= [], coordinates2=[];
//   const R = 6371; //地球半径
//   let d = distance; //距离
//   let lat1 = (Math.PI/180) * aob.lat; //已知坐标纬度
//   let lon1 = (Math.PI/180) * aob.lng; //已知坐标经度
//   let brngArr = [90,-90,0,180]; //要获取的四个点的方位角
//   let len = brngArr.length;

//   for(let i=0; i<len; i++){
//     let brng = (Math.PI/180) * brngArr[i]; // 方位角 90和-90 (水平方向坐标)   0和180 (竖直方向 坐标)
  
//     let lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) +
//         Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng));

//     let lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
//                 Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));

//     lat2 = lat2 / (Math.PI/180);
//     lon2 = lon2 / (Math.PI/180);

//     let coord = {lat: lat2, lng: lon2};
//     coordinates.push(coord);
//   }
  var circle = new qq.maps.Circle({
      map: _this.map,
      center: aob,
      radius: distance,
      strokeWeight: 1,
      visible: false
  });
  let NorthEast = circle.getBounds().getNorthEast();
  let SouthWest = circle.getBounds().getSouthWest();
  let minLat = SouthWest.lat,
      minLng = SouthWest.lng,
      maxLat = NorthEast.lat,
      maxLng = NorthEast.lng;
  let xb = {lat: maxLat, lng: minLng};
  let db = {lat: maxLat, lng: maxLng};
  let dn = {lat: minLat, lng: maxLng};
  let xn = {lat: minLat, lng: minLng};
  coordinates2 = [xb, db, dn, xn];
  _this.drawShape = {
    drawShapeType: 'polygon',//绘制的形状,多边形
    latLngArr: coordinates2,//多边形的点
    parts: _this.parts, //parts*parts 分栏
    radius: String(_this.radius), //搜索半径
  }
  this.drawingPolygon(coordinates2, false)
}

tMap.prototype.searchService = function(){
  let map=this.map;
  let searchService= new qq.maps.SearchService({
    location: "深圳",
    pageIndex: 0,
    pageCapacity: 1,
    //检索成功的回调函数
    complete: function(results) {
      debugger
        //设置回调函数参数
        var pois = results.detail.pois;
        var infoWin = new qq.maps.InfoWindow({
            map: map,
        });
        var latlngBounds = new qq.maps.LatLngBounds();
        if(typeof pois == "undefined"){
          return;
        }
        for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i];
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng);

          /*  (function(n) {
                var marker = new qq.maps.Marker({
                    map: map
                });
                marker.setPosition(pois[n].latLng);

                marker.setTitle(i + 1);
           //     markers.push(marker);


                qq.maps.event.addListener(marker, 'click', function() {
                    infoWin.open();
                    infoWin.setContent('<div style="width:280px;height:100px;">' + 'POI的ID为：' +
                        pois[n].id + '，POI的名称为：' + pois[n].name + '，POI的地址为：' + pois[n].address + '，POI的类型为：' + pois[n].type + '</div>');
                    infoWin.setPosition(pois[n].latLng);
                });
            })(i);*/
        }
        //调整地图视野
        map.fitBounds(latlngBounds);
      },
      //若服务请求失败，则运行以下函数
      error: function() {
          console.log("出错了。");
      }
  });
  return searchService;
}
//圈定目标区域范围
tMap.prototype.createGrid = function (maxLat, minLat, maxLng, minLng, parts) { //parts 栅格数
  let _this = this;

  //目标范围矩形路径
  let path1 = [
    new qq.maps.LatLng(maxLat, minLng),
    new qq.maps.LatLng(minLat, minLng),
    new qq.maps.LatLng(minLat, maxLng),
    new qq.maps.LatLng(maxLat, maxLng)
  ];

  let polygon = new qq.maps.Polygon({
    path: path1,
    strokeColor: '#ccc',
    strokeWeight: 0,
    fillColor: new qq.maps.Color(255, 208, 70, 0.3),
    map: _this.map
  });
  polygon.setZIndex(0);

  //网格路径
  let rowStepSize = (maxLat - minLat) / parts;
  let colStepSize = (maxLng - minLng) / parts;
  this.maxLat = maxLat;
  this.minLat = minLat;
  this.maxLng = maxLng;
  this.minLng = minLng; 
  _this.rowStepSize = rowStepSize;
  _this.colStepSize = colStepSize;


  _this.rowLinePath = [];
  for (let i = 1; i <= parts-1; i++) {
    Array.prototype.push.call(_this.rowLinePath,
      [
        new qq.maps.LatLng(minLat + rowStepSize * i, minLng),
        new qq.maps.LatLng(minLat + rowStepSize * i, maxLng)
      ]
    );
  }

  _this.colLinePath = [];
  for (let i = 1; i <= parts-1; i++) {
    Array.prototype.push.call(_this.colLinePath,
      [
        new qq.maps.LatLng(minLat, minLng + colStepSize * i),
        new qq.maps.LatLng(maxLat, minLng + colStepSize * i)
      ]
    );
  }

  var rectangle = [];
  var index = 1;
  var tpoint = [maxLat, minLng];

  for (let r = 1; r < parts+1; r++) {
    tpoint[1] = minLng;
    for (let i = 1; i < parts; i++) {
      var pa = {};
      pa.index = index;
      pa.a = new qq.maps.LatLng(tpoint[0], tpoint[1]);
      pa.b = new qq.maps.LatLng(tpoint[0], tpoint[1] + colStepSize);
      if (r == parts+1) {
        pa.c = new qq.maps.LatLng(minLat, tpoint[1]);
        pa.d = new qq.maps.LatLng(minLat, tpoint[1] + colStepSize);
      } else {
        pa.c = new qq.maps.LatLng(tpoint[0] - rowStepSize, tpoint[1]);
        pa.d = new qq.maps.LatLng(tpoint[0] - rowStepSize, tpoint[1] + colStepSize);
      }
      tpoint[1] = tpoint[1] + colStepSize;
      rectangle.push(pa);
      index++;
    }

    rectangle.push({
      a: new qq.maps.LatLng(tpoint[0], tpoint[1]),
      b: new qq.maps.LatLng(tpoint[0], maxLng),
      c: new qq.maps.LatLng(tpoint[0] - rowStepSize, tpoint[1]),
      d: new qq.maps.LatLng(tpoint[0] - rowStepSize, maxLng),
      index: index++
    })
    if (r == parts+1) {
      tpoint[0] = minLat;
    } else {
      tpoint[0] = maxLat - rowStepSize * r;
    }
  }



  for (let i = 0, len = rectangle.length; i < len; i++) {

    (function () {
      var targetArea = new qq.maps.Polygon({
        cursor: 'crosshair',
        editable: false,
        map: _this.map,
        path: [rectangle[i].a, rectangle[i].c, rectangle[i].d, rectangle[i].b, rectangle[i].a],
        visible: true,
        zIndex: 1000,
        clickable: true
      });
      _this.targetAreaArr.push(targetArea);
      var decoration = new qq.maps.MarkerDecoration(rectangle[i].index + '', new qq.maps.Point(0, -5));
      var label_index = new qq.maps.Label({
        position: targetArea.getBounds().getNorthEast(),
        offset: new qq.maps.Size(-20, 0),
        content: rectangle[i].index + '',
        map: _this.map,
        // decoration: decoration,
        style: { userSelect: 'none', color: "#f00", fontSize: "16px", fontWeight: "bold" }
      });
      // var label_name = new qq.maps.Label({
      //   position: targetArea.getBounds().getCenter(),
      //   map: _this.map,
      //   // decoration: decoration,
      //   content: '未选择',
      //   offset: new qq.maps.Size(-40, 3),
      //   style: {
      //     color: "#fff",
      //     fontSize: "10px",
      //     background:' transparent',
      //     border: 'none',
      //   },
      //   visible: true,
      //   zIndex: 1000,
      // });
      // var decoration_marker = new qq.maps.MarkerDecoration(rectangle[i].index + '', new qq.maps.Point(0, -24));
      // var marker = new qq.maps.Marker({
      //   position:targetArea.getBounds().getCenter(),
      //   map: _this.map,
      //   decoration: decoration_marker,
      //   visible:true,
      //   icon:new qq.maps.MarkerImage(jc_path,new qq.maps.Size(48,48)),
      //   //animation:qq.maps.MarkerAnimation.BOUNCE
      // });
      // _this.Event.addListener(marker, "click", function(event){
      //   console.log(event);
      //   let index = event.target.content;
      //   _this.showAllPeople(event, rectangle[i], label_name);
      // });

      _this.Event.addListener(targetArea, "click", function (event) {
        // console.log(event);
        rectangle[i].latLng = event.latLng; //保存点击的坐标
        _this.showAllPeople&&_this.showAllPeople(event, rectangle[i], targetArea)
        // _this.showSelPeopleDlg(rectangle[i]); //把区域编号传进去,在对话框上面显示区域编号

      });

    })(); //使用闭包缓存目标区域  
  }

  /*
  _this.Event.addListener(_this._drawingManager, 'markercomplete', function(event) { //绘制marker结束,判断marker是否在绘制矩形内部
    
     
     console.error("tttt="+polyline.getBounds().contains(event.getPosition()));
    
    
    
     var rowLinePath=_this.rowLinePath;
     var colLinePath=_this.colLinePath;
     var hasFind=false;
     for(var _pp in rowLinePath){
         if(_pp.contains(event.getpostion)){
           hasFind=true;
           break;
         }
     }
     
     if(!hasFind){
       for(var _pp in colLinePath){
         if(_pp.contains(event.getpostion)){
           hasFind=true;
           break;
         }
       }
     }

     if(!hasFind){
       alert("不在指定的区域");
     }

 });*/




  //添加定时器
  setTimeout(function () {
    _this.map.fitBounds(polygon.getBounds()); //根据指定的范围调整地图视野
    _this.cratePolyline(_this.rowLinePath, _this.colLinePath)
    _this._drawingManager.setMap(null);//绘制完成移除画图组件 
    _this.map.set('disableDoubleClickZoom',true); //禁止点击缩放地图
  }, 500);
};
//
tMap.prototype.cratePolyline = function (rowLinePath, colLinePath) {
  let _this = this;

  let newArr = [...rowLinePath, ...colLinePath];
  $.each(newArr, function (index, item) {
    var path = item
    var polyline = new qq.maps.Polyline({
      //折线是否可点击
      clickable: true,
      //鼠标在折线上时的样式
      cursor: 'crosshair',
      //折线是否可编辑
      editable: false,
      map: _this.map,
      //折线的路径
      path: path,
      //折线的颜色
      // strokeColor: '#000000',
      //可以设置折线的透明度
      strokeColor: new qq.maps.Color(0, 153, 255),
      //折线的样式
      strokeDashStyle: 'solid',
      //折线的宽度
      strokeWeight: 2,
      //折线是否可见
      visible: true,
      //折线的zIndex
      zIndex: 1000
    });
    Array.prototype.push.call(_this.gridArray, polyline);
  })

};





tMap.prototype.drawingCircle = function (callBack) {
  let Tmap = this.map;
  let subObject = null;
  var drawingManager = new qq.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.CIRCLE
      ]
    },
    circleOptions: {
      fillColor: new qq.maps.Color(255, 208, 70, 0.3),
      strokeColor: new qq.maps.Color(88, 88, 88, 1),
      strokeWeight: 3,
      clickable: false
    }
  });
  drawingManager.setMap(Tmap);
  this.Event.addListener(drawingManager, 'circlecomplete', function (event) {
    callBack({ coord: event.center, radius: event.radius });
    drawingManager.setDrawingMode(null);//绘制完成退出编辑
  //  drawingManager.setMap(null);//绘制完成移除画图组件
  });
}

// 绘制多边形
tMap.prototype._drawingPolygon = function (callBack) {
  let Tmap = this.map;
  let subObject = null;
  var drawingManager = new qq.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.POLYGON
      ]
    },
    polygonOptions: {
      fillColor: new qq.maps.Color(0, 0, 0, 0),
      strokeColor: new qq.maps.Color(88, 88, 88, 1),
      strokeWeight: 2,
      clickable: false,
      zIndex: 1
    }
  });
  drawingManager.setMap(Tmap);
  this.Event.addListener(drawingManager, 'polygoncomplete', function (event) {
    console.log(event, 'polygoncomplete')
    callBack(event,drawingManager);
    drawingManager.setDrawingMode(null);//绘制完成退出编辑
    //drawingManager.setMap(null);//绘制完成移除画图组件
  });
}

/*********************服务类***************************/
//地址解析
tMap.prototype.resolveLatLng = function (latlngMsg, callBack) {
  let geocoder = new qq.maps.Geocoder();
  let lat = parseFloat(latlngMsg.lat);
  let lng = parseFloat(latlngMsg.lng);
  let latLng = new qq.maps.LatLng(lat, lng);
  geocoder.getAddress(latLng);
  geocoder.setComplete(function (result) {
    callBack(result.detail.address);
  });
}
//清除覆盖物
tMap.prototype.clearOverlay = function () {
  this.setMap(this.options);
  this.setBeatMark();
  this.drawingManager();
};
//清除圆形覆盖物
tMap.prototype.clearCircle = function () {
  this.setMap(this.options);
  this.setBeatMark();
};


//画折线
tMap.prototype.drawingLine = function (data) {

  this.map.setMapTypeId(qq.maps.MapTypeId.HYBRID);  //显示卫星地图

  let path = [];
  let _this = this;
  if (data.length > 0) {
    data.forEach((item, index) => {
      path.push(new qq.maps.LatLng(item.lat, item.lng))
    });
    qq.maps.convertor.translate(path, 1, function (res) {
      util.method.subsection(res, function (fData) {
        new qq.maps.Polyline({
          map: _this.map,
          path: fData,
          strokeColor: "#1c29d8",
          strokeWeight: 5,
        });
      }, 50, 300)();
      _this.map.panTo(new qq.maps.LatLng(res[0].lat, res[0].lng));
      _this.map.zoomTo(18);
    });
  }

}

//添加坐标点标注
tMap.prototype.createTestMaker = function () {
  let _this = this;
  let labelArr = [...this.rowLinePath];
  let otherMakerArr = [];
  labelArr.push(
    [
      new qq.maps.LatLng(_this.maxLat, _this.minLng),
      new qq.maps.LatLng(_this.minLat, _this.maxLng)
    ], [
      new qq.maps.LatLng(_this.minLat, _this.minLng),
      new qq.maps.LatLng(_this.maxLat, _this.maxLng)
    ]
  )
  for (let i = 1; i <= 4; i++) {
    Array.prototype.push.call(otherMakerArr,
      [
        new qq.maps.LatLng(_this.minLat + _this.rowStepSize * i, _this.minLng + _this.colStepSize),
        new qq.maps.LatLng(_this.minLat + _this.rowStepSize * i, _this.minLng + _this.colStepSize * 2),
        new qq.maps.LatLng(_this.minLat + _this.rowStepSize * i, _this.minLng + _this.colStepSize * 3),
        new qq.maps.LatLng(_this.minLat + _this.rowStepSize * i, _this.minLng + _this.colStepSize * 4)
      ]
    );
  }
  let resultLabelArray = [...labelArr, ..._this.colLinePath, ...otherMakerArr];
  $.each(resultLabelArray, function (index, item) {
    $.each(item, function (index1, item1) {
      var label = new qq.maps.Label({
        position: item1,
        zIndex: 3,
        map: _this.map,
        content: item1.lat + '<br/>' + item1.lng,
        style: { userSelect: 'none', color: "#000", fontSize: "12px", fontWeight: "bold", background: new qq.maps.Color(0, 0, 0, 0), borderColor: new qq.maps.Color(0, 0, 0, 0) }
      });
      Array.prototype.push.call(_this.labelArray, label);
    });
  })
  this.cZoom = this.map.getZoom();
  this.map.zoomTo(this.cZoom + 1);
};

//多点标记并添加判断
tMap.prototype.createMakers = function (DataCallback, markerFun ) {
  let _this = this;
  this.Event.addListener(this.map, 'click', function (event) {
    DataCallback&&DataCallback(event);
     var marker = new qq.maps.Marker({
      position: event.latLng,
      map: _this.map,
      zIndex: 3
    });
    _this.Event.addListener(marker, 'click', function (event) {

    });
    markerFun&&markerFun(marker);
  });
};


/************************实时定位**********************/
tMap.prototype.setPolyline = function () {
  this.polyline = new qq.maps.Polyline({
    path: this.polylinePathArr,
    strokeColor: '#1c29d8',
    strokeWeight: 10,
    editable: false,
    map: this.map
  });
}
tMap.prototype.drawingPolyline = function (data) {
  this.polylinePathArr.push(new qq.maps.LatLng(data.lat, data.lng));
  this.polyline.setMap(this.map);
  this.polyline.setPath(this.polylinePathArr);
}

//---------------------------------
//绘制多边形
//---------------------------------
tMap.prototype.drawingPolygon = function (data, noGrid, parts) {
  console.log(data);
  let latArr = [], lngArr = [];
  var path = [];
  data.forEach(function (item, index) {
    path.push(new qq.maps.LatLng(item.lat, item.lng));
    latArr.push(item.lat);
    lngArr.push(item.lng);
  })

  // var polygon = new qq.maps.Polygon({
  //   clickable: true,
  //   cursor: 'crosshair',
  //   editable: false,
  //  fillColor: new qq.maps.Color(122, 167, 153, 0.3),
  //   map: this.map,
  //   path: path,
  //   visible: true,
  //   zIndex: 0
  // });

  //------------------------------
  //绘制网格
  //------------------------------
  let maxLat = Math.max(...latArr);
  let minLat = Math.min(...latArr);
  let maxLng = Math.max(...lngArr);
  let minLng = Math.min(...lngArr);
  noGrid?'': this.createGrid(maxLat, minLat, maxLng, minLng, this.parts || parts);
}

/***********************获取系列********************/
//画线
tMap.prototype.getLabelContent = function (argument) {
  let _this = this;
  let latArr = [];
  let lngArr = [];
  let totalArr = [];
  this.labelArray.forEach(function (element, index) {
    Array.prototype.push.call(totalArr, element.content.split('<br/>'));
    Array.prototype.push.call(latArr, element.content.split('<br/>')[0]);
    Array.prototype.push.call(lngArr, element.content.split('<br/>')[1]);
  });
  latArr = Array.from(new Set(latArr)).sort(function (a, b) { return b - a; });
  lngArr = Array.from(new Set(lngArr)).sort();
  let len = latArr.length - 1;
  let rectArr = [];
  for (let i = 0; i < len; i++) {
    rectArr.push([latArr[i], lngArr[0], latArr[i], lngArr[1], latArr[i + 1], lngArr[1], latArr[i + 1], lngArr[0]]);
    rectArr.push([latArr[i], lngArr[1], latArr[i], lngArr[2], latArr[i + 1], lngArr[2], latArr[i + 1], lngArr[1]]);
    rectArr.push([latArr[i], lngArr[2], latArr[i], lngArr[3], latArr[i + 1], lngArr[3], latArr[i + 1], lngArr[2]]);
    rectArr.push([latArr[i], lngArr[3], latArr[i], lngArr[4], latArr[i + 1], lngArr[4], latArr[i + 1], lngArr[3]]);
    rectArr.push([latArr[i], lngArr[4], latArr[i], lngArr[5], latArr[i + 1], lngArr[5], latArr[i + 1], lngArr[4]]);
  }
  rectArr.forEach(function (item, index) {
    let path = [
      new qq.maps.LatLng(item[0], item[1]),
      new qq.maps.LatLng(item[2], item[3]),
      new qq.maps.LatLng(item[4], item[5]),
      new qq.maps.LatLng(item[6], item[7])
    ];
    var polygon = new qq.maps.Polygon({
      path: path,
      strokeColor: new qq.maps.Color(0, 0, 0, 0),
      strokeWeight: 1,
      zIndex: 0,
      fillColor: new qq.maps.Color(0, 0, 0, 0),
      map: _this.map
    });
    var cssC = {
      color: "#f00",
      fontSize: "16px",
      fontWeight: "bold",
      userSelect: "none"
    };
    var label = new qq.maps.Label({
      //如果为true，表示可点击，默认true。
      clickable: true,

      //标签的文本。
      content: index + '',

      //显示标签的地图。
      map: _this.map,

      //相对于position位置偏移值，x方向向右偏移为正值，y方向向下偏移为正值，反之为负。
      offset: new qq.maps.Size(0, -30),

      //标签位置坐标，若offset不设置，默认标签左上角对准该位置。
      position: new qq.maps.LatLng(item[6], item[7]),

      //Label样式。
      style: cssC,

      //如果为true，表示标签可见，默认为true。
      visible: true,

      //标签的z轴高度，zIndex大的标签，显示在zIndex小的前面。
      zIndex: 1000
    });
    Array.prototype.push.call(_this.rectArrs, polygon);
  })
};
/********************取消动作系列*******************/
tMap.prototype.clear = function (arr) {
  if (arr) {
    arr.forEach((t) => {
      t&&t.setMap(null);
    })
  }
}
/*清除坐标标注*/
tMap.prototype.clearCoord = function () {
  this.clear(this.labelArray)
}
/*清除网格*/
tMap.prototype.clearGrid = function () {
  this.clear(this.gridArray)
}


// targetAreaArr
/*清除依据中心点所画网格*/
tMap.prototype.clearTargetAreaArr= function () {
  this.clear(this.targetAreaArr)
  this.clear(this.gridArray)
  this.clearCoord()
}