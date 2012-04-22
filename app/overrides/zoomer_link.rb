Deface::Override.new(:virtual_path   => "spree/admin/images/index",
                     :name           => "zoomer_link",
                     :insert_top        => "[data-hook='images_row'] > td.actions",
                     :partial        => "spree/admin/images/zoomer_link",
                     :disabled       => false)