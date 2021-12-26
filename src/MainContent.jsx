import React, {Component, Fragment, createRef} from 'react';
import ClientProfile from './ClientProfile';
import Invoice from './Invoice';
import ListInvoices from'./ListInvoices';
import PrintButton from './PrintButton';
export default class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: undefined,  // new client, deals history, new deal
      current: undefined   // client currently working on
    }
  }
  saveProfile(profile) {
//    console.debug("Saving new profile: " + JSON.stringify(profile));
    function alphanum(c) {
      return String(c).replace(/[^A-Za-z0-9]/g,"").toUpperCase()
    }
    var success = alphanum(profile.brand) != "" && (this.props.clients.length == 0 || this.props.clients.find(function(c){
      return alphanum(c.brand) == alphanum(profile.brand);
    }) == undefined);
    if(success) {
      this.props.updateClientList(this.props.clients.concat([{ ...profile, deals: []}]));
      this.setState((state,props)=>({current: state.current+1}));
    }
    return success;
  }
  updateDeals(deal) {
//    console.debug("Saving new invoice: " + JSON.stringify(deal));
    var clientProfile = this.props.clients;
    clientProfile[this.state.current].deals.unshift(deal);
    this.props.updateClientList(clientProfile);
    return true;
  }
  removeDeal(idx) {
//    console.debug("Removing old invoice: " + JSON.stringify(this.props.clients[this.state.current].deals[idx]));
    var clientProfile = this.props.clients;
    var allDeals = clientProfile[this.state.current].deals;
    clientProfile[this.state.current].deals = allDeals.slice(0,idx).concat(allDeals.slice(idx+1));
    this.props.updateClientList(clientProfile);
  }
  removeClient(idx) {
//    console.debug("Removing client profile: " + JSON.stringify(this.props.clients[idx].brand));
    var oldList = this.props.clients;
    var cleanList = oldList.slice(0,idx).concat(oldList.slice(idx+1));
    this.props.updateClientList(cleanList);
  }
  render() {
    const fullWidth = {width: "100%"},
          halfWidth = {width: "50%"},
          cross = "\u274C";
    return (
    <>
      {(this.state.content || this.state.current>-1) && (<button style={halfWidth} onClick={()=>this.setState({current:undefined,content:undefined})}>Back</button>)}
      
      
      
      {!this.state.content && !(this.state.current>-1) && (
      <>
      <input style={fullWidth} type="text" placeholder="Search" />
      <button style={fullWidth} onClick={()=>this.setState({
        current:this.props.clients.length,
        content:"profile"
      })} >New Client</button>
      </>
      )}
      {!this.state.content && this.props.clients.length == 0 && "No client found"}
      {!this.state.content && !this.state.current && this.props.clients.map((c,idx)=>(
      <Fragment key={"list-clients" + idx}>
        <button style={{width: "calc(100% - 5em)"}} onClick={()=>this.setState({
          current:idx,content:"invoice"
        })}>{c.brand}</button>
        <button style={{width: "2.5em"}} onClick={()=>this.setState({
          current:idx,content:"report"
        })}>&Xi;</button>
        <button style={{width: "2.5em"}} onClick={this.removeClient.bind(this,idx)}>{cross}</button>
      </Fragment>
      ))}
      
      
      
      {this.state.content == "profile" && (<ClientProfile saveClientProfile={this.saveProfile.bind(this)} />)}
      
      
      
      {this.state.content == "invoice" && (<Invoice client={this.props.clients[this.state.current]} saveInvoice={this.updateDeals.bind(this)} />)}
      
      
      
      {this.state.content == "report" && this.props.clients[this.state.current].deals.length == 0 && (<p>No transaction report found</p>)}
      {this.state.content == "report" && this.props.clients[this.state.current].deals.length > 0 && this.props.clients[this.state.current].deals.map((c,idx)=>(
      <Fragment key={"invoice-" + c.brand + idx}>
      <label style={{width: "calc(100% - 5em)"}}>Date: {c.date}</label>
      <PrintButton style={{width: "2.5em"}} 
          date={c.date} tax={c.tax} currency={c.currency} services={c.sold} subtotal={c.subtotal}
          brand={this.props.clients[this.state.current].brand}
          agent={this.props.clients[this.state.current].agent}
          local={this.props.clients[this.state.current].local}
          email={this.props.clients[this.state.current].email}
          phone={this.props.clients[this.state.current].phone}
          cyber={this.props.clients[this.state.current].cyber} />
      <button style={{width: "2.5em"}} onClick={this.removeDeal.bind(this,idx)}>{cross}</button>
      <ListInvoices prefix={"invoice-" + c.brand + idx} services={c.sold} />
      </Fragment>
      ))}
    </>
    )
  }
}

