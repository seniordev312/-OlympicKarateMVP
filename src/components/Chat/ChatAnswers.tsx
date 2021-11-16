import {accentColorDisabled, lightColor} from '@common';
import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Answer} from '../../models';

type ChatAnswersProps = {
  answers: Answer[];
  customStyle: Record<string, unknown>;
  onPress: (answer: Answer) => void;
  questionAnswered?: boolean;
};
export const ChatAnswers: FC<ChatAnswersProps> = ({
  answers,
  customStyle,
  onPress,
  questionAnswered,
}) => {
  const renderAnswer = (answer: Answer) => {
    return (
      <AnswerComponent
        key={answer?.id}
        id={answer.id}
        text={answer.text}
        onPress={() => onPress(answer)}
        isAccentBtn={answers.length === 1}
      />
    );
  };

  const renderPressBlocker = () => {
    return <View style={style.pressBlocker} />;
  };

  return (
    <ScrollView
      style={{
        ...style.container,
        ...customStyle,
        ...(answers.length === 1 ? {flexDirection: 'column-reverse'} : {}),
      }}>
      {questionAnswered && renderPressBlocker()}
      {React.Children.toArray(answers.map(renderAnswer))}
    </ScrollView>
  );
};

const AnswerComponent: FC<{
  id: string;
  text: string;
  onPress: () => void;
  isAccentBtn: boolean;
}> = ({id, text, onPress, isAccentBtn}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{opacity: fadeAnim}}>
      <Pressable
        style={({pressed}) => [
          style.item,
          {
            backgroundColor: pressed ? '#F4F5F6' : style.item.backgroundColor,
            ...(isAccentBtn ? style.accentButton : {}),
          },
        ]}
        onPress={onPress}>
        <Text style={style.itemFont}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    alignSelf: 'center',
    justifyContent: 'center',

    marginHorizontal: '1%',
    marginVertical: '2%',

    minHeight: '10%',
    width: '90%',
    height: 'auto',

    paddingHorizontal: '1%',
    paddingVertical: '4.8%',
    // borderRadius: 30,

    borderWidth: 1,
    borderColor: lightColor,
    borderRadius: 8,

    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  accentButton: {
    backgroundColor: '#F4F5F6',
    borderColor: 'transparent',
    borderRadius: 8,
  },

  itemFont: {
    flex: 1,
    flexWrap: 'wrap',

    textAlign: 'center',
    fontSize: 16,
    lineHeight: 21,
    color: '#2f3134',

    letterSpacing: -0.5,
  },

  pressBlocker: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 10,
    height: '100%',
    width: '100%',

    backgroundColor: accentColorDisabled,
    opacity: 0.2,

    display: 'none',
  },
});
