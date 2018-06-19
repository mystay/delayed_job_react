class DelayedJobReactList extends React.Component{
  constructor(){
    super();
    this.state = {
      loading: null,
      jobs: [],
      previousProps: null
    }
    this.init = this.init.bind(this);
    this.jobList = this.jobList.bind(this);
    this.removeJob = this.removeJob.bind(this);
  }

  componentDidUpdate(){
    if (this.props.status && this.state.previousProps != JSON.stringify(this.props)){
      this.init();
    }
  }

  init(){
    if (!this.state.loading){
      this.setState({loading: true, previousProps: JSON.stringify(this.props)});
      let _this=this;
      let url = `/delayed_job/jobs?status=${this.props.status}`;
      if (this.props.queue){
        url += `&queue=${this.props.queue}`
      }
      $.ajax({
        type: 'GET',
        url: url,
        success: function(data){
          _this.setState({jobs: data.jobs, loading: false});
        }
      });
    }
  }

  render(){
    if (this.props.status && this.state.jobs.length>0){
      return(
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              {this.state.jobs.length} {this.props.status} Jobs
            </h3>
          </div>
          <div className="panel-body no-padding">
            {this.jobList()}
          </div>
        </div>
      );
    }else{
      return(null);
    }
  }

  jobList(){
    if (this.state.jobs.length>0){
      let list = [];
      let removeJob = this.removeJob;
      this.state.jobs.forEach(function(job){
        list.push(
          <DelayedJobReactItem key={job.id} job={job}
            removeJob={removeJob} />
        )
      });
      return(list);
    }
  }

  removeJob(job){
    let jobs = this.state.jobs;
    index = jobs.indexOf(job);
    jobs.splice(index,1);
    this.setState({jobs: jobs});
    this.props.updateStatusPanel();
  }
}
