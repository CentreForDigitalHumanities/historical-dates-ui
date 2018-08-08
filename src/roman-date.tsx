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
        if (this.state.calendar != nextProps.calendar) {
            nextProps = this.parseState(nextProps);
            // if the calendar changes, the date needs to be recalculated
            this.props.onChange(nextProps);
        }
        this.setState(Object.assign({}, this.state, nextProps));
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newState = Object.assign({}, this.state, { [event.target.name]: event.target.value });
        this.props.onChange(this.parseState(newState));
    }

    parseState(newState: RomanDateProps) {
        let romanDate = new RomanDate(newState.day, newState.text, newState.month, newState.year, newState.calendar);
        try {
            let date = romanDate.toDate();
            console.log(date);
            newState = Object.assign({}, newState, { date, valid: true });
        } catch (error) {
            console.log(error);
            if (error instanceof InvalidDateException) {
                newState = Object.assign({}, newState, { valid: false });
            } else {
                throw error;
            }
        }

        return newState;
    }

    render() {
        const {
            day,
            text,
            month,
            year
        } = this.state;
        return (
            <div className="field has-addons">
                <div className="control">
                    <div className="select">
                        <select name='day' value={day} onChange={this.change}>
                            {
                                Object.keys(RomanDays).map(romanDay =>
                                    <option key={romanDay} value={romanDay}>{romanDay}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className="select">
                        <select name='text' value={text} onChange={this.change}>
                            {
                                Object.keys(RomanTexts).map(romanText =>
                                    <option key={romanText} value={romanText}>{romanText}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className="select">
                        <select name='month' value={month} onChange={this.change}>
                            {
                                Object.keys(RomanMonths).map(romanMonth =>
                                    <option key={romanMonth} value={romanMonth}>{romanMonth}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <input className="input" name='year' type="text" value={year} onChange={this.change} />
                </div>
            </div>
        )
    }
}
