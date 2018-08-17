import * as React from 'react';
import { createDate, RomanDay, RomanText, RomanMonth, RomanDate, InvalidDateException, HistoricalDate } from 'historical-dates';

import { PlainDate } from './date';
import { Holiday, HolidayDay } from './holiday';
import { RomanDateComponent } from './roman-date';

export type DateAnnotatorProps = {
    text: string,
    onChange: (value: DateAnnotatorProps) => void
}

export type DateAnnotatorState = {
    calendar: 'gregorian' | 'julian';
    type: undefined | 'plain' | 'holiday' | 'roman',
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

export class DateAnnotatorComponent extends React.Component<DateAnnotatorProps, DateAnnotatorState> {
    static defaultProps = {
        onChange: function () { }
    }

    constructor(props: DateAnnotatorProps) {
        super(props);
        let date = new Date();
        let historicalDate = createDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

        let roman = RomanDate.fromDate(historicalDate);

        this.state = {
            calendar: 'gregorian',
            date: historicalDate,
            type: undefined,
            offsetDays: 0,
            holiday: 'easter',
            roman: roman,
            gregorianDate: historicalDate.toGregorian(),
            julianDate: historicalDate.toJulian()
        };
    }

    private setDerivedState(nextProps: any) {
        this.setState((prevState) => {
            let nextState = Object.assign({
                calendar: prevState.calendar,
                date: prevState.date,
                offsetDays: prevState.offsetDays
            }, nextProps);
            nextState.offsetDays = parseInt(nextState.offsetDays);
            // work-around for low date ranges not being support
            let offsetDate = nextState.date.year > 1000
                ? nextState.date.addDays(nextState.offsetDays)
                : nextState.date;
            let newState = Object.assign({}, nextState, {
                gregorianDate: offsetDate.toGregorian(),
                julianDate: offsetDate.toJulian()
            });
            if (!prevState.gregorianDate.equals(newState.gregorianDate) ||
                prevState.calendar != newState.calendar) {
                this.emitState(Object.assign(prevState, newState));
            }
            return newState;
        });
    }

    private emitState(newState: DateAnnotatorState) {
        let emitState: any = {
            calendar: newState.calendar,
            type: newState.type,
            offsetDays: newState.offsetDays,
            gregorianDate: newState.gregorianDate
        };

        if (newState.calendar == 'julian') {
            emitState['julianDate'] = newState.julianDate;
        }

        switch (newState.type) {
            case 'plain':
                emitState['date'] = newState.date;
                break;

            case 'holiday':
                emitState['holiday'] = newState.holiday;
                break;

            case 'roman':
                emitState['roman'] = {
                    day: newState.roman.day,
                    text: newState.roman.text,
                    month: newState.roman.month,
                    year: newState.roman.year
                };
                break;
        }

        this.props.onChange(emitState);
    }

    componentWillReceiveProps(nextProps: DateAnnotatorProps) {
        try {
            let roman = RomanDate.fromString(nextProps.text, this.state.calendar);
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
        this.setDerivedState(nextProps);
    }

    change = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setDerivedState({
            [event.target.name]: event.target.value
        });
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
                editor = <PlainDate onChange={(data) => {
                    this.setDerivedState({
                        date: createDate(data.year, data.month, data.day, data.calendar)
                    })
                }}
                    calendar={calendar}
                    day={date.day} month={date.month} year={date.year} />;
                break;
            case 'holiday':
                editor = <Holiday onChange={(data) => {
                    this.setDerivedState({ holiday: data.day, date: data.date, year: data.year })
                }}
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
                                <input type="radio" name="calendar" onChange={this.change} value="gregorian" checked={calendar == 'gregorian'} />
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
                                <input type="radio" name="calendar" onChange={this.change} value="julian" checked={calendar == 'julian'} />
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
                            <input type="radio" name="type" onChange={this.change} value="plain" checked={type == 'plain'} />
                            Plain date
                        </label>
                        <label className="radio">
                            <input type="radio" name="type" onChange={this.change} value="holiday" checked={type == 'holiday'} />
                            Holiday
                        </label>
                        <label className="radio">
                            <input type="radio" name="type" onChange={this.change} value="roman" checked={type == 'roman'} />
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
