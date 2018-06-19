module DelayedJobReact
  class Engine < ::Rails::Engine
    isolate_namespace DelayedJobReact

    initializer "delayed_job_react.assets.precompile" do |app|
      app.config.assets.precompile += %w( delayed_job_react/react_loader.js )
    end


    config.generators do |g|
      g.test_framework :rspec, fixture: false
      g.assets false
      g.helper false
    end

  end
end
