import * as echarts from 'echarts';

//每月交易量与交易均价
export const option1 = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type:"scroll",
      icon: "circle",
      data: ['交易量 单位条', '交易均价 单位k'],
      left: "10px",
      top: "0px",
      textStyle: {
        fontSize: 12,
        color: "#fff",
      },
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['line', 'bar']},
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        // prettier-ignore
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: {
            lineStyle: {
                color: "#57617B",
            },
        },
        axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
    }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14,
            },
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#57617B",
            },
          },
      }
    ],
    series: [
      {
        name: '交易量 单位条',
        type: 'bar',
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        
      },
      {
        name: '交易均价 单位k',
        type: 'bar',
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ],
        markPoint: {
          data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
          ]
        },
        
      }
    ]
};
//各区房价均价
export const option2 = {
    tooltip: {
        //鼠标指上时的标线
        trigger: "axis",
        axisPointer: {
            lineStyle: {
                color: "#57617B",
            },
        },
    },
    legend: {
        icon: "rect",
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ["小型车", "中型车", "大型车"],
        right: "20px",
        top: "0px",
        textStyle: {
            fontSize: 12,
            color: "#57617B",
        },
    },
    grid: {
        x: 35,
        y: 25,
        x2: 8,
        y2: 25,
    },
    xAxis: [
        {
            type: "category",
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: "#57617B",
                },
            },
            axisLabel: {
                textStyle: {
                    color: "#57617B",
                },
            },
            data: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
            ],
        },
    ],
    yAxis: [
        {
            type: "value",
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: "#57617B",
                },
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14,
                },
                textStyle: {
                    color: "#57617B",
                },
            },
            splitLine: {
                lineStyle: {
                    color: "#57617B",
                },
            },
        },
    ],
    series: [
        {
            name: "小型车",
            type: "line",
            smooth: true,
            lineStyle: {
                normal: {
                    width: 2,
                },
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: "rgba(137, 189, 27, 0.3)",
                            },
                            {
                                offset: 0.8,
                                color: "rgba(137, 189, 27, 0)",
                            },
                        ],
                        false
                    ),
                    shadowColor: "rgba(0, 0, 0, 0.1)",
                    shadowBlur: 10,
                },
            },
            itemStyle: {
                normal: {
                    color: "rgb(137,189,27)",
                },
            },
            data: [20, 35, 34, 45, 52, 41, 49, 64, 24, 52.4, 24, 33],
        },
    ],
    toolbox: {
        feature: {
            saveAsImage: {} // 工具箱中添加“保存为图片”功能
        }
    }
};
//各区房价top
export const option3 = {
    color: ['#3398DB'], // 设置柱状图的颜色
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none' // 关闭坐标轴指示器
        }
    },
    grid: {
        left: '5%', // 调整左边距，使图向右满一点
        top: '10%', // 设置上边距
        right: '5%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        position: 'top',
        max: 300000, // 设置 x 轴最大值
        axisLabel: {
            formatter: '{value} ', // 设置 x 轴标签的格式
        },
        axisLine: {
            show: false // 不显示 X 轴轴线
        },
        splitLine: {
            show: false // 不显示分隔线
        }
    },
    yAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 添加更多的数据点
        axisLine: {
            show: false,
            interval: 0,
            fontSize: 10,
            width: '100%',
            align: 'right',
        },
        axisTick: {
            show: false // 不显示 Y 轴刻度
        }
    },
    series: [{
        type: 'bar',
        barWidth: '30%', // 调整柱状图的宽度
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 添加更多的数据点
    }],
    legend: {
        show: true,
        textStyle: {
            color: '#333' // 图例文字颜色
        },
        data: ['Value'] // 图例数据
    },
    dataZoom: [
        {
            type: 'slider', // 滑轮组件
            yAxisIndex: 0, // 关联的y轴索引
            start: 80, // 起始位置
            end: 100, // 结束位置
            zoomLock: true // 锁定滚动方向，只能上下滚动
        }
    ],
    toolbox: {
        feature: {
            saveAsImage: {} // 工具箱中添加“保存为图片”功能
        }
    }
};
//全局空间分析
export const option4 = {

}


//相关性图
export const option5 = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        type: 'scroll',
        icon: 'circle',
        data: ['相关系数1', '相关系数2'], // 修改柱子名称
        top: '1%',
        textStyle: {
            fontSize: 12,
            color: '#fff'
        }
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: { show: true, title: { zoom: '放大', back: '还原' } } // 启用数据缩放功能
        }
    },
    yAxis: [
        {
            type: 'category',
            data: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    xAxis: [
        {
            type: 'value',
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                },
                textStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }
    ],
    grid: {
        left: '1%', // 调整左边距，使图向右满一点
        top: '10%', // 设置上边距
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            start: 0,
            end: 30,    // 设置默认显示范围的结束位置（百分比）
            maxValueSpan: 8, // 设置最大显示范围的跨度
        }
    ],
    series: [
        {
            name: '相关系数1', // 修改柱子名称
            type: 'bar', // 将折线图改为柱状图
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ],
        },
        {
            name: '相关系数2', // 修改柱子名称
            type: 'bar', // 将折线图改为柱状图
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ],
        }
    ]
};
