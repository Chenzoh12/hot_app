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

class Accounts extends Component { 
    constructor(props) {
        super(props);
        
        //Create reference to ucm db
        this.ucm = fire.database().ref('accounts');
        
        //Declare state variables
        this.state = {
            accounts: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedAcct: {},
            showEditBtns: false
        };
        
        //Either bind here on when linking for form this. EX: add.account.bind(this)
        this.addProduct = this.addProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    refresh(){
        let acctList = [];
        this.ucm.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let account = { data: childSnapshot.val(), id: childSnapshot.key };
                acctList.push(account);
            });
            this.setState({accounts: acctList});
        });    
    }
    
    
    componentWillMount(){
        // this.refresh();
    }
    
    componentDidMount(){
        this.ucm.on('child_added', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.ucm.on('child_changed', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.ucm.on('child_removed', snapshot => {
            console.log('removed fire');
            this.refresh();            
        });
    }
    
    addProduct(e){
        //Prevent page refresh when new account added
        e.preventDefault();
        
        //Initialize account
        var newAcct = {
            acctNum: this.acctNum.value,
            name: this.name.value,
            street: this.street.value,
            city: this.city.value,
            zip: this.zip.value,
            contact: this.contact.value,
            email: this.email.value,
            freq: this.freq.value,
            route: '',
            due: false,
            notes: [],
            selected: false,
        }
        //Validate name is unique
        //Use loop or firebase query on name
        
        //Push new account into db, update state, reset form
        this.ucm.push( newAcct );
        this.setState({ showAddForm: false });
        document.getElementById("newAcctForm").reset();
    }
    
    handleAcctClick(account){
        let name = ''
        this.state.selectedAcct ? name = account.data.name : '';
        
        this.setState({selectedAcct: account,  selectedName: name, showEditBtns: true});
        
        console.log('selected: ' + name);
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedAcct: {},
            showEditBtns: false,
            selectedName: null
        });
    }
    
    editProduct(e){
        e.preventDefault();
        
        fire.database().ref('accounts/' + this.state.selectedAcct.id).update({
            acctNum: this.acctNum.value ? this.acctNum.value : this.state.selectedAcct.data.acctNum,
            name: this.name.value ? this.name.value : this.state.selectedAcct.data.name,
            street: this.street.value ? this.street.value : this.state.selectedAcct.data.street,
            city: this.city.value ? this.city.value : this.state.selectedAcct.data.city,
            zip: this.zip.value ? this.zip.value : this.state.selectedAcct.data.zip,
            contact: this.contact.value ? this.contact.value : this.state.selectedAcct.data.contact,
            email: this.email.value ? this.email.value : this.state.selectedAcct.data.email,
            freq: this.freq.value ? this.freq.value : this.state.selectedAcct.data.freq,
        });
        
        this.setState({ showEditForm: false, selectedAcct: {}, selectedName: null, showEditBtns: false }); 
        document.getElementById("editAcctForm").reset(); 
    }
    
    deleteAccount(e){
        e.preventDefault();
        
        fire.database().ref('accounts/' + this.state.selectedAcct.id).remove();
        
        this.setState({ showDeleteForm: false, selectedAcct: {}, selectedName: null, showEditBtns: false }); 
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
                    <h1 className="h2">Account Management</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        { showEditBtns ?
                        <div className='btn-group'>
                            <h4 className='text-muted' >Selected: <b>[ {this.state.selectedName} ]</b></h4>
                        </div>
                        : null
                        }
                    
                        { showEditBtns ?
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit {this.state.selectedAcct.data.name}</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete {this.state.selectedAcct.data.name}</button>
                        </div>
                        : null
                        }
                        
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' data-toggle="modal" onClick={() => this.setState({ showAddForm: true })}>New Account</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    <div className='modal fade' >
                        <Modal isOpen={showAddForm} style={customStyles}>
                            
                             <form className='form' id="newAcctForm" onSubmit={this.addProduct}>
                                <div className='form-group row'>
                                    <label>Account Number:</label>
                                    <input className='form-control' type='number' ref={acctNum => this.acctNum = acctNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Account Name: </label>
                                    <input className='form-control' type='text' ref={name => this.name = name}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Street:</label>    
                                    <input className='form-control' type='text' ref={street => this.street = street}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>City:</label>
                                    <input className='form-control' type='text' ref={city => this.city = city}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Zip Code:</label>
                                    <input className='form-control' type='number' ref={zip => this.zip = zip}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Contact Name:</label>
                                    <input className='form-control' type='text' ref={contact => this.contact = contact}/> <br/>
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Email:</label>
                                    <input className='form-control' type='email' ref={email => this.email = email}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Frequency:</label>
                                    <input className='form-control' type='number' ref={freq => this.freq = freq}/> <br/>
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
                            
                            <form className='form' id="editAcctForm" onSubmit={this.editProduct}>
                                
                                <div className='form-group row'>
                                    <label>Account Number:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedAcct.data.acctNum} ref={acctNum => this.acctNum = acctNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Account Name: </label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAcct.data.name} ref={name => this.name = name}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Street:</label>    
                                    <input className='form-control' type='text' placeholder={this.state.selectedAcct.data.street} ref={street => this.street = street}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>City:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAcct.data.city} ref={city => this.city = city}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Zip Code:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedAcct.data.zip} ref={zip => this.zip = zip}/> <br/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Contact Name:</label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedAcct.data.contact} ref={contact => this.contact = contact}/> <br/>
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Email:</label>
                                    <input className='form-control' type='email' placeholder={this.state.selectedAcct.data.email} ref={email => this.email = email}/> <br/>
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Frequency:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedAcct.data.freq} ref={freq => this.freq = freq}/> <br/>
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
                            <form className='form' id="deleteAccountForm">
                                <div className='form-group'>
                                    <h2 className='text-danger'>Please confirm that you would like to delete: {this.state.selectedAcct.data.name}</h2>
                                </div>
                                <div className='form-group row justify-content-md-center'>
                                    <button className='btn  btn-danger' onClick={this.deleteAccount} type='button'>Confirm</button> 
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
                                <th>Acct #</th>
                                <th>Acct Name</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>Zip Code</th>
                                <th>Point of Contact</th>
                                <th>E-mail</th>
                                <th>Service Freq.</th>
                            </tr>
                            
                            {
                                this.state.accounts.map( account => 
                                    <tr className='account-name' style={{cursor: 'pointer'}} key={account.id} onClick={() => this.handleAcctClick(account)}>
                                        <td>{account.id}</td>
                                        <td>{account.data.acctNum}</td>
                                        <td>{account.data.name}</td>
                                        <td>{account.data.street}</td>
                                        <td>{account.data.city}</td>
                                        <td>{account.data.zip}</td>
                                        <td>{account.data.contact}</td>
                                        <td>{account.data.email}</td>
                                        <td>{account.data.freq}</td>
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
export default Accounts;