import React, { Component } from 'react';
import fire from './fire';

class assetDB extends Component { 
    constructor(props) {
        super(props);
        
       
        
        this.state = {
            assets: [],
        };
        
        this.addAsset = this.addAsset.bind(this);
    }
    
    componentWillMount(){
        // Create reference to asset db
        let assetDB = fire.database().ref('assets').orderByKey();
        
        assetDB.on('child_added', snapshot => {
            // Update React state when asset is added at Firebase Database
            let asset = { data: snapshot.val(), id: snapshot.key };
            console.log(asset.data);
            this.setState({ assets: this.state.assets.concat(asset) });
        }) 
    }
    
    addAsset(e){
        //Prevent page refresh when new asset added
        e.preventDefault();
        
        var newasset = {
            serial: this.serial.value,
            model: this.model.value /*,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value,*/
            
        }
        
        fire.database().ref('assets').push( newasset );
        
        document.getElementById("new-asset-form").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="new-asset-form" onSubmit={this.addAsset.bind(this)}>
                    Asset Code: <input type='text' ref={serial => this.serial = serial}/> <br/>
                    Model:<input type='text' ref={model => this.model = model}/> <br/>
                    <input type='submit'/>
                </form>

                <table id='assetDB'>
                    <colgroup>
                        <col id='serial-number'/>
                        <col id='model'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Serial Number</th>
                            <th>Model</th>
                        </tr>
                        {
                            this.state.assets.map( asset => 
                                <tr className='asset-name' key={asset.id}>
                                    <td>{asset.data.serial}</td>
                                    <td>{asset.data.model}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default assetDB;