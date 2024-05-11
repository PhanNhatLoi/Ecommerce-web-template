import { isNil } from 'lodash-es';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose, lifecycle, withState } from 'recompose';
import { getDistrictList, getWardsList } from '~/state/ducks/actions/product';
import { InputField, SelectField } from '~/views/presentation/ui/fields';
import { getArray } from '~/views/utilities/helpers/utilObject';

const messages = defineMessages({
  ITEM_PHONE: {
    id: 'ITEM_PHONE',
    defaultMessage: 'Số điện thoại'
  },
  ITEM_PHONE_TYPE: {
    id: 'ITEM_PHONE_TYPE',
    defaultMessage: 'Loại'
  },
  ITEM_ADDRESS1: {
    id: 'ITEM_ADDRESS1',
    defaultMessage: 'Số nhà / Tên đường cụ thể'
  },
  ITEM_WEBSITE: {
    id: 'ITEM_WEBSITE',
    defaultMessage: 'website'
  },
  ITEM_ADDRESS: {
    id: 'ITEM_ADDRESS',
    defaultMessage: 'Địa chỉ'
  },
  ITEM_PROVINCES: {
    id: 'ITEM_PROVINCES',
    defaultMessage: 'Tỉnh/Thành'
  },
  ITEM_DISTRICT: {
    id: 'ITEM_DISTRICT',
    defaultMessage: 'Quận/Huyện'
  },
  ITEM_WARDS: {
    id: 'ITEM_WARDS',
    defaultMessage: 'Phường/Xã'
  }
});

const handleFetchDistricts = (props, provinceId) => {
  const { getDistrictList, setDistricts } = props;
  getDistrictList(provinceId)
    .then((res) => {
      setDistricts(
        (getArray(res) || []).map((item) => ({
          value: item.id,
          label: item.name
        }))
      );
    })
    .catch((err) => {});
};

const handleFetchWards = (props, districtId) => {
  const { getWardsList, setWards } = props;
  getWardsList(districtId)
    .then((res) => {
      setWards(
        (getArray(res) || []).map((item) => ({
          value: item.id,
          label: item.name
        }))
      );
    })
    .catch((err) => {});
};

class AddressInputFields extends React.PureComponent {
  onChangeProvice = (value) => {
    const { index, handleChangeAddressItem, setDistricts, setWards } = this.props;
    handleChangeAddressItem('provinceId', index)(value);
    setDistricts([]);
    setWards([]);
    handleFetchDistricts(this.props, value);
  };

  onChangeDistrict = (value) => {
    const { index, handleChangeAddressItem, setWards } = this.props;
    handleChangeAddressItem('districtId', index)(value);
    setWards([]);
    handleFetchWards(this.props, value);
  };
  render() {
    const { index, address1, provinceId, districtId, wardsId, lng, lat, fMsg, provinces, handleChangeAddressItem, districts, wards } =
      this.props;

    // console.log(JSON.stringify(districts, undefined, 2));
    return (
      <div>
        <InputField
          type="text"
          value={address1}
          mBottom="0px"
          onChange={handleChangeAddressItem('address1', index)}
          label={fMsg(messages.ITEM_ADDRESS1)}
          placeholder={fMsg(messages.ITEM_ADDRESS1)}
        />
        <SelectField
          data={provinces || []}
          className="mb-0"
          defaultValue={provinceId}
          value={provinceId}
          onChange={this.onChangeProvice}
          iconEnd="caret-down"
          label={fMsg(messages.ITEM_PROVINCES)}
          placeholder={fMsg(messages.ITEM_PROVINCES)}
        />

        <SelectField
          data={districts || []}
          className="mb-0"
          defaultValue={districtId}
          value={districtId}
          onChange={this.onChangeDistrict}
          iconEnd="caret-down"
          label={fMsg(messages.ITEM_DISTRICT)}
          placeholder={fMsg(messages.ITEM_DISTRICT)}
        />

        <SelectField
          data={wards || []}
          className="mb-0"
          defaultValue={wardsId}
          value={wardsId}
          onChange={handleChangeAddressItem('wardsId', index)}
          iconEnd="caret-down"
          label={fMsg(messages.ITEM_WARDS)}
          placeholder={fMsg(messages.ITEM_WARDS)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getDistrictList: getDistrictList,
  getWardsList: getWardsList
};
export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withState('districts', 'setDistricts', []),
  withState('wards', 'setWards', []),

  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (isNil(this.props.provinceId) && isNil(this.props.districtId) && !isNil(nextProps.provinceId) && !isNil(nextProps.districtId)) {
        handleFetchDistricts(nextProps, nextProps.provinceId);
        handleFetchWards(nextProps, nextProps.districtId);
      }
    }
  })
)(AddressInputFields);
