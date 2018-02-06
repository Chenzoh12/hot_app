import React, { Component } from 'react';
import fire from './fire';

class Accounts extends Component { 
    constructor(props) {
        super(props);
        
        this.state = {
            accounts: [],
        };
        
        this.addAccount = this.addAccount.bind(this);
    }
    
    componentWillMount(){
        // Create reference to account db
        let accountDB = fire.database().ref('accounts').orderByKey();
        
        accountDB.on('child_added', snapshot => {
            // Update React state when account is added at Firebase Database
            let account = { data: snapshot.val(), id: snapshot.key };
            console.log(account.data);
            this.setState({ accounts: this.state.accounts.concat(account) });
        }) 
    }
    
    addAccount(e){
        //Prevent page refresh when new account added
        e.preventDefault();
        
        let newAccount = {
            name: this.name.value,
            contact: this.contact.value /*,
            unitsPerCase: this.unitsPerCase.value,
            critical: this.critical.value,
            warehouseQty: this.warehouseQty.value,
            inStoreQty: this.inStoreQty.value,
            inTruckQty: this.inTruckQty.value,*/
            
        }
        
        fire.database().ref('accounts').push( newAccount );
        
        document.getElementById("new-account-form").reset();
    }
    
    render() {
        return ( 
            <section>
                <form id="new-account-form" onSubmit={this.addAccount.bind(this)}>
                    Account Name: <input type='text' ref={name => this.name = name}/> <br/>
                    Contact:<input type='tel' ref={contact => this.contact = contact}/> <br/>
                    <input type='submit'/>
                </form>

                <table id='accountDB'>
                    <colgroup>
                        <col id='name'/>
                        <col id='contact'/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Account Name</th>
                            <th>Contact #</th>
                        </tr>
                        {
                            this.state.accounts.map( account => 
                                <tr className='account-name' key={account.id}>
                                    <td>{account.data.name}</td>
                                    <td>{account.data.contact}</td>
                                </tr>
                            )       
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}
export default Accounts;