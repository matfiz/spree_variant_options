Spree::ProductsController.class_eval do
  
  def images_data
    @product = Spree::Product.find_by_permalink!(params[:id])
    @image_datas = Spree::ImageData.where(:spree_product_id => @product.id).where(:spree_asset_id => params[:thumb_id])
    text = ""
    i = 0
    @image_datas.each do |image|
      text << "&y_#{i}=#{image.y_pos}&x_#{i}=#{image.x_pos}&desc_#{i}=#{image.description}"
      i = i + 1
    end
    render :text => text
  end
end