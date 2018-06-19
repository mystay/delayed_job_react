$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "delayed_job_react/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "delayed_job_react"
  s.version     = DelayedJobReact::VERSION
  s.authors     = ["Mystay International"]
  s.email       = ["dev@mystayinternational.com"]
  s.homepage    = "http://github.com/mystay/delayed_job_react"
  s.summary     = %q{React Component for viewing and managing Delayed Jobs}
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.1.0"
  s.add_dependency 'react-rails'
  s.add_dependency 'haml'
  s.add_dependency 'jquery-rails'
  s.add_dependency 'delayed_job'
  s.add_dependency 'delayed_job_active_record'
  s.add_dependency 'active_model_serializers'
end
