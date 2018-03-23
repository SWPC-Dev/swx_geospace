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


       dataChart = new Highcharts.StockChart({
            
            chart: {
                renderTo: 'container',
                backgroundColor: '#000000',
                zoomType: 'xy',
                plotBorderColor: '#000000',
                plotBorderWidth: 1, 
                marginRight:200,
                events: {
                    //this is an inefficent reload of data every minute
                    //this will not work on jsfiddle and will kill your browser
                    /*load: function() {
                        //console.log(this.series);
                        var bzPoints = this.series[0];
                        var btPoints = this.series[1];
                        var densePoints = this.series[2];
                        var tempPoints = this.series[4];
                        var speedPoints =this.series[3];
                        var auPoints = this.series[5];
                        var alPoints = this.series[6];
                        var gdstPoints = this.series[9];
                        var gkpPoints = this.series[7];
                        var swpcPoints = this.series[8];
                        var kyotoPoints = this.series[10];
                        setInterval(function(){
                            $.getJSON('https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind.json', function (dataRTSW) {
                                console.log('updating points');
                                dataRTSW = sortRTSW(dataRTSW.splice(1));
                                var latestPoint = dataRTSW[dataRTSW.length-1];
                                var latestTime = Date.parse(latestPoint[11] + 'Z');
                                console.log(new Date());
                                for(var i = 30; i >= 0; i--){
                                    bzPoints.removePoint(bzPoints.data.length - 1);
                                }
                                console.log(new Date());
                                var seriesLatestPoint = bzPoints.data[bzPoints.data.length -1];
                                console.log("lets update this shit");

                                if(latestTime != seriesLatestPoint[0])
                                {
                                    var startingindex = dataRTSW.findIndex(findIndexOfPoint, [seriesLatestPoint, 11]);
                                    if(startingindex >= 0){
                                        for(var i = startingindex; i < dataRTSW.length; i++){

                                            var latestPoint = dataRTSW[i];
                                            var latestTime = Date.parse(latestPoint[11] + 'Z');

                                            bzPoints.addPoint([latestTime, parseInt(latestPoint[6])], false, false);
                                            btPoints.addPoint([latestTime, parseFloat(latestPoint[7])], false, false);
                                            densePoints.addPoint([latestTime, parseFloat(latestPoint[2])], false, false);
                                            speedPoints.addPoint([latestTime, parseFloat(latestPoint[1])], false, false);
                                            tempPoints.addPoint([latestTime, parseFloat(latestPoint[3])],false,false);
                                        }
                                        geospaceChart.redraw(); 
                                        console.log(new Date());
                                        console.log("le chart has been redrawn");
                                    }
                                }

                                
                            });
                            $.getJSON('https://services.swpc.noaa.gov/experimental/products/geospace/geomagnetic-indices.json', function(data){
                                var latestPoint = data[data.length - 1];
                                var latestTime = Date.parse(latestPoint[0] + 'Z');

                                var seriesLatestPoint = gkpPoints.options.data[gkpPoints.options.data.length -1 ];

                                var gkp

                                if(latestTime !=  seriesLatestPoint[0]){

                                    var startingIndex = data.findIndex(findIndexOfPoint, [seriesLatestPoint,0]);
                                    if(startingIndex >= 0){
                                        for(var i = startingIndex; i < data.length; i ++){
                                            var latestPoint = data[i];
                                            var latestTime = Date.parse(latestPoint[0] + 'Z');
                                            gdstPoints.addPoint([latestTime, parseInt(latestPoint[1])],false, false);
                                            gkpPoints.addPoint([latestTime, parseFloat(latestPoint[2])],false, false); 
                                            auPoints.addPoint([latestTime, parseInt(latestPoint[3])], false, false);
                                            alPoints.addPoint([latestTime, parseInt(latestPoint[4])], false,false);
                                        }

                                        var time = new Date();
                                        var currentTime = "Current Time: " + time.getUTCFullYear() + "-" + ('0'+String(time.getUTCMonth() +1)).slice(-2) + "-" + 
                                            ('0'+String(time.getUTCDate())).slice(-2) + " " + ('0'+String(time.getUTCHours())).slice(-2) + ":" + ('0'+String(time.getUTCMinutes())).slice(-2) + " UTC" + "<br/>";
                                        var validTimeDate = new Date(latestTime);
                                        var minuteDifference = Math.floor(((validTimeDate.getTime() - time.getTime())/1000)/60);
                                        var customSubtitle = currentTime + "Valid Time: " + validTimeDate.getUTCFullYear() + "-" + String(validTimeDate.getUTCMonth()+1).padStart(2, '0') +
                                            "-" + String(validTimeDate.getUTCDate()).padStart(2, '0') + " " + String(validTimeDate.getUTCHours()).padStart(2, '0') + ":" + 
                                            String(validTimeDate.getUTCMinutes()).padStart(2, '0') + " UTC" + " (" + minuteDifference + " mins ahead)";

                                        geospaceChart.setTitle(null, {text: customSubtitle});

                                        geospaceChart.xAxis[0].options.plotLines[0].value = new Date();

                                        geospaceChart.redraw(); 
                                    }
                                }

                            });
                            
                            
                        }, refreshTime);
                        setInterval(function(){
                            console.log("full update");
                            loadJSON(true);
                        }, hourMillisecs);
                    },*/
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
                        this.setTitle({text: "Geospace Timeline: Lastest "+ time_range + " <br/> <span style='font-size: 12px;'>Solar Wind Predicted at Earth</span>"});
                    }
                }
            },

			navigator:{
				enabled: false
			},
			
            //Optional?
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1158
                    }
                }]
            },

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
                selected: 1,
                buttonPosition: {
                   align: 'left'
                },
                verticalAlign: 'bottom',
                inputEnabled: false,
                labelStyle: {
                    color: '#ffffff'
                },
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
                }]
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
                text: '<span>Geospace Timeline: Lastest 24 Hours</span>',
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
                    minorTickColor: '#ffffff',
                    minorTickLength: 0,
                    minorTickWidth: 0,
                    startOnTick: true,
                    endOnTick: true,
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
                    minorTickColor: '#ffffff',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    startOnTick: true,
                    endOnTick: true,
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
                    minorTickColor: '#ffffff',
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
                    minorTickColor: '#ffffff',
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
                    minorTickColor: '#ffffff',
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
                    tickColor: '#ffffff',
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
                    tickColor: '#ffffff',
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
                    lineColor: '#ffffff',
                    tickAmount: 5,
                    tickInterval: 10,
                    tickColor: '#ffffff',
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
                    top: '76%',
                    height: '24%',
                    offset: 0,
                    lineWidth: 1,
                    gridLineColor: '#111111',
                    lineColor: '#ffffff',
                    tickAmount: 5,
                    tickInterval: 0.1,
                    tickColor: '#ffffff',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'

                },
             
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
                backgroundColor: '#000000',
                zoomType: 'xy',
                plotBorderColor: '#000000',
                plotBorderWidth: 1, 
                marginRight:200,
                events: {
                    //this is an inefficent reload of data every minute
                    //this will not work on jsfiddle and will kill your browser
                    /*load: function() {
                        //console.log(this.series);
                        var bzPoints = this.series[0];
                        var btPoints = this.series[1];
                        var densePoints = this.series[2];
                        var tempPoints = this.series[4];
                        var speedPoints =this.series[3];
                        var auPoints = this.series[5];
                        var alPoints = this.series[6];
                        var gdstPoints = this.series[9];
                        var gkpPoints = this.series[7];
                        var swpcPoints = this.series[8];
                        var kyotoPoints = this.series[10];
                        setInterval(function(){
                            $.getJSON('https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind.json', function (dataRTSW) {
                                console.log('updating points');
                                dataRTSW = sortRTSW(dataRTSW.splice(1));
                                var latestPoint = dataRTSW[dataRTSW.length-1];
                                var latestTime = Date.parse(latestPoint[11] + 'Z');
                                console.log(new Date());
                                for(var i = 30; i >= 0; i--){
                                    bzPoints.removePoint(bzPoints.data.length - 1);
                                }
                                console.log(new Date());
                                var seriesLatestPoint = bzPoints.data[bzPoints.data.length -1];
                                console.log("lets update this shit");

                                if(latestTime != seriesLatestPoint[0])
                                {
                                    var startingindex = dataRTSW.findIndex(findIndexOfPoint, [seriesLatestPoint, 11]);
                                    if(startingindex >= 0){
                                        for(var i = startingindex; i < dataRTSW.length; i++){

                                            var latestPoint = dataRTSW[i];
                                            var latestTime = Date.parse(latestPoint[11] + 'Z');

                                            bzPoints.addPoint([latestTime, parseInt(latestPoint[6])], false, false);
                                            btPoints.addPoint([latestTime, parseFloat(latestPoint[7])], false, false);
                                            densePoints.addPoint([latestTime, parseFloat(latestPoint[2])], false, false);
                                            speedPoints.addPoint([latestTime, parseFloat(latestPoint[1])], false, false);
                                            tempPoints.addPoint([latestTime, parseFloat(latestPoint[3])],false,false);
                                        }
                                        geospaceChart.redraw(); 
                                        console.log(new Date());
                                        console.log("le chart has been redrawn");
                                    }
                                }

                                
                            });
                            $.getJSON('https://services.swpc.noaa.gov/experimental/products/geospace/geomagnetic-indices.json', function(data){
                                var latestPoint = data[data.length - 1];
                                var latestTime = Date.parse(latestPoint[0] + 'Z');

                                var seriesLatestPoint = gkpPoints.options.data[gkpPoints.options.data.length -1 ];

                                var gkp

                                if(latestTime !=  seriesLatestPoint[0]){

                                    var startingIndex = data.findIndex(findIndexOfPoint, [seriesLatestPoint,0]);
                                    if(startingIndex >= 0){
                                        for(var i = startingIndex; i < data.length; i ++){
                                            var latestPoint = data[i];
                                            var latestTime = Date.parse(latestPoint[0] + 'Z');
                                            gdstPoints.addPoint([latestTime, parseInt(latestPoint[1])],false, false);
                                            gkpPoints.addPoint([latestTime, parseFloat(latestPoint[2])],false, false); 
                                            auPoints.addPoint([latestTime, parseInt(latestPoint[3])], false, false);
                                            alPoints.addPoint([latestTime, parseInt(latestPoint[4])], false,false);
                                        }

                                        var time = new Date();
                                        var currentTime = "Current Time: " + time.getUTCFullYear() + "-" + ('0'+String(time.getUTCMonth() +1)).slice(-2) + "-" + 
                                            ('0'+String(time.getUTCDate())).slice(-2) + " " + ('0'+String(time.getUTCHours())).slice(-2) + ":" + ('0'+String(time.getUTCMinutes())).slice(-2) + " UTC" + "<br/>";
                                        var validTimeDate = new Date(latestTime);
                                        var minuteDifference = Math.floor(((validTimeDate.getTime() - time.getTime())/1000)/60);
                                        var customSubtitle = currentTime + "Valid Time: " + validTimeDate.getUTCFullYear() + "-" + String(validTimeDate.getUTCMonth()+1).padStart(2, '0') +
                                            "-" + String(validTimeDate.getUTCDate()).padStart(2, '0') + " " + String(validTimeDate.getUTCHours()).padStart(2, '0') + ":" + 
                                            String(validTimeDate.getUTCMinutes()).padStart(2, '0') + " UTC" + " (" + minuteDifference + " mins ahead)";

                                        geospaceChart.setTitle(null, {text: customSubtitle});

                                        geospaceChart.xAxis[0].options.plotLines[0].value = new Date();

                                        geospaceChart.redraw(); 
                                    }
                                }

                            });
                            
                            
                        }, refreshTime);
                        setInterval(function(){
                            console.log("full update");
                            loadJSON(true);
                        }, hourMillisecs);
                    },*/
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
                       // this.setTitle({text: "Geospace Timeline: Lastest "+ time_range + " <br/> <span style='font-size: 12px;'>Solar Wind Predicted at Earth</span>"});
                    }
                }
            },

			navigator:{
				enabled: false
			},
			
            //Optional?
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1158
                    }
                }]
            },

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
                selected: 1,
                buttonPosition: {
                   align: 'left'
                },
                verticalAlign: 'bottom',
                inputEnabled: false,
                labelStyle: {
                    color: '#ffffff'
                },
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
                }]
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
                text: '<span> Geospace Model Predicted Kp and Dst (Ground Truth Data: SWPC Kp and Kyoto quick-look Dst) </span>',
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
                    tickColor: '#ffffff',
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
                    lineColor: '#ffffff',
                    tickAmount: 11,
                    tickInterval: 1,
                    tickColor: '#ffffff',
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
                    tickColor: '#ffffff',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                },
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
