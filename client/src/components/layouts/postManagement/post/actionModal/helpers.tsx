import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

export const actionsMenu = [
  {
    title: 'Edit',
    icon: <AiOutlineEdit fontSize={20} />,
  },
  {
    title: 'Delete',
    icon: <AiOutlineDelete fontSize={20} color={'red'} />,
  },
];

export enum Actions {
  Delete = 'Delete',
  Edit = 'Edit',
}
