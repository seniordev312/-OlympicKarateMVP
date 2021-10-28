import React, {useState, useContext} from 'react';
import {Platform} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import {activeColor} from 'common';
import {Icon} from 'react-native-elements';
import AuthService from 'services/auth/AuthService';
import {UserService} from 'services/api';
import {UserContext} from 'store';

export default function Profile({navigation}) {
  const {user} = useContext(UserContext);
  const onCertificate = async () => {
    const creds = await AuthService.getCredentials();
    console.log('[[creds]]', creds);
    let authToken = JSON.parse(creds.password);
    console.log('[[token]]', authToken.token);
    let params = {
      student: {
        firstName: 'Marko',
        lastName: 'Markovic',
      },
    };
    // console.log('======>>>>>', params);
    // const cbSuccess = data => {
    //   console.log(data);
    // };
    // const cbFailure = err => {
    //   console.log(err);
    // };
    // craeteCertificate({params, cbSuccess, cbFailure});

    axios
      .post('https://omvp.studyum.io/v1/certificate', params, {
        headers: {
          Authorization: 'Bearer '.concat(authToken.token),
        },
      })
      .then(response => {
        console.log(response.data.publicUrl);
        navigation.navigate('chat', {
          certificateUrl: response?.data?.publicUrl,
          others: 10,
        });
      })
      .catch(error => {
        console.log(JSON.parse(JSON.stringify(error)));
      });
  };

  const onLogout = async (data: any) => {
    try {
      const res = await UserService.updatePassword(
        {
          password: data.password,
          token: user.token ?? '',
          email: user.email ?? '',
        },
        {
          Authorization: `Bearer ${user.token ?? ''}`,
        },
      );
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{flex: 1}}>
      <ScrollView>
        <View style={style.container}>
          <Text style={style.walletTxt}>Profile</Text>
        </View>
        <View style={style.infoContainer}>
          <View style={style.img}>
            <Image
              source={require('../../assets/png/Frame.png')}
              style={style.topimg}
            />
            <View style={style.userInfo}>
              <Text>test ABC</Text>
              <Text>test@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('edit')}>
            <Text style={style.edit}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: '20%'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('wallet')}
            style={style.formTextInput}>
            <View style={style.lineContainer}>
              <Icon name="credit-card-outline" type="material-community" />
              <Text style={style.lineTxt}>Wallet (13 $STUD)</Text>
            </View>
            <Icon name="chevron-right" type="material-community" />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.formTextInput}
            onPress={() => onCertificate()}>
            <View style={style.lineContainer}>
              <Icon name="text-box-outline" type="material-community" />
              <Text style={style.lineTxt}>Certificate</Text>
            </View>
            <Icon name="chevron-right" type="material-community" />
          </TouchableOpacity>
          <View style={style.formTextInput}>
            <View style={style.lineContainer}>
              <Icon name="bell-outline" type="material-community" />
              <Text style={style.lineTxt}>Notifications</Text>
            </View>
            <Icon name="chevron-right" type="material-community" />
          </View>
        </View>

        <TouchableOpacity style={style.btn} onPress={() => onLogout()}>
          <Text style={style.btnTxt}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    alignItems: 'center',
  },
  walletTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: '5%',
  },
  img: {
    padding: '2%',
    marginTop: 20,
    flexDirection: 'row',
  },
  topimg: {width: '25%', resizeMode: 'cover', height: 50, borderRadius: 40},
  btn: {
    width: '90%',
    height: 60,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: '40%',
  },
  btnTxt: {fontSize: 16, fontWeight: 'bold', marginLeft: '5%'},
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: '5%',
  },
  detail: {
    fontSize: 14,
    fontWeight: '200',
    // marginLeft: '5%',
    paddingHorizontal: '5%',
    marginTop: 3,
  },
  formTextInput: {
    minWidth: '40%',
    marginTop: '3%',
    width: '90%',
    height: 60,
    alignSelf: 'center',
    paddingHorizontal: -10,
    padding: 10,
    backgroundColor: 'transparent',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    marginTop: '10%',
  },
  bottomBtn: {
    width: '45%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginVertical: '5%',
  },
  BottombtnTxt: {fontSize: 12, fontWeight: '300', marginLeft: '5%'},
  bottomBtn2: {
    width: '45%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginVertical: '5%',
    backgroundColor: 'red',
  },
  BottombtnTxt2: {
    fontSize: 12,
    fontWeight: '300',
    marginLeft: '5%',
    color: 'white',
  },
  userInfo: {
    marginLeft: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '4%',
  },
  edit: {
    fontSize: 14,
    fontWeight: '600',
    color: activeColor,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  lineTxt: {
    marginLeft: '5%',
    fontWeight: '600',
  },
});
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
