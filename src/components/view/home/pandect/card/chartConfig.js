export const setMap = function(echarts,ele,history){
  let myChart = echarts.init(ele);
  let showData = [];
  let eventArray = [];
  let series=[];
  let categories = []
  let planePath = 'arrow';
  let color = ['#a6c84c', '#ffa022', '#46bee9'];
  // let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313';
  let datas = [{
      name: '宝安区',
      label: {
          normal: {
              show: false
          }
      },
      itemStyle: {
        areaColor:'#203177',//该字段改变地图单个区块的颜色
      },
    }, {
        name: '南山区',
        itemStyle: {
          areaColor:'#203177',
        },
        label: {
            normal: {
                show: false
            }
        }                            
    }, {
        name: '福田区',
        itemStyle: {
          areaColor:'#203177',
        },
    }, {
        name: '罗湖区',
        itemStyle: {
          areaColor:'#203177',
        },
    }, {
        name: '盐田区',
        itemStyle: {
          areaColor:'#203177',
        },
        label: {
            normal: {
                show: false
            }
        }                            
    }, {
        name: '龙岗区',
        itemStyle: {
          areaColor:'#203177',
        },
    }
  ]
  let geoCoorddata={
      '南山区':[113.9369366556,22.5389728649],
      '宝安区':[113.889506,22.509626],
      '盐田区':[114.243911,22.564199],
      '龙华区':[114.027722,22.660587],
      '坪山区':[114.349986,22.696909],
      '福田区':[114.061087,22.528578],
      '光明新区':[113.923662,22.779082],
      '大鹏新区':[114.481542,22.603420],
      // '前海':[113.904614,22.543350],
      '罗湖':[114.1375422225,22.5552901486],
      // '蛇口':[113.921940,22.489142],
      '龙岗':[114.2542519005,22.7261548561]
  };
  let geoCoorddatas={
    '紧急事件':[114.461542,22.623420]
  };
  let HQData = [
      [{name:'龙华区'}, {name:'盐田区',value:95}],
      [{name:'南山区'}, {name:'盐田区',value:90}],
      [{name:'南山区'}, {name:'龙华区',value:80}],
      [{name:'南山区'}, {name:'坪山区',value:70}],
      [{name:'南山区'}, {name:'福田区',value:60}],
      [{name:'南山区'}, {name:'光明新区',value:50}],
      [{name:'南山区'}, {name:'大鹏新区',value:40}],
      [{name:'南山区'}, {name:'罗湖',value:30}],
      [{name:'南山区'}, {name:'龙岗',value:20}]
  ];
  let convertData = function (data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];
          let fromCoord = geoCoorddata[dataItem[0].name];
          let toCoord = geoCoorddata[dataItem[1].name];
          if (fromCoord && toCoord) {
              res.push({
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  coords: [fromCoord, toCoord]
              });
          }
      }
      return res;
  };
  datas.forEach(function(item,index){
    Array.prototype.push.call(categories,item.name);
  })
  for (let val in geoCoorddata){
      Array.prototype.push.call(showData,{name:val,value: geoCoorddata[val].concat(107.15151943496)})
  }
  for (let val in geoCoorddatas){
      Array.prototype.push.call(eventArray,{name:val,value: geoCoorddatas[val].concat(127.15151943496)})
  }
  series.push(
      {
          name: '深圳',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data:showData,
          roam: false,
          symbolSize: function (val) {
              return val[2] / 10;
          },
          legendHoverLink:true,
          rippleEffect:{
              period:10,
              scale:0.1,
              brushType:'fill'
          },
          effectType:'ripple',
          rippleEffect: {
              brushType: 'fill'
          },
          label: {
              normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true
              },
              emphasis: {
                  show: true
              }
          },
          itemStyle: {
            normal: {
              areaColor: 'transparent',
              borderColor: '#fff',
              borderWidth: 2,
              shadowColor: 'rgba(63, 218, 255, 1)',
              shadowBlur: 20
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          }
      }, {
          name: '深圳',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data:eventArray,
          symbolSize: function (val) {
              return val[2] / 10;
          },
          showEffectOn: 'render',
              rippleEffect: {
                  brushType: 'stroke'
              },
              
              label: {
                  normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: false,
                      color:'red'
                  }
              },
          markPoint:{
            symbol: 'circle',
            symbolSize:20,
            label: {
                normal: {
                    show: true,
                    formatter: function(d) {
                        return d.name
                    },
                    offset:[0,-15],
                    fontStyle:'italic'
                }
            },
            itemStyle:{
              normal:{
                color:'red'
              }
            },
            data: [{
                  name: '紧急事件',
                  coord: [114.461542,22.623420],
              }
            ],
            effect : {  
                show: true,  
                shadowBlur : 0  
            }
          },
          itemStyle: {
              normal: {
                  color: '#f40',
              },
              emphasis:{
                color:'red'
              }
          },
      }
  );
  // [['南山区', HQData]].forEach(function (item, i) {
  //     series.push({
  //         name: '巡逻轨迹',
  //         type: 'lines',
  //         zlevel: 1,
  //         effect: {
  //             show: true,
  //             period: 6,
  //             trailLength: 0.7,
  //             color: '#fff',
  //             symbolSize: 3
  //         },
  //         roam: true,,
  //         lineStyle: {
  //             normal: {
  //                 color: color[i],
  //                 width: 0,
  //                 curveness: 0.2
  //             }
  //         },
  //         data: convertData(item[1])
  //     },
  //     {
  //         name: '作战轨迹',
  //         type: 'lines',
  //         zlevel: 2,
  //         roam: true,,
  //         symbol: ['none', 'arrow'],
  //         symbolSize: 3,
  //         effect: {
  //             show: true,
  //             period: 6,
  //             trailLength: 0,
  //             symbol: planePath,
  //             symbolSize: 15
  //         },
  //         lineStyle: {
  //             normal: {
  //                 color: color[i],
  //                 width: 1,
  //                 opacity: 0.6,
  //                 curveness: 0.2
  //             }
  //         },
  //         data: convertData(item[1])
  //     });
  // });
  series.push({
          type: 'map',
          mapType: '深圳',
          label: {
              normal: {
                  show: false
              },
              emphasis: {
                  textStyle: {
                      color: '#fff'
                  }
              }
          },
          left: '8%',
          top: 35,
          right: '8%',
          bottom: 40,
          roam: false,
          markPoint:{
            symbol: 'pin',
            symbolSize:20,
            label: {
                normal: {
                    show: true,
                    formatter: function(d) {
                        return d.name
                    },
                    offset:[0,-15],
                    fontStyle:'italic'
                }
            },
            data: [{
                  name: '正常巡逻',
                  coord: [113.8968928724,22.5745201642],
              },
              {
                  name: '正常巡逻',
                  coord: [113.8068928724,22.6745201642]
              }
            ],
            effect : {  
                show: true,  
                shadowBlur : 0  
            }
          },
          itemStyle: {
            areaColor: '#eee',
            borderColor: '#4fd9f6',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 2
          },
          emphasis:{
            itemStyle: {
              areaColor: '#3a4ed7',
              borderColor: '#4fd9f6',
              borderWidth:3,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 12
            }
          },
          animation: false,
          data: datas
      })
  let option={
      title:{
        show: true,
        left:'center',
        textStyle:{
          color:'#fff'
        }
      },
      tooltip : {
          trigger: 'item'
      },
      visualMap: {//地图区块颜色
          // type:'piecewise'
          min: 0,
          max: 45000,
          //text: ['高', '低'], // 文本，默认为数值文本
          calculable: false,
          //categories: categories,
          inRange:{
             color: ['yellow','lightskyblue', 'orangered']
          },
          show:false,
          showLabel:false,
          splitNumber:7,
          itemSymbol:'circle',
          textStyle:{
            color:'#fff'
          }
      }, 
      tooltip:{
        show:true,
        trigger:'item'
      },
      color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'], 
      geo: {
          map: '深圳',
          show:true,
          label: {
              emphasis: {
                  show: false
              }
          },
          roam: false,
          left: '10%',
          top: 20,
          right: '10%',
          bottom: 40,
          // center:[113.936950,22.539017],//当前视角的中心点，用经纬度表示
          geoCoord:geoCoorddata,
          itemStyle: {
             normal: {
                  areaColor: '#323c48',
                  borderColor: '#404a59',
                  shadowBlur: 12,
                  shadowColor: 'rgba(37, 140, 249, 1)'
              },
              emphasis: {
                  areaColor: '#2a333d'
              }
          }
      },
      series:series
  }
  myChart.setOption(option);
   myChart.on('click', function (params){
    let name = params.data.name;
    let coord = {};
    let addCoord = [{
          name:'宝安区',
          coord:[22.5546139048,113.8830542564]
        },{
          name:'南山区',
          coord:[22.5333200000,113.9304100000]
        },{
          name:'龙岗区',
          coord:[22.7199100000,114.2477900000]
        },{
          name:'福田区',
          coord:[22.5229100000,114.0545400000]
        },{
          name:'罗湖区',
          coord:[22.5489500000,114.1311100000]
        },{
          name:'盐田区',
          coord:[22.5578600000,114.2374800000]
        }]
    addCoord.forEach((item,index)=>{
      if(item.name==name){
        coord.lat = item.coord[0];
        coord.lng = item.coord[1];
      }
    })
    history.push({pathname:'/view/monitoring/grid',query:{lat:coord.lat,lng:coord.lng}});
  });
}
export const WorkBar = function(echarts,ele,barData){
  let myChart = echarts.init(ele);
  let option = {
      grid:{
        left: '10%',
        top: 60,
        right: '10%',
        bottom: 40,
        borderWidth:1,
        show: false
      },
      title: {
          show: false,
          textStyle: {
              color: "#f00",
              fontSize: 30,
              fontWeight: "lighter"
          }
      },
      tooltip: {},
      xAxis: {
        show: true,
        data: ["训练", "外出巡逻"],
        axisTick:{//坐标轴刻度相关设置。
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16
        }
      },
      yAxis: {
          show: false
      },
      series: [{
          name: "出勤状态栏",
          type: "bar",
          data: barData,
          itemStyle: {
              normal: {
                  color: function(params) {
                      // build a color map as your need.
                      var colorList = [
                        '#336ed2','#37a6d1','#FCCE10','#E87C25','#27727B',
                         '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                         '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                      ];
                      return colorList[params.dataIndex]
                  },
                  label: {
                      show: true,
                      position: 'top',
                      formatter: '{b}\n{c}'
                  }
              }
          },
          label: {//图形上的文本标签
            normal: {
               show: true,
               position: 'top',
               textStyle: {
                   color: '#eca43e',
                   fontStyle: 'normal',
                   fontFamily: '微软雅黑',
                   fontSize: 16, 
                   fontWeight:600,  
               },
               formatter:(p)=>{
                  return p.value+'人';
               }
            },
          }
      }]
  };

  myChart.setOption(option);
}




