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

class Purchases extends Component { 
    constructor(props) {
        super(props);
        
        //Create reference to ucm db
        this.purchases = fire.database().ref('purchases');
        
        //Declare state variables
        this.state = {
            purchases: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selctedPur: {},
            showEditBtns: false
        };
        
        //Either bind here on when linking for form this. EX: add.purchase.bind(this)
        this.addPurchase = this.addPurchase.bind(this);
        this.editPurchase = this.editPurchase.bind(this);
        this.deletePurchase = this.deletePurchase.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    refresh(){
        let purchaseList = [];
        this.purchases.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let purchase = { data: childSnapshot.val(), id: childSnapshot.key };
                purchaseList.push(purchase);
            });
            this.setState({purchases: purchaseList});
        });    
    }
    
    
    componentWillMount(){
        // this.refresh();
    }
    
    componentDidMount(){
        this.purchases.on('child_added', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.purchases.on('child_changed', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.purchases.on('child_removed', snapshot => {
            console.log('removed fire');
            this.refresh();            
        });
    }
    
    addPurchase(e){
        //Prevent page refresh when new purchase added
        e.preventDefault();
        
        //Initialize purchase
        var newPurchase = {
            purchaseNum: this.purchaseNum.value,
            date: this.date.value,
            description: this.description.value,
            cost: this.cost.value,
            supplier: this.supplier.value,
            unique: this.unique.value,
            count: this.count.value,
            installDt: this.installDt.value,
            selected: false,
        }
        //Validate date is unique
        //Use loop or firebase query on date
        
        //Push new purchase into db, update state, reset form
        this.purchases.push( newPurchase );
        this.setState({ showAddForm: false });
        document.getElementById("newPurchaseForm").reset();
    }
    
    handleAcctClick(purchase){
        let num = ''
        // eslint-disable-next-line
        this.state.selctedPur ? num = purchase.data.purchaseNum : '';
        
        this.setState({selctedPur: purchase,  selectedName: num, showEditBtns: true});
        
        console.log('selected: ' + num);
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selctedPur: {},
            showEditBtns: false,
            selectedName: null
        });
    }
    
    editPurchase(e){
        e.preventDefault();
        
        fire.database().ref('purchases/' + this.state.selctedPur.id).update({
            purchaseNum: this.purchaseNum.value ? this.purchaseNum.value : this.state.selctedPur.data.purchaseNum,
            date: this.date.value ? this.date.value : this.state.selctedPur.data.date,
            description: this.description.value ? this.description.value : this.state.selctedPur.data.description,
            cost: this.cost.value ? this.cost.value : this.state.selctedPur.data.cost,
            supplier: this.supplier.value ? this.supplier.value : this.state.selctedPur.data.supplier,
            unique: this.unique.value ? this.unique.value : this.state.selctedPur.data.unique,
            count: this.count.value ? this.count.value : this.state.selctedPur.data.count,
            installDt: this.installDt.value ? this.installDt.value : this.state.selctedPur.data.installDt,
        });
        
        this.setState({ showEditForm: false, selctedPur: {}, selectedName: null, showEditBtns: false }); 
        document.getElementById("editPurchaseForm").reset(); 
    }
    
    deletePurchase(e){
        e.preventDefault();
        
        fire.database().ref('purchases/' + this.state.selctedPur.id).remove();
        
        this.setState({ showDeleteForm: false, selctedPur: {}, selectedName: null, showEditBtns: false }); 
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
                    <h1 className="h2">Purchase Management</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        { showEditBtns ?
                        <div className='btn-group'>
                            <h4 className='text-muted' >Selected: <b>[ {this.state.selectedName} ]</b></h4>
                        </div>
                        : null
                        }
                    
                        { showEditBtns ?
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit {this.state.selctedPur.data.purchaseNum}</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete {this.state.selctedPur.data.purchaseNum}</button>
                        </div>
                        : null
                        }
                        
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' data-toggle="modal" onClick={() => this.setState({ showAddForm: true })}>New Purchase</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    <div className='modal fade' >
                        <Modal isOpen={showAddForm} style={customStyles}>
                            
                             <form className='form' id="newPurchaseForm" onSubmit={this.addPurchase}>
                                <div className='form-group row'>
                                    <label>Purchase Number:</label>
                                    <input className='form-control' supplier='text' ref={purchaseNum => this.purchaseNum = purchaseNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Date: </label>
                                    <input className='form-control' supplier='text' ref={date => this.date = date}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>
                                    <textarea class="form-control" rows="3" ref={description => this.description = description}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' supplier='number' ref={cost => this.cost = cost}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Supplier:</label>
                                    <input className='form-control' supplier='text' ref={supplier => this.supplier = supplier}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Unique Products:</label>
                                    <input className='form-control' supplier='text' ref={unique => this.unique = unique}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Total Products:</label>
                                    <input className='form-control' supplier='text' ref={count => this.count = count}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' supplier='date' ref={installDt => this.installDt = installDt}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button supplier='submit' className='btn btn-success'>Submit</button>
                                    <button className='btn btn-danger'onClick={this.handleCancel}>Cancel</button>
                                </div>
                                
                            </form>
                            
                            
                        </Modal>
                    </div>
                    
                    {showEditForm ?
                    <div className='modal fade' >
                        <Modal isOpen={showEditForm} style={customStyles}>
                            
                            <form className='form' id="editPurchaseForm" onSubmit={this.editPurchase}>
                                
                                <div className='form-group row'>
                                    <label>Purchase Number:</label>
                                    <input className='form-control' supplier='text' placeholder={this.state.selctedPur.data.purchaseNum} ref={purchaseNum => this.purchaseNum = purchaseNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Date: </label>
                                    <input className='form-control' supplier='text' placeholder={this.state.selctedPur.data.date} ref={date => this.date = date}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>    
                                    <textarea class="form-control" rows="3"  placeholder={this.state.selctedPur.data.description} ref={description => this.description = description}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' supplier='number' placeholder={this.state.selctedPur.data.cost} ref={cost => this.cost = cost}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Supplier:</label>
                                    <input className='form-control' supplier='text' placeholder={this.state.selctedPur.data.supplier} ref={supplier => this.supplier = supplier}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Unique Products:</label>
                                    <input className='form-control' supplier='text' placeholder={this.state.selctedPur.data.unique} ref={unique => this.unique = unique}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Total Products:</label>
                                    <input className='form-control' supplier='text' placeholder={this.state.selctedPur.data.count} ref={count => this.count = count}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' supplier='date' placeholder={this.state.selctedPur.data.installDt} ref={installDt => this.installDt = installDt}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button supplier='submit' className='btn btn-success'>Submit</button>
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
                            <form className='form' id="deletePurchaseForm">
                                <div className='form-group'>
                                    <h2 className='text-danger'>Please confirm that you would like to delete: [ {this.state.selectedName} ]</h2>
                                </div>
                                <div className='form-group row justify-content-md-center'>
                                    <button className='btn  btn-danger' onClick={this.deletePurchase} supplier='button'>Confirm</button> 
                                    <button className='btn  btn-outline-secondary' onClick={this.handleCancel} supplier='button'>Cancel</button> 
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
                                <th>Date</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Supplier</th>
                                <th>Unique Products</th>
                                <th>Total Products</th>
                                <th>Install Date</th>
                            </tr>
                            
                            {
                                this.state.purchases.map( purchase => 
                                    <tr className='purchase-date' style={{cursor: 'pointer'}} key={purchase.id} onClick={() => this.handleAcctClick(purchase)}>
                                        <td>{purchase.id}</td>
                                        <td>{purchase.data.purchaseNum}</td>
                                        <td>{purchase.data.date}</td>
                                        <td>{purchase.data.description}</td>
                                        <td>{purchase.data.cost}</td>
                                        <td>{purchase.data.supplier}</td>
                                        <td>{purchase.data.unique}</td>
                                        <td>{purchase.data.count}</td>
                                        <td>{purchase.data.installDt}</td>
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
export default Purchases;