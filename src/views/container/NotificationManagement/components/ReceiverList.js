/* eslint-disable eqeqeq */
import { CloseCircleFilled, EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd/es';
import React from 'react';
import { DEFAULT_AVATAR } from '~/configs/default';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const ReceiverList = (props) => {
  return (
    <AList
      itemLayout="horizontal"
      style={{ maxHeight: 400, overflowY: 'scroll' }}
      dataSource={props.data}
      renderItem={(item) => (
        <AListItem>
          <AListItemMeta
            className="d-flex align-items-center"
            avatar={
              item?.avatar?.includes('http') ? (
                <Avatar
                  className="mr-3"
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  width={32}
                  src={!item?.avatar?.includes('http') ? firstImage(item?.avatar) : item?.avatar || DEFAULT_AVATAR}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <AuthAvatar
                  className="mr-3"
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  width={32}
                  isAuth={true}
                  src={!item?.avatar?.includes('http') ? firstImage(item?.avatar) : item?.avatar || DEFAULT_AVATAR}
                  // onClick={(e) => e.stopPropagation()}
                />
              )
            }
            title={item.name}
            description={formatPhoneWithCountryCode(
              item.phone,
              item.phone.startsWith('84') ? 'VN' : item.phone.startsWith('1') ? 'US' : 'VN'
            )}
          />
          <div>
            <AButton
              className="d-flex align-items-center"
              style={{ color: 'rgba(0, 0, 0, 0.25)' }}
              type="link"
              onClick={() =>
                props.setData(
                  props.data.filter((rec) => {
                    return rec.userId !== item.userId;
                  })
                )
              }
              icon={<CloseCircleFilled />}
            />
          </div>
        </AListItem>
      )}
    />
  );
};

export default ReceiverList;
