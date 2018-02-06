import React, { Component } from 'react';
//import fire from '../fire';

class CreateNewProduct extends Component { 
    constructor(props) {
        super(props);

        
        //this.addProduct = this.addProduct.bind(this);
    }

    addProduct(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newProduct = {
            name: this.name.value,
            lastCost: this.lastCost.value /*,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value,*/
            
        }
        
        fire.database().ref('inventory').push( newProduct );
        
        document.getElementById("newProductForm").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="newProductForm" onSubmit={this.addProduct.bind(this)}>
                    Product Name: <input type='text' ref={name => this.name = name}/> <br/>
                    Last Cost:<input type='number' ref={lastCost => this.lastCost = lastCost}/> <br/>
                    <input type='submit'/>
                </form>
            </section>
        );
    }
}
export default CreateNewProduct;