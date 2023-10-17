import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { API_KEY } from '../../../utils';
import uiStore from '../../../store/uiStore';
import { IUser } from '../../../types/account.types';

const SignUpPage = observer(({}) => {
   const navigation = useNavigation();
   const [accountSignup, setAccountSignup] = useState<IUser>(null);
   const [openSelectTopic, setOpenSelectTopic] = useState<boolean>(false);
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   const [user, setUser] = useState({
      anonymousName: '',
      email: '',
      password: '',
      cpassword: '',
   });

   let timeoutId;

   const { anonymousName, cpassword, email, password } = user || {};

   const handleSignUp = e => {
      e.preventDefault();
      if (!anonymousName || !email || !password || !cpassword) {
         alert('Please not empty textbox');
      } else if (!emailRegex.test(email)) {
         alert('Please input correct email');
      } else if (!passwordRegex.test(password) || password !== cpassword) {
         password !== cpassword
            ? alert('Confirm Password is incorrect ')
            : alert('Password must contain capital letters,numbers and more than 8 characters');
      } else {
         const user = {
            username: anonymousName,
            email: email,
            password: password,
         };

         axios
            .post(`${API_KEY}/auth/register`, user)
            .then(res => {
               uiStore?.setLoading(true);
               setAccountSignup(res.data);
               alert('Register Successfully');
               timeoutId = setTimeout(() => {
                  clearTimeout(timeoutId);
                  uiStore?.setLoading(false);
                  setOpenSelectTopic(true);
               }, 2000);
            })
            .catch(err => {
               alert(err.response.data.message);
            });
      }
   };

   const onClose = () => {
      setOpenSelectTopic(false);
   };

   const handleChange = e => {
      console.log('🚀 ~ file: index.tsx:72 ~ handleChange ~ e:', e);

      setUser({
         ...user,
      });
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
         <Text style={styles.textLogin}>Sign Up</Text>
         <TextInput
            style={styles.textInput}
            onChangeText={handleChange}
            value={user.anonymousName}
            placeholder='Anonymous Name'
         />
         <TextInput
            style={styles.textInput}
            onChangeText={handleChange}
            value={user.email}
            placeholder='Email'
         />
         <TextInput
            style={styles.textInput}
            onChangeText={handleChange}
            value={user.password}
            placeholder='Password'
         />
         <TextInput
            style={styles.textInputPw}
            onChangeText={handleChange}
            value={user.cpassword}
            placeholder='Confirm password'
         />
         <View style={styles.buttonWrap}>
            <TouchableOpacity onPress={handleSignUp}>
               <Text style={styles.button}>Sign Up</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
});

export default SignUpPage;

const styles = StyleSheet.create({
   container: {
      paddingTop: 50,
   },
   textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      width: 300,
   },
   textInputPw: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
      width: 300,
   },
   textLogin: {
      fontSize: 24,
      // fontWeight: 500,
      marginBottom: 20,
   },
   logo: {
      width: 100,
      height: 100,
   },
   buttonWrap: {
      width: 100,
      height: 50,
      borderRadius: 10,
      verticalAlign: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: 'black',
   },
   button: {
      fontSize: 16,
      color: 'white',
   },
});
