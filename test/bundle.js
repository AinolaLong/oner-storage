!function(){"use strict";document.getElementById("mode").innerHTML=nattyStorage.supportStorage?"localStorage可用":"localStorage不可用";var t=1,e=function(){return t++};describe("nattyStorage v2.0.0 Unit Test",function(){describe("static",function(){it("version v2.0.0",function(){expect(nattyStorage.version).to.equal("2.0.0")}),it("supportStorage",function(){expect(nattyStorage.supportStorage).to.be.a("boolean")})}),describe("`set/has` method",function(){var t;beforeEach("reset",function(){t=nattyStorage({type:"localStorage",key:"foo"})}),afterEach("clear",function(){t.destroy()}),it("`has` method without any argument: throw error",function(){t.set("foo","x");var e=function(){t.has()};expect(e).to.throwError()}),it("`has` method with `key`: has value",function(){t.set("foo","x");var e=t.has("foo");expect(e.has).to.be(!0),expect(e.value).to.be("x")}),it("`has` method with `key`: no value",function(){t.set("foo","x");var e=t.has("boo");expect(e.has).to.be(!1),expect(e.value).to.be(undefined)}),it("`has` method with `path`: has value",function(){t.set("foo.y","y");var e=t.has("foo");expect(e.has).to.be(!0),expect(e.value.y).to.be("y")}),it("`has` method with `path`: no value",function(){t.set("foo.y","y");var e=t.has("foo.y.z");expect(e.has).to.be(!1),expect(e.value).to.be(undefined)})}),describe("`set/get` method",function(){var t;beforeEach("reset",function(){t=nattyStorage({type:"localStorage",key:"foo"})}),afterEach("clear",function(){t.destroy()}),it("`get` method without `key|path` argument should return all data",function(){t.set("foo","x"),expect(JSON.stringify(t.get())).to.be('{"foo":"x"}')}),it("`get` method with `key`",function(){t.set("foo","x"),expect(t.get("foo")).to.be("x")}),it("`set` method with wrong `path`",function(){t.set("foo","x");var e=function(){t.set("foo.boo","y")};expect(e).to.throwError(),expect(JSON.stringify(t.get())).to.be('{"foo":"x"}')}),it("`get` method with `\\\\ path`",function(){t.set("x.y\\.y.z","x"),expect(t.get("x.y\\.y.z")).to.be("x")}),it("`set` method with `undefined` value",function(){t.set("foo",undefined),expect(JSON.stringify(t.get())).to.be("{}")})}),describe("`set/remove` method",function(){var t,e={x:{y:{z:"z",zz:"zz"}}};beforeEach("reset",function(){t=nattyStorage({type:"localStorage",key:"foo"})}),afterEach("clear",function(){t.destroy()}),it("remove partial data by path",function(){t.set("foo",e),t.remove("foo.x.y.z"),expect(t.get("foo.x.y.zz")).to.be("zz")}),it("remove complete data by path",function(){t.set("foo",e),t.remove("foo.x.y"),expect(JSON.stringify(t.get("foo.x"))).to.be("{}")}),it("remove by a un-existed path",function(){t.set("foo",e),t.remove("foo.boo"),expect(JSON.stringify(t.get("foo"))).to.be(JSON.stringify(e))}),it("remove all data",function(){t.set("foo",e),t.remove(),expect(JSON.stringify(t.get())).to.be("{}")})}),describe("destroy",function(){it("call method after `destroy` should throw error",function(){var t=nattyStorage({type:"localStorage",key:"foo"});t.set("foo","x"),t.destroy();var e=function(){t.get()};expect(e).to.throwError()})}),describe("`asyncSet/asyncGet` method",function(){var t;beforeEach("reset",function(){t=nattyStorage({type:"localStorage",key:"foo"})}),afterEach("clear",function(){t.destroy()}),it("`asyncGet` method without `key` argument should return all data",function(e){t.asyncSet("foo","x").then(function(){t.asyncGet().then(function(t){expect(JSON.stringify(t)).to.be('{"foo":"x"}'),e()})})}),it("`asyncSet` method with wrong `path`",function(e){t.set("foo","x"),t.asyncSet("foo.boo","y").then(function(){})["catch"](function(){expect(JSON.stringify(t.get())).to.be('{"foo":"x"}'),e()})})}),describe("valid checking",function(){it("`tag` checking: invalid",function(){var t=e(),o=nattyStorage({type:"localStorage",key:t,tag:"1.0"});o.set("foo","x");var a=nattyStorage({type:"localStorage",key:t,tag:"2.0"});expect(JSON.stringify(a.get())).to.be("{}"),o.destroy(),a.destroy()}),it("`tag` checking: valid",function(){var t=e(),o=nattyStorage({type:"localStorage",key:t,tag:"1.0"});o.set("foo","x");var a=nattyStorage({type:"localStorage",key:t,tag:"1.0"});expect(a.get("foo")).to.be("x"),o.destroy()}),it("`duration` checking：invalid",function(t){var e="test-expire",o=nattyStorage({type:"localStorage",key:e,duration:200});o.set("foo","x"),setTimeout(function(){var a=nattyStorage({type:"localStorage",key:e,duration:200});try{expect(JSON.stringify(a.get())).to.be("{}"),o.destroy(),a.destroy(),t()}catch(e){t(e)}},300)}),it("`duration` checking：valid",function(){var t="test-expire",e=nattyStorage({type:"localStorage",key:t,duration:200});e.set("foo","x");var o=nattyStorage({type:"localStorage",key:t,duration:200});expect(o.get().foo).to.be("x"),e.destroy(),o.destroy()}),it("`until` checking: invalid",function(){var t="until-invalid",e=nattyStorage({type:"localStorage",key:t,until:new Date((new Date).getTime()-1e3).getTime()});e.set("foo","x");var o=nattyStorage({type:"localStorage",key:t});expect(JSON.stringify(o.get())).to.be("{}"),e.destroy(),o.destroy()}),it("`until` checking: valid",function(){var t="until-valid",e=nattyStorage({type:"localStorage",key:t,until:(new Date).getTime()+36e5});e.set("x","x");var o=nattyStorage({type:"localStorage",key:t});expect(JSON.stringify(o.get())).to.be('{"x":"x"}'),e.destroy(),o.destroy()})}),describe("clean",function(){it("clean up `until` invalid storage",function(){nattyStorage({type:"localStorage",key:"clean",until:new Date((new Date).getTime()-1e3).getTime()}).set("foo","x"),nattyStorage.clean();var t=nattyStorage({type:"localStorage",key:"clean-until"});expect(JSON.stringify(t.get())).to.be("{}"),t.destroy()}),it("clean up `duration` invalid storage",function(t){nattyStorage({type:"localStorage",key:"clean-duration",duration:100}).set("foo","x"),nattyStorage.clean(),setTimeout(function(){var e=nattyStorage({type:"localStorage",key:"clean-duration"});expect(JSON.stringify(e.get())).to.be("{}"),e.destroy(),t()},300)})})})}();
//# sourceMappingURL=bundle.js.map
