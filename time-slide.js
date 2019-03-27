/*
 * @license    Waterfall : Copyright (c) 2019, Charles-Alban Allard All rights reserved.
 * @release    2.0
 * @details    https://github.com/caallard/Time-slide


*/
define(["jquery", "text!./css.css"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			qListObjectDef : {
				qShowAlternatives : true,
				qFrequencyMode : "V",
				/*qSortCriterias : {
					qSortByState : 0
				},*/
				qAutoSortByState : {
					qDisplayNumberOfRows : 0
				},
				qInitialDataFetch : [{
					qWidth : 1,
					qHeight : 10000
				}]
			},
			fixed : true,
			width : 25,
			percent : true,
			selectionMode : "REPLACE"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimension : {
					type : "items",
					label : "Dimensions",
					ref : "qListObjectDef",
					min : 1,
					max : 1,
					items : {
						label : {
							type : "string",
							ref : "qListObjectDef.qDef.qFieldLabels.0",
							label : "Label",
							show : true
						},
						libraryId : {
							type : "string",
							component : "library-item",
							libraryItemType : "dimension",
							ref : "qListObjectDef.qLibraryId",
							label : "Dimension",
							show : function(data) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field : {
							type : "string",
							expression : "always",
							expressionType : "dimension",
							ref : "qListObjectDef.qDef.qFieldDefs.0",
							label : "Field",
							show : function(data) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						qSortByNumeric:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Numeric",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,
							
						},
						qSortByAscii:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Alphabetical",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
							options : [{
								value : 1,
								label : "Ascending"
							}, {
								value : 0,
								label : "No"
							}, {
								value : -1,
								label : "Descending"
							}],
							defaultValue : 0,							
						}
					}
				},
				settings : {
					uses : "settings",
					items: {
						PluginParameters: {
							type: "items",
							label: "Plugin Parameters",
							items: {
								timeout : {
									type : "integer",
									ref : "config.timeout",
									label : "Time between selection (ms)",
									show : true,
									defaultValue : 2000,
									min : 100,
									max : 100000
								},
								showButtons: {
									type: "boolean",
									component: "switch",
									label: "Show play buttons",
									ref: "config.showButtons",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								showValue: {
									type: "boolean",
									component: "switch",
									label: "Show selected value",
									ref: "config.showValue",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								loop: {
									type: "boolean",
									component: "switch",
									label: "Loop playing",
									ref: "config.loop",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								},
								autoStart: {
									type: "boolean",
									component: "switch",
									label: "Auto start animation",
									ref: "config.autoStart",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								}
							}
						}
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			var id=layout.qInfo.qId;
			var self = this;
			var html = '<div id="'+id+'" class="qv-object-Time-slide" >';
			var selected=0;
			var selected_text=0;
			var timeoutID;

			this.backendApi.eachDataRow(function(rownum, row) {
				if (row[0].qState=='S'){
					selected=row[0].qElemNumber;
					selected_text=row[0].qText;
				}
			});
			html += "</ul>";
			
			//$element.html(html);
			
			if(layout.config.showButtons){
				html += '<button value="start"><img src="/extensions/time-slide/start2.png" width="20px"/></button>';
				html += '<button value="stop"><img src="/extensions/time-slide/stop2.png" width="20px"/></button>';
			}

			
			if(layout.config.showValue){
				html += '<div class="value" style="display:Block; float: right">'+selected_text+'</div>';
			}
			
			//bug à corriger: -1 sur height//OK
			html += '<input type="range" min="' + 0 + '" max="' + (layout.qListObject.qDataPages[0].qArea.qHeight-1) + '" step="' + 1 + '" style="width:98%" value="'+selected+'"/>';

			html += "</div>";
			$element.html(html);
			
			var pluginDiv=$element.find('input')[0].parentNode;
			
			if(layout.config.autoStart && pluginDiv.getAttribute("data-state")!="Stopped"){
				pluginDiv.setAttribute("data-state","Started");
			}
			
			if(pluginDiv.getAttribute("data-timeout")===null){
				pluginDiv.setAttribute("data-timeout","Unset");
			}
			
			console.log( 'timeout: ',pluginDiv.getAttribute("data-timeout"));
			
			$element.find('input').on('change', function() {
				var val = $(this).val() + '';
				var value = parseInt(val, 10), dim = 0;
				console.log( 'range: ', value );
				
				pluginDiv.setAttribute("data-state","Stopped")
				window.clearTimeout(timeoutID);
				
				pluginDiv.setAttribute("data-timeout","Unset");
				self.backendApi.selectValues(dim, [value], false);
			})
			
			function sendSelected(){
				if(pluginDiv.getAttribute("data-state")=="Started"){
						if(selected<(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
							var value = parseInt(selected+1, 10), dim = 0;
							pluginDiv.setAttribute("data-timeout","Unset");
							self.backendApi.selectValues(dim, [value], false);
						}
					}
				
			}
			
			function sendRestart(){
				if(pluginDiv.getAttribute("data-state")=="Started"){
						var value = parseInt(0, 10), dim = 0;
							pluginDiv.setAttribute("data-timeout","Unset");
						self.backendApi.selectValues(dim, [value], false);
					}
				
			}
			
			if(layout.config.showButtons){
				$element.find('button').on('click', function() {
					if(this.getAttribute("value")=="start"){
						pluginDiv.setAttribute("data-state","Started");
						window.clearTimeout(timeoutID);
						if(selected==(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
							sendRestart();
						}else{
							sendSelected();
						}
						
						
					}else if(this.getAttribute("value")=="stop"){
						pluginDiv.setAttribute("data-state","Stopped");
						window.clearTimeout(timeoutID);
					}
					
					
				})
			}
			
			
			
			if( pluginDiv.getAttribute("data-state")=="Started" && !this.inEditState() && pluginDiv.getAttribute("data-timeout")!="Set"){
				if(layout.config.loop && selected==(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
					pluginDiv.setAttribute("data-timeout","Set");
					timeoutID = window.setTimeout(sendRestart, layout.config.timeout);
				}else{
					pluginDiv.setAttribute("data-timeout","Set");
					timeoutID = window.setTimeout(sendSelected, layout.config.timeout);
				}
			}
		}
	};
});
