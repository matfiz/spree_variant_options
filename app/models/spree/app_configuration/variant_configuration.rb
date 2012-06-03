module SpreeVariantOptions
  class VariantConfiguration < Spree::Preferences::Configuration
    preference :allow_select_outofstock, :boolean, :default => true
    preference :default_instock, :boolean, :default => false
  end
end