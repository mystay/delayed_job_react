# DelayedJobReact
Simple React Component built on React on Rails to view and manage Delayed Jobs running with 'delayed_job_active_record'

## Usage


## Installation
Add this line to your application's Gemfile:

```ruby
gem 'delayed_job_react', github: 'mystay/delayed_job_react'
```

And then mount the engine to your `config/routes.rb`:
```bash
  mount DelayedJobReact::Engine, at: "/delayed_job"
```

Or install it yourself as:
```bash
$ gem install delayed_job_react
```

You can then view your running jobs at
```
  http://example.com/delayed_job
```

To install the component in your own view, render the component:
```
  <%= react_component 'DelayedJobReactViewer' %>
```

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
