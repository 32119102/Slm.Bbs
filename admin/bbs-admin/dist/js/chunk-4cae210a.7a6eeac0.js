(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4cae210a"],{7277:function(e,s,t){"use strict";t.r(s);var n=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"index-container"},[e.systeminfo?t("div",{staticClass:"widget"},[t("div",{staticClass:"widget-header"},[e._v("服务器信息")]),t("div",{staticClass:"widget-content"},[t("div",[e._v("系统版本: "+e._s(e.systeminfo.osVersion))]),t("div",[e._v("系统架构: "+e._s(e.systeminfo.arch))]),t("div",[e._v("线程数量: "+e._s(e.systeminfo.processorCount))]),t("div",[e._v("程序物理路径: "+e._s(e.systeminfo.applicationBasePath))]),t("div",[e._v("应用名称: "+e._s(e.systeminfo.applicationName))]),t("div",[e._v("应用版本: "+e._s(e.systeminfo.applicationVersion))]),t("div",[e._v("框架版本: "+e._s(e.systeminfo.runtimeFramework))]),t("div",[e._v("服务器IP: "+e._s(e.systeminfo.host))]),t("div",[e._v("服务器端口: "+e._s(e.systeminfo.port))]),t("div",[e._v("服务器名称: "+e._s(e.systeminfo.machineName))])])]):e._e()])},i=[],o=t("1da1"),a=(t("96cf"),{data:function(){return{systeminfo:null}},mounted:function(){this.load()},methods:{load:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,e.axios.get("/api/common/systeminfo");case 2:e.systeminfo=s.sent;case 3:case"end":return s.stop()}}),s)})))()}}}),r=a,c=(t("b311"),t("2877")),f=Object(c["a"])(r,n,i,!1,null,"72e3ee6b",null);s["default"]=f.exports},b311:function(e,s,t){"use strict";t("f2ef")},f2ef:function(e,s,t){}}]);
//# sourceMappingURL=chunk-4cae210a.7a6eeac0.js.map