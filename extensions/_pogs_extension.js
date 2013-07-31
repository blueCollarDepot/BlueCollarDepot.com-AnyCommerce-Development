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
				
				
				renderOptionCUSTOMSELECTDROPDOWN: function(pog,safeid) {
				//	app.u.dump('BEGIN renderOptionCUSTOMSELECTCOLOR for pog '+pog.id+' and safe id = '+safeid);
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
				var colorSelectValue = $selectList.val();
				$selectList.bind('change', function(){ 
					app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
				})
				$selectList.appendTo($parentDiv);
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
				return $parentDiv;
				}, //END renderOptionCUSTOMSELECTDROPDOWN
				
				
				
				
				renderOptionCUSTOMCHECKBOX: function(pog,safeid) {
					var pogid = pog.id;
					var $parentDiv = $("<span \/>"); // = $('#div_'+safeid);
					var $checkbox = $('<input>').attr({type: "checkbox", name: "pog_"+pogid, value: 'OFF', id: "pog_"+safeid});
					$checkbox.val("OFF");
					//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
					var $hidden = $('<input>').attr({type: "hidden", name: "pog_"+pogid+"_cb", value: '0', id: "pog_"+safeid});
					$checkbox.bind('change', function(){
						if($checkbox.val() === "OFF"){
							$checkbox.val("ON");
							//app.u.dump("Checkbox is off. Switching on. Checkbox = " + $checkbox.val());
							app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
						}
						else{
							$checkbox.val("OFF");
							//app.u.dump("Checkbox is on. Switching off. Checkbox = " + $checkbox.val());
							app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
						}
					})
					$parentDiv.append($checkbox).append($hidden);
					if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
					return $parentDiv;
				},//END renderOptionCUSTOMCHECKBOX
				
				
				
				
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
				this.addHandler("pogid","A3","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","A9","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","AJ","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AV","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AL","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AN","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AP","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AR","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AY","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B8","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AG","");
				this.addHandler("pogid","AI","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AM","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AA","renderOptionCUSTOMCHECKBOX");
			}
				
			},

////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			customizeProductOptions: function(){
				
				//app.u.dump("Start customizeProductOptions onClick function");
				if($(".customBut").val() === "showCustomizer"){
					//app.u.dump("value equals show customizer. Showing customizer");
					$(".prodBigImage").hide();
					$(".customizerImageCont").show();
					$(".customizerMenu").show();
					$(".prodThumbs").hide();
					
					$("#div_A9").show();
					$("#div_AG").show();
					$("#div_AJ").show();
					$("#div_AV").show();
					$("#div_AL").show();
					$("#div_AI").show();
					$("#div_AM").show();
					$("#div_AN").show();
					$("#div_AA").show();
					$("#div_AP").show();
					$("#div_AR").show();
					$("#div_AY").show();
					$("#div_B8").show();
					
					$(".customBut").html("Hide Customizer");
					$(".customBut").val("hideCustomizer");
					
				}
				else{
					if($(".customBut").val() === "hideCustomizer"){
						//app.u.dump("value equals hide customizer. Hiding customizer");
						$(".prodBigImage").show();
						$(".customizerImageCont").hide();
						$(".customizerMenu").hide();
						$(".prodThumbs").show();
						
						$("#div_A9").hide();
						$("#div_AG").hide();
						$("#div_AJ").hide();
						$("#div_AV").hide();
						$("#div_AL").hide();
						$("#div_AI").hide();
						$("#div_AM").hide();
						$("#div_AN").hide();
						$("#div_AA").hide();
						$("#div_AP").hide();
						$("#div_AR").hide();
						$("#div_AY").hide();
						$("#div_B8").hide();
						
						$(".customBut").html("Show Customizer");
						$(".customBut").val("showCustomizer");
					}
				}
			},
			
			UpdateCustomizerImage: function(){
				
				var c=document.getElementById("customizerCanvas");
				var ctx=c.getContext("2d");
				ctx.clearRect(0,0,500,500);
				
				//****CUSTOMIZER IMAGE DRAWING FUNCTIONS****//
				//**DRAW MAIN PRODUCT IMAGE**//
				var colorSelectValue = $("#pog_A3").val();
				switch(colorSelectValue)
				{
					case "00":
						var prodImg=document.getElementById("ppCustomizerColorTan");
						ctx.drawImage(prodImg,0,0);
						break; 
						
					case "02":
						var prodImg=document.getElementById("ppCustomizerColorBlue");
						ctx.drawImage(prodImg,0,0);
						break; 
						
					case "04":
						var prodImg=document.getElementById("ppCustomizerColorNavyBlue");
						ctx.drawImage(prodImg,0,0);
						break; 
						
					case "05":
						var prodImg=document.getElementById("ppCustomizerColorOrange");
						ctx.drawImage(prodImg,0,0);
						break;
						
					case "06":
						var prodImg=document.getElementById("ppCustomizerColorBlue");
						ctx.drawImage(prodImg,0,0);
						break; 
						
					case "0D":
						var prodImg=document.getElementById("ppCustomizerColorNavyBlue");
						ctx.drawImage(prodImg,0,0);
						break; 
						
					default: 
						var prodImg=document.getElementById("ppCustomizerColorTan");
						ctx.drawImage(prodImg,0,0);
						break; 
				}
				//**END MAIN IMAGE**//
				
				
				//**SELECT STRIPE TYPE**//
				var stripeTypeSelectValue = $("#pog_A9").val();
				switch(stripeTypeSelectValue)
				{
					case "00":
						$("#pog_A9").data('stripeType',"yellow2");
						break; 
						
					case "01":
						$("#pog_A9").data('stripeType',"yellSilvYell2");
						break; 
						
					case "02":
						$("#pog_A9").data('stripeType',"silver2");
						break; 
					
					case "03":
						$("#pog_A9").data('stripeType',"yellow1");
						break;
						
					case "04":
						$("#pog_A9").data('stripeType',"orange1");
						break;
						
					case "05":
						$("#pog_A9").data('stripeType',"silver1");
						break;
				}
				//**END STRIPE TYPE**//
				
				
				//**ADD SIDESEAM WAIST TO BOTTOM STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Sideseam");
								ctx.drawImage(stripeImg,50,234);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Sideseam");
								ctx.drawImage(stripeImg,50,234);
							}
							break; 
						
						case "silver2":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("silv2Sideseam");
								ctx.drawImage(stripeImg,48,234);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Sideseam");
								ctx.drawImage(stripeImg,50,234);
							}
							break;
						
						case "orange1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("orange1Sideseam");
								ctx.drawImage(stripeImg,50,234);
							}
							break;
						
						case "silver1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("silv1Sideseam");
								ctx.drawImage(stripeImg,50,234);
							}
							break;
					}
				}
				//**END SIDESEAM WAIST TO BOTTOM STRIPE**//
				
				
				//**ADD CALVES STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AJ').val());
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("yellow2CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("yellSilvYell2CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break; 
						
						case "silver2":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("silv2Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("silv2CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("yellow1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break;
						
						case "orange1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("orange1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("orange1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break;
						
						case "silver1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("silv1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("silv1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
							}
							break;
					}
				}
				//**END CALVES STRIPE**//
				
				
				//**ADD FOREARM STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AJ').val());
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("yellow2ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("yellSilvYell2ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break; 
						
						case "silver2":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("silv2Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("silv2ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("yellow1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break;
						
						case "orange1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("orange1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("orange1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break;
						
						case "silver1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("silv1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("silv1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
							}
							break;
					}
				}
				//**END FOREARM STRIPE**//
				
				
				//**ADD KNEE STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AJ').val());
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("yellow2KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("yellSilvYell2KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break; 
						
						case "silver2":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("silv2Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("silv2KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("yellow1KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break;
						
						case "orange1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("orange1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("orange1KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break;
						
						case "silver1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("silv1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("silv1KneesBack");
								ctx.drawImage(stripeImg,312,355);
							}
							break;
					}
				}
				//**END KNEE STRIPE**//
				
				
				//**ADD THIGH STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("yellow2ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("yellSilvYell2ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break; 
						
						case "silver2":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("silv2Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("silv2ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("yellow1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break;
						
						case "orange1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("orange1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("orange1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break;
						
						case "silver1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("silv1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("silv1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
							}
							break;
					}
				}
				//**END THIGH STRIPE**//
				
				
				//**ADD PANT BOTTOM CUFF STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("yellow2PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("yellow2PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("yellSilvYell2PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break; 
						
						case "silver2":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("silv2PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("silv2PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("yellow1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("yellow1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break;
						
						case "orange1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("orange1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("orange1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break;
						
						case "silver1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("silv1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("silv1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
							}
							break;
					}
				}
				//**END PANT BOTTOM CUFF STRIPE**//
				
				
				//**ADD FULL X ON BACK STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("yellow2FullXBack");
								ctx.drawImage(stripeImg,302,27);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2FullXBack");
								ctx.drawImage(stripeImg,302,27);
							}
							break; 
						
						case "silver2":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("silv2FullXBack");
								ctx.drawImage(stripeImg,303,27);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("yellow1FullXBack");
								ctx.drawImage(stripeImg,302,27);
							}
							break;
						
						case "orange1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("orange1FullXBack");
								ctx.drawImage(stripeImg,305,32);
							}
							break;
						
						case "silver1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("silv1FullXBack");
								ctx.drawImage(stripeImg,303,29);
							}
							break;
					}
				}
				//**END FULL X ON BACK STRIPE**//
				
				
				//**ADD ALL AROUND COVERALL STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("yellow2AllAround");
								ctx.drawImage(stripeImg,58,152);
								var stripeImg=document.getElementById("yellow2AllAroundBack");
								ctx.drawImage(stripeImg,310,147);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2AllAround");
								ctx.drawImage(stripeImg,58,152);
								var stripeImg=document.getElementById("yellSilvYell2AllAroundBack");
								ctx.drawImage(stripeImg,310,148);
							}
							break; 
						
						case "silver2":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("silv2AllAround");
								ctx.drawImage(stripeImg,58,152);
								var stripeImg=document.getElementById("silv2AllAroundBack");
								ctx.drawImage(stripeImg,310,150);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("yellow1AllAround");
								ctx.drawImage(stripeImg,58,160);
								var stripeImg=document.getElementById("yellow1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
							}
							break;
						
						case "orange1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("orange1AllAround");
								ctx.drawImage(stripeImg,58,161);
								var stripeImg=document.getElementById("orange1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
							}
							break;
						
						case "silver1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("silv1AllAround");
								ctx.drawImage(stripeImg,58,161);
								var stripeImg=document.getElementById("silv1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
							}
							break;
					}
				}
				//**END ALL AROUND COVERALL STRIPE**//
				
				
				
			},
			//****END CUSTOMIZER IMAGE DRAWING FUNCTIONS****//
			
			toggleHideShowStriping : function(){
					if($('.stipeCustomizer').data('collapseOrExpanded') === true){
						$('.stipeCustomizer').slideUp(1000);
						$(".customizerSectionClosedStripe").show();
						$(".customizerSectionOpenStripe").hide();
						$('.stipeCustomizer').data('collapseOrExpanded',false).append();
					}
					else{
						$('.stipeCustomizer').slideDown(1000);
						$(".customizerSectionClosedStripe").hide();
						$(".customizerSectionOpenStripe").show();
						$('.stipeCustomizer').data('collapseOrExpanded',true).append();
					}
				},
			toggleHideShowEmbroidery  : function(){
					if($('.embroideryCustomizer').data('collapseOrExpanded') === true){
						$('.embroideryCustomizer').slideUp(1000);
						$(".customizerSectionClosedEmbroid").show();
						$(".customizerSectionOpenEmbroid").hide();
						$('.embroideryCustomizer').data('collapseOrExpanded',false).append();
					}
					else{
						$('.embroideryCustomizer').slideDown(1000);
						$(".customizerSectionClosedEmbroid").hide();
						$(".customizerSectionOpenEmbroid").show();
						$('.embroideryCustomizer').data('collapseOrExpanded',true).append();
					}
				},
				
			//**EMBRROIDERY/LOGO CLICK FUNCTIONS**//
			toggleHideShowLeftPocket : function(){
					if($('.leftPocketCont').data('collapseOrExpanded') === true){
						$('.leftPocketCont').slideUp(1000);
						$('.leftPocketCont').data('collapseOrExpanded',false).append();
						$(".lpRadioEmbroid").prop('checked', false);
						$(".lpRadioLogo").prop('checked', false);
					}
					else{
						$('.leftPocketCont').slideDown(1000);
						$('.leftPocketCont').data('collapseOrExpanded',true).append();
					}
				},
			toggleHideShowRightPocket : function(){
					if($('.rightPocketCont').data('collapseOrExpanded') === true){
						$('.rightPocketCont').slideUp(1000);
						$('.rightPocketCont').data('collapseOrExpanded',false).append();
						$(".rpRadioEmbroid").prop('checked', false);
						$(".rpRadioLogo").prop('checked', false);
					}
					else{
						$('.rightPocketCont').slideDown(1000);
						$('.rightPocketCont').data('collapseOrExpanded',true).append();
					}
				},
			toggleHideShowLeftShoulder : function(){
					if($('.leftShoulderCont').data('collapseOrExpanded') === true){
						$('.leftShoulderCont').slideUp(1000);
						$('.leftShoulderCont').data('collapseOrExpanded',false).append();
						$(".lsRadioEmbroid").prop('checked', false);
						$(".lsRadioLogo").prop('checked', false);
					}
					else{
						$('.leftShoulderCont').slideDown(1000);
						$('.leftShoulderCont').data('collapseOrExpanded',true).append();
					}
				},
			toggleHideShowRightShoulder : function(){
					if($('.rightShoulderCont').data('collapseOrExpanded') === true){
						$('.rightShoulderCont').slideUp(1000);
						$('.rightShoulderCont').data('collapseOrExpanded',false).append();
						$(".rsRadioEmbroid").prop('checked', false);
						$(".rsRadioLogo").prop('checked', false);
					}
					else{
						$('.rightShoulderCont').slideDown(1000);
						$('.rightShoulderCont').data('collapseOrExpanded',true).append();
					}
				},
				
				toggleHideShowLeftPocketEmbroid : function(){
					if($('.lpRadioEmbroid').attr("checked", "checked")){
						$('.leftPocketLogoCont').slideUp(1000);
						$('.leftPocketEmbroidCont').slideDown(1000);
					}
				},
				toggleHideShowLeftPocketLogo : function(){
					if($('.lpRadioLogo').attr("checked", "checked")){
						$('.leftPocketEmbroidCont').slideUp(1000);
						$('.leftPocketLogoCont').slideDown(1000);
					}
				},
				toggleHideShowRightPocketEmbroid : function(){
					if($('.rpRadioEmbroid').attr("checked", "checked")){
						$('.rightPocketLogoCont').slideUp(1000);
						$('.rightPocketEmbroidCont').slideDown(1000);
					}
				},
				toggleHideShowRightPocketLogo : function(){
					if($('.rpRadioLogo').attr("checked", "checked")){
						$('.rightPocketEmbroidCont').slideUp(1000);
						$('.rightPocketLogoCont').slideDown(1000);
					}
				},
				toggleHideShowLeftShoulderEmbroid : function(){
					if($('.lsRadioEmbroid').attr("checked", "checked")){
						$('.rightPocketLogoCont').slideUp(1000);
						$('.rightPocketEmbroidCont').slideDown(1000);
					}
				},
				toggleHideShowLeftShoulderLogo : function(){
					if($('.lsRadioLogo').attr("checked", "checked")){
						$('.leftShoulderEmbroidCont').slideUp(1000);
						$('.leftShoulderLogoCont').slideDown(1000);
					}
				},
				toggleHideShowRightShoulderEmbroid : function(){
					if($('.rsRadioEmbroid').attr("checked", "checked")){
						$('.rightPocketLogoCont').slideUp(1000);
						$('.rightPocketEmbroidCont').slideDown(1000);
					}
				},
				toggleHideShowRightShoulderLogo : function(){
					if($('.rsRadioLogo').attr("checked", "checked")){
						$('.rightShoulderEmbroidCont').slideUp(1000);
						$('.rightShoulderLogoCont').slideDown(1000);
					}
				},
				//**END EMBRROIDERY/LOGO CLICK FUNCTIONS**//
				
				
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