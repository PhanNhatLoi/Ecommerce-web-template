import { List, ListProps } from 'antd/es';
import { ListItemMetaProps, ListItemProps } from 'antd/es/list';

const AList: React.FC<ListProps<any>> = ({ ...props }) => <List {...props} />;

const AListItem: React.FC<ListItemProps> = ({ ...props }) => <List.Item {...props} />;

const AListItemMeta: React.FC<ListItemMetaProps> = ({ ...props }) => <List.Item.Meta {...props} />;

export { AList, AListItem, AListItemMeta };
