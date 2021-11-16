import {activeColor} from '@common';
import React, {FC, useState} from 'react';
import {Keyboard, SafeAreaView, StyleSheet} from 'react-native';
import {DefaultTheme, Provider, TextInput} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';

export type DropdownItem = {
  label: string;
  value: string;
};
type DropdownProps = {
  label: string;
  items: DropdownItem[];
  open: boolean;
  setOpen: (value: boolean) => void;
};
const Dropdown: FC<DropdownProps> = ({label, items, open, setOpen}) => {
  const [value, setValue] = useState(items?.[0].value ?? '');

  return (
    <Provider theme={dropdownInputTheme}>
      <SafeAreaView style={style.containerStyle}>
        <DropDown
          label={label}
          mode={'outlined'}
          value={value}
          setValue={val => {
            setValue(val.toString());
            setOpen(false);
          }}
          list={items}
          showDropDown={() => {
            Keyboard.dismiss();
            setOpen(true);
          }}
          onDismiss={() => setOpen(false)}
          visible={open}
          inputProps={{
            right: (
              <TextInput.Icon name={'menu-down'} forceTextInputFocus={false} />
            ),
          }}
          dropDownStyle={style.dropdownStyle}
          dropDownItemStyle={style.dropdownItemStyle}
        />
      </SafeAreaView>
    </Provider>
  );
};

const dropdownInputTheme = {
  ...DefaultTheme,
  roundness: 2,
  dark: false,

  colors: {
    ...DefaultTheme.colors,
    primary: activeColor,
  },
};
const style = StyleSheet.create({
  containerStyle: {
    // borderColor: 'red',
    // borderWidth: 2,
  },
  dropdownStyle: {
    // backgroundColor: 'red',
    // paddingVertical: 5,
  },

  dropdownItemStyle: {
    // padding: 20,
    backgroundColor: 'white',
    color: 'green',
    borderColor: 'blue',

    // marginVertical: -8,
  },
});

export default Dropdown;
