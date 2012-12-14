$(document).ready(function()
{
	$('.slideShow').cycle({ 
    	fx:    'fade', 
    	speed:  1250,
    	next:   '.slideBackButton', 
    	prev:   '.slideForwardButton' 
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
});