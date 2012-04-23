var add_image_handlers = function() {
  $('ul.thumbnails').delegate('a', 'click', function(event) {
    var newImg = $(event.currentTarget).attr('href');
    var image_id = $(event.currentTarget).parent().attr('id').replace(/[^\d]*/,'');
    //call Zoomer
    var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    getMovie("main-image").reloadContent(imgName,imgPath,image_id);
    $("#product-images").data('selectedThumb', $(event.currentTarget).attr('href'));
    $("#product-images").data('selectedThumbId', $(event.currentTarget).parent().attr('id'));
    $(this).mouseout(function() {
      //$('ul.thumbnails li').removeClass('selected');
      //$(event.currentTarget).parent('li').addClass('selected');
    });
    return false;
  });
  $('ul.thumbnails').delegate('li', 'mouseenter', function(event) {
    //var newImg = $(event.currentTarget).find('a').attr('href');
    //var image_id = $(event.currentTarget).attr('id').replace(/[^\d]*/,'');
    //call Zoomer
    //var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    //var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    //getMovie("main-image").reloadContent(imgName,imgPath,image_id);  
  });
  $('ul.thumbnails').delegate('li', 'mouseleave', function(event) {
    //var newImg = $("#product-images").data('selectedThumb');
    //var image_id = $("#product-images").data('selectedThumbId').replace(/[^\d]*/,'');
    //call Zoomer
    //var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    //var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    //getMovie("main-image").reloadContent(imgName,imgPath,image_id);    
    //$('#main-image img').attr('src', $("#main-image").data('selectedThumb'));
  });
  
  //open first thumb on init
  $('ul.thumbnails li').eq(0).addClass('selected');
};

var show_variant_images = function(variant_id) {
  $('li.vtmb').hide();
  $('li.vtmb-' + variant_id).show();
  var currentThumb = $('#' + $("#main-image").data('selectedThumbId'));
  // if currently selected thumb does not belong to current variant, nor to common images,
  // hide it and select the first available thumb instead.
  if(!currentThumb.hasClass('vtmb-' + variant_id)) {
    var thumb = $($("ul.thumbnails li.vtmb-" + variant_id + ":first").eq(0));
    if (thumb.length == 0) {
      thumb = $($('ul.thumbnails li:visible').eq(0));
    }
    var newImg = thumb.find('a').attr('href');
    $('ul.thumbnails li').removeClass('selected');
    thumb.addClass('selected');
    //$('#main-image img').attr('src', newImg);
    $("#product-images").data('selectedThumb', newImg);
    $("#product-images").data('selectedThumbId', thumb.attr('id'));
    var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    var imgPath = newImg.replace(/\/\w*.\w{3}\?\d*$/,'');
    $("#main-image").reloadContent(imgName,imgPath,variant_id);
  }
}

var select_image = function(image_id) {
  var currentThumb = $('#' + $("#main-image").data('selectedThumbId'));
  var img = $("#tmb-" + image_id)
  if (img.length > 0 && img != currentThumb)
  {
    var thumb = $(img.eq(0));
    var newImg = thumb.find('a').attr('href');
    $('ul.thumbnails li').removeClass('selected');
    thumb.addClass('selected');
    //$('#main-image img').attr('src', newImg);
    $("#product-images").data('selectedThumb', newImg);
    $("#product-images").data('selectedThumbId', thumb.attr('id'));
    //call Zoomer
    var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    //console.log(imgName,imgPath,image_id);
    getMovie("main-image").reloadContent(imgName,imgPath,image_id);
  }
}

var show_all_variant_images = function() {
  $('li.vtmb').show();
}

var show_only_n_variant_images = function(variant,n) {
  var img = $("#tmb-" + variant)
  $('li.vtmb').hide();
  var current_img = img;
  var variant_imgs = $('li.vtmb');
  for (i=1;i<=n;i++) {
    current_img.show()
    current_img = current_img.siblings('li.vtmb').first();
  }
}

var show_selected_img = function(img_ids){
    $("#product-thumbnails").find("li").hide();
    for (i=0;i<=img_ids.length-1;i++){
        $("#tmb-"+img_ids[i]).fadeIn();
    }
}



function getObjectById(objectIdStr) {
        var r = null;
        var o = getElementById(objectIdStr);
        if (o && o.nodeName == "OBJECT") {
            if (typeof o.SetVariable != UNDEF) {
                r = o;
            }
            else {
                var n = o.getElementsByTagName(OBJECT)[0];
                if (n) {
                    r = n;
                }
            }
        }
        return r;
    }
