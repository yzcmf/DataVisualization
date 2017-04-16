import React from 'react';

import Person from './Person.jsx';
import Field from './Field.jsx';
import Controls from './Controls.jsx';
import $ from 'jquery';

class App extends React.Component {
    constructor(props) {
        super(props);
        let num = [];
        for (let i = 0; i < 100; i++) {
            num.push(<Person key={i} id={i} population={num}/>);
        }
        this.state = {
            people: num
        }
    }
    render() {
        return (
            <div>
                <header>
                    <h1>John Conway's Game of Life</h1>
                </header>
                <main>
                    <Field people={this.state.people}/>
                    <Controls/>
                </main>
                <footer>
                    Coded by
                    <a href='https://charmedsatyr.com/' target='_blank'>CharmedSatyr</a>
                </footer>
            </div>
        )
    }
}

export default App;
