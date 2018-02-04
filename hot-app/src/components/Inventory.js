import React, { Component } from 'react';
import fire from './fire';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            cigars: []
        };
        
        this.addCigar = this.addCigar.bind(this);
    }
    
    componentWillMount(){
        // Create reference to cigar db
        let cigarDB = fire.database().ref('cigars').orderByKey();
        
        cigarDB.on('child_added', snapshot => {
            /* Update React state when cigar is added at Firebase Database */
            let cigar = { text: snapshot.val(), id: snapshot.key };
            this.setState({ cigars: [cigar].concat(this.state.cigars) });
        })
        
    }
    
    addCigar(e){
        
        //Prevent page refresh when new product added
        e.preventDefault();
        console.log("Here:" + this.name.value);
        
        fire.database().ref('cigars').push( this.name.value );
    }
    
    render() {
        return ( 
            <section>
                <form onSubmit={this.addCigar.bind(this)}>
                
                   <label>Cigar Name:</label> 
                   <input type='text' ref={newName => this.name = newName}/>
                   <input type='submit'/>
                   
                </form>

                <ol>
                    {
                        this.state.cigars.map( cigar => <li key={cigar.id}>{cigar.text}</li>)    
                        
                    }
                </ol>
            </section>
        );
    }
}
export default Inventory;