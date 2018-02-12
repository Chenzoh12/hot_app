import React, { Component } from 'react';
import fire from './fire';
import Modal from 'react-modal'
// eslint-disable-next-line
import _ from 'lodash';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Assets extends Component { 
    constructor(props) {
        super(props);
        
        //Create reference to ucm db
        this.assets = fire.database().ref('assets');
        
        //Declare state variables
        this.state = {
            assets: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedAsset: {},
            showEditBtns: false
        };
        
        //Either bind here on when linking for form this. EX: add.asset.bind(this)
        this.addAsset = this.addAsset.bind(this);
        this.editAsset = this.editAsset.bind(this);
        this.deleteAsset = this.deleteAsset.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    refresh(){
        let assetList = [];
        this.assets.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let asset = { data: childSnapshot.val(), id: childSnapshot.key };
                assetList.push(asset);
            });
            this.setState({assets: assetList});
        });    
    }
    
    
    componentWillMount(){
        // this.refresh();
    }
    
    componentDidMount(){
        this.assets.on('child_added', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.assets.on('child_changed', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.assets.on('child_removed', snapshot => {
            console.log('removed fire');
            this.refresh();            
        });
    }
    
    addAsset(e){
        //Prevent page refresh when new asset added
        e.preventDefault();
        
        //Initialize asset
        var newAsset = {
            assetNum: this.assetNum.value,
            status: this.status.value,
            description: this.description.value,
            cost: this.cost.value,
            type: this.type.value,
            model: this.model.value,
            location: this.location.value,
            installDt: this.installDt.value,
            selected: false,
        }
        //Validate status is unique
        //Use loop or firebase query on status
        
        //Push new asset into db, update state, reset form
        this.assets.push( newAsset );
        this.setState({ showAddForm: false });
        document.getElementById("newAssetForm").reset();
    }
    
    handleAcctClick(asset){
        let num = ''
        // eslint-disable-next-line
        this.state.selectedAsset ? num = asset.data.assetNum : '';
        
        this.setState({selectedAsset: asset,  selectedName: num, showEditBtns: true});
        
        console.log('selected: ' + num);
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedAsset: {},
            showEditBtns: false,
            selectedName: null
        });
    }
    
    editAsset(e){
        e.preventDefault();
        
        fire.database().ref('assets/' + this.state.selectedAsset.id).update({
            assetNum: this.assetNum.value ? this.assetNum.value : this.state.selectedAsset.data.assetNum,
            status: this.status.value ? this.status.value : this.state.selectedAsset.data.status,
            description: this.description.value ? this.description.value : this.state.selectedAsset.data.description,
            cost: this.cost.value ? this.cost.value : this.state.selectedAsset.data.cost,
            type: this.type.value ? this.type.value : this.state.selectedAsset.data.type,
            model: this.model.value ? this.model.value : this.state.selectedAsset.data.model,
            location: this.location.value ? this.location.value : this.state.selectedAsset.data.location,
            installDt: this.installDt.value ? this.installDt.value : this.state.selectedAsset.data.installDt,
        });
        
        this.setState({ showEditForm: false, selectedAsset: {}, selectedName: null, showEditBtns: false }); 
        document.getElementById("editAssetForm").reset(); 
    }
    
    deleteAsset(e){
        e.preventDefault();
        
        fire.database().ref('assets/' + this.state.selectedAsset.id).remove();
        
        this.setState({ showDeleteForm: false, selectedAsset: {}, selectedName: null, showEditBtns: false }); 
    }
    
    render() {
        //Declare form boolean variables
        const{showAddForm} = this.state;
        const{showEditForm} = this.state;
        const{showDeleteForm} = this.state;
        const{showEditBtns} = this.state;
        
        return ( 
            <section>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <h1 className="h2">Asset Management</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        { showEditBtns ?
                        <div className='btn-group'>
                            <h4 className='text-muted' >Selected: <b>[ {this.state.selectedName} ]</b></h4>
                        </div>
                        : null
                        }
                    
                        { showEditBtns ?
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit {this.state.selectedAsset.data.assetNum}</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete {this.state.selectedAsset.data.assetNum}</button>
                        </div>
                        : null
                        }
                        
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' data-toggle="modal" onClick={() => this.setState({ showAddForm: true })}>New Asset</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    <div className='modal fade' >
                        <Modal isOpen={showAddForm} style={customStyles}>
                            
                             <form className='form' id="newAssetForm" onSubmit={this.addAsset}>
                                <div className='form-group row'>
                                    <label>Asset Number:</label>
                                    <input className='form-control' type='text' ref={assetNum => this.assetNum = assetNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Status: </label>
                                    <input className='form-control' type='text' ref={status => this.status = status}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>
                                    <textarea class="form-control" rows="3" ref={description => this.description = description}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' type='number' ref={cost => this.cost = cost}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Type:</label>
                                    <input className='form-control' type='text' ref={type => this.type = type}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Model:</label>
                                    <input className='form-control' type='text' ref={model => this.model = model}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Location:</label>
                                    <input className='form-control' type='text' ref={location => this.location = location}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' type='date' ref={installDt => this.installDt = installDt}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button type='submit' className='btn btn-success'>Submit</button>
                                    <button className='btn btn-danger'onClick={this.handleCancel}>Cancel</button>
                                </div>
                                
                            </form>
                            
                            
                        </Modal>
                    </div>
                    
                    {showEditForm ?
                    <div className='modal fade' >
                        <Modal isOpen={showEditForm} style={customStyles}>
                            
                            <form className='form' id="editAssetForm" onSubmit={this.editAsset}>
                                
                                <div className='form-group row'>
                                    <label>Asset Number:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAsset.data.assetNum} ref={assetNum => this.assetNum = assetNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Status: </label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAsset.data.status} ref={status => this.status = status}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>    
                                    <textarea class="form-control" rows="3"  placeholder={this.state.selectedAsset.data.description} ref={description => this.description = description}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedAsset.data.cost} ref={cost => this.cost = cost}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Type:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAsset.data.type} ref={type => this.type = type}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Model:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAsset.data.model} ref={model => this.model = model}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Location:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAsset.data.location} ref={location => this.location = location}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' type='date' placeholder={this.state.selectedAsset.data.installDt} ref={installDt => this.installDt = installDt}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button type='submit' className='btn btn-success'>Submit</button>
                                    <button className='btn btn-danger'onClick={this.handleCancel}>Cancel</button>
                                </div>
                                
                            </form>
                        </Modal>
                    </div>
                    
                    : null
                    }
             
                    
                    { showDeleteForm ? 
                    <div className='modal fade' >
                        <Modal isOpen={showDeleteForm} style={customStyles}>
                            <form className='form' id="deleteAssetForm">
                                <div className='form-group'>
                                    <h2 className='text-danger'>Please confirm that you would like to delete: [ {this.state.selectedName} ]</h2>
                                </div>
                                <div className='form-group row justify-content-md-center'>
                                    <button className='btn  btn-danger' onClick={this.deleteAsset} type='button'>Confirm</button> 
                                    <button className='btn  btn-outline-secondary' onClick={this.handleCancel} type='button'>Cancel</button> 
                                </div>
                            </form> 
                        </Modal>
                    </div>
                    
                    : null
                        
                    }
                    
                    <table className='table table-striped table-hover table-sm' id='ucm'>
                        <tbody>
                            <tr>
                                <th>DB ID</th>
                                <th>Asset #</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Type</th>
                                <th>Model</th>
                                <th>Location</th>
                                <th>Install Date</th>
                            </tr>
                            
                            {
                                this.state.assets.map( asset => 
                                    <tr className='asset-status' style={{cursor: 'pointer'}} key={asset.id} onClick={() => this.handleAcctClick(asset)}>
                                        <td>{asset.id}</td>
                                        <td>{asset.data.assetNum}</td>
                                        <td>{asset.data.status}</td>
                                        <td>{asset.data.description}</td>
                                        <td>{asset.data.cost}</td>
                                        <td>{asset.data.type}</td>
                                        <td>{asset.data.model}</td>
                                        <td>{asset.data.location}</td>
                                        <td>{asset.data.installDt}</td>
                                    </tr>
                                )       
                            }
                            
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
}
export default Assets;