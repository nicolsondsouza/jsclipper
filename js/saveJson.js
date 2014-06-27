var etchSvg,cutSvg;

(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);
var strSupportedShapes = "|rect|circle|ellipse|path|image|text|polygon|";
var svgUrl=[];

var svgJson=[];
var defs=[];
var svgAttr=[];

var SvgData={
				"thickness":{
								"zero":[],
								"one":[]
							}
			};
var raphaelSvg=[]
var g = null;

$(function(){
	$("#flip").click(function(){
		 viewBox = $(svgXML).children("svg").attr("viewBox");
		g = null;
		if(viewBox){
			viewBox = viewBox.split(' ');	
		
		}
		
		if(g){
			
			$("#svgContainer svg").prepend(g);
			$("#svgContainer svg *").appendTo(g)
		}
		else{
		
		var NS="http://www.w3.org/2000/svg";
		g=document.createElementNS(NS,"g");
		$("#svgContainer svg").prepend(g);
		$("#svgContainer svg *").appendTo(g)

		}
		if(flip){		
			
			$("#svgContainer svg g").attr('transform','translate(0,0),scale(1,1)');
			flip=false;			
		}
		else{
		
			$("#svgContainer svg g").attr('transform','translate('+viewBox[2]+',0),scale(-1,1)');
			flip=true;
		}		
	});
	$("#save").click(function(){
		svgJson();		
	})

	$("#color_map").click(function(){
		color_mapping();
	})
	$("#export").click(function(){
		
		thickness();
		cutout();
		etching();
		flip();
		

	})

	$('#form_cut').submit(function(){
		if(!document.getElementById('weldingCheck').checked)
		var a =$('<div>').append($(cutSvg).clone()).html()
		else
		var a = $(".cutoutDivWeld").html();
		 
        $(".txt_cut").val(a);

	})
	$('#form_etch').submit(function(){
		var a =$('<div>').append($(etchSvg).clone()).html()
		
        $(".txt_etch").val(a);

	})
	$("#thickness").click(function(){
		thickness();
		var el=$("#svgContainer svg *");
		for(var i =0;i<el.length;i++){
			
		}
		

	})

	$("#cutout").click(function(){
		cutout();
	})
	$("#etching").click(function(){
		etching();
	})
})
function flip(){	
	$(".export-page .etchingDiv svg g").attr('transform','translate('+viewBox[2]+',0),scale(-1,1)');
}
function color_mapping(){
	var ele="#svgContainer svg *";
	recurssion(ele);
}
function recurssion(recur){
	$(recur).each(function(index,element){
		var hex=$(element).css("fill");
		var rgb=hex2rgb(hex);
		
		$(element).css("fill",rgb)
	})

}

function hex2rgb(hexStr){
   
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    var brightness = (r*299 + g*587 + b*114) / 1000;
	if (brightness > 125) {
	    return 'rgb(0,0,0)'
	} else {
	    return 'rgb(255,255,255)'
	}
   
}

function svgJson(){
	SvgData["svg_url"]=svgUrl;
		$("#svgContainer svg text").each(function(index,element){
			var a= $(element).attr();
			var string="";
			$(element).children("tspan").each(function(index,element){
				var word=$(this).text();
				string=string+word;
			})
			a["text"]=string;
			if(svgJson.length != 0){
				for(var i=0;i<svgJson.length;i++){
					if(a.id == svgJson[i].id)
					{
						svgJson.pop(i);
						svgJson.push(a);
					}
				}
			}
			else{
				svgJson.push(a);
			}			
		})
		SvgData["svg_json"]=svgJson;

}
var backUPSVG = null;
function thickness(){
	backUPSVG = $("#svgContainer").html();
	
	var svg=$("#svgContainer").find('svg');
 	
 	svgAttr.push($(svg).attr())
	$("#svgContainer svg *").each(function(index,element){
		
		var stroke=$(element).css("stroke");
		var node = element.nodeName;
		if(node == "defs"){
			defs.push(element)
		}
		
		if (stroke != 'none') {
			if(node != "defs"){
				if (node && strSupportedShapes.indexOf("|" + node + "|") >= 0) {
					
					SvgData.thickness.one.push(element);
				}				
			}
		}
		else{
				if(node == "g" ){
					if($(element)[0].childNodes.length > 0){
						for(var i=0;i<$(element)[0].childNodes.length;i++){
							if (stroke != 'none') {
								if(node != "defs"){
									if (node && strSupportedShapes.indexOf("|" + node + "|") >= 0) {
										
										SvgData.thickness.one.push(element);
									}				
								}
							}
							else{
								if (node && strSupportedShapes.indexOf("|" + node + "|") >= 0) {
									
									SvgData.thickness.zero.push(element);
								}				
							}
						}
					}					
				}
				else{
						if (node && strSupportedShapes.indexOf("|" + node + "|") >= 0) {
							
							if(element.nodeName == "image"){
								if(!$(element).attr("shadow")){
									SvgData.thickness.zero.push(element);
								}
							}
							else{
								SvgData.thickness.zero.push(element);
							}
						}	
				}
				
		}
	})

	
}
function zeroPush(element){

}
function childRecurrence(element){
	var obj={}
	var el=element;
	obj.element=element
	
}

function cutout(){
	var NS="http://www.w3.org/2000/svg";
	cutSvg=document.createElementNS(NS,"svg");
	var L = svgAttr.length;
	for (var i = 0; i < L; i++) {
	    var obj = svgAttr[i];
	    for (var j in obj) {	    	
	       cutSvg.setAttribute(j,svgAttr[i][j])
	    }
	}
	var thick_one = SvgData.thickness.one;
	

	for(var i=0;i<thick_one.length;i++){
		
		$(cutSvg).append(thick_one[i]);
	}
	
	$(cutSvg).prepend(defs);
	$(cutSvg).attr('height',$(".export-page .cutoutDiv").css('height'))
	$(cutSvg).attr('width',$(".export-page .cutoutDiv").css('width'))
	$(".export-page .cutoutDiv").html(cutSvg);
	$("#svgContainer").html(backUPSVG)

}

function etching(){
	var NS="http://www.w3.org/2000/svg";
	etchSvg=document.createElementNS(NS,"svg");
	etchG=document.createElementNS(NS,"g");
	$(etchSvg).append(etchG)
	var L = svgAttr.length;
	for (var i = 0; i < L; i++) {
	    var obj = svgAttr[i];
	    for (var j in obj) { 
	       etchSvg.setAttribute(j,svgAttr[i][j])
	    }
	}
	
	var thick_zero = SvgData.thickness.zero;
	
	for(var i=0;i<thick_zero.length;i++){		
		$(etchG).append(thick_zero[i]);
	}
	
	$(etchSvg).prepend(defs);
	$(etchSvg).attr('height',$(".export-page .etchingDiv").css('height'))
	$(etchSvg).attr('width',$(".export-page .etchingDiv").css('width'))
	$(".export-page .etchingDiv").html(etchSvg);
}

