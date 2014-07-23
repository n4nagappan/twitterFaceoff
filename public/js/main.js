//function TwitController($scope) { 
//        $scope.twitData = [
//      {handle:'handle1', followers:10, tweets: 99},
//      {handle:'handle2', followers:30, tweets: 88}];       
//}

function loadChart(handleData1, handleData2)
{
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);
    function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ]);

    var options = {
      title: 'Company Performance'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
    }
}

handle = "imraina";
$.getJSON("http://livecat.cloudapp.net/timeline?handle="+handle,function(){
    console.log(arguments);
});