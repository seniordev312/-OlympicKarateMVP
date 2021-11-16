import {
  activeColor,
  EMPTY_OBJ,
  makeSource,
  MIN_LENGTH_PWD,
  MIN_LENGTH_USERNAME,
} from '@common';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@routes';
import * as UserService from '@services/api/userService';
import AuthService from '@services/auth/AuthService';
import {translateContext} from '@services/Translations/translate';
import {UserContext} from '@store';
import {useToggle} from '@utils/hooks';
import {get} from 'lodash';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  UseControllerProps,
  useForm,
} from 'react-hook-form';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Image from 'react-native-fast-image';
import {TextInput} from 'react-native-paper';

type LoginPage = {
  logoUrl: string;
  title: string;
};

enum LoginInputForm {
  INPUT = 'input',
  PASSWORD = 'password',
}

type LoginInput = Record<LoginInputForm, string>;

export const LoginPage: FC<LoginPage> = ({logoUrl, title}) => {
  const {t} = useContext(translateContext);
  const {user, getUser} = useContext(UserContext);
  const {state: showPwdReset, toggle: togglePwdReset} = useToggle(false);
  const {state: showPwd, toggle: togglePwdVisibility} = useToggle(false);
  const {state: showAlert, toggle: toggleAlert} = useToggle(false);
  const [serverError, setServerError] = useState('');
  const isFocused = useIsFocused();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    getValues,
    setValue,
    clearErrors,
  } = useForm<LoginInput>({shouldFocusError: true, mode: 'onBlur'});

  const navigation = useNavigation();

  // TODO:
  //     Ukloniti sve greske u formama na focus
  //     Popraviti pwd toggle

  const navigateTo = useCallback(
    (
      route: keyof RootStackNavigation,
      options?: Record<string, unknown>,
      replace?: boolean,
    ) => {
      if (replace) {
        navigation.reset({
          index: 0,
          routes: [{name: route, ...options}],
        });
      } else {
        navigation.navigate(route, options);
      }
    },
    [navigation],
  );

  const renderFormInputs = (props: FormInputProps) =>
    ((LoginInputForm.PASSWORD === props.name && !showPwdReset) ||
      LoginInputForm.PASSWORD !== props.name) && <FormInput {...props} />;

  const handleLogin = async (data: LoginInput) => {
    const {input: username, password} = data;
    setServerError('');

    const loginResponse = await UserService.login({
      email: username,
      username,
      password,
    });
    console.log('ABC=============>>>>>>>', loginResponse);
    if (loginResponse.success) {
      const creds = await AuthService.getCredentials();
      console.log(creds);
      console.log('{}{}{}{}{}{}{}=>', JSON.parse(creds.password));
      await getUser();

      if (creds) {
        navigateTo('navbar', {screen: 'chat'}, true);
      } else {
        console.error(
          "Credentials couldn't be stored after successful login. Login data:",
          data,
        );
      }
    } else {
      setServerError(loginResponse.failedMsg || t('loginFailed'));
    }
  };

  const handlePwdReset = async () => {
    const email = getValues().input;

    if (!email || email?.toString().length < MIN_LENGTH_USERNAME) {
      setError('input', {
        message: t('formValidationDefaultMsg'),
        type: 'required',
      });
      return;
    }

    const resetResponse = await UserService.resetPassword({
      email,
    });

    if (resetResponse.success) {
      toggleAlert();
    } else {
      setServerError(resetResponse.failedMsg || t('resetFailed'));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedUser = await AuthService.getLoggedUser();

      if (loggedUser) {
        navigateTo('navbar', {screen: 'chat'});
      }
    };
    fetchUserData();
    // AuthService.resetCredentials();
    // console.log('Credentials reset done');
  }, [navigateTo]);

  useEffect(() => {
    showPwdReset && togglePwdReset();
    setValue('input', '');
    setValue('password', '');
    clearErrors();
  }, [isFocused]);

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Logo
          imageUrl={logoUrl}
          // onPressHandler={() => navigateTo('getStarted')}
          onPressHandler={() => ({})}
          customStyle={style.logoContainer}
        />
        <View style={style.titleWrap}>
          <Text style={style.title}>{title}</Text>
        </View>
      </View>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={style.formContainer}
        keyboardVerticalOffset={0}
        contentContainerStyle={style.form}> */}
      <View style={style.form}>
        <FormInput
          label={t('email')}
          placeholder={t('emailPh')}
          name={LoginInputForm.INPUT}
          control={control}
          errors={errors}
          rules={{
            required: true,
            minLength: MIN_LENGTH_USERNAME,
          }}
          errorMsg={t('formValidationDefaultMsg')}
        />
        {!showPwdReset && (
          <View style={style.formWrapper}>
            <FormInput
              label={t('password')}
              placeholder={t('passwordPh')}
              name={LoginInputForm.PASSWORD}
              control={control}
              errors={errors}
              secureTextEntry={!showPwd}
              rules={{
                required: !showPwdReset,
                minLength: MIN_LENGTH_PWD,
              }}
              errorMsg={t('formValidationDefaultMsg')}
              // right={
              //   <TextInput.Icon
              //     name={showPwd ? 'eye' : 'eye-off'}
              //     // eslint-disable-next-line react-native/no-inline-styles
              //     color={showPwd ? activeColor : accentColor}
              //     // eslint-disable-next-line react-native/no-inline-styles
              //     style={{marginBottom: -10}}
              //     onPress={() => togglePwdVisibility()}
              //     forceTextInputFocus={false}
              //   />
              // }
            />
            {serverError ? (
              <Text style={style.errorMsg}>{serverError || ''}</Text>
            ) : (
              <></>
            )}
            <View style={style.passwordResetWrapper}>
              <TouchableOpacity
                onPress={() => {
                  clearErrors();
                  setServerError('');
                  togglePwdReset();
                }}>
                <Text style={style.passwordReset}>{t('passwordReset')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <AwesomeAlert
          show={showAlert}
          useNativeDriver
          title={t('resetTitle')}
          message={t('resetMsg')}
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText={t('resetConfirmText')}
          confirmButtonColor={activeColor}
          onConfirmPressed={toggleAlert}
          messageStyle={style.alertMsgStyle}
          confirmButtonStyle={style.alertConfirmBtnStyle}
        />
        <View style={style.btnGroup}>
          {!showPwdReset ? (
            <>
              <TouchableOpacity
                style={style.loginBtn}
                onPress={handleSubmit(handleLogin)}>
                <Text style={style.loginBtnFont}>{t('signIn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.registerBtn}
                onPress={() => navigateTo('register')}>
                <Text style={style.notAMemberFont}>{t('notAMember')}</Text>
                <Text style={style.signUpFont}> {t('signUp')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={style.loginBtn}
                onPress={() => handlePwdReset()}>
                <Text style={style.loginBtnFont}>{t('passwordReset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.registerBtn}
                onPress={() => {
                  clearErrors();
                  setServerError('');
                  togglePwdReset();
                }}>
                <Text style={style.registerBtnFont}>{t('returnToLogin')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

const Logo: FC<{
  imageUrl: string;
  customStyle?: Record<string, unknown>;
  onPressHandler: () => void;
}> = ({imageUrl, customStyle, onPressHandler}) => {
  return (
    <TouchableOpacity style={customStyle} onPress={onPressHandler}>
      <Image style={style.logo} source={makeSource(imageUrl)} />
    </TouchableOpacity>
  );
};

type FormInputProps = {
  label: string;
  placeholder: string;
  name: string;
  customStyle?: Record<string, unknown>;
  control: Control<any>;
  errors: DeepMap<LoginInput, FieldError>;
  secureTextEntry?: boolean;
  rules?: UseControllerProps['rules'];
  errorMsg: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
};
const FormInput: FC<FormInputProps> = ({
  label,
  placeholder,
  name,
  control,
  errors,
  secureTextEntry,
  rules,
  errorMsg,
  left,
  right,
}) => {
  return (
    <View style={style.formInput}>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder={placeholder}
            label={label}
            value={value}
            mode={'flat'}
            onBlur={Keyboard.dismiss}
            onChangeText={v => onChange(v)}
            style={style.formTextInput}
            secureTextEntry={!!secureTextEntry}
            theme={{
              colors: {primary: activeColor},
            }}
            autoCapitalize="none"
            left={left}
            right={right}
          />
        )}
        name={name}
        rules={rules || EMPTY_OBJ}
        defaultValue=""
      />
      {get(errors, name) && <Text style={style.errorMsg}>{errorMsg}</Text>}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    height: '100%',
    maxHeight: '100%',
    minHeight: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
    // height: '100%',
    // paddingVertical: 20,
    backgroundColor: 'white',
  },

  header: {
    height: '40%',
    flex: 1,
    flexDirection: 'column',

    paddingLeft: '5%',
  },

  logoContainer: {
    // alignContent: 'flex-end',
    // height: '20%',
    flex: 1,
    paddingTop: '5%',
  },

  logo: {
    maxWidth: 50,
    width: 50,
    height: 50,
    resizeMode: 'center',
  },

  email: {},
  alertMsgStyle: {padding: 40},
  alertConfirmBtnStyle: {paddingHorizontal: 40},

  form: {
    flex: 2,
    backgroundColor: 'white',

    // borderColor: 'purple',
    // borderWidth: 1,
  },
  formWrapper: {
    // borderColor: 'purple',
    // borderWidth: 1,
  },
  formInput: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',

    marginVertical: 10,
    // marginHorizontal: 15,

    // borderColor: 'brown',
    // borderWidth: 3,
  },
  formTextInput: {
    minWidth: '40%',
    width: '90%',
    height: 60,
    fontSize: 16,

    alignSelf: 'center',
    paddingHorizontal: -10,
    backgroundColor: 'white',
    // maxWidth: '80%',
  },
  errorMsg: {
    paddingTop: '1%',

    fontSize: 12,
    color: activeColor,
    alignSelf: 'center',
  },

  titleWrap: {
    flex: 1.5,
    maxWidth: '70%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    lineHeight: 36,
    flexWrap: 'wrap',
  },

  btnGroup: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: '2%',
  },
  minHeight80: {
    minHeight: 80,
    marginTop: 20,
  },

  passwordResetWrapper: {
    // display: 'flex',
    // flex: 1,
    // flexDirection: 'row-reverse',
    width: '95%',
    // justifyContent: 'center',
    alignContent: 'flex-start',
    height: '15%',

    marginTop: 15,
  },
  loginBtn: {
    marginTop: '10%',
    marginBottom: '2%',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
    marginHorizontal: '10%',

    justifyContent: 'center',

    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: activeColor,
  },

  registerBtn: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
    minHeight: 80,
  },
  notAMemberFont: {
    // font-family: SF UI Text;
    // font-style: normal;
    // font-weight: normal;
    // font-size: 16px;
    // line-height: 21px;

    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.3,
    color: 'rgba(14, 14, 14, 0.5)',
  },
  signUpFont: {
    letterSpacing: -0.3,
    fontSize: 16,
    lineHeight: 21,
  },
  registerBtnFont: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.3,
    color: 'rgba(14, 14, 14, 0.5)',
  },

  loginBtnFont: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: -0.3,
  },

  passwordReset: {
    color: 'rgba(14, 14, 14, 0.5)',
    fontSize: 12,
    lineHeight: 21,
    marginHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'right',
    letterSpacing: -0.3,
  },
});
