(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <div class=\"auth-form__input-wrapper\">\r\n                <input class=\"auth-form__input\" type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\" id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\" name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\" placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\">\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||container.hooks.helperMissing).call(alias3,(depth0 != null ? lookupProperty(depth0,"name") : depth0),"password",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":10,"column":22},"end":{"line":10,"column":47}}}),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":12,"column":23}}})) != null ? stack1 : "")
    + "            </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                        <button class=\"auth-form__toggle-password\">👁️</button>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"auth-body\" class=\"loginForm\">\r\n    <div id=\"main-auth\">\r\n        <div class=\"main-auth__logo\">\r\n            ./Keftegr@m\r\n        </div>\r\n        <form method=\"post\" class=\"auth-form\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"fields") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":12},"end":{"line":14,"column":21}}})) != null ? stack1 : "")
    + "            <button type=\"submit\" class=\"auth-form__button\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"buttonText") || (depth0 != null ? lookupProperty(depth0,"buttonText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonText","hash":{},"data":data,"loc":{"start":{"line":15,"column":60},"end":{"line":15,"column":74}}}) : helper)))
    + "</button>\r\n        </form>\r\n        <div class=\"register-link\">\r\n            <span>Нет аккаунта?\r\n                <a class=\"register-link__link\" id=\"signupLink\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"redirectText") || (depth0 != null ? lookupProperty(depth0,"redirectText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"redirectText","hash":{},"data":data,"loc":{"start":{"line":19,"column":63},"end":{"line":19,"column":79}}}) : helper)))
    + "</a>\r\n            </span>\r\n        </div>\r\n    </div>\r\n</div>";
},"useData":true});
})();