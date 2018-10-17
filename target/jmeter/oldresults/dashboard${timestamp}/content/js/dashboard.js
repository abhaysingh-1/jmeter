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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7848863636363637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "36 /catalog/categories/FISH"], "isController": false}, {"data": [0.4975, 500, 1500, "60 /cart"], "isController": false}, {"data": [0.5025, 500, 1500, "15 /"], "isController": false}, {"data": [0.9925, 500, 1500, "19 /catalog"], "isController": false}, {"data": [0.9925, 500, 1500, "48 /api/v1/"], "isController": false}, {"data": [0.9725, 500, 1500, "62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [0.24875, 500, 1500, "14 /v3/links/ping-centre"], "isController": false}, {"data": [0.985, 500, 1500, "57 /api/v1/recipe/signed/"], "isController": false}, {"data": [0.9925, 500, 1500, "65 /api/v1/action/signed/"], "isController": false}, {"data": [0.995, 500, 1500, "13 /v4/links/activity-stream"], "isController": false}, {"data": [0.995, 500, 1500, "64 /cart"], "isController": false}, {"data": [0.99, 500, 1500, "77 /login"], "isController": false}, {"data": [0.7275, 500, 1500, "75 /my/orders/create"], "isController": false}, {"data": [1.0, 500, 1500, "63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [1.0, 500, 1500, "16 /v4/links/activity-stream"], "isController": false}, {"data": [0.4975, 500, 1500, "46 /catalog/products/FI-SW-01"], "isController": false}, {"data": [0.4125, 500, 1500, "56 /api/v1/classify_client/"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 0, 0.0, 1504.7000000000003, 2394.0, 3369.949999999999, 52.33733793267515, 356.83874858748663, 23, 6292], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["36 /catalog/categories/FISH", 400, 0, 0.0, 229.0, 231.95, 295.8000000000002, 5.159359723458319, 26.407432017374145, 208, 399], "isController": false}, {"data": ["60 /cart", 200, 0, 0.0, 898.9, 914.0, 1387.5400000000004, 2.575129400252363, 19.095426952430923, 816, 1910], "isController": false}, {"data": ["15 /", 200, 0, 0.0, 1043.3000000000015, 1127.6999999999998, 1179.92, 2.5486148278410687, 4.345587392002447, 208, 1729], "isController": false}, {"data": ["19 /catalog", 400, 0, 0.0, 230.0, 235.89999999999998, 644.99, 5.158760865640073, 33.262067873171866, 206, 653], "isController": false}, {"data": ["48 /api/v1/", 200, 0, 0.0, 120.9, 123.94999999999999, 808.6800000000003, 2.58287810106802, 3.2521310762207323, 97, 1035], "isController": false}, {"data": ["62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 435.9, 515.8, 627.6800000000003, 2.5970315928893277, 16.26948991053226, 100, 642], "isController": false}, {"data": ["14 /v3/links/ping-centre", 400, 0, 0.0, 2149.5, 2612.3999999999996, 3272.130000000001, 4.965366568186896, 5.988503624717595, 728, 6292], "isController": false}, {"data": ["57 /api/v1/recipe/signed/", 200, 0, 0.0, 36.80000000000001, 128.89999999999998, 1048.780000000001, 2.599799815414213, 32.39210932320711, 24, 1112], "isController": false}, {"data": ["65 /api/v1/action/signed/", 200, 0, 0.0, 120.0, 135.95, 912.1700000000008, 2.6035564581217945, 10.305901103094326, 23, 1038], "isController": false}, {"data": ["13 /v4/links/activity-stream", 200, 0, 0.0, 259.0, 262.0, 723.4800000000041, 2.561278590272264, 0.4527260008196092, 243, 984], "isController": false}, {"data": ["64 /cart", 200, 0, 0.0, 228.9, 232.0, 641.860000000002, 2.6005435135943413, 18.07653287818404, 207, 1244], "isController": false}, {"data": ["77 /login", 200, 0, 0.0, 227.0, 232.0, 656.7000000000003, 2.600475887087337, 11.882968528553224, 207, 672], "isController": false}, {"data": ["75 /my/orders/create", 400, 0, 0.0, 675.7, 801.3499999999999, 1101.97, 5.171633589760165, 37.72647361254768, 410, 2122], "isController": false}, {"data": ["63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 110.9, 124.89999999999998, 164.91000000000008, 2.603048169406375, 16.307181647208882, 23, 323], "isController": false}, {"data": ["16 /v4/links/activity-stream", 200, 0, 0.0, 261.0, 263.95, 314.5900000000004, 2.5614754098360653, 0.45276079021516397, 243, 465], "isController": false}, {"data": ["46 /catalog/products/FI-SW-01", 400, 0, 0.0, 3396.1000000000004, 3686.1499999999996, 4489.860000000001, 5.017498526109808, 144.51857150640984, 208, 4899], "isController": false}, {"data": ["56 /api/v1/classify_client/", 200, 0, 0.0, 1765.9, 2022.75, 2758.98, 2.5625912923147887, 2.7076379635086996, 731, 3017], "isController": false}]}, function(index, item){
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
