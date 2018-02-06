import React, { Component } from 'react';
import fire from './fire';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            cigars: [],

        };
        
        this.addCigar = this.addCigar.bind(this);
    }
    
    componentWillMount(){
        // Create reference to cigar db
        let cigarDB = fire.database().ref('cigars').orderByKey();
        
        cigarDB.on('child_added', snapshot => {
            // Update React state when cigar is added at Firebase Database
            let cigar = { data: snapshot.val(), id: snapshot.key };
            console.log(cigar.data);
            this.setState({ cigars: this.state.cigars.concat(cigar) });
        }) 
    }
    
    addCigar(e){
        //Prevent page refresh when new product added
        e.preventDefault();
        
        var newProduct = {
            name: this.name.value,
            cost: this.cost.value
        }
        
        fire.database().ref('cigars').push( newProduct );
    }
    
    render() {
        return ( 
            <section>
                <form onSubmit={this.addCigar.bind(this)}>
                
                   <label>Cigar Name:</label> 
                   <input type='text' ref={newName => this.name = newName}/>
                    <label>Cost:</label> 
                   <input type='number' ref={newCost => this.cost = newCost}/>
                   <input type='submit'/>
                   
                </form>

                <ol>
                    {
                    this.state.cigars.map( cigar => <li key={cigar.id}>{cigar.data.name}{cigar.data.cost}</li>)       
                        
                    }
                </ol>
            </section>
        );
    }
}
export default Inventory;