import {accentColor, activeColor} from '@common';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@routes';
import {UserService} from '@services/api';
import AuthService from '@services/auth/AuthService';
import {translateContext} from '@services/Translations/translate';
import {UserContext} from '@store';
import {useToggle} from '@utils/hooks';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dropdown, {DropdownItem} from './Dropdown';

const initialState: DropdownItem[] = [{label: 'English', value: 'en'}];

enum SettingsInputForm {
  LANGUAGE = 'language',
  PASSWORD = 'password',
}

type SettingsInput = Record<SettingsInputForm, any>;

export const SettingsPage = ({navigation}) => {
  const {t} = useContext(translateContext);
  const {user} = useContext(UserContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SettingsInput>();

  const {state: showPwd, toggle: togglePwdVisibility} = useToggle(false);
  const [passwordUpdateMsg, setPasswordUpdateMsg] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownItems, setDropdownItems] =
    useState<DropdownItem[]>(initialState);

  const onSubmit = async (data: any) => {
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

      if (res.success) {
        setPasswordUpdateMsg(t('pwdChangeSuccess'));
      } else {
        setPasswordUpdateMsg(res.failedMsg);
      }
    } catch (error) {}
  };

  const navigator = useNavigation();

  const navigateTo = (name: keyof RootStackNavigation) =>
    navigator.navigate(name);

  const handleLogoutPress = async () => {
    await AuthService.resetCredentials();
    const creds = await AuthService.getCredentials();
    // navigateTo('login');
    navigation.reset({
      index: 0,
      routes: [{name: 'login'}],
    });
  };

  return (
    <View style={style.container}>
      <Text style={style.heading}>{t('settings')}</Text>
      <View style={style.userInfoWrapper}>
        <View style={style.row}>
          <Icon name={'mail-outline'} size={26} />
          <Text style={style.userInfo}>{user.email}</Text>
        </View>
        <View style={style.row}>
          <Icon name={'person'} size={26} />
          <Text style={style.userInfo}>{user.username}</Text>
        </View>
      </View>
      <ScrollView style={style.formWrapper}>
        <Dropdown
          label={t('choose_language')}
          items={dropdownItems}
          open={openDropdown}
          setOpen={value => setOpenDropdown(value)}
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={style.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              secureTextEntry={!showPwd}
              placeholder="*****"
              label={'New Password'}
              right={
                <TextInput.Icon
                  name={showPwd ? 'eye' : 'eye-off'}
                  color={showPwd ? activeColor : accentColor}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{marginBottom: -10}}
                  onPress={() => togglePwdVisibility()}
                  forceTextInputFocus={false}
                />
              }
              onFocus={() => setOpenDropdown(false)}
              passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8"
              selectionColor={activeColor}
              theme={pwdInputTheme}
              autoCapitalize="none"
            />
          )}
          name={SettingsInputForm.PASSWORD}
          rules={{required: true}}
          defaultValue=""
        />

        {(errors.password && (
          <Text style={style.errorMsg}>{t('formValidationDefaultMsg')}</Text>
        )) || <></>}
        {(passwordUpdateMsg && (
          <Text style={style.formSubmitMsg}>{passwordUpdateMsg}</Text>
        )) || <></>}

        <TouchableOpacity
          style={style.submitBtn}
          onPress={handleSubmit(onSubmit)}>
          <Text style={style.submitLabel}>{t('submit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.logoutBtn} onPress={handleLogoutPress}>
          <Text style={style.logoutLabel}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const pwdInputTheme = {
  colors: {
    primary: activeColor,
    underlineColor: 'transparent',
  },
};
const style = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingTop: 30,
    height: '100%',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  row: {flexDirection: 'row'},
  heading: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    marginBottom: '10%',
  },
  userInfoWrapper: {
    marginHorizontal: '6%',
    marginBottom: '7%',

    justifyContent: 'center',
    alignContent: 'center',
  },
  userInfo: {
    marginBottom: '2%',
    marginLeft: '2%',

    color: '#333',
    fontWeight: '300',
    fontSize: 18,
    // lineHeight: 24,
    fontFamily: 'Roboto Light',

    alignContent: 'center',
  },
  formWrapper: {
    flex: 6,
    marginTop: '-3%',
    backgroundColor: 'transparent',
    marginHorizontal: '6%',

    // borderColor: 'red',
    // borderWidth: 1,

    zIndex: 5,
  },
  input: {
    marginTop: '4%',
    marginBottom: '10%',
    minWidth: '40%',
    width: '100%',
    height: 60,
    fontSize: 16,

    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  submitBtn: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: activeColor,
    paddingHorizontal: 40,
    paddingVertical: 20,
    // marginTop: '1%',
  },
  submitLabel: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoutBtn: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginTop: 10,
  },
  logoutLabel: {
    color: 'black',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 1,
  },

  errorMsg: {
    paddingTop: 10,
    paddingHorizontal: 20,

    fontSize: 14,
    color: activeColor,
  },
  formSubmitMsg: {
    paddingTop: 10,
    paddingHorizontal: 20,

    fontSize: 14,
    color: accentColor,
  },
});
