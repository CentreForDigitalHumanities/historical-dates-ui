import * as React from 'react'
import { calcEaster, HistoricalDate } from 'historical-dates';

export type HolidayDay = 'easter' | 'septuagesima' | 'ashWednesday' | 'ascensionDay' | 'pentecost' | 'trinitySunday' | 'corpusChristi' | 'adventSunday';
export type HolidayProps = {
    onChange: (value: HolidayProps) => void,
    day: HolidayDay,
    year: number,
    calendar: 'gregorian' | 'julian',
    readonly date?: HistoricalDate
}

export class Holiday extends React.Component<HolidayProps> {
    static defaultProps = {
        onChange: function () { },
        calendar: 'gregorian'
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newProps: HolidayProps = Object.assign(
            {},
            this.props,
            { [event.target.name]: event.target.value });

        let date: HistoricalDate;

        switch (newProps.day) {
            case 'easter':
                date = calcEaster(newProps.year, newProps.calendar).sunday;
                break;

            default:
                date = calcEaster(newProps.year, newProps.calendar)[newProps.day];
                break;
        }

        this.props.onChange(Object.assign(newProps, { date }));
    }

    render() {
        const {
            day,
            year
        } = this.props;
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
                    <input className="input" placeholder="year" name='year' type="number" value={year} onChange={this.change} />
                </div>
            </div>
        )
    }
}
