import * as React from 'react'
import { calcEaster, HistoricalDate, InvalidDateException } from 'historical-dates';

export type HolidayDay = 'easter' | 'septuagesima' | 'ashWednesday' | 'ascensionDay' | 'pentecost' | 'trinitySunday' | 'corpusChristi' | 'adventSunday';
export type HolidayProps = {
    onChange: (value: HolidayProps) => void,
    day: HolidayDay,
    year: number | string,
    calendar: 'gregorian' | 'julian',
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
            if (prevState.calendar != nextProps.calendar) {
                nextProps = this.parseState(nextProps, props);
            }
            if (!/^\d+$/.test(prevState.year.toString())) {
                nextProps.year = prevState.year;
            }
            return nextProps;
        });
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newProps = { [event.target.name]: event.target.value };

        this.setState((prevState, props) => {
            let newState = Object.assign({}, props, prevState, newProps);
            return this.parseState(newState, props);
        });
    }

    parseState(newState: HolidayProps, props: HolidayProps) {
        let date: HistoricalDate;

        let year = newState.year.toString();
        if (/^[0-9]+$/.test(year)) {
            if (year == '0') {
                // Default is 0 but this also happens when the user clears
                // the input, to allow them to input a Roman date make the
                // input empty.
                year = '';
            }
        } else {
            year = year.replace(/[^MDCLXVI]/gi, '').toUpperCase();
        }

        try {
            switch (newState.day) {
                case 'easter':
                    date = calcEaster(year, newState.calendar).sunday;
                    break;

                default:
                    date = calcEaster(year, newState.calendar)[newState.day];
                    break;
            }
        }
        catch (error) {
            if (error instanceof InvalidDateException) {
                newState.valid = false;
                return newState;
            } else {
                throw error;
            }
        }

        newState = Object.assign(newState, { year, date, valid: true });
        props.onChange(newState);
        return newState;
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
                        </select>
                    </div>
                </div>
                <div className="control">
                    <input className={valid ? "input" : "input is-danger"} placeholder="year" name='year' type="text" value={year} onChange={this.change} />
                </div>
            </div>
        )
    }
}
