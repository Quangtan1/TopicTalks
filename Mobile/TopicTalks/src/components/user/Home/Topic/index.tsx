import {
   Image,
   Text,
   TouchableOpacity,
   View,
   ScrollView,
   TextInput,
   FlatList,
   KeyboardAvoidingView,
   Modal,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import memoizeOne from 'memoize-one';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { ListTopic, TopicChild } from '../../../../types/topic.type';
import accountStore from '../../../../store/accountStore';
import uiStore from '../../../../store/uiStore';
import { createAxios, getDataAPI } from '../../../../utils';
import LogoutModal from './LogoutModal';

const avatarUrlDemo =
   'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';

const TopicView = observer(() => {
   const [listTopic, setListTopicParent] = useState<ListTopic[]>([]);
   const [topicChildMap, setTopicChildMap] = useState<Map<number, TopicChild[]>>(new Map());
   const [selectedParent, setSelectedParent] = useState<number | null>(null);
   const [searchContent, setSearchContent] = useState<string>('');

   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

   const [imageHeight, setImageHeight] = useState(150); // chiều cao ban đầu của hình ảnh

   const navigation = useNavigation();
   const account = accountStore?.account;

   const setAccount = () => {
      return accountStore?.setAccount;
   };

   const accountToken = account?.access_token;

   const accountJwt = account;
   const axiosJWT = createAxios(accountJwt, setAccount);

   useEffect(() => {
      uiStore?.setLoading(true);
      getDataAPI(`/topic-parent/all`, accountToken, axiosJWT)
         .then(res => {
            setListTopicParent(res.data.data);
            if (res.data.data.length > 0) {
               res.data.data.forEach(topicParent => {
                  const parentId = topicParent.id;
                  getTopicChildByParentId(parentId);
               });
            }
         })
         .catch(err => {
            console.log(err);
         });
   }, []);

   const getTopicChildByParentId = useMemo(
      () =>
         memoizeOne((parentId: number) => {
            if (topicChildMap.has(parentId)) {
               uiStore?.setLoading(false);
               return topicChildMap.get(parentId);
            }
            getDataAPI(`/topic-children/topic-parent=${parentId}`, accountToken, axiosJWT)
               .then(res => {
                  setTopicChildMap(prevMap => new Map(prevMap).set(parentId, res.data.data));
                  uiStore?.setLoading(false);
               })
               .catch(err => {
                  console.log(err);
               });
            return null;
         }),
      []
   );

   const handleScroll = event => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const scrollThreshold = 10;

      if (currentOffset > scrollThreshold) {
         const newHeight = 150 - (currentOffset - scrollThreshold);
         setImageHeight(newHeight < 0 ? 0 : newHeight);
      }
   };
   const navigateToDetailTopic = (id: number) => {
      console.log('🚀 ~ file: index.tsx:64 ~ navigateToDetailTopic ~ id:', id);
      // navigation.navigate(`/topic-detail`, id);
   };

   const goToProfile = () => {};

   const logout = () => {
      setIsOpenModal(true);
   };

   const renderItemParent = (item: ListTopic) => {
      return (
         <View key={item.id} style={{ marginBottom: 20 }}>
            <View style={styles.topicParentNameWrap}>
               <Text style={styles.topicParentName}>{item?.topicParentName}</Text>
            </View>
            <FlatList
               data={topicChildMap.get(item.id) || []}
               horizontal
               onScroll={handleScroll}
               scrollEventThrottle={16}
               renderItem={({ item }) => renderItemChild(item)}
               keyExtractor={item => `${item?.id}`}
            />
         </View>
      );
   };

   const renderItemChild = (item: TopicChild) => {
      return (
         <TouchableOpacity key={item.id} onPress={() => navigateToDetailTopic(item.id)}>
            <View style={styles.itemChildrenWrap}>
               <Image source={{ uri: item.image }} style={styles.imageStyle} />
               <Text style={styles.itemChildTextName}>{item.topicChildrenName}</Text>
            </View>
         </TouchableOpacity>
      );
   };

   const listTopicParent =
      listTopic.filter(item =>
         item?.topicParentName?.toLowerCase().trim().includes(searchContent.toLowerCase().trim())
      ) || [];
   return (
      <>
         <KeyboardAvoidingView style={styles.topicPageContainer}>
            <View style={styles.blankHeaders}></View>
            <View style={styles.headerWrap}>
               <View style={styles.userBarWrap}>
                  <View style={styles.userNameWrap}>
                     <Text style={styles.userName}>{account?.username}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                     <Image
                        source={{ uri: account?.url_img || avatarUrlDemo }}
                        alt='avatar'
                        style={styles.imageUserStyle}
                     />
                  </TouchableOpacity>
               </View>
               <View style={styles.searchInputWrap}>
                  <Ionicons name={'search-outline'} size={25} color={'white'} />
                  <TextInput
                     style={styles.searchInput}
                     placeholder={'Search Topic'}
                     onChangeText={text => setSearchContent(text)}
                  />
               </View>
               <View style={styles.ImageHeaderBannerWrap}>
                  <Image
                     source={require('../../../../assets/images/image_community1.jpg')}
                     alt='banner'
                     style={[styles.imageHeaderBanner, { height: imageHeight }]}
                  />
               </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
               {listTopicParent.map(item => renderItemParent(item))}
            </ScrollView>

            <Modal
               animationType='fade'
               transparent={true}
               visible={modalVisible}
               onRequestClose={() => {
                  setModalVisible(!modalVisible);
               }}
            >
               <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                     <TouchableOpacity
                        style={styles.iconX}
                        onPress={() => setModalVisible(!modalVisible)}
                     >
                        <Ionicons name='close-circle-outline' size={25} color='black' />
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.profileOption} onPress={goToProfile}>
                        <Text style={styles.modalText}>Profile</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.logoutOption} onPress={logout}>
                        <Text style={[styles.modalText, { color: 'red' }]}>Logout</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </Modal>
         </KeyboardAvoidingView>
         <LogoutModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      </>
   );
});

export default TopicView;
