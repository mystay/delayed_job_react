# frozen_string_literal: true
if defined?(ActionCable)
  module DelayedJobReact
    class JobChannel < ApplicationCable::Channel
      def subscribed
        stream_from 'delayed_job_react_jobs_channel'
      end

      def unsubscribed
        # Any cleanup needed when channel is unsubscribed
      end
    end
  end
end
