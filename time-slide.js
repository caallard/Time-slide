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
				width : {
					type : "items",
					label : "Width and Selections",
					items : {
						fixed : {
							ref : "fixed",
							label : "Fixed width",
							type : "boolean",
							defaultValue : true
						},
						width : {
							ref : "width",
							label : "Width",
							type : "number",
							defaultValue : 25,
							show : function(data) {
								return data.fixed;
							}
						},
						percent : {
							ref : "percent",
							type : "boolean",
							label : "Unit",
							component : "switch",
							defaultValue : true,
							options : [{
								value : true,
								label : "Percent"
							}, {
								value : false,
								label : "Pixels"
							}],
							show : function(data) {
								return data.fixed;
							}
						}
					}
				},
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
						}/*,
						qSortByLoadOrder:{
							type: "numeric",
							component : "dropdown",
							label : "Sort by Load Order",
							ref : "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
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
							
						}*/
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
									ref : "myproperties.timeout",
									label : "Time between selection",
									show : true,
									defaultValue : 2000,
									min : 100,
									max : 100000
								},
								showButtons: {
									type: "boolean",
									component: "switch",
									label: "Show play buttons",
									ref: "myproperties.showButtons",
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
									ref: "myproperties.showValue",
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
									ref: "myproperties.loop",
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
									ref: "myproperties.autoStart",
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
			//var self = this, html = "<ul>", style;
			var self = this, html = "", style;
			var selected=0;
			var selected_text=0;
			var timeoutID;
			/*var appid=layout.qInfo.qId;
			//var window['PluginData'];
			window.PluginData[appid] = 0;*/
			
			
			
			
			//window.clearTimeout(timeoutID);
			if(layout.fixed) {
				style = 'style="width:' + layout.width + (layout.percent ? '%' : 'px') + ';"';
			} else {
				style = '';
			}
				//console.log( 'Hypercube: ', layout.qHyperCube );
				//console.log( 'Backend: ', this.backendApi );
				console.dir(layout);
			//console.log( 'qid: ', layout.qInfo.qId );
			//objs.sort(compare);
			//console.log( 'Backend: ', layout.qListObject.qDataPages[0].qMatrix );
			//layout.qListObject.qDataPages[0].qMatrix.sort(compare);
			/*layout.qListObject.qDataPages[0].qMatrix.sort(function (a,b) {
			  if (a[0].qElemNumber < b[0].qElemNumber)
				return -1;
			  if (a[0].qElemNumber > b[0].qElemNumber)
				return 1;
			  return 0;
			});*/
			//console.log( 'Backend: ', layout.qListObject.qDataPages[0].qMatrix );
			this.backendApi.eachDataRow(function(rownum, row) {
				//html += '<li ' + style + ' class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
				//html += '</li>';
				if (row[0].qState=='S'){
					selected=row[0].qElemNumber;
					selected_text=row[0].qText;
				}
			});
			html += "</ul>";
			$element.html(html);
			
			if(layout.myproperties.showButtons){
				html += '<button value="start"><img src="/extensions/time-slide/start.png" width="20px"/></button>';
				html += '<button value="stop"><img src="/extensions/time-slide/stop.png" width="20px"/></button>';
			}

			
			if(layout.myproperties.showValue){
				html += '<div style="display:Block; float: right">'+selected_text+'</div>';
			}
			
			//bug à corriger: -1 sur height//OK
			html += '<input type="range" min="' + 0 + '" max="' + (layout.qListObject.qDataPages[0].qArea.qHeight-1) + '" step="' + 1 + '" style="width:98%" value="'+selected+'"/>';
			
			//html += '<div class="status" style="display:none"/>';

			//console.log( 'getDimensionInfos: ', this.backendApi.getDimensionInfos() );
			//console.log( 'qGroupFieldDefs: ', this.backendApi.getDimensionInfos().qGroupFieldDefs() );
			$element.html(html);
			
			var pluginDiv=$element.find('input')[0].parentNode;
			
			if(layout.myproperties.autoStart && pluginDiv.getAttribute("data-state")!="Stopped"){
				pluginDiv.setAttribute("data-state","Started");
			}
			
			if(pluginDiv.getAttribute("data-timeout")===null){
				pluginDiv.setAttribute("data-timeout","Unset");
			}
			
			console.log( 'timeout: ',pluginDiv.getAttribute("data-timeout"));
			
			/*console.log( 'angular: ', angular );
			console.log( 'this: ', this );
			console.log( 'getViewState: ', this.getViewState());
			var self = this;
			console.log( 'self: ', self );
			console.log( 'self-inEditState: ',self.inEditState() );
			console.log( 'this-inEditState: ',this.inEditState() );*/
			
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
						//console.log('Started');
						if(selected<(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
							//console.log('Startedrun');
							//console.log( 'range before: ', selected );
							var value = parseInt(selected+1, 10), dim = 0;
							pluginDiv.setAttribute("data-timeout","Unset");
							self.backendApi.selectValues(dim, [value], false);
							//console.log( 'range after: ', value );
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
			
			if(layout.myproperties.showButtons){
				$element.find('button').on('click', function() {
					if(this.getAttribute("value")=="start"){
						//alert('start');
						//console.log( 'start: ', this );
						//console.log( 'status: ', status );
						pluginDiv.setAttribute("data-state","Started");
						//$element.find('div').setAttribute("data-state","Started");
						//this.setAttribute("data-state","Started");
						window.clearTimeout(timeoutID);
						if(selected==(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
							sendRestart();
						}else{
							sendSelected();
						}
						
						
					}else if(this.getAttribute("value")=="stop"){
						//alert('stop');
						pluginDiv.setAttribute("data-state","Stopped");
						window.clearTimeout(timeoutID);
					}
					
					
				})
			}
			
			
			
			if( pluginDiv.getAttribute("data-state")=="Started" && !this.inEditState() && pluginDiv.getAttribute("data-timeout")!="Set"){
				//console.log( 'timeout: ', layout.myproperties.timeout );
				if(layout.myproperties.loop && selected==(layout.qListObject.qDataPages[0].qArea.qHeight-1)){
					pluginDiv.setAttribute("data-timeout","Set");
					timeoutID = window.setTimeout(sendRestart, layout.myproperties.timeout);
				}else{
					pluginDiv.setAttribute("data-timeout","Set");
					timeoutID = window.setTimeout(sendSelected, layout.myproperties.timeout);
				}
			}
			

			//alert(html);
			/*if(this.selectionsEnabled && layout.selectionMode !== "NO") {
				$element.find('li').on('qv-activate', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						if(layout.selectionMode === "REPLACE") {
							//console.log( 'select: ', value );
							self.backendApi.selectValues(dim, [value], false);
						}
					}
				});
			}*/
		}
	};
});
