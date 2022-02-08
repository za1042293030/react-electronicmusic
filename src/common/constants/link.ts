import {
  TagOutlined,
  AlignLeftOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { ILink } from '../typings';

const linkList: ILink[] = [
  {
    path: '/client/style',
    name: '风格',
    icon: TagOutlined,
  },
  {
    path: '/client/albums',
    name: '专辑',
    icon: PlayCircleOutlined,
  },
  {
    path: '/client/dynamics',
    name: '动态',
    icon: AlignLeftOutlined,
  },
];
export { linkList };
