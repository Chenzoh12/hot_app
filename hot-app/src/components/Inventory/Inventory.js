import React, { Component } from 'react';
import fire from '../fire';
//import CreateNewProduct from './CreateNewProduct';
//import { Link } from 'react-router-dom';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        
       
        
        this.state = {
            products: [],
            showAddForm: false
        };
        
       this.addProduct = this.addProduct.bind(this);
    }
    
    componentWillMount(){
        // Create reference to product db
        let inventory = fire.database().ref('inventory').orderByKey();
        
        inventory.on('child_added', snapshot => {
            // Update React state when product is added at Firebase Database
            let product = { data: snapshot.val(), id: snapshot.key };
            console.log(product.data);
            this.setState({ products: this.state.products.concat(product) });
        }) 
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
            inTruckQty: this.inTruckQty.value, */
            
        }
        
        fire.database().ref('inventory').push( newProduct );
        
        document.getElementById("newProductForm").reset(); 
        this.setState({ showAddForm: false })

    } 
    
    render() {
        const{showAddForm} = this.state;
        
        return ( 
            <section>
                <button onClick={() => this.setState({ showAddForm: true })}>Add Product</button>
                
                { showAddForm ?
                 <form id="newProductForm" onSubmit={this.addProduct.bind(this)}>
                    Product Name: <input type='text' ref={name => this.name = name}/> <br/>
                    Last Cost:<input type='number' ref={lastCost => this.lastCost = lastCost}/> <br/>
                    <input type='submit'/>
                </form>
                : null
                }
                
                <table id='inventory'>
                    <colgroup>
                        <col id='product-name'/>
                        <col id='cost'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Product</th>
                            <th>Cost</th>
                        </tr>
                        {
                            this.state.products.map( product => 
                                <tr className='product-name' key={product.id}>
                                    <td>{product.data.name}</td>
                                    <td>{product.data.lastCost}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default Inventory;