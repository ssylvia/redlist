$(document).ready(function(e) {
	$(".selection").click(function(e) {
		$(".selection").removeClass("selected");
		$(this).addClass("selected");
        var left;
		left = $(this).position().left + (($(this).width() - 140)/2 + 10);
		$("#selectorImg").animate({"left":left},"fast");
		$("#selectedText").html($(this).html());
		_selPos = $(this);
		sortGraphics();
    });
    $("#selectorImg").draggable({
		axis : "x",
		containment : "#selector",
		drag : function(){
            hidePopup();
			if(checkSelection() === "LC"){
				$("#selectedText").html("LEAST<br>CONCERN");
			}
			else if(checkSelection() === "NT"){
				$("#selectedText").html("NEAR<br>THREATENED");
			}
			else if(checkSelection() === "VU"){
				$("#selectedText").html("VULNERABLE");
			}
			else if(checkSelection() === "EN"){
				$("#selectedText").html("ENDANGERED");
			}
			else{
				$("#selectedText").html("CRITICALLY ENDANGERED");
			}
		},
		stop : function(){
			var left;
			$(".selection").removeClass("selected");
			if(checkSelection() == "LC"){
				$("#lcFull").addClass("selected");
				left = $("#lcFull").position().left + (($("#lcFull").width() - 140)/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#lcFull");
			}
			else if(checkSelection() == "NT"){
				$("#ntFull").addClass("selected");
				left = $("#ntFull").position().left + (($("#ntFull").width() - 140)/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#ntFull");
			}
			else if(checkSelection() == "VU"){
				$("#vuFull").addClass("selected");
				left = $("#vuFull").position().left + (($("#vuFull").width() - 140)/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#vuFull");
			}
			else if(checkSelection() == "EN"){
				$("#enFull").addClass("selected");
				left = $("#enFull").position().left + (($("#enFull").width() - 140)/2) + 10;
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#enFull");
			}
			else{
				$("#crFull").addClass("selected");
				left = $("#crFull").position().left + (($("#crFull").width() - 140)/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#crFull");
			}
			sortGraphics();
		}
	});
});

$(window).resize(function(){
    resetLayout();
});

dojo.ready(function(){
    resetLayout();
	$("#selectorImg").css("left",$("#vuFull").position().left + (($("#vuFull").width() - 140)/2));
});

var setUpBanner = function(){
    $("#title").html(configOptions.title);
    $("#subtitle").html(configOptions.subtitle);
};

var resetLayout = function(){
	$("#selector").css("width",$("#selectorCon").width() - 30);
	$("#selectorImg").css("bottom",25 - ($("#lcFull").height()/2));
	if (_selPos !== undefined){
		$("#selectorImg").css("left",_selPos.position().left + ((_selPos.width() - 140)/2) + 10);
	}
	else {
		$("#selectorImg").css("left",$("#vuFull").position().left + (($("#vuFull").width() - 140)/2) + 10);
	}
};

var checkSelection = function(){
	var selectorLeft = $("#selectorImg").position().left + 70;
	var lc = $("#lcFull").position().left+$("#lcFull").width();
	var nt = $("#ntFull").position().left+$("#ntFull").width();
	var vu = $("#vuFull").position().left+$("#vuFull").width();
	var en = $("#enFull").position().left+$("#enFull").width();
	if (selectorLeft <= lc){
		return "LC";
	}
	else if (selectorLeft <= nt){
		return "NT";
	}
	else if (selectorLeft <= vu){
		return "VU";
	}
	else if (selectorLeft <= en){
		return "EN";
	}
	else{
		return"CR";
	}
};

var hidePopup = function(){
    $("#hoverInfo").hide();
    $("#hoverInfoPointer").hide();
    $(".speciesItem").removeClass("selectedItem");
    $(".arrow").hide();
};

var getOppositeOrder = function(order){
    if (order == "Odd"){
        return "Even";
    }
    else{
        return "Odd";
    }
};

var openPopout = function(attr){
    $("body").append("<div id='modalBackground'></div>");
    $("body").append("<div id='speciesPanel'></div>");
    $("#modalBackground").fadeTo("slow","0.7");
    $("#speciesPanel").fadeIn();
    $("#speciesPanel").append("<div id='speciesContent' class='speciesContent'></div>");
    $("#speciesPanel").append("<div id='speciesMap' class='speciesContent'></div>");
    $(".speciesContent").css("height",$("#speciesPanel").height());
    $("#speciesMap").css("width",$("#speciesPanel").width() - 400);

    initSpeciesMap(attr);

    $("#modalBackground").click(function(){
        $("#modalBackground").fadeOut("fast");
        $("#speciesPanel").fadeOut("fast");
        setTimeout(function(){
            $("#modalBackground").remove();
            $("#speciesPanel").remove();
        },200);

    });
};

var initSpeciesMap = function(attr){
    var order;
    if ($("#speciesMapOdd").length > 0){
        order = "Even";
    }
    else{
        order = "Odd";

    }

    $("#speciesMap").append("<div id='speciesMap"+order+"' class='map'></div>");
    $("#speciesMap"+order).css("z-index","0");

    var initExtent = new esri.geometry.Extent({"xmin":-15440190.518952178,"ymin":-4384014.805557845,"xmax":16259773.85146766,"ymax":10174487.34974608,"spatialReference":{"wkid":102100}});

    var map = new esri.Map("speciesMap"+order,{
        extent:initExtent,
        wrapAround180:true
    });

    var basemap= new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer");
    map.addLayer(basemap);

    var outlineLayer = new esri.layers.FeatureLayer("http://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/RedList_AllRanges/FeatureServer/0",{
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
    });
    outlineLayer.setDefinitionExpression("TaxonID='"+attr.TaxonID+"'");
    map.addLayer(outlineLayer);

    var fillLayer = new esri.layers.FeatureLayer("http://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/RedList_AllRanges/FeatureServer/1",{
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
    });
    fillLayer.setDefinitionExpression("TaxonID='"+attr.TaxonID+"'");
    map.addLayer(fillLayer);

    map.firstLoad = false;

    dojo.connect(map,"onUpdateEnd",function(){
        if (map.firstLoad === false && map.getLayer(map.graphicsLayerIds[0]).graphics[0] !== undefined){
            map.firstLoad = true;
            map.setExtent(map.getLayer(map.graphicsLayerIds[0]).graphics[0]._extent.expand(1.8));
        }

    });

};