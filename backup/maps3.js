// 初回のgoogleMAPを生成
var latlng = new google.maps.LatLng(33.49,133.51);
var options = {
    zoom: 11,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggable:false
    };

var mapObj = new google.maps.Map(document.getElementById('gmap'), options);

//polyLineOptionsを設定する
var polyLineOptions = {
    path: null,
    strokeWeight:5 ,
    strokeColor: "#0000ff",
    strokeOpacity: "0.5"
    };

//polygonOptionsを設定する
var polygonOptions = {
    path: null,
    strokeWeight: 5,
    strokeColor: "#0000ff",
    strokeOpacity: 0.5,
    fillColor: "#008000",
    fillOpacity: 0.5
    };

//検索描画後のpolygonを表示するオブジェクトの宣言
var mapObj2;

//各種オブジェクトの宣言
var position = new Array();

var points = new Array();
//var stack =new Array();
var stack ="";
var i=0;
var poly;
var polygon;
var polyarr = new Array();

// Polyline を描画する
google.maps.event.addListener(mapObj,'mousemove',function(e){
    position.push(e.latLng);

    var lat_c=e.latLng.lat();
    var lng_c=e.latLng.lng();

    polyarr.push(new google.maps.LatLng(lat_c,lng_c));

    //lat , lng 入れ替え -> lng,latにする。
    var tmparr;
    tmparr = new google.maps.LatLng(lat_c,lng_c);
    tmparr = String(tmparr).replace(/\((.*),(.*)\)/, "($2,$1)");
    points.push(tmparr);

    //　配列パターン
    //  stack.push( points[i]);
    //  i++;

    //　文字列パターン
    for(i ; i < points.length ;i++){
      stack = stack + points[i];
    }

　　//配列を2個になるように調整する。
    if(position.length > 2){
      position.shift();
    }

　　//配列が2個以上の場合はpolylineをmapObjに描画する。
    if(position.length > 1){
      polyLineOptions.path = position;
      poly = new google.maps.Polyline(polyLineOptions);
      poly.setMap(mapObj);
    }

})


$(function(){
  $('#ajax-button').click(
    function(){
      var price = $('#price').val();
      $.ajax({
        url:"../geo-test.php",
        cache:false,
        type:"POST",
        data: {points : stack , price : price},
        traditional: true,
        success: function(json){
          var data=$.parseJSON(json);
          dataHits= data.hits.hits;
          createMap();
          createpolygon();
          createMarkers(dataHits);
        },
        error: function(json){
          alert("ng");
        }
      });
    }
  );
});

function createMap(){
  $(function (){
    $("#gmap").empty();
    mapcreate();
  })
};

function createpolygon(){
  polygonOptions.path = polyarr;
  polygon = new google.maps.Polygon(polygonOptions);
  polygon.setMap(mapObj2);
}

function mapcreate(){
  var latlng = new google.maps.LatLng(33.49,133.51);
  var options = {
    zoom: 11,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  mapObj2 = new google.maps.Map(document.getElementById('gmap'), options);
}

function createMarkers(data){
  $.each(data, function(i){
    var lat = data[i]._source.pin["lat"];
    var lon = data[i]._source.pin["lon"];
    var name = data[i]._source.name;
    var url = data[i]._source.url;
    var destination = data[i]._source.destinaion;
    console.log(data[i]._source.pin["lat"],data[i]._source.pin["lon"]);

    var point= {
      position : new google.maps.LatLng(lat, lon),
      map : mapObj2
    };

    var marker = new google.maps.Marker(point);

    var infoWindow = new google.maps.InfoWindow();
    var content = '<p><a href="' + url + '" target="_blank">' + name + '</a></p>';
    content += '<p>' + destination + '<p>';
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(content);
      infoWindow.open(mapObj2,marker);
    });
  });
}

//文字列パターン
function Output(){
  //for (var i = 0; i < stack.length; i ++) {
  //document.getElementById('outputarea').value = document.getElementById('outputarea').value + stack[i] + "\n";
  //}
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
  },
  function(result,status){
    if (status == google.maps.GeocoderStatus.OK){
      mapObj.panTo(result[0].geometry.location);
    }else {
      alert("ERR");
    }
  });
}

function deleteLine(){
  poly.setMap(null);
  stack="";
  points.length = 0;
  position.length =0;
}

/*
$('#toggle').on('click',function(){
  $('html').css({
    position:'fixed' ,
    top:$(window).scrollTop()*-1
  });

})
*/

var $scrolllock = $('#toggle');
$scrolllock.on('click' , function(){
  $(window).on('touchmove.noScroll',function(e){
    e.preventDefault();
  })
})

var $scrolloff = $('#scrolloff');
$scrolloff.on('click' , function(){
  $(window).off('.noScroll');
})
