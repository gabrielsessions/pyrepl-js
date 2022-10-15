# PyREPL-JS

Web-Based extension for connecting a webpage to a LEGO SPIKE Prime Hub

Supported Operating Systems
- SPIKE 2
- SPIKE 3
- Other MicroPython Devices?

## How to use
1. Create a new HTML project with some default boilerplate code.
2. Include the JS file in your project by pasting this in the `<head>` section: `<script defer="defer" src="https://cdn.jsdelivr.net/gh/gabrielsessions/pyrepl-js/build/main.9763b42e.js"></script>`
3. Add `<div id="root"> </div>` where you would like to insert the SPIKE connection button (in the body).
4. To write code to the SPIKE Hub set `window.pyrepl.write` to the a string of code you would like to run.

Example: `window.pyrepl.write = "print('hello world')"`

Link to Demos: https://gabrielsessions.github.io/pyrepl-js/examples/index.html
