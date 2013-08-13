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
				this.addHandler("pogid","BN","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BO","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","BM","renderOptionCUSTOMTEXTAREA");
				
				//Logo Options
				this.addHandler("pogid","AA","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","AB","renderOptionCUSTOMTEXTAREA");
				this.addHandler("pogid","AC","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","AE","renderOptionCUSTOMTEXTAREA");
				this.addHandler("pogid","AF","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","AG","renderOptionCUSTOMTEXTAREA");
				this.addHandler("pogid","AH","renderOptionCUSTOMSELECTDROPDOWN");
				this.addHandler("pogid","AI","renderOptionCUSTOMTEXTAREA");
				
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
					$("#div_AJ").show();
					$("#div_AV").show();
					$("#div_AL").show();
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
					$("#div_BN").show();
					$("#div_BO").show();
					$("#div_BM").show();
					
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
						$("#div_BN").hide();
						$("#div_BO").hide();
						$("#div_BM").hide();
						
						$("#div_AA").hide();
						$("#div_AB").hide();
						$("#div_AC").hide();
						$("#div_AE").hide();
						
						$(".customBut").html("Show Customizer");
						$(".customBut").val("showCustomizer");
						
						$(".leftPocket").prop('checked', false);
						$('.leftPocketCont').slideUp(1000);
						$('.leftPocketCont').data('collapseOrExpanded',false).append();
						$(".lpRadioEmbroid").prop('checked', false);
						$(".lpRadioLogo").prop('checked', false);
						$('.leftPocketEmbroidCont').slideUp(1000);
						$('.leftPocketLogoCont').slideUp(1000);
						$("#pog_BD").val("");
						$("#pog_BE").find('option:first').attr('selected','selected');
						$("#pog_A8").find('option:first').attr('selected','selected');
						$("#pog_AA").val("");
						$(".leftPocketState").val("");
						$("#pog_AB").val("");
						$(".stateContLP").hide();
						$(".leftPocketCustomLogoMess").hide();

						$(".rightPocket").prop('checked', false);
						$('.rightPocketCont').slideUp(1000);
						$('.rightPocketCont').data('collapseOrExpanded',false).append();
						$(".rpRadioEmbroid").prop('checked', false);
						$(".rpRadioLogo").prop('checked', false);
						$('.rightPocketEmbroidCont').slideUp(1000);
						$('.rightPocketLogoCont').slideUp(1000);
						$("#pog_BG").val("");
						$("#pog_BH").find('option:first').attr('selected','selected');
						$("#pog_BI").find('option:first').attr('selected','selected');
						$("#pog_AC").val("");
						$(".rightPocketState").val("");
						$("#pog_AE").val("");
						$(".stateContRP").hide();
						$(".rightPocketCustomLogoMess").hide();

						$(".leftShoulder").prop('checked', false);
						$('.leftShoulderCont').slideUp(1000);
						$('.leftShoulderCont').data('collapseOrExpanded',false).append();
						$(".lsRadioEmbroid").prop('checked', false);
						$(".lsRadioLogo").prop('checked', false);
						$('.leftShoulderEmbroidCont').slideUp(1000);
						$('.leftShoulderLogoCont').slideUp(1000);
						$("#pog_BJ").val("");
						$("#pog_BK").find('option:first').attr('selected','selected');
						$("#pog_BL").find('option:first').attr('selected','selected');
						$("#pog_AF").val("");
						$(".leftShoulderState").val("");
						$("#pog_AG").val("");
						$(".stateContLS").hide();
						$(".leftShoulderCustomLogoMess").hide();

						$(".rightShoulder").prop('checked', false);
						$('.rightShoulderCont').slideUp(1000);
						$('.rightShoulderCont').data('collapseOrExpanded',false).append();
						$(".rsRadioEmbroid").prop('checked', false);
						$(".rsRadioLogo").prop('checked', false);
						$('.rightShoulderEmbroidCont').slideUp(1000);
						$('.rightShoulderLogoCont').slideUp(1000);
						$("#pog_BM").val("");
						$("#pog_BN").find('option:first').attr('selected','selected');
						$("#pog_BO").find('option:first').attr('selected','selected');
						$("#pog_AH").val("");
						$(".rightShoulderState").val("");
						$("#pog_AI").val("");
						$(".stateContLS").hide();
						$(".rightShoulderCustomLogoMess").hide();
						
						$("#pog_A9").val("");
						$("#pog_AV").prop('checked', false);
						$("#pog_AL").prop('checked', false);
						$("#pog_AJ").prop('checked', false);
						$("#pog_AP").prop('checked', false);
						$("#pog_AR").prop('checked', false);
						$("#pog_AY").prop('checked', false);
						$("#pog_B8").prop('checked', false);
						$("#pog_AX").prop('checked', false);
						$("#pog_B0").prop('checked', false);
						$("#pog_B1").prop('checked', false);
						$("#pog_AZ").prop('checked', false);
						$("#pog_B6").prop('checked', false);
						$("#pog_AK").prop('checked', false);
						$("#pog_B5").prop('checked', false);
						$("#pog_B7").prop('checked', false);
						$("#pog_BC").prop('checked', false);
						
						$("#pog_AV").val("OFF");
						$("#pog_AL").val("OFF");
						$("#pog_AJ").val("OFF");
						$("#pog_AP").val("OFF");
						$("#pog_AR").val("OFF");
						$("#pog_AY").val("OFF");
						$("#pog_B8").val("OFF");
						$("#pog_AX").val("OFF");
						$("#pog_B0").val("OFF");
						$("#pog_B1").val("OFF");
						$("#pog_AZ").val("OFF");
						$("#pog_B6").val("OFF");
						$("#pog_AK").val("OFF");
						$("#pog_B5").val("OFF");
						$("#pog_B7").val("OFF");
						$("#pog_BC").val("OFF");
						app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
					}
				}
			},
			
			UpdateCustomizerImage: function(){
				
				var c=document.getElementById("customizerCanvas");
				var ctx=c.getContext("2d");
				ctx.clearRect(0,0,500,500);
				
				$(".selectedOptionPriceList").empty();
				$('.selectedOptionsTotalPrice').text('');
				var totalPrice = 71.65;
				
				totalPrice += 15.00;
				$('<div style="width:458px; clear:both;"><p class="floatLeft">One time setup fee</p><p class="floatRight">$15.00</p></div> <br/><br/>').appendTo(".selectedOptionPriceList");
				
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

								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch sideseam stripe</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Sideseam");
								ctx.drawImage(stripeImg,50,234);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch sideseam stripe</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("silv2Sideseam");
								ctx.drawImage(stripeImg,48,234);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch sideseam stripe</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Sideseam");
								ctx.drawImage(stripeImg,50,234);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch sideseam stripe</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("orange1Sideseam");
								ctx.drawImage(stripeImg,50,234);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch sideseam stripe</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_B8').val() === "ON"){
								var stripeImg=document.getElementById("silv1Sideseam");
								ctx.drawImage(stripeImg,50,234);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch sideseam stripe</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch calf stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("yellSilvYell2CalvesBack");
								ctx.drawImage(stripeImg,313,400);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch calf stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("silv2Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("silv2CalvesBack");
								ctx.drawImage(stripeImg,313,400);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch calf stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("yellow1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch calf stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("orange1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("orange1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch calf stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AJ').val() === "ON"){
								var stripeImg=document.getElementById("silv1Calves");
								ctx.drawImage(stripeImg,56,390);
								var stripeImg=document.getElementById("silv1CalvesBack");
								ctx.drawImage(stripeImg,313,400);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch calf stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch forearm stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("yellSilvYell2ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
								
								totalPrice += 8.10;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch forearm stripes</p><p class="floatRight">$8.10</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("silv2Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("silv2ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch forearm stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("yellow1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch forearm stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("orange1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("orange1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch forearm stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AV').val() === "ON"){
								var stripeImg=document.getElementById("silv1Forearms");
								ctx.drawImage(stripeImg,25,175);
								var stripeImg=document.getElementById("silv1ForearmsBack");
								ctx.drawImage(stripeImg,272,175);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch forearm stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch knee stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("yellSilvYell2KneesBack");
								ctx.drawImage(stripeImg,312,355);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch knee stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("silv2Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("silv2KneesBack");
								ctx.drawImage(stripeImg,312,355);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch knee stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("yellow1KneesBack");
								ctx.drawImage(stripeImg,312,355);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch knee stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("orange1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("orange1KneesBack");
								ctx.drawImage(stripeImg,312,355);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch knee stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AL').val() === "ON"){
								var stripeImg=document.getElementById("silv1Knees");
								ctx.drawImage(stripeImg,56,355);
								var stripeImg=document.getElementById("silv1KneesBack");
								ctx.drawImage(stripeImg,312,355);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch knee stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 10.35;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$10.35</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("yellSilvYell2ThighsBack");
								ctx.drawImage(stripeImg,311,310);
								
								totalPrice += 12.55;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$12.55</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("silv2Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("silv2ThighsBack");
								ctx.drawImage(stripeImg,311,310);
								
								totalPrice += 9.70;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$9.70</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("yellow1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
								
								totalPrice += 8.25;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$8.25</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("orange1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("orange1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
								
								totalPrice += 7.65;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$7.65</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AN').val() === "ON"){
								var stripeImg=document.getElementById("silv1Thighs");
								ctx.drawImage(stripeImg,56,320);
								var stripeImg=document.getElementById("silv1ThighsBack");
								ctx.drawImage(stripeImg,311,310);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch thigh stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch pant bottom cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("yellSilvYell2PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch pant bottom cuff stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("silv2PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("silv2PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch pant bottom cuff stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("yellow1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("yellow1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch pant bottom cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("orange1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("orange1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch pant bottom cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AP').val() === "ON"){
								var stripeImg=document.getElementById("silv1PantCuff");
								ctx.drawImage(stripeImg,56,460);
								var stripeImg=document.getElementById("silv1PantCuffBack");
								ctx.drawImage(stripeImg,315,475);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch pant bottom cuff stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch x on back stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2FullXBack");
								ctx.drawImage(stripeImg,302,27);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch x on back stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("silv2FullXBack");
								ctx.drawImage(stripeImg,303,27);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch x on back stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("yellow1FullXBack");
								ctx.drawImage(stripeImg,302,27);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch x on back stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("orange1FullXBack");
								ctx.drawImage(stripeImg,305,32);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch x on back stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AY').val() === "ON"){
								var stripeImg=document.getElementById("silv1FullXBack");
								ctx.drawImage(stripeImg,303,29);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch x on back stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch all around stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2AllAround");
								ctx.drawImage(stripeImg,58,152);
								var stripeImg=document.getElementById("yellSilvYell2AllAroundBack");
								ctx.drawImage(stripeImg,310,148);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch all around stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("silv2AllAround");
								ctx.drawImage(stripeImg,58,152);
								var stripeImg=document.getElementById("silv2AllAroundBack");
								ctx.drawImage(stripeImg,310,150);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch all around stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("yellow1AllAround");
								ctx.drawImage(stripeImg,58,160);
								var stripeImg=document.getElementById("yellow1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch all around stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("orange1AllAround");
								ctx.drawImage(stripeImg,58,161);
								var stripeImg=document.getElementById("orange1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch all around stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AR').val() === "ON"){
								var stripeImg=document.getElementById("silv1AllAround");
								ctx.drawImage(stripeImg,58,161);
								var stripeImg=document.getElementById("silv1AllAroundBack");
								ctx.drawImage(stripeImg,310,156);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch all around stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch double back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2DoubleBack");
								ctx.drawImage(stripeImg,286,57);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch double back stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("silv2DoubleBack");
								ctx.drawImage(stripeImg,286,57);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch double back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("yellow1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch double back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("orange1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch double back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_AX').val() === "ON"){
								var stripeImg=document.getElementById("silv1DoubleBack");
								ctx.drawImage(stripeImg,286,57);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch double back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch single back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2SingleBack");
								ctx.drawImage(stripeImg,285,59);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch single back stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "silver2":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("silv2SingleBack");
								ctx.drawImage(stripeImg,285,59);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch single back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("yellow1SingleBack");
								ctx.drawImage(stripeImg,284,59);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch single back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "orange1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("orange1SingleBack");
								ctx.drawImage(stripeImg,284,59);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch single back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break;
						
						case "silver1":
							if($('#pog_B0').val() === "ON"){
								var stripeImg=document.getElementById("silv1SingleBack");
								ctx.drawImage(stripeImg,284,59);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch single back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");
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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch single front stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2AboveFrontPocket");
								ctx.drawImage(stripeImg,45,44);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch single front stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("silv2AboveFrontPocket");
								ctx.drawImage(stripeImg,45,44);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch single front stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");
							}
							break; 
					
						case "yellow1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("yellow1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,46);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch single front stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("orange1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,47);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch single front stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_B1').val() === "ON"){
								var stripeImg=document.getElementById("silv1AboveFrontPocket");
								ctx.drawImage(stripeImg,45,47);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch single front stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch under front pockets stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2UnderFrontPocket");
								ctx.drawImage(stripeImg,52,130);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch under front pockets stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("silv2UnderFrontPocket");
								ctx.drawImage(stripeImg,50,130);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch under front pockets stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("yellow1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch under front pockets stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("orange1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch under front pockets stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_AZ').val() === "ON"){
								var stripeImg=document.getElementById("silv1UnderFrontPocket");
								ctx.drawImage(stripeImg,50,127);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch under front pockets stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch lower middle back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch lower middle back stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("silv2LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch lower middle back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("yellow1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch lower middle back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("orange1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch lower middle back stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_B6').val() === "ON"){
								var stripeImg=document.getElementById("silv1LowerMiddleBack");
								ctx.drawImage(stripeImg,317,125);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch lower middle back stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch bicep stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Biceps");
								ctx.drawImage(stripeImg,32,85);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch bicep stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("silv2Biceps");
								ctx.drawImage(stripeImg,32,85);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch bicep stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Biceps");
								ctx.drawImage(stripeImg,30,85);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch bicep stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("orange1Biceps");
								ctx.drawImage(stripeImg,30,85);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch bicep stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_AK').val() === "ON"){
								var stripeImg=document.getElementById("silv1Biceps");
								ctx.drawImage(stripeImg,30,85);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch bicep stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch shoulder to cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch shoulder to cuff stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("silv2ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch shoulder to cuff stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("yellow1ShoulderToCuff");
								ctx.drawImage(stripeImg,19,38);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch shoulder to cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("orange1ShoulderToCuff");
								ctx.drawImage(stripeImg,11,38);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch shoulder to cuff stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_B5').val() === "ON"){
								var stripeImg=document.getElementById("silv1ShoulderToCuff");
								ctx.drawImage(stripeImg,15,38);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch shoulder to cuff stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch shoulder to shoulder stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2ShoulderToShoulder");
								ctx.drawImage(stripeImg,285,38);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch shoulder to shoulder stripes</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("silv2ShoulderToShoulder");
								ctx.drawImage(stripeImg,287,38);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch shoulder to shoulder stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("yellow1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,33);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch shoulder to shoulder stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("orange1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,34);
								
								totalPrice += 7.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch shoulder to shoulder stripes</p><p class="floatRight">$7.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_B7').val() === "ON"){
								var stripeImg=document.getElementById("silv1ShoulderToShoulder");
								ctx.drawImage(stripeImg,284,34);
								
								totalPrice += 6.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch shoulder to shoulder stripes</p><p class="floatRight">$6.00</p></div>').appendTo(".selectedOptionPriceList");

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
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 2-inch suspender waist stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "yellSilvYell2":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("yellSilvYell2Suspenders");
								ctx.drawImage(stripeImg,53,15);
								var stripeImg=document.getElementById("yellSilvYell2SuspendersBack");
								ctx.drawImage(stripeImg,305,17);
								
								totalPrice += 15.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow-Silver-Yellow 2-inch suspender waist stripes</p><p class="floatRight">$15.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
						
						case "silver2":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("silv2Suspenders");
								ctx.drawImage(stripeImg,53,12);
								var stripeImg=document.getElementById("silv2SuspendersBack");
								ctx.drawImage(stripeImg,304,15);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 2-inch suspender waist stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break; 
					
						case "yellow1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("yellow1Suspenders");
								ctx.drawImage(stripeImg,50,17);
								var stripeImg=document.getElementById("yellow1SuspendersBack");
								ctx.drawImage(stripeImg,303,15);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Yellow 1-inch suspender waist stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "orange1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("orange1Suspenders");
								ctx.drawImage(stripeImg,52,5);
								var stripeImg=document.getElementById("orange1SuspendersBack");
								ctx.drawImage(stripeImg,308,20);
								
								totalPrice += 14.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Orange 1-inch suspender waist stripes</p><p class="floatRight">$14.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
						
						case "silver1":
							if($('#pog_BC').val() === "ON"){
								var stripeImg=document.getElementById("silv1Suspenders");
								ctx.drawImage(stripeImg,52,15);
								var stripeImg=document.getElementById("silv1SuspendersBack");
								ctx.drawImage(stripeImg,303,13);
								
								totalPrice += 13.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Silver 1-inch suspender waist stripes</p><p class="floatRight">$13.00</p></div>').appendTo(".selectedOptionPriceList");

							}
							break;
					}
				}
				//**END SUSPENDERS WAIST STRIPE**//
			//**END STRIPE CUSTOMIZER IMAGE DRAWING**// 
			$('<br/><br/>').appendTo(".selectedOptionPriceList");
				
			//**BEGIN EMBROIDERY/LOGO IMAGE DRAWING**//
				//**BEGIN EMBROIDERY SECTION**//
				//**BEGIN LEFT POCKET EMBROIDERY SECTION**//
					/**BEGIN CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR LEFT POCKET**/
						var limit;
						switch($("#pog_A8").val()){
							case "00": //8MM BLOCK 22CHARS
								limit = 22;
							break;
							case "01": //12MM BLOCK 18CHARS
								limit = 18;
							break;
							case "02": //12MM BLOCK 16CHARS
								limit = 16;
							break;
							case "03": //15MM BLOCK 14CHARS
								limit = 14;
							break;
							case "04": //18MM BLOCK 11CHARS
								limit = 11;
							break;
							case "05": //25MM BLOCK 8CHARS
								limit = 8;
							break;
							case "06": //8MM SCRIPT 30CHARS
								limit = 30;
							break;
							case "07": //12MM SCRIPT 19CHARS
								limit = 19;
							break;
							case "08": //15MM SCRIPT 17CHARS
								limit = 17;
							break;
							case "09": //18MM SCRIPT 12CHARS
								limit = 12;
							break;
							case "0A": //25MM SCRIPT 8CHARS
								limit = 8;
							break;
						}
						  
						//get the current text inside the textarea  
						var text = $("#pog_BD").val();  
						//count the number of characters in the text  
						var chars = text.length;  
				  
						//check if there are more characters then allowed  
						if(chars > limit){  
							//and if there are use substr to get the text before the limit  
							var new_text = text.substr(0, limit);  
				  
							//and change the current text with the new text  
							$("#pog_BD").val(new_text);  
						}
					/**END CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR LEFT POCKET**/

				
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
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 8mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '3pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 10mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "02": //12mm block embroidery 16CHARS
							ctx.font = '4pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 12mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "03": //15mm block embroidery 14CHARS
							ctx.font = '4.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 15mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "04": //18mm block embroidery 11CHARS
							ctx.font = '5.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 18mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "05": //25mm block embroidery 8CHARS
							ctx.font = '6.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 25mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '2pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 8mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '4pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 12mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '4.5pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 15mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '7pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 18mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '9pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket 25mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
					}
					ctx.fillText(($("#pog_BG").val()),49,61);
				}
				//**END LEFT POCKET EMBROIDERY SECTION**//
				
				//**BEGIN RIGHT POCKET EMBROIDERY SECTION**//
				
					/**BEGIN CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR RIGHT POCKET**/
						var limit;
						switch($("#pog_BI").val()){
							case "00": //8MM BLOCK 22CHARS
								limit = 22;
							break;
							case "01": //12MM BLOCK 18CHARS
								limit = 18;
							break;
							case "02": //12MM BLOCK 16CHARS
								limit = 16;
							break;
							case "03": //15MM BLOCK 14CHARS
								limit = 14;
							break;
							case "04": //18MM BLOCK 11CHARS
								limit = 11;
							break;
							case "05": //25MM BLOCK 8CHARS
								limit = 8;
							break;
							case "06": //8MM SCRIPT 30CHARS
								limit = 30;
							break;
							case "07": //12MM SCRIPT 19CHARS
								limit = 19;
							break;
							case "08": //15MM SCRIPT 17CHARS
								limit = 17;
							break;
							case "09": //18MM SCRIPT 12CHARS
								limit = 12;
							break;
							case "0A": //25MM SCRIPT 8CHARS
								limit = 8;
							break;
						}
						  
						//get the current text inside the textarea  
						var text = $("#pog_BG").val();  
						//count the number of characters in the text  
						var chars = text.length;  
				  
						//check if there are more characters then allowed  
						if(chars > limit){  
							//and if there are use substr to get the text before the limit  
							var new_text = text.substr(0, limit);  
				  
							//and change the current text with the new text  
							$("#pog_BG").val(new_text);  
						}
					/**END CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR RIGHT POCKET**/
				
				if(($("#pog_BE").val() !== "") && ($("#pog_A8").val() !== "") && ($("#pog_BD").val() !== "")){
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
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 8mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '3pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 10mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '4pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 12mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '4.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 15mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '5.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 18mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '6.5pt Arial';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 25mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '2pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 8mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '4pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 12mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '4.5pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 15mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '7pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 18mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '9pt "Yesteryear"';
							totalPrice += 3.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket 25mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
					}
					ctx.fillText(($("#pog_BD").val()),120,61);
				}
				//**END RIGHT POCKET EMBROIDERY SECTION**//
				
				//**BEGIN LEFT SHOULDER EMBROIDERY SECTION**//
				
				/**BEGIN CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR LEFT SHOULDER**/
						var limit;
						switch($("#pog_BL").val()){
							case "00": //8MM BLOCK 22CHARS
								limit = 22;
							break;
							case "01": //12MM BLOCK 18CHARS
								limit = 18;
							break;
							case "02": //12MM BLOCK 16CHARS
								limit = 16;
							break;
							case "03": //15MM BLOCK 14CHARS
								limit = 14;
							break;
							case "04": //18MM BLOCK 11CHARS
								limit = 11;
							break;
							case "05": //25MM BLOCK 8CHARS
								limit = 8;
							break;
							case "06": //8MM SCRIPT 30CHARS
								limit = 30;
							break;
							case "07": //12MM SCRIPT 19CHARS
								limit = 19;
							break;
							case "08": //15MM SCRIPT 17CHARS
								limit = 17;
							break;
							case "09": //18MM SCRIPT 12CHARS
								limit = 12;
							break;
							case "0A": //25MM SCRIPT 8CHARS
								limit = 8;
							break;
						}
						  
						//get the current text inside the textarea  
						var text = $("#pog_BJ").val();  
						//count the number of characters in the text  
						var chars = text.length;  
				  
						//check if there are more characters then allowed  
						if(chars > limit){  
							//and if there are use substr to get the text before the limit  
							var new_text = text.substr(0, limit);  
				  
							//and change the current text with the new text  
							$("#pog_BJ").val(new_text);  
						}
					/**END CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR LEFT SHOULDER**/
				
				if(($("#pog_BK").val() !== "") && ($("#pog_BL").val() !== "") && ($("#pog_BJ").val() !== "")){
					//app.u.dump("All 3 options have values, add image to the customizer");
					
					ctx.strokeRect(183,58,28,15);
					
					ctx.beginPath(); 
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
					ctx.fillRect(230,5,93,25);
					
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
							ctx.font = '6pt Arial';
							ctx.fillText(($("#pog_BJ").val()),236,22);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 8mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '7pt Arial';
							ctx.fillText(($("#pog_BJ").val()),236,21);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 10mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '8pt Arial';
							ctx.fillText(($("#pog_BJ").val()),233,22);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 12mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '9pt Arial';
							ctx.fillText(($("#pog_BJ").val()),233,22);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 15mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '12pt Arial';
							ctx.fillText(($("#pog_BJ").val()),233,23);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 18mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '16pt Arial';
							ctx.fillText(($("#pog_BJ").val()),236,24);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 25mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '6pt "Yesteryear"';
							ctx.fillText(($("#pog_BJ").val()),235,20);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 8mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '10pt "Yesteryear"';
							ctx.fillText(($("#pog_BJ").val()),233,20);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 12mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '11pt "Yesteryear"';
							ctx.fillText(($("#pog_BJ").val()),233,20);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 15mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '14pt "Yesteryear"';
							ctx.fillText(($("#pog_BJ").val()),236,21);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 18mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '18pt "Yesteryear"';
							ctx.fillText(($("#pog_BJ").val()),243,24);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder 25mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");
						break;
					}
					
					
				}
				//**END LEFT SHOULDER EMBROIDERY SECTION**//
				
				//**BEGIN RIGHT SHOULDER EMBROIDERY SECTION**//
				
				/**BEGIN CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR RIGHT SHOULDER**/
						var limit;
						switch($("#pog_BO").val()){
							case "00": //8MM BLOCK 22CHARS
								limit = 22;
							break;
							case "01": //12MM BLOCK 18CHARS
								limit = 18;
							break;
							case "02": //12MM BLOCK 16CHARS
								limit = 16;
							break;
							case "03": //15MM BLOCK 14CHARS
								limit = 14;
							break;
							case "04": //18MM BLOCK 11CHARS
								limit = 11;
							break;
							case "05": //25MM BLOCK 8CHARS
								limit = 8;
							break;
							case "06": //8MM SCRIPT 30CHARS
								limit = 30;
							break;
							case "07": //12MM SCRIPT 19CHARS
								limit = 19;
							break;
							case "08": //15MM SCRIPT 17CHARS
								limit = 17;
							break;
							case "09": //18MM SCRIPT 12CHARS
								limit = 12;
							break;
							case "0A": //25MM SCRIPT 8CHARS
								limit = 8;
							break;
						}
						  
						//get the current text inside the textarea  
						var text = $("#pog_BM").val();  
						//count the number of characters in the text  
						var chars = text.length;  
				  
						//check if there are more characters then allowed  
						if(chars > limit){  
							//and if there are use substr to get the text before the limit  
							var new_text = text.substr(0, limit);  
				  
							//and change the current text with the new text  
							$("#pog_BM").val(new_text);  
						}
					/**END CHARACTER LIMITING FUNCTIONALITY FOR EMBROIDERY TEXT ENTRY FOR RIGHT SHOULDER**/
				
				if(($("#pog_BN").val() !== "") && ($("#pog_BO").val() !== "") && ($("#pog_BM").val() !== "")){
					//app.u.dump("All 3 options have values, add image to the customizer");
					
					ctx.beginPath(); 
					ctx.moveTo(45,45);
					ctx.lineTo(30,30);
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
					ctx.fillRect(0,0,93,25);
					
					switch($("#pog_BN").val())
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
					
					switch($("#pog_BO").val())
					{
						case "00": //8MM BLOCK 22CHARS
							ctx.font = '6pt Arial';
							ctx.fillText(($("#pog_BM").val()),6,16);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 8mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "01": //10MM BLOCK 18CHARS
							ctx.font = '7pt Arial';
							ctx.fillText(($("#pog_BM").val()),6,16);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 10mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "02": //12MM BLOCK 16CHARS
							ctx.font = '8pt Arial';
							ctx.fillText(($("#pog_BM").val()),2,16);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 12mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "03": //15MM BLOCK 14CHARS
							ctx.font = '9pt Arial';
							ctx.fillText(($("#pog_BM").val()),3,17);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 15mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "04": //18MM BLOCK 11CHARS
							ctx.font = '12pt Arial';
							ctx.fillText(($("#pog_BM").val()),3,17);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 18mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "05": //25MM BLOCK 8CHARS
							ctx.font = '16pt Arial';
							ctx.fillText(($("#pog_BM").val()),6,19);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 25mm block embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "06": //8MM SCRIPT 30CHARS
							ctx.font = '6pt "Yesteryear"';
							ctx.fillText(($("#pog_BM").val()),5,14);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 8mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "07": //12MM SCRIPT 19CHARS
							ctx.font = '10pt "Yesteryear"';
							ctx.fillText(($("#pog_BM").val()),4,16);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 12mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "08": //15MM SCRIPT 17CHARS
							ctx.font = '11pt "Yesteryear"';
							ctx.fillText(($("#pog_BM").val()),3,15);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 15mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "09": //18MM SCRIPT 12CHARS
							ctx.font = '14pt "Yesteryear"';
							ctx.fillText(($("#pog_BM").val()),6,15);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 18mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
						case "0A": //25MM SCRIPT 8CHARS
							ctx.font = '18pt "Yesteryear"';
							ctx.fillText(($("#pog_BM").val()),13,18);
							totalPrice += 5.00;
							$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder 25mm script embroidery</p><p class="floatRight">$5.00</p></div>').appendTo(".selectedOptionPriceList");

						break;
					}
				}
				//**END RIGHT SHOULDER EMBROIDERY SECTION**//
				//**END EMBROIDERY SECTION**//
				
				$('<br/><br/>').appendTo(".selectedOptionPriceList");
				
				//**BEGIN LOGO SECTION**//
					//**BEGIN LEFT POCKET LOGO SECTION**//
					if($("#pog_AA").val() !== ""){
						switch($("#pog_AA").val()){
							case "00": //US Flag
								var stripeImg=document.getElementById("usPatchLP");
								ctx.drawImage(stripeImg,123,49);
								$(".leftPocketState").val("");
								$("#pog_AB").val("");
								$(".stateContLP").slideUp(500);
								$(".leftPocketCustomLogoMess").slideUp(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket US flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
							
							case "01": //State Flag
								switch($(".leftPocketState").val()){
									case "00": //ALABAMA	
										$("#pog_AB").val("Alabama");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "01": //Alaska
										$("#pog_AB").val("Alaska");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "02": //Arizona
										$("#pog_AB").val("Arizona");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "03": //Arkansas							
										$("#pog_AB").val("Arkansas");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "04": //California
										$("#pog_AB").val("California");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "05": //Colorado
										$("#pog_AB").val("Colorado");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "06": //Connecticut
										$("#pog_AB").val("Connecticut");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "07": //Delaware
										$("#pog_AB").val("Delaware");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "08": //Florida
										$("#pog_AB").val("Florida");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "09": //Georgia
										$("#pog_AB").val("Georgia");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "10": //Hawaii
										$("#pog_AB").val("Hawaii");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "11": //Idaho
										$("#pog_AB").val("Idaho");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "12": //Illinois
										$("#pog_AB").val("Illinois");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "13": //Indiana
										$("#pog_AB").val("Indiana");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "14": //Iowa
										$("#pog_AB").val("Iowa");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "15": //Kansas
										$("#pog_AB").val("Kansas");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "16": //Kentucky
										$("#pog_AB").val("Kentucky");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "17": //Louisiana
										$("#pog_AB").val("Louisiana");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "18": //Maine
										$("#pog_AB").val("Maine");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "19": //Maryland
										$("#pog_AB").val("Maryland");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "20": //Massachusetts
										$("#pog_AB").val("Massachusetts");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "21": //Michigan
										$("#pog_AB").val("Michigan");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "22": //Minnesota
										$("#pog_AB").val("Minnesota");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "23": //Mississippi
										$("#pog_AB").val("Mississippi");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "24": //Missouri
										$("#pog_AB").val("Missouri");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "25": //Montana
										$("#pog_AB").val("Montana");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "26": //Nebraska
										$("#pog_AB").val("Nebraska");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "27": //Nevada
										$("#pog_AB").val("Nevada");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "28": //New Hampshire
										$("#pog_AB").val("New Hampshire");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "29": //New Jersey
										$("#pog_AB").val("New Jersey");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "30": //New Mexico
										$("#pog_AB").val("New Mexico");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "31": //New York
										$("#pog_AB").val("New York");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "32": //North Carolina
										$("#pog_AB").val("North Carolina");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "33": //North Dakota
										$("#pog_AB").val("North Dakota");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "34": //Ohio
										$("#pog_AB").val("Ohio");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "35": //Oklahoma
										$("#pog_AB").val("Oklahoma");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "36": //Oregon
										$("#pog_AB").val("Oregon");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "37": //Pennsylvania
										$("#pog_AB").val("Pennsylvania");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "38": //Rhode Island
										$("#pog_AB").val("Rhode Island");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "39": //South Carolina
										$("#pog_AB").val("South Carolina");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "40": //South Dakota
										$("#pog_AB").val("South Dakota");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "41": //Tennessee
										$("#pog_AB").val("Tennessee");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "42": //Texas
										$("#pog_AB").val("Texas");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "43": //Utah
										$("#pog_AB").val("Utah");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "44": //Vermont
										$("#pog_AB").val("Vermont");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "45": //Virginia
										$("#pog_AB").val("Virginia");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "46": //Washington
										$("#pog_AB").val("Washington");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "47": //West Virginia
										$("#pog_AB").val("West Virginia");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "48": //Wisconsin
										$("#pog_AB").val("Wisconsin");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "49": //Wyoming
										$("#pog_AB").val("Wyoming");
                                ctx.strokeRect(123,49,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",129,56);
								ctx.fillText("Flag",130,62);
								
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
								break;
									
								default: 
									$("#pog_AB").val("");
								break; 
								}
								$(".stateContLP").slideDown(500);
								$(".leftPocketCustomLogoMess").slideUp(500);
							break;
							
							case "02": //Custom Logo
								ctx.strokeRect(123,49,30,15);
								ctx.font = '4pt Arial';
								ctx.fillText("Your Logo",126,55);
								ctx.font = '5pt Arial';
								ctx.fillText("Here",130,62);
								
								$(".leftPocketState").val("");
								$("#pog_AB").val("");
								$(".stateContLP").slideUp(500);
								$(".leftPocketCustomLogoMess").slideDown(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left pocket custom logo</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
						}
					}
					//**END LEFT POCKET LOGO SECTION**//
					
					//**BEGIN RIGHT POCKET LOGO SECTION**//
					if($("#pog_AC").val() !== ""){
						switch($("#pog_AC").val()){
							case "00": //US Flag
								var stripeImg=document.getElementById("usPatchLP");
								ctx.drawImage(stripeImg,50,49);
								$(".rightPocketState").val("");
								$("#pog_AE").val("");
								$(".stateContRP").slideUp(500);
								$(".rightPocketCustomLogoMess").slideUp(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket US flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
							
							case "01": //State Flag
								switch($(".rightPocketState").val()){
									case "00": //ALABAMA	
										$("#pog_AE").val("Alabama");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "01": //Alaska
										$("#pog_AE").val("Alaska");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "02": //Arizona
										$("#pog_AE").val("Arizona");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "03": //Arkansas							
										$("#pog_AE").val("Arkansas");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "04": //California
										$("#pog_AE").val("California");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "05": //Colorado
										$("#pog_AE").val("Colorado");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "06": //Connecticut
										$("#pog_AE").val("Connecticut");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "07": //Delaware
										$("#pog_AE").val("Delaware");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "08": //Florida
										$("#pog_AE").val("Florida");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "09": //Georgia
										$("#pog_AE").val("Georgia");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "10": //Hawaii
										$("#pog_AE").val("Hawaii");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "11": //Idaho
										$("#pog_AE").val("Idaho");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "12": //Illinois
										$("#pog_AE").val("Illinois");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "13": //Indiana
										$("#pog_AE").val("Indiana");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "14": //Iowa
										$("#pog_AE").val("Iowa");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "15": //Kansas
										$("#pog_AE").val("Kansas");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "16": //Kentucky
										$("#pog_AE").val("Kentucky");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "17": //Louisiana
										$("#pog_AE").val("Louisiana");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "18": //Maine
										$("#pog_AE").val("Maine");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "19": //Maryland
										$("#pog_AE").val("Maryland");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "20": //Massachusetts
										$("#pog_AE").val("Massachusetts");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "21": //Michigan
										$("#pog_AE").val("Michigan");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "22": //Minnesota
										$("#pog_AE").val("Minnesota");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "23": //Mississippi
										$("#pog_AE").val("Mississippi");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "24": //Missouri
										$("#pog_AE").val("Missouri");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "25": //Montana
										$("#pog_AE").val("Montana");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "26": //Nebraska
										$("#pog_AE").val("Nebraska");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "27": //Nevada
										$("#pog_AE").val("Nevada");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "28": //New Hampshire
										$("#pog_AE").val("New Hampshire");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "29": //New Jersey
										$("#pog_AE").val("New Jersey");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "30": //New Mexico
										$("#pog_AE").val("New Mexico");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "31": //New York
										$("#pog_AE").val("New York");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "32": //North Carolina
										$("#pog_AE").val("North Carolina");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "33": //North Dakota
										$("#pog_AE").val("North Dakota");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "34": //Ohio
										$("#pog_AE").val("Ohio");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "35": //Oklahoma
										$("#pog_AE").val("Oklahoma");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "36": //Oregon
										$("#pog_AE").val("Oregon");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "37": //Pennsylvania
										$("#pog_AE").val("Pennsylvania");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "38": //Rhode Island
										$("#pog_AE").val("Rhode Island");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "39": //South Carolina
										$("#pog_AE").val("South Carolina");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "40": //South Dakota
										$("#pog_AE").val("South Dakota");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "41": //Tennessee
										$("#pog_AE").val("Tennessee");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "42": //Texas
										$("#pog_AE").val("Texas");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "43": //Utah
										$("#pog_AE").val("Utah");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "44": //Vermont
										$("#pog_AE").val("Vermont");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "45": //Virginia
										$("#pog_AE").val("Virginia");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "46": //Washington
										$("#pog_AE").val("Washington");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "47": //West Virginia
										$("#pog_AE").val("West Virginia");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "48": //Wisconsin
										$("#pog_AE").val("Wisconsin");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "49": //Wyoming
										$("#pog_AE").val("Wyoming");
                                ctx.strokeRect(50,50,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",56,56);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
								break;
									
								default: 
									$("#pog_AE").val("");
								break; 
								}
								$(".stateContRP").slideDown(500);
								$(".rightPocketCustomLogoMess").slideUp(500);
							break;
							
							case "02": //Custom Logo
								ctx.strokeRect(50,50,30,15);
								ctx.font = '4pt Arial';
								ctx.fillText("Your Logo",53,56);
								ctx.font = '5pt Arial';
								ctx.fillText("Here",57,63);
								
								$(".rightPocketState").val("");
								$("#pog_AE").val("");
								$(".stateContRP").slideUp(500);
								$(".rightPocketCustomLogoMess").slideDown(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right pocket custom logo</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
						}
					}
					//**END RIGHT POCKET LOGO SECTION**//
					
					//**BEGIN LEFT SHOULDER LOGO SECTION**//
					if($("#pog_AF").val() !== ""){
						switch($("#pog_AF").val()){
							case "00": //US Flag
								ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
								var stripeImg=document.getElementById("usPatchLP");
								ctx.drawImage(stripeImg,240,18);
								$(".leftShoulderState").val("");
								$("#pog_AG").val("");
								$(".stateContLS").slideUp(500);
								$(".leftShoulderCustomLogoMess").slideUp(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder US flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
							
							case "01": //State Flag
								switch($(".leftShoulderState").val()){
									case "00": //ALABAMA	
										$("#pog_AG").val("Alabama");
								ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",248,31);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "01": //Alaska
										$("#pog_AG").val("Alaska");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "02": //Arizona
										$("#pog_AG").val("Arizona");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "03": //Arkansas							
										$("#pog_AG").val("Arkansas");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "04": //California
										$("#pog_AG").val("California");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "05": //Colorado
										$("#pog_AG").val("Colorado");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "06": //Connecticut
										$("#pog_AG").val("Connecticut");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "07": //Delaware
										$("#pog_AG").val("Delaware");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "08": //Florida
										$("#pog_AG").val("Florida");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "09": //Georgia
										$("#pog_AG").val("Georgia");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "10": //Hawaii
										$("#pog_AG").val("Hawaii");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "11": //Idaho
										$("#pog_AG").val("Idaho");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "12": //Illinois
										$("#pog_AG").val("Illinois");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "13": //Indiana
										$("#pog_AG").val("Indiana");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "14": //Iowa
										$("#pog_AG").val("Iowa");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "15": //Kansas
										$("#pog_AG").val("Kansas");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "16": //Kentucky
										$("#pog_AG").val("Kentucky");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "17": //Louisiana
										$("#pog_AG").val("Louisiana");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "18": //Maine
										$("#pog_AG").val("Maine");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "19": //Maryland
										$("#pog_AG").val("Maryland");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "20": //Massachusetts
										$("#pog_AG").val("Massachusetts");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "21": //Michigan
										$("#pog_AG").val("Michigan");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "22": //Minnesota
										$("#pog_AG").val("Minnesota");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "23": //Mississippi
										$("#pog_AG").val("Mississippi");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "24": //Missouri
										$("#pog_AG").val("Missouri");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "25": //Montana
										$("#pog_AG").val("Montana");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "26": //Nebraska
										$("#pog_AG").val("Nebraska");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "27": //Nevada
										$("#pog_AG").val("Nevada");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "28": //New Hampshire
										$("#pog_AG").val("New Hampshire");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "29": //New Jersey
										$("#pog_AG").val("New Jersey");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "30": //New Mexico
										$("#pog_AG").val("New Mexico");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "31": //New York
										$("#pog_AG").val("New York");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "32": //North Carolina
										$("#pog_AG").val("North Carolina");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "33": //North Dakota
										$("#pog_AG").val("North Dakota");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "34": //Ohio
										$("#pog_AG").val("Ohio");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "35": //Oklahoma
										$("#pog_AG").val("Oklahoma");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "36": //Oregon
										$("#pog_AG").val("Oregon");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "37": //Pennsylvania
										$("#pog_AG").val("Pennsylvania");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "38": //Rhode Island
										$("#pog_AG").val("Rhode Island");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "39": //South Carolina
										$("#pog_AG").val("South Carolina");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "40": //South Dakota
										$("#pog_AG").val("South Dakota");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "41": //Tennessee
										$("#pog_AG").val("Tennessee");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "42": //Texas
										$("#pog_AG").val("Texas");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "43": //Utah
										$("#pog_AG").val("Utah");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "44": //Vermont
										$("#pog_AG").val("Vermont");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "45": //Virginia
										$("#pog_AG").val("Virginia");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "46": //Washington
										$("#pog_AG").val("Washington");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "47": //West Virginia
										$("#pog_AG").val("West Virginia");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "48": //Wisconsin
										$("#pog_AG").val("Wisconsin");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "49": //Wyoming
										$("#pog_AG").val("Wyoming");
                                ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
                                
								ctx.strokeRect(240,18,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",246,25);
								ctx.fillText("Flag",57,63);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
								break;
									
								default: 
									$("#pog_AG").val("");
								break; 
								}
								$(".stateContLS").slideDown(500);
								$(".leftShoulderCustomLogoMess").slideUp(500);
							break;
							
							case "02": //Custom Logo
								ctx.strokeRect(183,58,30,15);
								ctx.beginPath(); 
								ctx.moveTo(215,55);
								ctx.lineTo(240,35);
								ctx.stroke();
								//ctx.strokeRect(230,5,30,15);
							
								ctx.strokeRect(240,18,30,15);
								ctx.font = '4pt Arial';
								ctx.fillText("Your Logo",243,24);
								ctx.font = '5pt Arial';
								ctx.fillText("Here",248,31);
								
								$(".leftShoulderState").val("");
								$("#pog_AG").val("");
								$(".stateContLS").slideUp(500);
								$(".leftShoulderCustomLogoMess").slideDown(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Left shoulder custom logo</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
						}
					}
					//**END LEFT SHOULDER LOGO SECTION**//
					
					//**BEGIN RIGHT SHOULDER LOGO SECTION**//
					if($("#pog_AH").val() !== ""){
						switch($("#pog_AH").val()){
							case "00": //US Flag
								ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								var stripeImg=document.getElementById("usPatchLP");
								ctx.drawImage(stripeImg,15,12);
								$(".rightShoulderState").val("");
								$("#pog_AI").val("");
								$(".stateContRS").slideUp(500);
								$(".rightShoulderCustomLogoMess").slideUp(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder US flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
							
							case "01": //State Flag
								switch($(".rightShoulderState").val()){
									case "00": //ALABAMA	
										$("#pog_AI").val("Alabama");
								ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "01": //Alaska
										$("#pog_AI").val("Alaska");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "02": //Arizona
										$("#pog_AI").val("Arizona");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "03": //Arkansas							
										$("#pog_AI").val("Arkansas");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "04": //California
										$("#pog_AI").val("California");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "05": //Colorado
										$("#pog_AI").val("Colorado");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "06": //Connecticut
										$("#pog_AI").val("Connecticut");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "07": //Delaware
										$("#pog_AI").val("Delaware");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "08": //Florida
										$("#pog_AI").val("Florida");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "09": //Georgia
										$("#pog_AI").val("Georgia");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "10": //Hawaii
										$("#pog_AI").val("Hawaii");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "11": //Idaho
										$("#pog_AI").val("Idaho");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "12": //Illinois
										$("#pog_AI").val("Illinois");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "13": //Indiana
										$("#pog_AI").val("Indiana");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "14": //Iowa
										$("#pog_AI").val("Iowa");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "15": //Kansas
										$("#pog_AI").val("Kansas");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "16": //Kentucky
										$("#pog_AI").val("Kentucky");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "17": //Louisiana
										$("#pog_AI").val("Louisiana");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "18": //Maine
										$("#pog_AI").val("Maine");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "19": //Maryland
										$("#pog_AI").val("Maryland");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "20": //Massachusetts
										$("#pog_AI").val("Massachusetts");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "21": //Michigan
										$("#pog_AI").val("Michigan");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "22": //Minnesota
										$("#pog_AI").val("Minnesota");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "23": //Mississippi
										$("#pog_AI").val("Mississippi");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "24": //Missouri
										$("#pog_AI").val("Missouri");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "25": //Montana
										$("#pog_AI").val("Montana");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "26": //Nebraska
										$("#pog_AI").val("Nebraska");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "27": //Nevada
										$("#pog_AI").val("Nevada");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "28": //New Hampshire
										$("#pog_AI").val("New Hampshire");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "29": //New Jersey
										$("#pog_AI").val("New Jersey");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "30": //New Mexico
										$("#pog_AI").val("New Mexico");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "31": //New York
										$("#pog_AI").val("New York");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "32": //North Carolina
										$("#pog_AI").val("North Carolina");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "33": //North Dakota
										$("#pog_AI").val("North Dakota");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "34": //Ohio
										$("#pog_AI").val("Ohio");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "35": //Oklahoma
										$("#pog_AI").val("Oklahoma");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "36": //Oregon
										$("#pog_AI").val("Oregon");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "37": //Pennsylvania
										$("#pog_AI").val("Pennsylvania");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "38": //Rhode Island
										$("#pog_AI").val("Rhode Island");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "39": //South Carolina
										$("#pog_AI").val("South Carolina");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "40": //South Dakota
										$("#pog_AI").val("South Dakota");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "41": //Tennessee
										$("#pog_AI").val("Tennessee");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "42": //Texas
										$("#pog_AI").val("Texas");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "43": //Utah
										$("#pog_AI").val("Utah");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "44": //Vermont
										$("#pog_AI").val("Vermont");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "45": //Virginia
										$("#pog_AI").val("Virginia");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "46": //Washington
										$("#pog_AI").val("Washington");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "47": //West Virginia
										$("#pog_AI").val("West Virginia");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "48": //Wisconsin
										$("#pog_AI").val("Wisconsin");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
                                break;
									
									case "49": //Wyoming
										$("#pog_AI").val("Wyoming");
                                ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '5pt Arial';
								ctx.fillText("State",20,18);
								ctx.fillText("Flag",22,24);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder state flag</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
								break;
									
								default: 
									$("#pog_AI").val("");
								break; 
								}
								$(".stateContRS").slideDown(500);
								$(".rightShoulderCustomLogoMess").slideUp(500);
							break;
							
							case "02": //Custom Logo
								ctx.beginPath(); 
								ctx.moveTo(45,45);
								ctx.lineTo(30,30);
								ctx.stroke();
								ctx.strokeRect(14,11,30,15);
								ctx.font = '4pt Arial';
								ctx.fillText("Your Logo",17,17);
								ctx.font = '5pt Arial';
								ctx.fillText("Here",21,24);
								
								$(".rightShoulderState").val("");
								$("#pog_AG").val("");
								$(".stateContRS").slideUp(500);
								$(".rightShoulderCustomLogoMess").slideDown(500);
								totalPrice += 8.00;
								$('<div style="width:458px; clear:both;"><p class="floatLeft">Right shoulder custom logo</p><p class="floatRight">$8.00</p></div>').appendTo(".selectedOptionPriceList");
							break;
						}
					}
					//**END RIGHT SHOULDER LOGO SECTION**//

				//**END LOGO SECTION**//
			//**END EMBROIDERY/LOGO IMAGE DRAWING**// 
			
			//**BEGIN PRICE CALCULATION UPDATE**//
				totalPrice = Math.ceil(totalPrice * 100) / 100;
				$('.selectedOptionsTotalPrice').text('New Total Price: $'+totalPrice);
			//**END PRICE CALCULATION UPDATE**//
			
				
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
						
						$("#pog_AA").val("");
						$(".leftPocketState").val("");
						$("#pog_AB").val("");
						$(".stateContLP").hide();
						$(".leftPocketCustomLogoMess").hide();
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
						
						$("#pog_AC").val("");
						$(".rightPocketState").val("");
						$("#pog_AE").val("");
						$(".stateContRP").hide();
						$(".rightPocketCustomLogoMess").hide();
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
						
						$("#pog_AF").val("");
						$(".leftShoulderState").val("");
						$("#pog_AG").val("");
						$(".stateContLS").hide();
						$(".leftShoulderCustomLogoMess").hide();
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
						
						$("#pog_AH").val("");
						$(".rightShoulderState").val("");
						$("#pog_AI").val("");
						$(".stateContLS").hide();
						$(".rightShoulderCustomLogoMess").hide();
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
						
						$("#pog_AA").val("");
						$(".leftPocketState").val("");
						$("#div_AB").val("");
						$(".stateContLP").hide();
						$(".leftPocketCustomLogoMess").hide();
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
						
						$("#pog_AC").val("");
						$(".rightPocketState").val("");
						$("#pog_AE").val("");
						$(".stateContRP").hide();
						$(".rightPocketCustomLogoMess").hide();
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
						
						$("#pog_AF").val("");
						$(".leftShoulderState").val("");
						$("#pog_AG").val("");
						$(".stateContLS").hide();
						$(".leftShoulderCustomLogoMess").hide();
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
						
						$("#pog_AH").val("");
						$(".rightShoulderState").val("");
						$("#pog_AI").val("");
						$(".stateContLS").hide();
						$(".rightShoulderCustomLogoMess").hide();
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
				
				//**STATE SELECTOR FUNCTIONS**//
				
				
				
				//**END EMBRROIDERY/LOGO CLICK FUNCTIONS**//
				
				resetAllStripes : function(){
					
					$("#pog_A9").val("");
					$("#pog_AV").prop('checked', false);
					$("#pog_AL").prop('checked', false);
					$("#pog_AJ").prop('checked', false);
					$("#pog_AP").prop('checked', false);
					$("#pog_AR").prop('checked', false);
					$("#pog_AY").prop('checked', false);
					$("#pog_B8").prop('checked', false);
					$("#pog_AX").prop('checked', false);
					$("#pog_B0").prop('checked', false);
					$("#pog_B1").prop('checked', false);
					$("#pog_AZ").prop('checked', false);
					$("#pog_B6").prop('checked', false);
					$("#pog_AK").prop('checked', false);
					$("#pog_B5").prop('checked', false);
					$("#pog_B7").prop('checked', false);
					$("#pog_BC").prop('checked', false);
					
					$("#pog_AV").val("OFF");
					$("#pog_AL").val("OFF");
					$("#pog_AJ").val("OFF");
					$("#pog_AP").val("OFF");
					$("#pog_AR").val("OFF");
					$("#pog_AY").val("OFF");
					$("#pog_B8").val("OFF");
					$("#pog_AX").val("OFF");
					$("#pog_B0").val("OFF");
					$("#pog_B1").val("OFF");
					$("#pog_AZ").val("OFF");
					$("#pog_B6").val("OFF");
					$("#pog_AK").val("OFF");
					$("#pog_B5").val("OFF");
					$("#pog_B7").val("OFF");
					$("#pog_BC").val("OFF");
					
					app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
				},
				
				resetAllEmbroidLogo : function(){
					$(".leftPocket").prop('checked', false);
					$('.leftPocketCont').slideUp(1000);
					$('.leftPocketCont').data('collapseOrExpanded',false).append();
					$(".lpRadioEmbroid").prop('checked', false);
					$(".lpRadioLogo").prop('checked', false);
					$('.leftPocketEmbroidCont').slideUp(1000);
					$('.leftPocketLogoCont').slideUp(1000);
					$("#pog_BD").val("");
					$("#pog_BE").find('option:first').attr('selected','selected');
					$("#pog_A8").find('option:first').attr('selected','selected');
					$("#pog_AA").val("");
					$(".leftPocketState").val("");
					$("#pog_AB").val("");
					$(".stateContLP").hide();
					$(".leftPocketCustomLogoMess").hide();

					$(".rightPocket").prop('checked', false);
					$('.rightPocketCont').slideUp(1000);
					$('.rightPocketCont').data('collapseOrExpanded',false).append();
					$(".rpRadioEmbroid").prop('checked', false);
					$(".rpRadioLogo").prop('checked', false);
					$('.rightPocketEmbroidCont').slideUp(1000);
					$('.rightPocketLogoCont').slideUp(1000);
					$("#pog_BG").val("");
					$("#pog_BH").find('option:first').attr('selected','selected');
					$("#pog_BI").find('option:first').attr('selected','selected');
					$("#pog_AC").val("");
					$(".rightPocketState").val("");
					$("#pog_AE").val("");
					$(".stateContRP").hide();
					$(".rightPocketCustomLogoMess").hide();

					$(".leftShoulder").prop('checked', false);
					$('.leftShoulderCont').slideUp(1000);
					$('.leftShoulderCont').data('collapseOrExpanded',false).append();
					$(".lsRadioEmbroid").prop('checked', false);
					$(".lsRadioLogo").prop('checked', false);
					$('.leftShoulderEmbroidCont').slideUp(1000);
					$('.leftShoulderLogoCont').slideUp(1000);
					$("#pog_BJ").val("");
					$("#pog_BK").find('option:first').attr('selected','selected');
					$("#pog_BL").find('option:first').attr('selected','selected');
					$("#pog_AF").val("");
					$(".leftShoulderState").val("");
					$("#pog_AG").val("");
					$(".stateContLS").hide();
					$(".leftShoulderCustomLogoMess").hide();

					$(".rightShoulder").prop('checked', false);
					$('.rightShoulderCont').slideUp(1000);
					$('.rightShoulderCont').data('collapseOrExpanded',false).append();
					$(".rsRadioEmbroid").prop('checked', false);
					$(".rsRadioLogo").prop('checked', false);
					$('.rightShoulderEmbroidCont').slideUp(1000);
					$('.rightShoulderLogoCont').slideUp(1000);
					$("#pog_BM").val("");
					$("#pog_BN").find('option:first').attr('selected','selected');
					$("#pog_BO").find('option:first').attr('selected','selected');
					$("#pog_AH").val("");
					$(".rightShoulderState").val("");
					$("#pog_AI").val("");
					$(".stateContLS").hide();
					$(".rightShoulderCustomLogoMess").hide();
					app.ext.pogs_blueCollar.a.UpdateCustomizerImage();
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