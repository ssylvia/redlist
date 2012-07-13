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
		return"CR"
	}
};