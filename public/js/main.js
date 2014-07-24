TwitterVisualizer = {};
TwitterVisualizer.loadChart = function(dataArr){
    
    var len = dataArr[0].length;
    
    var series = [];
    var chartData = [];
    var names = [];
    var handles = [];
    for(var i = 0 ; i< dataArr.length ; ++ i)
    {
        chartData.push([]);
        
        names.push(dataArr[i][0].user.name);
        handles.push(dataArr[i].handle);
        
        for(var j = 0 ; j< len ; ++ j)
        {
            var item = {};
            item.x = new Date(dataArr[i][j].created_at);
            item.y = dataArr[i][j].retweet_count;
            item.text = dataArr[i][j].text;
            chartData[i].push(item);
        }
    
        // Highchart expect the data to be sorted
        chartData[i].reverse();
        series.push({name : dataArr[i].handle , data : chartData[i]});
    }
    
    
    var chartObj = new Highcharts.Chart({
    chart: {
        renderTo: 'chart',
        type: 'spline',
        zoomType: 'x'
    },
    title: {
        text: handles.join(' vs ')
    },
    subtitle: {
        text: '(' + names.join(',')  + ')' 
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Retweets'
        },
        min: 0
    },
    tooltip: {
        formatter: function(){
            return this.point.text;
        }
    },

    series : series
});    
    
    return chartObj;
}

var baseUrl = "http://livecat.cloudapp.net/timeline";
var handles = ["imraina","imvkohli","msdhoni","bhogleharsha","sanjaymanjrekar","cricketaakash","virendersehwag"];
var chartObj = {};


function queue(funcs, finalCallback){
    (function next(){
        if(funcs.length > 0)
        {
            f = funcs.shift();
            f(next);
        }
        else
        {
            finalCallback();
        }
    })();
}



var funcs = [];
var dataArr = [];
for( var i =0 ; i < handles.length ; ++i)
{
    var handle = handles[i];
    var f = (function(handle){
        return function(callback){
         $.getJSON(baseUrl+"?count=30&handle="+handle+'&callback=?').success(function(data){
            data.handle = handle;
            dataArr.push(data);
            callback();
            });
         }
        })(handle);
    
    funcs.push(f); 
}

function final()
{
    chartObj = TwitterVisualizer.loadChart(dataArr);
}

queue(funcs,final);

$(document).ready(function(){    
    $(document).keyup(function(ev){
        if(ev.keyCode ==  27)
        {
            chartObj.zoomOut();
        }
    });
});