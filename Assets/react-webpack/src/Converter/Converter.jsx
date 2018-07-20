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
              return (row.MFG === 'CotoMos Solid State Relays' ? 'Coto Technology' : row.MFG);
            }
          },{
            label: 'quantity',
            value: 'QTY'
          },{
            label: 'moq',
            value: 'min_ord'
          },{
            label: 'distributor-url',
            value: function(row, field) {
              return 'http://www.testco-inc.com/search/partnumber:'+encodeURI(row.item_no);
            }
          },{
            label: 'price-break-1',
            value: function(row, field) {
              return 1;
            }
          },{
            label: 'price-usd-1',
            value: 'prc_1'
          },{
            label: 'price-break-2',
            value: function(row, field) {
              return (row.prc_2 > 0 ? Number(row.qty_1) + 1 : '');
            }
          },{
            label: 'price-usd-2',
            value: 'prc_2'
          },{
            label: 'price-break-3',
            value: function(row, field) {
              return (row.prc_3 > 0 ? Number(row.qty_2) + 1 : '');
            }
          },{
            label: 'price-usd-3',
            value: 'prc_3'
          },{
            label: 'price-break-4',
            value: function(row, field) {
              return (row.prc_4 > 0 ? Number(row.qty_3) + 1 : '');
            }
          },{
            label: 'price-usd-4',
            value: 'prc_4'
          },{
            label: 'price-break-5',
            value: function(row, field) {
              return (row.prc_5 > 0 ? Number(row.qty_4) + 1 : '');
            }
          },{
            label: 'price-usd-5',
            value: 'prc_5'
          },{
            label: 'price-break-6',
            value: function(row, field) {
              return (row.prc_6 > 0 ? Number(row.qty_5) + 1 : '');
            }
          },{
            label: 'price-usd-6',
            value: 'prc_6'
          },{
            label: 'price-break-7',
            value: function(row, field) {
              return (row.prc_7 > 0 ? Number(row.qty_6) + 1 : '');
            }
          },{
            label: 'price-usd-7',
            value: 'prc_7'
          },{
            label: 'price-break-8',
            value: function(row, field) {
              return (row.prc_8 > 0 ? Number(row.qty_7) + 1 : '');
            }
          },{
            label: 'price-usd-8',
            value: 'prc_8'
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
                      Notes:
                      <br />Relies on header names in your sample file <a href="Book1.csv">Book1.csv</a>.  Don't change the header names. 
                      <br />Manufacturer "CotoMos Solid State Relays" will be renamed to "Coto Technology".
                      <br />Supports up to 8 price breaks.  Special code handles wonky price break quantities that use the "high" quantity number.
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