import React from 'react';
import {

    Row, Col,
} from 'reactstrap'; 

import {
    Memberslist
} from 'components';
import axios from 'axios';
import { members } from 'variables/general/members.jsx';
//import { members } from 'variables/general/members.php';

class Members extends React.Component{
       state = {
        loading: true,
        person: null,
        contacts: null,
        name: "",
        posted: ""
      }; 
    async componentDidMount() {
        const url = "https://api.randomuser.me/";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results[0]);
        this.setState({ person: data.results[0], loading: false });

        const aurl = 'http://localhost/test/rest-api.php'
        axios.get(aurl).then(response => response.data)
        .then((data) => {
          this.setState({ contacts: data })
          console.log(this.state.contacts)
         })


      }

    handleFormSubmit( event ) {
        event.preventDefault();
        console.log(this.state);

        let formData = new FormData();
        formData.append('name', this.state.name)
        axios({
                    method: 'post',
                    url: 'http://localhost/test/rest-api-post.php',
                    data: formData,
                    config: { headers: {'Content-Type': 'multipart/form-data' }}
                })
                .then((response) => {
                    //handle success
                    console.log(response.data);
                    this.setState({ posted: response.data });
                })
                .catch(function (response) {
                    //handle error
                    console.log(response)
                });
    }

    render(){
        
        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                    <div className="page-title">
                        <div className="float-left">
                            <h1 className="title">Members</h1>
                        </div>
                    </div>


                            
           

                    <div className="col-xl-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Site Members</h2>
                            </header>
                            <div className="content-body">    


                            <div className="row">
                                    <div className="col-12">

                                    {!this.state.contacts ? (<div>loading...</div>) : (

                                        <div>
                                            <div>{this.state.contacts}</div>
                                            <div>{this.state.posted}</div>
                                        
                                    </div>) } 


                                    {
                                        this.state.loading || !this.state.person ? ("<div>loading...</div>") : (

                                        <div>
                                            <div>{this.state.person.name.title}</div>
                                            <div>{this.state.person.name.first}</div>
                                            <div>{this.state.person.name.last}</div>
                                            <img src={this.state.person.picture.large} alt="userpic" />
                                        
                                    </div>) } 

                                <form>
                                            <label>Name</label>
                                            <input type="text" name="name" value={this.state.name}
                                                onChange={e => this.setState({ name: e.target.value })} />
                                            <input type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
                                </form>

                                <Memberslist members={members} />

                                    </div>
                                </div>
                            </div>
                        </section></div>



           
                                
                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default Members;
