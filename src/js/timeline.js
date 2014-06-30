var Timeline_ajax_url = '/files/timeline/timeline_ajax/simile-ajax-api.js';
var Timeline_urlPrefix = '/files/timeline/timeline_js/'
var Timeline_parameters = 'bundle=true';
var tl;
function timeline() {
  setTimeout(function(){
    SimileAjax.History.historyFile = 'files/timeline/timeline_ajax/content/history.html';
    function centerSimileAjax(date) {
        tl.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(date));
    }

    function setupFilterHighlightControls(div, timeline, bandIndices, theme) {
        var table = document.createElement("table");
        var tr = table.insertRow(0);
        
        var td = tr.insertCell(0);
        td.innerHTML = "Filter:";
        
        td = tr.insertCell(1);
        td.innerHTML = "Highlight:";
        
        var handler = function(elmt, evt, target) {
            onKeyPress(timeline, bandIndices, table);
        };
        
        tr = table.insertRow(1);
        tr.style.verticalAlign = "top";
        
        td = tr.insertCell(0);
        
        var input = document.createElement("input");
        input.type = "text";
        SimileAjax.DOM.registerEvent(input, "keypress", handler);
        td.appendChild(input);
        
        for (var i = 0; i < theme.event.highlightColors.length; i++) {
            td = tr.insertCell(i + 1);
            
            input = document.createElement("input");
            input.type = "text";
            SimileAjax.DOM.registerEvent(input, "keypress", handler);
            td.appendChild(input);
            
            var divColor = document.createElement("div");
            divColor.style.height = "0.5em";
            divColor.style.background = theme.event.highlightColors[i];
            td.appendChild(divColor);
        }
        
        td = tr.insertCell(tr.cells.length);
        var button = document.createElement("button");
        button.innerHTML = "Clear All";
        SimileAjax.DOM.registerEvent(button, "click", function() {
            clearAll(timeline, bandIndices, table);
        });
        td.appendChild(button);
        
        div.appendChild(table);
    }

    var timerID = null;
    function onKeyPress(timeline, bandIndices, table) {
        if (timerID != null) {
            window.clearTimeout(timerID);
        }
        timerID = window.setTimeout(function() {
            performFiltering(timeline, bandIndices, table);
        }, 300);
    }
    function cleanString(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }
    function performFiltering(timeline, bandIndices, table) {
        timerID = null;
        
        var tr = table.rows[1];
        var text = cleanString(tr.cells[0].firstChild.value);
        
        var filterMatcher = null;
        if (text.length > 0) {
            var regex = new RegExp(text, "i");
            filterMatcher = function(evt) {
                return regex.test(evt.getText()) || regex.test(evt.getDescription());
            };
        }
        
        var regexes = [];
        var hasHighlights = false;
        for (var x = 1; x < tr.cells.length - 1; x++) {
            var input = tr.cells[x].firstChild;
            var text2 = cleanString(input.value);
            if (text2.length > 0) {
                hasHighlights = true;
                regexes.push(new RegExp(text2, "i"));
            } else {
                regexes.push(null);
            }
        }
        var highlightMatcher = hasHighlights ? function(evt) {
            var text = evt.getText();
            var description = evt.getDescription();
            for (var x = 0; x < regexes.length; x++) {
                var regex = regexes[x];
                if (regex != null && (regex.test(text) || regex.test(description))) {
                    return x;
                }
            }
            return -1;
        } : null;
        
        for (var i = 0; i < bandIndices.length; i++) {
            var bandIndex = bandIndices[i];
            timeline.getBand(bandIndex).getEventPainter().setFilterMatcher(filterMatcher);
            timeline.getBand(bandIndex).getEventPainter().setHighlightMatcher(highlightMatcher);
        }
        timeline.paint();
    }
    function clearAll(timeline, bandIndices, table) {
        var tr = table.rows[1];
        for (var x = 0; x < tr.cells.length - 1; x++) {
            tr.cells[x].firstChild.value = "";
        }
        
        for (var i = 0; i < bandIndices.length; i++) {
            var bandIndex = bandIndices[i];
            timeline.getBand(bandIndex).getEventPainter().setFilterMatcher(null);
            timeline.getBand(bandIndex).getEventPainter().setHighlightMatcher(null);
        }
        timeline.paint();
    }
    var eventSource = new Timeline.DefaultEventSource();
    
    var zones = [
        {   start:    "Fri Nov 22 1963 00:00:00 GMT-0600",
            end:      "Mon Nov 25 1963 00:00:00 GMT-0600",
            magnify:  10,
            unit:     Timeline.DateTime.DAY
        },
        {   start:    "Fri Nov 22 1963 09:00:00 GMT-0600",
            end:      "Sun Nov 24 1963 00:00:00 GMT-0600",
            magnify:  5,
            unit:     Timeline.DateTime.HOUR
        },
        {   start:    "Fri Nov 22 1963 11:00:00 GMT-0600",
            end:      "Sat Nov 23 1963 00:00:00 GMT-0600",
            magnify:  5,
            unit:     Timeline.DateTime.MINUTE,
            multiple: 10
        },
        {   start:    "Fri Nov 22 1963 12:00:00 GMT-0600",
            end:      "Fri Nov 22 1963 14:00:00 GMT-0600",
            magnify:  3,
            unit:     Timeline.DateTime.MINUTE,
            multiple: 5
        }
    ];
    var zones2 = [
        {   start:    "Fri Nov 22 1963 00:00:00 GMT-0600",
            end:      "Mon Nov 25 1963 00:00:00 GMT-0600",
            magnify:  10,
            unit:     Timeline.DateTime.WEEK
        },
        {   start:    "Fri Nov 22 1963 09:00:00 GMT-0600",
            end:      "Sun Nov 24 1963 00:00:00 GMT-0600",
            magnify:  5,
            unit:     Timeline.DateTime.DAY
        },
        {   start:    "Fri Nov 22 1963 11:00:00 GMT-0600",
            end:      "Sat Nov 23 1963 00:00:00 GMT-0600",
            magnify:  5,
            unit:     Timeline.DateTime.MINUTE,
            multiple: 60
        },
        {   start:    "Fri Nov 22 1963 12:00:00 GMT-0600",
            end:      "Fri Nov 22 1963 14:00:00 GMT-0600",
            magnify:  3,
            unit:     Timeline.DateTime.MINUTE,
            multiple: 15
        }
    ];
    
    var theme = Timeline.ClassicTheme.create();
    theme.event.bubble.width = 250;
    
    var date = "Fri Nov 22 1963 13:00:00 GMT-0600"
    var bandInfos = [
        Timeline.createHotZoneBandInfo({
            width:          "80%", 
            intervalUnit:   Timeline.DateTime.WEEK, 
            intervalPixels: 220,
            zones:          zones,
            eventSource:    eventSource,
            date:           date,
            timeZone:       -6,
            theme:          theme
        }),
        Timeline.createHotZoneBandInfo({
            width:          "20%", 
            intervalUnit:   Timeline.DateTime.MONTH, 
            intervalPixels: 200,
            zones:          zones2, 
            eventSource:    eventSource,
            date:           date, 
            timeZone:       -6,
            overview:       true,
            theme:          theme
        })
    ];
    bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;
    
    for (var i = 0; i < bandInfos.length; i++) {
        bandInfos[i].decorators = [
            new Timeline.SpanHighlightDecorator({
                startDate:  "Fri Nov 22 1963 12:30:00 GMT-0600",
                endDate:    "Fri Nov 22 1963 13:00:00 GMT-0600",
                color:      "#FFC080", // set color explicitly
                opacity:    50,
                startLabel: "shot",
                endLabel:   "t.o.d.",
                theme:      theme
            }),
            new Timeline.PointHighlightDecorator({
                date:       "Fri Nov 22 1963 14:38:00 GMT-0600",
                opacity:    50,
                theme:      theme
                // use the color from the css file
            }),
            new Timeline.PointHighlightDecorator({
                date:       "Sun Nov 24 1963 13:00:00 GMT-0600",
                opacity:    50,
                theme:      theme
                // use the color from the css file
            })
        ];
    }
    
    tl = Timeline.create(document.getElementById("timeline"), bandInfos, Timeline.HORIZONTAL);
    tl.loadJSON('/files/timeline.json', function(json, url) { eventSource.loadJSON(json, url); });
    
    setupFilterHighlightControls(document.getElementById("controls"), tl, [0,1], theme);
  }, 1000);
};
var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}
/*var timeline = function(){
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
};*/