import React, { Component } from 'react';
import fire from './fire';
// eslint-disable-next-line
import _ from 'lodash';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        //Create reference to inventory db
        this.inventory = fire.database().ref('inventory');
        
    
        //Declare state variables
        this.state = {
            products: [],
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedProduct: {}
        };
        

 
        
        //Either bind here on when linking for form this. EX: add.product.bind(this)
        this.addProduct = this.addProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    
    componentWillMount(){
        let invList = [];
        this.inventory.once('value', (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                let product = { data: childSnapshot.val(), id: childSnapshot.key };
                invList.push(product);
            });
            this.setState({products: invList});
        });
    }
    
    componentDidMount(){
        
        this.inventory.on('child_changed', snapshot => {
            console.log('change fired');
            
            let changedProduct = { data: snapshot.val(), id: snapshot.key };
            console.log(changedProduct);
            let newList = [];
            
            //Push changed product into state
            this.state.products.forEach( (product) => { product.id === changedProduct.id ? newList.push(changedProduct) : newList.push(product); });
            this.setState({products: newList});
        });
        
        this.inventory.on('child_removed', snapshot => {
            console.log('removed fire');
            
            let removedProduct = this.state.selectedProduct.id;
            let newList = [];
            
            //Remove selected product
            // eslint-disable-next-line
            this.state.products.forEach( (product) => {  if(product.id !== removedProduct){  newList.push(product) }});
            this.setState({products: newList, selectedProduct: {} });
        });
    }
    
    addProduct(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        //Initialize product
        var newProduct = {
            name: this.name.value,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            currentQty: this.currentQty.value,
            lastCost: 0,
            inStoreQty: 0,
            inTruckQty: 0,
            avgCost: 0,
            avgProfit: 0
        };
        
        //Validate name is unique
        //Use loop or firebase query on name
        
        //Push new product into db, update state, reset form
        this.inventory.push( newProduct );
        this.setState({ showAddForm: false });
        document.getElementById("newProductForm").reset();
    }
    
    handleProductClick(product){
        console.log('selected: ' + product.data.name);
        this.setState({selectedProduct: product});
    }
    
    handleCancel(){
        this.setState({
            showAddForm: false,
            showEditForm: false,
            showDeleteForm: false,
            selectedProduct: {}
        });
    }
    
    editProduct(e){
        e.preventDefault();
        
        fire.database().ref('inventory/' + this.state.selectedProduct.id).update({ 
            name: this.name.value ? this.name.value : this.state.selectedProduct.data.name,
            unitsPerCase: this.unitsPerCase.value ? this.unitsPerCase.value : this.state.selectedProduct.data.unitsPerCase,
            critical: this.critical.value ? this.critical.value : this.state.selectedProduct.data.unitsPerCase,
            currentQty: this.currentQty.value
        });
        
        this.setState({ showEditForm: false, selectedProduct: {} }); 
        document.getElementById("editProductForm").reset(); 
    }
    
    deleteProduct(e){
        e.preventDefault();
        
        fire.database().ref('inventory/' + this.state.selectedProduct.id).remove();
        
        this.setState({ showDeleteForm: false }); 
    }
    
    render() {
        //Declare form boolean variables
        const{showAddForm} = this.state;
        const{showEditForm} = this.state;
        const{showDeleteForm} = this.state;
        
        return ( 
            <section>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <h1 className="h2">Inventory</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            <button className='btn btn-outline-success' onClick={() => this.setState({ showAddForm: true })}>Add Product</button>
                            <button className='btn btn-outline-primary' onClick={() => this.setState({ showEditForm: true })}>Edit Product</button>
                            <button className='btn btn-outline-danger' onClick={() => this.setState({ showDeleteForm: true })}>Delete Product</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive'>
                    
                    
                    { showAddForm ?
                     <form className='form-inline' id="newProductForm" onSubmit={this.addProduct}>
                        
                        <div className='form-group'>
                            <label>Product Name:</label>
                            <input className='form-control' type='text' ref={name => this.name = name}/>
                        </div>
                        
                        <div className='form-group'>
                            <label >Units/Case: </label>
                            <input className='form-control' type='number' ref={unitsPerCase => this.unitsPerCase = unitsPerCase}/> <br/>
                        </div>
                        
                        <div className='form-group'>
                            <label>Critical:</label>    
                            <input className='form-control' type='number' ref={critical => this.critical = critical}/> <br/>
                        </div>
                        
                        <div className='form-group'>
                            <label>Initial Count:</label>
                            <input className='form-control' type='number' ref={currentQty => this.currentQty = currentQty}/> <br/>
                        </div>
                        
                        <div>
                            <button type='submit' className='btn btn-success'>Submit</button>
                            <button className='btn btn-danger'onClick={this.handleCancel}>Cancel</button>
                        </div>
                        
                    </form>
                    
                    
                    // If showAddForm = false hide form
                    : null
                    }
                    
                    { showEditForm ?
                    
                     <form id="editProductForm" onSubmit={this.editProduct}>
                        Product Name: <input type='text' placeholder={this.state.selectedProduct.name} ref={name => this.name = name} /> <br/>
                        Units/Case: <input type='number' placeholder={this.state.selectedProduct.unitsPerCase}  ref={unitsPerCase => this.unitsPerCase = unitsPerCase}/> <br/>
                        Critical Level:<input type='number' placeholder={this.state.selectedProduct.critical} ref={critical => this.critical = critical}/> <br/>
                        Quantity:<input type='number' placeholder={this.state.selectedProduct.currentQty} ref={currentQty => this.currentQty = currentQty}/> <br/>
                        <input type='submit'/>
                        <button onClick={this.handleCancel} type='button'>Cancel</button>
                    </form>
                    
                    : null
                    }
                    
                    { showDeleteForm ? 
                    
                    <form id="deleteProductForm"> 
                        <button onClick={this.deleteProduct} type='button'>Confirm</button> <button onClick={this.handleCancel} type='button'>Cancel</button> 
                    </form> 
                    
                    : null
                        
                    }
                    
                    <table className='table table-striped table-sm' id='inventory'>
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
                                <th>Warehouse</th>
                                <th>Machines</th>
                                <th>Truck</th>
                                <th>Avg. Cost</th>
                                <th>Avg. Profit</th>
                            </tr>
                            {
                                
                                this.state.products.map( product => 
                                    <tr className='product-name' style={{cursor: 'pointer'}} key={product.id} onClick={() => this.handleProductClick(product)}>
                                        <td>{product.id}</td>
                                        <td>{product.data.name}</td>
                                        <td>{product.data.unitsPerCase}</td>
                                        <td>{product.data.lastCost}</td>
                                        <td>{product.data.critical}</td>
                                        <td>{product.data.currentQty}</td>
                                        <td>{product.data.inStoreQty}</td>
                                        <td>{product.data.inTruckQty}</td>
                                        <td>{product.data.avgCost}</td>
                                        <td>{product.data.avgProfit}</td>
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
export default Inventory;