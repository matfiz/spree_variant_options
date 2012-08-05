$.extend({
  keys: function(obj){
    var a = [];
    $.each(obj, function(k){ a.push(k) });
    return a;
  }
});

if (!Array.indexOf) Array.prototype.indexOf = function(obj) {
  for(var i = 0; i < this.length; i++){
    if(this[i] == obj) {
      return i;
    }
  }
  return -1;
}

if (!Array.find_matches) Array.find_matches = function(a) {
  var i, m = [];
  a = a.sort();
  i = a.length
  while(i--) {
    if (a[i - 1] == a[i]) {
      m.push(a[i]);
    }
  }
  if (m.length == 0) {
    return false;
  }
  return m;
}            
function VariantOptions(params) {
    
  var options = params['options'];
  var allow_backorders = !params['track_inventory_levels'] ||  params['allow_backorders'];
  var allow_select_outofstock = params['allow_select_outofstock'];
  var default_instock = params['default_instock'];

  var variant, divs, parent, index = 0;
  var selection = [];
  var buttons; 

  function init() {
    divs = $('#product-variants .variant-options');
    el = divs.find('a.option-value');
    disable(el.addClass('locked'));
    el.click(function (e) { e.preventDefault();});
    update();
    enable(parent.find('a.option-value'));
    toggle();
     if ($('#product-variants .variant-options').length > 0 && $('a.option-value.selected').length == 0) {
          $('#cart-form button[type=submit]').attr('disabled', true).fadeTo(0,0.5);
      }
      else{
        //$('#cart-form button[type=submit]').attr('disabled', false).fadeTo(0,1);
      }
    $('.clear-option a.clear-button').hide().click(handle_clear);
    if (default_instock) {
      divs.each(function(){
        $(this).find("ul.variant-option-values li a.option-value:first").click();
      });
    }
    //show only 3 variant images
    //show_only_n_variant_images($('li.vtmb').first().attr('id').replace(/[^\d]*/,''),3);
    $("li.vtmb").hide();
    //init zoomer
    if ($('#thumbnails').find('img').length == 0) {
        var orig_path = $('#main-image').find("img").attr("src");
        var imgName = orig_path.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
        var image_id = orig_path.replace(/\/\w*\/\w*.\w{3}\?\d*$/,'').replace(/\/spree\/products\//,'').split("/")[0];
        var imgPath = orig_path.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'').split(image_id)[0]
        var csrftag = $('meta[name="csrf-token"]').attr('content');
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","/assets/swfs//assets/swfs/expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id, csrftag_: csrftag},{wmode:"opaque"});
    }
    else
    {
        var init_img = $('#product-thumbnails').find('li').first().find("a");
        var newImg = init_img.attr('href');
        var image_id = init_img.parent().attr('id').replace(/[^\d]*/,'');
        var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
        var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'').split(image_id)[0]
        var csrftag = $('meta[name="csrf-token"]').attr('content');
        $("#product-images").data('selectedThumb', init_img.attr('href'));
        $("#product-images").data('selectedThumbId', init_img.parent().attr('id'));
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","/assets/swfs//assets/swfs/expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id, csrftag_: csrftag},{wmode:"opaque"});
    }
  }

  function get_index(parent) {
    return parseInt($(parent).attr('class').replace(/[^\d]/g, ''));
  }

  function update(i) {
    index = isNaN(i) ? index : i;
    parent = $(divs.get(index));
    buttons = parent.find('a.option-value');
    parent.find('a.clear-button').hide(); 
  }

  function disable(btns) {
    return btns.removeClass('selected');
  }

  function enable(btns) {
    allow_select_outofstock = true;
     bt = btns.not('.unavailable').removeClass('locked').unbind('click');
     if (!allow_select_outofstock) {
      bt = bt.filter('.in-stock')
     }
     return bt.click(handle_click).filter('.auto-click').removeClass('auto-click').click();
  }

  function advance() {
    index++
    update();
    inventory(buttons.removeClass('locked'));
    enable(buttons);
  }

  function inventory(btns) {
    var keys, variants, count = 0, selected = {};
    var sels = $.map(divs.find('a.selected'), function(i) { return i.rel });
    $.each(sels, function(key, value) {
      key = value.split('-');
      var v = options[key[0]][key[1]];
      keys = $.keys(v);
      var m = Array.find_matches(selection.concat(keys));
      if (selection.length == 0) {
        selection = keys;
      } else if (m) {
        selection = m;
      }
    });
    btns.removeClass('in-stock out-of-stock unavailable').each(function(i, element) {
      variants = get_variant_objects(element.rel);
      keys = $.keys(variants);
      if (keys.length == 0) {
        disable($(element).addClass('unavailable locked').unbind('click'));
      } else if (keys.length == 1) {
        _var = variants[keys[0]];
        $(element).addClass((_var.count || _var.stock) ? selection.length == 1 ? 'in-stock auto-click' : 'in-stock' : 'out-of-stock');
      } else {
        $.each(variants, function(key, value) { count += value.count; stock += value.stock });
        $(element).addClass(count ? 'in-stock' : 'out-of-stock');
      }
    });
  }

  function get_variant_objects(rels) {
    var i, ids, obj, variants = {};
    if (typeof(rels) == 'string') { rels = [rels]; }
    var otid, ovid, opt, opv;
    i = rels.length;
    try {
      while (i--) {
        ids = rels[i].split('-');
        otid = ids[0];
        ovid = ids[1];
        opt = options[otid];
        if (opt) {
          opv = opt[ovid];
          ids = $.keys(opv);
          if (opv && ids.length) {
            var j = ids.length;
            while (j--) {
              obj = opv[ids[j]];
              if (obj && $.keys(obj).length && 0 <= selection.indexOf(obj.id.toString())) {
                variants[obj.id] = obj;
              }
            }
          }
        }
      }
    } catch(error) {
      //console.log(error);
    } 
    return variants;
  }

  function to_f(string) {
    return parseFloat(string.replace(/[^\d\.]/g, ''));
  }

  function find_variant() {
    var selected = divs.find('a.selected');
    var variants = get_variant_objects(selected.get(0).rel);
    if (selected.length == divs.length) {    //last variant selected
      return variant = variants[selection[0]];
    } else {
      var prices = [];
      $.each(variants, function(key, value) { prices.push(value.price) });
      prices = $.unique(prices).sort(function(a, b) {
        return to_f(a) < to_f(b) ? -1 : 1;
      });
      if (prices.length == 1) {
        $('#product-price .price').html('<span class="price assumed">' + prices[0] + '</span>');
      } else {
        $('#product-price .price').html('<span class="price from">' + prices[0] + '</span> - <span class="price to">' + prices[prices.length - 1] + '</span>');
      }
       var image_ids = []
      $.each(variants, function(key, value) { if(value.image_id!=null) {image_ids.push(value.image_id) }});
      if (image_ids.length > 0) {
        select_image(image_ids[0]);
        show_selected_img(image_ids);//shows only images of current variant
      }
      return false;
    }
  }

  function toggle() {
   if (variant) { 
      if (variant.stock==0 && variant.count > 0){
        $('.aviability-local-image').attr('src',"/assets/store/0.jpg").attr('alt',"na zamówienie");
      }
      if (variant.stock==1){
        $('.aviability-local-image').attr('src',"/assets/store/1.jpg").attr('alt',"bardzo mało");
      }
      if (variant.stock>1 && variant.stock<=5){
        $('.aviability-local-image').attr('src',"/assets/store/5.jpg").attr('alt',"średnia");
      }
      if (variant.stock>5){
        $('.aviability-local-image').attr('src',"/assets/store/10.jpg").attr('alt',"dużo");
      }
      if (variant.stock==0 && variant.count==0){
        $('.aviability-local-image').attr('src',"/assets/store/brak.jpg").attr('alt',"brak");
      }
      if (variant.count==0){
        $('.aviability-image').attr('src',"/assets/store/0.jpg").attr('alt',"na zamówienie");
      }
      if (variant.count==1){
        $('.aviability-image').attr('src',"/assets/store/1.jpg").attr('alt',"bardzo mało");
      }
      if (variant.count>1 && variant.count<=5){
        $('.aviability-image').attr('src',"/assets/store/5.jpg").attr('alt',"średnia");
      }
      if (variant.count>5){
        $('.aviability-image').attr('src',"/assets/store/10.jpg").attr('alt',"dużo");
      }
      if (variant.count==0 && allow_backorders==false){
        $('.aviability-image').attr('src',"/assets/store/brak.jpg").attr('alt',"brak");
      }
      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val(variant.id);
      $('#product-price .price').removeClass('unselected').text(variant.price);
      //if ($('#product-variants .variant-options').length > 0 && $('a.option-value.selected').length == 0) {
      if (variant.count==0) {      
          $('#cart-form button[type=submit]').attr('disabled', true).stop().animate({"opacity":0.5},"fast");
      }
      if (variant.count+variant.stock > 0 || allow_backorders) { 
        $('#cart-form button[type=submit]').attr('disabled', false).stop().animate({"opacity":1},"fast"); 
        if (variant.stock == 0){
           $('#cart-form button[type=submit]').html("zamów");
         }
         else {
           $('#cart-form button[type=submit]').html("kupuj");
         }  
      } 
      //$('form[data-form-type="variant"] button[type=submit]').attr('disabled', false).fadeTo(100, 1);
      try {
        //show_variant_images(variant.id);
        //select_image(variant.image_id);
        show_only_n_variant_images(variant.image_id,5);
      } catch(error) {
        // depends on modified version of product.js
      }
    } else {
      
      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val('');   
      //$('#cart-form button[type=submit], form[data-form-type="variant"] button[type=submit]').attr('disabled', true).stop().animate({"opacity":0.5},"fast");
      price = $('#product-price .price').addClass('unselected')
      // Replace product price by "(select)" only when there are at least 1 variant not out-of-stock
      variants = $("div.variant-options.index-0")
      if (variants.find("a.option-value.out-of-stock").length != variants.find("a.option-value").length) {
        //price.text('(wybierz wariantyy)');
      }
      //if product has no variants
      if ($("#a.option-value").length == 0) {
          //$('#cart-form button[type=submit]').attr('disabled', false).stop().animate({"opacity":1},"fast");
          //$('#product-price .price').removeClass('unselected');
      }
    }
  }

  function clear(i) {
    var el;
    variant = null;
    update(i);
    enable(buttons.removeClass('selected'));
    toggle();
    parent.nextAll().each(function(index, element) {
      el = $(element).find('a.option-value');
      disable(el.show().removeClass('in-stock out-of-stock').addClass('locked').unbind('click'));
      el.click(function (e) { e.preventDefault();});
      $(element).find('a.clear-button').hide();
    });
    $('#cart-form button[type=submit]').attr('disabled', true).stop().animate({"opacity":0.5},"fast");
    if (i==0) {
      //console.log("y="+i);
      show_all_variant_images();
    };
  }


  function handle_clear(evt) {
    evt.preventDefault();
    clear(get_index(this));
  }

  function handle_click(evt) {
    evt.preventDefault();
    variant = null;
    selection = [];
    var a = $(this);
    if (!parent.has(a).length) {
      clear(divs.index(a.parents('.variant-options:first')));
    }
    disable(buttons);
    var a = enable(a.addClass('selected'));
    parent.find('a.clear-button').css('display', 'block');
    advance();
    if (find_variant()) {
      toggle();
    }
    return false;
  }

  $(document).ready(init);

};

//if there are no variants, show product image only
jQuery(document).ready(function(){
    if (window.location.href.match(/\/products\/\w/) != null && ($('#thumbnails').find('img').length == 0 || $(".vtmb").length == 0)) {
        var orig_path = $('#main-image').find("img").attr("src");    
        var imgName = orig_path.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
        var imgPath = orig_path.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
        var image_id = orig_path.replace(/\/\w*\/\w*.\w{3}\?\d*$/,'').replace(/\/spree\/products\//,'');
        var csrftag = $('meta[name="csrf-token"]').attr('content');
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","/assets/swfs//assets/swfs/expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id, csrftag_: csrftag},{wmode:"opaque"});
    }
    if ($(".vtmb").length == 0) {
        $("#product-thumbnails").find("a").click(function(){
            var image_id = $(this).parent().attr("id").replace(/tmb-/,'');
            try {
                select_image(parseInt(image_id));
            } catch(error) {
                // depends on modified version of product.js
            }
            return false;
        });
    }
});
