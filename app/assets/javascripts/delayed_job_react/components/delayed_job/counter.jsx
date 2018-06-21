class DelayedJobReactCounter extends React.Component{
  constructor(){
    super();
    this.state = {
      loading: false,
      total: 0,
      failed: 0,
      connected: false
    };
    this.connect = this.connect.bind(this);
  }

  componentDidMount(){
    this.connect();
  }

  init(){
    if (!this.state.loading){
      let _this=this;
      this.setState({loading: true});
      $.ajax({
        type: 'GET',
        url: '/delayed_job/jobs.json',
        success: function(data){
          _this.setState({total: data.counts.total, failed: data.counts.failed, loading: false});
        }
      });
    }
  }

  render(){
    let total = this.state.total;
    if (total>9){total = '9+'}
    let iconClass = 'fa fa-lg';
    if (this.state.connected){
      iconClass += ' text-success'
    }else{
      iconClass += ' text-warning'
    }
    if (this.state.failed>0){
      iconClass += ' fa-exclamation-triangle text-warning';
    }else{
      iconClass += ' fa-sync';
      if (total>0){
        iconClass += ' fa-spin';
      }
    }
    return(
      <ul className="nav navbar-top-links navbar-right">
        <li>
          <a href={this.props.href ? this.props.href : '#'} className="count-info">
            <i className={iconClass} />
            <span className={`label label-${total>0 ? 'danger' : 'default'}`}>{total}</span>
          </a>
        </li>
      </ul>
    );
  }

  connect(){
    let _this=this;
    App.cable.subscriptions.create("DelayedJobReact::JobChannel", {
      connected: function() {
        _this.init();
        _this.setState({connected: true});
      },
      disconnected: function() {
        _this.setState({connected: false});
      },
      received: function(data) {
        _this.setState({total: data.total, failed: data.failed});
      }
    });
  }

}
