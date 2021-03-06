// COPYRIGHT © 201 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/3.25/esri/copyright.txt for details.

define(["dojo/_base/lang","dojo/_base/array","dojo/dom-construct","dojo/dom-class"],function(e,a,t,r){return{getToggleGroups:function(e,t,r){var o={},n=[];return a.forEach(t,function(a){n.push(this.getToggleGroup(e,a,o,r))},this),{groups:n,hash:o}},getToggleGroup:function(e,t,r,o){r=r||{};var n=e&&e.getStates(t),s={value:t,states:n};if(r[t]=s,n){var g=!1;a.forEach(n.ids,function(e){t==e?g=!0:o||(r[e]=s)}),g||(t=s.value=n.ids[0],r[t]=s)}return s},createCategoryNode:function(e,a){var r=t.create("div",{class:"DataCategoryItem DataBrowser_Clickable"},a),o=t.create("div",{class:"DataCategoryItemIconMargins"},r);return r.icon=t.create("div",{class:"DataCategoryItemIcon "+this.getCategoryImageClass(e)},o),t.create("div",{class:"DataCategoryItemLabel TrimWithEllipses",innerHTML:e&&e.name||""},r),r},updateCategoryNode:function(e,a){e.icon.className="DataCategoryItemIcon "+this.getCategoryImageClass(a),e.children[1].innerHTML=a&&a.name||""},getCategoryImageClass:function(e){e&&"string"!=typeof e&&(e=e.id);var a="DataCategoryImage";return e&&(e=e.toLowerCase().replace(/(\s|_|\d|\(|\))/g,""),(e=e.split(/\W+/)[0])&&(a+=" DataCategoryImage_"+e)),a},parseRangeValue:function(e){var a=e.split("-");a.length<2&&"+"==e.charAt(e.length-1)&&(a=[e.substr(0,e.length-1)]);var t=Number(a[0]),r=a.length<2?t:Number(a[1]);return isNaN(t)||isNaN(r)||t>r?null:{min:t,max:r}}}});