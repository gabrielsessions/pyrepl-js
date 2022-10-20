# PyREPL-JS

Web-Based extension for connecting a webpage to a LEGO SPIKE Prime Hub

Supported Operating Systems
- SPIKE 2
- SPIKE 3
- Other MicroPython Devices?

## How to use
1. Create a new HTML project with some default boilerplate code.
2. Include the JS file in your project by pasting this in the `<head>` section: `<script defer="defer" src="https://cdn.jsdelivr.net/gh/gabrielsessions/pyrepl-js/build/main.js"></script>`
3. Add `<div id="root"> </div>` where you would like to insert the SPIKE connection button (in the body).

- To write code to the SPIKE Hub set `window.pyrepl.write` to the a string of code you would like to run.
- To read console output, fetch the value of `window.pyrepl.read` (it's a variable).
- To clear the output read by `window.pyrepl.read`, simply call the variable `window.pyrepl.clearConsole`.
- To see if PyREPL is active, fetch the value of `window.pyrepl.isActive`.

Example: `window.pyrepl.write = "print('hello world')"`

Link to Demos: https://gabrielsessions.github.io/pyrepl-js/examples/index.html
