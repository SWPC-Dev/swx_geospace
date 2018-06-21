(function ($) {

    var geospaceChart;
    var validTime;
    var dataServiceUrl;
    var refreshTime = 60000; 
    var hourMillisecs = 3600000;

    loadJSON(false);

    function buildCharts(data) {

        var time = new Date();
        var currentTime = "Current Time: " + time.getUTCFullYear() + "-" + ('0'+String(time.getUTCMonth() +1)).slice(-2) + "-" + ('0'+String(time.getUTCDate())).slice(-2) + " " + ('0'+String(time.getUTCHours())).slice(-2) + ":" + ('0'+String(time.getUTCMinutes())).slice(-2) + " UTC" + "<br/>";
        var validTimeDate = new Date(validTime);
        var minuteDifference = Math.floor(((validTimeDate.getTime() - time.getTime())/1000)/60);
        var customSubtitle = currentTime + "Valid Time: " + validTimeDate.getUTCFullYear() + "-" + String(validTimeDate.getUTCMonth()+1).padStart(2, '0') + "-" + String(validTimeDate.getUTCDate()).padStart(2, '0') + " " + String(validTimeDate.getUTCHours()).padStart(2, '0') + ":" + String(validTimeDate.getUTCMinutes()).padStart(2, '0') + " UTC" + " (" + minuteDifference + " mins ahead)";

        var bz = data[0];
        var bt = data[1];
        var density = data[2];
        var temp = data[4];
        var speed = data[3];
        var swpcKp = data[5];
        var au = data[6];
        var al = data[7];
        var gdst = data[8];
        var gkp = data[9];
        var kdst = data[10];


        // color scheme setup

        // background color
        var bgcolor = '#000000'

        // plot borders
        var border_color = '#000000'
        var border_width = 1

        // line width
        var line_width = 10

        dataChart = new Highcharts.StockChart({
            
          chart: {
            renderTo: 'data-container',
            backgroundColor: bgcolor,
            zoomType: 'xy',
            plotBorderColor: border_color,
            plotBorderWidth: border_width, 
            marginRight:200,

            events: {
              redraw: function(){
                var time_range;
                if(this.rangeSelector.selected  == 0){
                    time_range = "3 Hours";
                }else if(this.rangeSelector.selected == 1){
                    time_range = "24 Hours";
                }else if(this.rangeSelector.selected == 2){
                    time_range = "3 Days";
                }else if(this.rangeSelector.selected == 3){
                    time_range = "7 Days";
                }
                this.setTitle({text: "Geospace Timeline: Latest "+ time_range + " <br/> <span style='font-size: 12px;'>Solar Wind Predicted at Earth</span>"});
                }
            }
          },

//          navigator:{
//            enabled: false
//          },
			
          plotOptions: {
            series: {
              animation: false,
              states: {
                hover: {
                  enabled: false
                }
              },
              dataGrouping:{
                enabled: true
              },
              connectNulls: false
            }
          },

            rangeSelector: {

              buttons: [{
                  type: 'hour',
                  count: 3,
                  text: '3h'
              }, {
                  type: 'day',
                  count: 1,
                  text: '1d'
              }, {
                  type: 'day',
                  count: 3,
                  text: '3d'
              }, {
                  type: 'day',
                  count: 7,
                  text: '7d'
              }],

              buttonPosition: {
                 align: 'right',
                 x:-130
              },

              inputPosition: {
                align: 'left'
              },

              buttonTheme: {
                // Sets the basic state of the range selector
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                r: 8,
                style: {
                   color: 'white',
                   fontWeight: 'bold'
                },

                // Set the options for each state of the range selector
                states: {
                  select: {
                    fill: '#999',
                    style: {
                      color: 'black'
                    }
                  },
                  hover: {
                    fill: 'white',
                    style: {
                      color: 'black'
                    },
                  },
                },
              },

              verticalAlign: 'bottom',
//              inputEnabled: true,
//              inputDateFormat: '%Y-%m-%d',

              inputBoxBorderColor: 'gray',
              inputBoxWidth: 120,
              inputBoxHeight: 16,
              inputStyle: {
                color: '#FFFFFF',
                fontWeight: 'bold'
              },

              labelStyle: {
              	color: 'silver',
              	fontWeight: 'bold'
              },
              selected: 3,

            },

            tooltip: {
                split: false,
                shared: true,
                valueDecimals: 3,
                animation: false,
                useHTML: true,
                hideDelay : 2000,
                
               positioner: function (boxWidth, boxHeight, point) {
                 return { x: this.chart.plotLeft + 1.02*this.chart.plotWidth, y: this.chart.plotTop + 0.4*this.chart.plotHeight };
                } 
            }, 


            title: {
                text: "Geospace Timeline: Latest 7 Days <br/> <span style='font-size: 12px;'>Solar Wind Predicted at Earth</span>",
                style: {"color": "#ffffff", "font-size": "16px", "margin-bottom": "25"},
                align: 'left',
                useHTML: true,
                floating: true,
                margin: 20,
                x: 89,
                y: 20,
            },

            subtitle: {
                text: customSubtitle,
                align: 'right',
                style: {"color": "#ffffff" },
                useHTML: true
            },

            scrollbar: {
                enabled: false
            },
			
			style: {
				fontFamily: 'courier'
			},

            credits:{
                enabled: false,
                text: 'Space Weather Prediction Center',
                href: 'http://www.swpc.noaa.gov',
                position:{
                    //align: 'right',
                    align: "center"
                    //x: 2
                },
                style:{
                    fontSize: '11px',
                    color: 'white'
                }
            }, 

            xAxis: [
                //0 Current Time Line - horizontal one on the x Axis
                {   
                    top: '100%',
                    height: '0%',
                    plotLines: [{
                        value:  new Date(), //currentTime,
                        width: 1,
                        color: '#2aadf9',  //blue current time vertical line
                        label: {
                            text: 'Latest value',
                            align: 'right',
                            color: '#ffffff',
                            y: 12,
                            x: 0
                        }        
                    }],
                    startOnTick: true,
                    endOnTick: true,
                    ordinal:false,
                    tickLength: 8,
                    tickWidth: 2,
					tickPosition: 'inside',
                    tickColor: 'white',
                    type: 'datetime',
					labels: {
						style: {
							color: 'white'
						}
					},
                    
                },
				//1 Top
                {
                    top: '0%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 0,
                    minorTickWidth: 0,
                    //startOnTick: true,
                    //endOnTick: true,
                    minorTickPosition: 'outside',
                    labels: {
                        enabled: false
                    }
                },
                //1 Bottom
                {
                    top: '24%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    //startOnTick: true,
                    //endOnTick: true,
                    minorTickPosition: 'inside',
                    labels: {
                        enabled: false
                    }
                },
				//2 Top
                {
                    top: '26%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    startOnTick: true,
                    endOnTick: true,
                    minorTickPosition: 'outside',
                    labels: {
                        enabled: false
                    }
                },
                //2 Bottom
                {
                    top: '50%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    startOnTick: true,
                    endOnTick: true,
                    minorTickPosition: 'inside',
                    labels: {
                        enabled: false
                    }     
                },
				//3 Top
                {
                    top: '52%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    startOnTick: true,
                    endOnTick: true,
                    minorTickPosition: 'outside',
                    labels: {
                        enabled: false
                    }     
                },
                //3 Bottom
                {
                    top: '76%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: false,
                    labels: {
                        enabled: false
                    }
                },
                //4 Top
                {
                    top: '78%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    startOnTick: true,
                    endOnTick: false,
                    minorTickPosition: 'inside',
                    labels: {
                        enabled: false
                    }     
                },
                //4 Bottom
                {
                    top: '100%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ccd6eb',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
            ],

            yAxis: [
                //Y Axis 0
                {
                    opposite: false,
                    labels: {
                        align: 'center',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        useHTML: true,
                        text: '<center><font color="#ff0000">Bz</font><br/><font color="#ffffff">Btotal<br/>(nT)</font></center>',
                        style: {'color': '#ff0000'
                                },
                        offset: 32
                    },
                    top: '0%',
                    height: '24%',
                    lineWidth: 1,
                    tickAmount: 5,
                    tickInterval: 1,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside',
                    gridLineColor: '#1A1818',
                    maxPadding: 0
                }, 
				
                //Y Axis 1
                {
                    opposite: false,
                    labels: {
                        align: 'center',
                        x: -3,
                        y: 5,
                         style: {'color': '#ffffff'}
                    },
                    title: {
                        useHTML: true,
                        offset: 37,
                        text: '<center>Density<br/>p/cm<sup>3</sup></center>',
                        style: {'color': '#ff7f00'}
                    },
                    top: '26%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#1A1818',
                    tickAmount: 5,
                    tickInterval: 1,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'            
                }, 

                
				//Y Axis 2
                {
                    opposite: false,
                    labels: {
                        align: 'center',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        text: '<center>Speed<br/>km/s</center>',
                        style: {'color': '#f2ff00'}
                    },
                    top: '52%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#111111',
                    lineColor: '#ccd6eb',
                    tickAmount: 5,
                    tickInterval: 10,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                }, 
                //Y Axis 3
                {
                    type: 'logarithmic',
                    opposite: false,
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'},
                        useHTML: true,
                        formatter: function() {
                            var intVal = parseInt(this.value);
                            power = intVal.toString().slice(1).length;
                            if (power == 1) {
                                powerLabel = '10';
                            }
                            else {
                                powerLabel = '10<sup>' + power + '</sup>';
                            }
                            return powerLabel;
                        }
                    },
                    title: {
                        text: 'Temperature<br/>K',
                        style: {'color': '#00c147'}
                    },
                    top: '78%',
                    height: '22%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#111111',
                    lineColor: '#ccd6eb',
                    tickAmount: 5,
                    tickInterval: 1,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                },

                //Y Axis 0 - right side
                {
                    opposite: true,
                    top: '0%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    }  
                },   
                //Y Axis 1 - right side
                {
                    opposite: true,
                    top: '26%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    } 
                },
                //Y Axis 2 - right side
                {
                    opposite: true,
                    top: '52%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    }     
                },
                //Y Axis 3 - right side
                {
                    opposite: true,
                    top: '78%',
                    height: '22%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    }     
                }
             
            ], 

            series: [
                {
                    type: bz.type,
                    name: bz.name,
                    data: bz.data,                
                    lineWidth: 0,
                    color: "#ff0000",
                    tooltip: {
                        valueSuffix: " nT",
                        },
                    animation: false,
                    marker: {
                        enabled: true,
                        radius: 1
                    }

                },
                 {
                    type: bt.type,
                    name: bt.name,
                    data: bt.data,
                    lineWidth: 0,
                    color: "#ffffff",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                }, {
                    type: density.type,
                    name: density.name,
                    data: density.data,
                    description: density.unit,
                    yAxis: 1,
                    lineWidth: 0,
                    color: "#ff7f00",
                    tooltip: {
                        valueSuffix: " p/cm^3"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },{
                    type: speed.type,
                    name: speed.name,
                    data: speed.data,
                    yAxis: 2,
                    lineWidth: 0,
                    color: "#f2ff00",
                    tooltip: {
                        valueSuffix: " km/s"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },{
                    type: temp.type,
                    name: temp.name,
                    data: temp.data,
                    yAxis: 3,
                    lineWidth: 0,
                    color: "#00c147",
                    tooltip: {
                        valueSuffix: " K"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                }
            ]
        }, function(chart){ //on complete function

		// apply the date pickers
//		setTimeout(function() {
//			('input.highcharts-range-selector', $('#' + chart.options.chart.renderTo)).datepicker()
//		}, 0)
                chart.renderer.text("Verison 1.5", 1090, 845)
                .css({
                    fontSize: '11px',
                    color: 'white'
                })
                .add();
        });  

// ****************** Geospace Model Plots *********************
        geospaceChart = new Highcharts.StockChart({
            
          chart: {
            renderTo: 'model-container',
            backgroundColor: bgcolor,
            zoomType: 'xy',
            plotBorderColor: border_color,
            plotBorderWidth: border_width, 
            marginRight:200,

            events: {
              redraw: function(){
                var time_range;
                if(this.rangeSelector.selected  == 0){
                    time_range = "3 Hours";
                }else if(this.rangeSelector.selected == 1){
                    time_range = "24 Hours";
                }else if(this.rangeSelector.selected == 2){
                    time_range = "3 Days";
                }else if(this.rangeSelector.selected == 3){
                    time_range = "7 Days";
                }
                this.setTitle({text: "Geospace Prediction: Latest "+ time_range + " <br/> <span style='font-size: 12px;'>Model Output and Ground Truth Data</span>"});
                }
            }
          },

//          navigator:{
//            enabled: false
//          },
			
          plotOptions: {
            series: {
              animation: false,
              states: {
                hover: {
                  enabled: false
                }
              },
              dataGrouping:{
                enabled: true
              },
              connectNulls: false
            }
          },

            rangeSelector: {

              buttons: [{
                  type: 'hour',
                  count: 3,
                  text: '3h'
              }, {
                  type: 'day',
                  count: 1,
                  text: '1d'
              }, {
                  type: 'day',
                  count: 3,
                  text: '3d'
              }, {
                  type: 'day',
                  count: 7,
                  text: '7d'
              }],

              buttonPosition: {
                 align: 'right',
                 x:-130
              },

              inputPosition: {
                align: 'left'
              },

              buttonTheme: {
                // Sets the basic state of the range selector
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                r: 8,
                style: {
                   color: 'white',
                   fontWeight: 'bold'
                },

                // Set the options for each state of the range selector
                states: {
                  select: {
                    fill: '#999',
                    style: {
                      color: 'black'
                    }
                  },
                  hover: {
                    fill: 'white',
                    style: {
                      color: 'black'
                    },
                  },
                },
              },

              verticalAlign: 'bottom',
//              inputEnabled: true,
//              inputDateFormat: '%Y-%m-%d',

              inputBoxBorderColor: 'gray',
              inputBoxWidth: 120,
              inputBoxHeight: 16,
              inputStyle: {
                color: '#FFFFFF',
                fontWeight: 'bold'
              },

              labelStyle: {
              	color: 'silver',
              	fontWeight: 'bold'
              },
              selected: 3,
            },

            tooltip: {
                split: false,
                shared: true,
                valueDecimals: 3,
                animation: false,
                useHTML: true,
                hideDelay : 2000,
                positioner: function (boxWidth, boxHeight, point) {
                    return { x: this.chart.plotLeft + 1.02*this.chart.plotWidth, y: this.chart.plotTop + 0.4*this.chart.plotHeight };
                } 
            }, 


            title: {
                text: "Geospace Prediction: Latest 7 Days <br/> <span style='font-size: 12px;'> Model Output and Ground Truth Data</span>",
                style: {"color": "#ffffff", "font-size": "16px", "margin-bottom": "25"},
                align: 'left',
                useHTML: true,
                floating: false,
                margin: 20,
                x: 89,
                y: 20,
            },


            scrollbar: {
                enabled: false
            },
			
			style: {
				fontFamily: 'courier'
			},

            credits:{
                enabled: true,
                text: 'Space Weather Prediction Center',
                href: 'http://www.swpc.noaa.gov',
                position:{
                    //align: 'right',
                    align: "center"
                    //x: 2
                },
                style:{
                    fontSize: '11px',
                    color: 'white'
                }
            },

            xAxis: [
                //0 Current Time Line - vertical one
                {   
                    top: '100%',
                    height: '0%',
                    plotLines: [{
                        value:  new Date(), //currentTime,
                        width: 1,
                        color: '#2aadf9',
                        label: {
                            text: 'Latest value',
                            align: 'right',
                            color: '#ffffff',
                            y: 12,
                            x: 0
                        }        
                    }],
                    startOnTick: true,
                    endOnTick: true,
                    ordinal:false,
                    tickLength: 8,
                    tickWidth: 2,
					tickPosition: 'inside',
                    tickColor: 'white',
                    type: 'datetime',
					labels: {
						style: {
							color: 'white'
						}
					},
                    
                },
				
				
                //5 Top
                {
                    top: '0%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    minorTickPosition: 'outside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
				//5 Bottom
                {
                    top: '32%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
                //6 Top
                {
                    top: '34%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    minorTickPosition: 'outside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
				//6 Bottom
                {
                    top: '66%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }   
                },
				
                //7 Top
                {
                    top: '68%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 0,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 0,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }   
                },
                //7 Bottom
                {
                    top: '100%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                }
            ],

            yAxis: [
                
                //Y Axis 4
                {
                    opposite: false,
                    labels: {
                        align: 'center',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
						useHTML: true,
                        text: '<font color="#4286f4">AU</font><br/><font color="#3ee89b">AL</font>',
                        style: {'color': '#3ee89b'}
                    },
                    top: '0%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#111111',
                    tickAmount: 5,
                    tickInterval: 15,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                },
                //Y Axis 5
                {
                    opposite: false,
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
						useHTML: true,
                        text: '<center><font color="#4ac3c9">SWPC Kp</font><br/><font color="#21f26e">Geospace Kp</font></center><br/>',
                        style: {'color': '#21f26e'}//,
                        //offset: 50
                    },
                    top: '34%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    min: 0,
                    max: 9,
                    gridLineColor: '#111111',
                    lineColor: '#ccd6eb',
                    tickAmount: 11,
                    tickInterval: 1,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                }, 
                //Y Axis 6
                {
                    opposite: false,
                    labels: {
                        align: 'center',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
						useHTML: true,
                        text: '<center><font color="#e20000">Kyoto Dst</font><br/><font color="#ffffff">Geospace Dst<br/>(nT)</font></center>',
                        style: {'color': '#ffffff'}
                    },
                    top: '68%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#111111',
                    tickAmount: 5,
                    tickColor: '#ccd6eb',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                },

                //Y Axis 4 - right side
                {
                    opposite: true,
                    top: '0%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    }  
                },   
                //Y Axis 5 - right side
                {
                    opposite: true,
                    top: '34%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    } 
                },
                //Y Axis 6 - right side
                {
                    opposite: true,
                    top: '68%',
                    height: '32%',
                    offset: 0,
                    lineWidth: 1,
                    lineColor: '#ccd6eb',
                    tickAmount: 0,
                  	gridLineColor: '#000000',
                    labels: {
                        enabled: false
                    }     
                }
            ], 

            series: [
               {
                    type: au.type,
                    name: au.name,
                    data: au.data,
                    yAxis: 0,
                    lineWidth: 0,
                    color: "#3ee89b",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },{
                   // type: al.type,
                    name: al.name,
                    data: al.data,
                    yAxis: 0,
                    lineWidth: 0,
                    color: "#4286f4",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },{
                    type: gkp.type,
                    name: gkp.name,
                    data: gkp.data,
                    yAxis: 1,
                    lineWidth: 0,
                    zones: [{
                        value: 4,
                        color: '#21f26e'
                    },{
                        value: 5,
                        color: '#e8e53e'
                    },{
                        value: 6,
                        color: '#ffbb0f'
                    },{
                        value: 7.5,
                        color: '#ff530f'
                    },{
                        value: 8.5,
                        color: '#ff0000'
                    }],
                    tooltip: {
                        valueSuffix: ""
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },
                {
                    type: swpcKp.type,
                    name: swpcKp.name,
                    data: swpcKp.data,
                    yAxis: 1,
                    lineWidth: 1,
                    color: "#4ac3c9",
                    tooltip: {
                        valueSuffix: "W"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    },
                    step: true
                    
                },{
                    type: gdst.type,
                    name: gdst.name,
                    data: gdst.data,
                    yAxis: 2,
                    lineWidth: 0,
                    color: "#ffffff",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    marker: {
                        enabled: true,
                        radius: 1
                    }
                },{
                    type: kdst.type,
                    name: kdst.name,
                    data: kdst.data,
                    yAxis: 2,
                    lineWidth: 1,
                    color: "#e20000",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    step: true
                } 
            ]
        }, function(chart){ //on complete function
        });  
    }


  
    // Load the JSON and build or refresh the charts
    function loadJSON(refreshing) {
        console.log('hwllo');

        var series = [];

        //var threedays = new Date();
        //threedays.setDate(threedays.getDate() - 3);
        //threedays = Date.parse(threedays);
    

        $.getJSON('https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind.json', function (data) {
        var bzSeries = {name: "Bz", data: [], type: "line",  boostThreshold : 50,turboThreshold: 1}; 
        var btSeries = {name: "Bt", data: [], type: "line", boostThreshold : 50,turboThreshold: 1}; 
        var tempSeries = {name: "Temperature", data: [], type: "line", boostThreshold : 50, turboThreshold: 1};
        var densitySeries = {name: "Density", data: [], type: "line", boostThreshold : 50,turboThreshold: 1}; 
        var speedSeries = {name: "Speed", data: [], type: "line", boostThreshold : 50, turboThreshold: 1};  

        data = sortRTSW(data.splice(1));
        $.each(data,function (i, value){
            // Add X, Y values
            var time = Date.parse(value[11] +'Z');
           // if(time >= threedays){
                bzSeries.data.push([time, parseFloat(value[6])]);
                btSeries.data.push([time, parseFloat(value[7])]);
                densitySeries.data.push([time, parseFloat(value[2])]);
                speedSeries.data.push([time, parseFloat(value[1])]);
                tempSeries.data.push([time, parseFloat(value[3])]);
            //}

        });

        if (refreshing) {
            geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, bzSeries.name)].setData(bzSeries.data, true);
            geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, btSeries.name)].setData(btSeries.data, true);
            geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, densitySeries.name)].setData(densitySeries.data, true);
            geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, speedSeries.name)].setData(speedSeries.data, true);
            geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, tempSeries.name)].setData(tempSeries.data, true);
        }
        else { 
            series.push(bzSeries);
            series.push(btSeries);
            series.push(densitySeries);
            series.push(speedSeries);
            series.push(tempSeries);
        }

        $.getJSON('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', function(data){
            var swpcKpSeries = {name: "SWPC KP", data: [], type: "line", boostThreshold : 50}; 
            $.each(data,function (i, value){
                // Add X, Y values
                if(i > 0){
                    var time = Date.parse(value[0] + 'Z');
                    var t = 0;
                      for (j = 0; j < 180; j++) {
                            t = time + j*60000;
                            swpcKpSeries.data.push([t, parseFloat(value[1])]);
                      }
                }
            });

            if (refreshing) {
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, swpcKpSeries.name)].setData(swpcKpSeries.data, true);
            }
            else {
                series.push(swpcKpSeries);
            }

            $.getJSON('https://services.swpc.noaa.gov/experimental/products/geospace/geomagnetic-indices.json', function(data){
                var gdstSeries = {name: "Geospace DST", data: [], type: "line", boostThreshold : 50};
                var gkpSeries = {name: "Geospace KP", data: [], type: "line", boostThreshold : 50}; 
                var auSeries = {name: "AU", data: [], type: "line", boostThreshold : 50};
                var alSeries = {name: "AL", data: [], type: "line", boostThreshold : 50};

            $.each(data,function (i, value){
                // Add X, Y values
                if(i > 0){
                    var time = Date.parse(value[0] + 'Z');
                    //if(time >= threedays){
                        gdstSeries.data.push([time, parseInt(value[1])]);
                        gkpSeries.data.push([time, parseFloat(value[2])]); //we can keep precision for now
                        auSeries.data.push([time, parseInt(value[3])]);
                        alSeries.data.push([time, parseInt(value[4])]);
                   // }
                }
            });

            if (refreshing) {
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, auSeries.name)].setData(auSeries.data, true);
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, alSeries.name)].setData(alSeries.data, true);
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, gdstSeries.name)].setData(gdstSeries.data, true);
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, gkpSeries.name)].setData(gkpSeries.data, true);
            }
            else {
                series.push(auSeries);
                series.push(alSeries);
                series.push(gdstSeries);
                series.push(gkpSeries);
            }
            validTime = gdstSeries.data[gdstSeries.data.length-1][0];

                $.getJSON('https://services.swpc.noaa.gov/experimental/products/kyoto-dst.json', function(data){
                var kdstSeries = {name: "Kyoto DST", data: [], type: "line", boostThreshold : 50};
                $.each(data,function (i, value){
                    // Add X, Y values
                    if(i > 0){
                      var time = Date.parse(value[0] + 'Z');
                      var t = 0;
                      for (j = 0; j < 60; j++) {
                            t = time + j*60000;
                            kdstSeries.data.push([t, parseFloat(value[1])]);
                      }
                    }
                });

                if (refreshing){
                    geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, kdstSeries.name)].setData(kdstSeries.data, true);
                }
                else{
                    series.push(kdstSeries);
                    buildCharts(series);
                }
                }); // getJSON
            }); // getJSON
        }); // getJSON
        }); //getJSON
    } // LoadJSON

    // Find the array index of the series by name
    // needed to call the refresh (setData) function
    function findSeriesPlotIndex(series, name) {
        for (var i = 0; i < series.length; i +=1) {
            if (series[i].name == name) {
            return i;
            }
        }
        return -1;
    }

    function sortRTSW(data){
        data.sort((function(index){
           return function(a, b){
               return(a[index] === b[index] ? 0 : (new Date(a[index]) < new Date(b[index]) ? -1 : 1 )); 
           };
       })(11)); //11th index is propgated solar wind
        return data;
    }//sortRTSW
    
    function findIndexOfPoint(element){
        return Date.parse(element[this[1]]+"Z") == this[0].x;
    }
    

}(jQuery));
