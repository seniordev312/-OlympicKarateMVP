import React, {useState} from 'react';
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
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {activeColor} from 'common';
import AuthService from 'services/auth/AuthService';
import CertificateApi from 'services/api/Certificate';

export default function Wallet() {
  const [chain, setChain] = useState('');
  const [address, setAddress] = useState('');

  const onCertificate = async () => {
    const creds = await AuthService.getCredentials();
    console.log('======>>>>>', creds);
    let authToken = JSON.parse(creds.password);
    console.log('======>>>>>', authToken);
    let params = {
      student: {
        firstName: 'Marko',
        lastName: 'Markovic',
      },
    };
    const cbSuccess = data => {
      console.log(data);
    };
    const cbFailure = err => {
      console.log(err);
    };

    CertificateApi(params, authToken.token, cbSuccess, cbFailure);
    // axios
    //   .get('https://omvp.studyum.io/v1/certificate', params, {
    //     headers: {
    //       Authorization: 'Bearer '.concat(authToken.token),
    //     },
    //   })
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     console.log(JSON.parse(JSON.stringify(error)));
    //   });
  };

  const onSubmit = async () => {
    const creds = await AuthService.getCredentials();
    console.log('======>>>>>', creds);

    let authToken = JSON.parse(creds.password);
    console.log('======>>>>>', authToken);

    let params = {
      id: authToken.id,
      wallet: {
        address: 'address',
        amount: 69,
      },
    };
    // const cbSuccess = data => {
    //   console.log(data);
    // };
    // const cbFailure = err => {
    //   console.log(err);
    // };
    axios
      .post('https://omvp.studyum.io/v1/update-wallet', params, {
        headers: {Authorization: 'Bearer '.concat(authToken.token)},
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{flex: 1}}>
      <ScrollView>
        <View style={style.container}>
          <Text style={style.walletTxt}>Wallet</Text>
        </View>
        <View style={style.img}>
          <Image
            source={require('../../assets/png/Frame.png')}
            style={style.topimg}
          />
        </View>
        <TouchableOpacity style={style.btn}>
          <Text style={style.btnTxt}>Download Metamask</Text>
        </TouchableOpacity>
        <View>
          <Text style={style.heading}>Congratulations</Text>
          <Text style={style.detail}>
            you have received 77 STUD for passing all leasons. Please enter
            chain and wallet address where you wish to recive your reward.
          </Text>
        </View>
        <View>
          <TextInput
            placeholder={'chain'}
            label="Chain"
            value={chain}
            //   mode={'flat'}
            //   onBlur={Keyboard.dismiss}
            onChangeText={v => setChain(v)}
            style={style.formTextInput}
            theme={{
              colors: {primary: activeColor},
            }}
            autoCapitalize="none"
          />
          <TextInput
            label="Wallet address"
            placeholder={'wallet address'}
            value={address}
            //   mode={'flat'}
            //   onBlur={Keyboard.dismiss}
            onChangeText={v => setAddress(v)}
            style={style.formTextInput}
            theme={{
              colors: {primary: activeColor},
            }}
            autoCapitalize="none"
          />
        </View>
        <View style={style.bottomContainer}>
          <TouchableOpacity style={style.bottomBtn}>
            <Text style={style.BottombtnTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.bottomBtn2}
            onPress={() => onCertificate()}>
            <Text style={style.BottombtnTxt2}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  },
  topimg: {width: '100%', resizeMode: 'contain'},
  btn: {
    width: '90%',
    height: 70,
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
  btnTxt: {fontSize: 18, fontWeight: '300', marginLeft: '5%'},
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
    fontSize: 16,
    alignSelf: 'center',
    paddingHorizontal: -10,
    padding: 10,
    backgroundColor: 'transparent',
    // maxWidth: '80%',
    borderBottomColor: 'gray',
    // borderBottomWidth: 1,
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
});
