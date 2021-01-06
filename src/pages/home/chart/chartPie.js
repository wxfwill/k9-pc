/**
 * [{bgColor: '#fff', name:'室内', num: '32', unit: '头', percent:'53%'}]
 */
import React from 'react';
// import echart from 'echarts';
const echart = require('echarts/lib/echarts');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
// 引入饼状图
require('echarts/lib/chart/pie');

export const transformOptions = (list) => {
  const unit = list && list[0].unit;
  const data =
    list &&
    list.map((item) => {
      return {value: item.num, name: item.name, itemStyle: {color: item.bgColor}};
    });
  return {
    animation: false,
    tooltip: {
      trigger: 'item',
      formatter: function (item) {
        return echart.format.truncateText(`${item.name}: ${item.value} (${unit})`, 100, '12px Microsoft Yahei');
      }
    },
    series: [
      {
        name: '训练情况',
        type: 'pie',
        radius: ['75%', '90%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            position: 'center',
            show: false
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '16',
              fontWeight: '600'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data
      }
    ]
  };
};

export const EchartPie = (list, refs = 'drillCycle') => {
  if (list && list.length > 0) {
    return (
      <div className="dec_cycle">
        <div className="echart_intext">
          <span> {list[0] && list[1] ? list[0].num + list[1].num : ''}</span>
          <span> {list[0] && list[0].unit}</span>
        </div>
        <div className="echart_cycle" ref={refs}></div>
        <div className="echart_dec">
          {list &&
            list.map((item, index) => {
              return (
                <div key={index + 'cycle'} className="dec_item">
                  <i style={{background: item.bgColor}}></i>
                  <span>{item.name}</span>
                  <span>
                    {item.num}
                    {item.unit}
                  </span>
                  <span>{item.percent}</span>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="dec_cycle">
        <div className="echart_cycle" ref="drillCycle"></div>
        <div className="echart_dec"></div>
      </div>
    );
  }
};
