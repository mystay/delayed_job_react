# frozen_string_literal: true
module DelayedJobReact
  class JobSerializer < ActiveModel::Serializer
    attributes :id, :queue, :priority, :attempts, :handler, :last_error,
               :run_at, :locked_at, :failed_at, :created_at, :updated_at, :handler_object,
               :handler_object_id, :handler_method, :handler_job,
               :handler_job_arguments, :status, :handler_active_record_attributes, :handler_controller_parameters

    def id
      object.id.to_s
    end

    def run_at
      timestamp_for(object.run_at)
    end

    def created_at
      timestamp_for(object.created_at)
    end

    def updated_at
      timestamp_for(object.updated_at)
    end

    def locked_at
      timestamp_for(object.locked_at)
    end

    def status
      if object.attempts.zero?
        'pending'
      elsif object.last_error.present?
        'failed'
      end
    end

    def queue
      object.queue
    end

    def handler_object
      results = object.handler.scan(%r{object:\s!ruby\/object:(\w*)\n})[0]
      results.first if results && results.any?
    end

    def handler_object_id
      results = object.handler.scan(/name:\sid\n\s*value_before_type_cast\:\s?(\w*)/)[0]
      results.first if results && results.any?
    end

    def handler_method
      results = object.handler.scan(/method_name:\s\:([\w\!]*)/)[0]
      results.first if results && results.any?
    end

    def handler_job
      results = object.handler.scan(/job_data\:\n\s*job_class\:\s([\w\:]*)/)[0]
      results.first if results && results.any?
    end

    def handler_job_arguments
      args = object.handler.scan(%r{arguments\:\n\s*([\-\s\w\n\:\/\@\.]*)\s+\s+executions\:})[0]
      return [] unless args
      args[0].scan(%r{(\b[\w\:\/\.\@]*)\n}).map(&:first)
    end

    def handler_active_record_attributes
      attrs = object.handler.scan(/ActiveRecord::Attribute::FromDatabase\n\s+name:\s?(\w*)\n\s*value_before_type_cast:\s([\w\-]*)/)
      return [] unless attrs
      attrs.map { |a| a }
    end

    def handler_controller_parameters
      regexp = %r{ActionController::Parameters\n\s*parameters\:\s*!ruby\/hash:ActiveSupport::HashWithIndifferentAccess\n\s*([\'\w\s\n\:]*)}
      params = object.handler.scan(regexp)[0]
      return [] unless params
      params.to_s.scan(/(\w*)\:\s([\'\w\s]*)/)
    end

    private

    def timestamp_for(timevalue)
      timevalue.present? && timevalue.in_time_zone.strftime('%b %d, %Y %H:%M%P')
    end
  end

end
