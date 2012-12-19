$(document).ready(function()
{
	$('.slideShow').cycle({ 
    	fx:    'fade', 
    	speed:  1250,
    	next:   '.slideBackButton', 
    	prev:   '.slideForwardButton' 
 	});
 	
 	$("ul.subMenu").mouseover(function()
 	{
		$(this).siblings("a").css("background-color","#2d70c1");
		$(this).siblings("a").css("border","1px solid #0a3c76");
		$(this).siblings("a").css("border-bottom","0px solid #000000");
		$(this).siblings("a").css("color","#FFFFFF");
		$(this).siblings("a").css("padding","10px 19px 16px 19px");
		$(this).siblings("a").css("text-shadow","1px 1px 1px #646464");		
 	});
 	$("ul.subMenu").mouseout(function()
 	{
		$(this).siblings("a").attr("style","");
 	}); 	
 	$("div#nav div#menu ul li").mouseover(function()
 	{
 		if($(this).has("ul").length)
 		{
 			$(this).children("ul").show();
 		}
 	});
 	
 	$("div#nav div#menu ul li").mouseout(function()
 	{
 		if($(this).has("ul").length)
 		{
 			$(this).children("ul").hide();
 		}
 	});		

	$("div#nav div#search input").click(function()
	{
		if($(this).val() == "Search...")
		{
			$(this).val("");
		}
	});
	$("div#nav div#search input").focusout(function()
	{
		if( $.trim($(this).val()) == "")
		{
			$(this).val("Search...");
		}
	});
	$("div#nav div#search img#btnSearch").click(function()
	{
		$("form#headerSearchFrm").submit();
	});
	$("a.slideBackButton img").mouseover(function()
	{
		$(this).css("opacity",".86");
	});
	$("a.slideBackButton img").mouseout(function()
	{
		$(this).css("opacity",".66");
	});	
	$("a.slideForwardButton img").mouseover(function()
	{
		$(this).css("opacity",".86");
	});
	$("a.slideForwardButton img").mouseout(function()
	{
		$(this).css("opacity",".66");
	});
	
	$("input#btnSubmit").click(function()
	{
		/*$("div#footForm").hide();*/
	});
});