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
  s.add_dependency 'react-rails', '~> 2.4.4'
  s.add_dependency 'haml', '~> 5.0.4'
  s.add_dependency 'jquery-rails', '~> 4.3.3'
  s.add_dependency 'delayed_job', '~> 4.1.5'
  s.add_dependency 'delayed_job_active_record', '~> 4.1.3'
  s.add_dependency 'active_model_serializers', '~> 0.10.7'
end
