/**
 * Created by root on 9/19/15.
 */


var Method = {
    POST: "post",
    GET: "get",
    PUT: "put",
    DELETE: "delete"
};

var ResponseState = {
    REQUEST_SENT: 1,
    REQUEST_SUCCESSFUL: 2,
    RESPONSE_STARTED: 3,
    RESPONSE_COMPLETE: 4
};

var AsyncCaller = function (){
    this.xhr = new XMLHttpRequest();
    this.responseObj = null;
    this.trial_count = 0;
    this.data = null;
    this.method = null;
    this.url = null;
    this.wait = null;
    this.callBack = null;
};

AsyncCaller.prototype.prepareRequest = function (method, url, callBack, wait){
    if (!wait) this.wait = true;
    this.callBack = callBack;
    this.xhr.onreadystatechange = this.callBack;
    this.method = method;
    this.url = url;
    this.xhr.open(this.method, this.url, this.wait);
};

AsyncCaller.prototype.makeRequest = function (data, onloadstart, onloadend){
    if (!onloadstart) onloadstart = null;
    if (!onloadend) onloadend = null;
    this.xhr.onloadstart = onloadstart;
    this.xhr.onloadend = onloadend;
    this.data = data;
    this.xhr.send(this.data);
    this.trial_count++;
};

var globalCaller, asyncCaller;

var STATISTICS_CALLER = {
    main: 1
};

var providers = ["mtn", "glo", "airtel", "etisalat"];

var BASE_URL = {
    local: "http://localhost/netfinder/web/api/1",
    prod: "http://netfind.gigalayer.com/web/api/1"
};
var URL = {
    statistics: BASE_URL.local + '/provider/statistics'
};
var user_location = {
    latitude: 0,
    longitude: 0
};

var network_speed = {};
var network_level = {};
var network_strength = {};
// in the format: {"mtn": [1,2,3,4,5], "glo": [1,3,5,2], "airtel": [1,6,2]}

var response = {
    'status': true,
    'data': {
        'mtn': [
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.1.2',
                'network_strength': '45',
                'network_speed': '80',
                'network_level': '4',
                'hour_of_day': '6',
                'network_score': '80'
            },
            {
                'device_type': 'Sony Xperia',
                'device_os': 'Android 5.1.2',
                'network_strength': '40',
                'network_speed': '60',
                'network_level': '3',
                'hour_of_day': '9',
                'network_score': '75'
            },
            {
                'device_type': 'Google Nexus 9',
                'device_os': 'Android 6.0.1',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '15',
                'network_score': '82'
            },
            {
                'device_type': 'Lenovo',
                'device_os': 'Android 4.4.2',
                'network_strength': '43',
                'network_speed': '92',
                'network_level': '5',
                'hour_of_day': '23',
                'network_score': '85'
            }
        ],
        'glo': [
            {
            'device_type': 'Asus Nexus 7',
            'device_os': 'Android 4.4.2',
            'network_strength': '50',
            'network_speed': '100',
            'network_level': '5',
            'hour_of_day': '2',
            'network_score': '91'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '4',
                'network_score': '82'
            },
            {
                'device_type': 'Infinix Hot 2',
                'device_os': 'Android 4.4.4',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '9',
                'network_score': '77'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 5.0.1',
                'network_strength': '49',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '13',
                'network_score': '87'
            }
        ],
        'airtel': [
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '1',
                'network_score': '75'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '13',
                'network_score': '81'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '19',
                'network_score': '88'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '55',
                'network_speed': '99',
                'network_level': '5',
                'hour_of_day': '21',
                'network_score': '89'
            }
        ],
        'etisalat': [
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 5.1.1',
                'network_strength': '50',
                'network_speed': '100',
                'network_level': '5',
                'hour_of_day': '3',
                'network_score': '93'
            },
            {
                'device_type': 'Infinix x507',
                'device_os': 'Android 4.4.2',
                'network_strength': '42',
                'network_speed': '100',
                'network_level': '3',
                'hour_of_day': '5',
                'network_score': '82'
            },
            {
                'device_type': 'Techno Phantom 4',
                'device_os': 'Android 4.0.1',
                'network_strength': '39',
                'network_speed': '100',
                'network_level': '2',
                'hour_of_day': '14',
                'network_score': '93'
            },
            {
                'device_type': 'Asus Nexus 7',
                'device_os': 'Android 4.4.2',
                'network_strength': '51',
                'network_speed': '81',
                'network_level': '4',
                'hour_of_day': '19',
                'network_score': '95'
            }
        ]
    },
    "user_base": {
        "airtel": 13,
        "etisalat": 4,
        "glo": 4,
        "mtn": 5
    }
};



var line_data, polar_data, pie_data, bar_data;
var lineChart, polarChart, pieChart, barChart;

function processData()
{
    console.log(response);
    var keys = Object.keys(response.data);
    console.log(keys);
    for(var i = 0; i < keys.length; i++){
        var provider_data = response.data[keys[i]];
        if (network_speed[keys[i]] == null){
            network_speed[keys[i]] = [];
            network_strength[keys[i]] = [];
        }
        console.log(provider_data.length);
        for (var j = 0; j < provider_data.length; j++){
            network_speed[keys[i]][j] = provider_data[j].network_speed;
            network_strength[keys[i]][j] = provider_data[j].network_strength;
        }
    }

    console.log(network_speed);
    console.log(network_strength);
}

function prepareChartData()
{
    //console.log(network_speed);
    line_data = {
        labels: ["0-2", "3-5", "6-8", "9-11", "12-14", "15-17", "18-20", "21-23"],
        datasets: [
            {
                label: "MTN",
                fillColor: "rgba(255, 204, 0,0.2)",
                strokeColor: "rgba(220,220,120,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: network_speed["mtn"]
            },
            {
                label: "GLO",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(0,255,0,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: network_speed["glo"]
            },
            {
                label: "Airtel",
                fillColor: "rgba(81,167,205,0.2)",
                strokeColor: "rgba(255,0,0,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: network_speed["airtel"]
            },
            {
                label: "Etisalat",
                fillColor: "rgba(81,167,205,0.2)",
                strokeColor: "rgba(100,255,0,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: network_speed["etisalat"]
            }
        ]
    };

    polar_data = [
        {
            value: response.user_base.airtel,
            color:"#FF0000",
            highlight: "#FF0000",
            label: "Airtel"
        },
        {
            value: response.user_base.glo,
            color: "#00FF00",
            highlight: "#00FF00",
            label: "Glo"
        },
        {
            value: response.user_base.mtn,
            color: "#FFC870",
            highlight: "#FFC870",
            label: "MTN"
        },
        {
            value: response.user_base.etisalat,
            color: "#254117",
            highlight: "#254117",
            label: "Etisalat"
        }
    ];

    pie_data = [
        {
            value: response.user_base.airtel,
            color:"#FF0000",
            highlight: "#FF0000",
            label: "Airtel"
        },
        {
            value: response.user_base.glo,
            color: "#00FF00",
            highlight: "#00FF00",
            label: "Glo"
        },
        {
            value: response.user_base.mtn,
            color: "#FFC870",
            highlight: "#FFC870",
            label: "Mtn"
        },
        {
            value: response.user_base.etisalat,
            color: "#254117",
            highlight: "#254117",
            label: "Etisalat"
        }
    ];

    bar_data = {
        labels: ["0-2", "3-5", "6-8", "9-11", "12-14", "15-17", "18-20", "21-23"],
        datasets: [
            {
                label: "MTN",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: network_strength["mtn"]
            },
            {
                label: "GLO",
                fillColor: "rgba(0,255,0,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: network_strength["glo"]
            },
            {
                label: "AIRTEL",
                fillColor: "rgba(255,0,0,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: network_strength["airtel"]
            },
            {
                label: "ETISALAT",
                fillColor: "rgba(100,255,10,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: network_strength["etisalat"]
            }
        ]
    };
}

function initialize(caller)
{
    document.getElementsByTagName('body')[0].style.min_height = '100%';
    globalCaller = caller;
    asyncCaller = new AsyncCaller();
    switch (caller){
        default :
            getUserCurrentLocation();
    }
}

function getUserCurrentLocation(){
    var browserSupportFlag;

    // if the browser supports geo-location
    if(navigator.geolocation) {
        var positionOptions = {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
        };
        navigator.geolocation.getCurrentPosition( onSuccess, onFailure, positionOptions);
    }
    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        onFailure(browserSupportFlag);
    }
}

function onSuccess(position){
    user_location = {lat: position.coords.latitude, lng: position.coords.longitude};
    processData();
    prepareChartData();
    loadData();
    makeCall();
}

function onFailure(errorFlag){
    if (errorFlag == true) {
        console.log("Geo-location service failed.");
    } else {
        console.log("Your browser doesn't support geo-location. We've placed you in Ile-Ife.");
    }
}

function loadData()
{
    var line_ctx = document.getElementById("line-chart").getContext("2d");
    lineChart = new Chart(line_ctx).Line(line_data, {});

    var polar_ctx = document.getElementById("polar-chart").getContext("2d");
    polarChart = new Chart(polar_ctx).PolarArea(polar_data, {});

    var pie_ctx = document.getElementById("pie-chart").getContext("2d");
    pieChart = new Chart(pie_ctx).Pie(pie_data, {});

    var bar_ctx = document.getElementById("bar-chart").getContext("2d");
    barChart = new Chart(bar_ctx).Bar(bar_data, {});
}

function extractResponseObject(caller){
    var response = null;

    if (caller.xhr.readyState == ResponseState.RESPONSE_COMPLETE && caller.xhr.status != 200){
        if (caller.trial_count < 3){
            //console.log(caller);
            caller.prepareRequest(caller.method, caller.url, caller.callBack, caller.wait);
            caller.makeRequest(caller.data, caller.onloadstart, caller.onloadend);
        }
        return response;
    }
    if (caller.xhr.readyState == ResponseState.RESPONSE_COMPLETE && caller.xhr.responseText != null){
        var textResponse = caller.xhr.responseText;
        response = JSON.parse(textResponse);
    }
    return response;
}

function processResponse(caller, callback){
    var responseObject = extractResponseObject(caller);
    if (responseObject){
        caller.responseObj = responseObject;
        callback();
    }
}

function makeCall(){
    var url = URL.statistics + '?latitude=' + user_location.latitude + '&longitude=' + user_location.longitude;
    asyncCaller.prepareRequest(Method.GET, url, function(){processResponse(asyncCaller, refresh)});
    asyncCaller.makeRequest(null);
}

function refresh()
{
    response = asyncCaller.responseObj;
    processData();
    prepareChartData();
    loadData();
}
