$(document).ready(() => {
    var queryParams = getQueryParams();
    var target = queryParams.get('target');
    $('#target-ip').val(target);

    // register actions
    $('#showTemp').click(() => showTempChart());
    $('#showECG').click(() => showECGChart());
});


function getQueryParams() {
    var query = window.location.search.split('?');
    if (query.length == 2) {
        return new Map(query[1].split('&').map((e) => e.split('=')));
    }
    return new Map();
}

function showTempChart() {
    if ($("#showTemp").is(":checked")) {
        $("#tempChartContainer").show();
    } else {
        $("#tempChartContainer").hide();
    }
};

function showECGChart() {
    if ($("#showECG").is(":checked")) {
        $("#ecgChartContainer").show();
    } else {
        $("#ecgChartContainer").hide();
    }
};

window.onload = function () {

    var tempDataPoints = [];
    var ecgDataPoints = [];

    var ecgChart = new CanvasJS.Chart("ecgChartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: "ECG"
        },

        data: [{
            type: "line",
            dataPoints: ecgDataPoints
        }]
    });


    var tempChart = new CanvasJS.Chart("tempChartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: "Body Temperature"
        },
        axisX: {
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
                valueFormatString: "mm DD"
            }
        },
        axisY: {
            title: "Temp",
            includeZero: false,
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
            }
        },
        data: [{
            type: "line",
            xValueFormatString: "mm HH DD",
            xValueType: "dateTime",
            dataPoints: tempDataPoints
        }]
    });

    function addData(data) {
        console.log("Data Receeived" + data);
        if (data.timestamp === 0) {
            return;
        }
        if (tempDataPoints.length > 10) {
            tempDataPoints.shift();
        }
        if (ecgDataPoints.length > data.ecg.length * 10) {
            for (let i = 0; i < data.ecg.length; i++) {
                ecgDataPoints = ecgDataPoints.slice(0, data.ecg.length);
            }
        }

        tempDataPoints.push({
            x: new Date(data.timestamp),
            y: data.temp
        });

        console.log(data.ecg);

        for (var i = 0; i < data.ecg.length; i++) {
            ecgDataPoints.push({
                y: data.ecg[i]
            });
        }
        console.log("ECG"+$("#showECG").is(":checked"));
        if ($("#showECG").is(":checked")) {
            ecgChart.render();
        }
        if ($("#showTemp").is(":checked")) {
            tempChart.render();
        }
        document.getElementById("spo2").innerHTML = "SPO2 " + data.spo2;
        document.getElementById("hpm").innerHTML = "BPM " + data.bmp;
    }

    var updateChart = function () {

        $.getJSON('http://' + $('#target-ip').val() +":9090/sensor", addData);

    };
    setInterval(function () {
        updateChart()
    }, 1000);

}