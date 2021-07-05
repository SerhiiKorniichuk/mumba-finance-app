import React, { Component } from 'react';
import Input from "reactstrap/es/Input";

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class extends Component {
   constructor(props) {
       super(props);
       this.state = {
           value: props.value
       };

   }
    componentWillMount() {
        this.timer = null;
    }

    handleChange = (value) => {
        clearTimeout(this.timer);

        this.setState({ value: value.currentTarget.value });

        this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    };

    handleKeyDown = (e) => {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    };

    triggerChange = () => {
        const { value } = this.state;
        console.log(value);
        this.props.onChange(value);
    };

    render() {
        return (
            <Input
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder={this.props.placeholder}
                className={this.props.className}
            />
        );
    }
}