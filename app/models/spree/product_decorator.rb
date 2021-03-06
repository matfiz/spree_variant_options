Spree::Product.class_eval do

  def option_values
    @_option_values = []
    if self.option_types.where("name REGEXP 'kolor'").count > 0
      kolor = self.option_types.where("name REGEXP 'kolor'").first.option_values.for_product(self).order(:position).sort_by {|ov| ov.option_type.position }.sort{|a,b| a.presentation<=>b.presentation}
      @_option_values = kolor
    end
    self.option_types.where("name NOT REGEXP 'kolor'").each do |varianty|
      @_option_values = @_option_values + varianty.option_values.for_product(self).order(:position).sort_by {|ov| ov.option_type.position }.sort{|a,b| a.presentation<=>b.presentation}
    end
    @_option_values = @_option_values.flatten   
  end

  def grouped_option_values
    @_grouped_option_values ||= option_values.group_by(&:option_type)
  end

  def variants_for_option_value(value)
    @_variant_option_values ||= variants.includes(:option_values).all
    @_variant_option_values.select { |i| i.option_value_ids.include?(value.id) }
  end

  def variant_options_hash
    return @_variant_options_hash if @_variant_options_hash
    hash = {}
    variants.includes(:option_values).each do |variant|
      variant.option_values.each do |ov|
        otid = ov.option_type_id.to_s
        ovid = ov.id.to_s
        hash[otid] ||= {}
        hash[otid][ovid] ||= {}
        hash[otid][ovid][variant.id.to_s] = variant.to_hash
      end
    end
    @_variant_options_hash = hash
  end

end
