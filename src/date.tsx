import * as React from 'react';

export type DateProps = {
    onChange: (value: DateProps) => void,
    day: number,
    month: number,
    year: number
}

/**
 * Extremely primitive date component: with easy input of old years (1500ish)
 */
export class PlainDate extends React.Component<DateProps> {
    static defaultProps = {
        onChange: function () { }
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.props.onChange(Object.assign({}, this.props, { [event.target.name]: event.target.value }));
    }

    render() {
        const {
            day,
            month,
            year
        } = this.props;
        return (
            <div className="field has-addons">
                <div className="control">
                    <div className="select">
                        <select name='day' value={day} onChange={this.change}>
                            {
                                this.days().map(dateDay =>
                                    <option key={dateDay} value={dateDay}>{dateDay}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <div className="select">
                        <select name='month' value={month} onChange={this.change}>
                            {
                                ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((dateMonth, index) =>
                                    <option key={index} value={index + 1}>{dateMonth}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="control">
                    <input className="input" name='year' type="number" value={year} onChange={this.change} />
                </div>
            </div>
        )
    }

    days() {
        let days = [];
        for (let day = 1; day < 32; day++) {
            days.push(day);
        }
        return days;
    }
}
