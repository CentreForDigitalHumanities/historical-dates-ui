import * as React from 'react'
import {
    InvalidDateException,
    HistoricalDate,
    RomanDate,
    RomanDay,
    RomanDays,
    RomanText,
    RomanTexts,
    RomanMonth,
    RomanMonths
} from 'historical-dates';

export type RomanDateProps = {
    onChange: (value: RomanDateProps) => void,
    calendar: 'gregorian' | 'julian',
    day: RomanDay,
    text: RomanText,
    month: RomanMonth,
    year: string,
    date?: HistoricalDate,
    valid?: boolean
}

export class RomanDateComponent extends React.Component<RomanDateProps, RomanDateProps> {
    static defaultProps = {
        onChange: function () { },
        calendar: 'gregorian',
        valid: true
    }

    constructor(props: RomanDateProps) {
        super(props);
        this.state = Object.assign({}, props);
    }

    componentWillReceiveProps(nextProps: RomanDateProps) {
        this.setState((prevState, props) => {
            nextProps = Object.assign({}, props, prevState, nextProps);
            if (prevState.calendar != nextProps.calendar) {
                nextProps = this.parseState(nextProps);
            }
            return nextProps;
        });
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newValue = { [event.target.name]: event.target.value };
        this.setState((prevState) => {
            let newState = Object.assign({}, prevState, newValue);
            return this.parseState(newState);
        });
    }

    parseState(newState: RomanDateProps) {
        let romanDate = new RomanDate(newState.day, newState.text, newState.month, newState.year, newState.calendar);
        try {
            let date = romanDate.toDate();
            newState = Object.assign({}, newState, { date, valid: true });
        } catch (error) {
            if (error instanceof InvalidDateException) {
                newState = Object.assign({}, newState, { valid: false });
            } else {
                throw error;
            }
        }
        if (newState.valid) {
            newState.onChange(newState);
        }
        return newState;
    }

    render() {
        const {
            day,
            text,
            month,
            year,
            valid
        } = this.state;
        const selectClassName = valid ? "select" : "select is-danger",
            inputClassName = valid ? "input" : "input is-danger";

        return (
            <div className="field has-addons">
                <div className="control">
                    <div className={selectClassName}>
                        <select name='day' value={day} onChange={this.change}>
                            {
                                Object.keys(RomanDays).map(romanDay =>
                                    <option key={romanDay} value={romanDay}>{romanDay}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className={selectClassName}>
                        <select name='text' value={text} onChange={this.change}>
                            {
                                Object.keys(RomanTexts).map(romanText =>
                                    <option key={romanText} value={romanText}>{romanText}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className={selectClassName}>
                        <select name='month' value={month} onChange={this.change}>
                            {
                                Object.keys(RomanMonths).map(romanMonth =>
                                    <option key={romanMonth} value={romanMonth}>{romanMonth}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <input className={inputClassName} name='year' type="text" value={year} onChange={this.change} />
                </div>
            </div>
        )
    }
}
