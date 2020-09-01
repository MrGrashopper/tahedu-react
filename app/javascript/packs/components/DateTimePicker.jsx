import React from 'react';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import {FormControl} from 'react-bootstrap'
import moment from "moment"

class DateTimeRangePicker extends React.Component {

    constructor(props){
        super(props);
        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        this.state = {
            start : start,
            end : end
        }

        this.applyCallback = this.applyCallback.bind(this);
    }

    applyCallback(startDate, endDate){
        this.setState({
                start: startDate,
                end : endDate
            }
        )
    }


    render(){
        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        let ranges = {
            "Today Only": [moment(start), moment(end)],
            "3 Days": [moment(start).subtract(3, "days"), moment(end)]
        }
        let local = {
            "format":"DD-MM-YYYY HH:mm",
            "sundayFirst" : false
        }
        let maxDate = moment(start).add(24, "hour")
        let value = `${this.state.start.format("DD-MM-YYYY HH:mm")} - ${this.state.end.format("DD-MM-YYYY HH:mm")}`;
        return(
            <div>
                <DateTimeRangeContainer
                    ranges={ranges}
                    start={this.state.start}
                    end={this.state.end}
                    local={local}
                    maxDate={maxDate}
                    applyCallback={this.applyCallback}
                >
                    <FormControl
                        id="formControlsTextB"
                        value={value}
                        type="text"
                        label="Text"
                        placeholder="auswählen"
                    />
                </DateTimeRangeContainer>
            </div>
        );
    }
}
export default DateTimeRangePicker