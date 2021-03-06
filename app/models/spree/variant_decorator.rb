Spree::Variant.class_eval do
  
  include ActionView::Helpers::NumberHelper
  
  def to_hash
    actual_price  = self.price
    #actual_price += Calculator::Vat.calculate_tax_on(self) if Spree::Config[:show_price_inc_vat]
    { 
      :id    => self.id, 
      :count => self.count_warehouse_stock,
      :stock => self.count_stock, 
      :price => number_to_currency(actual_price),
      :image_id => self.images.first.try(:id)
    }
  end
    
end
