// COPYRIGHT © 2016 Esri
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
// See http://js.arcgis.com/4.1/esri/copyright.txt for details.

define(["../../../core/declare","../../../core/Scheduler","../../../core/HandleRegistry","../../../core/watchUtils","./StreamDataManager","./PreallocArray","../webgl-engine/lib/Util"],function(e,t,i,r,a,s,n){function l(e){this.begin=0,this.budget=0,this.performance=n.performance,this.enabled=!0,void 0!==e&&this.reset(e)}var h=n.assert,d={TERRAIN:"terrain",SCENE:"scene",SYMBOLOGY:"symbols"},o=new s(20);l.prototype.now=function(){return this.performance.now()},l.prototype.reset=function(e){this.begin=this.now(),this.budget=this.enabled?e:Number.MAX_VALUE},l.prototype.done=function(){return this.enabled&&this.elapsed()>=this.budget},l.prototype.remaining=function(){return Math.max(this.budget-this.elapsed(),0)},l.prototype.elapsed=function(){return this.now()-this.begin};var c=e(null,{constructor:function(e,s){this._clients=[],this._frameWorker=null,this._budget=new l,this._idleFrameWorkers=[],this._idleFrameWorkerRobin=0,this._idleUpdatesStartFired=!1,this._lastTargetChangeTime=n.performance.now(),this.navigationTimeout=300,this.animatingFrameTimeBudget=10,this.idleFrameWorkerBudget=30,this.idleFrameTimeBudget=50;var h={},o={};for(var c in d)h[d[c]]=0,o[d[c]]=0;h[d.TERRAIN]=409600,h[d.SCENE]=409600,h[d.SYMBOLOGY]=30720,o[d.TERRAIN]=15,o[d.SCENE]=20,o[d.SYMBOLOGY]=5,this._maxGpuMemory=1500,this.streamDataManager=new a(o),this._cameraListeners=new i,this._cameraListeners.add([r.on(e,"navigation","currentViewReachedTarget",this._targetReached.bind(this)),r.on(e,"navigation","targetViewChanged",this._targetChanged.bind(this))]),s||(s=t),this._frameTask=s.addFrameTask({update:this._frameUpdate.bind(this)}),this._view=e,this.stats={frameUpdateTime:new m,idleUpdateTime:new m},this.frameUpdateNavigation=null},destroy:function(){this._frameTask.remove(),this._frameTask=null,this._cameraListeners.remove(),this.streamDataManager.destroy(),this.streamDataManager=null},setEnableBudget:function(e){this._budget.enabled=!!e},registerClient:function(e,t,i){return this._clients.push({client:e,type:t}),"function"==typeof e.setMaxGpuMemory&&e.setMaxGpuMemory(this._maxGpuMemory),this.streamDataManager.makeSupplier(t,i)},deregisterClient:function(e){for(var t=0;t<this._clients.length;t++)if(this._clients[t].client===e)return this._clients[t]=this._clients[this._clients.length-1],void this._clients.pop();console.warn("deregistering an unregistered client.")},setMaxGpuMemory:function(e){this._maxGpuMemory=e;for(var t=0;t<this._clients.length;t++){var i=this._clients[t].client;"function"==typeof i.setMaxGpuMemory&&i.setMaxGpuMemory(e)}},registerIdleFrameWorker:function(e,t){var i=this._idleFrameWorkers.some(function(t){return t.client===e});h(!i,"Can only register idle frame workers once per client/layer"),h(!t.idleFrame||t.needsUpdate,"needsUpdate has to be specified if idleFrame is specified"),this._idleFrameWorkers.push({client:e,callbacks:t}),this._isIdle()&&this._idleUpdatesStartFired&&t.idleBegin&&t.idleBegin.call(e)},deregisterIdleFrameWorker:function(e){for(var t=this._idleFrameWorkers,i=0;i<t.length;i++){var r=t[i];if(r.client===e)return this._idleUpdatesStartFired&&r.callbacks.idleEnd&&r.callbacks.idleEnd.call(e),t[i]=t[t.length-1],void t.pop()}},registerFrameWorker:function(e){h(!this._frameWorker,"Only one (non-idle) per-frame worker supported at the moment"),this._frameWorker=e},deregisterFrameWorker:function(){this._frameWorker=null},_targetChanged:function(e){this._lastTargetChangeTime=n.performance.now(),this._targetReached=!1,this._idleUpdatesStartFired&&(this._idleUpdatesStartFired=!1,this._callWorkersNoScheduling("idleEnd"))},_targetReached:function(e){this._targetReached=!0},_frameUpdate:function(e){var t=this._isIdle(),i=t?this.idleFrameWorkerBudget:this.animatingFrameTimeBudget;this._budget.reset(i-e.spendInFrame),this._view.navigation&&this._view.navigation.step(e.deltaTime),this._frameWorker&&(this._frameWorker(this._budget),this.stats.frameUpdateTime.addSample(this._budget.elapsed())),t&&(this._idleUpdatesStartFired||(this._callWorkersNoScheduling("idleBegin"),this._idleUpdatesStartFired=!0),this._budget.reset(this.idleFrameTimeBudget-this._budget.elapsed()),this._budget.remaining()>3&&(this._callWorkersStrictScheduling("idleFrame",this._budget),this.stats.idleUpdateTime.addSample(this._budget.elapsed())))},_isIdle:function(){return this._budget.now()-this._lastTargetChangeTime>this.navigationTimeout&&this._targetReached},_callWorkersNoScheduling:function(e){for(var t=this._idleFrameWorkers,i=0;i<t.length;i++){var r=t[i];r.callbacks[e]&&r.callbacks[e].call(r.client)}},_callWorkersStrictScheduling:function(e,t){var i,r,a,s=this._idleFrameWorkers,n=s.length;for(o.clear(),r=0,a=this._idleFrameWorkerRobin;n>r;r++)i=s[a++%n],i.callbacks.needsUpdate&&i.callbacks.needsUpdate.call(i.client)&&(0===o.length&&(this._idleFrameWorkerRobin=a),o.push(i));for(var l=t.now(),h=l+t.remaining();o.length>0&&h>l;)t.reset((h-l)/o.length),i=o.pop(),i.callbacks[e].call(i.client,t),l=t.now()}});c.ClientType=d;var m=function(){this.addSample=function(e){this.min=Math.min(this.min,e),this.max=Math.max(this.max,e),this.total+=e,this.numSamples++},this.getAverage=function(){return this.total/this.numSamples},this.reset=function(){this.total=0,this.numSamples=0,this.min=Number.MAX_VALUE,this.max=-Number.MAX_VALUE},this.reset()};return c});