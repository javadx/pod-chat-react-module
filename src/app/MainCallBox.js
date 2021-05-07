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
import MainCallBoxScene from "./MainCallBoxScene";
import MainCallBoxControlSet from "./MainCallBoxControlSet";

//styling
import style from "../../styles/app/MainCallBox.scss";
import styleVar from "../../styles/variables.scss";
import {getMessageMetaData} from "../utils/helpers";
import {
  CHAT_CALL_BOX_COMPACTED,
  CHAT_CALL_BOX_NORMAL,
  CHAT_CALL_STATUS_INCOMING,
  CHAT_CALL_STATUS_OUTGOING
} from "../constants/callModes";
import {chatCallBoxShowingReducer} from "../reducers/chatReducer";
import MainCallBoxHead from "./MainCallBoxHead";
import ringtoneSound from "../constants/ringtone.mp3";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus
  }
})
export default class MainCallBox extends Component {

  constructor(props) {
    super(props);
    this.onCallBoxClick = this.onCallBoxClick.bind(this);
    //create notification audio tag
    this.playMusic = this.playMusic.bind(this);
    this.stopRingtone = this.stopRingtone.bind(this);
    this.ringtone = new Audio(ringtoneSound);
    this.ringtone.loop = true;
    this.muted = true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {chatCallStatus, dispatch} = this.props;
    const {chatCallStatus: oldChatCallStatus} = prevProps;
    const {status: oldStatus} = oldChatCallStatus;
    const {status} = chatCallStatus;
    if (oldStatus !== status) {
      if (status === CHAT_CALL_STATUS_INCOMING) {
        this.interValId = setInterval(e => {
          const {chatCallStatus} = this.props;
          if (chatCallStatus.status === CHAT_CALL_STATUS_INCOMING) {
            dispatch(chatRejectCall(chatCallStatus.call));
            this.stopRingtone();
            window.clearInterval(this.interValId);
          }
        }, 15000);
        this.playMusic();
      } else {
        window.clearInterval(this.interValId);
      }
    }
  }

  onCallBoxClick() {
    const {dispatch, chatCallBoxShowing} = this.props;
    const {thread, contact} = chatCallBoxShowing;
    dispatch(chatCallBoxShowingAction(CHAT_CALL_BOX_COMPACTED, thread, contact));
  }

  playMusic() {
    this.ringtone.currentTime = 0;
    this.ringtone.muted = false;
    this.ringtone.play();
  }

  stopRingtone() {
    this.ringtone.muted = true;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing} = this.props;
    const {showing: callBoxShowingType} = chatCallBoxShowing;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const classNames = classnames({
      [style.MainCallBox]: true,
      [style["MainCallBox--showing"]]: callBoxShowingType === CHAT_CALL_BOX_NORMAL,
      [style["MainCallBox--calling"]]: !incomingCondition
    });

    return <Container className={classNames}>

      {callBoxShowingType === CHAT_CALL_BOX_NORMAL &&
      <Fragment>
        <Container className={style.MainCallBox__Head} onClick={this.onCallBoxClick}>
          <MainCallBoxHead chatCallStatus={chatCallStatus}/>
        </Container>

        <Container className={style.MainCallBox__Scene}>
          <MainCallBoxScene chatCallStatus={chatCallStatus} chatCallBoxShowing={chatCallBoxShowing}/>
        </Container>
        <Container className={style.MainCallBox__ControlSet}>
          <MainCallBoxControlSet stopRingtone={this.stopRingtone} className={style.MainCallBox__ControlSet}/>
        </Container>
      </Fragment>
      }

    </Container>
  }
}