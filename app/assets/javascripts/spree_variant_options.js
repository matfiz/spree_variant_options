//= require swfobject
//= require_self
//= require store/product_variant_options
//= require store/variant_options

jQuery(document).ready(function($){
    jQuery.getMovie = function (movieName) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            return window[movieName];
        } else {
            return document[movieName];
        }
    }
});
