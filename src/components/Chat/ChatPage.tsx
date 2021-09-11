/* eslint-disable no-bitwise */
/* eslint-disable no-shadow */
import {ANONYMOUS, getLectionProgressState, getMentionMessage} from '@common';
import {
  getGreetingAnswers,
  getGreetingMessages,
  getGreetingPositiveMessages,
  MESSAGE_ANIMATION_DURATION,
  MESSAGE_DELAY,
  NO_DELAY_LIMIT_PER_MSG_INDEX,
  REDIRECT_TIMEOUT,
} from '@components/Learn/common';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NavbarRouteProps} from '@routes';
import {LectionService, useGetLectionProgressData} from '@services/api';
import {Endpoints, RoutePlaceholders} from '@services/api/types';
import {StorageKeys, StorageService} from '@services/storage';
import {translateContext} from '@services/Translations/translate';
import {ToggleContext, UserContext} from '@store';
import {useIsMounted, useToggle} from '@utils/hooks';
import {Header} from 'components/Learn/Header';
import {isEmpty, keys} from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import uuid from 'react-native-uuid';
import {
  Answer,
  Lection,
  LectionProgress,
  LectionProgressState,
  Question,
} from '../../models';
import {ChatAnswers} from './ChatAnswers';
import {ChatMessage, Message, Side} from './ChatMessage';
import {RedirectButton} from './components/RedirectButton';

const teacher = {
  profileThumbnail:
    'https://studumapp.ru/wp-content/themes/studyum-1/images/5f86fa09bace9b4085203e00_Image.png',
};
const DEFAULT_TITLE = 'Studyum';

export const ChatPage = () => {
  const route = useRoute<NavbarRouteProps<'chat'>>();
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const isFocused = useIsFocused();
  const {t} = useContext(translateContext);
  const {togglePressBlockOverlay, togglePaused} = useContext(ToggleContext);

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [isFirstTimeHehe, setIsFirstTimeHehe] = useState(true);
  const [positiveMessages, setPositiveMessages] = useState<string[]>([]);
  const [negativeMessages, setNegativeMessages] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [questionAnsweredCorrect, setQuestionAnsweredCorrect] = useState(false);
  const [redirectButtonText, setRedirectButtonText] = useState('');
  const [timeLeftBeforeRedirect, setTimeLeftBeforeRedirect] = useState(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const [onTimerEnd, setOnTimerEnd] = useState<() => void>(() => {});

  const flatListRef = useRef<FlatList>(null);
  const isMounted = useIsMounted();
  const {state: confettiVisible, setOn: showConfetti} = useToggle(false);

  const {data: lectionProgress, loading: loadingLectionProgress} =
    useGetLectionProgressData(
      Endpoints.lectionProgress.replace(
        RoutePlaceholders.USER_ID,
        user.id ?? '',
      ),
      {
        params: {userId: user.id ?? ''},
        headers: {
          Authorization: `Bearer ${user.token ?? ''}`,
        },
      },
      [user.id],
      !!user?.id,
    );
  const removePossibleAnswer = (text: string) =>
    setAnswers(answers.filter(a => a.text !== text));

  const calculateMessageTimeout = (msg: Message, i: number) => {
    if (i === 0) {
      return 0;
    }

    // TODO: This is a 'hard coded' delay based on index
    // TODO: This calculation will be used for now. Maybe in the future they decide to use a diff approach
    const msgTimeout =
      (i < NO_DELAY_LIMIT_PER_MSG_INDEX ? i / 4 : i) * MESSAGE_DELAY;
    // const wordsNum = msg.text.split(' ').length;
    // const msgTimeout = Math.round(
    //   wordsNum / WORDS_PER_MS + MESSAGE_ANIMATION_DURATION,
    // );
    console.log('Message', i, 'timeout:', msgTimeout);

    return msgTimeout;
  };

  const addMessage = async (answer: Answer) => {
    const newMessages: Message[] = [{...answer, id: uuid.v4().toString()}];
    let updatedMessages = [...messages];

    removePossibleAnswer(answer.text);

    const isGreetingAnswerCorrect =
      isFirstTimeHehe && t('chatGreetingAnswer01') === answer.text;

    if (
      t('lectionDefaultSuggestedAnswer') === answer.text ||
      isGreetingAnswerCorrect
    ) {
      const state = getLectionProgressState(lectionProgress);
      setAnswers([]);
      togglePressBlockOverlay.setOn();
      setRedirectButtonText(t('redirectStopMessage'));

      if (LectionProgressState.NOT_PASSED === state) {
        loadStateFromStorage();
        return;
      } else if (LectionProgressState.NOT_COMPLETED === state) {
        redirect();
        return;
      }
    }

    if (answer.isCorrect) {
      setQuestionAnsweredCorrect(true);
      setRedirectButtonText(t('redirectStopMessage'));
      setAnswers([]);
      setPositiveMessages([]);

      newMessages.push(
        ...positiveMessages.map(posMsg => ({
          id: uuid.v4().toString(),
          text: posMsg,
          user: teacher,
        })),
      );

      if (questions.length === 0) {
        togglePressBlockOverlay.setOn();

        // const messageTimeouts = sum(newMessages.map(calculateMessageTimeout));
        const messageTimeouts = newMessages.length * MESSAGE_DELAY;
        const totalTimeout = REDIRECT_TIMEOUT + messageTimeouts;
        console.log(
          '[CORRECT ANSWER] 👉 Total timeout:',
          totalTimeout,
          '=',
          messageTimeouts,
          '+',
          REDIRECT_TIMEOUT,
        );

        playNextLection(
          {lectionWatched: true, questionAnsweredCorrect: true},
          messageTimeouts,
          REDIRECT_TIMEOUT,
        );
      } else {
        // FIFO logic - get first question & remove it from queue
        newMessages.push({...questions[0], id: uuid.v4().toString()});
        setQuestions(questions.slice(1));
      }
    } else if (negativeMessages.length > 0) {
      const negMsg = negativeMessages?.[0] ?? '';

      // Keep the last negative message as default
      if (negativeMessages.length > 1) {
        setNegativeMessages(negativeMessages.slice(1));
      }
      newMessages.push({
        id: uuid.v4().toString(),
        text: negMsg,
        user: teacher,
      });
      togglePressBlockOverlay.setOn();
      setQuestionAnsweredCorrect(false);
      setRedirectButtonText(t('redirectStopMessage'));
      setAnswers([]);

      // const messageTimeouts = sum(newMessages.map(calculateMessageTimeout));
      const messageTimeouts = newMessages.length * MESSAGE_DELAY;
      const totalTimeout = REDIRECT_TIMEOUT + messageTimeouts;

      console.log(
        '👉 Total timeout:',
        totalTimeout,
        '=',
        messageTimeouts,
        '+',
        REDIRECT_TIMEOUT,
      );
      redirect(undefined, messageTimeouts, REDIRECT_TIMEOUT);
      // Reset user progress to prevent cheating on answers
      LectionService.updateLearningProgress(
        user.id ?? '',
        {lectionWatched: false, questionAnsweredCorrect: false},
        user.token ?? '',
      );
    }

    for (let i = 0; i < newMessages.length; i++) {
      const delay = calculateMessageTimeout(newMessages[i], i);
      console.log('[FOR LOOP] 👉 Delay: ', delay);
      updatedMessages.push({...newMessages[i], delay});
      setMessages(updatedMessages);
    }
  };

  const renderMessage = (msg: Message) => {
    return (
      <ChatMessage
        key={msg.id}
        message={msg}
        side={msg.user ? Side.FROM : Side.TO}
        messageAnimationDuration={MESSAGE_ANIMATION_DURATION}
      />
    );
  };

  const getId = useCallback(
    () => (user?.id && user?.id?.length > 0 ? user.id : ANONYMOUS),
    [user.id],
  );

  const redirectCallback = useCallback(
    (params?: {lectionId: string}) => () => {
      if (togglePaused.state) {
        return;
      }

      setQuestionAnsweredCorrect(false);
      setMessages([]);
      setPositiveMessages([]);
      setNegativeMessages([]);
      setQuestions([]);
      togglePressBlockOverlay.setOff();

      navigation.navigate('lection', params);
    },
    [navigation, togglePaused, togglePressBlockOverlay],
  );

  // TODO: Check for duplicate messages on chat. Also check if old messages remain in chat after a lection is watched to the end
  // "redirectNextMessage": "Let’s jump into the next lesson!",

  /**
   * Wraps all logic necessary for transitioning to the next screen
   * Once an user answers the question, based on the status of his answer he will be redirected to:
   *  1. Current lection - The last unlocked lection. This happens if the user answers the question INCORRECTLY or he left the app before watching the video until the end
   *  2. Next lection    - The new lection which was unlocked by answering the answer correct.
   *
   *
   * @param params - Object which contains params for react navigation.
   * Chat can only redirect to the lection page, therefore only valid prop in this object is lectionId
   * @param startRedirectTimeout - Timeout value which dictates when the redirect timer should be set & started
   * @param redirectTimeout - Timeout value which dictates for how lon the redirect timer will last
   */
  const redirect = async (
    params?: {lectionId: string},
    startRedirectTimeout = 0,
    redirectTimeout = REDIRECT_TIMEOUT,
  ) => {
    setOnTimerEnd(() => {
      return redirectCallback(params);
    });
    setTimeLeftBeforeRedirect(~~(redirectTimeout / 1000));
    setTotalTime(~~((startRedirectTimeout + redirectTimeout) / 1000));
  };

  const playNextLection = useCallback(
    async (
      lectionProgress: LectionProgress,
      startRedirectTimeout = 0,
      redirectTimeout = REDIRECT_TIMEOUT,
    ) => {
      const data = await LectionService.updateLearningProgress(
        user.id ?? '',
        lectionProgress,
        user.token ?? '',
      );
      // Resolve case when all lections have been finished
      if (data?.finished) {
        console.log('All lections have been unlocked');
        setAnswers([]);
        showConfetti();
        togglePressBlockOverlay.setOff();
        return;
      }
      // Update progress in Storage
      const id = getId();
      if (!data.lection) {
        togglePressBlockOverlay.setOff();
        return;
      }

      await StorageService.setStorageValue(
        id,
        StorageKeys.CURRENT_LECTION,
        data.lection,
      );

      // Navigate to the next lection after certain amount of time
      // Timeout is here to give the user enough time to read all new messages on chat before redirection
      if (data.lection?.id) {
        redirect(
          {lectionId: data.lection?.id},
          startRedirectTimeout,
          redirectTimeout,
        );
      }
    },
    [getId, navigation, user.id, user.token],
  );

  const loadState = useCallback(
    (
      questions?: Question[],
      positiveMessages?: string[],
      negativeMessages?: string[],
    ) => {
      if (!questions || !positiveMessages || !negativeMessages) {
        return;
      }

      if (!isMounted.current) {
        return;
      }

      if (questions.length > 0) {
        setPositiveMessages(positiveMessages ?? []);
        setNegativeMessages(negativeMessages ?? []);
        setAnswers(questions[0]?.answers ?? []);
        setMessages([
          ...messages,
          {...questions[0], user: teacher, id: uuid.v4().toString(), delay: 0},
        ]);
        setQuestions(questions.slice(1));
      } else {
        playNextLection({lectionWatched: true, questionAnsweredCorrect: true});
      }
    },
    [isMounted, playNextLection],
  );

  const getCurrentLection = async (id: string) => {
    return await StorageService.getStorageValue<Lection>(
      id,
      StorageKeys.CURRENT_LECTION,
    );
  };

  const loadStateFromStorage = useCallback(async () => {
    const id = getId();

    try {
      let lection = await StorageService.getStorageValue<Lection>(
        id.toString(),
        StorageKeys.CURRENT_LECTION,
      );

      setTitle(lection?.title ?? title);
      if (lection?.order === '1-1' && !lectionProgress?.lectionWatched) {
        // navigation.navigate('learn', learnProps);
        setAnswers(getGreetingAnswers(t));
        setPositiveMessages(getGreetingPositiveMessages(t));
        setMessages(getGreetingMessages(t, teacher));
        // setTimeout(() => {}, 1000);
      } else {
        loadState(
          lection?.questions,
          lection?.positiveMessages,
          lection?.negativeMessages,
        );
      }
    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      togglePressBlockOverlay.setOff();
    }
  }, [getId, loadState, navigation, lectionProgress]);

  const loadGreetingChat = useCallback(() => {
    setMessages(getGreetingMessages(t, teacher));
    setAnswers(getGreetingAnswers(t));
  }, [t]);
  const loadMentionChat = useCallback(() => {
    if (lectionProgress) {
      const state = getLectionProgressState(lectionProgress);
      const msg = getMentionMessage(state, t);
      setMessages([{id: msg, text: msg, user: teacher, delay: 0}]);
      const answerText = t('lectionDefaultSuggestedAnswer');
      setAnswers([{id: answerText, text: answerText, isCorrect: true}]);
    }
  }, [lectionProgress, t]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd();
  }, [messages]);

  const isDataMissingInParams = (
    params: Readonly<{
      questions: Question[];
      positiveMessages: string[];
      negativeMessages: string[];
    }>,
  ) => {
    return (
      !params ||
      isEmpty(params) ||
      ('screen' in params && keys(params).length === 1) ||
      !params.negativeMessages ||
      !params.negativeMessages ||
      !params.questions
    );
  };

  const checkIsFirstTime = (
    progress: Lection | null,
    lectionProgress?: LectionProgress,
  ) => {
    return (
      !progress ||
      isEmpty(progress) ||
      (progress.order === '1-1' && !lectionProgress?.lectionWatched)
    );
  };

  const initialLoad = useCallback(async () => {
    const params = route.params;
    const progress = await getCurrentLection(user.id ?? '');
    const isFirstTime = checkIsFirstTime(progress, lectionProgress);

    setTitle(progress?.title ?? title);
    setIsFirstTimeHehe(isFirstTime);

    if (isDataMissingInParams(route.params)) {
      // If the user is on first lection & the lection hasn't been watched. Load greetings chat
      isFirstTime && !lectionProgress?.lectionWatched
        ? loadGreetingChat()
        : loadMentionChat();
      return;
    }

    loadState(
      params.questions,
      params.positiveMessages,
      params.negativeMessages,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, route.params, user.id, loadState, loadMentionChat]);

  useEffect(() => {
    // Params exist <=> navigation was triggered from another screen (lection)
    // <=> Video was watched => No need for greeting/default messages
    if (loadingLectionProgress) {
      return;
    }

    isFirstTimeHehe && messages.length === 0 && initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad, loadingLectionProgress]);

  useEffect(() => {
    if (isFocused) {
      return;
    }

    setTimeLeftBeforeRedirect(0);
    togglePaused.setOff();
    togglePressBlockOverlay.setOff();
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Set redirect text
  useEffect(() => {
    setRedirectButtonText(
      togglePaused.state ? t('redirectNextMessage') : t('redirectStopMessage'),
    );
  }, [t, togglePaused.state]);

  // Clear navigation props on component unmount
  useEffect(() => {
    console.log('CHAT PAGE MOUNTED');

    return () => {
      console.log('CHAT PAGE UNMOUNTED');
      const nullParams = keys(route.params).reduce(
        (params, param) => ({...params, [param]: null}),
        {},
      );
      navigation.setParams(nullParams);
      togglePressBlockOverlay.setOff();
      togglePaused.setOff();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={style.container}>
      {confettiVisible && (
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      )}
      <Header icon={<></>} title={title} titleStyle={style.titleStyle} />
      <FlatList
        // @ts-ignore
        ref={flatListRef}
        style={style.chat}
        data={messages}
        renderItem={({item}) => renderMessage(item)}
        keyExtractor={item => `${item.id}`}
      />
      {!!timeLeftBeforeRedirect && (
        <View style={style.redirectWrapper}>
          <RedirectButton
            label={redirectButtonText}
            timeLeft={timeLeftBeforeRedirect}
            onPress={() => togglePaused.toggle()}
            onTimerEnd={onTimerEnd}
            totalTime={totalTime}
          />
        </View>
      )}
      {answers.length ? (
        <ChatAnswers
          customStyle={style.answers}
          answers={answers}
          onPress={message => addMessage(message)}
          questionAnswered={questionAnsweredCorrect}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    backgroundColor: 'white',
  },

  // chat: {height: '64%', maxHeight: '98%'},
  chat: {height: '60%', maxHeight: '98%', marginTop: '20%'},
  answers: {maxHeight: '36%', paddingBottom: 14},

  titleStyle: {flex: 6, paddingVertical: '5%'},

  redirectWrapper: {
    position: 'absolute',
    bottom: '5%',
    zIndex: 10,
    width: '100%',
  },
});
