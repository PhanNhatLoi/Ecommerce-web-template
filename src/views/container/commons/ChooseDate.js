import { DatePicker } from 'antd/es';
import { findIndex, includes } from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { Trans } from 'react-i18next';
import { SegmentedControl } from 'segmented-control-react';
import styled from 'styled-components';
import UtilDate from '~/views/utilities/helpers/UtilDate';
import { getArray, getString, isNullOrEmpty } from '~/views/utilities/helpers/utilObject';
import { Color } from '~/views/utilities/layout';

const { RangePicker } = DatePicker;

const SegmentedControlStyle = styled.div`
  width: 100% !important;
  .r-segmented-control {
    background-color: transparent;
    border-bottom: none;
    border-left: none;
  }
  .r-segmented-control ul li.base.selected {
    background-color: ${Color.primary} !important;
    color: #fff !important;
  }
  .r-segmented-control ul {
    padding-left: 0px;
    padding-right: 0px;
    margin: 0px;
  }
  .r-segmented-control ul li.base {
    border-color: ${Color.primary} !important;
    color: ${Color.primary} !important;
  }
  .r-segmented-control ul li {
    height: 30px;
  }
`;

const RangePickerUI = styled(RangePicker)`
  /* margin-bottom: 1rem; */
  border-radius: 4px;
  input {
    text-align: center;
  }
`;

let dateType = {
  today: 'today',
  week: 'week',
  month: 'month',
  year: 'year',
  custom: 'custom',
  all: ''
};

let rangeDateTypes = [
  { name: <Trans i18nKey="today" />, type: dateType.today },
  { name: <Trans i18nKey="week" />, type: dateType.week },
  { name: <Trans i18nKey="month" />, type: dateType.month },
  { name: <Trans i18nKey="year" />, type: dateType.year },
  { name: <Trans i18nKey="select_date" />, type: dateType.custom },
  { name: <Trans i18nKey="all" />, type: dateType.all }
];

const initSegment = (types = ['today', 'week', 'month', 'year', 'custom', '']) => {
  let result = rangeDateTypes.filter((item) => includes(types, item.type));
  return result;
};

class ChooseDate extends React.Component {
  constructor(props) {
    super(props);
    const { defaultType, rangeType = ['today', 'week', 'month', 'year', 'custom', ''] } = this.props;
    this.state = {
      segments: initSegment(rangeType),
      selected: defaultType,
      prvSelected: defaultType
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.selected !== nextProps.defaultType) {
      this.setState(
        {
          selected: nextProps.defaultType,
          prvSelected: nextProps.defaultType
        },
        () => {
          let selectedIndex = findIndex(this.state.segments, { type: nextProps.defaultType });
          this.segmentedControl && this.segmentedControl.setState({ selectedSegment: selectedIndex });
        }
      );
    }
  }
  onChangeDateRange = (startDate, endDate, type) => {
    const { onChangeValues } = this.props;
    onChangeValues &&
      onChangeValues({
        from: startDate,
        to: endDate,
        type: type
      });
  };
  handleChange = (index) => {
    let selectedObject = this.state.segments.find((_, idx) => idx === index);
    this.setState({ selected: getString(selectedObject, 'type'), prvSelected: this.state.selected }, () => this.handleSelectedRange());
  };
  handleSelectedRange = () => {
    const { selected } = this.state;
    if (selected === dateType.today) {
      let rangeDate = UtilDate.getRangeDate('today');
      let strStart = UtilDate.toDateTimeUtc(rangeDate.from);
      let strEnd = UtilDate.toDateTimeUtc(rangeDate.to);

      this.onChangeDateRange(strStart, strEnd, this.state.selected);
    } else if (selected === dateType.week) {
      let rangeDate = UtilDate.getRangeDate('week');
      let strStart = UtilDate.toDateTimeUtc(rangeDate.from);
      let strEnd = UtilDate.toDateTimeUtc(rangeDate.to);

      this.onChangeDateRange(strStart, strEnd, this.state.selected);
    } else if (selected === dateType.month) {
      let rangeDate = UtilDate.getRangeDate('month');
      let strStart = UtilDate.toDateTimeUtc(rangeDate.from);
      let strEnd = UtilDate.toDateTimeUtc(rangeDate.to);

      this.onChangeDateRange(strStart, strEnd, this.state.selected);
    } else if (selected === dateType.year) {
      let rangeDate = UtilDate.getRangeDate('year');
      let strStart = UtilDate.toDateTimeUtc(rangeDate.from);
      let strEnd = UtilDate.toDateTimeUtc(rangeDate.to);

      this.onChangeDateRange(strStart, strEnd, this.state.selected);
    } else if (selected === dateType.all) {
      this.onChangeDateRange('', '', '');
    }
  };
  render() {
    let segmentTitle = this.state.segments.map((item) => ({ name: item.name }));
    let selectedIndex = findIndex(this.state.segments, { type: this.state.selected });
    // if( this.state.selected !== dateType.custom && selectedIndex === -1) return null
    if (selectedIndex === -1) {
      selectedIndex = this.state.segments.length;
    }

    return this.state.selected !== dateType.custom ? (
      <SegmentedControlStyle>
        <SegmentedControl
          segments={segmentTitle}
          selected={selectedIndex}
          ref={(c) => (this.segmentedControl = c)}
          variant="base"
          onChangeSegment={this.handleChange}
        />
      </SegmentedControlStyle>
    ) : (
      <RangePickerUI
        defaultValue={
          this.props.defaultFrom && this.props.defaultTo
            ? [
                moment.utc(this.props.defaultFrom, UtilDate.formatDateTimeServer).local(),
                moment.utc(this.props.defaultTo, UtilDate.formatDateTimeServer).local()
              ]
            : undefined
        }
        format={UtilDate.formatDateLocal}
        separator="~"
        onChange={(dates, dateStrings) => {
          let notEmptyDateStrings = (getArray(dateStrings) || []).filter((item) => !isNullOrEmpty(item));
          if (notEmptyDateStrings.length === 0) {
            this.onChangeDateRange('', '', '');
          } else {
            this.onChangeDateRange(
              UtilDate.toDateTimeUtc(dates[0].startOf('day')),
              UtilDate.toDateTimeUtc(dates[1].endOf('day')),
              dateType.custom
            );
          }
        }}
      />
    );
  }
}

export default ChooseDate;
