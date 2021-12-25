import React, {Component, Fragment, createRef} from 'react';
export default class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state={status:undefined,statusDesc:undefined};  // to do convert to switch case with a single status
    this.brand=createRef(); // Company Name
    this.agent=createRef(); // Representative or owner
    this.local=createRef(); // Company Address
    this.email=createRef();
    this.phone=createRef();
    this.site=createRef();  // website
  }
  createClient() {
    if(this.brand.current.value == "") this.setState({status:"warning",statusDesc:"Warning! Company Name cannot be empty"}); else {
      this.props.saveClientProfile({
        brand : this.brand.current.value, // Company Name
        agent : this.agent.current.value, // Representative or owner
        local : this.local.current.value, // Company Address
        email : this.email.current.value,
        phone : this.phone.current.value,
        site : this.site.current.value,  // website
        deals : []  // transaction history
      }) ? this.setState({status:"success",statusDesc:"Success!"}) : this.setState({status:"failure",statusDesc:"Failed! Probably duplicate"});
    }
  }
  render() {
    const fullWidth = {width: "100%"};
    const halfWidth = {width: "50%"};
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
      <button style={halfWidth} onClick={this.createClient.bind(this)}>Enter</button>

      <section style={this.state.status == "failure" ? errorbox : this.state.status == "success" ? successbox : this.state.status == "warning" ? warnbox : hidden}>
        {this.state.statusDesc}
        <button onClick={() => {this.setState({status:undefined,statusDesc:undefined})}}>X</button>
      </section>

      <input style={fullWidth} type="text" placeholder="Company" ref={this.brand} />
      <input style={fullWidth} type="text" placeholder="Owner/Agent" ref={this.agent} />
      <input style={fullWidth} type="text" placeholder="Address" ref={this.local} />
      <input style={fullWidth} type="text" placeholder="Email" ref={this.email} />
      <input style={fullWidth} type="text" placeholder="Website" ref={this.site} />
      <input style={fullWidth} type="text" placeholder="Phone" ref={this.phone} />
    </>
    )
  }
}
