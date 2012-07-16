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

	var initExtent = new esri.geometry.Extent({"xmin":-15440190.518952178,"ymin":-4384014.805557845,"xmax":16259773.85146766,"ymax":10174487.34974608,"spatialReference":{"wkid":102100}});

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
		event.graphic.setSymbol(event.graphic.symbol.setHeight(30).setWidth(37).setOffset(10,14));
        $("#hoverInfo").html("").append("<table><tr><td id='speciesName'>" + event.graphic.attributes.COMMON_NAME + "</td><td id='arrowCon' rowspan='2'><button id='closeButton'></button><div id='popupArrow'></div></tr><tr><td id='thumbnailCon'><img id='speciesThmb' src='http://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/250px-Siberischer_tiger_de_edit02.jpg' alt='" + event.graphic.attributes.COMMON_NAME + "'</td></tr></table>");
        positionHoverInfo(event.graphic.geometry);
        $("#closeButton").button({
            icons: {
                primary: "ui-icon-close"
            },
            text: false
        });
        $("#closeButton").click(function(){
            $("#hoverInfo").hide();
            $("#hoverInfoPointer").hide();

        });
	});

	dojo.connect(_points,"onMouseOut",function(event){
		_map.setCursor("default");
		event.graphic.setSymbol(event.graphic.symbol.setHeight(25).setWidth(31).setOffset(8,12));
	});

	dojo.connect(_points,"onClick",function(){
		_map.setCursor("default");
	});

    dojo.connect(_map,"onPan",function(){
    });
};

var addPoints = function(){
	dojo.forEach(_pointData.features,function(ftr){
		var pt = new esri.geometry.Point( {"x": ftr.geometry.x, "y": ftr.geometry.y," spatialReference": {" wkid": 102100 } });

		var attr = ftr.attributes;

		var sym;
		if(attr.class === "MAMMALIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Mammal_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class === "REPTILIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Reptile_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class === "INSECTA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Insect_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class === "CRUSTACEA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Crustacean_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class === "GASTROPODA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Gastropod_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.class === "AMPHIBIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Amphibian_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.kingdom === "PLANTAE"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Plant_icon.png', 31, 25).setOffset(8,12);
		}
		else{
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Fish_icon.png', 31, 25).setOffset(8,12);
		}


		_points.add(new esri.Graphic(pt,sym,attr));

		$("#speciesList").append("<div id='species" + attr.OBJECTID + "' class='speciesItem'>" + attr.COMMON_NAME + "</div>");
		$("#species"+attr.OBJECTID).data("attributes",attr);
        $("#species"+attr.OBJECTID).append("<span class='arrow'></span>");

        $(".speciesItem").click(function(){
            $(".speciesItem").removeClass("selectedItem");
            $(this).addClass("selectedItem");
            $(".arrow").hide();
            $(this).children(".arrow").show();
        });
	});
};

var sortGraphics = function(){
	var arg;
	if ($("#selectedText").html() === "LEAST<br>CONCERN"){
		arg = "LC";
	}
	else if ($("#selectedText").html() === "NEAR<br>THREATENED"){
		arg = "NT";
	}
	else if ($("#selectedText").html() === "VULNERABLE"){
		arg = "VU";
	}
	else if ($("#selectedText").html() === "ENDANGERED"){
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

var positionHoverInfo = function(grp){
    var popupHeight = $("#arrowCon").height();

    $("#hoverInfo").css("left",_map.toScreen(grp).x - 13).css("top",_map.toScreen(grp).y + 17)
    $("#hoverInfoPointer").css("left",_map.toScreen(grp).x-13).css("top",_map.toScreen(grp).y + 2)
    $("#hoverInfo").show();
    $("#hoverInfoPointer").show();
};