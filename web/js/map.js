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


var MAP_CALLERS = {
    map: 1,
    leverage_power: 2,
    leverage_transmission: 3,
    leverage_livelihood: 4
};

var MAP_FILTERS = {
    data: 1,
    cell_phone: 2,
    network_provider: 3
};

//var src = 'https://developers.google.com/maps/tutorials/kml/westcampus.kml';
var src = 'http://netfind.gigalayer.com/web/uploads/transmit.kml';
//var src = 'http://netfind.gigalayer.com/web/uploads/livelihood.kml';
//var src = 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml';

var KML_SRC_BASE = "http://netfind.gigalayer.com/web/uploads/";
var kml = {
    livelihood: "livelihood",
    power: "power",
    transmit: "transmit"
};

var kmlHandlerArr = [];
var googleMap, eventCallbacks, mapMarker, mapInitiator, overlayDrawer;
var asyncCaller, reportsAsyncCaller;
var asyncPoster;
var globalMapCaller;
var markerArr = [];
var mapCircles = [];
var markerColors = {
    "mtn": {
        "fill": "FFD8O1",
        "stroke": "FFD8O1"
    },
    "glo": {
        "fill": "00FF00",
        "stroke": "00FF00"
    },
    'airtel': {
        "fill": "F70D1A",
        "stroke": "F70D1A"
    },
    "etisalat": {
        "fill": "669900",
        "stroke": "669900"
    }
};
// An object to keep the list of all known locations
var KnownLocations = {
    defaultLocation : {lat: 7.5183, lng: 4.5228}
};

var API_KEY = 'AIzaSyB0w4PrkNDWicsd713JLPfcQDlBGJqOP-E';

var BASE_URL = {
    local: "http://localhost/netfinder/web/api/1",
    prod: "http://netfind.gigalayer.com/web/api/1"
};
var URL = {
    data: BASE_URL.local + '/provider'
};

var data = [];
var data_by_network_provider = [];
var cell_phone_coverage_signal = [];
//var cell_phone_coverage_by_provider = [];

var dummyNetworkData = {
    "data": [
        {
            "network_name": "MTN",
            "network_id": "1",
            "network_strength": "20",
            "network_level": "5",
            "device_type": "Nexus 7",
            "device_os": "Android 5.1.1",
            "lat": "8.123",
            "lng": "6.984",
            "data_type": "cell-phone",
            "time": "2015-09-18 15:09:38"
        },
        {
            "network_name": "GLO",
            "network_id": "2",
            "network_strength": "15",
            "network_level": "4",
            "device_type": "Nexus 7",
            "device_os": "Android 5.1.1",
            "lat": "7.123",
            "lng": "5.984",
            "data_type": "data",
            "time": "2015-09-18 15:09:38"
        },
        {
            "network_name": "AIRTEL",
            "network_id": "3",
            "network_strength": "35",
            "network_level": "5",
            "device_type": "HTC",
            "device_os": "Android 4.4.4",
            "lat": "8.123",
            "lng": "4.984",
            "data_type": "cell-phone",
            "time": "2015-09-18 15:09:38"
        }
    ]
};

var MapProperties = function(canvasDivId, mapOptions){
    this.mapCanvas = document.getElementById('map-canvas');
    this.mapOptions = mapOptions;
};

var MapInitiator = function(mapCaller){

    var mapOptions = {
        center: new google.maps.LatLng(KnownLocations.defaultLocation.lat, KnownLocations.defaultLocation.lng),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.mapCaller = mapCaller;
    this.mapProperties = new MapProperties('map-canvas', mapOptions);
    googleMap = new google.maps.Map(this.mapProperties.mapCanvas, this.mapProperties.mapOptions);
};

MapInitiator.prototype.centerOnUser = function(position){
    KnownLocations.userCurrLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    googleMap.setCenter(new google.maps.LatLng(KnownLocations.userCurrLocation.lat, KnownLocations.userCurrLocation.lng));

    switch (globalMapCaller) {
        case MAP_CALLERS.leverage_crime:
            kmlHandler = new KmlHandler();
            kmlHandler.loadKmlLayer(KML_SRC_BASE + kml);
            break;
        default:
            makeDataCall();
            break;
    }
    var kmlHandler = new KmlHandler();
    kmlHandler.loadKmlLayer(src);
    //mapInitiator.visualize();

};

MapInitiator.prototype.handleNoGeolocation = function(errorFlag) {
    if (errorFlag == true) {
        console.log("Geo-location service failed.");
    } else {
        console.log("Your browser doesn't support geo-location. We've placed you in Ile-Ife.");
    }

};

MapInitiator.prototype.getUserCurrLocation = function(successFunction, failureFunction){
    var browserSupportFlag;

    // if the browser supports geo-location
    if(navigator.geolocation) {
        var positionOptions = {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
        };
        navigator.geolocation.getCurrentPosition( successFunction, failureFunction, positionOptions);
    }
    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        failureFunction(browserSupportFlag);
    }
};

MapInitiator.prototype.initialize = function(){
    this.getUserCurrLocation(this.centerOnUser, this.handleNoGeolocation);
    //this.visualize();
};

MapInitiator.prototype.visualize = function(){
    switch (globalMapCaller){
        case MAP_CALLERS.leverage_crime:
            var kmlHandler = new KmlHandler();
            kmlHandler.loadKmlLayer(KML_SRC_BASE + kml.power);
            break;
        default :
            var markerArr = [];
            data = asyncCaller.responseObj.data;
            filterData(data);

            //console.log(asyncCaller);
            //console.log(data);
            //drawMarkersFromArray(data);

            var categorizedData = {};
            var distance = 0, factor = 0;
            var lat = 0;
            var lng = 0;
            var lat_diff = 0;
            var lng_diff = 0;
            for (var i = 0; i < data.length; i++){
                lat_diff = data[i]['lat'] - lat;
                lng_diff = data[i]['lng'] - lng;
                distance = Math.sqrt((lat_diff*lat_diff) + (lng_diff*lng_diff));
                factor = parseInt(distance * 2);
                if (categorizedData[factor] == null){
                    categorizedData[factor] = {
                        'points': [],
                        'aggregate': {
                            'network_speed': 0,
                            'network_strength': 0,
                            'network_level': 0,
                            'network_provider': data[i].network_provider,
                            'lat': 0,
                            'lng': 0
                        }
                    };
                }
                categorizedData[factor]['points'].push(data[i]);
                categorizedData[factor]['aggregate']['network_speed'] += data[i].network_speed;
                categorizedData[factor]['aggregate']['lat'] += data[i].lat;
                categorizedData[factor]['aggregate']['lng'] += data[i].lng;
                categorizedData[factor]['aggregate']['network_strength'] += data[i].network_strength;
                categorizedData[factor]['aggregate']['network_level'] += data[i].network_level;
            }

            console.log(categorizedData);
            drawCirclesFromArray(categorizedData);
    }
};

function drawMarkersFromArray(data){
    var sum_lat = 0;
    var sum_lng = 0;
    for (var i = 0; i < data.length; i++){
        mapMarker = new MapMarker();
        var location = {lat: data[i]['lat'], lng: data[i]['lng']};
        sum_lat += data[i]['lat'];
        sum_lng += data[i]['lng'];
        mapMarker.setStyleSimple(location, data[i]['network_provider']);
        mapMarker.setLabel(data[i]['network_provider'][0]);
        var pinColor = markerColors[(data[i]['network_provider'].toLowerCase())].fill;
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
        //mapMarker.setIcon("http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png");
        mapMarker.setIcon(pinImage);
        mapMarker.land();
        //mapMarker.marker.setAnimation(google.maps.Animation.BOUNCE);
        mapMarker.createMarker(googleMap);
        markerArr.push(mapMarker);
    }

    googleMap.setCenter(new google.maps.LatLng(sum_lat/data.length, sum_lng/data.length));
}

function drawCirclesFromArray(data)
{
    var lat_sum = 0;
    var lng_sum = 0;
    var overlayDrawer = new OverlayDrawer();
    var count = 1;
    var keys = Object.keys(data);
    for(var j = 0; j < keys.length; j++){
        count = (data[keys[j]].points.length == 0) ? 1 : data[keys[j]].points.length;
        overlayDrawer.setFillColor('#' + markerColors[data[keys[j]].aggregate.network_provider].fill);
        var lat = data[keys[j]].aggregate.lat / count;
        var lng = data[keys[j]].aggregate.lng / count;

        overlayDrawer.setCenter({lat: lat, lng: lng});
        lat_sum += (data[keys[j]].aggregate.lat / count);
        lng_sum += (data[keys[j]].aggregate.lng / count);

        overlayDrawer.setFillOpacity();
        overlayDrawer.setRadius(10000);
        overlayDrawer.setStrokeColor(markerColors[data[keys[j]].aggregate.network_provider].stroke);
        overlayDrawer.setStrokeOpacity();
        //overlayDrawer.setStrokeWeight(data[keys[j]].aggregate.network_strength / count);
        //overlayDrawer.setCirclePopulationOption();
        overlayDrawer.drawCircle();
        console.log(overlayDrawer.circle);

        var marker = new MapMarker();
        marker.setStyleSimple({lat: lat, lng: lng}, data[keys[j]].aggregate.network_provider);
        marker.setLabel(data[keys[j]].aggregate.network_provider[0]);
        marker.setIcon("http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png");
        marker.land();
        marker.createMarker(googleMap);
    }

    googleMap.setCenter(new google.maps.LatLng(lat_sum/keys.length, lng_sum/keys.length));
}

function clearCircles(circles){
    for(var i = 0; i < circles.length; i++)
    {
        circles[i].map = null;
    }
}
function clearMarkers(markerArr)
{
    for(var i = 0; i < markerArr.length; i++){
        markerArr[i].map = null;
    }
}

function filterData(data)
{
    for(var i = 0; i < data.length; i++){
        if (data.data_type == "data")
        {
            data_by_network_provider.push(data[i]);
        }
        else{
            cell_phone_coverage_signal.push(data[i]);
        }
    }
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

function makeDataCall()
{
    asyncCaller.prepareRequest(Method.GET, URL.data, eventCallbacks.parseData);
    asyncCaller.makeRequest(null);

}

var EventCallBacks = function(){
};

EventCallBacks.prototype.filterMap = function(filter_id)
{
    clearMarkers(markerArr);
    switch (filter_id){
        case MAP_FILTERS.data:
            drawMarkersFromArray(data);
            break;
        case MAP_FILTERS.cell_phone:
            drawMarkersFromArray(cell_phone_coverage_signal);
            break;
        case MAP_FILTERS.network_provider:
            drawMarkersFromArray(data_by_network_provider);
            break;
        default :

    }
};

EventCallBacks.prototype.parseData = function(){
    processResponse(asyncCaller, function(){mapInitiator.visualize();});
};

var OverlayDrawer = function(){
    this.populationOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: googleMap,
        center: {lat: KnownLocations.userCurrLocation.lat, lng: KnownLocations.userCurrLocation.lng},
        radius: 50000
    }
};

OverlayDrawer.prototype.setStrokeOpacity = function(opacity){
    this.populationOptions.strokeOpacity = (opacity != null) ? opacity : 0.8;
};

OverlayDrawer.prototype.setStrokeColor = function(color){
    this.populationOptions.strokeColor = (color != null) ? color : '#FF0000';
};

OverlayDrawer.prototype.setStrokeWeight = function(weight){
    this.populationOptions.strokeWeight = (weight != null) ? weight : 2;
};

OverlayDrawer.prototype.setFillColor = function(color){
    this.populationOptions.fillColor = (color != null) ? color : '#FF0000';
};

OverlayDrawer.prototype.setFillOpacity = function(opacity){
    this.populationOptions.fillOpacity = (opacity != null) ? opacity : 0.35;
};

OverlayDrawer.prototype.setCenter = function(center){
    this.populationOptions.center = (center != null) ? center : {lat: KnownLocations.userCurrLocation.lat, lng: KnownLocations.userCurrLocation.lng};
};

OverlayDrawer.prototype.setRadius = function(radius){
    this.populationOptions.radius = (radius != null) ? radius : 500;
};

OverlayDrawer.prototype.setCirclePopulationOption = function(){
    this.populationOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: googleMap,
        center: {lat: KnownLocations.userCurrLocation.lat, lng: KnownLocations.userCurrLocation.lng},
        radius: 500
    }
};

OverlayDrawer.prototype.drawCircle = function(){
    this.circle = new google.maps.Circle(this.populationOptions);
};

// TODO: Create a MapMarker Class; functions: [makeMarker, saveWidget, setMakerContent]
var MapMarker = function(){

};

MapMarker.prototype.setStyleSimple = function(position, title){
    this.style = {
        position: new google.maps.LatLng(position.lat, position.lng),
        title: title
    };
};

MapMarker.prototype.land = function(){
    this.style.draggable = false;
    this.animation = google.maps.Animation.BOUNCE;
};

MapMarker.prototype.setIcon = function(imageUrl){
    this.style.icon = imageUrl;
};

MapMarker.prototype.setLabel = function(label){
    this.style.label = label;
};

MapMarker.prototype.createMarker = function(map){
    this.marker = new google.maps.Marker(this.style);
    this.marker.setMap(map);
};

var KmlHandler = function(){

};

/**
 * Adds a KMLLayer based on the URL passed. Clicking on a marker
 * results in the balloon content being loaded into the right-hand div.
 * @param {string} src A URL for a KML file.
 */
KmlHandler.prototype.loadKmlLayer = function(src) {
    var kmlLayer = new google.maps.KmlLayer(src, {
        suppressInfoWindows: false,
        preserveViewport: false,
        map: googleMap
    });
    google.maps.event.addListener(kmlLayer, 'click', function(event) {
        var content = event.featureData.infoWindowHtml;
        var testimonial = document.getElementById('capture');
        testimonial.innerHTML = content;
    });
};

function initialize(mapCaller){
    console.log("Map initialization");
    globalMapCaller = mapCaller;
    mapInitiator = new MapInitiator(mapCaller);
    mapInitiator.initialize();
    eventCallbacks = new EventCallBacks();
    asyncCaller = new AsyncCaller();
    document.getElementById('map-canvas').style.height = '500px';

    if (mapCaller == MAP_CALLERS.map){
        var filter1 = document.getElementById('filter1');
        filter1.onchange = function(){
            if (filter1.value == 1){
                eventCallbacks.filterMap(MAP_FILTERS.network_provider);
            }
            else if(filter1.value == 2){
                eventCallbacks.filterMap(MAP_FILTERS.data)
            }
        };
        var filter2 = document.getElementById('filter2');
        filter2.onchange = function(){
            if (filter2.value == 1){
                eventCallbacks.filterMap(MAP_FILTERS.cell_phone)
            }
            else{
                eventCallbacks.filterMap(MAP_FILTERS.data)
            }
        };
    }
    else if (mapCaller == MAP_CALLERS.leverage_crime){

    }
    else if (mapCaller == MAP_CALLERS.leverage_market){

    }

}

function prepareMap(){
    google.maps.event.addDomListener(window, 'load', initialize);
}
