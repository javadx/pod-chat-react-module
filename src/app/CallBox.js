import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import classnames from "classnames";


//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer, chatCallBoxShowing as chatCallBoxShowingAction, chatRejectCall} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdExpandLess,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import CallBoxScenePerson from "./CallBoxScenePerson";
import CallBoxControlSet from "./CallBoxControlSet";

//styling
import style from "../../styles/app/CallBox.scss";
import styleVar from "../../styles/variables.scss";
import {getMessageMetaData, isGroup} from "../utils/helpers";
import {
  CHAT_CALL_BOX_COMPACTED, CHAT_CALL_BOX_FULL_SCREEN,
  CHAT_CALL_BOX_NORMAL,
  CHAT_CALL_STATUS_INCOMING,
  CHAT_CALL_STATUS_OUTGOING, CHAT_CALL_STATUS_STARTED, DROPPING_INCOMING_TIME_OUT, DROPPING_OUTGOING_TIME_OUT
} from "../constants/callModes";
import CallBoxHead from "./CallBoxHead";
import ringtoneSound from "../constants/ringtone.mp3";
import callingTone from "../constants/callingTone.mp3";
import CallBoxSceneGroup from "./CallBoxSceneGroup";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus,
    threadObject: store.thread
  }
}, null, null, {forwardRef: true})
export default class CallBox extends Component {

  constructor(props) {
    super(props);
    this.onCallBoxClick = this.onCallBoxClick.bind(this);
    //create notification audio tag
    this.playRingtone = this.playRingtone.bind(this);
    this.stopRingtone = this.stopRingtone.bind(this);
    this.interValId = null;
    this.ringtone = new Audio(ringtoneSound);
    this.ringtone.loop = true;
    this.ringtone.muted = true;

    this.callingTone = new Audio(callingTone);
    this.callingTone.loop = true;
    this.callingTone.muted = true;
  }

  setTimeoutForDropping(type, timeout) {
    const {dispatch} = this.props;
    if (!this.interValId) {
      this.interValId = setTimeout(e => {
        const {chatCallStatus} = this.props;
        if (chatCallStatus.status === type) {
          dispatch(chatRejectCall(chatCallStatus.call));
          this.stopRingtone(type);
          this.interValId = window.clearInterval(this.interValId);
        }
      }, timeout);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {chatCallStatus} = this.props;
    const {chatCallStatus: oldChatCallStatus} = prevProps;
    const {status: oldStatus} = oldChatCallStatus;
    const {status, call} = chatCallStatus;
    if (oldStatus !== status) {
      this.interValId = window.clearInterval(this.interValId);
      if (status === CHAT_CALL_STATUS_INCOMING) {
        this.setTimeoutForDropping(CHAT_CALL_STATUS_INCOMING, DROPPING_INCOMING_TIME_OUT);
        this.playRingtone(CHAT_CALL_STATUS_INCOMING);
      } else {
        if (status === CHAT_CALL_STATUS_OUTGOING) {
          this.setTimeoutForDropping(CHAT_CALL_STATUS_OUTGOING, DROPPING_OUTGOING_TIME_OUT);
          this.playRingtone(CHAT_CALL_STATUS_OUTGOING);
        }
        if (!status || status === CHAT_CALL_STATUS_STARTED) {
          this.stopRingtone(CHAT_CALL_STATUS_OUTGOING);
          this.stopRingtone(CHAT_CALL_STATUS_INCOMING);
        }
      }
    }
  }

  onCallBoxClick() {
    const {dispatch, chatCallBoxShowing} = this.props;
    const {thread, contact} = chatCallBoxShowing;
    dispatch(chatCallBoxShowingAction(CHAT_CALL_BOX_COMPACTED, thread, contact));
  }

  playRingtone(type) {
    if (type === CHAT_CALL_STATUS_INCOMING) {
      this.ringtone.currentTime = 0;
      this.ringtone.muted = false;
      //this.ringtone.play();
    } else if (type === CHAT_CALL_STATUS_OUTGOING) {
      this.callingTone.currentTime = 0;
      this.callingTone.muted = false;
      //this.callingTone.play();
    }
  }

  stopRingtone(type) {
    if (type === CHAT_CALL_STATUS_INCOMING) {
      this.ringtone.muted = true;
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
    } else if (type === CHAT_CALL_STATUS_OUTGOING) {
      this.callingTone.muted = true;
      this.callingTone.pause();
      this.callingTone.currentTime = 0;
    }
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing, threadObject} = this.props;
    const {showing: callBoxShowingType, thread} = chatCallBoxShowing;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const {thread: currentThread, threadFetching} = threadObject;
    const classNames = classnames({
      [style.CallBox]: true,
      [style["CallBox--showing"]]: callBoxShowingType === CHAT_CALL_BOX_NORMAL || callBoxShowingType === CHAT_CALL_BOX_FULL_SCREEN,
      [style["CallBox--fullScreen"]]: callBoxShowingType === CHAT_CALL_BOX_FULL_SCREEN,
      [style["CallBox--noThreadOpened"]]: (!currentThread.id && !threadFetching),
      [style["CallBox--calling"]]: !incomingCondition,
      [style["CallBox--group"]]: thread && isGroup(thread)

    });

    return <Container className={classNames}>


      <Container className={style.CallBox__Head} onClick={this.onCallBoxClick}>
        <CallBoxHead chatCallStatus={chatCallStatus} thread={thread} chatCallBoxShowing={chatCallBoxShowing}/>
      </Container>
      {(callBoxShowingType === CHAT_CALL_BOX_NORMAL  || callBoxShowingType === CHAT_CALL_BOX_FULL_SCREEN )&&
      <Fragment>
        <Container className={style.CallBox__Scene}>
          {isGroup(thread) ?
            <CallBoxSceneGroup chatCallStatus={chatCallStatus} chatCallBoxShowing={chatCallBoxShowing}/>
            :
            <CallBoxScenePerson chatCallStatus={chatCallStatus} chatCallBoxShowing={chatCallBoxShowing}/>
          }
        </Container>
        <Container className={style.CallBox__ControlSet}>
          <CallBoxControlSet stopRingtone={this.stopRingtone} className={style.CallBox__ControlSet}/>
        </Container>
      </Fragment>
      }


    </Container>
  }
}