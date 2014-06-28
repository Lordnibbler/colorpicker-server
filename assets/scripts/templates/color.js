"use strict";
var app = app || {};

app.colorTemplate = '\
<div class="color">\
  <div class="info">\
    <div class="rgb">\
      <h2><%= colorHex %></h2>\
    </div>\
  </div>\
  <div class="meta-controls">\
    <button class="meta-details btn btn-sunken"><i class="icon-cog icon-large"></i></button>\
    <button class="destroy btn"><i class="icon-remove icon-large"></i></button>\
  </div>\
</div>\
<div class="details">\
  <div class="color-input rgb">\
    rgb(<span class="number-widget r">\
      <input type="text" value="<%= r %>" data-type="red" tabindex="1" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>,<span class="number-widget g">\
      <input type="text" value="<%= g %>" data-type="green" tabindex="2" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>,<span class="number-widget b">\
      <input type="text" value="<%= b %>" data-type="blue" tabindex="3" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>)\
  </div>\
  <div class="color-input hsl">\
    hsl(<span class="number-widget h">\
      <input type="text" value="<%= h %>" data-type="hue" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>,<span class="number-widget s">\
      <input type="text" value="<%= s %>" data-type="saturation" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>,<span class="number-widget l">\
      <input type="text" value="<%= l %>" data-type="lightness" />\
      <button class="stepper up btn"><i class="icon-caret-up"></i></button>\
      <button class="stepper down btn"><i class="icon-caret-down"></i></button>\
    </span>)\
  </div>\
</div>\
';
