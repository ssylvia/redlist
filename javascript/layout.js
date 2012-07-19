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

var openPopout = function(attr,newPopout){
    if(newPopout === true){
        $("body").append("<div id='modalBackground'></div>");
        $("body").append("<div id='speciesPanel'></div>");
        $("#modalBackground").fadeTo("slow","0.7");
        $("#speciesPanel").fadeIn();
        $("#speciesPanel").append("<div id='speciesMap' class='speciesContent'></div>");
        $("#speciesPanel").append("<div id='speciesContent' class='speciesContent'></div>");
        $(".speciesContent").css("height",$("#speciesPanel").height());
        $("#speciesMap").css("width",$("#speciesPanel").width() - 400);
    }
    var order;
    if ($("#imgLinkOdd").length > 0){
        order = "Even";
    }
    else{
        order = "Odd";

    }
    $("#speciesContent").append("<a id='imgLink"+order+"' href='"+attr.ArkiveURL+"' target='_blank'><img id='speciesImg"+order+"' class='speciesImg' src='images/photos/"+attr.Photo_URL+"' alt=''></a>");
    $("#speciesImg"+order).load(function(){
        var delay;
        if (newPopout === false){
            delay = 200;
        }
        else{
            delay = 0;
        }
        setTimeout(function() {
            $("#speciesContent").append("<div id='commonName"+order+"' class='commonName'>"+attr.Common_name+"</div>");
            $("#speciesContent").append("<div id='sciName"+order+"' class='listingText sciName'><span class='lsText'>SCIENTIFIC NAME: </span><em>"+attr.Latin_name+"</em></div>").append("<div id='statusText"+order+"' class='listingText statusText'><span class='lsText'>STATUS: </span>"+attr.RLdescrpt+"</div>");
            $("#speciesPanel").append("<div id='speciesDescription"+order+"' class='speciesDescription'>"+attr.Description+"</div>");
            $("#speciesDescription"+order).css("top",$("#speciesImg"+order).height() + $("#sciName"+order).height() + $("#statusText"+order).height() + 65).css("height",$("#speciesContent").height() - $("#speciesImg"+order).height() - $("#sciName"+order).height() - $("#statusText"+order).height() - 80);
            $("#speciesPanel").append("<a id='moreInfo"+order+"' class='moreInfo' href='"+attr.RedListURL+"' target='_blank'><em>More Information &gt;</em></a><div id='nextArrow"+order+"' class='nextArrow'></div><div id='prevArrow"+order+"' class='prevArrow'></div>");
            $("#moreInfo"+order).css("top",$("#speciesContent").height()).fadeIn("fast");
            $("#speciesImg"+order).fadeIn("fast");
            $("#commonName"+order).fadeIn("fast");
            $("#sciName"+order).fadeIn("fast");
            $("#statusText"+order).fadeIn("fast");
            $("#speciesDescription"+order).fadeIn("fast");
            $("#nextArrow"+order).css("top",$("#speciesImg"+order).height() + $("#sciName"+order).height() + 25).css("left",$("#sciName"+order).width() + 60).show().click(function(){
                $("#imgLink"+order).fadeOut("fast");
                $("#commonName"+order).fadeOut("fast");
                $("#imgLink"+order).fadeOut("fast");
                $("#sciName"+order).fadeOut("fast");
                $("#statusText"+order).fadeOut("fast");
                $("#speciesDescription"+order).fadeOut("fast");
                $("#nextArrow"+order).fadeOut("fast");
                $("#prevArrow"+order).fadeOut("fast");
                $("#moreInfo"+order).fadeOut("fast");
                setTimeout(function() {
                    $("#imgLink"+order).remove();
                    $("#commonName"+order).remove();
                    $("#imgLink"+order).remove();
                    $("#sciName"+order).remove();
                    $("#statusText"+order).remove();
                    $("#speciesDescription"+order).remove();
                    $("#nextArrow"+order).remove();
                    $("#prevArrow"+order).remove();
                    $("#moreInfo"+order).remove();
                }, 200);
                nextSpecies(attr);
            });
            $("#prevArrow"+order).css("top",$("#speciesImg"+order).height() + $("#sciName"+order).height() + 25).show().click(function(){
                $("#imgLink"+order).fadeOut("fast");
                $("#commonName"+order).fadeOut("fast");
                $("#imgLink"+order).fadeOut("fast");
                $("#sciName"+order).fadeOut("fast");
                $("#statusText"+order).fadeOut("fast");
                $("#speciesDescription"+order).fadeOut("fast");
                $("#nextArrow"+order).fadeOut("fast");
                $("#prevArrow"+order).fadeOut("fast");
                $("#moreInfo"+order).fadeOut("fast");
                setTimeout(function() {
                    $("#imgLink"+order).remove();
                    $("#commonName"+order).remove();
                    $("#imgLink"+order).remove();
                    $("#sciName"+order).remove();
                    $("#statusText"+order).remove();
                    $("#speciesDescription"+order).remove();
                    $("#nextArrow"+order).remove();
                    $("#prevArrow"+order).remove();
                    $("#moreInfo"+order).remove();
                }, 200);
                prevSpecies(attr);
            });
        },delay);
    });

    if(newPopout === true){
        initSpeciesMap(attr);
    }

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

    var lods = [
  		{"level" : 0, "resolution" : 39135.7584820001, "scale" : 147914381.897889},
        {"level" : 1, "resolution" : 19567.8792409999, "scale" : 73957190.948944},
      	{"level" : 2, "resolution" : 9783.93962049996, "scale" : 36978595.474472},
  		{"level" : 3, "resolution" : 4891.96981024998, "scale" : 18489297.737236},
        {"level" : 4, "resolution" : 2445.98490512499, "scale" : 9244648.868618},
        {"level" : 5, "resolution" : 1222.99245256249, "scale" : 4622324.434309},
  		//{"level" : 6, "resolution" : 611.49622628138, "scale" : 2311162.217155}
        //{"level" : 7, "resolution" : 305.748113140558, "scale" : 1155581.108577},
        //{"level" : 8, "resolution" : 152.874056570411, "scale" : 577790.554289}
	];

    _speciesMap = new esri.Map("speciesMap"+order,{
        extent:initExtent,
        wrapAround180:true,
        lods:lods,
    });

    var basemap= new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer");
    _speciesMap.addLayer(basemap);

    _outlineLayer = new esri.layers.FeatureLayer("http://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/RedList_AllRanges/FeatureServer/0",{
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
    });
    _outlineLayer.setDefinitionExpression("TaxonID='"+attr.TaxonID+"'");
    _speciesMap.addLayer(_outlineLayer);

    _fillLayer = new esri.layers.FeatureLayer("http://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/RedList_AllRanges/FeatureServer/1",{
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
    });
    _fillLayer.setDefinitionExpression("TaxonID='"+attr.TaxonID+"'");
    _speciesMap.addLayer(_fillLayer);

    _speciesMap.firstLoad = false;

    dojo.connect(_speciesMap,"onUpdateEnd",function(){
        if (_speciesMap){
            _speciesMap.firstLoad = true;
            if(_speciesMap.getLayer(_speciesMap.graphicsLayerIds[0]).graphics[0]){
                _speciesMap.setExtent(_speciesMap.getLayer(_speciesMap.graphicsLayerIds[0]).graphics[0]._extent.expand(1.8));
            }
        }

    });

};

var nextSpecies = function(attr){
    for(i=0;i<_currentSpecies.length;i++){
        if(_currentSpecies[i].TaxonID === attr.TaxonID){
            if (i === _currentSpecies.length - 1){
                _speciesMap.firstLoad = false;
                _outlineLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[0].TaxonID+"'");
                _fillLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[0].TaxonID+"'");
                openPopout(_currentSpecies[0],false);
            }
            else{
                _speciesMap.firstLoad = false;
                _outlineLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[i+1].TaxonID+"'");
                _fillLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[i+1].TaxonID+"'");
                openPopout(_currentSpecies[i+1],false);
            }
        }
    }
};

var prevSpecies = function(attr){
    for(i=0;i<_currentSpecies.length;i++){
        if(_currentSpecies[i].TaxonID === attr.TaxonID){
            if (i === 0){
                _speciesMap.firstLoad = false;
                _outlineLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[_currentSpecies.length - 1].TaxonID+"'");
                _fillLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[_currentSpecies.length - 1].TaxonID+"'");
                openPopout(_currentSpecies[_currentSpecies.length - 1],false);
            }
            else{
                _speciesMap.firstLoad = false;
                _outlineLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[i-1].TaxonID+"'");
                _fillLayer.setDefinitionExpression("TaxonID='"+_currentSpecies[i-1].TaxonID+"'");
                openPopout(_currentSpecies[i-1],false);
            }
        }
    }
};