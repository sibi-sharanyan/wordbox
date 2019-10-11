import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect 
} from "react-router-dom";

import backend from "./backapi";

export default class GenLink extends Component {
  state = {
    name: "",
    isLinkGenerated: false , 
    isLoading: false , 
    link: ""
  };



  componentDidMount() {
    var link = Cookies.get('myuserid');
    if(link != undefined) 
    {
      this.setState({isLinkGenerated: true , link });
    }
  }

  generateLink = () => {
 
    if(this.state.name === "") {
      alert("Name Cannot be Empty!");
      return;
    }

    this.setState({isLoading: true});
    
    backend.post("/generateLink" , {
      name: this.state.name
    }).then((res) => {

 
      Cookies.set('myuserid' , res.data.link);
      this.setState({isLinkGenerated: true , isLoading: false , link: res.data.link});
    }).catch((err) => console.log(err))
  }


 
  render() {
    if(this.state.isLinkGenerated === false) {
      return (
        <div className = "g-100 d-flex justify-content-center">
          <div className="d-flex justify-content-center align-items-center flex-column p-5">
            <Typography variant="h6" align="center">
              
              Enter Your name to generate a link!
            </Typography>
  
            <TextField
              id="standard-dense"
              label="Enter Name"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              margin="dense"
            />
  
            <Button
              variant="contained"
              color="primary"
              className = "mt-4"
              onClick = {this.generateLink}
            >
              Create Link
            </Button>
       
         {this.state.isLoading ?    <div className = "p-5 m-5">   <CircularProgress  />  </div>    : "" }  

          </div>
        </div>
      );
    }else {
      return (

        <Redirect to={`/${this.state.link}`}/>

       
     )
    }
  }
}