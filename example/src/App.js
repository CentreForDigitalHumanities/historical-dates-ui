import React, { Component } from 'react'

import { DateAnnotatorComponent } from 'historical-dates-ui'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({ text: '' }, props);
        this.changeText = this.changeText.bind(this);
    }

    changeText(event) {
        this.setState({
            text: event.target.value
        });
    }

    render() {
        return (
            <div className="card">
                <div className="card-content">
                    <div className="field">
                        <label className="label">Transcribed Date</label>
                        <input className="input" type="text" value={this.state.text} onChange={this.changeText} />
                    </div>
                    <DateAnnotatorComponent text={this.state.text} />
                </div>
            </div>
        )
    }
}
