import React, { Component } from 'react';
import fire from './fire';

class Inventory extends Component { 
    constructor(props) {
        super(props);
        this.state = { 
            cigars: []   
            
        };
    }
    
    componentWillMount(){
        /* Create reference to cigars in Firebase Database */
        let cigarsRef = fire.database().ref('cigars').orderByKey().limitToLast(350);
        cigarsRef.on('child_added', snapshot => {
            /* Update React state when cigar is added at Firebase Database */
            let cigar = { text: snapshot.val(), id: snapshot.key };
            this.setState({ cigars: [cigar].concat(this.state.cigars) });
        })
    }
    
    addCigar(e){
        e.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        fire.database().ref('cigars').push( this.inputEl.value );
        this.inputEl.value = ''; // <- clear the input
    }
    
    render() {
        return ( 
            <section>
                <form onSubmit={this.addCigar.bind(this)}>
                <input type="text" ref={ el => this.inputEl = el }/>
                <input type="submit"/>
                    <ul>
                    { /* Render the list of cigars */
                        this.state.cigars.map( cigar => <li key={cigar.id}>{cigar.text}</li> )
                    }
                </ul>
                </form>
                

            </section>
        );
    }
}
export default Inventory;