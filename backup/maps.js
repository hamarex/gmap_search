google.maps.event.addDomListener(window, 'load', function() {
     var map = document.getElementById("gmap");
         var point = new google.maps.LatLng( 33.53910, 133.56010 );
     var options = {
          zoom: 12,
          center: point,
          mapTypeId: google.maps.MapTypeId.ROADMAP
       };
     var mapObj = new google.maps.Map(map, options);
        var gMarker = [];

/*var markers = [
                ['高知県立美術館','http://www.google.com',33.56104,133.57295],
                ['牧野植物園','http://www.google.com',33.54661,133.57790],
                ['高知城','http://www.google.com',33.56067,133.53147],
                ['桂浜','http://www.google.com',33.497145,133.57480],
                ['高知市文化プラザかるぽーと','http://www.google.com',33.55826,133.54725]
    ];*/
$.ajax({
  url:"http://192.168.33.10/post-ajax.php",
  cache:false,
type: "POST",
data: { place: "kouchi" },
//  dataType:"json",
  success:function(json){
    // 読み込み完了
    var data=$.parseJSON(json);
        dataHits= data.hits.hits;

        createMarkers(dataHits);
        /*$.each(dataHits, function(i){
          console.log(dataHits[i]._source);
        });*/
  }
});


function createMarkers  (data){
        $.each(data, function(i){
          //console.log(data[i]._source);
        var lat = data[i]._source.pin["lat"];
        var lon = data[i]._source.pin["lon"];
        var name = data[i]._source.name;
        var url = data[i]._source.url;
        var destination = data[i]._source.destinaion;
          console.log(data[i]._source.pin["lat"], data[i]._source.pin["lon"]);
        var point = {
                position : new google.maps.LatLng(lat, lon),
                map : mapObj
        };
var marker = new google.maps.Marker(point);


                var infoWindow = new google.maps.InfoWindow();
                var content = '<p><a href="' + url + '" target="_blank">' + name + '</a></p>';
                    content += '<p>' + destination + '<p>';
   google.maps.event.addListener(marker, 'click', function() {


                infoWindow.setContent(content);
                infoWindow.open(mapObj,marker);
        });


//console.log(point);
        });
}
        /*for (var i = 0; i < markers.length; i++) {
                hvar name = markers[i][0];
                var url = markers[i][1];

                var latlng = new google.maps.LatLng(markers[i][2],markers[i][3]);
                createMarker(latlng,name,url,mapObj)

        }*/


        /*function createMarker(latlng,name,url,map){
//              var infoWindow = new google.maps.InfoWindow();

                var content = '<p><a href="' + url + '" target="_blank">' + name + '</a></p>';

                var marker = new google.maps.Marker({position: latlng,map: map});
                google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(content);
                infoWindow.open(map,marker);
        });
};*/

         /*markers[0] = new google.maps.Marker({
                 map: mapObj ,
                 position: point,
         });*/

 });
