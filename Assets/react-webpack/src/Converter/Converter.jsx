import React from 'react';

const csv=require('csvtojson');
const Json2csvParser = require('json2csv').Parser
const download=require("downloadjs");

export default React.createClass({
    getInitialState: function() {
      return {
        fileText: null,
        fileJson: [],
        fileError: false,
        isProcessing: false,
        octopartFile: null
      };
    },
    handleDownloadClick: function(e) {

      e.preventDefault();

      download(this.state.octopartFile, 'inventory-octopart.csv', 'text/csv');

    },
    buildOctopartFile: function() {

      var self = this,
        fields = [
          {
            label: 'mpn',
            value: 'item_no'
          },{
            label: 'sku',
            value: 'item_no'
          },{
            label: 'manufacturer',
            value: function(row,field) {
              return (row.name === 'CotoMos Solid State Relays' ? 'Coto Technology' : row.name);
            }
          },{
            label: 'quantity',
            value: 'qty_avail'
          },{
            label: 'distributor-url',
            value: function(row, field) {
              return 'http://www.testco-inc.com/search/partnumber:'+encodeURI(row.item_no);
            }
          }
        ];

      const json2csvParser = new Json2csvParser({fields});
      const octo_file = json2csvParser.parse(self.state.fileJson);

      self.setState({
        octopartFile: octo_file
      });

    },
    handleFile: function(e) {
        
      var self = this,
        input = this.refs.FileInput,
        reader = new FileReader();

      self.setState({
        isProcessing: true,
        octopartFile: null,
        fileText: null,
        fileJson: null
      }, function onProcessing() {

        reader.onload = (function() { 
          
          setTimeout(function onTime() {

            csv()
              .fromString(reader.result)
              .then(function(csv_json) {
                console.log(csv_json);
                self.setState({
                  fileJson: csv_json,
                  fileText: reader.result,
                  isProcessing: false
                }, function onFileRead() {

                  self.buildOctopartFile();

                });
              });

          }, 1000);
        });

        reader.onerror = (function() { 
          self.setState({
            fileError: true,
            isProcessing: false
          })
        });
               
        reader.abort = (function() { 
          self.setState({
            fileError: true,
            isProcessing: false
          })
        });



        reader.readAsText(input.files[0]);

      });

    },
    render: function() {

      var self = this,
        status,
        download,
        octopart_preview;

      if (self.state.isProcessing) {
        status = (<div className="alert alert-info">
          File is processing..
        </div>);

      } else if (self.state.fileError) {
        status = (<div className="alert alert-error">
          There was an error trying to load your inventory file.
        </div>);

      }

      if (self.state.octopartFile) {

        download = (<div className="form-group">
          <a href="#" onClick={self.handleDownloadClick} className="btn btn-lg btn-success">
            <span className="glyphicon glyphicon-download"></span> Octopart File
          </a>
        </div>);

        octopart_preview = (<div className="panel panel-default">
  
          <div className="panel-heading">
            <h3 className="panel-title">Octopart File Preview</h3>
          </div>

          <div className="panel-body">

            <textarea className="form-control" readOnly='true' style={{width:'100%', height:'100%'}}>
              {self.state.octopartFile}
            </textarea>

          </div>

        </div>);

      } else {

        download = (<div className="form-group">
          <span style={{cursor: 'not-allowed'}}>
            <a href="#" className="btn btn-lg btn-default disabled">
              <span className="glyphicon glyphicon-download"></span> Octopart File
            </a>
          </span>
        </div>);

      }

      return (<div id="converter">

        <div id="header">
          <nav className="navbar navbar-default">

            <div className="container-fluid">

              <div className="navbar-header">

                <span className="navbar-brand">TESTCO OCTOPART FILE GENERATOR</span>

              </div>
            </div>

          </nav>
        </div>

        <div id="content">

          <div id="content-inner" style={{padding:"0 20"}}>

            <h1>
              Convert Your Inventory CSV for Octopart
            </h1>

            <div className="row">

              <div className="col-md-8">

                <div className="panel panel-default">

                  <div className="panel-body">

                    <div className="form-group">
                      <label>Provide Your Inventory <span className="text-danger">CSV File</span></label>
                      <input ref="FileInput" type="file" id="input" onChange={self.handleFile}></input>
                    </div>

                    {status}

                    {download}

                    <div className="text-muted">
                      Note: Manufacturer "CotoMos Solid State Relays" will be renamed to "Coto Technology"
                    </div>

                  </div>

                </div>

                {octopart_preview}

              </div>

            </div>

          </div>

        </div>

      </div>);

    }
  });