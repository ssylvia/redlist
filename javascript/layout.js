if (("onhashchange" in window) && !($.browser.msie)) {
    window.onhashchange = function () {
        if(window.location.hash === "#overview" && $("#modalBackground").is(":visible")){
            $("#modalBackground").fadeOut("fast");
            $("#speciesPanel").fadeOut("fast");
            setTimeout(function(){
                $("#modalBackground").remove();
                $("#speciesPanel").remove();
            },200);
        }
        else if(_currentSelection !== window.location.hash && window.location.hash !== "#overview" && $("#modalBackground").is(":visible")){
            var order;
            if ($("#imgLinkOdd").length > 0){
                order = "Odd";
            }
            else{
                order = "Even";
            }
            dojo.forEach(_points.graphics,function(g){
            	if("#"+g.attributes.TaxonID === window.location.hash){
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
                    _speciesMap.firstLoad = false;
                    _outlineLayer.setDefinitionExpression("TaxonID='"+g.attributes.TaxonID+"'");
                    _fillLayer.setDefinitionExpression("TaxonID='"+g.attributes.TaxonID+"'");
        			openPopout(g.attributes,false);
        		}
        	});
        }
        else {
            if (window.location.hash !== _currentSelection && window.location.hash !== "#overview"){
                window.history.back();
            }
        }
    };
}
else {
    var prevHash = window.location.hash;
    window.setInterval(function () {
        if (window.location.hash !== prevHash) {
            storedHash = window.location.hash;
            if(window.location.hash === "#overview" && $("#modalBackground").is(":visible")){
            $("#modalBackground").fadeOut("fast");
            $("#speciesPanel").fadeOut("fast");
            setTimeout(function(){
                $("#modalBackground").remove();
                $("#speciesPanel").remove();
            },200);
        }
        else if(_currentSelection !== window.location.hash && window.location.hash !== "#overview" && $("#modalBackground").is(":visible")){
            var order;
            if ($("#imgLinkOdd").length > 0){
                order = "Odd";
            }
            else{
                order = "Even";
            }
            dojo.forEach(_points.graphics,function(g){
                if("#"+g.attributes.TaxonID === window.location.hash){
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
                    _speciesMap.firstLoad = false;
                    _outlineLayer.setDefinitionExpression("TaxonID='"+g.attributes.TaxonID+"'");
                    _fillLayer.setDefinitionExpression("TaxonID='"+g.attributes.TaxonID+"'");
        			openPopout(g.attributes,false);
        		}
        	});
        }
        else {
            if (window.location.hash !== _currentSelection && window.location.hash !== "#overview"){
                window.history.back();
            }
        }
        }
    }, 100);
}

var getStringText = function(str){
    var s = str.split("<br>");
    var newString;
    for (i=0; i<s.length;i++){
        if (i==0){
            newString = s[i];
        }
        else{
            newString = newString + " " + s[i];
        }
    }
    return newString;
};

$(document).ready(function(e) {
    $(".tiptip").tipTip({
        defaultPosition:"top",
        delay:0,
        content:"No Species<br>Available"
    });
	$(".selection").click(function(e) {
        if($(this).html() != "NOT<br>EVALUATED" && $(this).html() != "DATA<br>DEFICIENT" && $(this).html() != "EXTINCT IN<br>THE WILD" && $(this).html() != "EXTINCT"){
    		$(".selection").removeClass("selected");
    		$(this).addClass("selected");
            var left;
    		left = $(this).position().left + (($(this).width() - $("#selectorImg").width())/2 + 10);
    		$("#selectorImg").animate({"left":left},"fast");
    		$("#selectedText").html($(this).html());
    		_selPos = $(this);
    		sortGraphics();
        }
        else{
            //alert("No data currently available for \""+getStringText($(this).html())+"\" IUCN Redlist category.");
        }
    });
    $("#selectorImg").draggable({
		axis : "x",
		containment : "#selector",
		drag : function(){
            hidePopup();
            if(checkSelection() === "NE"){
    			$("#selectedText").html("NOT<br>EVALUATED");
                if(_currentCat != "NE"){
                    $("#neFull").trigger("mouseover");
                    $("#tiptip_holder").css("margin-top",parseFloat($("#tiptip_holder").css("margin-top").split("px")[0])-($("#selectorImg").height()/2)+($("#neFull").height()/2)+3);
                }
                _currentCat = "NE";
			}
    		else if(checkSelection() === "DD"){
				$("#selectedText").html("DATA<br>DEFICIENT");
                if(_currentCat != "DD"){
                    $("#ddFull").trigger("mouseover");
                    $("#tiptip_holder").css("margin-top",parseFloat($("#tiptip_holder").css("margin-top").split("px")[0])-($("#selectorImg").height()/2)+($("#ddFull").height()/2)+3);
                }
                _currentCat = "DD";
			}
			else if(checkSelection() === "LC"){
				$("#selectedText").html("LEAST<br>CONCERN");
                _currentCat = "LC";
                hideTooltip();
			}
			else if(checkSelection() === "NT"){
				$("#selectedText").html("NEAR<br>THREATENED");
                _currentCat = "NT";
                hideTooltip();
			}
			else if(checkSelection() === "VU"){
				$("#selectedText").html("VULNERABLE");
                _currentCat = "VU";
                hideTooltip();
			}
			else if(checkSelection() === "EN"){
				$("#selectedText").html("ENDANGERED");
                _currentCat = "EN";
                hideTooltip();
			}
    		else if(checkSelection() === "CR"){
				$("#selectedText").html("CRITICALLY<br>ENDANGERED");
                _currentCat = "CR";
                hideTooltip();
			}
            else if(checkSelection() === "EW"){
    			$("#selectedText").html("EXTINCT IN<br>THE WILD");
                if(_currentCat != "EW"){
                    $("#ewFull").trigger("mouseover");
                    $("#tiptip_holder").css("margin-top",parseFloat($("#tiptip_holder").css("margin-top").split("px")[0])-($("#selectorImg").height()/2)+($("#ewFull").height()/2)+3);
                }
                _currentCat = "EW";
			}
			else{
				$("#selectedText").html("EXTINCT");
                if(_currentCat != "EX"){
                    $("#exFull").trigger("mouseover");
                    $("#tiptip_holder").css("margin-top",parseFloat($("#tiptip_holder").css("margin-top").split("px")[0])-($("#selectorImg").height()/2)+($("#exFull").height()/2)+3);
                }
                _currentCat = "EX";
			}
		},
		stop : function(){
            hideTooltip();
			var left;
			$(".selection").removeClass("selected");
			if(checkSelection() === "LC" || checkSelection() === "NE" || checkSelection() === "DD"){
        		$("#selectedText").html("LEAST<br>CONCERN");
				$("#lcFull").addClass("selected");
				left = $("#lcFull").position().left + (($("#lcFull").width() - $("#selectorImg").width())/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#lcFull");
			}
			else if(checkSelection() == "NT"){
				$("#ntFull").addClass("selected");
				left = $("#ntFull").position().left + (($("#ntFull").width() - $("#selectorImg").width())/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#ntFull");
			}
			else if(checkSelection() == "VU"){
				$("#vuFull").addClass("selected");
				left = $("#vuFull").position().left + (($("#vuFull").width() - $("#selectorImg").width())/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#vuFull");
			}
			else if(checkSelection() == "EN"){
				$("#enFull").addClass("selected");
				left = $("#enFull").position().left + (($("#enFull").width() - $("#selectorImg").width())/2) + 10;
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#enFull");
			}
			else{
    			$("#selectedText").html("CRITICALLY<br>ENDANGERED");
				$("#crFull").addClass("selected");
				left = $("#crFull").position().left + (($("#crFull").width() - $("#selectorImg").width())/2 + 10);
				$("#selectorImg").animate({"left":left},100);
				_selPos = $("#crFull");
			}
			sortGraphics();
		}
	});
});

var hideTooltip = function(){
    $("#neFull").trigger("mouseout");
    $("#ddFull").trigger("mouseout");
    $("#ewFull").trigger("mouseout");
    $("#exFull").trigger("mouseout");
};

$(window).resize(function(){
    resetLayout();
});

dojo.ready(function(){
    resetLayout();
});

var setUpBanner = function(){
    $("#title").html(configOptions.title);
    $("#subtitle").html(configOptions.subtitle);
};

var resetLayout = function(){
	$("#selector").css("width",$("#selectorCon").width() - 30);
	$("#selectorImg").css("bottom",25 - ($("#lcFull").height()/2));
	if (_selPos !== undefined){
		$("#selectorImg").css("left",_selPos.position().left + ((_selPos.width() - $("#selectorImg").width())/2) + 10);
	}
	else {
		$("#selectorImg").css("left",$("#vuFull").position().left + (($("#vuFull").width() - $("#selectorImg").width())/2) + 10);
	}
    if($(document).width() >= 1680){
        $("#selector").css("font-size","12px");
        $("#selectorImg").css("height",140).css("width",140).css("background","url(images/slider.png)");
        $("#selectedText").css("padding","22px").css("font-size","13px");
        $("#selectorCon").css("height",120);
        $("#selector").css("margin-top",20);
    }
    else if($(document).width() >= 1024){
        $("#selector").css("font-size","10px");
        $("#selectorImg").css("height",140).css("width",140).css("background","url(images/slider.png)");
        $("#selectedText").css("padding","22px").css("font-size","13px");
        $("#selectorCon").css("height",120);
        $("#selector").css("margin-top",20);
    }
    else{
        $("#selector").css("font-size","8px");
        $("#selectorImg").css("height",90).css("width",90).css("background","url(images/sliderSmall.png)");
        $("#selectedText").css("padding",0).css("font-size","8px");
        $("#selectorCon").css("height",90);
        $("#selector").css("margin-top",10);
    }

    $(".speciesContent").css("height",$("#speciesPanel").height());
    $("#speciesMap").css("width",$("#speciesPanel").width() - getWidth() - 1).css("height",$("#speciesPanel").height());

    dijit.byId("mainWindow").layout();
};

var checkSelection = function(){
	var selectorLeft = $("#selectorImg").position().left + ($("#selectorImg").width()/2);
    var ne = $("#neFull").position().left+$("#neFull").width();
    var dd = $("#ddFull").position().left+$("#ddFull").width();
	var lc = $("#lcFull").position().left+$("#lcFull").width();
	var nt = $("#ntFull").position().left+$("#ntFull").width();
	var vu = $("#vuFull").position().left+$("#vuFull").width();
	var en = $("#enFull").position().left+$("#enFull").width();
    var cr = $("#crFull").position().left+$("#crFull").width();
    var ew = $("#ewFull").position().left+$("#ewFull").width();
	if (selectorLeft <= ne){
		return "NE";
	}
    else if (selectorLeft <= dd){
    	return "DD";
	}
    else if (selectorLeft <= lc){
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
    else if (selectorLeft <= cr){
    	return "CR";
	}
    else if (selectorLeft <= ew){
    	return "EW";
	}
	else{
		return"EX";
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
    _currentSelection = "#"+attr.TaxonID;
    if (iPad === false){
        window.location.hash = attr.TaxonID;
    }
    if(newPopout === true){
        $("body").append("<div id='modalBackground'></div><div id='speciesPanel'></div>");
        $("#modalBackground").fadeTo("slow","0.7");
        $("#speciesPanel").fadeIn().append("<div id='speciesMap' class='speciesContent'></div><div id='speciesContent' class='speciesContent'></div><div id='closeButton' class='ui-icons-close'>Close</div>");
        $(".speciesContent").css("height",$("#speciesPanel").height());
        $("#speciesMap").css("width",$("#speciesPanel").width() - getWidth() - 1).append("<div id='zoomToggleMini' class='zoomToggle'><img id='zoomInMini' class='zoomIn' src='images/ZoomLight_01.png'><img id='zoomExtentMini' class='zoomExtent' src='images/ZoomLight_02.png'><img id='zoomOutMini' class='zoomOut' src='images/ZoomLight_03.png'></div>");
        if (iPad === true) {
            $(".zoomExtent").css("margin-top","-4px");
            $(".zoomOut").css("margin-top","-4px");
        }
        $("#zoomToggleMini").css("margin-left",getWidth() + 15).css("margin-top",15).show();
        if ( $.browser.mozilla == true){
            $("#zoomOutMini").css("margin-top","-4px");
        }
        $("#closeButton").button({
            icons : {
                primary : "ui-icon-closethick"
            },
            text:false
        }).click(function(){
            $("#modalBackground").fadeOut("fast");
            $("#speciesPanel").fadeOut("fast");
            setTimeout(function(){
                $("#modalBackground").remove();
                $("#speciesPanel").html("");
                $("#speciesPanel").remove();
                if (iPad === false){
                    window.location.hash = "overview";
                }
            },200);
        });
    }
    var order;
    if ($("#imgLinkOdd").length > 0){
        order = "Even";
    }
    else{
        order = "Odd";
    }

    var photoright;
    console.log(attr.TaxonID);
    dojo.forEach(photoCredits,function(p){
        if (attr.TaxonID == p.TaxonID){
            photoright = p.Photographer;
        }
    });

    $("#speciesContent").append("<a id='imgLink"+order+"' href='"+attr.ArkiveURL+"' target='_blank'><img id='speciesImg"+order+"' class='speciesImg' src='images/photos/"+attr.Photo_URL+"' alt=''></a>").css("width",getWidth());
    $("#speciesImg"+order).load(function(){
        var delay;
        if (newPopout === false){
            delay = 200;
        }
        else{
            delay = 0;
        }
        setTimeout(function() {
            $("#speciesContent").append("<p id='photoCredit"+order+"' class='photoCredit'>© "+photoright+"</p><img id='threatScale"+order+"' class='threatScale' src='images/scales/"+attr.RLcategory+".png' alt=''>");
            $("#speciesContent").append("<div id='commonName"+order+"' class='commonName'>"+attr.Common_name+"</div>");
            $("#speciesContent").append("<div id='sciName"+order+"' class='listingText sciName'><span class='lsText'>SCIENTIFIC NAME: </span><em>"+attr.Latin_name+"</em></div><div id='nextArrow"+order+"' class='nextArrow'></div><div id='prevArrow"+order+"' class='prevArrow'></div>");
            $("#speciesContent").append("<div id='speciesDescription"+order+"' class='speciesDescription'>"+attr.Description+"</div>");
            $(".listingText").css("width",300 - (400 - getWidth()));
            $("#speciesContent").append("<a id='moreInfo"+order+"' class='moreInfo' href='"+attr.RedListURL+"' target='_blank'><em>More Information &gt;</em></a>");
            $("#moreInfo"+order).css("top",$("#speciesContent").height()).fadeIn("fast");
            $(".commonName").css("width",300 - (400 - getWidth()));
            $("#speciesImg"+order).fadeIn("fast");
            $("#photoCredit"+order).fadeIn("fast");
            $("#threatScale"+order).fadeIn("fast");
            $("#commonName"+order).fadeIn("fast");
            $("#sciName"+order).fadeIn("fast");
            $("#statusText"+order).fadeIn("fast");
            $("#speciesDescription"+order).fadeIn("fast");
            $("#nextArrow"+order).css("margin-top",-30 - (($("#sciName"+order).height()-25)/2)).show().click(function(){
                $("#imgLink"+order).fadeOut("fast");
                $("#photoCredit"+order).fadeOut("fast");
                $("#threatScale"+order).fadeOut("fast");
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
                    $("#photoCredit"+order).remove();
                    $("#threatScale"+order).remove();
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
            $("#prevArrow"+order).show().click(function(){
                $("#imgLink"+order).fadeOut("fast");
                $("#photoCredit"+order).fadeOut("fast");
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
                    $("#photoCredit"+order).remove();
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
            if (iPad === false){
                window.location.hash = "overview";
            }
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
        {"level" : 5, "resolution" : 1222.99245256249, "scale" : 4622324.434309}
  		//{"level" : 6, "resolution" : 611.49622628138, "scale" : 2311162.217155}
        //{"level" : 7, "resolution" : 305.748113140558, "scale" : 1155581.108577},
        //{"level" : 8, "resolution" : 152.874056570411, "scale" : 577790.554289}
	];

    _speciesMap = new esri.Map("speciesMap"+order,{
        extent:initExtent,
        wrapAround180:true,
        lods:lods
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
        if (_speciesMap.firstLoad === false){
            if(_speciesMap.getLayer(_speciesMap.graphicsLayerIds[0]).graphics[0]){
                _speciesMap.firstLoad = true;
                _speciesMap.setExtent(_speciesMap.getLayer(_speciesMap.graphicsLayerIds[0]).graphics[0]._extent.expand(1.8));
            }
        }

    });

    dojo.connect(_speciesMap, 'onLoad', function(theMap) {
		dojo.connect(dijit.byId('map'), 'resize', _speciesMap,_speciesMap.resize);
	});

    $("#zoomInMini").click(function(){
        _speciesMap.setLevel(_speciesMap.getLevel()+1);
    });
    $("#zoomOutMini").click(function(){
        _speciesMap.setLevel(_speciesMap.getLevel()-1);
    });
    $("#zoomExtentMini").click(function(){
        _speciesMap.setExtent(_speciesMap.getLayer(_speciesMap.graphicsLayerIds[0]).graphics[0]._extent.expand(1.8));
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

var getWidth = function(){
    if (iPad === true){
        return 400;
    }
    else{
        return 400;
    }
};

var sortList = function(){
    _pointData.features.sort(function(a,b){
        if(a.attributes.Common_name<b.attributes.Common_name) return -1;
        if(a.attributes.Common_name>b.attributes.Common_name) return 1;
        return 0;
    });
};