import React, { Component } from 'react'

import { DateAnnotatorComponent } from 'historical-dates-ui'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({ text: '', data: '' }, props);
        this.changeText = this.changeText.bind(this);
        this.displayState = this.displayState.bind(this);
    }

    changeText(event) {
        let text = event.target.value;
        this.setState((prevState) => ({
            data: Object.assign({}, prevState.data, { text }),
            text
        }));
    }

    displayState(data) {
        this.setState({
            data
        });
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-content">
                        <div className="field">
                            <label className="label">Transcribed Date</label>
                            <input className="input" type="text" value={this.state.text} onChange={this.changeText} />
                        </div>
                        <DateAnnotatorComponent text={this.state.text} onChange={this.displayState} />
                    </div>
                </div>
                <br />
                <pre className="code">{JSON.stringify(this.state.data, null, 4)}</pre>
            </div>
        )
    }
}
