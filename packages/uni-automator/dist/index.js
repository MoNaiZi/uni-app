"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("fs"),e=require("path"),n=require("debug"),s=require("merge"),o=require("jsonc-parser"),i=require("licia/isRelative"),r=require("ws"),a=require("events"),c=require("licia/uuid"),p=require("licia/stringify"),l=require("licia/dateFormat"),u=require("licia/waitUntil"),h=require("os"),d=require("address"),m=require("default-gateway"),g=require("licia/isStr"),y=require("licia/getPort"),v=require("qrcode-terminal"),f=require("licia/fs"),w=require("licia/isFn"),P=require("licia/trim"),I=require("licia/startWith"),M=require("licia/isNum"),_=require("licia/sleep"),k=require("licia/isUndef"),E=require("child_process"),U=require("licia/toStr"),A=require("fs-extra");function T(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var N=T(t),b=T(e),C=T(n),R=T(i),D=T(r),O=T(c),S=T(p),j=T(l),x=T(u),$=T(h),q=T(d),F=T(m),L=T(g),W=T(y),H=T(v),B=T(f),X=T(w),J=T(P),V=T(I),G=T(M),z=T(_),Y=T(k),K=T(U);class Q extends a.EventEmitter{constructor(t){super(),this.ws=t,this.ws.addEventListener("message",(t=>{this.emit("message",t.data)})),this.ws.addEventListener("close",(()=>{this.emit("close")}))}send(t){this.ws.send(t)}close(){this.ws.close()}}const Z=new Map,tt=["onCompassChange","onThemeChange","onUserCaptureScreen","onWindowResize","onMemoryWarning","onAccelerometerChange","onKeyboardHeightChange","onNetworkStatusChange","onPushMessage","onLocationChange","onGetWifiList","onWifiConnected","onWifiConnectedWithPartialInfo","onSocketOpen","onSocketError","onSocketMessage","onSocketClose"];const et=new Map;function nt(t,e){(null==t?void 0:t.success)&&"function"==typeof(null==t?void 0:t.success)&&(e?t.success(e):t.success()),(null==t?void 0:t.complete)&&"function"==typeof(null==t?void 0:t.complete)&&(e?t.complete(e):t.complete())}function st(t,e){(null==t?void 0:t.fail)&&"function"==typeof(null==t?void 0:t.fail)&&(e?t.fail(e):t.fail()),(null==t?void 0:t.complete)&&"function"==typeof(null==t?void 0:t.complete)&&(e?t.complete(e):t.complete())}async function ot(t,e){const[n,s]=function(t){return L.default(t)?[!0,[t]]:[!1,t]}(e),o=await t(s);return n?o[0]:o}function it(t){try{return require(t)}catch(e){return require(require.resolve(t,{paths:[process.cwd()]}))}}/^win/.test(process.platform);const rt="Connection closed";class at extends a.EventEmitter{constructor(t,e,n){super(),this.puppet=e,this.namespace=n,this.callbacks=new Map,this.transport=t,this.isAlive=!0,this.id=Date.now(),this.debug=C.default("automator:protocol:"+this.namespace),this.onMessage=t=>{var e,n;if(this.isAlive=!0,"true"===process.env.UNI_APP_X&&'"pong"'===t)return;this.debug(`${j.default("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${t}`);const{id:s,method:o,error:i,result:r,params:a}=JSON.parse(t);if(null===(e=null==r?void 0:r.method)||void 0===e?void 0:e.startsWith("on"))return void((t,e)=>{const n=Z.get(t.method);(null==n?void 0:n.has(e))&&n.get(e)(t.data)})(r,s);if(null===(n=null==r?void 0:r.method)||void 0===n?void 0:n.startsWith("Socket.")){return void((t,e,n)=>{const s=et.get(e);(null==s?void 0:s.has(t))&&s.get(t)(n)})(r.method.replace("Socket.",""),r.id,r.data)}if(!s)return this.puppet.emit(o,a);const{callbacks:c}=this;if(s&&c.has(s)){const t=c.get(s);c.delete(s),i?t.reject(Error(i.message||i.detailMessage||i.errMsg)):t.resolve(r)}},this.onClose=()=>{this.callbacks.forEach((t=>{t.reject(Error(rt))}))},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(t,e={},n=!0){if(n&&this.puppet.adapter.has(t))return this.puppet.adapter.send(this,t,e);const s=O.default(),o=S.default({id:s,method:t,params:e});return"ping"!==t&&this.debug(`${j.default("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${o}`),new Promise(((t,e)=>{try{this.transport.send(o)}catch(t){e(Error(rt))}this.callbacks.set(s,{resolve:t,reject:e})}))}dispose(){this.transport.close()}startHeartbeat(){if("true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM){const t=new Map,e=it("adbkit"),n=5e3,s=$.default.platform();let o="",i="";"darwin"===s?(o='dumpsys activity | grep "Run"',i=`logcat -b crash | grep -C 10 ${"io.dcloud.uniappx"}`):"win32"===s&&(o='dumpsys activity | findstr "Run"',i="logcat | findstr UncaughtExceptionHandler"),t.set(this.id,setInterval((async()=>{if(!this.isAlive){const n=e.createClient(),s=await n.listDevices();if(!s.length)throw Error("Device not found");const r=s[0].id;return n.shell(r,o).then((function(t){let e,n="";t.on("data",(function(t){n+=t.toString(),e&&clearTimeout(e),e=setTimeout((()=>{n.includes("io.dcloud.uniapp")||console.log("Stop the test process.")}),50)}))})),n.shell(r,i).then((t=>{let e,n="";t.on("data",(t=>{n+=t.toString(),e&&clearTimeout(e),e=setTimeout((()=>{console.log(`crash log: ${n}`)}),50)}))})),clearInterval(t.get(this.id)),t.delete(this.id),void this.dispose()}this.send("ping"),this.isAlive=!1}),n))}}static createDevtoolConnection(t,e){return new Promise(((n,s)=>{const o=new D.default(t);o.addEventListener("open",(()=>{n(new at(new Q(o),e,"devtool"))})),o.addEventListener("error",s)}))}static createRuntimeConnection(t,e,n){return new Promise(((s,o)=>{C.default("automator:runtime")(`${j.default("yyyy-mm-dd HH:MM:ss:l")} port=${t}`);const i=new D.default.Server({port:t});x.default((async()=>{if(e.runtimeConnection)return!0}),n,1e3).catch((()=>{i.close(),o("Failed to connect to runtime, please make sure the project is running")})),i.on("connection",(function(t){C.default("automator:runtime")(`${j.default("yyyy-mm-dd HH:MM:ss:l")} connected`);const n=new at(new Q(t),e,"runtime");e.setRuntimeConnection(n),n.startHeartbeat(),s(n)})),e.setRuntimeServer(i)}))}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function ct(t,e,n,s){var o,i=arguments.length,r=i<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(i<3?o(r):i>3?o(e,n,r):o(e,n))||r);return i>3&&r&&Object.defineProperty(e,n,r),r}var pt;function lt(t,e){const n=e.value;return e.value=async function(e){return(await(null==n?void 0:n.call(this,e)))(t)},e}function ut(t,e,n){return lt(pt.RUNTIME,n)}function ht(t,e,n){return lt(pt.DEVTOOL,n)}!function(t){t.RUNTIME="runtime",t.DEVTOOL="devtool"}(pt||(pt={}));class dt{constructor(t){this.puppet=t}invoke(t,e){return async n=>this.puppet.devtoolConnection?(n===pt.DEVTOOL?this.puppet.devtoolConnection:this.puppet.runtimeConnection).send(t,e):this.puppet.runtimeConnection.send(t,e)}on(t,e){this.puppet.on(t,e)}}class mt extends dt{constructor(t,e){super(t),this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId,this.videoId=e.videoId}async getData(t){return this.invokeMethod("Element.getData",t)}async setData(t){return this.invokeMethod("Element.setData",t)}async callMethod(t){return this.invokeMethod("Element.callMethod",t)}async getElement(t){return this.invokeMethod("Element.getElement",t)}async getElements(t){return this.invokeMethod("Element.getElements",t)}async getOffset(){return this.invokeMethod("Element.getOffset")}async getHTML(t){return this.invokeMethod("Element.getHTML",t)}async getAttributes(t){return this.invokeMethod("Element.getAttributes",t)}async getStyles(t){return this.invokeMethod("Element.getStyles",t)}async getDOMProperties(t){return this.invokeMethod("Element.getDOMProperties",t)}async getProperties(t){return this.invokeMethod("Element.getProperties",t)}async tap(){return this.invokeMethod("Element.tap")}async longpress(){return this.invokeMethod("Element.longpress")}async touchstart(t){return this.invokeMethod("Element.touchstart",t)}async touchmove(t){return this.invokeMethod("Element.touchmove",t)}async touchend(t){return this.invokeMethod("Element.touchend",t)}async triggerEvent(t){return this.invokeMethod("Element.triggerEvent",t)}async callFunction(t){return this.invokeMethod("Element.callFunction",t)}async callContextMethod(t){return this.invokeMethod("Element.callContextMethod",t)}invokeMethod(t,e={}){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.invoke(t,e)}}ct([ut],mt.prototype,"getData",null),ct([ut],mt.prototype,"setData",null),ct([ut],mt.prototype,"callMethod",null),ct([ht],mt.prototype,"getElement",null),ct([ht],mt.prototype,"getElements",null),ct([ht],mt.prototype,"getOffset",null),ct([ht],mt.prototype,"getHTML",null),ct([ht],mt.prototype,"getAttributes",null),ct([ht],mt.prototype,"getStyles",null),ct([ht],mt.prototype,"getDOMProperties",null),ct([ht],mt.prototype,"getProperties",null),ct([ht],mt.prototype,"tap",null),ct([ht],mt.prototype,"longpress",null),ct([ht],mt.prototype,"touchstart",null),ct([ht],mt.prototype,"touchmove",null),ct([ht],mt.prototype,"touchend",null),ct([ht],mt.prototype,"triggerEvent",null),ct([ht],mt.prototype,"callFunction",null),ct([ht],mt.prototype,"callContextMethod",null);const gt=Object.prototype.hasOwnProperty,yt=Array.isArray,vt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;function ft(t,e){if(yt(t))return t;if(e&&(n=e,s=t,gt.call(n,s)))return[t];var n,s;const o=[];return t.replace(vt,(function(t,e,n,s){return o.push(n?s.replace(/\\(\\)?/g,"$1"):e||t),s})),o}function wt(t,e){const n=ft(e,t);let s;for(s=n.shift();null!=s;){if(null==(t=t[s]))return;s=n.shift()}return t}const Pt=require("util"),It=["scrollLeft","scrollTop","scrollWidth","scrollHeight"];class Mt{constructor(t,e,n){this.puppet=t,this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId||null,this.videoId=e.videoId||null,this.tagName=e.tagName,this.nvue=e.nvue,this.elementMap=n,"body"!==this.tagName&&"page-body"!==this.tagName||(this.tagName="page"),this.api=new mt(t,e)}toJSON(){return JSON.stringify({id:this.id,tagName:this.tagName,pageId:this.pageId,nodeId:this.nodeId,videoId:this.videoId})}toString(){return this.toJSON()}[Pt.inspect.custom](){return this.toJSON()}async $(t){try{const e=await this.api.getElement({selector:t});return Mt.create(this.puppet,Object.assign({},e,{pageId:this.pageId}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((t=>Mt.create(this.puppet,Object.assign({},t,{pageId:this.pageId}),this.elementMap)))}async size(){const[t,e]=await this.domProperty(["offsetWidth","offsetHeight"]);return{width:t,height:e}}async offset(){const{left:t,top:e}=await this.api.getOffset();return{left:t,top:e}}async text(){return this.domProperty("innerText")}async attribute(t){if(!L.default(t))throw Error("name must be a string");return(await this.api.getAttributes({names:[t]})).attributes[0]}async value(){return this.property("value")}async property(t){if(!L.default(t))throw Error("name must be a string");if(this.puppet.checkProperty){let e=this.publicProps;if(e||(this.publicProps=e=await this._property("__propPublic")),!e[t])throw Error(`${this.tagName}.${t} not exists`)}return this.puppet.isX&&"h5"===process.env.UNI_PLATFORM&&It.includes(t)?await this.domProperty(t):this._property(t)}async html(){return(await this.api.getHTML({type:"inner"})).html}async outerHtml(){return(await this.api.getHTML({type:"outer"})).html}async style(t){if(!L.default(t))throw Error("name must be a string");return(await this.api.getStyles({names:[t]})).styles[0]}async tap(){return this.api.tap()}async longpress(){return this.nvue||"true"===process.env.UNI_APP_X?this.api.longpress():(await this.touchstart(),await z.default(350),this.touchend())}async trigger(t,e){const n={type:t};return Y.default(e)||(n.detail=e),this.api.triggerEvent(n)}async touchstart(t){return this.api.touchstart(t)}async touchmove(t){return this.api.touchmove(t)}async touchend(t){return this.api.touchend(t)}async domProperty(t){return ot((async t=>(await this.api.getDOMProperties({names:t})).properties),t)}_property(t){return ot((async t=>(await this.api.getProperties({names:t})).properties),t)}send(t,e){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.puppet.send(t,e)}async callFunction(t,...e){return(await this.api.callFunction({functionName:t,args:e})).result}static create(t,e,n){let s,o=n.get(e.elementId);if(o)return o;if(e.nodeId)s=_t;else switch(e.tagName.toLowerCase()){case"input":s=kt;break;case"textarea":s=Et;break;case"scroll-view":s=Ut;break;case"swiper":s=At;break;case"movable-view":s=Tt;break;case"switch":s=Nt;break;case"slider":s=bt;break;case"video":s=Ct;break;default:s=Mt}return o=new s(t,e,n),n.set(e.elementId,o),o}}class _t extends Mt{async setData(t){return this.api.setData({data:t})}async data(t){const e={};if(t&&(e.path=t),"true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM){const n=(await this.api.getData(e)).data;return t?wt(n,t):n}return(await this.api.getData(e)).data}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}}class kt extends Mt{async input(t){return this.callFunction("input.input",t)}}class Et extends Mt{async input(t){return this.callFunction("textarea.input",t)}}class Ut extends Mt{async scrollTo(t,e){return this.callFunction("scroll-view.scrollTo",t,e)}async property(t){return"scrollTop"===t?this.callFunction("scroll-view.scrollTop"):"scrollLeft"===t?this.callFunction("scroll-view.scrollLeft"):super.property(t)}async scrollWidth(){return this.callFunction("scroll-view.scrollWidth")}async scrollHeight(){return this.callFunction("scroll-view.scrollHeight")}}class At extends Mt{async swipeTo(t){return this.callFunction("swiper.swipeTo",t)}}class Tt extends Mt{async moveTo(t,e){return this.callFunction("movable-view.moveTo",t,e)}async property(t){return"x"===t?this._property("_translateX"):"y"===t?this._property("_translateY"):super.property(t)}}class Nt extends Mt{async tap(){return this.callFunction("switch.tap")}}class bt extends Mt{async slideTo(t){return this.callFunction("slider.slideTo",t)}}class Ct extends Mt{async callContextMethod(t,...e){return await this.api.callContextMethod({method:t,args:e})}}class Rt extends dt{constructor(t,e){super(t),this.id=e.id}async getData(t){return this.invokeMethod("Page.getData",t)}async setData(t){return this.invokeMethod("Page.setData",t)}async callMethod(t){return this.invokeMethod("Page.callMethod",t)}async callMethodWithCallback(t){return this.invokeMethod("Page.callMethodWithCallback",t)}async getElement(t){return this.invokeMethod("Page.getElement",t)}async getElements(t){return this.invokeMethod("Page.getElements",t)}async getWindowProperties(t){return this.invokeMethod("Page.getWindowProperties",t)}invokeMethod(t,e={}){return e.pageId=this.id,this.invoke(t,e)}}ct([ut],Rt.prototype,"getData",null),ct([ut],Rt.prototype,"setData",null),ct([ut],Rt.prototype,"callMethod",null),ct([ut],Rt.prototype,"callMethodWithCallback",null),ct([ht],Rt.prototype,"getElement",null),ct([ht],Rt.prototype,"getElements",null),ct([ht],Rt.prototype,"getWindowProperties",null);const Dt=require("util");class Ot{constructor(t,e){this.puppet=t,this.id=e.id,this.path=e.path,this.query=e.query,this.elementMap=new Map,this.api=new Rt(t,e)}toJSON(){return JSON.stringify({id:this.id,path:this.path,query:this.query})}toString(){return this.toJSON()}[Dt.inspect.custom](){return this.toJSON()}async waitFor(t){return G.default(t)?await z.default(t):X.default(t)?x.default(t,0,50):L.default(t)?x.default((async()=>{if("true"===process.env.UNI_APP_X){return!!await this.$(t)}return(await this.$$(t)).length>0}),0,50):void 0}async $(t){try{const e=await this.api.getElement({selector:t});return Mt.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((e=>Mt.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)))}async data(t){const e={};if(t&&(e.path=t),"true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM){const n=(await this.api.getData(e)).data;return t?wt(n,t):n}return(await this.api.getData(e)).data}async setData(t){return this.api.setData({data:t})}async size(){const[t,e]=await this.windowProperty(["document.documentElement.scrollWidth","document.documentElement.scrollHeight"]);return{width:t,height:e}}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}async callMethodWithCallback(t,...e){return await this.api.callMethodWithCallback({method:t,args:e})}async scrollTop(){return this.windowProperty("document.documentElement.scrollTop")}async windowProperty(t){const e=L.default(t);e&&(t=[t]);const{properties:n}=await this.api.getWindowProperties({names:t});return e?n[0]:n}static create(t,e,n){let s=n.get(e.id);return s?(s.path=e.path,s.query=e.query,s):(s=new Ot(t,e),n.set(e.id,s),s)}}class St extends dt{async getPageStack(){return this.invoke("App.getPageStack")}async callUniMethod(t){return this.invoke("App.callUniMethod",t)}async getCurrentPage(){return this.invoke("App.getCurrentPage")}async mockUniMethod(t){return this.invoke("App.mockUniMethod",t)}async captureScreenshotByRuntime(t){return this.invoke("App.captureScreenshot",t)}async captureScreenshotWithADBByRuntime(t){return this.invoke("App.captureScreenshotWithADB",t)}async socketEmitter(t){return this.invoke("App.socketEmitter",t)}async callFunction(t){return this.invoke("App.callFunction",t)}async captureScreenshot(t){return this.invoke("App.captureScreenshot",t)}async adbCommand(t){return this.invoke("App.adbCommand",t)}async exit(){return this.invoke("App.exit")}async addBinding(t){return this.invoke("App.addBinding",t)}async enableLog(){return this.invoke("App.enableLog")}onLogAdded(t){return this.on("App.logAdded",t)}onBindingCalled(t){return this.on("App.bindingCalled",t)}onExceptionThrown(t){return this.on("App.exceptionThrown",t)}}ct([ut],St.prototype,"getPageStack",null),ct([ut],St.prototype,"callUniMethod",null),ct([ut],St.prototype,"getCurrentPage",null),ct([ut],St.prototype,"mockUniMethod",null),ct([ut],St.prototype,"captureScreenshotByRuntime",null),ct([ut],St.prototype,"captureScreenshotWithADBByRuntime",null),ct([ut],St.prototype,"socketEmitter",null),ct([ht],St.prototype,"callFunction",null),ct([ht],St.prototype,"captureScreenshot",null),ct([ht],St.prototype,"adbCommand",null),ct([ht],St.prototype,"exit",null),ct([ht],St.prototype,"addBinding",null),ct([ht],St.prototype,"enableLog",null);class jt extends dt{async getInfo(){return this.invoke("Tool.getInfo")}async enableRemoteDebug(t){return this.invoke("Tool.enableRemoteDebug")}async close(){return this.invoke("Tool.close")}async getTestAccounts(){return this.invoke("Tool.getTestAccounts")}onRemoteDebugConnected(t){this.puppet.once("Tool.onRemoteDebugConnected",t),this.puppet.once("Tool.onPreviewConnected",t)}}function xt(t){return new Promise((e=>setTimeout(e,t)))}ct([ht],jt.prototype,"getInfo",null),ct([ht],jt.prototype,"enableRemoteDebug",null),ct([ht],jt.prototype,"close",null),ct([ht],jt.prototype,"getTestAccounts",null);class $t extends a.EventEmitter{constructor(t,e){super(),this.puppet=t,this.options=e,this.pageMap=new Map,this.appBindings=new Map,this.appApi=new St(t),this.toolApi=new jt(t),this.appApi.onLogAdded((t=>{this.emit("console",t)})),this.appApi.onBindingCalled((({name:t,args:e})=>{try{const n=this.appBindings.get(t);n&&n(...e)}catch(t){}})),this.appApi.onExceptionThrown((t=>{this.emit("exception",t)}))}async pageStack(){return(await this.appApi.getPageStack()).pageStack.map((t=>Ot.create(this.puppet,t,this.pageMap)))}async navigateTo(t){return this.changeRoute("navigateTo",t)}async redirectTo(t){return this.changeRoute("redirectTo",t)}async navigateBack(){return this.changeRoute("navigateBack")}async reLaunch(t){return this.changeRoute("reLaunch",t)}async switchTab(t){return this.changeRoute("switchTab",t)}async currentPage(){const{id:t,path:e,query:n}=await this.appApi.getCurrentPage();return Ot.create(this.puppet,{id:t,path:e,query:n},this.pageMap)}async systemInfo(){return this.callUniMethod("getSystemInfoSync")}async callUniMethod(t,...e){return(await this.appApi.callUniMethod({method:t,args:e})).result}async mockUniMethod(t,e,...n){return X.default(e)||(s=e,L.default(s)&&(s=J.default(s),V.default(s,"function")||V.default(s,"() =>")))?this.appApi.mockUniMethod({method:t,functionDeclaration:e.toString(),args:n}):this.appApi.mockUniMethod({method:t,result:e});var s}async restoreUniMethod(t){return this.appApi.mockUniMethod({method:t})}async evaluate(t,...e){return(await this.appApi.callFunction({functionDeclaration:t.toString(),args:e})).result}async pageScrollTo(t){await this.callUniMethod("pageScrollTo",{scrollTop:t,duration:0})}async close(){try{await this.appApi.exit()}catch(t){}await xt(1e3),this.puppet.disposeRuntimeServer(),await this.toolApi.close(),this.disconnect()}async teardown(){return this["disconnect"===this.options.teardown?"disconnect":"close"]()}async remote(t){if(!this.puppet.devtools.remote)return console.warn(`Failed to enable remote, ${this.puppet.devtools.name} is unimplemented`);const{qrCode:e}=await this.toolApi.enableRemoteDebug({auto:t});var n;e&&await(n=e,new Promise((t=>{H.default.generate(n,{small:!0},(e=>{process.stdout.write(e),t(void 0)}))})));const s=new Promise((t=>{this.toolApi.onRemoteDebugConnected((async()=>{await xt(1e3),t(void 0)}))})),o=new Promise((t=>{this.puppet.setRemoteRuntimeConnectionCallback((()=>{t(void 0)}))}));return Promise.all([s,o])}disconnect(){this.puppet.dispose()}on(t,e){return"console"===t&&this.appApi.enableLog(),super.on(t,e),this}async exposeFunction(t,e){if(this.appBindings.has(t))throw Error(`Failed to expose function with name ${t}: already exists!`);this.appBindings.set(t,e),await this.appApi.addBinding({name:t})}async checkVersion(){}async screenshot(t){const e=this.puppet.isX&&"android"===process.env.UNI_APP_PLATFORM?(null==t?void 0:t.adb)?"captureScreenshotWithADBByRuntime":"captureScreenshotByRuntime":"captureScreenshot",{data:n}=await this.appApi[e]({id:null==t?void 0:t.id,fullPage:null==t?void 0:t.fullPage,area:null==t?void 0:t.area,offsetX:null==t?void 0:t.offsetX,offsetY:null==t?void 0:t.offsetY});if(!(null==t?void 0:t.path))return n;await B.default.writeFile(t.path,n,"base64")}async testAccounts(){return(await this.toolApi.getTestAccounts()).accounts}async changeRoute(t,e){if(this.puppet.isVue3&&"h5"===process.env.UNI_PLATFORM&&"navigateBack"!==t){const{__id__:n}=await this.callUniMethod(t,{url:e,isAutomatedTesting:!0}),s=Date.now();return await x.default((async()=>{if(Date.now()-s>1e4)throw Error(`${t} to ${e} failed, unable to get the correct current page`);let o;try{o=await this.currentPage()}catch(t){return!1}return o.id===n&&o}),0,1e3)}return await this.callUniMethod(t,{url:e}),await xt(1e3),await this.currentPage()}async socketEmitter(t){return this.appApi.socketEmitter(t)}async adbCommand(t){return"android"===process.env.UNI_APP_PLATFORM?await this.appApi.adbCommand(t):Error("Program.adbCommand is only supported on the app android platform")}}class qt{constructor(t){this.options=t}has(t){return!!this.options[t]}send(t,e,n){const s=this.options[e];if(!s)return Promise.reject(Error(`adapter for ${e} not found`));const o=s.reflect;return o?(s.params&&(n=s.params(n)),"function"==typeof o?o(t.send.bind(t),n):(e=o,t.send(e,n))):Promise.reject(Error(`${e}'s reflect is required`))}}const Ft=C.default("automator:puppet"),Lt=".automator.json";function Wt(t){try{return require(t)}catch(t){}}function Ht(t,e,n,s){const o=function(t,e,n){let s,o;return process.env.UNI_OUTPUT_DIR?(o=b.default.join(process.env.UNI_OUTPUT_DIR,`../.automator/${e}`,Lt),s=Wt(o)):(o=b.default.join(t,`dist/${n}/.automator/${e}`,Lt),s=Wt(o),s||(o=b.default.join(t,`unpackage/dist/${n}/.automator/${e}`,Lt),s=Wt(o))),Ft(`${o}=>${JSON.stringify(s)}`),s}(t,n,s);if(!o||!o.wsEndpoint)return!1;const i=require("../package.json").version;if(o.version!==i)return Ft(`unmet=>${o.version}!==${i}`),!1;const r=function(t){let e;try{const t=F.default.v4.sync();e=q.default.ip(t&&t.interface),e&&(/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(e)||(e=void 0))}catch(t){}return"ws://"+(e||"localhost")+":"+t}(e);return Ft(`wsEndpoint=>${r}`),o.wsEndpoint===r}class Bt extends a.EventEmitter{constructor(t,e){if(super(),this.isX=!1,this.isVue3=!1,"true"===process.env.UNI_APP_X&&(this.isX=!0),e)this.target=e;else{if(this.target=null,"h5"===t)try{this.target=it("@dcloudio/uni-h5/lib/h5/uni.automator.js")}catch(t){}this.target||(this.target=it(`@dcloudio/uni-${"app"===t?"app-plus":t}/lib/uni.automator.js`))}if(!this.target)throw Error("puppet is not provided");this.platform=t,this.adapter=new qt(this.target.adapter||{})}setCompiler(t){this.compiler=t}setRuntimeServer(t){this.wss=t}setRemoteRuntimeConnectionCallback(t){this.remoteRuntimeConnectionCallback=t}setRuntimeConnection(t){this.runtimeConnection=t,this.remoteRuntimeConnectionCallback&&(this.remoteRuntimeConnectionCallback(),this.remoteRuntimeConnectionCallback=null)}setDevtoolConnection(t){this.devtoolConnection=t}disposeRuntimeServer(){this.wss&&this.wss.close()}disposeRuntime(){this.runtimeConnection.dispose()}disposeDevtool(){this.compiler&&this.compiler.stop(),this.devtoolConnection&&this.devtoolConnection.dispose()}dispose(){this.disposeRuntime(),this.disposeDevtool(),this.disposeRuntimeServer()}send(t,e){return this.runtimeConnection.send(t,e)}validateProject(t){const e=this.target.devtools.required;return!e||!e.find((e=>!N.default.existsSync(b.default.join(t,e))))}validateDevtools(t){const e=this.target.devtools.validate;return e?e(t,this):Promise.resolve(t)}createDevtools(t,e,n){const s=this.target.devtools.create;return s?(e.timeout=n,s(t,e,this)):Promise.resolve()}shouldCompile(t,e,n,s){this.compiled=!0;const o=this.target.shouldCompile;if(o)this.compiled=o(n,s);else if(!0===n.compile)this.compiled=!0;else{if("false"===process.env.UNI_AUTOMATOR_COMPILE)return!1;this.compiled=!Ht(t,e,this.platform,this.mode)}return this.compiled}get checkProperty(){return"mp-weixin"===this.platform}get devtools(){return this.target.devtools}get mode(){const t=this.target.mode;return t||("production"===process.env.NODE_ENV?"build":"dev")}}const Xt=C.default("automator:compiler"),Jt=/The\s+(.*)\s+directory is ready/;class Vt{constructor(t){this.puppet=t,this.puppet.setCompiler(this)}compile(t){const e=this.puppet.mode,n=this.puppet.platform;let s=t.silent;const o=t.port,i=t.host,r=`${e}:${n}`,a=t.projectPath,[c,p]=this.getSpawnArgs(t,r);p.push("--auto-port"),p.push(K.default(o)),i&&(p.push("--auto-host"),p.push(i));const l={cwd:t.cliPath,env:Object.assign(Object.assign({},process.env),{NODE_ENV:"build"===e?"production":"development"})};return new Promise(((t,o)=>{const i=i=>{const r=i.toString().trim();if(!s&&console.log(r),r.includes("- Network")||r.includes("> Network")||r.includes("➜  Network")){const e=r.match(/Network:(.*)/)[1].trim();Xt(`url: ${e}`),t({path:e})}else if(r.includes("DONE  Build failed"))o(r);else if(r.includes("DONE  Build complete")){const o=r.match(Jt);let i="";if(o&&o.length>1)i=b.default.join(a,o[1]);else{const t=this.puppet.isX&&"app-plus"===n?"app":n;i=b.default.join(a,`dist/${e}/${t}`),A.existsSync(i)||(i=b.default.join(a,`unpackage/dist/${e}/${t}`))}s=!0,this.stop(),t({path:"true"===process.env.UNI_AUTOMATOR_APP_WEBVIEW?process.env.UNI_OUTPUT_DIR:i})}};Xt(`${c} ${p.join(" ")} %o`,l),this.cliProcess=E.spawn(c,p,l),this.cliProcess.on("error",(t=>{o(t)})),this.cliProcess.stdout.on("data",i),this.cliProcess.stderr.on("data",i)}))}stop(){this.cliProcess&&this.cliProcess.kill("SIGTERM")}getSpawnArgs(t,e){let n;const s=t.cliPath;try{n=require(b.default.join(s,"package.json"))}catch(t){}let o=this.puppet.isX;if(n&&(n.devDependencies&&n.devDependencies["@dcloudio/vite-plugin-uni"]&&(o=!0),!o&&n.dependencies&&n.dependencies["@dcloudio/vite-plugin-uni"]&&(o=!0),n.scripts&&n.scripts[e]))return[process.env.UNI_NPM_PATH||(/^win/.test(process.platform)?"npm.cmd":"npm"),["run",e,"--"]];this.puppet.isVue3=o,["android","ios"].includes(process.env.UNI_OS_NAME)&&(process.env.UNI_APP_PLATFORM=process.env.UNI_OS_NAME);let i=this.puppet.platform;if("app-plus"===this.puppet.platform&&this.puppet.isX&&(i="app"),process.env.UNI_INPUT_DIR=t.projectPath,process.env.UNI_OUTPUT_DIR=b.default.join(t.projectPath,`unpackage/dist/${this.puppet.mode}/${i}`),this.prepare(),process.env.UNI_HBUILDERX_PLUGINS||A.existsSync(b.default.resolve(s,"../about"))&&(process.env.UNI_HBUILDERX_PLUGINS=b.default.dirname(s)),o){const t="app-plus"===this.puppet.platform?"app":this.puppet.platform;return process.env.UNI_PLATFORM=t,[process.env.UNI_NODE_PATH||"node",[require.resolve("@dcloudio/vite-plugin-uni/bin/uni.js",{paths:[s]}),"-p",t]]}return[process.env.UNI_NODE_PATH||"node",[b.default.join(s,"bin/uniapp-cli.js")]]}prepare(){if(process.env.UNI_INPUT_DIR&&"true"===process.env.UNI_AUTOMATOR_APP_WEBVIEW){const t=o.parse(A.readFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),"utf8")),e=b.default.resolve(process.env.UNI_INPUT_DIR,"unpackage",".automator","app-webview");process.env.UNI_INPUT_DIR=b.default.resolve(e,"src"),process.env.UNI_OUTPUT_DIR=b.default.resolve(e,"unpackage","dist","dev"),A.existsSync(process.env.UNI_INPUT_DIR)&&A.emptyDirSync(process.env.UNI_INPUT_DIR),A.copySync(b.default.resolve(__dirname,"..","lib","app-webview","project"),process.env.UNI_INPUT_DIR);const n=o.parse(A.readFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),"utf8"));A.writeFileSync(b.default.resolve(process.env.UNI_INPUT_DIR,"manifest.json"),JSON.stringify(Object.assign(Object.assign({},n),{name:t.name||"",appid:t.appid||""}),null,2))}}}const Gt=C.default("automator:launcher"),zt="true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM?12e4:24e4;class Yt{async launch(t){const{port:e,cliPath:n,timeout:o,projectPath:i}=await this.validate(t);let r={};"app"===t.platform||"app-plus"===t.platform?(r=t.app||t["app-plus"],"true"===process.env.UNI_APP_X&&r["uni-app-x"]&&(r=s.recursive(!0,r,r["uni-app-x"])),delete r["uni-app-x"]):r=t[t.platform],r||(r={}),r.projectPath=i,Gt(r),this.puppet=new Bt(t.platform,r.puppet),r=await this.puppet.validateDevtools(r);let a=this.puppet.shouldCompile(i,e,t,r),c=process.env.UNI_OUTPUT_DIR||i;if(a||this.puppet.validateProject(c)||(c=b.default.join(i,"dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(c=b.default.join(i,"unpackage/dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(a=!0))),a){this.puppet.compiled=t.compile=!0,this.compiler=new Vt(this.puppet);const s=await this.compiler.compile({host:t.host,port:e,cliPath:n,projectPath:i,silent:!!t.silent});s.path&&(c=s.path)}const p=[];return p.push(this.createRuntimeConnection(e,o)),p.push(this.puppet.createDevtools(c,r,o)),new Promise(((t,n)=>{Promise.all(p).then((([n,s])=>{n&&this.puppet.setRuntimeConnection(n),s&&this.puppet.setDevtoolConnection(s),C.default("automator:program")("ready");const o=r.teardown||"disconnect";t(new $t(this.puppet,{teardown:o,port:e}))})).catch((t=>n(t)))}))}resolveCliPath(t){if(!t)return t;try{const{dependencies:e,devDependencies:n}=require(b.default.join(t,"package.json"));if(Kt(n)||Kt(e))return t}catch(t){}}resolveProjectPath(t,e){return t||(t=process.env.UNI_INPUT_DIR||process.cwd()),R.default(t)&&(t=b.default.resolve(t)),N.default.existsSync(t)||function(t){throw Error(t)}(`Project path ${t} doesn't exist`),t}async validate(t){const e=this.resolveProjectPath(t.projectPath,t);let n=process.env.UNI_CLI_PATH||t.cliPath;if(n=this.resolveCliPath(n||""),!n&&(n=this.resolveCliPath(process.cwd())),!n&&(n=this.resolveCliPath(e)),!n)throw Error("cliPath is not provided");if("false"!==process.env.UNI_APP_X){const t=this.getManifestJson(e);("true"===process.env.UNI_APP_X||"uni-app-x"in t)&&(process.env.UNI_APP_X="true",t.appid&&(process.env.UNI_APP_ID=t.appid))}process.env.UNI_AUTOMATOR_HOST&&(t.host=process.env.UNI_AUTOMATOR_HOST),process.env.UNI_AUTOMATOR_PORT&&(t.port=parseInt(process.env.UNI_AUTOMATOR_PORT));return{port:await async function(t,e){const n=await W.default(t||e);if(t&&n!==t)throw Error(`Port ${t} is in use, please specify another port`);return n}(t.port||9520),cliPath:n,timeout:t.timeout||zt,projectPath:e}}getManifestJson(t){if(t){const e=b.default.join(t,"manifest.json");if(N.default.existsSync(e))return o.parse(N.default.readFileSync(e,"utf8"))}return{}}async createRuntimeConnection(t,e){return at.createRuntimeConnection(t,this.puppet,e)}}function Kt(t){return!!t&&!(!t["@dcloudio/vue-cli-plugin-uni"]&&!t["@dcloudio/vite-plugin-uni"])}exports.Automator=class{constructor(){this.launcher=new Yt}async launch(t){return this.launcher.launch(t)}},exports.initUni=t=>new Proxy({},{get(e,n){return"connectSocket"===n?async(...e)=>{const s=`${Date.now()}-${Math.random()}`;return e[0].id=s,await t.callUniMethod(n,...e).then((n=>{nt(e[0],n),et.set(s,new Map);const o={id:s,onMessage:e=>{t.socketEmitter({id:s,method:"onMessage"}),et.get(s).set("onMessage",e)},send:e=>{t.socketEmitter({id:s,method:"send",data:e.data}).then((t=>{nt(e,t)})).catch((t=>{st(e,t)}))},close:e=>{t.socketEmitter({id:s,method:"close",code:e.code,reason:e.reason}).then((t=>{nt(e,t),et.delete(s)})).catch((t=>{st(e,t)}))},onOpen:e=>{t.socketEmitter({id:s,method:"onOpen"}),et.get(s).set("onOpen",e)},onClose:e=>{t.socketEmitter({id:s,method:"onClose"}),et.get(s).set("onClose",e)},onError:e=>{t.socketEmitter({id:s,method:"onError"}),et.get(s).set("onError",e)}};return et.get(s).set("socketTask",o),o})).catch((t=>(st(e[0],t),null)))}:(s=n,tt.includes(s)?e=>{Z.has(n)||Z.set(n,new Map);const s=Z.get(n),o=`${Date.now()}-${Math.random()}`;s.set(o,e),t.callUniMethod(n,o)}:function(t){return t.startsWith("off")&&tt.includes(t.replace("off","on"))}(n)?async e=>{const s=n.replace("off","on");if(Z.has(s))if(e){const o=Z.get(s);o.forEach(((s,i)=>{s===e&&(o.delete(i),t.callUniMethod(n,i))}))}else Z.delete(s),t.callUniMethod(n)}:async(...e)=>await t.callUniMethod(n,...e).then((t=>(nt(e[0],t),t))).catch((t=>(st(e[0],t),t))));var s}});
