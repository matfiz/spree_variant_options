Spree::OptionValue.class_eval do
  
  attr_accessible :hex_color, :image

  default_scope order("#{quoted_table_name}.position")
  validates :hex_color, :length => { :is => 6, :allow_blank => true }

  has_attached_file :image,
    :styles        => { :small => '40x30#', :large => '140x110#' },
    :default_style => :small,
    :url           => "/spree/option_values/:id/:style/:basename.:extension",
    :path          => ":rails_root/public/spree/option_values/:id/:style/:basename.:extension"

  def has_image?
    image_file_name && !image_file_name.empty?
  end
  
  def hex_color=(value)
    write_attribute(:hex_color, value.gsub('#', ''))
  end
  
  def formatted_hex_color
    "##{read_attribute(:hex_color)}" if hex_color?
  end

  scope :for_product, lambda { |product| select("DISTINCT #{table_name}.*").where("spree_option_values_variants.variant_id IN (?)", product.variant_ids).joins(:variants)
  }
end
