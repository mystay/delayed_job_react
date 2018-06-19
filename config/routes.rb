DelayedJobReact::Engine.routes.draw do
  root to: 'jobs#index'
  resources :jobs do
    collection do
      get :statuses
    end
    member do
      patch :retry
    end
  end
end
