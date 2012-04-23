//= require_self
//= require "swfobject.js"
//= require store/product_variant_options
//= require store/variant_options

function getMovie(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
}

