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

function VariantOptions(options, allow_backorders, allow_select_outofstock) {

  var options = options;
  var allow_backorders = allow_backorders;
  var allow_select_outofstock = allow_select_outofstock;
  var variant, divs, parent, index = 0;
  var selection = [];
  var buttons; 

  function init() {
    divs = $('#product-variants .variant-options');
    disable(divs.find('a.option-value').addClass('locked'));
    update();
    enable(parent.find('a.option-value'));
    toggle();
    $('.clear-option a.clear-button').hide().click(handle_clear);
    //show only 3 variant images
    //show_only_n_variant_images($('li.vtmb').first().attr('id').replace(/[^\d]*/,''),3);
    $("li.vtmb").hide();
    //init zoomer
    if ($('#thumbnails').find('img').length == 0) {
        var orig_path = $('#main-image').find("img").attr("src");
        var imgName = orig_path.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
        var imgPath = orig_path.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
        var image_id = orig_path.replace(/\/\w*\/\w*.\w{3}\?\d*$/,'').replace(/\/spree\/products\//,'');
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id});
    }
    else
    {
        var init_img = $('#product-thumbnails').find('li').first().find("a");
        var newImg = init_img.attr('href');
        var image_id = init_img.parent().attr('id').replace(/[^\d]*/,'');
        var imgName = newImg.replace(/\/\w*\/\w*\/\w*\/\w*\//,'');
        var imgPath = newImg.replace(/\d*\/\w*\/\w*.\w{3}\?\d*$/,'');
        $("#product-images").data('selectedThumb', init_img.attr('href'));
        $("#product-images").data('selectedThumbId', init_img.parent().attr('id'));
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id});
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
     bt = btns.not('.unavailable').removeClass('locked').unbind('click')
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
        $(element).addClass((allow_backorders || _var.count) ? selection.length == 1 ? 'in-stock auto-click' : 'in-stock' : 'out-of-stock');
      } else if (allow_backorders) {
        $(element).addClass('in-stock');
      } else {
        $.each(variants, function(key, value) { count += value.count });
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
    if (selected.length == divs.length) {
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
      $.each(variants, function(key, value) { image_ids.push(value.image_id) });
      if (image_ids.length > 0) {
        select_image(image_ids[0]);
        show_selected_img(image_ids);
      }
      return false;
    }
  }

  function toggle() {
    if (variant) {
      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val(variant.id);
      $('#product-price .price').removeClass('unselected').text(variant.price);
       if (variant.count > 0) { 
         $('#cart-form button[type=submit]').attr('disabled', false).fadeTo(100, 1);
       }   
      $('form[data-form-type="variant"] button[type=submit]').attr('disabled', false).fadeTo(100, 1);
      try {
        //show_variant_images(variant.id);
        select_image(variant.image_id);
        show_only_n_variant_images(variant.image_id,5);
      } catch(error) {
        // depends on modified version of product.js
      }
    } else {
      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val('');   
      $('#cart-form button[type=submit], form[data-form-type="variant"] button[type=submit]').attr('disabled', true).fadeTo(0, 0.5);
      price = $('#product-price .price').addClass('unselected')
      // Replace product price by "(select)" only when there are at least 1 variant not out-of-stock
      variants = $("div.variant-options.index-0")
      if (variants.find("a.option-value.out-of-stock").length != variants.find("a.option-value").length)
        price.text('(wybierz wariant)');
    }
  }

  function clear(i) {
    variant = null;
    update(i);
    enable(buttons.removeClass('selected'));
    toggle();
    parent.nextAll().each(function(index, element) {
      disable($(element).find('a.option-value').show().removeClass('in-stock out-of-stock').addClass('locked').unbind('click'));
      $(element).find('a.clear-button').hide();
    });
    //show_all_variant_images();
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
        swfobject.embedSWF("/assets/swfs/zoomer.swf", "main-image", "552", "460", "11.2.202","expressInstall.swf",{path_:imgPath, img_:imgName, id_:image_id});
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
