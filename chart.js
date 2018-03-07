(function ($) {
    var geospaceChart;
    var validTime;
    var dataServiceUrl;
    var refreshTime = 60001; // 60 secs + 1
    var hourMillisecs = 3600000;
    // This is used twice to initialize the vertical now line (startup, and refresh)
    var nowLineOptions = {
        id: 'now_line',
        value:  new Date(),
        width: 1,
        color: '#2aadf9',
        label: {
            text: 'Latest value',
            align: 'right',
            color: '#ffffff',
            y: 12,
            x: 0
        }
    };

    // If we don't wrap in this function, the dataservice url isn't available yet
    $(document).ready(function() {
        dataServiceUrl = $('#dataservice_url').text();
    
       // setInterval(reloadWorker, refreshTime);
    
        // Load the JSON from the data service and build the charts
        loadJSON(false);
    
       // function reloadWorker() {
        // Refresh the charts with potentially new JSON
           // loadJSON(true);
      //  }
    }); // document ready ends
    
    // Build the charts from scratch and populate with data
    function buildCharts(data) {
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

        var customSubtitle = "Loading...";

        geospaceChart = Highcharts.stockChart('geospace-container', {
            
            chart: {
                backgroundColor: '#000000',
                zoomType: 'xy',
                plotBorderColor: '#ffffff',
                plotBorderWidth: 1, 
                events: {
                    load: function() {
                        var bzPoints = this.series[0];
                        var btPoints = this.series[1];
                        var densePoints = this.series[2];
                        var tempPoints = this.series[4];
                        var speedPoints =this.series[3];
                        var auPoints = this.series[5];
                        var alPoints = this.series[6];
                        var gdstPoints = this.series[9];
                        var gkpPoints = this.series[7];
                       // var swpcPoints = this.series[8];
                        //var kyotoPoints = this.series[10];
                        setInterval(function(){
                            $.getJSON(dataServiceUrl + '/products/geospace/propagated-solar-wind.json', function (dataRTSW) {
                                dataRTSW = sortRTSW(dataRTSW.splice(1));
                                var latestPoint = dataRTSW[dataRTSW.length-1];
                                var latestTime = Date.parse(parseDateTime(latestPoint[11]) + 'Z');
                                
                                var seriesLatestPoint = bzPoints.options.data[bzPoints.options.data.length -1];

                                if(latestTime != seriesLatestPoint[0])
                                {
                                    var startingindex = dataRTSW.findIndex(findIndexOfPoint, [seriesLatestPoint, 11]);
                                    if(startingindex >= 0){
                                        for(var i = startingindex; i < dataRTSW.length; i++){
    
                                            latestPoint = dataRTSW[i];
                                            latestTime = Date.parse(parseDateTime(latestPoint[11]) + 'Z');
    
                                            bzPoints.addPoint([latestTime, parseInt(latestPoint[6])], false, false);
                                            btPoints.addPoint([latestTime, parseFloat(latestPoint[7])], false, false);
                                            densePoints.addPoint([latestTime, parseFloat(latestPoint[2])], false, false);
                                            speedPoints.addPoint([latestTime, parseFloat(latestPoint[1])], false, false);
                                            tempPoints.addPoint([latestTime, parseFloat(latestPoint[3])],false,false);
                                        }
                                        geospaceChart.redraw();
                                    }
                                }

                                
                            });
                            $.getJSON(dataServiceUrl +'/experimental/products/geospace/geomagnetic-indices.json', function(data){
                                var latestPoint = data[data.length - 1];
                                var latestTime = Date.parse(latestPoint[0] + 'Z');

                                var seriesLatestPoint = gkpPoints.options.data[gkpPoints.options.data.length -1 ];

                                if(latestTime !=  seriesLatestPoint[0]){

                                    var startingIndex = data.findIndex(findIndexOfPoint, [seriesLatestPoint,0]);
                                    if(startingIndex >= 0){
                                        for(var i = startingIndex; i < data.length; i ++){
                                            latestPoint = data[i];
                                            latestTime = Date.parse(latestPoint[0] + 'Z');
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
                            loadJSON(true);
                        }, hourMillisecs);
                    },
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
                        this.setTitle({text: "Geospace Timeline: Lastest "+ time_range});
                    }
                }
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
                    }
                }
            },

            rangeSelector: {
                selected: 1,
                buttonPosition: {
                    align:"left"
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
                valueDecimals: 3,
                animation: false,
                useHTML: true,
                positioner: function (boxWidth, boxHeight, point) {
                    // Set up the variables
                    var chart = this.chart;
                    var plotLeft = chart.plotLeft;
                    var plotTop = chart.plotTop;
                    var plotHeight = chart.plotHeight;
                    var distance = 40;
                    var pointX = point.plotX;
                    var pointY = point.plotY;

                    if ((pointX - boxWidth - distance) < plotLeft) {
                        x = pointX + 130;
                        $("#custom-tooltip").removeClass('tooltip-right');
                    }
                    else {
                        x = Math.max(plotLeft, pointX - boxWidth + 50); 
                        $("#custom-tooltip").removeClass('tooltip-left');

                    }
                    y = Math.min(plotTop + plotHeight - boxHeight, Math.max(plotTop, pointY - boxHeight + plotTop + boxHeight / 2));

                    return { x: x, y: y };
                } 
            },


            title: {
                text: 'Geospace Timeline: Latest 24 Hours',
                style: {"color": "#ffffff", "font-size": "16px", "font-weight": "bold" },
                align: 'left',
                useHTML: true,
                floating: true,
                margin: 30,
                x: 90
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

            credits:{
                enabled: true,
                text: 'Space Weather Prediction Center',
                href: 'http://www.swpc.noaa.gov',
                position:{
                    align: "center"
                },
                style:{
                    fontSize: '11px',
                    color: 'white'
                }
            },

            xAxis: [
                {   
                    top: '100%',
                    height: '0%',
                    plotLines: [nowLineOptions],
                    ordinal:false,
                    tickLength: 8,
                    tickWidth: 2,
                    startOnTick: true,
                    endOnTick: true,
                    tickColor: '#ffffff'
                },
                {
                    top: '10%',
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
                {
                    top: '20%',
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
                {
                    top: '30%',
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
                {
                    top: '40%',
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
                    minorTickPosition: 'inside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
                {
                    top: '60%',
                    height: '0%',
                    offset: 0,
                    linkedTo: 0,
                    tickLength: 6,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#ffffff',
                    minorTickLength: 3,
                    minorTickWidth: 1,
                    minorTickPosition: 'outside',
                    startOnTick: true,
                    endOnTick: true,
                    labels: {
                        enabled: false
                    }
                },
                {
                    top: '80%',
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
                //Y Axis 0
                {
                    opposite: false,
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        text: 'Bz',
                        style: {'color': '#ff0000'},
                        offset: 32
                    },
                    top: '-2.7%', // Shift top plot up to eliminate gap in Drupal
                    height: '12.7%',
                    lineWidth: 0,
                    tickAmount: 5,
                    tickInterval: 1,
                    tickColor: '#ffffff',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside',
                    gridLineColor: '#4f4b47'
                }, 
                //Y Axis 1
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
                        offset: 37,
                        text: 'Density<br/>p/cm<sup>3</sup>',
                        style: {'color': '#ff7f00'}
                    },
                    top: '10%',
                    height: '10%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#4f4b47',
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
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        text: 'Speed<br/>km/s',
                        style: {'color': '#f2ff00'}
                    },
                    top: '20%',
                    height: '10%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#4f4b47',
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
                            if(!isNaN(intVal)){
                                power = intVal.toString().slice(1).length;
                                if (power == 1) {
                                    powerLabel = '*10';
                                }
                                else {
                                    powerLabel = '*10<sup>' + power + '</sup>';
                                }
                                return this.value.toString()[0] + powerLabel;
                            }
                        }
                    },
                    title: {
                        text: 'Temperature<br/>K',
                        style: {'color': '#00c147'}
                    },
                    top: '30%',
                    height: '10%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#4f4b47',
                    tickAmount: 5,
                    tickInterval: 0.1,
                    tickColor: '#ffffff',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'

                },
                //Y Axis 4
                {
                    opposite: false,
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        text: 'AU',
                        style: {'color': '#3ee89b'}
                    },
                    top: '40%',
                    height: '10%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#4f4b47',
                    lineColor: '#ffffff',
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
                        text: 'Geospace Kp',
                        style: {'color': '#21f26e'}
                    },
                    top: '60%',
                    height: '20%',
                    offset: 0,
                    lineWidth: 0,
                    max: 9,
                    min: 0,
                    gridLineColor: '#4f4b47',
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
                        align: 'right',
                        x: -3,
                        y: 5,
                        style: {'color': '#ffffff'}
                    },
                    title: {
                        text: 'Geospace DST (nT) ',
                        style: {'color': '#ffffff'}
                    },
                    top: '80%',
                    height: '20%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#4f4b47',
                    tickAmount: 5,
                    tickColor: '#ffffff',
                    tickWidth: 1,
                    tickLength: 5,
                    tickPosition: 'inside'
                },
                //Y Axis 7 (Adds title)  
                {
                    opposite: false,
                    title: {
                        useHTML: true,
                        text: 'Btotal<br/><br/>       nT',
                        style: {'color': '#ffffff'},
                        offset: -60
                    },
		            top: '-2%',
                    height: '12%'
                },
                //Y Axis 8 (Adds title)
                {
                    opposite: false,
                    title: {
                        //useHTML: true,
                        text: 'AL',
                        style: {'color': '#4286f4'},
                        offset: -20
                    },
                    top: '40%',
                    height: '10%'
                    
                },
                //Y Axis 5(Adds title) //numbering???
                {
                    opposite: false,
                    title:{
                        //useHTML: true,
                        text: "SWPC Kp",
                        style: {'color': '#4ac3c9'},
                        offset: -20
                    },
                    top: '65%',
                    height: '10%'
                },
                //Y Axis 9 (Adds title)
                {
                    opposite: false,
                    title: {
                        //useHTML: true,
                        text: 'Kyoto DST',
                        style: {'color': '#e20000'},
                        offset: -15
                    },
                    top: '80%',
                    height: '20%'
                    
                }
            ],

            series: [
                {
                    // index 0
                    type: bz.type,
                    name: bz.name,
                    data: bz.data,                
                    lineWidth: 0,
                    color: "#ff0000",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    animation: false,
                    marker: {
                        enabled: true,
                        radius: 1
                    }

                },
                 {
                    // index 1
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
                    // index 2
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
                    // index 3
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
                    // index 4
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
                },{
                    // index 5
                    type: au.type,
                    name: au.name,
                    data: au.data,
                    yAxis: 4,
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
                    // index 6
                    type: al.type,
                    name: al.name,
                    data: al.data,
                    yAxis: 4,
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
                    // index 7
                    type: gkp.type,
                    name: gkp.name,
                    data: gkp.data,
                    yAxis: 5,
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
                    // index 8
                    type: swpcKp.type,
                    name: swpcKp.name,
                    data: swpcKp.data,
                    yAxis: 5,
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
                    // index 9
                    type: gdst.type,
                    name: gdst.name,
                    data: gdst.data,
                    yAxis: 6,
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
                    // index 10
                    type: kdst.type,
                    name: kdst.name,
                    data: kdst.data,
                    yAxis: 6,
                    lineWidth: 1,
                    color: "#e20000",
                    tooltip: {
                        valueSuffix: " nT"
                    },
                    step: true
                } 
            ]
        }, function(chart){ //on complete function
                chart.renderer.text('Solar Wind Predicted at Earth', 110, 53)
                .css({
                    color: '#ffffff',
                    fontSize: '14px'
                })
                .add();
                chart.renderer.text('Geospace Model Predicted Kp and DST (Ground Truth Data: SWPC Kp and Kyoto quick-look DST)', 110, 450)
                .attr({
                    //none?
                })
                .css({
                    color: '#ffffff',
                    fontSize: '14px'
                })
                .add();
                chart.renderer.text("Verison 1.5", 1090, 845)
                .css({
                    fontSize: '11px',
                    color: 'white'
                })
                .add();
        });
    } // Build charts
  

    // Load the JSON and build or refresh the charts
    function loadJSON(refreshing) {
        var series = [];
        
        var threedays = new Date();
        threedays.setDate(threedays.getDate() - 3);
        threedays = Date.parse(threedays);

        $.getJSON(dataServiceUrl + '/products/geospace/propagated-solar-wind.json', function (data) {
        var bzSeries = {name: "bz", data: [], type: "line"}; 
        var btSeries = {name: "bt", data: [], type: "line"}; 
        var tempSeries = {name: "Temperature", data: [], type: "line"};
        var densitySeries = {name: "Density", data: [], type: "line"}; 
        var speedSeries = {name: "Speed", data: [], type: "line"};  

        data = sortRTSW(data.splice(1));
        $.each(data,function (i, value){
            // Add X, Y values
	        var time = Date.parse(parseDateTime(value[11]) + 'Z');
            //if(time >= threedays){
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

        $.getJSON(dataServiceUrl + '/products/noaa-planetary-k-index.json', function(data){
            var swpcKpSeries = {name: "SWPC KP", data: [], type: "line"}; 
            $.each(data,function (i, value){
            // Add X, Y values
                if(i > 0){
                    var time = Date.parse(parseDateTime(value[0]) + 'Z');
                    //if(time >= threedays){
                        swpcKpSeries.data.push([time, parseFloat(value[1])]);
                    //}
                }
            });
            
            if (refreshing) {
                geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, swpcKpSeries.name)].setData(swpcKpSeries.data, true);
            }
            else {
                series.push(swpcKpSeries);
            }
	    //$.getJSON(dataServiceUrl + '/products/geospace/geomagnetic-indices.json', function(data){
            $.getJSON(dataServiceUrl + '/experimental/products/geospace/geomagnetic-indices.json', function(data){
                var gdstSeries = {name: "Geospace DST", data: [], type: "line"};
                var gkpSeries = {name: "Geospace KP", data: [], type: "line"}; 
                var auSeries = {name: "AU", data: [], type: "line"};
                var alSeries = {name: "AL", data: [], type: "line"};

                $.each(data,function (i, value){
                    // Add X, Y values
                    if(i > 0){
                        var time = Date.parse(value[0] + 'Z');
                        //f(time >= threedays){
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

                $.getJSON(dataServiceUrl + '/experimental/products/kyoto-dst.json', function(data){
                    var kdstSeries = {name: "Kyoto DST", data: [], type: "line"};
                    $.each(data,function (i, value){
                        // Add X, Y values
                        if(i > 0){
                            var time = Date.parse(value[0] + 'Z');
                           // if(time >= threedays){
                                kdstSeries.data.push([time, parseFloat(value[1])]);
                          //  }
                        }
                    });
                    if (refreshing){
                        geospaceChart.series[findSeriesPlotIndex(geospaceChart.series, kdstSeries.name)].setData(kdstSeries.data, true);
                        geospaceChart.xAxis[0].removePlotLine('now_line');
                        nowLineOptions.value = new Date();
                        geospaceChart.xAxis[0].addPlotLine(nowLineOptions);
                    }
                    else{
                        series.push(kdstSeries);
                        buildCharts(series);
                    }

                    var time = new Date();
                    var currentTime = "Current Time: " + time.getUTCFullYear() + "-" + ('0'+String(time.getUTCMonth()+1)).slice(-2) + "-" +
                    ('0'+String(time.getUTCDate())).slice(-2) + " " + ('0'+String(time.getUTCHours())).slice(-2) + ":" +
                    ('0'+String(time.getUTCMinutes())).slice(-2) +  " UTC" + "<br/>";
                    var validTimeDate = new Date(validTime);
                    var minuteDifference = Math.floor(((validTimeDate.getTime() - time.getTime())/1000)/60);
                    var customSubtitle = currentTime + "Valid Time: " + validTimeDate.getUTCFullYear() + "-" + ('0'+ String(validTimeDate.getUTCMonth()+1)).slice(-2) + "-" +
                    ('0'+String(validTimeDate.getUTCDate())).slice(-2) + " " + ('0'+String(validTimeDate.getUTCHours())).slice(-2) + ":" +
                    ('0'+String(validTimeDate.getUTCMinutes())).slice(-2) + " (" + minuteDifference + " mins ahead)";
                    geospaceChart.setTitle(null, {text: customSubtitle}); // changing the member variable doesn't cause a refresh like this does
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
                return(a[index] === b[index] ? 0 : (parseDateTime(a[index]) < parseDateTime(b[index]) ? -1 : 1 )); 
           };
        })(11)); //11th index is propagated solar wind
        return data;
    }//sortRTSW
    
    //this finds the last point on the series plot array in the array we get back from the JSON,
    //so we can add only the new points on to the series array
    function findIndexOfPoint(element){
        return Date.parse(element[this[1]]+"Z") == this[0][0];
    }
    
    //this is for solar wind as Edge doesn't like the
    //extra .000 on the end of the datetime
    function parseDateTime(time){
        return time.split(".000")[0];
    }
    

   
}(jQuery));
