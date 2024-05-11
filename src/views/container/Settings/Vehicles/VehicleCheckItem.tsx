import { Checkbox } from 'antd/es';
import React from 'react';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { SettingVehicleResponse } from '~/state/ducks/settings/actions';
import ATypography from '~/views/presentation/ui/text/ATypography';

const VehiclesCheckItemStyled = styled.div<any>`
  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: ${({ noAction }) => (noAction ? '' : 'pointer')};
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .vehicle_image {
    min-height: 26px;
  }
`;

type VehicleCheckItemProps = React.HTMLAttributes<HTMLDivElement> & {
  handleChangeVehicle: (vehicle: SettingVehicleResponse) => void;
  item: SettingVehicleResponse;
  checked: boolean;
  indeterminate?: boolean;
  noAction?: boolean; // no action for no hover, click,...
};

const VehicleCheckItem: React.FC<VehicleCheckItemProps> = ({
  handleChangeVehicle,
  item,
  checked,
  noAction,
  indeterminate,
  className,
  ...rest
}) => {
  const onCheck = () => {
    handleChangeVehicle(item);
  };

  // Open if need image
  // let src = !item?.icon?.includes?.('http') ? firstImage(item?.icon) : item?.icon || DEFAULT_AVATAR;

  return (
    <VehiclesCheckItemStyled
      noAction={noAction}
      className={`d-flex align-items-center justify-content-between gap-6 w-100 py-2 px-3 rounded-sm ${className}`}
      onClick={onCheck}
      {...rest}>
      <div className="d-flex align-items-center gap-3 vehicle_image">
        {/* <AuthImage
          // Open if need image
          notHaveBorder
          preview={{
            mask: <EyeOutlined />
          }}
          width={40}
          isAuth={src && src !== DEFAULT_AVATAR}
          src={src}
        /> */}
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} className="my-0">
          {item?.name}
        </ATypography>
      </div>
      <div className="check">
        <Checkbox checked={checked} disabled={noAction} indeterminate={indeterminate} />
      </div>
    </VehiclesCheckItemStyled>
  );
};

export default VehicleCheckItem;

// export default React.memo(VehicleCheckItem, (prev, next) => {
// return prev.item.icon === next.item.icon && prev.checked === next.checked; // Open if need image
//   return prev.checked === next.checked && prev.indeterminate === next.indeterminate;
// });
