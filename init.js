var app = app || {vars:{},u:{}}; //make sure app exists.
app.rq = app.rq || []; //ensure array is defined. rq = resource queue.




//app.rq.push(['extension',0,'convertSessionToOrder','extensions/checkout_passive/extension.js']);
app.rq.push(['extension',0,'convertSessionToOrder','extensions/checkout_nice/extension.js']);
app.rq.push(['extension',0,'store_checkout','extensions/store_checkout.js']);
app.rq.push(['extension',0,'store_prodlist','extensions/store_prodlist.js']);
app.rq.push(['extension',0,'store_navcats','extensions/store_navcats.js']);
app.rq.push(['extension',0,'store_search','extensions/store_search.js']);
app.rq.push(['extension',0,'store_product','extensions/store_product.js']);
app.rq.push(['extension',0,'store_cart','extensions/store_cart.js']);
app.rq.push(['extension',0,'store_crm','extensions/store_crm.js']);
app.rq.push(['extension',0,'myRIA','quickstart.js','startMyProgram']);
app.rq.push(['extension',0,'pogs_blueCollar','extensions/_pogs_extension.js','startExtension']);

app.rq.push(['extension',1,'analytics_google','extensions/analytics_google.js','startExtension']);
//app.rq.push(['extension',1,'bonding_buysafe','extensions/bonding_buysafe.js','startExtension']);
//app.rq.push(['extension',1,'powerReviews','extensions/reviews_powerreviews.js','startExtension']);
//app.rq.push(['extension',0,'magicToolBox','extensions/imaging_magictoolbox.js','startExtension']); // (not working yet - ticket in to MTB)


//spec_LLTRSHIRT017_0
//add tabs to product data.
//tabs are handled this way because jquery UI tabs REALLY wants an id and this ensures unique id's between product
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var safePID = app.u.makeSafeHTMLId(P.pid); //can't use jqSelector because productTEmplate_pid still used makesafe. planned Q1-2012 update ###
	var $tabContainer = $( ".tabbedProductContent",$('#productTemplate_'+safePID));
		if($tabContainer.length)	{
			if($tabContainer.data("tabs")){} //tabs have already been instantiated. no need to be redundant.
			else	{
				$("div.tabContent",$tabContainer).each(function (index) {
					$(this).attr("id", "spec_"+safePID+"_" + index.toString());
					})
				$(".tabs li a",$tabContainer).each(function (index) {
					$(this).attr('id','href_'+safePID+"_" + index.toString());
					$(this).attr("href", "#spec_"+safePID+"_" + index.toString());
					});
				$tabContainer.localtabs();
				}
			}
		else	{} //couldn't find the tab to tabificate.
	
	
	
	//*****CUSTOMIZER FUNCTIONALITY****	
	var $context = $(app.u.jqSelector('#',P.parentID));
	app.u.dump(safePID);
	if(safePID === "OVERALLSTEST1"){
		$(".customBut").show();
		
		$("<div class='customizerMenu'>"
			+ "<div class='customizerCatCont' onClick='app.ext.pogs_blueCollar.a.toggleHideShowStriping()'>"
			+ "<label>Reflective Striping</label><label class='floatRight customizerSectionClosedStripe displayNone'>&#9664;</label><label class='floatRight customizerSectionOpenStripe'>&#9660;</label></div>"
			+ "<div class='stipeCustomizer'></div>"
			+ "<div class='customizerCatCont' onClick='app.ext.pogs_blueCollar.a.toggleHideShowEmbroidery()'>"
			+ "<label>Embrodiery/Logos</label><label class='floatRight customizerSectionClosedEmbroid displayNone'>&#9664;</label><label class='floatRight customizerSectionOpenEmbroid'>&#9660;</label></div>"
			+ "   <div class='embroideryCustomizer'>"
			+ "     <div class='embroideryCont'>"
			+ "			<div class='floatLeft clearLeft'>"
			+ "		 		<label class='floatLeft'>Left Chest Pocket</label><input type='checkbox' class='leftPocket' onClick='app.ext.pogs_blueCollar.a.toggleHideShowLeftPocket()' />"
			+ " 	 		<div class='leftPocketCont'>"
			+ "					<input type='radio' class='lpRadioEmbroid' name='lpradio' value='embroidery'>Embroidery<br>"
			+ "					<input type='radio' class='lpRadioLogo' name='lpradio' value='logo' onClick='app.ext.pogs_blueCollar.a.toggleHideShowLeftPocketLogo()'>Logo"
			+ "					<div class='leftPocketEmbroidCont'></div>"
			+ "					<div class='leftPocketLogoCont'></div>"
			+ "				</div>"
			+ "			</div>"
			+ "			<div class='floatLeft clearLeft'>"
			+ "	 	 		<label class='floatLeft'>Right Chest Pocket</label><input type='checkbox' class='rightPocket' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightPocket()' />"
			+ "	     		<div class='rightPocketCont'>"
			+ "					<input type='radio' class='rpRadioEmbroid' name='rpradio' value='embroidery' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightPocketEmbroid()'>Embroidery<br>"
			+ "					<input type='radio' class='rpRadioLogo' name='rpradio' value='logo' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightPocketLogo()'>Logo"
			+ "					<div class='rightPocketEmbroidCont'></div>"
			+ "					<div class='rightPocketLogoCont'></div>"
			+ "				</div>"
			+ "			</div>"
			+ "			<div class='floatLeft clearLeft'>"
			+ "		 		<label class='floatLeft'>Left Shoulder</label><input type='checkbox' class='leftShoulder' onClick='app.ext.pogs_blueCollar.a.toggleHideShowLeftShoulder()' />"
			+ "   	 		<div class='leftShoulderCont'>"
			+ "					<input type='radio' class='lsRadioEmbroid' name='lsradio' value='embroidery' onClick='app.ext.pogs_blueCollar.a.toggleHideShowLeftShoulderEmbroid()'>Embroidery<br>"
			+ "					<input type='radio' class='lsRadioLogo' name='lsradio' value='logo' onClick='app.ext.pogs_blueCollar.a.toggleHideShowLeftShoulderLogo()'>Logo"
			+ "					<div class='leftShoulderEmbroidCont'></div>"
			+ "					<div class='leftShoulderLogoCont'></div>"
			+ "				</div>"
			+ "			</div>"
			+ "			<div class='floatLeft clearLeft'>"
			+ "	  	 		<label class='floatLeft'>Right Shoulder</label><input type='checkbox' class='rightShoulder' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightShoulder()' />"
			+ "      		<div class='rightShoulderCont'>"
			+ "					<input type='radio' class='rsRadioEmbroid' name='rsradio' value='embroidery' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightShoulderEmbroid()'>Embroidery<br>"
			+ "					<input type='radio' class='rsRadioLogo' name='rsradio' value='logo' onClick='app.ext.pogs_blueCollar.a.toggleHideShowRightShoulderLogo()'>Logo"
			+ "					<div class='rightShoulderEmbroidCont'></div>"
			+ "					<div class='rightShoulderLogoCont'></div>"
			+ "				</div>"
			+ "			</div>"
			+ "   	</div>"
			+ "     <div class='oldEmbroiderySogs'>"
			+ "     </div>"
			+ "  </div>"
			+ "</div>").appendTo('#JSONPogDisplay_OVERALLS-TEST1');
			
		$("#div_A9").appendTo(".stipeCustomizer");
		$("#div_AV").appendTo(".stipeCustomizer");
		$("#div_AN").appendTo(".stipeCustomizer");
		$("#div_AL").appendTo(".stipeCustomizer");
		$("#div_AJ").appendTo(".stipeCustomizer");
		$("#div_AP").appendTo(".stipeCustomizer");
		$("#div_AR").appendTo(".stipeCustomizer");
		$("#div_AY").appendTo(".stipeCustomizer");
		$("#div_B8").appendTo(".stipeCustomizer");
		$("#div_AX").appendTo(".stipeCustomizer");
		$("#div_B0").appendTo(".stipeCustomizer");
		$("#div_B1").appendTo(".stipeCustomizer");
		$("#div_AZ").appendTo(".stipeCustomizer");
		$("#div_B6").appendTo(".stipeCustomizer");
		$("#div_AK").appendTo(".stipeCustomizer");
		$("#div_B5").appendTo(".stipeCustomizer");
		$("#div_B7").appendTo(".stipeCustomizer");
		
		$("#div_AG").appendTo(".oldEmbroiderySogs");
		$("#div_AI").appendTo(".oldEmbroiderySogs");
		$("#div_AM").appendTo(".oldEmbroiderySogs");
		$("#div_AA").appendTo(".oldEmbroiderySogs");
		
		if($('.stipeCustomizer',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.stipeCustomizer',$context).data('collapseOrExpanded',true).append();
		}
		
	    if($('.embroideryCustomizer',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.embroideryCustomizer',$context).data('collapseOrExpanded',true).append();
		}
		
		
		if($('.leftPocketCont',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.leftPocketCont',$context).data('collapseOrExpanded',false).append();
		}
		$(".leftPocketCont").hide();
		
		if($('.rightPocketCont',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.rightPocketCont',$context).data('collapseOrExpanded',false).append();
		}
		$(".rightPocketCont").hide();
		
		if($('.leftShoulderCont',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.leftShoulderCont',$context).data('collapseOrExpanded',false).append();
		}
		$(".leftShoulderCont").hide();
		
		if($('.rightShoulderCont',$context).data('collapseOrExpanded')) {} //do nothing, content already added.
		else {
			$('.rightShoulderCont',$context).data('collapseOrExpanded',false).append();
		}
		$(".rightShoulderCont").hide();
		
		
		$(".customizerMenu").hide();
		
	}
	else{
		$(".customBut").hide();
	}
	//*****END CUSTOMIZER FUNCTIONALITY****	
		
}]);

app.rq.push(['script',0,(document.location.protocol == 'file:') ? app.vars.httpURL+'jquery/config.js' : app.vars.baseURL+'jquery/config.js']); //The config.js is dynamically generated.
app.rq.push(['script',0,app.vars.baseURL+'model.js']); //'validator':function(){return (typeof zoovyModel == 'function') ? true : false;}}
app.rq.push(['script',0,app.vars.baseURL+'includes.js']); //','validator':function(){return (typeof handlePogs == 'function') ? true : false;}})
app.rq.push(['script',1,app.vars.baseURL+'jeditable.js']); //used for making text editable (customer address). non-essential. loaded late.
app.rq.push(['script',0,app.vars.baseURL+'controller.js']);

//sample of an onDeparts. executed any time a user leaves this page/template type.
app.rq.push(['templateFunction','homepageTemplate','onDeparts',function(P) {app.u.dump("just left the homepage")}]);


//group any third party files together (regardless of pass) to make troubleshooting easier.
app.rq.push(['script',0,(document.location.protocol == 'https:' ? 'https:' : 'http:')+'//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.js']);


/*
This function is overwritten once the controller is instantiated. 
Having a placeholder allows us to always reference the same messaging function, but not impede load time with a bulky error function.
*/
app.u.throwMessage = function(m)	{
	alert(m); 
	}

app.u.howManyPassZeroResourcesAreLoaded = function(debug)	{
	var L = app.vars.rq.length;
	var r = 0; //what is returned. total # of scripts that have finished loading.
	for(var i = 0; i < L; i++)	{
		if(app.vars.rq[i][app.vars.rq[i].length - 1] === true)	{
			r++;
			}
		if(debug)	{app.u.dump(" -> "+i+": "+app.vars.rq[i][2]+": "+app.vars.rq[i][app.vars.rq[i].length -1]);}
		}
	return r;
	}


//gets executed once controller.js is loaded.
//check dependencies and make sure all other .js files are done, then init controller.
//function will get re-executed if not all the scripts in app.vars.scripts pass 1 are done loading.
//the 'attempts' var is incremented each time the function is executed.

app.u.initMVC = function(attempts){
//	app.u.dump("app.u.initMVC activated ["+attempts+"]");
	var includesAreDone = true;

//what percentage of completion a single include represents (if 10 includes, each is 10%).
	var percentPerInclude = (100 / app.vars.rq.length);  
	var resourcesLoaded = app.u.howManyPassZeroResourcesAreLoaded();
	var percentComplete = Math.round(resourcesLoaded * percentPerInclude); //used to sum how many includes have successfully loaded.
	//make sure precentage is never over 100
	if(percentComplete > 100 )	{
		percentComplete = 100;
		}
	
	$('#appPreViewProgressBar').val(percentComplete);
	$('#appPreViewProgressText').empty().append(percentComplete+"% Complete");

	if(resourcesLoaded == app.vars.rq.length)	{

		var clickToLoad = false;
		if(clickToLoad){
			$('#loader').fadeOut(1000);
			$('#clickToLoad').delay(1000).fadeIn(1000).click(function() {
				app.u.loadApp();
			});
		} else {
			app.u.loadApp();
			}
		}
	else if(attempts > 50)	{
		app.u.dump("WARNING! something went wrong in init.js");
		//this is 10 seconds of trying. something isn't going well.
		$('#appPreView').empty().append("<h2>Uh Oh. Something seems to have gone wrong. </h2><p>Several attempts were made to load the store but some necessary files were not found or could not load. We apologize for the inconvenience. Please try 'refresh' and see if that helps.<br><b>If the error persists, please contact the site administrator</b><br> - dev: see console.</p>");
		app.u.howManyPassZeroResourcesAreLoaded(true);
		}
	else	{
		setTimeout("app.u.initMVC("+(attempts+1)+")",250);
		}

	}

app.u.loadApp = function() {
//instantiate controller. handles all logic and communication between model and view.
//passing in app will extend app so all previously declared functions will exist in addition to all the built in functions.
//tmp is a throw away variable. app is what should be used as is referenced within the mvc.
		app.vars.rq = null; //to get here, all these resources have been loaded. nuke record to keep DOM clean and avoid any duplication.
		var tmp = new zController(app);
//instantiate wiki parser.


		app.renderFormats.optionsList = function($tag, data){
			//app.u.dump(data.value);
			for(var key in data.value){
				var $option = $('<div></div>');
				$option.append($('<span>'+data.value[key].prompt+': </span>'));
				$option.append($('<span>'+data.value[key].data+'</span>'));
				$tag.append($option);
				}
			}


		myCreole = new Parse.Simple.Creole();
}


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
app.u.appInitComplete = function(P)	{
	app.u.dump("Executing myAppIsLoaded code...");
	app.renderFormats.hrcImgFormat = function($tag, data)
		{
			if(data.value > 0)
			{
				$tag.attr("src","img/hazard-risk-category-" + data.value + ".png");
			}			
		}
	}




//don't execute script till both jquery AND the dom are ready.
$(document).ready(function(){
	app.u.handleRQ(0)
	});






