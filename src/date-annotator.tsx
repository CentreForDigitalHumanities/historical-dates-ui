import * as React from 'react';
import { createDate, RomanDay, RomanText, RomanMonth, RomanDate, InvalidDateException, HistoricalDate } from 'historical-dates';

import { PlainDate } from './date';
import { Holiday, HolidayDay } from './holiday';
import { RomanDateComponent } from './roman-date';

export type DateAnnotatorProps = {
    onChange: (value: DateAnnotatorProps) => void,
    calendar: 'gregorian' | 'julian';
    text: string,
    type: 'plain' | 'holiday' | 'roman',
    date: HistoricalDate,
    holiday: HolidayDay,
    roman: {
        day: RomanDay,
        text: RomanText,
        month: RomanMonth,
        year: string,
    },
    offsetDays: number,
    gregorianDate: HistoricalDate,
    julianDate: HistoricalDate
}

export class DateAnnotatorComponent extends React.Component<DateAnnotatorProps, DateAnnotatorProps> {
    static defaultProps = {
        onChange: function () { },
        calendar: 'gregorian',
        offsetDays: 0
    }

    constructor(props: DateAnnotatorProps) {
        super(props);
        let date = new Date();
        let state = Object.assign({
            date: createDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
        }, props);

        let roman = RomanDate.fromDate(state.date);
        state.roman = roman;
        this.state = state;
    }

    private setDerivedState(nextProps: any) {
        this.setState(Object.assign({}, nextProps, {
            gregorianDate: nextProps.date.toGregorian(),
            julianDate: nextProps.date.toJulian()
        }));
    }

    componentWillReceiveProps(nextProps: DateAnnotatorProps) {
        try {
            let roman = RomanDate.fromString(nextProps.text, nextProps.calendar);
            nextProps = Object.assign({}, nextProps, {
                roman,
                date: roman.toDate(),
                type: 'roman'
            });
        } catch (exception) {
            if (!(exception instanceof InvalidDateException)) {
                throw exception;
            }
        }
        this.setDerivedState(Object.assign({}, this.state, nextProps));
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newState = Object.assign({}, this.state, { [event.target.name]: event.target.value });
        this.setDerivedState(newState);
        this.props.onChange(newState);
    }

    render() {
        const {
            calendar,
            date,
            holiday,
            roman,
            type,
            offsetDays,
            gregorianDate,
            julianDate
        } = this.state;
        let editor;
        switch (type) {
            case 'plain':
                editor = <PlainDate onChange={function () { }}
                    day={date.day} month={date.month} year={date.year} />;
                break;
            case 'holiday':
                editor = <Holiday onChange={function () { }}
                    calendar={calendar}
                    day={holiday}
                    year={date.year} />;
                break;
            case 'roman':
                editor = <RomanDateComponent
                    onChange={(data) => {
                        this.setDerivedState({ roman: data, date: data.date as HistoricalDate });
                    }}
                    calendar={calendar}
                    day={roman.day}
                    text={roman.text}
                    month={roman.month}
                    year={roman.year} />;
                break;
        }

        let offsetDaysField: string | JSX.Element = '',
            offsetDateDisplay: string | JSX.Element = '';
        if (type) {
            offsetDaysField = (<div className="field">
                <label className="label">Offset Days</label>
                <div className="control">
                    <input className="input" type="number" placeholder="0" name="offsetDays" value={offsetDays} onChange={this.change} />
                </div>
            </div>);
            offsetDateDisplay = <div className="columns">
                <div className="column">
                    <div className="field">
                        <div className="control">
                            <label className="radio">
                                <input type="radio" name="calendar" onChange={this.change} value="gregorian" checked={this.state.calendar == 'gregorian'} />
                                Gregorian Date
                            </label>
                        </div>
                    </div>
                    {gregorianDate.toString()}
                </div>
                <div className="column">
                    <div className="field">
                        <div className="control">
                            <label className="radio">
                                <input type="radio" name="calendar" onChange={this.change} value="julian" checked={this.state.calendar == 'julian'} />
                                Julian Date
                            </label>
                        </div>
                    </div>
                    {julianDate.toString()}
                </div>
            </div>
        }

        return (
            <div>
                <div className="field">
                    <div className="control">
                        <label className="radio">
                            <input type="radio" name="type" onChange={this.change} value="plain" checked={this.state.type == 'plain'} />
                            Plain date
                        </label>
                        <label className="radio">
                            <input type="radio" name="type" onChange={this.change} value="holiday" checked={this.state.type == 'holiday'} />
                            Holiday
                        </label>
                        <label className="radio">
                            <input type="radio" name="type" onChange={this.change} value="roman" checked={this.state.type == 'roman'} />
                            Roman date
                        </label>
                    </div>
                </div>
                {editor}
                {offsetDaysField}
                {offsetDateDisplay}
            </div>
        )
    }
}
