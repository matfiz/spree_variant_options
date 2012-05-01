jQuery(document).ready(function($){
   if (window.location.href.match(/\w*zoomer/).length > 0) {
     var newImg = $("#image_location").data("imageSmall");
     var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
     var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
     var image_id = $("#image_location").data("imageId");
   
   swfobject.embedSWF("/assets/swfs/zoomer_editor.swf", "zoomer_placehoder", "552", "460", "11.2.202","expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id}); 
}
})

