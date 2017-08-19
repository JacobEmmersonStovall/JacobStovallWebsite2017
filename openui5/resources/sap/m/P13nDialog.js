/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Dialog','./IconTabBar','./IconTabFilter','./library','sap/ui/core/EnabledPropagator','sap/m/ButtonType','sap/m/DialogRenderer','sap/ui/core/MessageType'],function(q,D,I,a,l,E,B,b,M){"use strict";var P=D.extend("sap.m.P13nDialog",{metadata:{library:"sap.m",properties:{initialVisiblePanelType:{type:"string",group:"Misc",defaultValue:null},showReset:{type:"boolean",group:"Appearance",defaultValue:false},showResetEnabled:{type:"boolean",group:"Appearance",defaultValue:false},validationExecutor:{type:"object",group:"Misc",defaultValue:null}},aggregations:{panels:{type:"sap.m.P13nPanel",multiple:true,singularName:"panel",bindable:"bindable"}},events:{ok:{},cancel:{},reset:{}}},renderer:function(r,c){b.render.apply(this,arguments);var i=c._getVisiblePanelID();var p=c.getVisiblePanel();if(i&&p){r.write("<div");r.writeAttribute("id",i);r.write(">");r.renderControl(p);r.write("</div>");}}});E.apply(P.prototype,[true]);P.prototype.init=function(e){this.addStyleClass("sapMP13nDialog");D.prototype.init.apply(this,arguments);this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oResetButton=null;this._mValidationListener={};this._createDialog();};P.prototype.setShowReset=function(s){this.setProperty("showReset",s);if(this.getButtons()&&this.getButtons()[2]){this.getButtons()[2].setVisible(s);}return this;};P.prototype.setShowResetEnabled=function(e){this.setProperty("showResetEnabled",e);if(this.getButtons()&&this.getButtons()[2]){this.getButtons()[2].setEnabled(e);}return this;};P.prototype.addPanel=function(p){this.addAggregation("panels",p);var n=this._mapPanelToNavigationItem(p);p.data("sapMP13nDialogNavigationItem",n);var N=this._getNavigationControl();if(N){sap.ui.Device.system.phone?N.addItem(n):N.addButton(n);}this._setVisibilityOfPanel(p);this._setDialogTitleFor(p);return this;};P.prototype.insertPanel=function(p,i){this.insertAggregation("panels",p,i);var n=this._mapPanelToNavigationItem(p);p.data("sapMP13nDialogNavigationItem",n);var N=this._getNavigationControl();if(N){sap.ui.Device.system.phone?N.insertItem(n):N.insertButton(n);}this._setVisibilityOfPanel(p);this._setDialogTitleFor(p);return this;};P.prototype.removePanel=function(p){p=this.removeAggregation("panels",p);var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.removeItem(p&&this._getNavigationItemByPanel(p)):n.removeButton(p&&this._getNavigationItemByPanel(p));}return p;};P.prototype.removeAllPanels=function(){var p=this.removeAllAggregation("panels");var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.removeAllItems():n.removeAllButtons();}return p;};P.prototype.destroyPanels=function(){this.destroyAggregation("panels");var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.destroyItems():n.destroyButtons();}return this;};P.prototype._createDialog=function(){if(sap.ui.Device.system.phone){var t=this;this.setStretch(true);this.setVerticalScrolling(false);this.setHorizontalScrolling(false);this.setCustomHeader(new sap.m.Bar({contentLeft:new sap.m.Button({visible:false,type:B.Back,press:function(e){t._backToList();}}),contentMiddle:new sap.m.Title({text:this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"),level:"H1"})}));this.addButton(this._createOKButton());this.addButton(this._createCancelButton());this.addButton(this._createResetButton());}else{this.setHorizontalScrolling(false);this.setContentWidth("65rem");this.setContentHeight("40rem");this.setDraggable(true);this.setResizable(true);this.setTitle(this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"));this.addButton(this._createOKButton());this.addButton(this._createCancelButton());this.addButton(this._createResetButton());}};P.prototype._getNavigationControl=function(){if(this.getPanels().length<2){return null;}var t=this;if(sap.ui.Device.system.phone){if(!this.getContent().length){this.addContent(new sap.m.List({mode:sap.m.ListMode.None,itemPress:function(e){if(e){t._switchPanel(e.getParameter("listItem"));}}}));this.getContent()[0].addItem(this._getNavigationItemByPanel(this.getPanels()[0]));}return this.getContent()[0];}else{if(!this.getSubHeader()||!this.getSubHeader().getContentLeft().length){this.setSubHeader(new sap.m.Bar({contentLeft:[new sap.m.SegmentedButton({select:function(e){t._switchPanel(e.getParameter("button"));},width:'100%'})]}));this.getSubHeader().getContentLeft()[0].addButton(this._getNavigationItemByPanel(this.getPanels()[0]));}return this.getSubHeader().getContentLeft()[0];}};P.prototype._showValidationDialog=function(c,f,v){var w=[];var e=[];this._prepareMessages(f,v,w,e);q.sap.require("sap.m.MessageBox");var m="";if(e.length){e.forEach(function(o,i,d){m=(d.length>1?"• ":"")+o.messageText+"\n"+m;});sap.m.MessageBox.show(m,{icon:sap.m.MessageBox.Icon.ERROR,title:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE_ERROR"),actions:[sap.m.MessageBox.Action.CLOSE],styleClass:!!this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});}else if(w.length){w.forEach(function(o,i,d){m=(d.length>1?"• ":"")+o.messageText+"\n"+m;});m=m+sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE_QUESTION");sap.m.MessageBox.show(m,{icon:sap.m.MessageBox.Icon.WARNING,title:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE"),actions:[sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_FIX"),sap.m.MessageBox.Action.IGNORE],onClose:function(A){if(A===sap.m.MessageBox.Action.IGNORE){c();}},styleClass:!!this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});}};P.prototype._prepareMessages=function(f,v,w,e){if(!f.length&&!v.length){return;}f.forEach(function(p){switch(p){case sap.m.P13nPanelType.filter:v.push({messageType:M.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE")});break;case sap.m.P13nPanelType.columns:v.push({messageType:M.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VISIBLE_ITEMS_THRESHOLD_MESSAGE")});break;case sap.m.P13nPanelType.dimeasure:v.push({messageType:M.Error,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_CHARTTYPE")});break;}});var u=v.filter(function(m,c,d){for(var i=++c;i<d.length;i++){if(m.messageText===d[i].messageText){return false;}}return true;});u.forEach(function(m){if(m.messageType===M.Warning){w.push(m);}else if(m.messageType===M.Error){e.push(m);}});};P.prototype._mapPanelToNavigationItem=function(p){if(!p){return null;}var n=null;if(sap.ui.Device.system.phone){n=new sap.m.StandardListItem({type:sap.m.ListType.Navigation,title:p.getBindingPath("title")?q.extend(true,{},p.getBindingInfo("title")):p.getTitle()});}else{n=new sap.m.Button({type:B.Default,text:p.getBindingPath("title")?q.extend(true,{},p.getBindingInfo("title")):p.getTitle()});}p.setValidationExecutor(q.proxy(this._callValidationExecutor,this));p.setValidationListener(q.proxy(this._registerValidationListener,this));p.setChangeNotifier(q.proxy(this._callChangeNotifier,this));return n;};P.prototype._switchPanel=function(n){var p=this._getPanelByNavigationItem(n);this.setVerticalScrolling(p.getVerticalScrolling());if(sap.ui.Device.system.phone){var N=this._getNavigationControl();if(N){N.setVisible(false);p.beforeNavigationTo();p.setVisible(true);this.getCustomHeader().getContentMiddle()[0].setText(p.getTitle());this.getCustomHeader().getContentLeft()[0].setVisible(true);}}else{this.getPanels().forEach(function(o){if(o===p){o.beforeNavigationTo();o.setVisible(true);}else{o.setVisible(false);}},this);}this.invalidate();this.rerender();};P.prototype._backToList=function(){var n=this._getNavigationControl();if(n){n.setVisible(true);var p=this.getVisiblePanel();p.setVisible(false);this._setDialogTitleFor(p);this.getCustomHeader().getContentLeft()[0].setVisible(false);}};P.prototype.getVisiblePanel=function(){var p=null;this.getPanels().some(function(o){if(o.getVisible()){p=o;return true;}});return p;};P.prototype._getPanelByNavigationItem=function(n){for(var i=0,p=this.getPanels(),c=p.length;i<c;i++){if(p[i].data("sapMP13nDialogNavigationItem")===n){return p[i];}}return null;};P.prototype._getNavigationItemByPanel=function(p){if(!p){return null;}return p.data("sapMP13nDialogNavigationItem");};P.prototype._setVisibilityOfOtherPanels=function(p,v){for(var i=0,c=this.getPanels(),d=c.length;i<d;i++){if(c[i]===p){continue;}c[i].setVisible(v);}};P.prototype._setVisibilityOfPanel=function(p){var v;if(sap.ui.Device.system.phone){v=this.getPanels().length===1;if(v){p.beforeNavigationTo();if(!this.getModel()){this.setModel(p.getModel("$sapmP13nPanel"),"$sapmP13nDialog");}}p.setVisible(v);this._setVisibilityOfOtherPanels(p,false);}else{v=this.getInitialVisiblePanelType()===p.getType()||this.getPanels().length===1;if(v){p.beforeNavigationTo();if(!this.getModel()){this.setModel(p.getModel("$sapmP13nPanel"),"$sapmP13nDialog");}}p.setVisible(v);if(v){this._setVisibilityOfOtherPanels(p,false);this.setVerticalScrolling(p.getVerticalScrolling());var o=this._getNavigationItemByPanel(p);var n=this._getNavigationControl();if(n){n.setSelectedButton(o);}}}};P.prototype.onAfterRendering=function(){D.prototype.onAfterRendering.apply(this,arguments);var c=q(this.getFocusDomRef()).find(".sapMDialogScrollCont");var i=this._getVisiblePanelID();if(i&&c){var p=q.find("#"+i);q(p).appendTo(q(c));}};P.prototype._getVisiblePanelID=function(){var p=this.getVisiblePanel();if(p){return this.getId()+"-panel_"+p.getId();}return null;};P.prototype._setDialogTitleFor=function(p){var t;if(this.getPanels().length>1){t=this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");}else{switch(p.getType()){case sap.m.P13nPanelType.filter:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_FILTER");break;case sap.m.P13nPanelType.sort:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_SORT");break;case sap.m.P13nPanelType.group:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_GROUP");break;case sap.m.P13nPanelType.columns:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_COLUMNS");break;case sap.m.P13nPanelType.dimeasure:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_DIMEASURE");break;default:t=p.getTitleLarge()||this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");}}if(sap.ui.Device.system.phone){this.getCustomHeader().getContentMiddle()[0].setText(t);}else{this.setTitle(t);}};P.prototype._registerValidationListener=function(p,c){if(this.getPanels().indexOf(p)&&c&&this._mValidationListener[p.getType()]===undefined){this._mValidationListener[p.getType()]=c;}};P.prototype._callValidationExecutor=function(){var v=this.getValidationExecutor();if(v&&!q.isEmptyObject(this._mValidationListener)){var t=this;v(this._getPayloadOfPanels()).then(function(V){var r=t._distributeValidationResult(V);for(var T in t._mValidationListener){var c=t._mValidationListener[T];c(r[T]||[]);}});}};P.prototype._callChangeNotifier=function(p){if(this.getShowReset()){this.setShowResetEnabled(true);}};P.prototype._distributeValidationResult=function(r){var d={};r.forEach(function(R){R.panelTypes.forEach(function(t){if(d[t]===undefined){d[t]=[];}d[t].push({columnKey:R.columnKey,messageType:R.messageType,messageText:R.messageText});});});return d;};P.prototype._createOKButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_OK"),layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}),press:function(){t.setBusy(true);var p=t._getPayloadOfPanels();var f=function(){t.setBusy(false);t.fireOk({payload:p});};var F=[];var c=function(){t.getPanels().forEach(function(o){if(F.indexOf(o.getType())>-1){o.onAfterNavigationFrom();}});f();};t.getPanels().forEach(function(o){if(!o.onBeforeNavigationFrom()){F.push(o.getType());}});var v=[];var V=t.getValidationExecutor();if(V){V(p).then(function(v){if(F.length||v.length){t.setBusy(false);t._showValidationDialog(c,F,v);}else{f();}});}else{if(F.length||v.length){t.setBusy(false);t._showValidationDialog(c,F,v);}else{f();}}}});};P.prototype._createCancelButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_CANCEL"),layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}),press:function(){t.fireCancel();}});};P.prototype._createResetButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_RESET"),layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}),visible:this.getShowReset(),enabled:this.getShowResetEnabled(),press:function(){t.setShowResetEnabled(false);var p={};t.getPanels().forEach(function(o){p[o.getType()]=o.getResetPayload();});t.fireReset({payload:p});}});};P.prototype._getPayloadOfPanels=function(){var p={};this.getPanels().forEach(function(o){p[o.getType()]=o.getOkPayload();});return p;};P.prototype.exit=function(){D.prototype.exit.apply(this,arguments);};return P;},true);
