colorpicker-server
==================
A Backbone.js GUI and Node.js server that emits `colorChanged` and `colorSet` events our [colorpicker-beaglebone client](https://github.com/Lordnibbler/colorpicker-beaglebone).

## Setup
```sh
# set up the GUI and server
git clone git@github.com:Lordnibbler/colorpicker-server.git
cd colorpicker-server
npm install

# ensure the `socket` var in `public/scripts/main.js` points to localhost
npm start

# set up the client
git clone git@github.com:Lordnibbler/colorpicker-beaglebone.git
cd colorpicker-beaglebone
npm install
npm start
```
Browse to <http://localhost:1337> to use the GUI.
