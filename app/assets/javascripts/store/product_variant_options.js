var add_image_handlers = function() {
  $("#main-image").data('selectedThumb', $('#main-image img').attr('src'));
  $('ul.thumbnails li').eq(0).addClass('selected');

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
      $('ul.thumbnails li').removeClass('selected');
      $(event.currentTarget).parent('li').addClass('selected');
    });
    return false;
  });
  $('ul.thumbnails').delegate('li', 'mouseenter', function(event) {
    var newImg = $(event.currentTarget).find('a').attr('href');
    var image_id = $(event.currentTarget).attr('id').replace(/[^\d]*/,'');
    //call Zoomer
    var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    getMovie("main-image").reloadContent(imgName,imgPath,image_id);  
  });
  $('ul.thumbnails').delegate('li', 'mouseleave', function(event) {
    var newImg = $("#product-images").data('selectedThumb');
    var image_id = $("#product-images").data('selectedThumbId').replace(/[^\d]*/,'');
    //call Zoomer
    var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
    var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
    getMovie("main-image").reloadContent(imgName,imgPath,image_id);    
      
    $('#main-image img').attr('src', $("#main-image").data('selectedThumb'));
  });
};

var show_variant_images = function(variant_id) {
    console.log("click!");
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
    console.log(imgName,imgPath,variant_id);
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

function getMovie(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
}