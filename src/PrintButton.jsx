import React, { Component } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import TemplateDocument from './TemplateDocument';
export default class ListInvoices extends Component {
  render() {
    return (
    <>
      <BlobProvider 
        document = {
        <TemplateDocument 
          company = {this.props.brand} 
          agent = {this.props.agent} 
          address = {this.props.local} 
          phone = {this.props.phone} 
          date = {this.props.date} 
          subtotal = {this.props.subtotal} 
          tax = {this.props.tax} 
          invoice = {this.props.services} 
          currency = {this.props.currency} 
        />}
        >
		    {
		      ({blob,url,loading,error}) => loading ? 'loading' : (
		        <button onClick={() => window.open(url)} style={this.props.style}>&#9998;</button>
		      )
		    }
		  </BlobProvider>
    </>
    )
  }
}
