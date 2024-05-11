import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps, Space } from 'antd';
import ATypography from '../text/ATypography';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { useTranslation } from 'react-i18next';
import AButton from '../buttons/AButton';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { DownOutlined } from '@ant-design/icons';
import { BasicBtn } from '../buttons';
import COLOR from '~/views/utilities/layout/color';

type Props = {
  columns: any[]; // columns of table
  setColumns: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function SettingColumnsDropdown(props: Props) {
  const { t } = useTranslation(); // react-i18next translate
  const { columns, setColumns, setLoading } = props; // props params
  const [columnsVisiable, setColumnsVisiable] = useState(columns); // columns tạm thời để render trạng thái cho dropdown settings
  const [open, setOpen] = useState<boolean>(false);

  //   const newColumnToggle = (df) => {
  //     var newTableColumns = tableColumns.map((val) => {
  //       if (val.dataField === df) {
  //         val.hidden = !val.hidden;
  //       }
  //       return val;
  //     });
  //     setTableColumns(newTableColumns);
  //     const keysCurrentQueries = Object.keys(props.currentQueries);
  //     let newCurrentQueries = {};
  //     let flag = false;
  //     keysCurrentQueries.forEach((key) => {
  //       const tempKey = key.replace('To', '').replace('From', '');
  //       if (tempKey === df) flag = true;
  //       if (flag && tempKey !== df) newCurrentQueries[tempKey] = props.currentQueries[tempKey];
  //     });
  //     flag && props.getData(newCurrentQueries);
  //   };

  const handleChangeValue = (df: string) => {
    // thay đổi trạng thái hiển thị hoặc không hiển thị cột đó
    setColumnsVisiable(
      columnsVisiable.map((m) => {
        return {
          ...m,
          hidden: m.dataField === df ? !m.hidden : m.hidden
        };
      })
    );
  };

  // xác nhận những thay đổi
  const handleConfirm = () => {
    setOpen(false);
    setLoading(true);
    setTimeout(() => {
      setColumns(columnsVisiable);
      setLoading(false);
    }, 500); // delay 500ms for animation close dropdown smooth
  };

  // update lại trạng thái cột khi mở dropdown ra
  useEffect(() => {
    if (open) {
      setColumnsVisiable(columns);
    }
  }, [open]);

  // item của dropdown
  const items: MenuProps['items'] = columnsVisiable
    .filter((f) => !f.fixed) // không setting cho những cột fixed
    .map((column, i) => {
      return {
        label: (
          <li key={`NavStyled${i}`} style={{ position: 'relative' }} className={`navi-item ${column.hidden ? '' : 'active1'}`}>
            <AButton
              style={{ textAlign: 'start' }}
              key={column.dataField}
              className="btn w-100"
              data-toggle="button"
              aria-pressed={!column.hidden ? 'true' : 'false'}
              onClick={() => handleChangeValue(column.dataField)}>
              {!column.hidden && (
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Check.svg')} width={12} height={12} />
                </span>
              )}
              {column.hidden && (
                <span className="svg-icon svg-icon-md svg-icon-warning">
                  <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Minus.svg')} width={12} height={12} />
                </span>
              )}{' '}
              {column.text}
            </AButton>
          </li>
        ),
        key: column.dataField
      };
    });

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      open={open}
      dropdownRender={(menu) => (
        <div style={{ background: COLOR.White, border: `solid 1px ${COLOR.divider}`, borderRadius: '7px', paddingTop: '10px' }}>
          <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} className="ml-3 my-0 pb-3" strong>
            {t('column_display')}
          </ATypography>
          {React.cloneElement(menu as React.ReactElement)}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <BasicBtn type="primary" title="confirm" onClick={handleConfirm} />
            <BasicBtn type="ghost" title="cancel" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}>
      <div style={{ fontSize: '12px', cursor: 'pointer' }} onClick={(e) => setOpen(!open)}>
        <Space>
          {t('settings')}
          <DownOutlined />
        </Space>
      </div>
    </Dropdown>
  );
}

export default SettingColumnsDropdown;
