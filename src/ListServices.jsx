import React, {Component, Fragment} from 'react';
export default class ListServices extends Component {
  render() {
    return (
    <>
    {this.props.services.map((c,idx)=>(
    <Fragment key={this.props.prefix + "-" + idx}>
      <section style={{justifyContent: "space-between",display: "flex"}}>
        <label>{c.desc}</label>
        <label>{c.cost}</label>
      </section>
    </Fragment>
    ))}
    <hr/>
    </>
    )
  }
}
