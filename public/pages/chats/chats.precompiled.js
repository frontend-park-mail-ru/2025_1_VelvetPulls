(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['chats.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <div class=\"chat-item "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"active") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":34},"end":{"line":13,"column":72}}})) != null ? stack1 : "")
    + "\">\r\n                <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"avatar") || (depth0 != null ? lookupProperty(depth0,"avatar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data,"loc":{"start":{"line":14,"column":26},"end":{"line":14,"column":36}}}) : helper)))
    + "\" alt=\"User avatar\" class=\"chat-item__avatar\" />\r\n                <div class=\"chat-item__info\">\r\n                    <h3 class=\"chat-item__name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":16,"column":48},"end":{"line":16,"column":56}}}) : helper)))
    + "</h3>\r\n                    <p class=\"chat-item__preview\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"preview") || (depth0 != null ? lookupProperty(depth0,"preview") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"preview","hash":{},"data":data,"loc":{"start":{"line":17,"column":50},"end":{"line":17,"column":61}}}) : helper)))
    + "</p>\r\n                </div>\r\n                <div class=\"chat-item__meta\">\r\n                    <time class=\"chat-item__time\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"time") || (depth0 != null ? lookupProperty(depth0,"time") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"time","hash":{},"data":data,"loc":{"start":{"line":20,"column":50},"end":{"line":20,"column":58}}}) : helper)))
    + "</time>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"unreadCount") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":20},"end":{"line":25,"column":27}}})) != null ? stack1 : "")
    + "                </div>\r\n            </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "chat-item--active";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <div class=\"chat-item__flag\">\r\n                        <span class=\"chat-item__unread-count\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"unreadCount") || (depth0 != null ? lookupProperty(depth0,"unreadCount") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"unreadCount","hash":{},"data":data,"loc":{"start":{"line":23,"column":62},"end":{"line":23,"column":77}}}) : helper)))
    + "</span>\r\n                    </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"container\">\r\n    <nav class=\"sidebar\">\r\n        <header class=\"sidebar__header\">\r\n            <img src=\"menuIcon.svg\" alt=\"Menu\" class=\"sidebar__icon\" />\r\n            <div class=\"sidebar__search\">\r\n                <img src=\"searchIcon.svg\" alt=\"Search\" class=\"sidebar__icon\" />\r\n                <p class=\"sidebar__placeholder\">Поиск чата</p>\r\n            </div>\r\n        </header>\r\n        <div class=\"sidebar__divider\"></div>\r\n        <section class=\"sidebar__chat-list\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"chats") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":12},"end":{"line":28,"column":21}}})) != null ? stack1 : "")
    + "            <div class=\"sidebar__spacer\"></div>\r\n            <footer class=\"sidebar__footer\">\r\n                <button class=\"sidebar__button\">\r\n                    <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/04a1b524c884ffce29c88a1ec38b941230427316b25c57ef392ac66c978536e7?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                        alt=\"New chat\" class=\"sidebar__icon\" />\r\n                </button>\r\n            </footer>\r\n        </section>\r\n    </nav>\r\n    <div class=\"container__divider\"></div>\r\n    <main class=\"main-chat\">\r\n        <header class=\"main-chat__header\">\r\n            <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/336e7ec7722af96aa6f68e6147e1aa31fb5e806c7a844019f57b339d350ac07a?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                alt=\"Current user avatar\" class=\"main-chat__avatar\" />\r\n            <div class=\"main-chat__user-info\">\r\n                <h2 class=\"main-chat__name\">Ольга Тинькова</h2>\r\n                <p class=\"main-chat__status\">был(а) в сети недавно</p>\r\n            </div>\r\n            <div class=\"main-chat__spacer\"></div>\r\n            <button class=\"main-chat__action\">\r\n                <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/12de0946711920305bf7423cd1583bd97f39d87f4f1129a3e7dfefa676af7da0?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                    alt=\"Action 1\" class=\"main-chat__icon\" />\r\n            </button>\r\n            <button class=\"main-chat__action\">\r\n                <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/07e3a7419adaaa4caf6c8e55c53df22de388d062fd87474b853f1847234659e4?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                    alt=\"Action 2\" class=\"main-chat__icon\" />\r\n            </button>\r\n        </header>\r\n\r\n        <section class=\"main-chat__container\">\r\n            <div class=\"main-chat__messages\">\r\n                <p class=\"main-chat__empty\">\r\n                    Пока нет сообщений... Отправьте Ваше первое сообщение.\r\n                </p>\r\n            </div>\r\n            <div class=\"main-chat__divider\"></div>\r\n            <footer class=\"main-chat__input-container\">\r\n                <button class=\"main-chat__attachment-button\">\r\n                    <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/b94e218ff03d58b207ef429ccabac33cc1ca0a2b0a1e678fea80f1129e9162b6?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                        alt=\"Add attachment\" class=\"main-chat__icon\" />\r\n                </button>\r\n                <div class=\"main-chat__input-wrapper\">\r\n                    <div class=\"main-chat__input-field\">\r\n                        <p class=\"main-chat__placeholder\">Написать</p>\r\n                        <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/70c47b3a5aeb1c4d90a5ffd8e3b3bfd0296c36c7db7a71135a2cca20da23d699?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                            alt=\"Emoji\" class=\"main-chat__emoji-icon\" />\r\n                    </div>\r\n                </div>\r\n                <button class=\"main-chat__send-button\">\r\n                    <img src=\"https://cdn.builder.io/api/v1/image/assets/TEMP/d94c0babdfa680b96bb9970cd04743e0f36c6720d7b64109222e155038a32bc9?placeholderIfAbsent=true&apiKey=c6af73f4f8d84b399e6c18554da63ac7\"\r\n                        alt=\"Send message\" class=\"main-chat__send-icon\" />\r\n                </button>\r\n            </footer>\r\n        </section>\r\n    </main>\r\n</div>";
},"useData":true});
})();