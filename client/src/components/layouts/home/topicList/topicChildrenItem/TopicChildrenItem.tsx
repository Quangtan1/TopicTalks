import { List, ListItem, ListItemText, Collapse } from '@mui/material';
import { FC } from 'react';

import backgroundImage from 'src/assets/images/banner.png';
import { ITopicChildren, ITopicParent } from 'src/queries';

interface Props {
  openCollapse: number | null;
  topic: ITopicParent;
  topicChild: ITopicChildren;
}

const TopicChildrenItem: FC<Props> = (props) => {
  const { openCollapse, topic, topicChild } = props || {};
  return (
    <Collapse in={openCollapse === topic.id} timeout="auto" unmountOnExit key={topicChild.id}>
      <img src={topicChild?.urlImage || backgroundImage} alt="topic" className="topic-image" />
      <List component="div" disablePadding>
        <ListItem>
          <ListItemText className="topic-child-text" primary={topicChild?.topicChildrenName} />
        </ListItem>
      </List>
    </Collapse>
  );
};

export default TopicChildrenItem;
