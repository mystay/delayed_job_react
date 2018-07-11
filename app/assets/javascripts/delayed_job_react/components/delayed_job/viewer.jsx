class DelayedJobReactViewer extends React.Component{

  constructor(){
    super();
    this.state = {
      loading: false,
      statuses: {},
      queue: null,
      status: null,
      polling: false
    };
    this.setStatus = this.setStatus.bind(this);
    this.statusList = this.statusList.bind(this);
    this.updateStatusPanel = this.updateStatusPanel.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount(){
    this.init();
  }

  init(){
    if (!this.state.loading){
      this.setState({loading: true});
      let _this=this;
      $.ajax({
        type: 'GET',
        url: '/delayed_job/jobs/statuses',
        success: function(data){
          _this.setState({statuses: data, loading: false});
          if (JSON.stringify(data)=='{}'){
            _this.setStatus('', '');
          }
          if (_this.state.polling){
            setTimeout(() => {_this.init()}, 15000);
          }
        }
      });
    }
  }

  render(){
    if (this.state.statuses){
      return(
        <div className="row">
          <div className="col-sm-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Background Jobs</h3>
              </div>
              <div className="panel-body no-padding">
                {this.statusList()}
                <div className="text-center mb20">
                  <button className={`btn btn-xs${this.state.polling ? ' btn-info' : ' btn-default'}`}
                    onClick={() => {
                      this.setState({polling: !this.state.polling});this.init();
                    }} >
                    <i className={`fa fa-sync fa-refresh${this.state.polling ? ' fa-spin' : ''}`} /> Auto-refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-9">
            <DelayedJobReactList
              status={this.state.status}
              polling={this.state.polling}
              queue={this.state.queue}
              updateStatusPanel={this.updateStatusPanel}
              />
          </div>
        </div>
      )
    }else {
      return(null);
    }
  }

  statusList(){
    if (Object.keys(this.state.statuses).length==0){
      return(
        <div className="alert alert-info alert-sm" style={{margin: 20}}>
          There are no jobs to list
        </div>
      );
    }else{
      let list = [];
      setStatus = this.setStatus;
      if (this.state.statuses && this.state.statuses.pending){
        list.push(<DelayedJobReactStatusPanel setStatus={setStatus}
          key="status_pending" status="Pending" queues={this.state.statuses.pending} />)
      }
      if (this.state.statuses && this.state.statuses.failed){
        list.push(<DelayedJobReactStatusPanel setStatus={setStatus}
          key="status_failed" status="Failed" queues={this.state.statuses.failed} />)
      }
      return(<ul className="list-group">{list}</ul>);
    }
  }

  setStatus(status, queue){
    this.setState({status: status, queue: queue});
  }

  updateStatusPanel(){
    this.init();
  }
}
