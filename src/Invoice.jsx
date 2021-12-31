import React, {Component, Fragment, createRef} from 'react';
export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: undefined,
      statusDesc: undefined,
      invoice: [], // Cart for new invoice
      subtotal: 0
    }
    /* Ref for invoice */
    this.desc = createRef();  // Service decsription
    this.cost = createRef();  // Service Price
    this.date = createRef();  // Date of current invoice
    this.tax = createRef();   // Tax & VAT
    this.sym = createRef();   // Currency name/symbol
  }
  addToInvoice() {
    const alphanum = /[^0-9a-z]/ig;
    var _desc = this.desc.current.value,
        _cost = this.cost.current.value;
    if(_desc == "") return this.setState({status:"error",statusDesc:"Empty service description"});
    if(_cost == "") return this.setState({status:"error",statusDesc:"Empty or non-numeric service price"});
    if(this.state.invoice.length && this.state.invoice.find(c => c.desc.replace(alphanum, "").toUpperCase() == _desc.replace(alphanum, "").toUpperCase()) != undefined) return this.setState({status:"failure",statusDesc:"Possibly duplicate service description"});
    var newService = {
      desc: _desc,
      cost: _cost
    };
    return this.setState((state,props) => ({
      status:undefined,statusDesc:undefined,subtotal:state.subtotal + Number(_cost),
      invoice: state.invoice.concat( [newService] )
    }));
  }
  removeService(idx) {
    this.setState((state,props)=>({
      subtotal: state.invoice.length == 1 ? 0 : state.subtotal - Number(state.invoice[idx].cost),
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
    if(current == 0) return false;
    const prev = current - 1;
    this.swapInArray(prev,current);
  }
  pullDown(current) {
    if(current + 1 == this.state.invoice.length) return false;
    const next = current + 1;
    this.swapInArray(current,next);
  }
  finalize() {
    var date = this.date.current.value,
        tax = this.tax.current.value,
        sym = this.sym.current.value;
    if(tax == "") return this.setState({status:"error",statusDesc:"Empty or non-numeric tax"});
    if(sym == "") return this.setState({status:"error",statusDesc:"Empty billing currency"});
    if(this.state.invoice.length == 0) return this.setState({status:"failure",statusDesc:"Empty Cart"});
    
    this.setState({status:undefined,statusDesc:undefined});
    this.props.saveInvoice({
      date: date == "" ? new Date().toISOString().slice(0,10) : date,
      tax: tax, currency: sym, subtotal: this.state.subtotal,
      sold: this.state.invoice
    }) ? this.setState({status:"success",statusDesc:"Invoice Added!"}) : this.setState({status:"error",statusDesc:"Failed!"});
      
  }
  componentDidMount() {
    if(this.state.invoice.length == 0 && this.props.client.deals.length > 0) {
      var prevDeal = this.props.client.deals[0];
      return this.setState({invoice:prevDeal.sold,subtotal:prevDeal.subtotal});
    }
  }
  render() {
    const halfWidth = {width: "50%"},
      quartWidth = {width: "25%"},
      flexbox = {display: "flex"},
      thirdQuart = {width: "75%"},
      cross = "\u274C",
//      Cross = "\u2A2F",
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
    
    
    <input type="text" placeholder="Currency" ref={this.sym} style={quartWidth} />
    <input type="number" placeholder="Tax" ref={this.tax} style={quartWidth} />
    <label style={thirdQuart}>Sub Total: {this.state.subtotal}</label>
    
    <p>Invoice no: {Array.isArray(this.props.client.deals) && this.props.client.deals.length}</p>
    <p>Company: {this.props.client.brand}</p>
    <p>Owner/agent: {this.props.client.agent}</p>
    
    <input type="text" placeholder="Description" ref={this.desc} style={halfWidth} />
    <input type="number" placeholder="Price" ref={this.cost} style={quartWidth} />
    <button onClick={this.addToInvoice.bind(this)} style={quartWidth} >Add</button>
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
