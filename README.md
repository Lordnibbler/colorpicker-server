# colorpicker-server

A Backbone.js GUI, Node.js and Socket.io server that emits `colorChanged` and `colorSet` events to a [colorpicker-beaglebone client](https://github.com/Lordnibbler/colorpicker-beaglebone).

There are in-depth setup instructions for running the *colorpicker-beaglebone* client on a Beaglebone Black with angstrom distro of linux at the above URL.

## Setup
```sh
# set up the GUI and server
git clone git@github.com:Lordnibbler/colorpicker-server.git
cd colorpicker-server
npm install -d
npm start

# set up the client
git clone git@github.com:Lordnibbler/colorpicker-beaglebone.git
cd colorpicker-beaglebone
npm install
npm start
```
Browse to <http://localhost:1337> to use the GUI.

## Testing
```sh
# use the test watchers
npm test

# or run the tests once
mocha -R dot test/src/*.coffee && karma start --single-run
```
