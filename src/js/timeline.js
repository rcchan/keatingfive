var timeline = function(){
  d3.json('/files/timeline.json', function(err, odata){
    if (err) return console.log(err);
    
    (function(){
      var data = odata.map(function(e, i){
        return {
          data: e,
          yAxisMapping: i%16,
          times: [{'starting_time': new Date(e[0]).getTime(), 'ending_time': new Date(e[1]).getTime() || (new Date(e[0]).getTime() + 31536000730/30) }]
        };
      });
      
      var chart = d3.timeline().tickFormat({
        format: d3.time.format('%Y'),
        tickTime: d3.time.year,
        tickNumber: 1,
        tickSize: 1
      }).width(3000).mouseover(function(d, i, datum){
        $('#title').text(datum.data[0] + (datum.data[1] ? ' - ' + datum.data[1] : '') + ': ' + datum.data[2]);
      }).mouseout(function(){
        $('#title').text('');
      }).stack().display('circle').scroll(function(){
        console.log(arguments);
      }).colors(d3.scale.ordinal().range(['#8484bc']));

      var svg = d3.select("#timeline").append("svg").attr('width', 800).attr('height', 500).datum(data).call(chart);
    })();
    
    (function(){
      var data = odata.filter(function(e){
        var start = new Date(e[0]);
        return start > new Date('01/01/1987') && start < new Date('06/01/1987');
      }).map(function(e, i){
        return {
          data: e,
          yAxisMapping: i%16,
          times: [{'starting_time': new Date(e[0]).getTime(), 'ending_time': new Date(e[1]).getTime() || (new Date(e[0]).getTime() + 31536000730/365) }]
        };
      });
      
      var chart = d3.timeline().tickFormat({
        format: d3.time.format('%x'),
        tickTime: d3.time.week,
        tickNumber: 1,
        tickSize: 1
      }).width(3000).mouseover(function(d, i, datum){
        $('#mtitle').text(datum.data[0] + (datum.data[1] ? ' - ' + datum.data[1] : '') + ': ' + datum.data[2]);
      }).mouseout(function(){
        $('#mtitle').text('');
      }).stack().display('circle').colors(d3.scale.ordinal().range(['#8484bc']));

      var svg = d3.select("#mtimeline").append("svg").attr('width', 800).attr('height', 500).datum(data).call(chart);
    })();
  });
};