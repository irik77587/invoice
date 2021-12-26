import React, {Component,createRef} from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import TemplateDocument from './TemplateDocument';
export default class ListInvoices extends Component {
  constructor(props) {
    super(props);
    //this.link = createRef();
  }
//  manageProps() {
//    console.log("Company: " + this.props.brand);
//    console.log("Representative: " + this.props.agent);
//    console.log("Address: " + this.props.local);
//    console.log("Email: " + this.props.email);
//    console.log("Phone: " + this.props.phone);
//    console.log("Website: " + this.props.cyber);
//    console.log("Invoice Date: " + this.props.date);
//    console.log("Tax: " + this.props.tax);
//    console.log("Invoice Currency: " + this.props.currency);
//    console.log("Subtotal without Tax: " + this.props.subtotal);
//    console.log("Indoice details: " + JSON.stringify(this.props.services));
//    //this.link.current.click();
//  }
  render() {
    return (
    <>
      <PDFDownloadLink fileName="invoice.pdf" document = {<TemplateDocument company = {this.props.brand} agent = {this.props.agent} address = {this.props.local} phone = {this.props.phone} date = {this.props.date} subtotal = {this.props.subtotal} tax = {this.props.tax} invoice = {this.props.services} currency = {this.props.currency} />}>
		    {({blob,url,loading,error})=>
		      loading ? 'loading' : (<button style={this.props.style}>&#9998;</button>)
		    }
		  </PDFDownloadLink>
    </>
    )
  }
}
