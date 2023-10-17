import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import accountStore from '../../../store/accountStore';
import { useNavigation } from '@react-navigation/native';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { API_KEY } from '../../../utils';

const LoginPage = ({}) => {
   const navigation = useNavigation();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const handleSignIn = e => {
      e.preventDefault();
      const user = {
         username: username,
         password: password,
      };
      axios
         .post(`${API_KEY}/auth/authenticate`, user)
         .then(res => {
            accountStore?.setAccount(res.data);
            res.data.roles.includes('ROLE_ADMIN')
               ? navigation.navigate('Admin' as never)
               : navigation.navigate('Home' as never);
         })
         .catch(err => {
            console.log(err);
            // Toast.error('Invalidate UserName or Password!');
            // alert('Invalidate UserName or Password!');
            Alert.alert('Invalidate UserName or Password!', '', [
               {
                  text: 'Try Again',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
            ]);
         });
   };

   const handleLoginFailed = () => {
      Alert.alert('Login Failed!', '', [
         {
            text: 'Try Again',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
         },
      ]);
   };

   const handleLoginGGSuccess = async credentialResponse => {
      try {
         const decode: { picture?: string; name?: string; email?: string } = jwtDecode(
            credentialResponse?.credential
         );

         const user = {
            fullName: decode.name,
            email: decode.email,
            urlImage: decode.picture,
         };

         axios
            .post(`${API_KEY}/auth/authenticate/google`, user)
            .then(res => {
               accountStore?.setAccount(res.data);
               res.data.roles.includes('ROLE_ADMIN')
                  ? navigation.navigate('Admin' as never)
                  : navigation.navigate('Home' as never);
            })
            .catch(err => {
               console.log(err);
               Alert.alert('Can not login with google!', '', [
                  {
                     text: 'Try Again',
                     onPress: () => console.log('Cancel Pressed'),
                     style: 'cancel',
                  },
               ]);
            });
      } catch (err) {
         console.log(err);
         alert('Login Failed');
      }
   };

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
         <Text style={styles.textLogin}>Login</Text>
         <TextInput
            style={styles.textInput}
            onChangeText={text => setUsername(text)}
            value={username}
            placeholder='User Name'
         />
         <TextInput
            style={styles.textInputPw}
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='Password'
            secureTextEntry={true}
         />
         <View style={styles.buttonWrap}>
            <TouchableOpacity onPress={handleSignIn}>
               <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.signup}>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
               <Text style={styles.textRegister}>Register Now!</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.logingg}>
            {/* <GoogleLogin
               size='medium'
               shape='circle'
               text='signin_with'
               theme='outline'
               width={380}
               onSuccess={handleLoginGGSuccess}
               onError={handleLoginFailed}
            /> */}
         </View>
      </View>
   );
};

export default LoginPage;

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
      verticalAlign: 'auto',
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
   signup: {
      width: 200,
      height: 50,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'black',
   },
   textRegister: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
   },
   logingg: {
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
