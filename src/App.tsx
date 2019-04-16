
import * as AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import './App.css';

class App extends React.Component {
  private inputRef = null;
  private selectedFile = null;
  public render() {
    return (
      <div className="jumbotron vertical-center">
        <div className="container">
          <img src={process.env.PUBLIC_URL + '/upload-logo.png'} width="72px" height="72px" alt=""/>
          <div className="upload-wrap">
            <button type="button" className="btn btn-info btn-lg margin-bottom-button" onClick={this.buttonGotClicked}>Browse Files</button>
            <input 
              type="file" name="file" className="upload-btn" onChange={this.onChangeHandler}
              ref={this.setRef}
            />
          </div>
          <span className="label label-info" ref={this.setSelectedFile}>Please select files to upload</span>
        </div>
      </div>
    );
  }

  private setRef = (ref: any) => {this.inputRef = ref};
  private setSelectedFile = (ref: any) => {this.selectedFile = ref};

  private buttonGotClicked = (e) => {this.inputRef.click()};

  private onChangeHandler = (e : any) => this.handleChange(e.target.files);

  private handleChange = (files : any) => {
    this.selectedFile.innerText = "Uploading Selected File: " + files[0].name; 
    AWS
      .config
      .update({
        credentials: new AWS.Credentials('AWSAccessKeyId', 'AWSSecretKey'),
        region: 'us-east-1',
      });
    const s3 = new AWS.S3();

    const params = {Bucket: 'kriyeta-dummy', Key: files[0].name, Body: files[0]};
    const options = {partSize: 10 * 1024 * 1024, queueSize: 4};
    s3.upload(params, options, (err, data) => {
      if(err){
        this.selectedFile.innerText = "Failed to upload";
      }
      if(data){
        this.selectedFile.innerText = "Uploaded Successfully";
      }
    });

  }
}

export default App;
