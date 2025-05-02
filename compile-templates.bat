@echo off
setlocal enabledelayedexpansion

echo Compiling Handlebars templates...

for /r %%f in (*.hbs) do (
    set "template=%%f"
    set "precompiled_file=%%~dpnf.precompiled.js"
    echo Compiling "%%f" to "%%~dpnf.precompiled.js"...
    call node ".\node_modules\handlebars\bin\handlebars" "%%f" -f "%%~dpnf.precompiled.js"
)

echo Templates compiled successfully!
endlocal