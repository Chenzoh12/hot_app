import React, { Component } from 'react';
import fire from './fire';

class Trips extends Component { 
    constructor(props) {
        super(props);

        this.state = {
            trips: [],
        };
        
        this.createTrip = this.createTrip.bind(this);
    }
    
    componentWillMount(){
        // Create reference to product db
        let trips = fire.database().ref('trips').orderByKey();
        
        trips.on('child_added', snapshot => {
            // Update React state when product is added at Firebase Database
            let trip = { data: snapshot.val(), id: snapshot.key };
            console.log(trip.data);
            this.setState({ trips: this.state.trips.concat(trip) });
        }) 
    }
    
    createTrip(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newTrip = {
            name: this.name.value
            
        }
        
        fire.database().ref('trips').push( newTrip );
        
        document.getElementById("new-trip-form").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="new-trip-form" onSubmit={this.createTrip.bind(this)}>
                    Trip Name: <input type='text' ref={name => this.name = name}/> <br/>
                    <input type='submit'/>
                </form>

                <table id='trips'>
                    <colgroup>
                        <col id='trip-name'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Trip #</th>
                        </tr>
                        {
                            this.state.trips.map( trip => 
                                <tr className='trip-name' key={trip.id}>
                                    <td>{trip.data.name}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default Trips;