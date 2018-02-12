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

class Trips extends Component { 
    constructor(props) {
        super(props);
        
        //Create reference to ucm db
        this.trips = fire.database().ref('trips');
        
        //Declare state variables
        this.state = {
            trips: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedTrip: {},
            showEditBtns: false
        };
        
        //Either bind here on when linking for form this. EX: add.trip.bind(this)
        this.addTrip = this.addTrip.bind(this);
        this.editTrip = this.editTrip.bind(this);
        this.deleteTrip = this.deleteTrip.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    refresh(){
        let tripList = [];
        this.trips.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let trip = { data: childSnapshot.val(), id: childSnapshot.key };
                tripList.push(trip);
            });
            this.setState({trips: tripList});
        });    
    }
    
    
    componentWillMount(){
        // this.refresh();
    }
    
    componentDidMount(){
        this.trips.on('child_added', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.trips.on('child_changed', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.trips.on('child_removed', snapshot => {
            console.log('removed fire');
            this.refresh();            
        });
    }
    
    addTrip(e){
        //Prevent page refresh when new trip added
        e.preventDefault();
        
        //Initialize trip
        var newTrip = {
            tripNum: this.tripNum.value,
            date: this.date.value,
            driver: this.driver.value,
            revenue: this.revenue.value,
            stops: this.stops.value,
            status: this.status.value,
            miles: this.miles.value,
            comments: this.comments.value,
            selected: false,
        }
        //Validate date is status
        //Use loop or firebase query on date
        
        //Push new trip into db, update state, reset form
        this.trips.push( newTrip );
        this.setState({ showAddForm: false });
        document.getElementById("newTripForm").reset();
    }
    
    handleAcctClick(trip){
        let num = ''
        // eslint-disable-next-line
        this.state.selectedTrip ? num = trip.data.tripNum : '';
        
        this.setState({selectedTrip: trip,  selectedName: num, showEditBtns: true});
        
        console.log('selected: ' + num);
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedTrip: {},
            showEditBtns: false,
            selectedName: null
        });
    }
    
    editTrip(e){
        e.preventDefault();
        
        fire.database().ref('trips/' + this.state.selectedTrip.id).update({
            tripNum: this.tripNum.value ? this.tripNum.value : this.state.selectedTrip.data.tripNum,
            date: this.date.value ? this.date.value : this.state.selectedTrip.data.date,
            driver: this.driver.value ? this.driver.value : this.state.selectedTrip.data.driver,
            revenue: this.revenue.value ? this.revenue.value : this.state.selectedTrip.data.revenue,
            stops: this.stops.value ? this.stops.value : this.state.selectedTrip.data.stops,
            status: this.status.value ? this.status.value : this.state.selectedTrip.data.status,
            miles: this.miles.value ? this.miles.value : this.state.selectedTrip.data.miles,
            comments: this.comments.value ? this.comments.value : this.state.selectedTrip.data.comments,
        });
        
        this.setState({ showEditForm: false, selectedTrip: {}, selectedName: null, showEditBtns: false }); 
        document.getElementById("editTripForm").reset(); 
    }
    
    deleteTrip(e){
        e.preventDefault();
        
        fire.database().ref('trips/' + this.state.selectedTrip.id).remove();
        
        this.setState({ showDeleteForm: false, selectedTrip: {}, selectedName: null, showEditBtns: false }); 
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
                    <h1 className="h2">Trip Management</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        { showEditBtns ?
                        <div className='btn-group'>
                            <h4 className='text-muted' >Selected: <b>[ {this.state.selectedName} ]</b></h4>
                        </div>
                        : null
                        }
                    
                        { showEditBtns ?
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit {this.state.selectedTrip.data.tripNum}</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete {this.state.selectedTrip.data.tripNum}</button>
                        </div>
                        : null
                        }
                        
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' data-toggle="modal" onClick={() => this.setState({ showAddForm: true })}>New Trip</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    <div className='modal fade' >
                        <Modal isOpen={showAddForm} style={customStyles}>
                            
                             <form className='form' id="newTripForm" onSubmit={this.addTrip}>
                                <div className='form-group row'>
                                    <label>Purchase Number:</label>
                                    <input className='form-control' stops='text' ref={tripNum => this.tripNum = tripNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Date: </label>
                                    <input className='form-control' stops='text' ref={date => this.date = date}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>
                                    <textarea class="form-control" rows="3" ref={driver => this.driver = driver}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' stops='number' ref={revenue => this.revenue = revenue}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Supplier:</label>
                                    <input className='form-control' stops='text' ref={stops => this.stops = stops}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Unique Products:</label>
                                    <input className='form-control' stops='text' ref={status => this.status = status}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Total Products:</label>
                                    <input className='form-control' stops='text' ref={miles => this.miles = miles}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' stops='date' ref={comments => this.comments = comments}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button stops='submit' className='btn btn-success'>Submit</button>
                                    <button className='btn btn-danger'onClick={this.handleCancel}>Cancel</button>
                                </div>
                                
                            </form>
                            
                            
                        </Modal>
                    </div>
                    
                    {showEditForm ?
                    <div className='modal fade' >
                        <Modal isOpen={showEditForm} style={customStyles}>
                            
                            <form className='form' id="editTripForm" onSubmit={this.editTrip}>
                                
                                <div className='form-group row'>
                                    <label>Purchase Number:</label>
                                    <input className='form-control' stops='text' placeholder={this.state.selectedTrip.data.tripNum} ref={tripNum => this.tripNum = tripNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Date: </label>
                                    <input className='form-control' stops='text' placeholder={this.state.selectedTrip.data.date} ref={date => this.date = date}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>    
                                    <textarea class="form-control" rows="3"  placeholder={this.state.selectedTrip.data.driver} ref={driver => this.driver = driver}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Cost:</label>
                                    <input className='form-control' stops='number' placeholder={this.state.selectedTrip.data.revenue} ref={revenue => this.revenue = revenue}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Supplier:</label>
                                    <input className='form-control' stops='text' placeholder={this.state.selectedTrip.data.stops} ref={stops => this.stops = stops}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Unique Products:</label>
                                    <input className='form-control' stops='text' placeholder={this.state.selectedTrip.data.status} ref={status => this.status = status}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Total Products:</label>
                                    <input className='form-control' stops='text' placeholder={this.state.selectedTrip.data.miles} ref={miles => this.miles = miles}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Install Date:</label>
                                    <input className='form-control' stops='date' placeholder={this.state.selectedTrip.data.comments} ref={comments => this.comments = comments}/> 
                                </div>
                                
                                <div className='form-group row justify-content-md-center'>
                                    <button stops='submit' className='btn btn-success'>Submit</button>
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
                            <form className='form' id="deleteTripForm">
                                <div className='form-group'>
                                    <h2 className='text-danger'>Please confirm that you would like to delete: {this.state.selectedName}</h2>
                                </div>
                                <div className='form-group row justify-content-md-center'>
                                    <button className='btn  btn-danger' onClick={this.deleteTrip} stops='button'>Confirm</button> 
                                    <button className='btn  btn-outline-secondary' onClick={this.handleCancel} stops='button'>Cancel</button> 
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
                                this.state.trips.map( trip => 
                                    <tr className='trip-date' style={{cursor: 'pointer'}} key={trip.id} onClick={() => this.handleAcctClick(trip)}>
                                        <td>{trip.id}</td>
                                        <td>{trip.data.tripNum}</td>
                                        <td>{trip.data.date}</td>
                                        <td>{trip.data.driver}</td>
                                        <td>{trip.data.revenue}</td>
                                        <td>{trip.data.stops}</td>
                                        <td>{trip.data.status}</td>
                                        <td>{trip.data.miles}</td>
                                        <td>{trip.data.comments}</td>
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
export default Trips;