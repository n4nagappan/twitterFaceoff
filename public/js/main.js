//function TwitController($scope) { 
//        $scope.twitData = [
//      {handle:'handle1', followers:10, tweets: 99},
//      {handle:'handle2', followers:30, tweets: 88}];       
//}

google.load("visualization", "1", {packages:["corechart"]});

function addLinks(text,urls)
{
  for(var i=0; i<urls.length; ++i)
  {
    console.log(text);
    console.log(urls[i].url);
    text = text.replace( urls[i].url , '<a href="' + urls[i].url + '">' + urls[i].url + '</a>');
    console.log(text);
  }

  return text;
}
function loadChart(handleData1, handleData2)
{
    var data = new google.visualization.DataTable();
    data.addColumn('date' , 'Date');
    data.addColumn('number' , handleData1.handle);
    data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
    data.addColumn('number' , handleData2.handle);
    data.addColumn({type:'string', role:'tooltip','p': {'html': true}});

   
    var len = Math.min(handleData1.length, handleData2.length);
    for( i = 0; i< len ; ++i)
    {
      var t1 = handleData1[i];
      var t2 = handleData2[i];
      var rt1 = Math.log(t1.retweet_count);
      var rt2 = Math.log(t2.retweet_count);
      var text1 = addLinks(t1.text, t1.entities.urls);
      var text2 = addLinks(t2.text, t2.entities.urls);

      data.addRow([new Date(t1.created_at),rt1,text1,null, null]);
      data.addRow([new Date(t2.created_at),null,null,rt2, text2]);
    }

    //var data = google.visualization.arrayToDataTable(chartData);

    var options = {
      title: 'Twitter FaceOff - '+ handleData1.handle + ' vs ' + handleData2.handle,
      tooltip: {isHtml:true,trigger:'hover' },
      interpolateNulls: true,
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
}

var handle1 = "cristiano";
var handle2 = "katyperry";

$.getJSON("http://livecat.cloudapp.net/timeline?count=100&handle="+handle1,function(handleData1){  
  $.getJSON("http://livecat.cloudapp.net/timeline?count=100&handle="+handle2,function(handleData2){
    handleData1.handle = handle1;
    handleData2.handle = handle2;
    loadChart(handleData1, handleData2);
  });
});
