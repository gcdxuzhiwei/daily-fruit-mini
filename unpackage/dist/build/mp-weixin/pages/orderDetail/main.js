(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/orderDetail/main"],{"111d":function(e,t,n){},"1cea":function(e,t,n){"use strict";(function(e,r){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=u(n("a34a"));function u(e){return e&&e.__esModule?e:{default:e}}function a(e,t,n,r,o,u,a){try{var i=e[u](a),c=i.value}catch(d){return void n(d)}i.done?t(c):Promise.resolve(c).then(r,o)}function i(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var u=e.apply(t,n);function i(e){a(u,r,o,i,c,"next",e)}function c(e){a(u,r,o,i,c,"throw",e)}i(void 0)}))}}var c={data:function(){return{order:null,price:""}},onLoad:function(e){this.order=JSON.parse(e.order),this.price=this.order.goods.reduce((function(e,t){return e+t.price*t.sum}),0).toFixed(2)},methods:{getState:function(e,t){if(0===t){if(-1==e)return"iconyiquxiao";if(0==e)return"icondaifukuan";if(1==e)return"icondaifahuo";if(2==e)return"icondaishouhuo";if(3==e)return"iconyiwancheng"}return-1==e?"已取消":0==e?"待付款":1==e?"待发货":2==e?"待收货":3==e?"已完成":void 0},getTime:function(e){function t(e){return e+="",1==e.length&&(e="0"+e),e}var n=new Date(e);return n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+" "+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())},copy:function(){e.setClipboardData({data:this.order.orderId,success:function(){e.showToast({icon:"none",title:"复制成功"})}})},again:function(){var t=this,n=e.getStorageSync("shopcart"),o=this.order.goods;o=JSON.parse(JSON.stringify(o));var u=function(){var e=o[0],t=e.goodsCode,r=e.rule,u=-1;n.forEach((function(e,n){e.goodsCode===t&&e.rule===r&&(u=n)})),-1===u?n.push(o.shift()):(n[u].sum+=o[0].sum,o.shift())};while(o.length)u();e.showLoading({title:"跳转中"}),r.callFunction({name:"shopcart",data:{type:"update",shopcart:n,user:e.getStorageSync("userPhone")}}).then((function(n){e.setStorageSync("shopcart",t.shopcart),e.hideLoading(),e.navigateTo({url:"../shopCart/main?item=true"})}))},pay:function(){var t=this;return i(o.default.mark((function n(){var u,a;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,r.callFunction({name:"order",data:{type:"getMoney",phone:e.getStorageSync("userPhone")}});case 2:if(u=n.sent,a=u.result,!(a<t.order.price)){n.next=9;break}return e.showToast({title:"余额不足",icon:"none"}),n.abrupt("return");case 9:r.callFunction({name:"order",data:{type:"canpay",id:t.order._id,money:a-t.order.price,phone:e.getStorageSync("userPhone")}}).then((function(t){e.navigateBack()}));case 10:case"end":return n.stop()}}),n)})))()},sureSend:function(){r.callFunction({name:"order",data:{type:"sureSend",id:this.order._id}}).then((function(t){e.navigateBack()}))}}};t.default=c}).call(this,n("543d")["default"],n("a9ff")["default"])},"50f9":function(e,t,n){"use strict";n.r(t);var r=n("6e88"),o=n("ced3");for(var u in o)"default"!==u&&function(e){n.d(t,e,(function(){return o[e]}))}(u);n("af73");var a,i=n("f0c5"),c=Object(i["a"])(o["default"],r["b"],r["c"],!1,null,"0c82bdcb",null,!1,r["a"],a);t["default"]=c.exports},"6e88":function(e,t,n){"use strict";var r;n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return u})),n.d(t,"a",(function(){return r}));var o=function(){var e=this,t=e.$createElement,n=(e._self._c,null!==e.order?e.getState(e.order.state,0):null),r=null!==e.order?e.getState(e.order.state,1):null,o=null!==e.order&&2!==e.order.state?e.getState(e.order.state,1):null,u=null!==e.order?e.getTime(e.order.orderTime):null,a=null!==e.order?e.order.goods.reduce((function(e,t){return e+t.sum}),0):null,i=null!==e.order?e.__map(e.order.goods,(function(t,n){var r=e.__get_orig(t),o=t.rule.split(" "),u=(t.sum*t.price).toFixed(2);return{$orig:r,g1:o,g2:u}})):null,c=null!==e.order?(e.order.price-e.price).toFixed(2):null,d=null!==e.order?e.order.price.toFixed(2):null,l=null!==e.order?e.getTime(e.order.orderTime):null;e.$mp.data=Object.assign({},{$root:{m0:n,m1:r,m2:o,m3:u,g0:a,l0:i,g3:c,g4:d,m4:l}})},u=[]},af73:function(e,t,n){"use strict";var r=n("111d"),o=n.n(r);o.a},ced3:function(e,t,n){"use strict";n.r(t);var r=n("1cea"),o=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,(function(){return r[e]}))}(u);t["default"]=o.a},e5fb:function(e,t,n){"use strict";(function(e){n("2662");r(n("66fd"));var t=r(n("50f9"));function r(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])}},[["e5fb","common/runtime","common/vendor"]]]);