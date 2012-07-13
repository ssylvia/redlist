dojo.require("esri.map");
dojo.require("esri.arcgis.utils");
dojo.require('esri.arcgis.Portal');
dojo.require("esri.IdentityManager");
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

var _map,
	_points,
	_selPos;

var initMap = function(){
	
	var initExtent = new esri.geometry.Extent({"xmin":-18843867.70908305,"ymin":-13267022.125398085,"xmax":19509175.60327705,"ymax":15223810.049497988,"spatialReference":{"wkid":102100}});
	
	_map = new esri.Map("map",{
		extent:initExtent,
		wrapAround180:true
	});
	
	var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer");
	_map.addLayer(basemap);
	
	_points = new esri.layers.GraphicsLayer();
	_map.addLayer(_points);
	
	addPoints();
	
	dojo.forEach(_points.graphics,function(g){
		if(g.attributes.rlcategory !== "VU"){
			g.hide();
		}
	});
	
	dojo.connect(_map, 'onLoad', function(theMap) {
		//resize the map when the browser resizes
		dojo.connect(dijit.byId('map'), 'resize', _map,_map.resize);
	});
	
	dojo.connect(_points,"onMouseOver",function(event){
		_map.setCursor("pointer");
		event.graphic.setSymbol(event.graphic.symbol.setHeight(30).setWidth(37).setOffset(9,14));
	});
	
	dojo.connect(_points,"onMouseOut",function(){
		_map.setCursor("default");
		event.graphic.setSymbol(event.graphic.symbol.setHeight(25).setWidth(31).setOffset(8,12));
	});
	
	dojo.connect(_points,"onClick",function(){
		_map.setCursor("default");
		alert(event.graphic.attributes.rlcategory);
	});
};

var addPoints = function(){
	dojo.forEach(_pointData.features,function(ftr,i){
		var pt = new esri.geometry.Point( {"x": ftr.geometry.x, "y": ftr.geometry.y," spatialReference": {" wkid": 102100 } });
		
		var attr = ftr.attributes;
		
		var sym;
		if(attr.class == "MAMMALIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Mammal_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class == "REPTILIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Reptile_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class == "INSECTA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Insect_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class == "CRUSTACEA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Crustacean_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class == "GASTROPODA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Gastropod_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class == "AMPHIBIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Amphibian_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.kingdom == "PLANTAE"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Plant_icon.png', 31, 25).setOffset(8,12);
		}
		else{
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Fish_icon.png', 31, 25).setOffset(8,12);
		}
		
		
		_points.add(new esri.Graphic(pt,sym,attr));
		
		$("#speciesList").append("<div id='species" + i + "' class='speciesItem'>" + attr.COMMON_NAME + "</div>");
		$("#species"+i).data("attributes",attr);
	});
};

var sortGraphics = function(){
	var arg;
	if ($("#selectedText").html() == "LEAST<br>CONCERN"){
		arg = "LC";
	}
	else if ($("#selectedText").html() == "NEAR<br>THREATENED"){
		arg = "NT";
	}
	else if ($("#selectedText").html() == "VULNERABLE"){
		arg = "VU";
	}
	else if ($("#selectedText").html() == "ENDANGERED"){
		arg = "EN";
	}
	else{
		arg = "CR";
	}
	dojo.forEach(_points.graphics,function(g){
		g.show();
		if(g.attributes.rlcategory !== arg){
			g.hide();
		}
	});
};