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
import {Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import {activeColor} from 'common';
import AuthService from 'services/auth/AuthService';
import CertificateApi from 'services/api/Certificate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {walletUpdate} from 'services/api/userService';
import {navigationRef} from 'Routes';
import {Picker} from '@react-native-picker/picker';
import {Alert} from 'react-native';
import Modal from 'react-native-modal';

export default function Wallet({navigation}) {
  const [chain, setChain] = useState('');
  const [address, setAddress] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const onSubmit = async () => {
    const getCount = await AsyncStorage.getItem('STUD');
    const creds = await AuthService.getCredentials();
    console.log('[[check]]', creds, getCount);

    let authToken = JSON.parse(creds.password);
    console.log('[[Token]]', authToken);

    let params = {
      id: authToken.id,
      wallet: {
        address: address,
        amount: getCount,
      },
    };
    const cbSuccess = data => {
      console.log(data);
      setModalVisible(true);
      setChain('');
      setAddress('');
    };
    const cbFailure = err => {
      console.log(err);
    };
    walletUpdate({params, cbSuccess, cbFailure});
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
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              borderBottomWidth: 1.5,
              borderBottomColor: '#C0C0C0',
              marginHorizontal: 20,
            }}>
            <Picker
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginHorizontal: 10,
              }}
              selectedValue={chain}
              onValueChange={(itemValue, itemIndex) => setChain(itemValue)}>
              <Picker.Item label="Etherium" value="Etherium" />
              <Picker.Item label="Cardano" value="Cardano" />
              <Picker.Item
                label="Binance Smart Chain"
                value="Binance Smart Chain"
              />
              <Picker.Item
                label="Etherium & Binance use the same address validation"
                value="Etherium & Binance use the same address validation"
              />
            </Picker>
          </View>
          {/* <TextInput
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
          /> */}
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
          <TouchableOpacity
            style={style.bottomBtn}
            onPress={() => navigation.goBack()}>
            <Text style={style.BottombtnTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.bottomBtn2} onPress={() => onSubmit()}>
            <Text style={style.BottombtnTxt2}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal isVisible={isModalVisible}>
        <View style={style.model}>
          <Text>
            Token distribution is done every 28th of the month. You will receive
            your tokens on the date
          </Text>

          <TouchableOpacity
            style={style.bottomBtn}
            onPress={() => setModalVisible(false)}>
            <Text style={style.BottombtnTxt}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  model: {
    height: '20%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
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
  BottombtnTxt: {
    fontSize: 12,
    fontWeight: '300',
    marginLeft: '5%',
    color: 'black',
  },
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
