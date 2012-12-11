$(document).ready(function()
{
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
	$("img#slideBackButton").mouseover(function()
	{
		$(this).css("opacity",".86");
	});
	$("img#slideBackButton").mouseout(function()
	{
		$(this).css("opacity",".66");
	});	
	$("img#slideForwardButton").mouseover(function()
	{
		$(this).css("opacity",".86");
	});
	$("img#slideForwardButton").mouseout(function()
	{
		$(this).css("opacity",".66");
	});
});