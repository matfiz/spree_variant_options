module Spree
  module Admin
    ImagesController.class_eval do
      def zoomer
        @product = Spree::Product.find_by_permalink!(params[:product_id])
        @image = Spree::Image.find(params[:image_id]) if params[:image_id]
      end
      
      def read_data
        @product = Spree::Product.find_by_permalink!(params[:product_id])
        @image = Spree::Image.find(params[:image_id])
        @image_datas = Spree::ImageData.where(:spree_product_id => @product.id).where(:spree_asset_id => @image.id)
        text = ""
        i = 0
        @image_datas.each do |image|
          text << "&data_id_#{i}=#{image.id}&y_#{i}=#{image.y_pos}&x_#{i}=#{image.x_pos}&desc_#{i}=#{image.description}"
          i = i + 1
        end
        render :text => text
      end
      
      def write_data
        @product = Spree::Product.find_by_permalink!(params[:product_id])
        @image = Spree::Image.find(params[:image_id])
        @image_data = Spree::ImageData.new(:spree_product_id => @product.id,:spree_asset_id => @image.id)
        x = params[:x] if params[:x].present?
        y = params[:y] if params[:y].present?
        desc = params[:desc] if params[:desc].present?
        if x.present? and y.present? and desc.present?
          @image_data.x_pos=x
          @image_data.y_pos=y
          @image_data.description=desc
          render :text => "OK"
        else
          render :text => "wrong..."
        end
      end
      
      def destroy_data
        @product = Spree::Product.find_by_permalink!(params[:product_id])
        @image = Spree::Image.find(params[:image_id])
        if params[:data_id].present?
          @image_data = Spree::ImageData.find(params[:data_id])
          @image_data.destroy
          render :text => "OK"
        end
      end
  
    end
  end
end