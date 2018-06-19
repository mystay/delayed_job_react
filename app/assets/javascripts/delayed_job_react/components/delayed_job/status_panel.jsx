class DelayedJobReactStatusPanel extends React.Component{

  constructor(){
    super();
    this.state = {
      totalCount: 0,
      previousProps: null
    }
    this.queueList = this.queueList.bind(this);
  }

  componentDidMount(){
    this.init();
  }

  componentDidUpdate(){
    this.init();
  }

  init(){
    if (this.state.previousProps != JSON.stringify(this.props)){
      let total = 0;
      let props = this.props
      if (props.queues){
        Object.keys(props.queues).map(function(key, index){
          total += props.queues[key]
        });
        this.setState({totalCount: total});
      }
      this.setState({previousProps: JSON.stringify(this.props)});
    }
  }

  render(){

    return(
      <li className="list-group-item">
        <h3>
          <div className="pull-right">
            {this.state.totalCount}
          </div>
          <a href="#" onClick={() => {this.props.setStatus(this.props.status)}}>
            {this.props.status}
          </a>
        </h3>
        {this.queueList()}
      </li>
    )
  }

  queueList(){
    let queues = this.props.queues;
    let list = [];
    let props = this.props;
    Object.keys(queues).map(function(key, index){
      list.push(
        <li key={key}
          onClick={() => {props.setStatus(props.status, key)}}
          style={{cursor: 'pointer'}}
          >
          <span className="label label-default">{key}</span> x {queues[key]}
        </li>
      )
    });
    return(<ul className="list-unstyled mb20">{list}</ul>);
  }
}
