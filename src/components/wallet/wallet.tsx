import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function Wallet() {
  return (
    <View style={{flex: 1}}>
      <View style={style.container}>
        <Text style={style.walletTxt}>Wallet</Text>
      </View>
      <View style={style.img}>
        <Image
          source={require('../../assets/png/Frame.png')}
          style={{width: '100%', resizeMode: 'contain'}}
        />
      </View>
      <TouchableOpacity style={style.btn}>
        <Text style={style.btnTxt}>Download Metamask</Text>
      </TouchableOpacity>
      <View>
        <Text style={style.heading}>Congratulations</Text>
        <Text style={style.detail}>
          you have received 77 STUD for passing all leasons. Please enter chain
          and wallet address where you wish to recive your reward.
        </Text>
      </View>
      <View>
        <TextInput
          placeholder={'dada'}
          //   label="Wallet"
          //   value={'abc'}
          //   mode={'flat'}
          //   onBlur={Keyboard.dismiss}
          //   onChangeText={v => onChange(v)}
          style={style.formTextInput}
          //   secureTextEntry={!!secureTextEntry}
          //   theme={{
          //     colors: {primary: activeColor},
          //   }}
          //   autoCapitalize="none"
          //   left={left}
          //   right={right}
        />
        <TextInput
          placeholder={'dada'}
          //   label="Wallet"
          //   value={'abc'}
          //   mode={'flat'}
          //   onBlur={Keyboard.dismiss}
          //   onChangeText={v => onChange(v)}
          style={style.formTextInput}
          //   secureTextEntry={!!secureTextEntry}
          //   theme={{
          //     colors: {primary: activeColor},
          //   }}
          //   autoCapitalize="none"
          //   left={left}
          //   right={right}
        />
      </View>
      <View style={style.bottomContainer}>
        <TouchableOpacity style={style.bottomBtn}>
          <Text style={style.BottombtnTxt}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.bottomBtn2}>
          <Text style={style.BottombtnTxt2}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    // backgroundColor: 'white',
    // maxWidth: '80%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
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
