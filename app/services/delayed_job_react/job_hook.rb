# frozen_string_literal: true

module DelayedJobReact
  class JobHook < Delayed::Plugin
    callbacks do |lifecycle|
      if defined?(ActionCable)
        lifecycle.after(:enqueue) do |_job|
          ActionCable.server.broadcast 'delayed_job_react_jobs_channel',
                                       total: Delayed::Job.count,
                                       failed: Delayed::Job.where('attempts > 2').count
        end
        lifecycle.after(:perform) do |_job|
          ActionCable.server.broadcast 'delayed_job_react_jobs_channel',
                                       total: Delayed::Job.count,
                                       failed: Delayed::Job.where('attempts > 2').count
        end
      end
    end
  end
end
