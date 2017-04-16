import React from 'react';
import $ from 'jquery';

let events = {};

setInterval(() => {
    $(events).trigger('calculateNext');
    $(events).trigger('renderNext');
}, 5000);

class Person extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alive: false,
            nextState: false
        }
    }
    timer() {
        setInterval(this.calculateNext(), 2000)
        setInterval(this.renderNext(), 2000);
    }
    isSelected(row, column) { //This is a function passed row and column inputs from calculateNext
        //Makes the world round
        let fieldSide = Math.sqrt(this.props.population.length); //Same as in calculateNext
        if (row == -1)
            row = fieldSide - 1;
        if (row == fieldSide)
            row = 0;

        if (column == -1)
            column = fieldSide - 1;
        if (column == fieldSide)
            column = 0;

        let id = row * fieldSide + column;
        //Simply returns whether the neighbor is alive
        return this.props.population[id].state.alive;
    }
    calculateNext() {
        //These calculations only work if population = 100
        //With different CSS, they can be accurate for other populations
        let neighborsAlive = 0;
        let fieldSide = Math.sqrt(this.props.population.length); //Same as in isSelected
        let rowPosition = Math.floor(this.props.id / fieldSide); //Assuming there's fieldSide people on each row, an id of 9 would be on row 0, and 10 would be on row 1
        let colPosition = this.props.id - rowPosition * fieldSide; //For id = 9, 9 - (0*10) = column 9. For id = 10, 10 - (1*10) = column 0.
        //console.log('Hi, I\'m on row ' + rowPosition + ' and column ' + colPosition + '. Alive? ' + this.state.alive);

        //Detects how many living neighboring people each person has
        if (this.isSelected(rowPosition - 1, colPosition))
            neighborsAlive += 1
        if (this.isSelected(rowPosition - 1, colPosition + 1))
            neighborsAlive += 1
        if (this.isSelected(rowPosition - 1, colPosition - 1))
            neighborsAlive += 1

        if (this.isSelected(rowPosition, colPosition + 1))
            neighborsAlive += 1
        if (this.isSelected(rowPosition, colPosition - 1))
            neighborsAlive += 1

        if (this.isSelected(rowPosition + 1, colPosition))
            neighborsAlive += 1
        if (this.isSelected(rowPosition + 1, colPosition + 1))
            neighborsAlive += 1
        if (this.isSelected(rowPosition + 1, colPosition - 1))
            neighborsAlive += 1

            //Apply Conway's rules for The Game of Life
        this.state.nextState = false;
        if (this.state.alive) {
            if (neighborsAlive < 2)
                this.state.nextState = false;
            if (neighborsAlive > 3)
                this.state.nextState = false;
            if (neighborsAlive === 2 || neighborsAlive === 3)
                this.state.nextState = true;
            }
        else if (neighborsAlive == 3) {
            this.state.nextState = true;
        }
    }
    renderNext() {
        this.setState({alive: this.state.nextState});
    }
    componentDidMount() {
        this.props.population[this.props.id] = this;
        $(events).on("calculateNext", this.calculateNext.bind(this));
        $(events).on('renderNext', this.renderNext.bind(this));
    }
    onClick(e) {
        e.preventDefault();
        this.setState({
            alive: !this.state.alive
        })
    }
    render() {
        return (<div className={this.state.alive
            ? 'person alive'
            : 'person'} onClick={this.onClick.bind(this)}/>);
    }
}
export default Person;
