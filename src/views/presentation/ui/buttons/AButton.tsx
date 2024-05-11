import { Button, ButtonProps as AntButtonProps } from 'antd/es';

type AButtonProps = AntButtonProps & {
  id?: string;
};

const AButton: React.FC<AButtonProps> = ({ ...props }) => {
  return (
    <Button
      {...props}
      style={{
        borderRadius: '7px',
        ...props.style
      }}
    />
  );
};

export default AButton;
