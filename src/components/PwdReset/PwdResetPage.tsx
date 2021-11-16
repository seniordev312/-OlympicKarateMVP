import {accentColor, activeColor, makeSource, MIN_LENGTH_PWD} from '@common';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootRouteProps, RootStackNavigation} from '@routes';
import {UserService} from '@services/api';
import {translateContext} from '@services/Translations/translate';
import {useToggle} from '@utils/hooks';
import {get} from 'lodash';
import React, {FC, useContext, useEffect, useState} from 'react';
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

type PwdResetPage = {
  logoUrl: string;
  title: string;
};

enum PwdResetInputForm {
  PASSWORD = 'password',
  PASSWORD_REPEAT = 'passwordRepeat',
}

type PwdResetInput = Record<PwdResetInputForm, any>;

export enum Validators {
  EMAIL_VALIDATOR = 'EMAIL_VALIDATOR',
}

export const PwdResetPage: FC<PwdResetPage> = ({logoUrl, title}) => {
  const {t} = useContext(translateContext);
  const [resetToken, setResetToken] = useState('');
  const {state: showPwd, toggle: togglePwdVisibility} = useToggle(false);
  const {state: showPwdRepeat, toggle: togglePwdRepeatVisibility} =
    useToggle(false);
  const navigation = useNavigation();
  const route = useRoute<RootRouteProps<'reset'>>();
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<PwdResetInput>();

  const formInputs: FormInputProps[] = [
    {
      label: t('newPassword'),
      placeholder: t('passwordPh'),
      name: PwdResetInputForm.PASSWORD,
      control: control,
      errors: errors,
      errorMsg: t('formValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_PWD},
      secureTextEntry: !showPwd,
      right: (
        <TextInput.Icon
          name={showPwd ? 'eye' : 'eye-off'}
          // eslint-disable-next-line react-native/no-inline-styles
          color={showPwd ? activeColor : accentColor}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginBottom: -10}}
          onPress={() => togglePwdVisibility()}
          forceTextInputFocus={false}
        />
      ),
    },
    {
      label: t('repeatPassword'),
      placeholder: t('passwordPh'),
      name: PwdResetInputForm.PASSWORD_REPEAT,
      control: control,
      errors: errors,
      errorMsg: t('formValidationDefaultMsg'),
      rules: {required: true, minLength: MIN_LENGTH_PWD},
      secureTextEntry: !showPwdRepeat,
      right: (
        <TextInput.Icon
          name={showPwdRepeat ? 'eye' : 'eye-off'}
          // eslint-disable-next-line react-native/no-inline-styles
          color={showPwdRepeat ? activeColor : accentColor}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginBottom: -10}}
          onPress={() => togglePwdRepeatVisibility()}
          forceTextInputFocus={false}
        />
      ),
    },
  ];

  const navigateTo = (route: keyof RootStackNavigation) => {
    navigation.navigate(route);
  };

  const handleReset = async (data: PwdResetInput) => {
    if (data.password !== data.passwordRepeat) {
      return;
    }
    const response = await UserService.updatePassword(
      {password: data.password, token: resetToken, email: ''},
      {Authorization: `Bearer ${resetToken ?? ''}`},
    );

    if (response.success) {
      navigateTo('login');
    } else {
      setServerError(response.failedMsg);
    }
  };

  const renderFormInputs = (props: FormInputProps) => <FormInput {...props} />;

  useEffect(() => {
    route.params?.token && setResetToken(route.params.token);
  }, [route.params]);

  return (
    <ScrollView style={style.container}>
      <View style={style.header}>
        <Logo imageUrl={logoUrl} onPressHandler={() => navigateTo('login')} />
        <View style={style.titleWrap}>
          <Text style={style.title}>{title}</Text>
        </View>
      </View>
      <View style={style.form}>
        {React.Children.toArray(formInputs.map(renderFormInputs))}

        <Text style={style.errorMsg}>{serverError || ''}</Text>

        <View style={style.btnGroup}>
          <TouchableOpacity
            style={style.signupBtn}
            onPress={handleSubmit(handleReset)}>
            <Text style={style.signupBtnFont}>{t('reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  errors: DeepMap<any, FieldError>;
  secureTextEntry?: boolean;
  rules?: UseControllerProps['rules'];
  errorMsg: string;
  right?: React.ReactNode;
};

export const FormInput: FC<FormInputProps> = ({
  label,
  placeholder,
  name,
  control,
  errors,
  secureTextEntry,
  rules,
  right,
  errorMsg,
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
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    height: '40%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    maxWidth: 80,
    width: 80,
    height: 80,
    marginTop: 10,
    resizeMode: 'center',
  },

  email: {},

  form: {
    height: '80%',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  formInput: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 10,
  },
  formTextInput: {
    minWidth: '40%',
    width: '90%',
    height: 60,
    fontSize: 16,

    alignSelf: 'center',
    paddingHorizontal: -10,
    backgroundColor: 'white',
  },

  errorMsg: {
    paddingTop: 10,
    paddingHorizontal: 20,

    fontSize: 14,
    color: activeColor,
  },

  titleWrap: {
    maxWidth: '60%',
    marginLeft: 10,

    // borderColor: 'red',
    // borderWidth: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    lineHeight: 36,
    flexWrap: 'wrap',
  },

  btnGroup: {
    marginTop: 40,
    flexDirection: 'column',
  },

  alreadyMemberWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
    minHeight: 80,

    marginTop: 10,
  },
  signupBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,

    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: activeColor,
  },

  signupBtnFont: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  alreadyMember: {
    color: 'rgba(14, 14, 14, 0.5)',
    fontSize: 16,
    lineHeight: 30,
    marginHorizontal: 5,
  },

  logIn: {
    color: 'rgba(14, 14, 14, 0.5)',
    fontSize: 18,
    lineHeight: 30,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
});
