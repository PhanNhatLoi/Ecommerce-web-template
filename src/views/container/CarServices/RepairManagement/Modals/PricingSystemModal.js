import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Skeleton } from 'antd/es';
import objectPath from 'object-path';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const SearchStyled = styled(Input.Search)`
  .ant-input-affix-wrapper {
    border: 1px solid #000;
  }
`;

const SearchWrapStyled = styled.div`
  max-width: 100%;
  .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary) {
    border: 1px solid #000 !important;
    background: #000 !important;
    color: #fff !important;
  }
  .ant-btn .anticon {
    position: relative;
    top: -3px;
  }
  .ant-btn-primary[disabled] {
    border-color: #000;
  }
`;

const PricingSystemModal = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [needLoad, setNeedLoad] = useState(true);
  const [itemList, setItemList] = useState([]);

  const handleCancel = () => {
    props.setModalShow(false);
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    props
      .getPricingSystems({ size: 10, page: currentPage, keyword: searchKeyword })
      .then((res) => {
        setData([...data, ...res?.content]);
        setTotalItems(parseInt(objectPath.get(res.headers, 'x-total-count', 0)));
        setCurrentPage(currentPage + 1);
        setLoading(false);
        setNeedLoad(false);
      })
      .catch(() => {
        setLoading(false);
        setNeedLoad(false);
      });
  };

  useEffect(() => {
    setItemList(props.form.getFieldValue('items'));
  }, [props.form.getFieldValue('items')]);

  useEffect(() => {
    if (needLoad) {
      loadMoreData();
    }
  }, [needLoad]);

  const onSearch = (value) => {
    setSearchKeyword(value);
    setCurrentPage(0);
    setData([]);
    setNeedLoad(true);
  };

  return (
    <AntModal
      title={t('quotation_pricing_system')}
      description={t('')}
      width={600}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <SearchWrapStyled>
        <SearchStyled
          prefix={<SearchOutlined />}
          allowClear
          enterButton={<AButton type="primary">{t('find')}</AButton>}
          // size="large"
          name="searchText"
          placeholder={props.placeholder || t('search')}
          onSearch={onSearch}
        />
      </SearchWrapStyled>
      <div className="my-5">
        <ATypography className="text-muted">{`${totalItems} ${t('product/services')}`}</ATypography>
      </div>
      <div id="scrollableDiv">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < totalItems}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
          height={400}>
          <AList
            dataSource={data}
            renderItem={(item) => {
              const disabledFlag = itemList?.some((value) => value.name === item.name && value.price === item.price) || false;
              return (
                <AListItem key={item.id} className="pr-5">
                  <AListItemMeta
                    avatar={
                      <AuthImage
                        className="mx-2"
                        preview={{
                          mask: <EyeOutlined />
                        }}
                        width={64}
                        isAuth={true}
                        style={{ marginRight: '16px' }}
                        src={firstImage(item?.image) || DEFAULT_AVATAR}
                        // onClick={(e) => e.stopPropagation()}
                      />
                    }
                    title={item?.name}
                    description={
                      <div>
                        <ATypography>{`${t('code')}: ${item?.code || '-'}`}</ATypography>
                        <br />
                        <ATypography>{numberFormatDecimal(+item?.price, ' đ', '')}</ATypography>
                      </div>
                    }
                  />
                  <AButton type="primary" onClick={() => props.fillInItem(item)} disabled={disabledFlag}>
                    {t('add')}
                  </AButton>
                </AListItem>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </AntModal>
  );
};

export default connect(null, {
  getPricingSystems: quotationActions.getPricingSystems
})(PricingSystemModal);
