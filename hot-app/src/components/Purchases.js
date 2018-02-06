import React, { Component } from 'react';
import fire from './fire';

class Purchases extends Component { 
    constructor(props) {
        super(props);

        this.state = {
            purchases: [],
        };
        
        this.createPurchase = this.createPurchase.bind(this);
    }
    
    componentWillMount(){
        // Create reference to product db
        let purchases = fire.database().ref('purchases').orderByKey();
        
        purchases.on('child_added', snapshot => {
            // Update React state when product is added at Firebase Database
            let purchase = { data: snapshot.val(), id: snapshot.key };
            console.log(purchase.data);
            this.setState({ purchases: this.state.purchases.concat(purchase) });
        }) 
    }
    
    createPurchase(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newPurchase = {
            name: this.name.value
            
        }
        
        fire.database().ref('purchases').push( newPurchase );
        
        document.getElementById("new-purchase-form").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="new-purchase-form" onSubmit={this.createPurchase.bind(this)}>
                    Purchase Name: <input type='text' ref={name => this.name = name}/> <br/>
                    <input type='submit'/>
                </form>

                <table id='purchases'>
                    <colgroup>
                        <col id='purchase-name'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Trip #</th>
                        </tr>
                        {
                            this.state.purchases.map( purchase => 
                                <tr className='purchase-name' key={purchase.id}>
                                    <td>{purchase.data.name}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default Purchases;