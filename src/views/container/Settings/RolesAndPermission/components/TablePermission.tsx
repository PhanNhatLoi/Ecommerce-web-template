import React from 'react';
import { Checkbox, Table, Tooltip } from 'antd/es';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import * as Types from '../Types';
import { Link } from 'react-router-dom';

type Props = {
  title?: string;
  setData: React.Dispatch<React.SetStateAction<Types.DataSource[]>>;
  data: Array<Types.DataSource> | undefined; //for table
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  dataSubmit: any;
};

enum ACTION_PAGE {
  access = 'access',
  nonAccess = 'nonAccess',
  viewOnly = 'viewOnly'
}

const recursiveData = (data: any, path: string, actionPage: string, fullColumnData: any[]): any => {
  return data.map((m) => {
    let access = m.access;
    if (m.path.includes(path)) {
      access = {
        access: false,
        nonAccess: false,
        viewOnly: false,
        [actionPage]: true
      };
    }
    if (path.includes(m.path) && path !== m.path) {
      if (actionPage === ACTION_PAGE.access || ACTION_PAGE.viewOnly) {
        access = { access: true, nonAccess: false, viewOnly: false };
      }
      if (actionPage === ACTION_PAGE.nonAccess) {
        const filterChil = m.children.filter((f) => f.access.access);
        if (filterChil.length === 1 && filterChil[0].path === path) access = { access: false, nonAccess: true, viewOnly: false };
      }
    }
    return {
      ...m,
      children: m.children?.length ? recursiveData(m.children, path, actionPage, fullColumnData) : undefined,
      access: access
    };
  });
};

const TablePermission = (props: Props) => {
  const { t }: any = useTranslation();

  const handleChange = (e: any, path: string, actionPage: ACTION_PAGE) => {
    props.setData(recursiveData(props.data, path, actionPage, props.dataSubmit));
    props.setDirty(true);
  };

  const checkBoxRender = (row: any, action: any, tooltip: string) => {
    let indeterminate = false;
    let checked = false;
    if (row.children && row.children.every((f) => f?.access) && row.children.length > 0) {
      const access = row?.children?.filter((f) => f.access && f.access[action]);
      if (access && access.length && access.length < row?.children.length) {
        indeterminate = true;
        checked = false;
      } else {
        if (!row.children.some((s) => s.access[action] === false)) {
          indeterminate = false;
          checked = true;
        }
        if (row.children.some((s) => s.access[action] === false)) {
          indeterminate = false;
          checked = false;
        }
      }
    } else {
      checked = row.access ? row.access[action] : false;
    }

    return (
      <Tooltip placement="topLeft" title={t(tooltip).toString()}>
        <Checkbox
          disabled={row.disabledAction?.some((s) => s === action)}
          checked={checked}
          onChange={(e) => handleChange(e, row.path, action)}
          indeterminate={indeterminate}
          name={row.path}></Checkbox>
      </Tooltip>
    );
  };

  const columns: ColumnsType<Types.DataSource> = [
    // name
    {
      title: t('name').toString(),
      dataIndex: 'title',
      key: 'title',
      render: (cell) => {
        return <span>{t(cell).toString()}</span>;
      },
      width: '500px',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs']
    },
    // url
    {
      title: t('path').toString(),
      dataIndex: 'path',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      key: 'path',
      render: (cell, row) => {
        return (
          !row.children?.length && (
            <Link target="_blank" rel="noopener noreferrer" to={cell}>
              {cell}
            </Link>
          )
        );
      }
    },
    // access
    {
      title: t('allow_access').toString(),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '150px',
      render: (cell: string[], row: Types.DataSource, index: number) => {
        return checkBoxRender(row, ACTION_PAGE.access, 'allow_access');
      }
    },
    // non-access
    {
      title: t('non_access').toString(),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '170px',

      render: (cell: string[], row: Types.DataSource, index: number) => {
        return checkBoxRender(row, ACTION_PAGE.nonAccess, 'non_access');
      }
    },
    {
      title: t('view_only').toString(),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '170px',
      render: (cell: string[], row: Types.DataSource, index: number) => {
        return checkBoxRender(row, ACTION_PAGE.viewOnly, 'view_only');
      }
    }
  ];
  return (
    <BCard>
      <CardHeader titleHeader={props.title || ''}></CardHeader>
      <CardBody>
        <Table bordered columns={columns} pagination={{ defaultPageSize: 30 }} dataSource={props.data} />
      </CardBody>
    </BCard>
  );
};

export default TablePermission;
