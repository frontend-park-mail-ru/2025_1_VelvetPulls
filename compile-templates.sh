#!/bin/bash
handlebars public/pages/login/login.hbs -f public/pages/login/login.precompiled.js
handlebars public/pages/signup/signup.hbs -f public/pages/signup/signup.precompiled.js
handlebars public/pages/chats/chats.hbs -f public/pages/chats/chats.precompiled.js
handlebars public/components/AuthForm/AuthForm.hbs -f public/components/AuthForm/AuthForm.precompiled.js
handlebars public/components/PopOver/PopOver.hbs -f public/components/PopOver/PopOver.precompiled.js
