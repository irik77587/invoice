import React, {Component, Fragment, createRef} from 'react';
import MainContent from './MainContent';
const reader = new FileReader();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "main",
      widescreen : window.matchMedia("(min-width: 820px)").matches,
      clients: Object.entries(JSON.parse(JSON.stringify(localStorage))).map(c => JSON.parse(c[1])) || [],  // List of Clients already created
    }
    this.file = createRef();
  }
  updateClientList(clientList) {
    this.setState({clients:clientList});
  }
  restore() {
    reader.readAsText(this.file.current.files[0]);
    const __self = this;
    reader.onload = function(event) {
      const backup = JSON.parse(event.target.result);
      if(Array.isArray(backup)) __self.setState({clients: backup});
      console.debug(Array.isArray(backup));
      console.debug(__self.state.clients)
    }
  }
  componentDidUpdate() {
    if(this.state.clients.length > 0) {
      if(this.state.clients.length < localStorage.length) {
        var extras = localStorage.length - this.state.clients.length;
        for(let i = 0; i < extras; i++) {
          localStorage.removeItem(this.state.clients.length + i);
        }
      }
      this.state.clients.map((c,idx)=>{
        var s = JSON.stringify(c);
        if(s !== localStorage.getItem(idx)) localStorage.setItem(idx,s);
      })
    }
  }
  componentDidMount() {
    window.matchMedia("(min-width: 820px)").addEventListener('change', e => this.setState({
      widescreen : e.matches
    }))
  }
  render(){
    const fullWidth = {width: "100%"};
    const halfWidth = {width: "50%"};
    const flexbox = {display: "flex"};
	  return (
	    <>
	      {this.state.widescreen && (
	      <div style={flexbox}>
		      <div style={{width: "25vw",height: "100vh"}}>
	          <button onClick={()=>this.setState({content:"restore"})} style={fullWidth}>Restore</button>
            <button onClick={()=>this.setState({content:"backup"})} style={fullWidth}>Backup</button>
		      </div>
		      <div style={{width: "75vw",height: "100vh",paddingInline: "12.5vw"}}>
		        {this.state.content == "main" && (<MainContent clients={this.state.clients} updateClientList={this.updateClientList.bind(this)}/>)}
            {this.state.content != "main" && (
              <button onClick={()=>this.setState({content:"main"})} style={halfWidth}>Back</button>
            )}
            
            
            {this.state.content == "backup" && (
            <>
            <br/>
            <a href={URL.createObjectURL(new Blob([JSON.stringify(this.state.clients)],{type: "application/json"}))} 
            download={`Project_Manager_${new Date().toUTCString()}_Backup.json`}>Download</a>
            </>
            )}
            
            {this.state.content == "restore" && (
            <>
            <br/>
            <input type="file" accept="application/json" ref={this.file} />
            <button onClick={this.restore.bind(this)}>Submit</button>
            </>
            )}
            
            
		      </div>
		    </div>)}
		    
		    
		    
		    {!this.state.widescreen && (
		    <>
          {this.state.content == "main" && (
          <>
	          <button onClick={()=>this.setState({content:"restore"})} style={halfWidth}>Restore</button>
            <button onClick={()=>this.setState({content:"backup"})}style={halfWidth}>Backup</button>
            <MainContent clients={this.state.clients} updateClientList={this.updateClientList.bind(this)}/>
          </>
          )}
          {this.state.content != "main" && (
            <button onClick={()=>this.setState({content:"main"})} style={halfWidth}>Back</button>
          )}
          
          
          {this.state.content == "backup" && (
          <a href={URL.createObjectURL(new Blob([JSON.stringify(this.state.clients)],{type: "application/json"}))} 
          download={`Project_Manager_${new Date().toUTCString()}_Backup.json`}>Download</a>
          )}
          
          
          {this.state.content == "restore" && (
          <>
          <br/>
          <input type="file" accept="application/json" ref={this.file} />
          <button onClick={this.restore.bind(this)}>Submit</button>
          </>
          )}
          
          
        </>
		    )}
		  </>
	  );
  }
}


