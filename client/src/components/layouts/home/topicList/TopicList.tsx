import { useState, useEffect } from 'react';
import { Box, List, Button, ListItem, ListItemText, Typography, Collapse, Card } from '@mui/material';
import { fetchTopicChildren, useGetAllTopicParents } from 'src/queries/functionQuery';
import Loading from 'src/components/loading/Loading';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import './TopicList.scss';
import { createAxios } from 'src/utils';
import { ITopicChildren, ITopicParent } from 'src/queries';
import backgroundImage from 'src/assets/images/banner.png';
import { useNavigate } from 'react-router-dom';

const TopicList = observer(() => {
  const navigate = useNavigate();
  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const axiosJWT = createAxios(account, setAccount);

  const { data: topicParentData, isLoading, refetch } = useGetAllTopicParents(account, setAccount);

  const [openCollapse, setOpenCollapse] = useState<number | null>(null);
  const [topicChildrenData, setTopicChildrenData] = useState<any[]>([]);

  useEffect(() => {
    if (topicParentData?.data) {
      const fetchDataForAllParents = async () => {
        const topicChildrenPromises = topicParentData?.data?.map((topic: ITopicParent) =>
          fetchTopicChildren(topic?.id, axiosJWT, account),
        );
        const allTopicChildren = await Promise.all(topicChildrenPromises);
        setTopicChildrenData(allTopicChildren);
      };

      fetchDataForAllParents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicParentData]);

  const handleCollapseClick = (id: number) => {
    if (id === openCollapse) {
      setOpenCollapse(null);
    } else {
      setOpenCollapse(id);
    }
  };

  const handleGoToTopicChildren = (topicChildrenId: number) => {
    navigate(`/topic-children/${topicChildrenId}`);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h4">Danh sách chủ đề</Typography>
          <Button variant="outlined" size="small" className="post-button" onClick={() => refetch()}>
            Reload Topic
          </Button>
          <Box className="topic-list-container">
            {!!topicParentData && (
              <List>
                {topicParentData?.data?.map((topic: ITopicParent) => (
                  <Box key={topic?.id}>
                    <Typography className="topic-list-item-text" variant="h6">
                      {topic?.topicParentName}
                    </Typography>
                    <ListItem className="topic-children" onClick={() => handleCollapseClick(topic.id)}>
                      <Card className="topic-list-item">
                        {topicChildrenData[topic?.id - 1]?.map((topicChild: ITopicChildren) => (
                          <Collapse in={openCollapse === topic.id} timeout="auto" unmountOnExit key={topicChild.id}>
                            <img src={topicChild?.urlImage || backgroundImage} alt="topic" className="topic-image" />
                            <List component="div" disablePadding>
                              <ListItem>
                                <ListItemText
                                  className="topic-child-text"
                                  primary={topicChild?.topicChildrenName}
                                  onClick={() => handleGoToTopicChildren(topicChild?.id)}
                                />
                              </ListItem>
                            </List>
                          </Collapse>
                        ))}
                      </Card>
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </>
      )}
    </>
  );
});

export default TopicList;
