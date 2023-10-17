import { KeyboardAvoidingView, Modal, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const LogoutModal = ({ isOpenModal, setIsOpenModal }) => {
   const navigation = useNavigation();
   return (
      <KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }}>
         <Modal
            animationType='fade'
            transparent={true}
            visible={isOpenModal}
            onRequestClose={() => {
               setIsOpenModal(!isOpenModal);
            }}
         >
            <View style={styles.centeredView}>
               <View style={styles.modalView}>
                  <TouchableOpacity
                     style={styles.iconX}
                     onPress={() => setIsOpenModal(!isOpenModal)}
                  >
                     <Text
                        style={{
                           paddingBottom: 32,
                           fontSize: 16,
                           fontStyle: 'italic',
                           fontWeight: 'bold',
                        }}
                     >
                        Do you want to Logout?
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={styles.profileOption}
                     onPress={() => setIsOpenModal(!isOpenModal)}
                  >
                     <Text style={styles.modalText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={styles.logoutOption}
                     onPress={() => navigation.navigate('Login' as never)}
                  >
                     <Text style={[styles.modalText, { color: 'red' }]}>Yes</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
      </KeyboardAvoidingView>
   );
};

export default LogoutModal;
