import * as React from 'react';
import { fromRomanNumber, toRomanNumber, InvalidDateException } from 'historical-dates';

type RomanNumberProps = {
    className: string,
    placeholder?: string,
    value: string | number,
    onChange: (state: RomanNumberState) => void
}

export type RomanNumberState = {
    type: 'roman' | 'arabic' | 'invalid',
    text: string,
    value: number
}

export class RomanNumber extends React.Component<RomanNumberProps, RomanNumberState> {
    static defaultProps = {
        className: '',
        value: '',
        onChange: () => { }
    }

    constructor(props: RomanNumberProps) {
        super(props);
        this.state = RomanNumber.parseRomanNumber(props.value);
    }

    componentWillReceiveProps(nextProps: RomanNumberProps) {
        this.setState(() => {
            return RomanNumber.parseRomanNumber(nextProps.value);
        });
    }

    render() {
        const className = `${this.props.className} ${this.state.type !== 'invalid' ? "input" : "input is-danger"}`.trimLeft();
        const value = this.state.text;
        return (
            <input spellCheck={false}
                className={className}
                type="text"
                value={value}
                placeholder={this.props.placeholder}
                onKeyDown={this.keydown.bind(this)}
                onChange={this.change.bind(this)} />
        )
    }

    private keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        switch (event.keyCode) {
            // down
            case 40:
                this.shiftNumber(true);
                break;

            // up
            case 38:
                this.shiftNumber(false);
                break;
        }
    }

    private change(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(RomanNumber.parseRomanNumber(event.target.value));
    }

    private shiftNumber(increase: boolean) {
        this.setState((prevState) => {
            if (prevState.type === 'invalid') {
                return {} as any;
            }
            const parsed = RomanNumber.parseRomanNumber(prevState.text);
            if (parsed.type === 'invalid') {
                return {} as any;
            }

            const newValue = parsed.value + (increase ? 1 : -1);
            const vals = {
                text: parsed.type === 'roman'
                    ? toRomanNumber(newValue)
                    : newValue.toString(),
                numeric: newValue
            };

            this.props.onChange(RomanNumber.parseRomanNumber(vals.text));

            return vals;
        });
    }

    static parseRomanNumber(text: string | number): RomanNumberState {
        //  \. is correct
        // eslint-disable-next-line
        let cleaned = `${text}`.toUpperCase().replace(/[\. ]/g, '').trim();
        if (/^[0-9]+$/.test(cleaned)) {
            // plain number
            return { type: 'arabic', text: text.toString(), value: parseInt(cleaned) };
        }
        try {
            return { type: 'roman', text: text.toString(), value: fromRomanNumber(cleaned) };
        } catch (error) {
            if (error instanceof InvalidDateException) {
                return { type: 'invalid', text: text.toString(), value: 0 };
            } else {
                throw error;
            }
        }
    }
}
