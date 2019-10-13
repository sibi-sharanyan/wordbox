import React, { Component } from 'react'
import Cookies from 'js-cookie';
import backend from "./backapi";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LinearProgress from '@material-ui/core/LinearProgress';



export default class Inbox extends Component {

  state = {
    isLoading: true,
    myInbox: false,
    name: "" , 
    msg: "",
    msgs: [],
    msgSent: false
  }

  constructor() {
    super();
    // console.log(this.props.match.params.userid);
  }

  componentDidMount() {

    let myLink = this.props.match.params.userid;

if(Cookies.get('myuserid') == myLink )
{
  backend.get('/msgs/' + myLink).then((res) => {
    this.setState({msgs: res.data , myInbox: true , link: myLink , isLoading: false});
    
  }).catch((err) => console.log(err))
  return;
}

    backend.get('/getname/' + myLink).then((result) => {
      this.setState({name: result.data.name , isLoading: false, link: myLink});
    }).catch((err) => console.log(err));



  }


  sendmsg = () => {
    this.setState({isLoading: true})
    backend.post('/sendmsg' , {
      msg: this.state.msg , 
      link: this.state.link
    }).then((res) => {
      this.setState({msgSent: true , isLoading: false});
    }).catch((err) => {
      console.log("An error Occured");
    })
  }



  render() {

    if(this.state.isLoading == true) {
      return (
        <div>
               <LinearProgress color="secondary" />

        </div>
      )
    }


else if(this.state.myInbox == false) 
{
  if(this.state.msgSent == false) 
  {
    return (

    
      <div className = "container p-5 d-flex justify-content-center align-items- flex-column ">
        <Typography variant="h5" component="h3">Send an Anonymous Message to  <Typography variant="h4" component="h3">  {this.state.name} </Typography></Typography>
        <div class="form-group">
  
      <textarea value = {this.state.msg} onChange = {(e) => this.setState({msg: e.target.value})} class="form-control p-3 mt-3 w-75"  rows="7"></textarea>
    </div>
  
    <Button
                variant="contained"
                color="primary"
                className = "mt-4 w-75 "
                onClick = {this.sendmsg}
              >
                Send
              </Button>

              <img class="img-fluid mt-5" src="msg.svg" alt=""/>
      </div>
    )
  }else {
    return ( <div className="container p-5">
      <h1>Message Sent!</h1>
      <Typography className = "bigtext" variant="h2" component="h1"> Create Your own inbox now and share it with Your friends! <br/>  </Typography>

      <a className = "mt-2 smalltext" href={`https://wordbox.netlify.com/`}>{`https://wordbox.netlify.com/`}</a>
      <img class="img-fluid mt-5" src="sent.svg" alt=""/>
      
    </div> )
  }
} else {
  if(this.state.msgs.length == 0 ) 
  {
    return (
      <div className = "container p-5">
  <Typography variant="h5" component="h3">You Don't have any messages yet , try sharing this link with your friends and ask them to write something about you! <br/> <a className = "mt-2" href={`https://wordbox.netlify.com/${this.state.link}`}>{`https://wordbox.netlify.com/${this.state.link}`}</a> </Typography>

<img class="img-fluid mt-5" src="empty.svg" alt=""/>
      </div>

    
    )
  } else {

    var myList = this.state.msgs.map((msg) => {
     let timestamp = msg._id.toString().substring(0,8);
     let date = new Date( parseInt( timestamp, 16 ) * 1000 )
     console.log(date);
      return (  <Paper className = "p-5 m-5"  key={msg._id}>

<Typography className="mb-2" variant="h5" component="h3">
{msg.msg}
        </Typography>
        
        <div className ="mt-5 verysmalltext " component="p">
        {moment(date).format('MMMM Do YYYY, h:mm:ss a')}
        </div>       
      </Paper > );
    } );

    console.log(myList);
    
  return (
    
    <div className = "container p-5">
      <Typography variant="h4" component="h1">The  Words You've got From Your friends so far are as follows!</Typography>
    
      {   myList }

      <Typography variant="h5" component="h1"> Want more? Share This Link with your friends and ask them to write about you! <a href={`https://wordbox.netlify.com/${this.state.link}`}>{`https://wordbox.netlify.com/${this.state.link}`}</a>  </Typography>
   


      
    </div>
   );
  }
}

  }
}
