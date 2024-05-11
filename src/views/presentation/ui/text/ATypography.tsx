import { Typography } from 'antd/es';
import { TYPOGRAPHY_TYPE } from '~/configs';

const ATypography = ({ variant = TYPOGRAPHY_TYPE.TEXT, ...props }) => {
  let TypographyComponent;

  switch (variant) {
    case TYPOGRAPHY_TYPE.TEXT:
      TypographyComponent = Typography.Text;
      break;
    case TYPOGRAPHY_TYPE.TITLE:
      TypographyComponent = Typography.Title;
      break;
    case TYPOGRAPHY_TYPE.PARAGRAPH:
      TypographyComponent = Typography.Paragraph;
      break;
    case TYPOGRAPHY_TYPE.LINK:
      TypographyComponent = Typography.Link;
      break;
    default:
      TypographyComponent = Typography.Text;
  }

  return <TypographyComponent {...props} />;
};

export default ATypography;
