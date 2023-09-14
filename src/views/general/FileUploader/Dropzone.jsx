import React from 'react';
import {
   Row, Col, 
} from 'reactstrap';

import {} from 'components';

import Dropzone from 'react-dropzone';
import axios from 'axios';

class FileDropzone extends React.Component{

    constructor() {
        super()

        this.state = { 
            files: [], 
            files1: [],
            disabled1: true ,
            ret: []
        }
      }

      onDrop(files) {
        this.setState({
          files,
        });


            var myfiles = [];

          const uploaders = files.map(file => {
              //i++;
              // Initial FormData
              console.log(file.name);
              const formData = new FormData();
              formData.append("file", file);
              formData.append("timestamp", (Date.now() / 1000) | 0);

              return axios.post("http://192.168.29.88/test/rest-api-post-receive-reactjs.php", 
                formData, {}).then(response => {
                const data = response.data;
                console.log(data);
                return data;
              })
            });

            // Once all the files are uploaded 
            /*axios.all(uploaders).then(() => {
              console.log(uploaders);
            });*/
            axios.all(uploaders)
                .then(axios.spread((...args) => {
                    for (let i = 0; i < args.length; i++) {
                      //console.log(i+": "+args[i]);
                      myfiles.push(args[i]);
                        //myObject[i] = args[i].data;
                    
                      this.setState({
                        ret: this.state.ret.concat(args[i])
                      })
                    }
                    console.log(myfiles);
                    console.log(this.state.ret);

                    //this.setState({ret: myfiles})
                }))
                .then(
                  );



      }   

      onDrop1(files1) {
        this.setState({
          files1
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
                            <h1 className="title">Dropzone</h1>
                        </div>
                    </div>


                    <div className="col-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Dropzone</h2>
                                
                            </header>
                            <div className="content-body">
                                <div className="row">
                                    <div className="col-lg-12">
                            
                            
        <h5>Basic</h5>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)} className="droparea" multiple={true} accept="image/*">
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h5>Dropped files</h5>
          <ul>
            {
              this.state.ret.map((f, i) => <li key={i}><img src={f} alt="dropped file"/></li>)
            }
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>


        <br/><br/>

        <h5>With disabled property</h5>

        <aside>
          <button type="button" onClick={() => this.setState({ disabled1: !this.state.disabled1 })} className="btn">Toggle disabled</button>
        </aside>
        <br/>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop1.bind(this)} disabled={this.state.disabled1} className="droparea">
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h5>Dropped files</h5>
          <ul>
            {
              this.state.files1.map(f => <li>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>




                                    </div>
                                </div>


                            </div>
                        </section>
                    </div>
                                
                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default FileDropzone;
