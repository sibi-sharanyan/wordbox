import React, { Component } from 'react'
import Cookies from 'js-cookie';
import backend from "./backapi";
import Button from "@material-ui/core/Button";
import moment from "moment";
export default class Inbox extends Component {

  state = {
    isLoading: true,
    myInbox: false,
    name: "" , 
    msg: "",
    msgs: []
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
    this.setState({msgs: res.data , myInbox: true });
    console.log(res);
    this.setState({isLoading: false});
  }).catch((err) => console.log(err))
  return;
}

    backend.get('/getname/' + myLink).then((result) => {
      this.setState({name: result.data.name , isLoading: false, link: myLink});
    }).catch((err) => console.log(err));



  }


  sendmsg = () => {
    backend.post('/sendmsg' , {
      msg: this.state.msg , 
      link: this.state.link
    }).then((res) => {
      alert("Your message has been posted!");
    }).catch((err) => {
      console.log("An error Occured");
    })
  }



  render() {

    if(this.state.isLoading == true) {
      return (
        <div>
          <h1>Loading........</h1>
        </div>
      )
    }


else if(this.state.myInbox == false) 
{
  return (
    <div className = "p-5 d-flex justify-content-center align-items- flex-column ">
      <h1>Send an anonymous Message to {this.state.name}</h1>
      <div class="form-group">

    <textarea value = {this.state.msg} onChange = {(e) => this.setState({msg: e.target.value})} class="form-control p-3 m-3 w-50"  rows="7"></textarea>
  </div>

  <Button
              variant="contained"
              color="primary"
              className = "mt-4 w-25"
              onClick = {this.sendmsg}
            >
              Send
            </Button>
    </div>
  )
} else {
  if(this.state.msgs.length == 0 ) 
  {
    return (
      <h1>You Don't have any messages yet , try sharing this link with your friends!</h1>
    )
  } else {

    var myList = this.state.msgs.map((msg) => {
     let timestamp = msg._id.toString().substring(0,8);
     let date = new Date( parseInt( timestamp, 16 ) * 1000 )
     console.log(date);
      return (  <div  key={msg._id}>
        {msg.msg}
        <br/>
        {moment(date).format('MMMM Do YYYY, h:mm:ss a')}
      </div> );
    } );

    console.log(myList);
    
  return ( myList  );
  }
}

  }
}
