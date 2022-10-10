# PyREPL-JS

Web-Based extension for connecting a webpage to a LEGO SPIKE Prime Hub

Supported Operating Systems
- SPIKE 2
- SPIKE 3

## How to use
1. Locate the "main" JS file located the build folder of this project
2. Include it in the header of your HTML code
3. Add `<div id="root"> </div>` where you would like to insert the SPIKE connection button.
4. To write code to the SPIKE Hub set `window.pyrepl.write` to the a string of code you would like to run.

Example: `window.pyrepl.write = "print('hello world')"`