import * as React from 'react';
import { fromRomanNumber, InvalidDateException } from 'historical-dates';

type RomanNumberProps = {
    className: string,
    value: string | number,
    onChange: (state: RomanNumberState) => void
}

export type RomanNumberState = {
    text: string,
    valid: boolean,
    numeric: number
}

export class RomanNumber extends React.Component<RomanNumberProps, RomanNumberState> {
    static defaultProps = {
        className: '',
        value: '',
        onChange: () => { }
    }

    constructor(props: RomanNumberProps) {
        super(props);
        this.state = this.deriveState(props.value);
    }

    componentWillMount() {
        // bind keyup (arrows up/down)
    }

    componentWillReceiveProps(nextProps: RomanNumberProps) {
        this.setState(() => {
            return this.deriveState(nextProps.value);
        });
    }

    componentWillUnmount() {
        // unbind keyup
    }

    render() {
        const className = `${this.props.className} ${this.state.valid ? "input" : "input is-danger"}`.trimLeft();
        const value = this.state.text;
        return (
            <input className={className} type="text" value={value} onChange={this.change.bind(this)} />
        )
    }

    private change(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.deriveState(event.target.value));
    }

    private deriveState(value: string | number): RomanNumberState {
        let converted = this.parseRomanNumber(value);
        return {
            text: value.toString(),
            numeric: converted != undefined ? converted : 0,
            valid: converted != undefined
        }
    }

    private parseRomanNumber(value: string | number): number | undefined {
        let cleaned = `${value}`.toUpperCase().replace(/[^0-9MDCLXVI\.]/g, '');
        if (/[0-9\.]/.test(cleaned)) {
            // plain number
            return parseInt(cleaned);
        }
        try {
            return fromRomanNumber(cleaned);
        } catch (error) {
            if (error instanceof InvalidDateException) {
                return undefined;
            } else {
                throw error;
            }
        }
    }
}
