import React, { Component } from "react";
import "./App.css";
import Upload from "./upload/Upload";
import socketIOClient from "socket.io-client";

var socket;

class App extends Component {
  constructor() {
    super();
    socket =  socketIOClient('http://ec2-13-239-31-173.ap-southeast-2.compute.amazonaws.com:3001');
    this.state = {
      socket,
      buttonLabel:"Upload",
      output:""
    };

    this.onDataRecive = this.onDataRecive.bind(this);
    
    
  }

  componentDidMount(){
    this.state.socket.on('frames', this.onDataRecive);
  }

  
  onDataRecive = (data) => {
    console.log(data);
    console.log("Setting output state");
    this.setState({
      output: this.state.output+data
    })
    if(data.includes("****CAME TO END***")){
      this.setState({
        buttonLabel:"Done"
      })
    }
  }

  onUploadComplete = () => {
    console.log("On Upload complete");
    this.state.socket.emit("process");
    this.setState({
      buttonLabel:"Processing"
    });
  }

  render() {
    return (
      <div className="App">
        <div className="Card">
          <Upload onUploadComplete={() => this.onUploadComplete()} buttonLabel={this.state.buttonLabel}
          />
        </div>
        <div className="Card2">
          <h6>Processed Analytics / Object Detection Count</h6>
          
            <div className="messageOutput">
              {this.state.output}
            </div>
          
        </div>
      </div>
    );
  }
}

export default App;
