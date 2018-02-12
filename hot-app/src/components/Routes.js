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

class Routes extends Component { 
    constructor(props) {
        super(props);
        
        //Create reference to ucm db
        this.routes = fire.database().ref('routes');
        
        //Declare state variables
        this.state = {
            routes: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedRt: {},
            showEditBtns: false
        };
        
        //Either bind here on when linking for form this. EX: add.route.bind(this)
        this.addRoute = this.addRoute.bind(this);
        this.editRoute = this.editRoute.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    refresh(){
        let routeList = [];
        this.routes.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let route = { data: childSnapshot.val(), id: childSnapshot.key };
                routeList.push(route);
            });
            this.setState({routes: routeList});
        });    
    }
    
    
    componentWillMount(){
        // this.refresh();
    }
    
    componentDidMount(){
        this.routes.on('child_added', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.routes.on('child_changed', snapshot => {
            console.log('change fired');
            this.refresh();
        });
        
        this.routes.on('child_removed', snapshot => {
            console.log('removed fire');
            this.refresh();            
        });
    }
    
    addRoute(e){
        //Prevent page refresh when new route added
        e.preventDefault();
        
        //Initialize route
        var newRoute = {
            rtNum: this.rtNum.value,
            name: this.name.value,
            description: this.description.value,
            stops: this.stops.value,
            machines: this.machines.value,
            totalMiles: this.totalMiles.value,
            milesPerStop: this.milesPerStop.value,
            avgRev: this.avgRev.value,
            route: '',
            due: false,
            notes: [],
            selected: false,
        }
        //Validate name is unique
        //Use loop or firebase query on name
        
        //Push new route into db, update state, reset form
        this.routes.push( newRoute );
        this.setState({ showAddForm: false });
        document.getElementById("newRouteForm").reset();
    }
    
    handleAcctClick(route){
        let name = ''
        // eslint-disable-next-line
        this.state.selectedRt ? name = route.data.name : '';
        
        this.setState({selectedRt: route,  selectedName: name, showEditBtns: true});
        
        console.log('selected: ' + name);
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedRt: {},
            showEditBtns: false,
            selectedName: null
        });
    }
    
    editRoute(e){
        e.preventDefault();
        
        fire.database().ref('routes/' + this.state.selectedRt.id).update({
            rtNum: this.rtNum.value ? this.rtNum.value : this.state.selectedRt.data.rtNum,
            name: this.name.value ? this.name.value : this.state.selectedRt.data.name,
            description: this.description.value ? this.description.value : this.state.selectedRt.data.description,
            stops: this.stops.value ? this.stops.value : this.state.selectedRt.data.stops,
            machines: this.machines.value ? this.machines.value : this.state.selectedRt.data.machines,
            totalMiles: this.totalMiles.value ? this.totalMiles.value : this.state.selectedRt.data.totalMiles,
            milesPerStop: this.milesPerStop.value ? this.milesPerStop.value : this.state.selectedRt.data.milesPerStop,
            avgRev: this.avgRev.value ? this.avgRev.value : this.state.selectedRt.data.avgRev,
        });
        
        this.setState({ showEditForm: false, selectedRt: {}, selectedName: null, showEditBtns: false }); 
        document.getElementById("editAcctForm").reset(); 
    }
    
    deleteRoute(e){
        e.preventDefault();
        
        fire.database().ref('routes/' + this.state.selectedRt.id).remove();
        
        this.setState({ showDeleteForm: false, selectedRt: {}, selectedName: null, showEditBtns: false }); 
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
                    <h1 className="h2">Route Management</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        { showEditBtns ?
                        <div className='btn-group'>
                            <h4 className='text-muted' >Selected: <b>[ {this.state.selectedName} ]</b></h4>
                        </div>
                        : null
                        }
                    
                        { showEditBtns ?
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit {this.state.selectedRt.data.name}</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete {this.state.selectedRt.data.name}</button>
                        </div>
                        : null
                        }
                        
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' data-toggle="modal" onClick={() => this.setState({ showAddForm: true })}>New Route</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    <div className='modal fade' >
                        <Modal isOpen={showAddForm} style={customStyles}>
                            
                             <form className='form' id="newRouteForm" onSubmit={this.addRoute}>
                                <div className='form-group row'>
                                    <label>Route Number:</label>
                                    <input className='form-control' type='text' ref={rtNum => this.rtNum = rtNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Route Name: </label>
                                    <input className='form-control' type='text' ref={name => this.name = name}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>
                                    <textarea class="form-control" rows="3" ref={description => this.description = description}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Stops:</label>
                                    <input className='form-control' type='number' ref={stops => this.stops = stops}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Machines:</label>
                                    <input className='form-control' type='number' ref={machines => this.machines = machines}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Total Miles:</label>
                                    <input className='form-control' type='number' ref={totalMiles => this.totalMiles = totalMiles}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Miles/Stop:</label>
                                    <input className='form-control' type='number' ref={milesPerStop => this.milesPerStop = milesPerStop}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Avg Revenue:</label>
                                    <input className='form-control' type='number' ref={avgRev => this.avgRev = avgRev}/> 
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
                            
                            <form className='form' id="editAcctForm" onSubmit={this.editRoute}>
                                
                                <div className='form-group row'>
                                    <label>Route Number:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.rtNum} ref={rtNum => this.rtNum = rtNum}/>
                                </div>
                                
                                <div className='form-group row'>
                                    <label >Route Name: </label>
                                    <input className='form-control' type='text' placeholder={this.state.selectedRt.data.name} ref={name => this.name = name}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Description:</label>    
                                    <textarea class="form-control" rows="3"  placeholder={this.state.selectedRt.data.description} ref={description => this.description = description}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Stops:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.stops} ref={stops => this.stops = stops}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Machines:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.machines} ref={machines => this.machines = machines}/> 
                                </div>
                                
                                <div className='form-group row'>
                                    <label>Total Miles:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.totalMiles} ref={totalMiles => this.totalMiles = totalMiles}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Miles/Stop:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.milesPerStop} ref={milesPerStop => this.milesPerStop = milesPerStop}/> 
                                </div>
                                
                                 <div className='form-group row'>
                                    <label>Avg Revenue:</label>
                                    <input className='form-control' type='number' placeholder={this.state.selectedRt.data.avgRev} ref={avgRev => this.avgRev = avgRev}/> 
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
                            <form className='form' id="deleteRouteForm">
                                <div className='form-group'>
                                    <h2 className='text-danger'>Please confirm that you would like to delete: [ {this.state.selectedName} ]</h2>
                                </div>
                                <div className='form-group row justify-content-md-center'>
                                    <button className='btn  btn-danger' onClick={this.deleteRoute} type='button'>Confirm</button> 
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
                                <th>Rt #</th>
                                <th>Route Name</th>
                                <th>Description</th>
                                <th>Stops</th>
                                <th>Machines</th>
                                <th>Total Miles</th>
                                <th>Miles/Stop</th>
                                <th>Avg Revenue</th>
                            </tr>
                            
                            {
                                this.state.routes.map( route => 
                                    <tr className='route-name' style={{cursor: 'pointer'}} key={route.id} onClick={() => this.handleAcctClick(route)}>
                                        <td>{route.id}</td>
                                        <td>{route.data.rtNum}</td>
                                        <td>{route.data.name}</td>
                                        <td>{route.data.description}</td>
                                        <td>{route.data.stops}</td>
                                        <td>{route.data.machines}</td>
                                        <td>{route.data.totalMiles}</td>
                                        <td>{route.data.milesPerStop}</td>
                                        <td>{route.data.avgRev}</td>
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
export default Routes;