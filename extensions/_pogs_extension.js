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
						//UpdateMLBIcons = app.ext.pogs_blueCollar.a.updateMLBIcons;
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
			renderOptionCUSTOMSELECT: function(pog,safeid) {
				//	app.u.dump('BEGIN renderOptionSELECT for pog '+pog.id+' and safe id = '+safeid);
				var pogid = pog.id;
				var $parentDiv = $("<span \/>");
				var $selectList = $("<select>").attr({"id":"pog_"+safeid,"name":"pog_"+pogid}).addClass('zform_select');
				var i = 0;
				var len = pog.options.length;
				
				var selOption; //used to hold each option added to the select
				var optionTxt;
				
				//if the option is 'optional' AND has more than one option, add blank prompt. If required, add a please choose prompt first.
				if(len > 0)	{
					optionTxt = (pog['optional'] == 1) ?  "" :  "Please choose (required)";
					selOption = "<option value='' disable='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$selectList.append(selOption);
					}
				//adds options to the select list.
				while (i < len) {
					optionTxt = pog['options'][i]['prompt'];
					if(pog['options'][i]['p'])
					optionTxt += pogs.handlePogPrice(pog['options'][i]['p']); //' '+pog['options'][i]['p'][0]+'$'+pog['options'][i]['p'].substr(1);
					selOption = "<option value='"+pog['options'][i]['v']+"' id='option_"+pogid+""+pog['options'][i]['v']+"'>"+optionTxt+"<\/option>";
					$selectList.append(selOption);
					i++;
					}
				
				//	app.u.dump(" -> pogid: "+pogid);
				//	app.u.dump(" -> pog hint: "+pog['ghint']);
				$selectList.bind('change', function(){ app.u.dump($(this).val());}) //**fix me**
				$selectList.appendTo($parentDiv);
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
				return $parentDiv;
				},
			renderOptionCUSTOMBIGLIST: function(pog,safeid) {

				var pogid = pog.id;
				var selOptions = '';
				var lastOptGrp,selValues;
				var inc = 0;
				var len = pog.options.length;
				var $parentDiv = $("<span \/>");
				var $selectList = $("<select \/>").attr({"id":"pog_"+safeid,"name":"pog_"+pogid}).addClass("zform_select zform_biglist");
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
				$selectList.bind('change', function(){}) //**fix me**
				$selectList.append(selOptions).appendTo($parentDiv); //append optgroups.
				
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
				return $parentDiv;
				
				}, //renderOptionBIGLIST
	
			renderOptionCUSTOMIMGSELECT: function(pog,safeid) {
			//	app.u.dump('BEGIN renderOptionIMGSELECT for pog '+pog.id);
				var pogid = pog.id;
				var $parentDiv = $("<span \/>"); // = $("#div_"+safeid);
				var $selectList = $("<select>").attr({"id":"pog_"+safeid,"name":"pog_"+pogid}).addClass('zform_select').bind('change', function(e){
					var thumbnail = $("#pog_"+safeid+" option:selected").attr('data-thumbnail');
					$("#selectImg_"+safeid).attr('src',app.u.makeImage({"w":pog.width,"h":pog.height,"name":thumbnail,"b":"FFFFFF","tag":false,"lib":app.username,"id":"selectImg_"+safeid}));
					});
				var i = 0;
				var len = pog.options.length;
			
				var selOption; //used to hold each option added to the select
				var optionTxt;
			
			//if the option is 'optional' AND has more than one option, add blank prompt. If required, add a please choose prompt first.
				if(len > 0)	{
					optionTxt = (pog['optional'] == 1) ?  "" :  "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$selectList.append(selOption);
					}
			//adds options to the select list.
				while (i < len) {
					optionTxt = pog['options'][i]['prompt'];
					if(pog['options'][i]['p'])
						optionTxt += pogs.handlePogPrice(pog['options'][i]['p']); //' '+pog['options'][i]['p'][0]+'$'+pog['options'][i]['p'].substr(1);
					selOption = "<option value='"+pog['options'][i]['v']+"' data-thumbnail='"+pog['options'][i]['img']+"' id='option_"+pogid+""+pog['options'][i]['v']+"'>"+optionTxt+"<\/option>";
					$selectList.append(selOption);
					i++;
					}
				
				$selectList.bind('change', function(){}) //**fix me**
				$selectList.appendTo($parentDiv);
			
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
			
				$imageDiv = $('<div>').attr({"id":"imgSelect_"+safeid+"_img"}).addClass('imageselect_image');
				$imageDiv.html(app.u.makeImage({"w":pog.width,"h":pog.height,"name":"blank.gif","b":"FFFFFF","tag":true,"lib":app.username,"id":"selectImg_"+pogid}));
				$imageDiv.appendTo($parentDiv);
				app.u.dump('END renderOptionIMGSELECT for pog '+pog.id);
				return $parentDiv;
				},//renderOptionCUSTOMIMGSELECT
				
				renderOptionCUSTOMRADIO: function(pog,safeid)	{
					var pogid = pog.id;
				
					var $parentDiv = $("<span \/>"); // = $('#div_'+safeid);
					
				//display ? with hint in hidden div IF ghint is set
					if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
					
					var $radioInput; //used to create the radio button element.
					var radioLabel; //used to create the radio button label.
					var i = 0;
					var len = pog['options'].length;
					while (i < len) {
						radioLabel = "<label for='pog_id_"+safeid+"_value_"+pog['options'][i]['v']+"'>"+pog['options'][i]['prompt']+"<\/label>";
						$radioInput = $('<input>').attr({type: "radio", name: "pog_"+pogid, value: pog['options'][i]['v'], id: "pog_id_"+safeid+"_value_"+pog['options'][i]['v']});
						$parentDiv.append($radioInput).append(radioLabel);
						i++
						}
					return $parentDiv;
					},
					
					
	
			xinit : function(){
				this.addHandler("pogid","A0","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A1","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A2","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A3","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A5","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A6","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","A7","renderOptionCUSTOMSELECT");
				this.addHandler("pogid","QQ","renderOptionCUSTOMBIGLIST");
				this.addHandler("pogid","QQ","renderOptionCUSTOMIMGSELECT");
				this.addHandler("pogid","QQ","renderOptionCUSTOMRADIO");
			}
				
			},

////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			customizeProductOptions: function(){
				
				$(".customizeOptions").show();
				$(".customBut").hide();
				
			}
			/*
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
				*/
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
			/*
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
				*/
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