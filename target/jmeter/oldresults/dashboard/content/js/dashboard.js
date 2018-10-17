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

    var data = {"OkPercent": 99.95454545454545, "KoPercent": 0.045454545454545456};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7648863636363636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9775, 500, 1500, "36 /catalog/categories/FISH"], "isController": false}, {"data": [0.4925, 500, 1500, "60 /cart"], "isController": false}, {"data": [0.505, 500, 1500, "15 /"], "isController": false}, {"data": [0.935, 500, 1500, "19 /catalog"], "isController": false}, {"data": [0.97, 500, 1500, "48 /api/v1/"], "isController": false}, {"data": [0.985, 500, 1500, "62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [0.26375, 500, 1500, "14 /v3/links/ping-centre"], "isController": false}, {"data": [0.99, 500, 1500, "57 /api/v1/recipe/signed/"], "isController": false}, {"data": [0.9725, 500, 1500, "65 /api/v1/action/signed/"], "isController": false}, {"data": [1.0, 500, 1500, "13 /v4/links/activity-stream"], "isController": false}, {"data": [0.975, 500, 1500, "64 /cart"], "isController": false}, {"data": [0.8925, 500, 1500, "77 /login"], "isController": false}, {"data": [0.6575, 500, 1500, "75 /my/orders/create"], "isController": false}, {"data": [1.0, 500, 1500, "63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain"], "isController": false}, {"data": [0.995, 500, 1500, "16 /v4/links/activity-stream"], "isController": false}, {"data": [0.475, 500, 1500, "46 /catalog/products/FI-SW-01"], "isController": false}, {"data": [0.4325, 500, 1500, "56 /api/v1/classify_client/"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 2, 0.045454545454545456, 1619.6000000000004, 2530.8499999999995, 3817.7499999999945, 30.36933249587598, 207.11100185149394, 23, 62920], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["36 /catalog/categories/FISH", 400, 0, 0.0, 333.50000000000017, 368.95, 1732.7000000000075, 2.9229082937522834, 14.964091614906833, 209, 1795], "isController": false}, {"data": ["60 /cart", 200, 0, 0.0, 1249.2, 1333.1499999999999, 2719.7400000000066, 1.4691622836658538, 10.893953111685716, 821, 3101], "isController": false}, {"data": ["15 /", 200, 0, 0.0, 1416.9, 1606.1999999999998, 1787.860000000001, 1.4459015919376526, 2.465375175315568, 208, 2055], "isController": false}, {"data": ["19 /catalog", 400, 0, 0.0, 654.4000000000002, 713.3499999999999, 1390.2900000000043, 2.922118243514724, 18.8398294533082, 208, 1765], "isController": false}, {"data": ["48 /api/v1/", 200, 0, 0.0, 401.70000000000016, 575.5499999999997, 985.3100000000006, 1.4702855294498192, 1.851554689108125, 99, 1153], "isController": false}, {"data": ["62 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 370.6000000000001, 455.74999999999994, 570.94, 1.474991518798767, 9.240303313568447, 98, 573], "isController": false}, {"data": ["14 /v3/links/ping-centre", 400, 0, 0.0, 2541.6000000000004, 3224.699999999999, 3498.9, 2.832821064857438, 3.416537124120055, 728, 4467], "isController": false}, {"data": ["57 /api/v1/recipe/signed/", 200, 0, 0.0, 144.60000000000008, 237.0999999999998, 733.5500000000013, 1.4762980350473154, 18.393556201282166, 24, 942], "isController": false}, {"data": ["65 /api/v1/action/signed/", 200, 0, 0.0, 399.4000000000001, 508.69999999999993, 889.6600000000003, 1.4823818912228168, 5.877817915326346, 23, 985], "isController": false}, {"data": ["13 /v4/links/activity-stream", 200, 0, 0.0, 263.0, 266.0, 274.98, 1.4442518775274409, 0.25528280257076835, 244, 296], "isController": false}, {"data": ["64 /cart", 200, 0, 0.0, 330.9, 386.94999999999976, 1677.1500000000026, 1.4813168907158465, 10.297293356293746, 207, 1790], "isController": false}, {"data": ["77 /login", 200, 0, 0.0, 684.9, 951.8499999999999, 1489.9300000000037, 1.4924370751218201, 6.8234908079867775, 208, 1637], "isController": false}, {"data": ["75 /my/orders/create", 400, 0, 0.0, 1228.9000000000008, 1508.5, 1808.990000000001, 2.9563276497934265, 21.571541916568737, 411, 2280], "isController": false}, {"data": ["63 /chains/normandy.content-signature.mozilla.org-20181216.prod.chain", 200, 0, 0.0, 112.0, 150.5499999999999, 314.6000000000013, 1.4779016752015488, 9.258534420330015, 23, 402], "isController": false}, {"data": ["16 /v4/links/activity-stream", 200, 0, 0.0, 263.9, 265.95, 762.2900000000043, 1.4443770401825693, 0.25530492604789556, 243, 953], "isController": false}, {"data": ["46 /catalog/products/FI-SW-01", 400, 1, 0.25, 3815.500000000001, 4458.15, 5727.990000000002, 2.8760218865265563, 82.8606340459876, 209, 62920], "isController": false}, {"data": ["56 /api/v1/classify_client/", 200, 1, 0.5, 1749.7, 2243.9499999999975, 4272.1400000000085, 1.4642789158478906, 1.5566471742162447, 730, 59332], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException", 2, 200.0, 0.058823529411764705], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
