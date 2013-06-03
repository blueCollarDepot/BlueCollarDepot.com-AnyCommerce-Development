/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var pogs_blueCollar = function() {
	var r = {
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



		callbacks : {
	//executed when extension is loaded. should include any validation that needs to occur.
			init : {
				onSuccess : function()	{
					var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
					//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
					r = true;
					app.rq.push(['templateFunction','productTemplate','onCompletes', function(P) {
							app.ext.pogs_blueCollar.vars.prodContext = $(app.u.jqSelector('#',P.parentID));
							}]);
					return r;
					},
				onError : function()	{
	//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
	//you may or may not need it.
					app.u.dump('BEGIN app.ext.blueCollar.callbacks.init.onError');
					}
				},

			startExtension : {
				onSuccess : function() {
					//app.u.dump(typeof jQuery.fn.cycle);
					if(handlePogs){
						app.u.dump("Extending Pogs");

						$.extend(handlePogs.prototype,app.ext.pogs_blueCollar.variations);
						UpdateMLBIcons = app.ext.pogs_blueCollar.a.updateMLBIcons;
						}
					else {
						app.u.dump("Retrying Pog Extension");
						setTimeout(function(){app.ext.blueCollar.callbacks.startExtension.onSuccess()},250);
						}
					},
				onError : function() { 
					app.u.dump('BEGIN app.ext.blueCollar.callbacks.startExtension.onError');
					}
				}
			}, //callbacks

		variations : {
			renderOptionSELECT: function(pog) {
//	app.u.dump('BEGIN renderOptionSELECT for pog '+pog.id+' and safe id = '+safeid);
	var pogid = pog.id;
	var $parentDiv = $("<span \/>");
	var $selectList = $("<select>").attr({"name":pogid});
    var i = 0;
    var len = pog.options.length;

	var selOption; //used to hold each option added to the select
	var optionTxt;

//if the option is 'optional' AND has more than one option, add blank prompt. If required, add a please choose prompt first.
	if(len > 0)	{

		optionTxt = (pog['optional'] == 1) ?  "Please choose" :  "Please choose (required)";
		selOption = "<option value='' disable='disabled' selected='selected'>"+optionTxt+"<\/option>";
		$selectList.append(selOption);
		}
//adds options to the select list.
    while (i < len) {
		optionTxt = pog['options'][i]['prompt'];
		if(pog['options'][i]['p'])
			optionTxt += pogs.handlePogPrice(pog['options'][i]['p']); //' '+pog['options'][i]['p'][0]+'$'+pog['options'][i]['p'].substr(1);
			var sel_opt_price = pogs.handlePogPrice(pog['options'][i]['p']).replace("$", "").replace("+", "").replace(" ", "");
		selOption = "<option value='"+pog['options'][i]['v']+"' title='"+sel_opt_price+"'>"+optionTxt+"<\/option>";
		$selectList.append(selOption);
		i++;
		}

//	app.u.dump(" -> pogid: "+pogid);
//	app.u.dump(" -> pog hint: "+pog['ghint']);
	$selectList.appendTo($parentDiv);
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;
	},

// timer permitting, rewrite this. create an object for each optgroup and use that objects id to save options into.
// during each loop, add the optgroup id to a separate array and at the end, use that array to add each optgroup to selectlist. 
// may be a bit faster than this. cleaner too.
renderOptionBIGLIST: function(pog) {

	var pogid = pog.id;
	var selOptions = '';
	var lastOptGrp,selValues;
	var inc = 0;
    var len = pog.options.length;
	var $parentDiv = $("<span \/>");
	var $selectList = $("<select \/>").attr({"name":pogid}).addClass("zform_select zform_biglist");
//sets the first options on both select lists.
	$selectList.append("<option value='' disable='disabled' selected='selected'>Please Choose...<\/option>");

	//output ? with hint in hidden div IF ghint is set
//	if(pog['ghint'])
//		pogs.showHintIcon(pogid,pog['ghint']);

/*
create first optgroup.
These are here instead of in the while loop to save a lookup during each iteration. Otherwise we need to 
check if at iteration 1 (inc = 0) each time in the loop. this is gives us a tighter loop.
*/
	selValues = pog['options'][inc]['prompt'].split('|');
	lastOptGrp = selValues[0];
	selOptions += "<optgroup label='"+selValues[0]+"'>"; //add option to first dropdown list.
	while (inc < len) {

//selValues[0] = first dropdown prompt/opt group.
//selValues[1] = second dropdown prompt.
		selValues = pog['options'][inc]['prompt'].split('|');
		optGrp = selValues[0];

//at each 'change' of grouping, add the current group to the select list.
		if(optGrp != lastOptGrp)	{
			selOptions += "<\/optgroup><optgroup label='"+selValues[0]+"'>"; //add option to first dropdown list.
			}

		selOptions += "<option value='"+pog['options'][inc]['v']+"'>"+selValues[1]+"<\/option>\n";
		lastOptGrp = selValues[0]
		inc += 1;
		}
	selOptions += "<\/optgroup>";

//	app.u.dump(selOptions);

	$selectList.append(selOptions).appendTo($parentDiv); //append optgroups.

	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;

	}, //renderOptionBIGLIST



//upgraded to jquery.
renderOptionIMGSELECT: function(pog) {
//	app.u.dump('BEGIN renderOptionIMGSELECT for pog '+pog.id);
	var pogid = pog.id;
	var $parentDiv = $("<span \/>").addClass('imgSelectContainer');
	var $selectList = $("<select>").attr({"name":pogid}).addClass('zform_select').bind('change', function(e){
		var thumbnail = $("option:selected",$(this)).attr('data-thumbnail');
		var img_txt = app.u.makeImage({"name":"","lib":app.username})
		$(this).closest('.imgSelectContainer').find('img').attr('src',app.u.makeImage({"name":thumbnail,"tag":false,"lib":app.username})).attr({"title":img_txt});
		});
    var i = 0;
    var len = pog.options.length;

	var selOption; //used to hold each option added to the select
	var optionTxt;

//if the option is 'optional' AND has more than one option, add blank prompt. If required, add a please choose prompt first.
	if(len > 0)	{
		optionTxt = (pog['optional'] == 1) ?  "Please choose" :  "Please choose (required)";
		selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
		$selectList.append(selOption);
		}
//adds options to the select list.

    while (i < len) {
		optionTxt = pog['options'][i]['prompt'];
		if(pog['options'][i]['p'])
			optionTxt += pogs.handlePogPrice(pog['options'][i]['p']); //' '+pog['options'][i]['p'][0]+'$'+pog['options'][i]['p'].substr(1);
			img_sel_price = pogs.handlePogPrice(pog['options'][i]['p']).replace("$", "").replace("+", "").replace(" ", "");
		selOption = "<option name='"+img_sel_price+"' value='"+pog['options'][i]['v']+"' data-thumbnail='"+pog['options'][i]['img']+"' id='option_"+pogid+""+pog['options'][i]['v']+"'>"+optionTxt+"<\/option>";


		$selectList.append(selOption);
		i++;
		}

	$selectList.appendTo($parentDiv);

	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}

	$imageDiv = $('<div>').addClass('imageselect_image');
	$imageDiv.html(app.u.makeImage({"w":pog.width,"h":pog.height,"name":"blank.gif","b":"FFFFFF","tag":true,"lib":app.username,"id":"selectImg_"+pogid}));
	$imageDiv.appendTo($parentDiv);
//	app.u.dump('END renderOptionIMGSELECT for pog '+pog.id);
	return $parentDiv;
	},

//upgraded to jquery. needs css love.
renderOptionRADIO: function(pog)	{
	var pogid = pog.id;

	var $parentDiv = $("<span \/>");

//display ? with hint in hidden div IF ghint is set
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
    var i = 0;
    var len = pog['options'].length;
	while (i < len) {
		$parentDiv.append($('<input>').attr({type: "radio", name: pogid, value: pog['options'][i]['v']}).after(pog['options'][i]['prompt']).wrap($("<label \/>")));
		i++;
		}
	return $parentDiv;
	},


//upgraded to jquery.
renderOptionCB: function(pog) {
	var pogid = pog.id;
	var $parentDiv = $("<span \/>");
	$('<input>').attr({type: "checkbox", name: pogid, value: 'ON'}).appendTo($parentDiv);
//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
	$('<input>').attr({type: "hidden", name: "pog_"+pogid+"_cb", value: '1'}).appendTo($parentDiv);

	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;

	},



//upgraded to jquery.
renderOptionHIDDEN: function(pog) {
	var pogid = pog.id;
//hidden attributes don't need a label. !!!
//cant set the value to null in IE because it will literally write out 'undefined'. this statement should handle undefined, defined and blank just fine.
	var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";
	var $parentDiv = $("<span \/>");
//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
	$parentDiv.append($('<input>').attr({type: "hidden", name: pogid, value: defaultValue}));

	return $parentDiv;
	},


//upgraded to jquery.
renderOptionATTRIBS: function(pog)	{
//attributes are used with finders. They don't do anything and they don't require a form element in the add to cart.. BUT we may want to do something merchant specific, so here it is.... to overide...
//	document.getElementById("div_"+safeid).style.display = 'none'; !!!
	},



//upgraded to jquery.
renderOptionTEXT: function(pog) {
	var pogid = pog.id;
//cant set the value to null in IE because it will literally write out 'undefined'. this statement should handle undefined, defined and blank just fine.
	var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";
	var $parentDiv = $("<span \/>");
//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
	var $textbox = $('<input>').attr({type: "text", name: pogid, value: defaultValue});
	if(pog['maxlength'])	{
		$textbox.keyup(function(){
			if (this.value.length > (pog['maxlength'] - 1)) // if too long...trim it!
		        this.value = this.value.substring(0, pog['maxlength']);
			});
		}
	$parentDiv.append($textbox);
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;
	},




//upgraded to jquery.
renderOptionCALENDAR: function(pog) {
	var pogid = pog.id;

	var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";

	var $parentDiv = $("<span \/>");
	var $textbox = $('<input>').attr({type: "text", name:pogid, value: defaultValue}).addClass('zform_textbox').datepicker({altFormat: "DD, d MM, yy"});
	$parentDiv.append($textbox);

	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}

//if the rush prompt is set, display it under the form.
	if(pog.rush_prompt)	{
		$parentDiv.append("<div class='zhint'>"+pog['rush_prompt']+"<\/div>");
		}

	return $parentDiv;
	},






renderOptionNUMBER: function(pog) {
	var pogid = pog.id;
//cant set the value to null in IE because it will literally write out 'undefined'. this statement should handle undefined, defined and blank just fine.
	var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";
	var $parentDiv = $("<span \/>");
//right now, 'number' isn't widely supported, so a JS regex is added to strip non numeric characters
	var $textbox = $('<input>').attr({type: "number", name: pogid, value: defaultValue}).keyup(function(){
		this.value = this.value.replace(/[^0-9]/g, '');
		});

	if(pog['max'])
		$textbox.attr('max',pog['max']);
	if(pog['min'])
		$textbox.attr('max',pog['max']);

	$parentDiv.append($textbox);
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;

	},





renderOptionTEXTAREA: function(pog) {
	var pogid = pog.id;
//cant set the value to null in IE because it will literally write out 'undefined'. this statement should handle undefined, defined and blank just fine.
	var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";
	var $parentDiv = $("<span \/>");
//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
	var $textbox = $('<textarea>').attr({name: pogid, value: defaultValue});
	$parentDiv.append($textbox);
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
	return $parentDiv;

	},




//needs testing.
renderOptionREADONLY: function(pog) {
	return $("<span class='zsmall'>"+pog['default']+"<\/span>");
	},



//create an override for IMGGRID to be used for webapp. no radio button, just thumbnails that, on click, will set a hidden input. !!!!!!!!!!!!!
//also explore frameworks (jqueryui or jquerymobile ?) for better handling of form display.

renderOptionIMGGRID: function(pog)	{

	var pogid = pog.id;

	var $parentDiv = $("<span \/>");
	if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}

	var $radioInput; //used to create the radio button element.
	var radioLabel; //used to create the radio button label.
	var thumbnail; //guess what this holds
	var up_thumbnail;
    var i = 0;
    var len = pog['options'].length;
	while (i < len) {
		thum_tit = pogid+"_"+pog['options'][i]['v'];
		img_price = pogs.handlePogPrice(pog['options'][i]['p']).replace("$", "").replace("+", "").replace(" ", "");
		thumbnail = app.u.makeImage({"w":pog.width,"h":pog.height,"name":pog['options'][i]['img'],"b":"FFFFFF","tag":true,"lib":app.username});
		thumbnail_up = $(thumbnail).attr({"title":thum_tit, "name":img_price});
		radioLabel = "<label>"+pog['options'][i]['prompt']+"<\/label>";
		$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['options'][i]['v'], class:"img_"+thum_tit});
		$parentDiv.append(thumbnail_up).append($radioInput)/*.append(radioLabel)*/.wrap("<span class='floatLeft'><\/span>");
		i++
		}

	return $parentDiv;

	},


renderOptionUNKNOWN: function(pog) {
	return("UNKNOWN "+pog.type+": "+pog.prompt+" / "+pog.id);
	},

/*
// !!! this'll need fixin
showHintIcon : function(pogid,pogHint)	{
//	app.u.dump("BEGIN variations.showHintIcon");
	return "<span class='ghint_qmark_container'><a href='#' onclick='$(this).parent().next().toggle(); return false;' class='ghint_qmark'>?<\/a></span><div style='display:none;' class='zhint'>"+pogHint+"</div>";
	},






//there's a lot of logic with how price should be displayed.  This is a dumbed down version.
//app.u.formatMoney is not used here because the text is formatted by the merchant (we leave it alone).
 handlePogPrice : function(P)	{
	var price;
//Puts the + sign, if present, in the correct spot
	if(P.charAt(0) == '+')	{
		price = " +$"+P.substr(1);
		}
//Puts the - sign, if present, in the correct spot
	else if (P.charAt(0) == "-")
		price = " -$"+P.substr(1);
//If a $ is already present, do not add one.
	else if (P.charAt(0) == "$")
		price = " "+P;
	else
		price = " $"+P;
	return price;

	},

renderOption: function(pog,pid) {
	var pogid = pog.id;

//add a div to the dom that surrounds the pog
	var $formFieldDiv = $("<div>").addClass("zform_div").addClass("pogType_"+pog.type);
	var $optionObj; //what is returned from the eval (the entire options object).
//if ghint is set, use that as the title attribute, otherwise use the prompt.
	var labelTitle = (pog.ghint) ? pog.ghint : pog.prompt;


//create the label (prompt) for the form input and make it a child of the newly created div.
	var $formFieldLabel = $('<label>').attr({"title":labelTitle}).text(pog.prompt);

	$formFieldDiv.append($formFieldLabel);

//Push the new div into a div with id JSONPogDisplay as a new child.
//	var $displayObject = $("#JSONPogDisplay_"+pid);
//	$displayObject.append($formFieldDiv);   /// NOTE the form ID on this should probably be auto-generated from the element ID.

    if (this.handlers["pogid."+pogid]) {
      $optionObj = eval("this."+this.handlers["pogid."+pogid]+"(pog)");
      }
    else if (this.handlers["type."+pog.type]) {
      $optionObj = eval("this."+this.handlers["type."+pog.type]+"(pog)");
      }
    else {
      $optionObj = eval("this."+this.handlers["unknown."]+"(pog)");
      }
	$formFieldDiv.append($optionObj);
	return $formFieldDiv;
  }

	});
	*/
	
	
			xinit : function(){
				this.addHandler("type","text","renderOptionTEXT");
				this.addHandler("type","radio","renderOptionRADIO");
				this.addHandler("type","select","renderOptionSELECT");
				this.addHandler("type","imgselect","renderOptionIMGSELECT");
				this.addHandler("type","number","renderOptionNUMBER");
				this.addHandler("type","cb","renderOptionCB");
				this.addHandler("type","attribs","renderOptionATTRIBS");
				this.addHandler("type","readonly","renderOptionREADONLY");
				this.addHandler("type","hidden","renderOptionHIDDEN");
				this.addHandler("type","assembly","renderOptionHIDDEN");
				this.addHandler("type","textarea","renderOptionTEXTAREA");
				this.addHandler("type","imggrid","renderOptionIMGGRID");
				this.addHandler("type","calendar","renderOptionCALENDAR");
				this.addHandler("type","biglist","renderOptionBIGLIST");
				this.addHandler("unknown","","renderOptionUNKNOWN");
				}
			},

////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			openIconDetails : function(team, $target){
				var queryString = "?iconname=" + team ;
				var jsonp_url = "http://www.labeldaddy.com/widget/getIcons.php" + queryString + "&jsoncallback=?";
				$.getJSON(jsonp_url, function(data) {
					$target.empty().append($(data.html));
					});
				return false;
				},
			updateMLBIcons : function(iconset){
				$('input[name=CH]', app.ext.pogs_blueCollar.vars.prodContext).val(iconset);
				app.ext.pogs_blueCollar.u.showLabelPreview();
				}
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			showLabelPreview : function(){

				var labelName = $('input[name=CJ]', app.ext.pogs_blueCollar.vars.prodContext).val();
				var labelLastName = $('input[name=CK]', app.ext.pogs_blueCollar.vars.prodContext).val();
				var labelIcon = $('input[name=CH]', app.ext.pogs_blueCollar.vars.prodContext).val();


				var queryString = "?labelName=" + labelName + "&labellastName=" + labelLastName + "&labelicon=" + labelIcon ;
				var jsonp_url = "http://www.labeldaddy.com/widget/MLBPackWidget.php" + queryString + "&jsoncallback=?";
				$.getJSON(jsonp_url, function(data) {
					$('.labelPreview', app.ext.pogs_blueCollar.vars.prodContext).html(data.html);
					});
				}
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			}, //e [app Events]
		vars : {
			prodContext : undefined
			}
		} //r object.

	return r;
	}