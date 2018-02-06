import React, { Component } from 'react';
import fire from './fire';

class Routes extends Component { 
    constructor(props) {
        super(props);

        this.state = {
            routes: [],
        };
        
        this.addRoute = this.addRoute.bind(this);
    }
    
    componentWillMount(){
        // Create reference to product db
        let routes = fire.database().ref('routes').orderByKey();
        
        routes.on('child_added', snapshot => {
            // Update React state when product is added at Firebase Database
            let route = { data: snapshot.val(), id: snapshot.key };
            console.log(route.data);
            this.setState({ routes: this.state.routes.concat(route) });
        }) 
    }
    
    addRoute(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newRoute = {
            name: this.name.value /*,
            lastCost: this.lastCost.value ,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value,*/
            
        }
        
        fire.database().ref('routes').push( newRoute );
        
        document.getElementById("new-route-form").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="new-route-form" onSubmit={this.addRoute.bind(this)}>
                    Route Name: <input type='text' ref={name => this.name = name}/> <br/>
                    <input type='submit'/>
                </form>

                <table id='routes'>
                    <colgroup>
                        <col id='route-name'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Route Name</th>
                        </tr>
                        {
                            this.state.routes.map( route => 
                                <tr className='route-name' key={route.id}>
                                    <td>{route.data.name}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default Routes;