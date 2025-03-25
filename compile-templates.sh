#!/bin/bash
handlebars public/pages/login/login.hbs -f public/pages/login/login.precompiled.js
handlebars public/pages/signup/signup.hbs -f public/pages/signup/signup.precompiled.js
handlebars public/pages/mainPage/mainPage.hbs -f public/pages/mainPage/mainPage.precompiled.js
handlebars public/components/AuthForm/AuthForm.hbs -f public/components/AuthForm/AuthForm.precompiled.js
handlebars public/components/PopOver/PopOver.hbs -f public/components/PopOver/PopOver.precompiled.js
handlebars public/components/ListOfChats/ListOfChats.hbs -f public/components/ListOfChats/ListOfChats.precompiled.js
handlebars public/components/Profile/Profile.hbs -f public/components/Profile/Profile.precompiled.js
handlebars public/components/Contacts/Contacts.hbs -f public/components/Contacts/Contacts.precompiled.js
