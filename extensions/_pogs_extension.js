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
				
				
				renderOptionCUSTOMTEXTAREA: function(pog,safeid) {
					var pogid = pog.id;
				//cant set the value to null in IE because it will literally write out 'undefined'. this statement should handle undefined, defined and blank just fine.
					var defaultValue = app.u.isSet(pog['default']) ?  pog['default'] : "";
					var $parentDiv = $("<span \/>");// = $('#div_'+safeid);
				//Creates the 'hidden input' form field in the DOM which is used to let the cart know that the checkbox element was present and it's absense in the form post means it wasn't checked.		
					var $textbox = $('<textarea>').attr({name: "pog_"+pogid, value: defaultValue, id: "pog_"+safeid}).addClass('zform_textarea');
					$textbox.bind('change', function(){
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					})
					$parentDiv.append($textbox);
					if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
					return $parentDiv;
				
				},//END renderOptionCUSTOMTEXTAREA
				
				
	
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
				//Stipe options
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
				this.addHandler("pogid","AX","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B0","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B1","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AZ","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B6","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","AK","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B5","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","B7","renderOptionCUSTOMCHECKBOX");
				this.addHandler("pogid","BC","renderOptionCUSTOMCHECKBOX");
				
				//Embroidery options
				this.addHandler("pogid","BE","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","A8","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BD","renderOptionCUSTOMTEXTAREA");
				this.addHandler("pogid","BH","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BI","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BG","renderOptionCUSTOMTEXTAREA");
				this.addHandler("pogid","BK","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BL","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BJ","renderOptionCUSTOMTEXTAREA");
				
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
					$("#div_AX").show();
					$("#div_B0").show();
					$("#div_B1").show();
					$("#div_AZ").show();
					$("#div_B6").show();
					$("#div_AK").show();
					$("#div_B5").show();
					$("#div_B7").show();
					$("#div_BC").show();
					
					$("#div_BE").show();
					$("#div_A8").show();
					$("#div_BD").show();
					$("#div_BH").show();
					$("#div_BI").show();
					$("#div_BG").show();
					$("#div_BK").show();
					$("#div_BL").show();
					$("#div_BJ").show();
					
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
						$("#div_AX").hide();
						$("#div_B0").hide();
						$("#div_B1").hide();
						$("#div_AZ").hide();
						$("#div_B6").hide();
						$("#div_AK").hide();
						$("#div_B5").hide();
						$("#div_B7").hide();
						$("#div_BC").hide();
						
						$("#div_BE").hide();
						$("#div_A8").hide();
						$("#div_BD").hide();
						$("#div_BH").hide();
						$("#div_BI").hide();
						$("#div_BG").hide();
						$("#div_BK").hide();
						$("#div_BL").hide();
						$("#div_BJ").hide();
						
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
						
					case "01":
						var prodImg=document.getElementById("ppCustomizerColorGrey");
						ctx.drawImage(prodImg,0,0);
						break; 
					case "03":
						var prodImg=document.getElementById("ppCustomizerColorRed");
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
				
				
				//**ADD DOUBLE HORIZONTAL BACK TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("yellow2DoubleBack");
								ctx.drawImage(stripeImg,281,48);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2DoubleBack");
								ctx.drawImage(stripeImg,286,57);
							}
							break; 
						
						case "silver2":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("silv2DoubleBack");
								ctx.drawImage(stripeImg,286,57);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("yellow1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
							}
							break;
						
						case "orange1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("orange1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
							}
							break;
						
						case "silver1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("silv1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
							}
							break;
					}
				}
				//**END DOUBLE HORIZONTAL BACK STRIPE**//
				
				
				//**ADD SINGLE HORIZONTAL BACK TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("yellow2SingleBack");
								ctx.drawImage(stripeImg,285,59);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2SingleBack");
								ctx.drawImage(stripeImg,285,59);
							}
							break; 
						
						case "silver2":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("silv2SingleBack");
								ctx.drawImage(stripeImg,285,59);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("yellow1SingleBack");
								ctx.drawImage(stripeImg,284,59);
							}
							break;
						
						case "orange1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("orange1SingleBack");
								ctx.drawImage(stripeImg,284,59);
							}
							break;
						
						case "silver1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("silv1SingleBack");
								ctx.drawImage(stripeImg,284,59);
							}
							break;
					}
				}
				//**END SINGLE HORIZONTAL BACK STRIPE**//
				
				
				//**ADD HORIZONTAL UPPER FRONT TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("yellow2AboveFrontPocket");
								ctx.drawImage(stripeImg,45,44);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2AboveFrontPocket");
								ctx.drawImage(stripeImg,45,44);
							}
							break; 
						
						case "silver2":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("silv2AboveFrontPocket");
								ctx.drawImage(stripeImg,45,44);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("yellow1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,46);
							}
							break;
						
						case "orange1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("orange1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,47);
							}
							break;
						
						case "silver1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("silv1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,47);
							}
							break;
					}
				}
				//**END HORIZONTAL UPPER FRONT STRIPE**//
				
				
				//**ADD HORIZONTAL UNDERFRONT POCKETS TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("yellow2UnderFrontPocket");
								ctx.drawImage(stripeImg,52,130);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2UnderFrontPocket");
								ctx.drawImage(stripeImg,52,130);
							}
							break; 
						
						case "silver2":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("silv2UnderFrontPocket");
								ctx.drawImage(stripeImg,50,130);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("yellow1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
							}
							break;
						
						case "orange1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("orange1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
							}
							break;
						
						case "silver1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("silv1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
							}
							break;
					}
				}
				//**END HORIZONTAL UNDERFRONT POCKETS STRIPE**//
				
				//**ADD LOWER MIDDLE BACK TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("yellow2LowerMiddleBack");
								ctx.drawImage(stripeImg,318,125);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
							}
							break; 
						
						case "silver2":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("silv2LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("yellow1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
							}
							break;
						
						case "orange1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("orange1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
							}
							break;
						
						case "silver1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("silv1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
							}
							break;
					}
				}
				//**END LOWER MIDDLE BACK STRIPE**//
				
				//**ADD BOTH SLEEVES BICEPS TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Biceps");
								ctx.drawImage(stripeImg,32,85);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Biceps");
								ctx.drawImage(stripeImg,32,85);
							}
							break; 
						
						case "silver2":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("silv2Biceps");
								ctx.drawImage(stripeImg,32,85);
							}
							break; 
					
						case "yellow1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Biceps");
								ctx.drawImage(stripeImg,30,85);
							}
							break;
						
						case "orange1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("orange1Biceps");
								ctx.drawImage(stripeImg,30,85);
							}
							break;
						
						case "silver1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("silv1Biceps");
								ctx.drawImage(stripeImg,30,85);
							}
							break;
					}
				}
				//**END BOTH SLEEVES BICEPS STRIPE**//
				
				//**ADD SHOULDER TO CUFF IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("yellow2ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
							}
							break; 
						
						case "silver2":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("silv2ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("yellow1ShoulderToCuff");
								ctx.drawImage(stripeImg,19,38);
							}
							break;
						
						case "orange1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("orange1ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
							}
							break;
						
						case "silver1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("silv1ShoulderToCuff");
								ctx.drawImage(stripeImg,15,38);
							}
							break;
					}
				}
				//**END SHOULDER TO CUFF STRIPE**//
				
				//**ADD SHOULDER TO SHOULDER IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("yellow2ShoulderToShoulder");
								ctx.drawImage(stripeImg,285,38);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2ShoulderToShoulder");
								ctx.drawImage(stripeImg,285,38);
							}
							break; 
						
						case "silver2":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("silv2ShoulderToShoulder");
								ctx.drawImage(stripeImg,287,38);
							}
							break; 
					
						case "yellow1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("yellow1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,33);
							}
							break;
						
						case "orange1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("orange1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,34);
							}
							break;
						
						case "silver1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("silv1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,34);
							}
							break;
					}
				}
				//**END SHOULDER TO SHOULDER STRIPE**//
				
				//**ADD SUSPENDERS WAIST STRIPE TO IMAGE BASED ON STRIPE TYPE**//
				if($("#pog_A9").data('stripeType')){
					switch($("#pog_A9").data('stripeType'))
					{
						case "yellow2":
							//app.u.dump($('#pog_AN').val());
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("yellow2Suspenders");
								ctx.drawImage(stripeImg,53,15);
								var stripeImg=document.getElementById("yellow2SuspendersBack");
								ctx.drawImage(stripeImg,304,20);
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Suspenders");
								ctx.drawImage(stripeImg,53,15);
								var stripeImg=document.getElementById("yellSilvYell2SuspendersBack");
								ctx.drawImage(stripeImg,305,17);
							}
							break; 
						
						case "silver2":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("silv2Suspenders");
								ctx.drawImage(stripeImg,53,12);
								var stripeImg=document.getElementById("silv2SuspendersBack");
								ctx.drawImage(stripeImg,304,15);
							}
							break; 
					
						case "yellow1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Suspenders");
								ctx.drawImage(stripeImg,50,17);
								var stripeImg=document.getElementById("yellow1SuspendersBack");
								ctx.drawImage(stripeImg,303,15);
							}
							break;
						
						case "orange1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("orange1Suspenders");
								ctx.drawImage(stripeImg,52,5);
								var stripeImg=document.getElementById("orange1SuspendersBack");
								ctx.drawImage(stripeImg,308,20);
							}
							break;
						
						case "silver1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("silv1Suspenders");
								ctx.drawImage(stripeImg,52,15);
								var stripeImg=document.getElementById("silv1SuspendersBack");
								ctx.drawImage(stripeImg,303,13);
							}
							break;
					}
				}
				//**END SUSPENDERS WAIST STRIPE**//
			//**END STRIPE CUSTOMIZER IMAGE DRAWING**// 
				
				
			//**BEGIN EMBROIDERY/LOGO IMAGE DRAWING**//
				//**BEGIN LEFT POCKET EMBROIDERY SECTION**//
				if(($("#pog_BD").val() !== "") && ($("#pog_BE").val() !== "") && ($("#pog_A8").val() !== "")){
					//app.u.dump("All 3 options have values, add image to the customizer");
					
					switch($("#pog_BE").val())
					{
						case "00": //BLACK
							ctx.fillStyle = 'black';
						break;
						case "01": //JAY BLUE
							ctx.fillStyle = '#00568b';
						break;
						case "02": //EMERALD
							ctx.fillStyle = '#4BB74C';
						break;
						case "03": //WHEAT
							ctx.fillStyle = '#F5DEB3';
						break;
						case "04": //FLAG BLUE
							ctx.fillStyle = ' #002868';
						break;
						case "05": //BLUE BIRD
							ctx.fillStyle = '#244B6C';
						break;
						case "06": //MI
							ctx.fillStyle = '#B22222';
						break;
						case "07": //WHITE
							ctx.fillStyle = 'white';
						break;
					}
					
					switch($("#pog_A8").val())
					{
						case "00": //8MM BLOCK 22CHARS
							ctx.font = '3pt Arial';
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '3pt Arial';
						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '4pt Arial';
						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '4.5pt Arial';
						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '5.5pt Arial';
						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '6.5pt Arial';
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '2pt "Yesteryear"';
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '4pt "Yesteryear"';
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '4.5pt "Yesteryear"';
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '7pt "Yesteryear"';
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '9pt "Yesteryear"';
						break;
					}
					ctx.fillText(($("#pog_BD").val()),49,61);
				}
				//**END LEFT POCKET EMBROIDERY SECTION**//
				
				//**BEGIN RIGHT POCKET EMBROIDERY SECTION**//
				if(($("#pog_BH").val() !== "") && ($("#pog_BI").val() !== "") && ($("#pog_BG").val() !== "")){
					//app.u.dump("All 3 options have values, add image to the customizer");
					
					switch($("#pog_BH").val())
					{
						case "00": //BLACK
							ctx.fillStyle = 'black';
						break;
						case "01": //JAY BLUE
							ctx.fillStyle = '#00568b';
						break;
						case "02": //EMERALD
							ctx.fillStyle = '#4BB74C';
						break;
						case "03": //WHEAT
							ctx.fillStyle = '#F5DEB3';
						break;
						case "04": //FLAG BLUE
							ctx.fillStyle = ' #002868';
						break;
						case "05": //BLUE BIRD
							ctx.fillStyle = '#244B6C';
						break;
						case "06": //MI
							ctx.fillStyle = '#B22222';
						break;
						case "07": //WHITE
							ctx.fillStyle = 'white';
						break;
					}
					
					switch($("#pog_BI").val())
					{
						case "00": //8MM BLOCK 22CHARS
							ctx.font = '3pt Arial';
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '3pt Arial';
						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '4pt Arial';
						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '4.5pt Arial';
						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '5.5pt Arial';
						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '6.5pt Arial';
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '2pt "Yesteryear"';
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '4pt "Yesteryear"';
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '4.5pt "Yesteryear"';
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '7pt "Yesteryear"';
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '9pt "Yesteryear"';
						break;
					}
					ctx.fillText(($("#pog_BG").val()),120,61);
				}
				//**END RIGHT POCKET EMBROIDERY SECTION**//
				
				//**BEGIN LEFT SHOULDER EMBROIDERY SECTION**//
				if(($("#pog_BK").val() !== "") && ($("#pog_BL").val() !== "") && ($("#pog_BJ").val() !== "")){
					//app.u.dump("All 3 options have values, add image to the customizer");
					
					ctx.strokeRect(183,58,28,15);
					
					ctx.moveTo(215,55);
					ctx.lineTo(240,35);
					ctx.stroke();
					
					switch(($("#pog_A3").val())){
					case "00":
						ctx.fillStyle = '#d2b48c'; //TAN
						break; 
						
					case "02":
						ctx.fillStyle = '#0000C8'; //ROYAL BLUE
						break; 
						
					case "04":
						ctx.fillStyle = '#000032'; //NAVY BLUE
						break; 
						
					case "05":
						ctx.fillStyle = '#FF6600'; //ORANGE
						break;
						
					case "06":
						ctx.fillStyle = '#0000C8'; //ROYAL BLUE
						break; 
						
					case "0D":
						ctx.fillStyle = '#000032'; //NAVY BLUE
						break; 
						
					case "01":
						ctx.fillStyle = 'GRAY'; //GRAY
						break;
						
					case "03":
						ctx.fillStyle = '#AD221F'; //RED
						break; 
						
					default: 
						ctx.fillStyle = '#d2b48c'; //TAN
						break; 
					}
					ctx.fillRect(243,16,60,15);
					
					switch($("#pog_BK").val())
					{
						case "00": //BLACK
							ctx.fillStyle = 'black';
						break;
						case "01": //JAY BLUE
							ctx.fillStyle = '#00568b';
						break;
						case "02": //EMERALD
							ctx.fillStyle = '#4BB74C';
						break;
						case "03": //WHEAT
							ctx.fillStyle = '#F5DEB3';
						break;
						case "04": //FLAG BLUE
							ctx.fillStyle = ' #002868';
						break;
						case "05": //BLUE BIRD
							ctx.fillStyle = '#244B6C';
						break;
						case "06": //MI
							ctx.fillStyle = '#B22222';
						break;
						case "07": //WHITE
							ctx.fillStyle = 'white';
						break;
					}
					
					switch($("#pog_BL").val())
					{
						case "00": //8MM BLOCK 22CHARS
							ctx.font = '3pt Arial';
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '4.5pt Arial';
						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '4.5pt Arial';
						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '5pt Arial';
						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '6.5pt Arial';
						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '9pt Arial';
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '3pt "Yesteryear"';
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '5.5pt "Yesteryear"';
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '6pt "Yesteryear"';
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '8.5pt "Yesteryear"';
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '11.5pt "Yesteryear"';
						break;
					}
					
					ctx.fillText(($("#pog_BJ").val()),250,27);
				}
				//**END LEFT SHOULDER EMBROIDERY SECTION**//

				
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
						$('.leftPocketEmbroidCont').slideUp(1000);
						$('.leftPocketLogoCont').slideUp(1000);
						$("#pog_BD").val("");
						$("#pog_BE").find('option:first').attr('selected','selected');
						$("#pog_A8").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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
						$('.rightPocketEmbroidCont').slideUp(1000);
						$('.rightPocketLogoCont').slideUp(1000);
						$("#pog_BG").val("");
						$("#pog_BH").find('option:first').attr('selected','selected');
						$("#pog_BI").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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
						$('.leftShoulderEmbroidCont').slideUp(1000);
						$('.leftShoulderLogoCont').slideUp(1000);
						$("#pog_BJ").val("");
						$("#pog_BK").find('option:first').attr('selected','selected');
						$("#pog_BL").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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
						$('.rightShoulderEmbroidCont').slideUp(1000);
						$('.rightShoulderLogoCont').slideUp(1000);
						$("#pog_BM").val("");
						$("#pog_BN").find('option:first').attr('selected','selected');
						$("#pog_BO").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowLeftPocketLogo : function(){
					if($('.lpRadioLogo').attr("checked", "checked")){
						$('.leftPocketEmbroidCont').slideUp(1000);
						$('.leftPocketLogoCont').slideDown(1000);
						$("#pog_BD").val("");
						$("#pog_BE").find('option:first').attr('selected','selected');
						$("#pog_A8").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowRightPocketEmbroid : function(){
					if($('.rpRadioEmbroid').attr("checked", "checked")){
						$('.rightPocketLogoCont').slideUp(1000);
						$('.rightPocketEmbroidCont').slideDown(1000);
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowRightPocketLogo : function(){
					if($('.rpRadioLogo').attr("checked", "checked")){
						$('.rightPocketEmbroidCont').slideUp(1000);
						$('.rightPocketLogoCont').slideDown(1000);
						$("#pog_BG").val("");
						$("#pog_BH").find('option:first').attr('selected','selected');
						$("#pog_BI").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowLeftShoulderEmbroid : function(){
					if($('.lsRadioEmbroid').attr("checked", "checked")){
						$('.leftShoulderLogoCont').slideUp(1000);
						$('.leftShoulderEmbroidCont').slideDown(1000);
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowLeftShoulderLogo : function(){
					if($('.lsRadioLogo').attr("checked", "checked")){
						$('.leftShoulderEmbroidCont').slideUp(1000);
						$('.leftShoulderLogoCont').slideDown(1000);
						$("#pog_BJ").val("");
						$("#pog_BK").find('option:first').attr('selected','selected');
						$("#pog_BL").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowRightShoulderEmbroid : function(){
					if($('.rsRadioEmbroid').attr("checked", "checked")){
						$('.rightShoulderLogoCont').slideUp(1000);
						$('.rightShoulderEmbroidCont').slideDown(1000);
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				},
				toggleHideShowRightShoulderLogo : function(){
					if($('.rsRadioLogo').attr("checked", "checked")){
						$('.rightShoulderEmbroidCont').slideUp(1000);
						$('.rightShoulderLogoCont').slideDown(1000);
						$("#pog_BM").val("");
						$("#pog_BN").find('option:first').attr('selected','selected');
						$("#pog_BO").find('option:first').attr('selected','selected');
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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