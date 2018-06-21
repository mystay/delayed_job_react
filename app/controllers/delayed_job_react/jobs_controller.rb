# frozen_string_literal: true

module DelayedJobReact
  class JobsController < DelayedJobReact::ApplicationController

    def index
      respond_to do |format|
        format.json{
          @jobs = Delayed::Job.all
          if params[:status].to_s.casecmp('pending').zero?
            @jobs = @jobs.where(attempts: 0)
          elsif params[:status].to_s.casecmp('failed').zero?
            @jobs = @jobs.where.not(last_error: nil)
          end
          @jobs = @jobs.where(queue: params[:queue]) if params[:queue].present?
          @jobs = @jobs.page(params[:page])
          render json: {
            counts: {
              failed: @jobs.where('attempts > 2').count,
              total: @jobs.count
            },
            jobs: @jobs.map { |j| DelayedJobReact::JobSerializer.new(j) }
          }
        }
        format.html{}
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
      job.destroy if job
      render json: {}
    end

    def retry
      job = Delayed::Job.find_by(id: params[:id])
      job.update(run_at: Time.now) if job
      render json: { job: DelayedJobReact::JobSerializer.new(job) }
    end
  end
end
