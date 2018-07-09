class DelayedJobReactItem extends React.Component{

  constructor(){
    super();
    this.state = {
      loading: false,
      retrying: false,
      displayError: false,
      displayHandler: false,
      displayAttributes: false,
      displayArguments: false,
      displayParameters: false,
      job: null
    }
    this.handlerObject = this.handlerObject.bind(this);
    this.handlerObjectID = this.handlerObjectID.bind(this);
    this.handlerMethod = this.handlerMethod.bind(this);
    this.handlerJob = this.handlerJob.bind(this);
    this.handlerJobArguments = this.handlerJobArguments.bind(this);
    this.handlerActiveRecordAttributes = this.handlerActiveRecordAttributes.bind(this);
    this.handlerControllerParameters = this.handlerControllerParameters.bind(this);
    this.handler = this.handler.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.retryJob = this.retryJob.bind(this);
    this.failedAt = this.failedAt.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.runningIcon = this.runningIcon.bind(this);
  }
  componentDidMount(){
    this.setState({job: this.props.job})
  }
  render(){
    if (this.state.job){
      return(
        <li className="list-group-item">
          <div className="pull-right">
            <button className="btn btn-default btn-xs" onClick={this.retryJob}
              style={{marginRight: 10}}>
              <i className={`fa fa-sync ${this.state.retrying ? 'fa-spin' : ''}`} /> Retry
            </button>
            <button className="btn btn-default btn-xs" onClick={this.deleteJob}>
              <i className="fa fa-trash" /> Delete
            </button>
          </div>
          <p>
            {this.runningIcon()}
            <span className="label label-default" style={{marginRight: 5}}>
              Created: {this.state.job.created_at}
            </span>
            <span className="label label-default" style={{marginRight: 5}}>
              Run: {this.state.job.run_at}
            </span>
            <span className="label label-success" style={{marginRight: 5}}>
              Queue: {this.state.job.queue}
            </span>
            <span className="label label-info" style={{marginRight: 5}}>
              Priority: {this.state.job.priority}
            </span>
            <span className="label label-warning" style={{marginRight: 5}}>
              Attempts: {this.state.job.attempts}
            </span>
            {this.failedAt()}
          </p>
          <div style={{marginBottom: 10}}>
            {this.handlerObject()}
            {this.handlerObjectID()}
            {this.handlerMethod()}
            {this.handlerJob()}
          </div>
          <div>
            {this.errorMessage()}
            {this.handlerJobArguments()}
            {this.handlerActiveRecordAttributes()}
            {this.handlerControllerParameters()}
            {this.handler()}
          </div>
        </li>
      );
    }else{
      return(null);
    }
  }

  handlerObject(){
    if (this.state.job.handler_object){
      return(
        <span style={{marginLeft: 5}}>
          Object: <code>{this.state.job.handler_object}</code>
        </span>
      );
    }
  }
  handlerObjectID(){
    if (this.state.job.handler_object_id){
      return(
        <span style={{marginLeft: 5}}>
          ID: <code>{this.state.job.handler_object_id}</code>
        </span>
      );
    }
  }
  handlerMethod(){
    if (this.state.job.handler_method){
      return(
        <span style={{marginLeft: 5}}>
          Method: <code>{this.state.job.handler_method}</code>
        </span>
      );
    }
  }
  handlerJob(){
    if (this.state.job.handler_job){
      return(
        <span style={{marginLeft: 5}}>
          Job: <code>{this.state.job.handler_job}</code>
        </span>
      );
    }
  }
  handlerJobArguments(){
    if (this.state.job.handler_job_arguments.length>0){
      let args = []
      if (this.state.displayArguments){
        this.state.job.handler_job_arguments.forEach(function(arg){
          args.push(<li key={arg}><code>{arg}</code></li>);
        });
        args = (<ol className="m20">{args}</ol>);
      }
      return(
        <React.Fragment>
          {this.toggleButton('Arguments')}
          {args}
        </React.Fragment>
      );
    }
  }
  handlerActiveRecordAttributes(){
    if (this.state.job.handler_active_record_attributes.length>0){
      let args = []
      if (this.state.displayAttributes){
        this.state.job.handler_active_record_attributes.forEach(function(arg){
          args.push(
            <li key={arg[0]}>
              <code>{arg.join(' - ')}</code>
            </li>
          );
        });
        args = (<ol className="m20">{args}</ol>);
      }
      return(
        <React.Fragment>
          {this.toggleButton('Attributes')}
          {args}
        </React.Fragment>
      );
    }
  }
  handlerControllerParameters(){
    if (this.state.job.handler_controller_parameters.length>0){
      let args = []
      if (this.state.displayParameters){
        this.state.job.handler_controller_parameters.forEach(function(arg){
          args.push(
            <li key={arg[0]}>
              <code>{arg.join(' - ')}</code>
            </li>
          );
        });
        args = (<ol className="m20">{args}</ol>);
      }
      return(
        <React.Fragment>
          {this.toggleButton('Parameters')}
          {args}
        </React.Fragment>
      );
    }
  }

  handler(){
    let handler = null;
    if (this.state.displayHandler){
      handler = (
        <pre className="small m20">
          {this.state.job.handler}
        </pre>
      );
    }
    return(
      <React.Fragment>
        {this.toggleButton('Handler')}
        {handler}
      </React.Fragment>
    );
  }

  toggleButton(title){
    return(
      <button
        className={`btn btn-xs ${this.state[`display${title}`] ? 'btn-info' : 'btn-default'}`}
        style={{marginRight: 5}}
        onClick={() => {this.setState({[`display${title}`]: !this.state[`display${title}`]})}} >
        <i className="fa fa-chevron-right" /> {title}
      </button>
    );
  }

  deleteJob(){
    if (!this.state.loading && confirm('Are you sure you want to delete this job?')){
      let _this=this;
      this.setState({loading: true})
      $.ajax({
        type: 'DELETE',
        url: `/delayed_job/jobs/${this.props.job.id}`,
        success: function(data){
          _this.setState({loading: false});
          _this.props.removeJob(_this.props.job);
        }
      })
    }
  }

  retryJob(){
    if (!this.state.retrying){
      let _this=this;
      this.setState({retrying: true})
      $.ajax({
        type: 'PATCH',
        url: `/delayed_job/jobs/${this.state.job.id}/retry`,
        success: function(data){
          _this.setState({retrying: false, job: data.job});
        }
      })
    }
  }

  failedAt(){
    if (this.state.job.status=='failed'){
      return(
        <span className="label label-danger" style={{marginRight: 5}}>
          <i className="fa fa-exclamation-triangle" /> Failed
        </span>
      );
    }
  }

  errorMessage(){
    if (this.state.job.last_error){
      let errorMessage = null;
      if (this.state.displayError){
        errorMessage = (
          <pre className="small m20">
            {this.state.job.last_error}
          </pre>
        );
      }
      return(
        <React.Fragment>
          {this.toggleButton('Error')}
          {errorMessage}
        </React.Fragment>
      );
    }
  }

  runningIcon(){
    if (this.state.job.locked_at){
      return(
        <i className="fa fa-sync fa-spin text-success" style={{marginRight: 10}} />
      );
    }
  }

}
