import * as React from 'react';
import { Calendar, createDate, RomanDay, RomanText, RomanMonth, RomanDate, InvalidDateException, HistoricalDate } from 'historical-dates';

import { PlainDate } from './date';
import { Holiday, HolidayDay } from './holiday';
import { RomanDateComponent } from './roman-date';

/**
 * Only changes in text and onChange are handled after the component
 * has been created!
 */
export type DateAnnotatorProps = {
    calendar: Calendar;
    text: string,
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
    onChange: (value: DateAnnotatorProps) => void
}

export type DateAnnotatorState = {
    calendar: Calendar;
    text: string,
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
    static get defaultProps() {
        let today = new Date();
        let date = createDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), 'gregorian');
        let romanDate = RomanDate.fromDate(date);

        return {
            calendar: 'gregorian',
            date: date as HistoricalDate,
            holiday: 'easter',
            roman: romanDate,
            offsetDays: 0,
            onChange: function () { }
        }
    }

    constructor(props: DateAnnotatorProps) {
        super(props);

        this.state = {
            calendar: props.calendar,
            date: props.date,
            text: props.text,
            type: props.type,
            offsetDays: props.offsetDays,
            holiday: props.holiday,
            roman: props.roman,
            gregorianDate: props.date.toGregorian(),
            julianDate: props.date.toJulian()
        };
    }

    private deriveState(prevState: DateAnnotatorState, nextProps: any) {
        let nextState = Object.assign({
            calendar: prevState.calendar,
            date: prevState.date,
            offsetDays: prevState.offsetDays
        }, nextProps);
        nextState.offsetDays = parseInt(nextState.offsetDays || '0');
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
        // make sure the updated value is displayed
        newState.offsetDays = newState.offsetDays.toString()
        return newState;
    }

    private setDerivedState(nextProps: any) {
        this.setState((prevState) => {
            return this.deriveState(prevState, nextProps);
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
        let liveProps = {
            text: nextProps.text,
            onChange: nextProps.onChange
        }
        this.setState((prevState) => {
            if (prevState.text != liveProps.text) {
                try {
                    let roman = RomanDate.fromString(liveProps.text, this.state.calendar);
                    liveProps = Object.assign({}, liveProps, {
                        roman,
                        date: roman.toDate(),
                        type: 'roman'
                    });
                } catch (exception) {
                    if (!(exception instanceof InvalidDateException)) {
                        throw exception;
                    }

                    // The text couldn't be converted to a Roman date,
                    // so it probably isn't. Nothing to do here.
                }
            }

            return this.deriveState(prevState, liveProps);
        });
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
