import { Image } from 'antd/es';
import { useTranslation } from 'react-i18next';
import { ACCEPT_VIDEO_UPLOAD } from '~/configs/upload';
import Divider from '~/views/presentation/divider';
import MTree from '~/views/presentation/fields/Tree';
import { MUpload } from '~/views/presentation/fields/upload';
import UploadImageCropMultiple from '~/views/presentation/fields/upload/UploadImageCropMultiple';
import ATypography from '~/views/presentation/ui/text/ATypography';

type PropsType = {
  treeValue: any[];
  setCheckedKeys: (arg0: any) => void;
  form: { setFieldsValue: (arg0: { categoryIds?: any; mainMedia?: any; subMedia?: any }) => void };
  setDirty: (arg0: boolean) => void;
  loading: boolean;
  isEditing: boolean;
  checkedKeys: any;
  image: any;
  subImage: string | any[];
};

function CreateProductMediaInfo(props: PropsType) {
  const { t }: any = useTranslation();
  const checkHasChildren = (child) => {
    if (child.length > 0) {
      return child.map((category) => {
        if (category) {
          return {
            key: category?.id,
            icon: <Image width={5} src={category?.icon} style={{ objectFit: 'contain' }} />,
            title: t(category?.name),
            index: category?.index,
            isDefault: category?.isDefault,
            children: category?.subCatalogs.length > 0 ? checkHasChildren(category?.subCatalogs) : []
          };
        }
      });
    } else {
      return [];
    }
  };
  const treeData = props.treeValue.map((category) => {
    return {
      key: category?.id,
      icon: <Image width={2} src={category?.icon} style={{ objectFit: 'contain' }} />,
      title: t(category?.name),
      index: category?.index,
      isDefault: category?.isDefault,
      children: category?.subCatalogs.length > 0 ? checkHasChildren(category?.subCatalogs) : []
    };
  });
  const getParentNode = (key, tree) => {
    let parentNode;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentNode = node;
        } else if (getParentNode(key, node.children)) {
          parentNode = getParentNode(key, node.children);
        }
      }
    }
    return parentNode;
  };

  // function of tree
  const onCheck = (checkedKeys, info) => {
    props.setDirty(true);
    props.setCheckedKeys(checkedKeys);
    const parentNode = getParentNode(checkedKeys[0], treeData);
    if (parentNode !== undefined) {
      const newCheckedKeys = [...checkedKeys, parentNode?.key];
      props.form.setFieldsValue({ categoryIds: newCheckedKeys });
    } else {
      props.form.setFieldsValue({ categoryIds: checkedKeys });
    }
  };

  const onImageChange = (file) => {
    props.setDirty(Boolean(file));
    if (file.every((f) => f.url.length > 0)) {
      props.form.setFieldsValue({
        mainMedia: file.map((cer) => {
          return {
            url: cer?.url,
            type: 'IMAGE'
          };
        })
      });
    }
  };
  const onVideoChange = (file) => {
    props.setDirty(Boolean(file));
    props.form.setFieldsValue({
      subMedia: (file || []).map((cer) => {
        return cer;
      })
    });
  };

  return (
    <div className="mt-10">
      {treeData.length > 0 && (
        <MTree
          noLabel
          loading={props.loading}
          require={true}
          noPadding
          disabled={!props.isEditing}
          checkStrictly={false}
          treeData={treeData}
          onCheck={onCheck}
          checkedKeys={props.checkedKeys}
          label={t('select_category')}
          name="categoryIds"
        />
      )}
      <Divider />
      <UploadImageCropMultiple
        name="mainMedia"
        label={t('main_image')}
        noLabel
        noPadding
        require
        fileList={props.image}
        disabled={!props.isEditing}
        uploadText={t('upload_image')}
        onImageChange={onImageChange}
        maximumUpload={10}
        aspect={1 / 1}
        tooltip={{
          title: t('required_field'),
          icon: (
            <span>
              (<ATypography type="danger">*</ATypography>)
            </span>
          )
        }}
      />
      <Divider />
      {!props.isEditing && props.subImage.length < 1 ? (
        ''
      ) : (
        <MUpload //
          noLabel
          accept={ACCEPT_VIDEO_UPLOAD.join(', ')}
          noPadding
          maximumUpload={1}
          disabled={!props.isEditing}
          fileList={props.subImage}
          maxCount={1}
          name="subMedia"
          require={false}
          label={t('video_display')}
          onImageChange={onVideoChange}
        />
      )}
    </div>
  );
}

export default CreateProductMediaInfo;
