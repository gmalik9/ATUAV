var numTicks = 3;
var n = 8, // number of samples
    m = 3; // number of series

//BEN: Need this variable to be able to stop blinking
var timeOutHandle;

//BEN: Added the series name
var seriesName = ["Average", "Andrea", "Diana"]
var data = 
[ [9.2, 12.1, 7.7, 9.5, 11.9, 11.5, 10, 11.3], 
[11.1, 11, 14.45, 11.3, 10.3, 9.8, 9.1, 12.8],
[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9] ];
var subject = ["Physics", "Marine Biology", "Calculus", "Geometry", "Painting", "Phtography", 
					"English Literature", "Anthropology"];				
var stack = new Array;
var paper ;
//stack.push(2);       
//stack.push(5);
//var i = stack.pop();
//alert(i);
					
var w = 625,
    h = 500,
    chartPadding = 25;
    y = d3.scale.linear().domain([0, 15]).range([ h,0]),
    y1 = d3.scale.linear().domain([0, 15]).range([ 0, h]),
    x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3),
    x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]),
    score = d3.scale.linear().domain([0,500]).range([0, 100]);
    z = d3.scale.category10();

var xAxis = d3.svg.axis()
					.scale(x0)
					.orient("bottom")
					.ticks(m);

var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(numTicks);
				
var vis = d3.select("body")
  .append("svg:svg")
    .attr("width", w + 20)
    .attr("height", h + 40)
  .append("svg:g")
    .attr("transform", "translate(10,10)");



var g = vis.selectAll("g")
    .data(data) 
  .enter().append("svg:g") 
    .attr("fill", function(d, i) { return z(i); })
    //this transform works as spread out the coordinates of different series
    .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
//BEN: added id to series (i.e. "Average", "Andrea", "Diana"  in our case)
	.attr("id", function(d, i) { return seriesName[i]; });
	
var rect = g.selectAll("rect")
//Object = the sec dimension in the two dimension array
    .data(Object)
  .enter().append("svg:rect")
  //this transform spreads out the different group
    .attr("transform", function(d, i) { return "translate(" + x0(i) + ", 0)"; })
    .attr("width", x1.rangeBand())
    .attr("height", y1)
    .attr("y", function(d) { return h - y1(d); })
//the x-coor for all bars    
    .attr("x", 4)
//BEN: added id to individual bars (between 0-7 in our case)
	.attr("id", function(d, i) {return 'value' + i;});  

// Add axes
vis.append("g")
	.attr("class", "axis")
   	.attr("transform", "translate(10,0)")
   	.attr("font-size", "11px")
   	.call(yAxis);

vis.append("g")
   	.attr("class", "axis")
   	.attr("transform", "translate( 4," + h + ")")
   	.attr("font-size", "11px")
   	.call(xAxis);
           
//BEN: Get multiple bars	
function getSelectedBars(seriesValuesPairs){
	
	selectedBars = new Array();
	
	for (var i=0; i<seriesValuesPairs.length; i++)
	{
		series = seriesValuesPairs[i][0];
		value = seriesValuesPairs[i][1];
		selectedBars[i] = d3.select('#'+series).select('#value'+value);
	}
	
	return selectedBars;
 }
 /**
  * ways to selected bars in jQuery
  * input: array of bars value pairs
  * return: 2D array of value, xCor, yCor
  */
function getSelectedJBars(seriesValuesPairs){
	
	var selectedBars = new Array();
	var value = new Array;
	var xCor = new Array;
	var yCor = new Array;
	var intValue = new Array;
	
	for (var i=0; i<seriesValuesPairs.length; i++)
	{
		value[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).attr("height");
		xCor[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).offset().left;
		yCor[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).offset().top;		
		
	}
	
	for (var i = 0; i<value.length; i++){
		intValue[i] = Math.floor(value[i])
	}
	
	var textData = new Array;
	for(var i = 0; i<xCor.length; i++){
		textData[i] = [ intValue[i], xCor[i], yCor[i]];
	}
	
	return textData;
 } 
 
function contain(obj, array){
	for(var i = 0; i<array.length; i++){
		if(array[i] == obj){
				return true;

		}
	}
	return false;
}


//BEN: highlight selection
function highlight(selectedBars){
	for (var i=0; i<selectedBars.length; i++)
	{
		selectedBars[i].style("fill", "#ffff00");
	}
	stack.push("highlight");
 }
 
function undoHighlight(selectedBars){
	for (var i=0; i<selectedBars.length; i++)
	{
		selectedBars[i].style("fill", null);
	}
	stack.pop();
}

function bolding(selectedBars){
	for (var i=0; i<selectedBars.length; i++)
	{
		selectedBars[i].style("stroke-width", 3)
 						.style("stroke", "red");
	}
	stack.push("bolding");
 }

function undoBolding(selectedBars){
	
	for (var i=0; i<selectedBars.length; i++)
	{
		selectedBars[i].style("stroke-width", 0)
 						.style("stroke", null);
	}
	stack.pop();
}

//BEN: blink 1 (i.e. changing the colour, then calling blink 2)
function blink(selectedBars)
{
	for (var i=0; i<selectedBars.length; i++)
	{
			selectedBars[i].style("fill", "#ffff00");
	}
	stack.push("blink");
	timeOutHandle = setTimeout("blink2(selectedBars)",500)
}
//BEN: blink 2 (i.e. changing the colour back, then calling blink 1)
function blink2(selectedBars)
{
	for (var i=0; i<selectedBars.length; i++)
	{
			selectedBars[i].style("fill", null);
	}
	
	timeOutHandle = setTimeout("blink(selectedBars)",500)
}

function deEmphRest(selectedBars){
	
	var selectedId = new Array();
	var selectedHeight = new Array();
	
	for(var i = 0; i< selectedBars.length; i++){
		selectedId[i] = selectedBars[i].attr("id");
		selectedHeight[i] = selectedBars[i].attr("height");
	
	}
	
	rect.each(function(d,i) {		
			var thisRect = d3.select(this);	
			if (!contain(thisRect.attr("id"), selectedId) || !contain(thisRect.attr("height"),selectedHeight)) {
				thisRect.style("opacity", 0.2);	
			}
		});
	stack.push("deEmphRest");
 }
 
function undoDeEmph(selectedBars){
		var selectedId = new Array();
	var selectedHeight = new Array();
	
	for(var i = 0; i< selectedBars.length; i++){
		selectedId[i] = selectedBars[i].attr("id");
		selectedHeight[i] = selectedBars[i].attr("height");
	
	}
	
	rect.each(function(d,i) {		
			var thisRect = d3.select(this);	
			if (!contain(thisRect.attr("id"), selectedId) || !contain(thisRect.attr("height"),selectedHeight)) {
				thisRect.style("opacity", 1);	
			}
		});
	stack.pop();
}
function referenceLine(selectedGroup){
	
	var rect = $(selectedGroup).children();
	
	
	var hArr = new Array;
	var colour;
	rect.each(function (i,d) { hArr[i] = $(this).attr("height")});
	colour = $(selectedGroup).attr("fill");
	var sum = 0;
	
	for(var i = 0; i<hArr.length; i++){
			sum += parseFloat(hArr[i]);
		}	
	var avg = sum/hArr.length;
	
	
		var avgLine = vis.append("svg:line")
							.attr("x1", 6)
							.attr("y1", h-avg)
							.attr("x2", w)
							.attr("y2", h-avg)
							.style("stroke",colour)
							.style("stroke-width", 5);
							
	var	min=hArr[0];
	for(var i = 0; i<hArr.length; i++){
		if(hArr[i]<min)
		min=hArr[i];
	} 
							
		var minLine = vis.append("svg:line")
							.attr("x1", 6)
							.attr("y1", h-min)
							.attr("x2", w)
							.attr("y2", h-min)
							.style("stroke", colour)
							.style("stroke-width", 5);
							
	
	var max = hArr[0];
	for(var i = 0; i<hArr.length; i++){
		if(hArr[i]>max)
		max=hArr[i];
	}
							
		var maxLine = vis.append("svg:line")
							.attr("x1", 6)
							.attr("y1", h-max)
							.attr("x2", w)
							.attr("y2", h-max)
							.style("stroke", colour)
							.style("stroke-width", 5); 

	stack.push("referenceLine");
}  

function undoRefLine(){
	
	d3.selectAll("line").remove();
	stack.pop();
}

function lineComp(selectedBars){
	
	var xCor = new Array;
	var yCor = new Array;
	
for (var i = 0; i < selectedBars.length; i++){
	
	xCor[i] = selectedBars[i][1];
	yCor[i] = selectedBars[i][2];
	
}

		var line = vis.append("svg:line")
							.attr("x1", xCor[0])
							.attr("y1", yCor[0])
							.attr("x2", xCor[1])
							.attr("y2", yCor[1])
							.attr("transform", "translate(-10,-15)")
							.style("stroke","black")
							.style("stroke-width", 5);
	stack.push("lineComp");			
}

function showGroupValue(selectedGroup)
{
	var rect = $(selectedGroup).children();
	var value = new Array;
	var xCor = new Array;
	var yCor = new Array;
	var intValue = new Array;

	rect.each(function (i,d) { value[i] = $(this).attr("height")});
	rect.each(function(i,d) {xCor[i] = $(this).offset().left});
	rect.each(function(i,d) {yCor[i] = $(this).offset().top});
	

	for (var i = 0; i<value.length; i++){
		intValue[i] = Math.floor(value[i])
	}

	var textData = new Array;
	for(var i = 0; i<xCor.length; i++){
		textData[i] = [ intValue[i], xCor[i], yCor[i]];
	}

	 		d3.select(selectedGroup).selectAll("text")
 				.data(textData)
 				.enter().append("svg:text")
 				.attr("x", function(d){	return x0(d[1]) + 10 ;})
 				.attr("y", function(d){	return d[2] -10 ; } )
 				.attr("dx", 3)
 				.attr("dy", ".35em")
 				.attr("font-family", "sans-serif")
 				.attr("fill", "black")
 				.attr("text-anchor", "middle")
 				.attr("class", function(d, i) {return 'groupTextID';})

 				//.attr("transform", function(d, i) { return "translate(" + x1(i) + "," + "0)"; })
 				.text(function(d){return Math.floor(score(d[0]));});
 		stack.push("showGroupValue");		
}

function undogGroupValue(){
	d3.select("g").selectAll(".groupTextID").remove();
	stack.pop();
}

function showIndiValue(selectedBars)
{
			var baseXCor = selectedBars[0][1];
	 		g.select("text") 			
 				.data(selectedBars)
 				.enter().append("svg:text")
 				.attr("x", function(d){	return d[1]  - 13;})
 				.attr("y", function(d){	return d[2] -10 ; } )
 				.attr("dx", 3)
 				.attr("dy", ".35em")
 				.attr("font-family", "sans-serif")
 				.attr("fill", "black")
 				.attr("text-anchor", "middle")
 				.attr("class", function(d, i) {return 'textID';})
 				.text(function(d){return Math.floor(score(d[0]));});
 	stack.push("showIndiValue");			
}

function undoIndiValue(){
	d3.select("g").selectAll(".textID").remove();
	stack.pop();
}

//arrow
Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
        var angle = Math.atan2(x1-x2,y2-y1);
        angle = (angle / (2 * Math.PI)) * 360;
        var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2  - size) + " " + (y2  - size) + " L" + (x2  - size)  + " " + (y2  + size) + " L" + x2 + " " + y2 )
        					.attr("fill","black")
        					.rotate((90+angle),x2,y2);
        var linePath = this.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
        return [linePath,arrowPath];
};


function drawArrow(selectedBars){
	
	var xCor = new Array;
	var yCor = new Array;
	var arrow = new Array;
	paper = new Raphael(0,0,625,500);
	
for (var i = 0; i < selectedBars.length; i++){
	
	xCor[i] = selectedBars[i][1];
	yCor[i] = selectedBars[i][2];
	
	 arrow[i] = paper.arrow(xCor[i]-20,yCor[i]-20,xCor[i],yCor[i],10);
}
stack.push("drawArrow");



}

function undoArrow(){
		paper.clear();
		stack.pop();
}
//BEN: Trigger
function trigger(){

	//BEN: EXAMPLE 3: Get the 2nd and 3rd value for Diana and highlight
//	selectedBars = getSelectedBars([["Diana", "1"],["Diana", "2"]]);
//	highlight(selectedBars);
//	alert(stack);
//	undoHighlight(selectedBars);
//	alert(stack);
		
	
	//BEN: EXAMPLE 5: Get the 2nd for Andrea and 3rd value for Diana and make selection blink
//	selectedBars = getSelectedBars([["Andrea", "2"],["Average", "0"], ["Diana", "3"]]);
//	blink(selectedBars);


//Daisy Jun25 Print Value
//	selectedGroup = "#Average";
//	selectedGroup = "#Andrea";
//	selectedGroup = "#Diana";
//	showGroupValue(selectedGroup);
//	alert(stack);
//Jul 13 UndoGroupValue
//	undogGroupValue();
//	alert(stack);

//Daisy Jun28 Print individual value
//	selectedJBars = getSelectedJBars([["Andrea", "2"],["Average", "0"], ["Diana", "3"], ["Diana", "0"], ["Andrea", "0"]]);
//	selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "2"], ["Diana", "3"]]);
//	showIndiValue(selectedJBars);
//	alert(stack);
//Jul11 UndoIndiValue 
//	undoIndiValue();
//	alert(stack);

//Daisy Jun18 Draw Reference Line see if d3 works 
//	selectedGroup = "#Average";
//	selectedGroup = "#Andrea";
//	selectedGroup = "#Diana";
//	referenceLine(selectedGroup);
//	alert(stack);
//	undoRefLine();
//	alert(stack);
	
//Daisy Jun21 Bolding
//	selectedBars = getSelectedBars([["Andrea", "2"],["Diana", "3"]]);
//	bolding(selectedBars);
//	alert(stack);
//	undoBolding(selectedBars);
//	alert(stack);
	
//Daisy Jun27 Arrow 
//	selectedJBars = getSelectedJBars([["Andrea", "2"],["Diana", "3"]]);
//	selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "2"], ["Diana", "3"], ["Andrea", "0"]]);
//	drawArrow(selectedJBars);
//	alert(stack);
//	undoArrow();
//	alert(stack);
	
//Daisy Jul3 DeEmphasizing
//	selectedBars = getSelectedBars([["Andrea", "2"],["Diana", "3"],["Average","2"]]);
//	selectedBars = getSelectedBars([["Andrea", "3"]]);
//	deEmphRest(selectedBars);
//	alert(stack);
//	undoDeEmph(selectedBars);
//	alert(stack);
	
	selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "6"]]);
	selectedBars = getSelectedBars([["Andrea", "1"],["Diana", "6"]]);

//	lineComp(selectedJBars);
//	showIndiValue(selectedJBars);
//	drawArrow(selectedJBars);
//	alert(stack);
//	undoArrow()
//	alert(stack);
	

  a = setInterval("lineComp(selectedJBars)", 1000);
  clearTimeout(timeOutHandle);
  b = setInterval("showIndiValue(selectedJBars)", 2000);
	clearTimeout(timeOutHandle);
	c = setInterval("undoIndiValue()", 3000);
	clearTimeout(timeOutHandle);
}

//BEN: Stop Blinking
function stopBlinking(){
	clearTimeout(timeOutHandle);
}
