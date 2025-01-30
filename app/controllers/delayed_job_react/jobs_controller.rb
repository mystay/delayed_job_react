# frozen_string_literal: true

module DelayedJobReact
  class JobsController < DelayedJobReact::ApplicationController
    def index
      respond_to do |format|
        format.json do
          @jobs = Delayed::Job.all
          if params[:status].to_s.casecmp('pending').zero?
            @jobs = @jobs.where(attempts: 0)
          elsif params[:status].to_s.casecmp('failed').zero?
            @jobs = @jobs.where(:last_error.ne => nil)
          end
          @jobs = @jobs.where(queue: params[:queue]) if params[:queue].present?
          failed_count = @jobs.where(:attempts.gt => 2).count

          render json: {
            counts: {
              failed: failed_count,
              total: @jobs.count
            },
            jobs: @jobs.map { |j| DelayedJobReact::JobSerializer.new(j) }
          }
        end
        format.html {}
      end
    end

    def statuses
      @jobs = Delayed::Job.all
      statuses = {}
      @jobs.each do |job|
        sj = DelayedJobReact::JobSerializer.new(job)
        statuses[sj.status] ||= Hash.new(0)
        statuses[sj.status][sj.queue] += 1
      end
      render json: statuses
    end

    def destroy
      job = Delayed::Job.find_by(id: params[:id])
      job&.destroy
      render json: {}
    end

    def retry
      job = Delayed::Job.find_by(id: params[:id])
      job&.update(run_at: Time.now, failed_at: nil, locked_at: nil, last_error: nil)
      render json: { job: DelayedJobReact::JobSerializer.new(job) }
    end
  end
end
