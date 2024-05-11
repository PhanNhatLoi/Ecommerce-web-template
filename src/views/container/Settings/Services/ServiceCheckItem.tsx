import { EyeOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd/es';
import React from 'react';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { SettingCategoryResponse } from '~/state/ducks/settings/actions';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const ServicesCheckItemStyled = styled.div<any>`
  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: ${({ noAction }) => (noAction ? '' : 'pointer')};
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .service_image {
    min-height: 42px;
  }
`;

type ServiceCheckItemProps = React.HTMLAttributes<HTMLDivElement> & {
  handleCheckService: (service: SettingCategoryResponse) => void;
  item: SettingCategoryResponse;
  checked: boolean;
  iconCustom?: React.ReactNode;
  indeterminateService?: boolean;
  noAction?: boolean; // no action for no hover, click,...
};

const ServiceCheckItem: React.FC<ServiceCheckItemProps> = ({
  handleCheckService,
  item,
  checked,
  noAction,
  iconCustom,
  indeterminateService,
  className,
  ...rest
}) => {
  const onCheck = () => {
    handleCheckService(item);
  };

  let src = !item?.icon?.includes?.('http') ? firstImage(item?.icon) : item?.icon || DEFAULT_AVATAR;

  return (
    <ServicesCheckItemStyled
      noAction={noAction}
      className={`d-flex align-items-center justify-content-between gap-6 w-100 py-2 px-3 rounded-sm ${className}`}
      onClick={onCheck}
      {...rest}>
      <div className={`d-flex align-items-center gap-3 service_image ${item.parentCatalogId > 1 ? 'ml-10' : ''}`}>
        {iconCustom ? (
          iconCustom
        ) : (
          <AuthImage
            notHaveBorder
            preview={{
              mask: <EyeOutlined />
            }}
            width={40}
            isAuth={src && src !== DEFAULT_AVATAR}
            src={src}
          />
        )}
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} className="my-0">
          {item?.name}
        </ATypography>
      </div>
      <div className="check">
        <Checkbox checked={checked} disabled={noAction} indeterminate={indeterminateService} />
      </div>
    </ServicesCheckItemStyled>
  );
};

export default React.memo(ServiceCheckItem, (prev, next) => {
  return prev.item.icon === next.item.icon && prev.checked === next.checked && prev.indeterminateService === next.indeterminateService;
});
