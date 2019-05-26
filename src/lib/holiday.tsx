import * as React from 'react'
import { createDate, Calendar, calcEaster, HistoricalDate, InvalidDateException } from 'historical-dates';
import { RomanNumber, RomanNumberState } from './roman-number';

export type HolidayDay = 'easter' | 'septuagesima' | 'ashWednesday' | 'ascensionDay' | 'pentecost' | 'trinitySunday' | 'corpusChristi' | 'adventSunday' | 'unknown';
export type HolidayProps = {
    onChange: (value: HolidayProps) => void,
    day: HolidayDay,
    year: number | string,
    calendar: Calendar,
    valid?: boolean,
    readonly date?: HistoricalDate
}

export class Holiday extends React.Component<HolidayProps, HolidayProps> {
    static defaultProps = {
        onChange: function () { },
        day: 'easter',
        calendar: 'gregorian',
        valid: true
    }

    constructor(props: HolidayProps) {
        super(props);
        this.state = Object.assign({}, props);
    }

    componentWillReceiveProps(nextProps: HolidayProps) {
        this.setState((prevState, props) => {
            nextProps = Object.assign({}, props, prevState, nextProps);
            let yearValue: number;
            if (prevState.calendar !== nextProps.calendar) {
                let parsed = this.parseState(nextProps, props);
                yearValue = parsed.yearValue;
                nextProps = parsed.newState;
            } else {
                yearValue = RomanNumber.parseRomanNumber(nextProps.year).value;
            }

            if (RomanNumber.parseRomanNumber(prevState.year).value === yearValue) {
                nextProps.year = prevState.year;
            }
            return nextProps;
        });
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newProps = { [event.target.name]: event.target.value };

        this.setState((prevState, props) => {
            let newState = Object.assign({}, props, prevState, newProps);
            return this.parseState(newState, props).newState;
        });
    }

    changeYear(state: RomanNumberState) {
        this.setState((prevState, props) => {
            let newState = Object.assign({}, props, prevState, { year: state.text, valid: state.type !== 'invalid' });
            let vars = this.parseState(newState, props, state.type !== 'invalid').newState;
            return vars;
        });
    }

    parseState(newState: HolidayProps, props: HolidayProps, validYear = true) {
        let date: HistoricalDate;

        const year = newState.year.toString();
        const yearValue = RomanNumber.parseRomanNumber(year).value;
        if (validYear) {
            try {
                switch (newState.day) {
                    case 'easter':
                        date = calcEaster(yearValue, newState.calendar).sunday;
                        break;

                    case 'unknown':
                        date = createDate(yearValue, 1, 1, newState.calendar);
                        break;

                    default:
                        date = calcEaster(yearValue, newState.calendar)[newState.day];
                        break;
                }
            }
            catch (error) {
                if (error instanceof InvalidDateException) {
                    newState.valid = false;
                    return { newState, yearValue };
                } else {
                    throw error;
                }
            }

            newState = Object.assign(newState, { year, date, valid: validYear });
            props.onChange(newState);
        }

        return { newState, yearValue };
    }

    render() {
        const {
            day,
            year,
            valid
        } = this.state;
        return (
            <div className="field has-addons">
                <div className="control">
                    <div className="select">
                        <select name='day' value={day} onChange={this.change}>
                            <option value="easter">Easter</option>
                            <option value="septuagesima">Septuagesima</option>
                            <option value="ashWednesday">Ash Wednesday</option>
                            <option value="ascensionDay">Ascension Day</option>
                            <option value="pentecost">Pentecost</option>
                            <option value="trinitySunday">Trinity Sunday</option>
                            <option value="corpusChristi">Corpus Christi</option>
                            <option value="adventSunday">Advent Sunday</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                </div>
                <div className="control">
                    <RomanNumber className={valid ? "input" : "input is-danger"}
                        placeholder="year"
                        value={year}
                        onChange={this.changeYear.bind(this)} />
                </div>
            </div>
        )
    }
}
