/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            var newRow = tBody.insertRow(-1);
            for(var col=0; col < item.data.length; col++){
                var cell = newRow.insertCell(-1);
                cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
               "color" : "red"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "blue"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round(series.percent)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7825, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "36 /catalog/categories/FISH"], "isController": false}, {"data": [0.4925, 500, 1500, "60 /cart"], "isController": false}, {"data": [0.515, 500, 1500, "15 /"], "isController": false}, {"data": [0.9825, 500, 1500, "19 /catalog"], "isController": false}, {"data": [0.995, 500, 1500, "48 /api/v1/"], "isController": false}, {"data": [0.91, 500, 1500, "62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [0.25125, 500, 1500, "14 /v3/links/ping-centre"], "isController": false}, {"data": [0.9925, 500, 1500, "57 /api/v1/recipe/signed/"], "isController": false}, {"data": [0.9925, 500, 1500, "65 /api/v1/action/signed/"], "isController": false}, {"data": [0.9975, 500, 1500, "13 /v4/links/activity-stream"], "isController": false}, {"data": [0.985, 500, 1500, "64 /cart"], "isController": false}, {"data": [0.975, 500, 1500, "77 /login"], "isController": false}, {"data": [0.7375, 500, 1500, "75 /my/orders/create"], "isController": false}, {"data": [1.0, 500, 1500, "63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [0.995, 500, 1500, "16 /v4/links/activity-stream"], "isController": false}, {"data": [0.49875, 500, 1500, "46 /catalog/products/FI-SW-01"], "isController": false}, {"data": [0.425, 500, 1500, "56 /api/v1/classify_client/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 0, 0.0, 1464.3000000000015, 2408.95, 3631.899999999998, 50.11446599619586, 341.6966594152553, 22, 7487], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["36 /catalog/categories/FISH", 400, 0, 0.0, 228.0, 231.0, 238.97000000000003, 4.948106730662181, 25.32771059606131, 207, 250], "isController": false}, {"data": ["60 /cart", 200, 0, 0.0, 899.0, 921.8, 1936.3000000000006, 2.470935619772427, 18.324388578563397, 818, 1994], "isController": false}, {"data": ["15 /", 200, 0, 0.0, 1096.6, 1140.95, 1169.93, 2.4453465055998436, 4.169506834743483, 213, 1210], "isController": false}, {"data": ["19 /catalog", 400, 0, 0.0, 230.0, 236.79999999999995, 658.97, 4.947249947435469, 31.894905917220143, 207, 669], "isController": false}, {"data": ["48 /api/v1/", 200, 0, 0.0, 201.0, 218.84999999999997, 1141.190000000007, 2.4750943629725883, 3.1173740989109584, 95, 1273], "isController": false}, {"data": ["62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 573.9, 616.8, 1231.6800000000003, 2.4856762903767042, 15.571888088639216, 113, 1341], "isController": false}, {"data": ["14 /v3/links/ping-centre", 400, 0, 0.0, 2256.8, 2636.9, 2784.83, 4.763492592769018, 5.745032570380603, 733, 3272], "isController": false}, {"data": ["57 /api/v1/recipe/signed/", 200, 0, 0.0, 60.0, 120.84999999999997, 1066.690000000002, 2.491063310374033, 31.03717707645696, 24, 1148], "isController": false}, {"data": ["65 /api/v1/action/signed/", 200, 0, 0.0, 201.0, 215.89999999999998, 1166.2400000000043, 2.49280203412646, 9.867832317776172, 22, 1229], "isController": false}, {"data": ["13 /v4/links/activity-stream", 200, 0, 0.0, 267.0, 306.84999999999997, 357.8100000000002, 2.4568515447454087, 0.4342677046864443, 244, 1020], "isController": false}, {"data": ["64 /cart", 200, 0, 0.0, 228.0, 232.0, 816.5200000000013, 2.4898538455792645, 17.30673336232976, 206, 1208], "isController": false}, {"data": ["77 /login", 200, 0, 0.0, 229.0, 597.5999999999958, 665.98, 2.4905979925780177, 11.382859782446264, 207, 671], "isController": false}, {"data": ["75 /my/orders/create", 400, 0, 0.0, 675.0, 803.4499999999987, 1481.6700000000003, 4.953315006067811, 36.13943949370929, 411, 2126], "isController": false}, {"data": ["63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 151.70000000000002, 167.84999999999997, 183.95000000000005, 2.4965360562219923, 15.639920703773514, 29, 376], "isController": false}, {"data": ["16 /v4/links/activity-stream", 200, 0, 0.0, 277.8, 342.6499999999997, 908.490000000005, 2.456006778578709, 0.4341183856667444, 244, 989], "isController": false}, {"data": ["46 /catalog/products/FI-SW-01", 400, 0, 0.0, 3641.0000000000005, 4203.95, 5572.920000000003, 4.797716287047366, 138.19453971159726, 208, 7487], "isController": false}, {"data": ["56 /api/v1/classify_client/", 200, 0, 0.0, 1752.0, 2269.5499999999997, 4288.84, 2.4580291522257456, 2.597313470153381, 725, 5261], "isController": false}]}, function(index, item){
        switch(index){
            case 3:
                item = item.toFixed(2) + '%';
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
