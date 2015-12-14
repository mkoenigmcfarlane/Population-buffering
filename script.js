var map = L.map('map-container');

map.setView([44.5, -95], 6);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);

var layer = new L.GeoJSON().addTo(map);
map.on('click', function(e){
	var lnglat = [e.latlng.lng, e.latlng.lat];
    console.log("Lat, Lon : " + lnglat[0] + ", " + lnglat[1])
    sendQuery(lnglat).done(function(data){
    		layer.clearLayers();
    		layer.addData(data.features);
    	}); 
    });
     


function sendQuery(lnglat){
    return $.get("https://koeni129.cartodb.com/api/v2/sql?q=WITH op as (SELECT the_geom, cartodb_id, dp0010001, the_geom_webmercator, 	Row_number() OVER (ORDER BY Cdb_latlng(" + lnglat[1] + ", " + lnglat[0] + ") <-> the_geom) AS row_number FROM 	census_projected_1), sm AS (SELECT the_geom, cartodb_id, dp0010001, the_geom_webmercator, Sum(dp0010001) OVER (ORDER BY 	row_number ASC) AS running_total FROM op) SELECT st_union(the_geom) as the_geom FROM sm WHERE running_total < 1000000&format=geojson");
};
