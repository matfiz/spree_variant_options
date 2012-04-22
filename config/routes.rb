Spree::Core::Engine.routes.append do

  namespace :admin do
    resources :option_values do
      collection do
        post :update_positions
      end
    end
  end
  
  resources :products do
    post 'images_data/:thumb_id', :on => :member, :action => 'images_data'
    get 'images_data/:thumb_id', :on => :member, :action => 'images_data'
  end
  
end
