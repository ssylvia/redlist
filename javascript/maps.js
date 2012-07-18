dojo.require("esri.map");
dojo.require("esri.arcgis.utils");
dojo.require('esri.arcgis.Portal');
dojo.require("esri.IdentityManager");
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.layers.FeatureLayer");

var _map,
	_points,
	_selPos;

var initMap = function(){

	var initExtent = new esri.geometry.Extent({"xmin":-15440190.518952178,"ymin":-4384014.805557845,"xmax":16259773.85146766,"ymax":10174487.34974608,"spatialReference":{"wkid":102100}});

	_map = new esri.Map("map",{
		extent:initExtent,
		wrapAround180:false
	});

	var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer");
	_map.addLayer(basemap);

	_points = new esri.layers.GraphicsLayer();
	_map.addLayer(_points);

	addPoints();

	dojo.forEach(_points.graphics,function(g){
		if(g.attributes.RLcategory !== "VU"){
			g.hide();
		}
	});

	dojo.connect(_map, 'onLoad', function(theMap) {
		//resize the map when the browser resizes
		dojo.connect(dijit.byId('map'), 'resize', _map,_map.resize);
	});

	dojo.connect(_points,"onMouseOver",function(event){
		_map.setCursor("pointer");
        $("#closeButton").remove();
		event.graphic.setSymbol(event.graphic.symbol.setHeight(30).setWidth(37).setOffset(10,14));
        $("#hoverInfo").html("").append("<table><tr><td id='speciesName'>" + event.graphic.attributes.Common_name + "</td><td id='arrowCon' rowspan='2'><div id='popupArrow'></div></tr><tr><td id='thumbnailCon'><img id='speciesThmb' src='images/thumbs/" + event.graphic.attributes.Thumb_URL + "' alt='" + event.graphic.attributes.Common_name + "'</td></tr></table>").data("attr",event.graphic.attributes);
        positionHoverInfo(event.graphic.geometry);
        $(".speciesItem").each(function(){
            if($(this).data("attributes") === event.graphic.attributes){
                $(this).addClass("selectedItem");
                $(this).children(".arrow").show();
            }
            else{
                $(this).removeClass("selectedItem");
                $(this).children(".arrow").hide();
            }
        });
	});

	dojo.connect(_points,"onMouseOut",function(event){
		_map.setCursor("default");
		event.graphic.setSymbol(event.graphic.symbol.setHeight(25).setWidth(31).setOffset(8,12));
        hidePopup();
	});

	dojo.connect(_points,"onClick",function(){
        openPopout(event.graphic.attributes);
	});

    dojo.connect(_map,"onPan",function(){
    });
};

var addPoints = function(){
	dojo.forEach(_pointData.features,function(ftr){
		var pt = new esri.geometry.Point( {"x": ftr.geometry.x, "y": ftr.geometry.y," spatialReference": {" wkid": 102100 } });

		var attr = ftr.attributes;

		var sym;
		if(attr.Class === "MAMMALIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Mammal_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Class === "REPTILIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Reptile_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Class === "INSECTA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Insect_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Class === "CRUSTACEA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Crustacean_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Class === "GASTROPODA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Gastropod_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Class === "AMPHIBIA"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Amphibian_icon.png', 31, 25).setOffset(8,12);
		}
		else if(attr.Kingdom === "PLANTAE"){
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Plant_icon.png', 31, 25).setOffset(8,12);
		}
		else{
			sym = new esri.symbol.PictureMarkerSymbol('images/icons/Fish_icon.png', 31, 25).setOffset(8,12);
		}


		_points.add(new esri.Graphic(pt,sym,attr));

        $("body").append("<img id='img"+attr.OBJECTID+"' src='images/thumbs/"+attr.Thumb_URL+"' alt=''>");
        $("#img"+attr.OBJECTID).load(function(){
            $("#img"+attr.OBJECTID).remove();
        });

		$("#speciesList").append("<div id='species" + attr.OBJECTID + "' class='speciesItem'>" + attr.Common_name + "</div>");
		$("#species"+attr.OBJECTID).data("attributes",attr);
        $("#species"+attr.OBJECTID).data("geo",pt);
        $("#species"+attr.OBJECTID).append("<span class='arrow'></span>");
	});

    $(".speciesItem").mouseover(function(){
        $(".speciesItem").removeClass("selectedItem");
        $(this).addClass("selectedItem");
        $(".arrow").hide();
        $(this).children(".arrow").show();
        $("#hoverInfo").html("").append("<table><tr><td id='speciesName'>" + $(this).data("attributes").Common_name + "</td><td id='arrowCon' rowspan='2'><div id='popupArrow'></div></tr><tr><td id='thumbnailCon'><img id='speciesThmb' src='images/thumbs/" + $(this).data("attributes").Thumb_URL + "' alt='" + $(this).data("attributes").Common_name + "'</td></tr></table>").data("attr",$(this).data("attributes"));
        positionHoverInfo($(this).data("geo"));
    });

    $("#speciesList").mouseleave(function(){
        hidePopup();
    });

    $(".speciesItem").click(function(){
        openPopout($(this).data("attributes"));
    });

    $(".speciesItem").each(function(){
        if($(this).data("attributes").RLcategory !== "VU"){
            $(this).hide();
        }
        else{
            $(this).show();
        }
    });
};

var sortGraphics = function(){
	var arg;
	if ($("#selectedText").html() === "LEAST<br>CONCERN"){
		arg = "LC";
        $("#speciesHeader").html("LEAST CONCERN SPECIES");
	}
	else if ($("#selectedText").html() === "NEAR<br>THREATENED"){
		arg = "NT";
        $("#speciesHeader").html("NEAR THREATENED SPECIES");
	}
	else if ($("#selectedText").html() === "VULNERABLE"){
		arg = "VU";
        $("#speciesHeader").html("VULNERABLE SPECIES");
	}
	else if ($("#selectedText").html() === "ENDANGERED"){
		arg = "EN";
        $("#speciesHeader").html("ENDANGERED SPECIES");
	}
	else{
		arg = "CR";
        $("#speciesHeader").html("CRITICALLY ENDANGERED SPECIES");
	}
	dojo.forEach(_points.graphics,function(g){
		g.show();
		if(g.attributes.RLcategory !== arg){
			g.hide();
		}
	});
    $(".speciesItem").each(function(){
        if($(this).data("attributes").RLcategory !== arg){
            $(this).hide();
        }
        else{
            $(this).show();
        }
    });
    hidePopup();
};

var positionHoverInfo = function(grp){
    var popupHeight = $("#arrowCon").height();

    $("#hoverInfo").css("left",_map.toScreen(grp).x - 13).css("top",_map.toScreen(grp).y + 17)
    $("#hoverInfoPointer").css("left",_map.toScreen(grp).x-13).css("top",_map.toScreen(grp).y + 2)
    $("#hoverInfo").show();
    $("#hoverInfoPointer").show();
};