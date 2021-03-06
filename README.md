# DelayedJobReact
Simple React Component built on [React Rails](https://github.com/reactjs/react-rails) to view and manage Delayed Jobs running with [delayed_job_active_record](https://github.com/collectiveidea/delayed_job_active_record)

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

You can then view your running jobs at
```
http://example.com/delayed_job
```

To install the component in your own view, render the component:
```
<%= react_component 'DelayedJobReactViewer' %>
```

To utilize the live counter, add the following hook to `initializers/delayed_job.rb`
```
Delayed::Worker.plugins << DelayedJobReact::JobHook
```

And include the component in your view:
```
<%= react_component 'DelayedJobReactCounter', href: admin_home_path %>
```

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
