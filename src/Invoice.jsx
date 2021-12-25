import React, {Component, Fragment, createRef} from 'react';
export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: undefined,
      statusDesc: undefined,
      invoice: [] // Cart for new invoice
    }
    /* Ref for invoice */
    this.desc = React.createRef();  // Service decsription
    this.cost = React.createRef();  // Service Price
    this.date = React.createRef();  // Date of current invoice
  }
  addToInvoice() {
    var desc = this.desc.current.value;
    var cost = this.cost.current.value;
    if(desc == "") return this.setState({status:"error",statusDesc:"Empty service Description"});
    if(cost == "") return this.setState({status:"error",statusDesc:"Empty or non-numeric service price"});
    if(this.state.invoice.find(c => String(c.desc).replaceAll(/[^A-Z0-9a-z]/g, "").toUpperCase() == String(desc).replaceAll(/[^A-Z0-9a-z]/g, "").toUpperCase())) return this.setState({status:"failure",statusDesc:"Possibly duplicate service description"});
    var newService = {
      desc: desc,
      cost: cost
    };
    this.setState((state,props) => ({
      status:undefined,statusDesc:undefined,
      invoice: [ ...state.invoice, newService]
    }));
  }
  removeService(idx) {
    this.setState((state,props)=>({
      invoice: [ ...state.invoice.slice(0,idx), ...state.invoice.slice(idx+1)]
    }));
  }
  swapInArray(a,b) {
    this.setState((state,props)=>{
      var temp1 = state.invoice[a],
          temp2 = state.invoice[b];
      state.invoice[a] = temp2;
      state.invoice[b] = temp1;
      return {invoice: state.invoice}
    });
  }
  pushUp(current) {
    if(current==0) return false;
    const prev = current - 1;
    this.swapInArray(prev,current);
  }
  pullDown(idx) {
    if(idx+1==this.state.invoice.length) return false;
    const next = current + 1;
    this.swapInArray(current,next);
  }
  finalize() {
    var date = this.date.current.value;
    if(this.state.invoice.length == 0) this.setState({status:"failure",statusDesc:"Empty Cart"}); else {
      this.setState({status:undefined,statusDesc:undefined});
      this.props.saveInvoice({
        date: date == "" ? new Date().toISOString().slice(0,10) : date,
        sold: this.state.invoice
      });
    }
  }
  componentDidMount() {
    if(this.state.invoice.length == 0 && this.props.client.deals.length > 0) {
      var prevDeal = this.props.client.deals[0];
      this.setState({invoice:prevDeal.sold});
    }
  }
  render() {
    const halfWidth = {width: "50%"},
      quartWidth = {width: "25%"},
      flexbox = {display: "flex"},
      thirdQuart = {width: "75%"},
      cross = "\u274C",
      Cross = "\u2A2F",
      xutri = "\u25B3",
      xdtri = "\u25BD";
    const hidden = {display: "none"};
    const errorbox = {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "red",
      color: "white",
      fontWeight: "bold",
      paddingInline: "1rem"
    };
    const successbox = {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "green",
      color: "white",
      fontWeight: "bold",
      paddingInline: "1rem"
    };
    const warnbox = {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "yellow",
      color: "black",
      fontWeight: "bold",
      paddingInline: "1rem"
    };
    return (
    <>
    <button style={halfWidth} onClick={this.finalize.bind(this)}>Enter</button>
    
    <section style={this.state.status == "error" ? errorbox : this.state.status == "success" ? successbox : this.state.status == "failure" ? warnbox : hidden}>
      {this.state.statusDesc}
      <button onClick={() => {this.setState({status:undefined,statusDesc:undefined})}}>X</button>
    </section>
    
    <label style={thirdQuart}>Invoice Date:</label>
    <input type="date" placeholder="Invoice date" style={quartWidth} ref={this.date} defaultValue={new Date().toISOString().slice(0,10)} />
    <p>Invoice no: {Array.isArray(this.props.client.deals) && this.props.client.deals.length}</p>
    <p>Company: {this.props.client.brand}</p>
    <p>Owner/agent: {this.props.client.agent}</p>
    
    <input type="text" placeholder="Description" ref={this.desc} style={halfWidth} />
    <input type="number" placeholder="Price" ref={this.cost} style={quartWidth} />
    <button onClick={this.addToInvoice.bind(this)} style={quartWidth} >Add to invoice</button>
    {this.state.invoice.map((s,idx) => (
      <Fragment key={"cart-product-" + idx}>
        <section style={flexbox}>
          <button onClick={this.removeService.bind(this,idx)}>{cross}</button>
          <button onClick={this.pushUp.bind(this,idx)}>{xutri}</button>
          <button onClick={this.pullDown.bind(this,idx)}>{xdtri}</button>
          <span style={{marginInlineEnd: "auto",paddingInlineStart:"1em"}}>
            {s.desc}
          </span>
          {s.cost}
        </section>
      </Fragment>
    ))}
    </>
    )
  }
}
