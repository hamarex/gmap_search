//for create 1st map
var latlng = new google.maps.LatLng(33.49,133.51);
var options = {
	zoom: 12,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
var mapObj = new google.maps.Map(document.getElementById('gmap'), options);
//marker格納用配列
var globalMarkers = [];
//infoWindow格納用変数
var currentWindow;
//polyline描画用フラグ
var isDrowMode = false;
//ドラッグ判定用フラグ
var isMouseDown = false;
//drawer用変数の定義
var elem = {
		sideDrawer : '#sideDrawer',
		infoArea : '#markerInfo',
		infoBox : '#infomationBox',
		openCls : 'open'
	};

//for polyline
var poly;
var polyarr = new Array();
var position = new Array();
var globalPolyLines = [];
var polyLineOptions = {
	path: null,
	strokeWeight:5 ,
	strokeColor: "#0000ff",
	strokeOpacity: "0.5"
};

//for polygon
var polygonOptions = {
	path: null,
	strokeWeight: 5,
	strokeColor: "#0000ff",
	strokeOpacity: 0,
	fillColor: "#008000",
	fillOpacity: 0.5
};
var points = new Array();

//for create 2nd map
var mapObj2;

var stack ="";
var polygon;

//描画モード切替
$('#toggle').on('click', function () {
	if (!isDrowMode) {
		isDrowMode = true;
		mapObj.setOptions({draggable: false});
	} else if (isDrowMode) {
		isDrowMode = false;
		mapObj.setOptions({draggable: true});
	}
	console.log('描画モード' + isDrowMode);
});

//ドラッグ判定
$('#gmap').on({
	'mousedown': function(e){
		if (!isMouseDown) {
			isMouseDown = true;
		}
	},
	'mouseup': function(e){
		if (isMouseDown) {
			isMouseDown = false;
		}
	}

});

//検索内容クリア
$('#clear').on('click', function () {
	deleteLine();
});

//sideDrawer関連
$('#sideDrawer').on('click', '.toggle', function () {
	if ($('#sideDrawer').hasClass(elem.openCls)) {
		$('#sideDrawer').removeClass(elem.openCls);
	} else {
		$('#sideDrawer').addClass(elem.openCls);
	}
});

var $scrolllock = $('#scrollLock');
$scrolllock.on('click' , function(){
  $(window).on('touchmove.noScroll',function(e){
    e.preventDefault();
  })
})

var $scrolloff = $('#scrolloff');
$scrolloff.on('click' , function(){
  $(window).off('.noScroll');
})

//非同期で検索実行
$('#ajax-button').on('click', function () {
	if (isDrowMode) {
		isDrowMode = false;
		mapObj.setOptions({draggable: true});
	}
	console.log('描画モード' + isDrowMode);

	var price = $('#price').val();
	stack = points.join(',');
	$.ajax({
		//url:"http://192.168.1.244/geo-test.php",
		url:"../geo-yamazaki.php",
		cache:false,
		type:"POST",
		data: {points : stack , price : price},
		traditional: true,
		success: function(json){
			var data=$.parseJSON(json);
			dataHits= data.hits.hits;
			//createMap();
			createpolygon();
			createMarkers(dataHits);
		},
		error: function(json){
			alert("ng");
		}
	});
});

//検索範囲指定
google.maps.event.addListener(mapObj,'mousemove',function(e){
	if (isDrowMode && isMouseDown) {
		console.log('描画中');
		position.push(e.latLng);

		//緯度経度をそれぞれ格納
		var lat_c=e.latLng.lat();
		var lng_c=e.latLng.lng();
		//緯度経度を入れ替えて格納するための変数
		var tmparr;

		polyarr.push(new google.maps.LatLng(lat_c,lng_c));

		//lat , lng 入れ替え -> lng,latにする。
		tmparr = new google.maps.LatLng(lat_c,lng_c);
		tmparr = String(tmparr).replace(/\((.*),(.*)\)/, "($2,$1)");
		points.push(tmparr);

		//　配列パターン
		//  stack.push( points[i]);
		//  i++;

		//　文字列パターン
		/*for(var i = 0 ; i < points.length ;i++){
			stack = stack + points[i];
		}*/

		if(position.length > 2){
			position.shift();
		}

		if(position.length > 1){
			polyLineOptions.path = position;
			poly = new google.maps.Polyline(polyLineOptions);
			poly.setMap(mapObj);
			globalPolyLines.push(poly);
		}

	}

})



function createMap(){
	$(function (){
		$("#gmap").empty();
		mapcreate();
  	})
};

function createpolygon(){
	polygonOptions.path = polyarr;
	polygon = new google.maps.Polygon(polygonOptions);
    polygon.setMap(mapObj);
}



function mapcreate(){
var latlng = new google.maps.LatLng(33.49,133.51);
var options = {
	zoom: 12,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};

mapObj2 = new google.maps.Map(document.getElementById('gmap'), options);
}


function createMarkers(data){
	//既存のマーカーを削除
	if (globalMarkers.length > 1) {
		for (var i = 0 ; i < globalMarkers.length ; i++) {
			globalMarkers[i].setMap(null);
		}
	}
	$.each(data, function(i){
		var lat = data[i]._source.pin["lat"];
		var lon = data[i]._source.pin["lon"];
		var name = data[i]._source.name;
		var url = data[i]._source.url;
		var destination = data[i]._source.destinaion;
		console.log(data[i]._source.pin["lat"],data[i]._source.pin["lon"]);

		var point= {
			position : new google.maps.LatLng(lat, lon),
			map : mapObj
		};

		var marker = new google.maps.Marker(point);

		//globalMarkers
		globalMarkers.push(marker);

		google.maps.event.addListener(marker, 'click', function() {
			if (currentWindow) {
				currentWindow.close();
			}

			//currentWindow = new google.maps.InfoWindow();
		/*	currentWindow = new InfoBox();
			var content = '';

			content += '<h3><a href="' + url + '" target="_blank">' + name + '</a></h3>';
			content += '<p class="discription">' + destination + '<p>';
*/
			var	content2 = '';
			content2 += '<h3>' + name + '</h3>';
			content2 += '<p class="discription">' + destination + '<p>';
			content2 += '<div class="button"><a href="' + url + '" target="_blank" class="btn-01">見に行く</a></div>';

	/*		currentWindow.setContent(content);
			currentWindow.open(mapObj,marker);
   */
			if (!$(elem.sideDrawer).hasClass(elem.openCls)) {
				$(elem.sideDrawer).addClass(elem.openCls);
			}
			$(elem.infoBox).html(content2);

		});
	});
}


//文字列パターン
function Output(){
	//for (var i = 0; i < stack.length; i ++) {
		//document.getElementById('outputarea').value = document.getElementById('outputarea').value + stack[i] + "\n";
	//}
  stack=points.join(',');
	document.getElementById('outputarea').value = document.getElementById('outputarea').value + stack + "\n";
}


//配列パターン
//function Output(){
	//for (var i = 0; i < stack.length; i ++) {
		//document.getElementById('outputarea').value = document.getElementById('outputarea').value + stack[i] + "\n";
	//}
//}


function moveMap(){
	var geocoder= new google.maps.Geocoder();
	geocoder.geocode({
		'address': document.getElementById('address').value
	}, function(result,status){
		if (status == google.maps.GeocoderStatus.OK){
		mapObj.panTo(result[0].geometry.location);
		}else {
		alert("ERR");
		}
	});
}

function deleteLine() {
	//polylineの削除
	if (globalPolyLines.length >= 1) {
		for (var i = 0 ; i < globalPolyLines.length ; i++) {
			globalPolyLines[i].setMap(null);
		}
	}
	//markerの削除
	if (globalMarkers.length >= 1) {
		for (var i = 0 ; i < globalMarkers.length ; i++) {
			globalMarkers[i].setMap(null);
		}
	}
	polygon.setMap(null);
	stack="";
	points.length = 0;
	globalPolyLines.length =0;
	position.length =0;
	polyarr.length =0;
}
