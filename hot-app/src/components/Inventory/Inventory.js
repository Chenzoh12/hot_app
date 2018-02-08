import React, { Component } from 'react';
import fire from '../fire';
//import CreateNewProduct from './CreateNewProduct';
//import { Link } from 'react-router-dom';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        
        this.state = {
            products: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedProduct: {}
        };
        
       this.addProduct = this.addProduct.bind(this);
    }
    
    componentWillMount(){
        // Create reference to product db
        let inventory = fire.database().ref('inventory').orderByKey();
        
        inventory.on('child_added', snapshot => {
            // Update React state when product is added at Firebase Database
            let product = { data: snapshot.val(), id: snapshot.key };
            console.log(product.id);
            this.setState({ products: this.state.products.concat(product) });
        })
    }
    
    componentDidMount(){
        fire.database().ref('inventory').on('child_changed', snapshot => {
            // Update React state when product is added at Firebase Database
            let changedProduct = { data: snapshot.val(), id: snapshot.key };
            let newList = [];
            
            this.state.products.forEach((product) => {
                if(product.id === changedProduct.id){
                    newList.push(changedProduct);
                } else{
                    newList.push(product);
                }
            });
            
            this.setState({products: newList});
        });
    }
    addProduct(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newProduct = {
            name: this.name.value,
            lastCost: this.lastCost.value,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value,
            avgCost: this.avgCost.value,
            avgProfit: this.avgProfit.value
            
        };
        
        fire.database().ref('inventory').push( newProduct );
        
        document.getElementById("newProductForm").reset(); 
        this.setState({ showAddForm: false });

    }
    
    handleProductClick(product){
        console.log(product.id);
        this.setState({selectedProduct: product});
        
    }
    
    editProduct(e){
            //Prevent page refresh when new product added
        e.preventDefault();
        
        fire.database().ref('inventory/' + this.state.selectedProduct.id).update({ 
            name: this.name.value ? this.name.value : this.state.selectedProduct.data.name,
            lastCost: this.lastCost.value ?  this.lastCost.value : this.state.selectedProduct.data.lastCost,
            unitsPerCase: this.unitsPerCase.value ? this.unitsPerCase.value : this.state.selectedProduct.data.unitsPerCase,
            critical: this.critical.value ? this.critical.value : this.state.selectedProduct.data.unitsPerCase,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value
        });
        
        document.getElementById("editProductForm").reset(); 
        this.setState({ showEditForm: false, selectedProduct: {} }); 

    }
    
    render() {
        const{showAddForm} = this.state;
        const{showEditForm} = this.state;
        
        return ( 
            <section>
                <button onClick={() => this.setState({ showAddForm: true })}>Add Product</button>
                <button onClick={() => this.setState({ showEditForm: true })}>Edit Product</button>
                <button onClick={() => this.setState({ showDeleteForm: true })}>Delete Product</button>
                
                { showAddForm ?
                
                 <form id="newProductForm" onSubmit={this.addProduct.bind(this)}>
                    Product Name: <input type='text' ref={name => this.name = name}/> <br/>
                    Units/Case: <input type='number' ref={unitsPerCase => this.unitsPerCase = unitsPerCase}/> <br/>
                    Last Cost:<input type='number' ref={lastCost => this.lastCost = lastCost}/> <br/>
                    Critical Level:<input type='number' ref={critical => this.critical = critical}/> <br/>
                    Warehouse Qty:<input type='number' ref={warehouseQty => this.warehouseQty = warehouseQty}/> <br/>
                    In Store Qty:<input type='number' ref={inStoreQty => this.inStoreQty = inStoreQty}/> <br/>
                    Truck Qty:<input type='number' ref={inTruckQty => this.inTruckQty = inTruckQty}/> <br/>
                    <input type='submit'/>
                </form>
                
                : null
                }
                
                { showEditForm ?
                
                 <form id="editProductForm" onSubmit={this.editProduct.bind(this)}>
                    Product Name: <input type='text' placeholder={this.state.selectedProduct.data.name} ref={name => this.name = name} /> <br/>
                    Units/Case: <input type='number' placeholder={this.state.selectedProduct.data.unitsPerCase}  ref={unitsPerCase => this.unitsPerCase = unitsPerCase}/> <br/>
                    Last Cost:<input type='number' placeholder={this.state.selectedProduct.data.lastCost} ref={lastCost => this.lastCost = lastCost}/> <br/>
                    Critical Level:<input type='number' placeholder={this.state.selectedProduct.data.critical} ref={critical => this.critical = critical}/> <br/>
                    Warehouse Qty:<input type='number' placeholder={this.state.selectedProduct.data.warehouseQty} ref={warehouseQty => this.warehouseQty = warehouseQty}/> <br/>
                    In Store Qty:<input type='number' placeholder={this.state.selectedProduct.data.inStoreQty} ref={inStoreQty => this.inStoreQty = inStoreQty}/> <br/>
                    Truck Qty:<input type='number' placeholder={this.state.selectedProduct.data.inTruckQty} ref={inTruckQty => this.inTruckQty = inTruckQty}/> <br/>
                    <input type='submit'/>
                </form>
                
                : null
                }
                
                <table id='inventory'>
                    <colgroup>
                        <col id='product-id'/>
                        <col id='product-name'/>
                        <col id='units-per-case'/>
                        <col id='cost'/>
                        <col id='critical'/>
                        <col id='warehouse-qty'/>
                        <col id='in-store-qty'/>
                        <col id='truck-qty'/>
                        <col id='avg-cost'/>
                        <col id='avg-profit'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Product ID</th>
                            <th>Product</th>
                            <th>Units/Case</th>
                            <th>Cost</th>
                            <th>Critical Level</th>
                            <th>Warehouse Qty</th>
                            <th>Qty on Street</th>
                            <th>Truck Qty</th>
                            <th>Average Cost</th>
                            <th>Average Profit</th>
                        </tr>
                        {
                            this.state.products.map( product => 
                                <tr className='product-name' key={product.id} onClick={() => this.handleProductClick(product)}>
                                    <td>{product.id}</td>
                                    <td>{product.data.name}</td>
                                    <td>{product.data.unitsPerCase}</td>
                                    <td>{product.data.lastCost}</td>
                                    <td>{product.data.critical}</td>
                                    <td>{product.data.warehouseQty}</td>
                                    <td>{product.data.inStoreQty}</td>
                                    <td>{product.data.inTruckQty}</td>
                                    <td>{product.data.avgCost}</td>
                                    <td>{product.data.avgProfit}</td>
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