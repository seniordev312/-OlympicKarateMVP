import {
  activeColor,
  makeSource,
  MIN_LENGTH_FIRST_NAME,
  MIN_LENGTH_PWD,
  MIN_LENGTH_USERNAME,
} from '@common';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@routes';
import * as UserService from '@services/api/userService';
import {translateContext} from '@services/Translations/translate';
import {useToggle} from '@utils/hooks';
import {useClearOnBlur} from '@utils/hooks/useClearOnBlur';
import {get} from 'lodash';
import React, {FC, useCallback, useContext, useState} from 'react';
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  UseControllerProps,
  useForm,
} from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {TextInput} from 'react-native-paper';
import AuthService from 'services/auth/AuthService';
import {UserContext} from 'store';
import validator from 'validator';

type RegistrationPage = {
  logoUrl: string;
  title: string;
};

enum RegistrationInputForm {
  EMAIL = 'email',
  USERNAME = 'username',
  FIRSTNAME = 'firstname',
  MIDDLENAME = 'middlename',
  LASTNAME = 'lastname',
  PASSWORD = 'password',
  VALUE_TAKEN = 'valueTaken',
}

type RegistrationInput = Record<RegistrationInputForm, any>;

export enum Validators {
  EMAIL_VALIDATOR = 'EMAIL_VALIDATOR',
}

export const RegistrationPage: FC<RegistrationPage> = ({logoUrl, title}) => {
  const {t} = useContext(translateContext);
  const {state: showPwd, toggle: togglePwdVisibility} = useToggle(false);
  const [valueTakenErrorMsg, setValueTakenErrorMsg] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors},
    clearErrors,
  } = useForm<RegistrationInput>({shouldFocusError: true, mode: 'onBlur'});

  useClearOnBlur(RegistrationPage.name, clearErrors);
  const formInputs: FormInputProps[] = [
    {
      label: 'E-mail',
      placeholder: 'john.doe@mail.com',
      name: RegistrationInputForm.EMAIL,
      control: control,
      errors: errors,
      errorMsg: t('registrationFieldValidationDefaultMsg'),
      rules: {
        required: true,
        validate: {
          [Validators.EMAIL_VALIDATOR]: value => validator.isEmail(value),
        },
      },
    },
    {
      label: 'Username',
      placeholder: 'johndoe',
      name: RegistrationInputForm.USERNAME,
      control: control,
      errors: errors,
      errorMsg: t('registrationFieldValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_USERNAME},
    },
    {
      label: 'First Name',
      placeholder: 'john',
      name: RegistrationInputForm.FIRSTNAME,
      control: control,
      errors: errors,
      errorMsg: t('registrationFieldValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_FIRST_NAME},
    },
    {
      label: 'Last name',
      placeholder: 'petter',
      name: RegistrationInputForm.LASTNAME,
      control: control,
      errors: errors,
      errorMsg: t('registrationFieldValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_USERNAME},
    },
    {
      label: 'Password',
      placeholder: '*****',
      name: RegistrationInputForm.PASSWORD,
      control: control,
      errors: errors,
      errorMsg: t('registrationFieldValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_PWD},
      secureTextEntry: !showPwd,
      // right: (
      //   <TextInput.Icon
      //     name={showPwd ? 'eye' : 'eye-off'}
      //     color={showPwd ? activeColor : accentColor}
      //     // eslint-disable-next-line react-native/no-inline-styles
      //     style={{marginBottom: -10}}
      //     onPress={() => console.log('pressed')}
      //     forceTextInputFocus={false}
      //   />
      // ),
    },
  ];

  const navigation = useNavigation();

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
  const {user, getUser} = useContext(UserContext);

  const handleRegister = async (data: RegistrationInput) => {
    console.log(data);

    setValueTakenErrorMsg('');

    const response = await UserService.register(data);

    if (response.success) {
      const loginResponse = await UserService.login(data);

      if (loginResponse.success) {
        const creds = await AuthService.getCredentials();
        await getUser();

        if (creds) {
          navigateTo('navbar', {screen: 'chat'}, true);
        } else {
          console.error(
            "Credentials couldn't be stored after successful login. Login data:",
            data,
          );
        }

        // navigateTo('login');
      }
    } else {
      const msgType = response.failedMsg.includes(RegistrationInputForm.EMAIL)
        ? RegistrationInputForm.EMAIL
        : RegistrationInputForm.USERNAME;
      const message =
        (msgType &&
          (msgType === RegistrationInputForm.EMAIL
            ? t('emailAlreadyExistsError')
            : t('usernameAlreadyExistsError'))) ||
        response?.data?.details;

      setValueTakenErrorMsg(message);
    }
  };

  const renderFormInputs = (props: FormInputProps) => <FormInput {...props} />;

  return (
    <ScrollView style={style.container}>
      <View style={style.header}>
        <Logo
          imageUrl={logoUrl}
          customStyle={style.logoContainer}
          // onPressHandler={() => navigateTo('getStarted')}
          onPressHandler={() => ({})}
        />
        <View style={style.titleWrap}>
          <Text style={style.title}>{title}</Text>
        </View>
      </View>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={style.formContainer}> */}
      <View style={style.form}>
        {React.Children.toArray(formInputs.map(renderFormInputs))}
        <Text style={style.errorMsg}>{valueTakenErrorMsg}</Text>

        <View style={style.btnGroup}>
          <TouchableOpacity
            style={style.signupBtn}
            onPress={handleSubmit(handleRegister)}>
            <Text style={style.signupBtnFont}>{t('signup')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.alreadyMemberWrapper}
            onPress={() => navigateTo('login')}>
            <Text style={style.alreadyMember}>{t('alreadyMember')}</Text>
            <Text style={style.logIn}> {t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </ScrollView>
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

const EMPTY_OBJ = {};

export type FormInputProps = {
  label: string;
  placeholder: string;
  name: string;
  customStyle?: Record<string, unknown>;
  control: Control<any>;
  errors?: DeepMap<any, FieldError>;
  secureTextEntry?: boolean;
  rules?: UseControllerProps['rules'];
  errorMsg?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
};

export const FormInput: FC<FormInputProps> = ({
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
            onChangeText={v => onChange(v)}
            style={style.formTextInput}
            secureTextEntry={!!secureTextEntry}
            theme={formInputTheme}
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

const formInputTheme = {
  colors: {
    primary: activeColor,
    underlineColor: 'transparent',
  },
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
    backgroundColor: 'white',
  },

  header: {
    // height: '0%',
    flex: 1,
    flexDirection: 'column',

    paddingLeft: '5%',
  },

  logoContainer: {
    alignContent: 'flex-end',
    maxWidth: 55,

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

  form: {
    flex: 2,
    backgroundColor: 'white',

    // borderColor: 'purple',
    // borderWidth: 1,
  },
  formInput: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: '1%',

    // borderColor: 'brown',
    // borderWidth: 3,
  },
  formTextInput: {
    minWidth: '40%',
    width: '90%',
    height: 55,
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
    marginTop: '10%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    lineHeight: 36,
    flexWrap: 'wrap',
  },

  btnGroup: {
    // borderColor: 'red',
    // borderWidth: 1,
    flex: 1.2,
    flexDirection: 'column',
    paddingTop: '2%',
  },

  alreadyMemberWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
    minHeight: 80,
  },
  signupBtn: {
    marginTop: '17%',
    marginBottom: '2%',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
    marginHorizontal: '10%',

    justifyContent: 'center',

    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: activeColor,
  },

  signupBtnFont: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    // letterSpacing: 1,
  },

  alreadyMember: {
    color: 'rgba(14, 14, 14, 0.5)',
    fontSize: 16,
    lineHeight: 21,
    // marginHorizontal: 5,
  },

  logIn: {
    // color: 'rgba(14, 14, 14, 0.5)',
    letterSpacing: -0.3,
    fontSize: 16,
    lineHeight: 21,
    // fontWeight: 'bold',
  },
});
