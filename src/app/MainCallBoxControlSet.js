import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {
  chatAcceptCall,
  chatAudioPlayer,
  chatCallBoxShowing, chatCallMuteParticipants,
  chatCallStatus, chatCallUnMuteParticipants,
  chatRejectCall
} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {ButtonFloating} from "../../../pod-chat-ui-kit/src/button"
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdCall,
  MdMicOff,
  MdVolumeOff,
  MdVolumeUp,
  MdMic,
  MdSpeaker,
  MdPlayArrow,
  MdPause
} from "react-icons/md";

//styling
import style from "../../styles/app/MainCallBoxControlSet.scss";
import styleVar from "../../styles/variables.scss";
import {getMessageMetaData, mobileCheck} from "../utils/helpers";
import {
  CALL_DIV_ID,
  CHAT_CALL_BOX_NORMAL,
  CHAT_CALL_STATUS_DIVS,
  CHAT_CALL_STATUS_INCOMING,
  CHAT_CALL_STATUS_STARTED
} from "../constants/callModes";
import classnames from "classnames";
import {getParticipant} from "./ModalThreadInfoPerson";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus,
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  }
})
export default class MainCallBoxControlSet extends Component {

  constructor(props) {
    super(props);
    this.onDropCallClick = this.onDropCallClick.bind(this);
    this.onAcceptCallClick = this.onAcceptCallClick.bind(this);
    this.onVolumeClick = this.onVolumeClick.bind(this);
    this.onMicClick = this.onMicClick.bind(this);
    this.state = {
      volume: true,
      mic: true
    }
  }

  componentDidMount() {
    const {user, chatCallParticipantList, chatCallStatus} = this.props;
    if (chatCallParticipantList.length) {
      const participant = chatCallParticipantList.find(e => e.id === user.id);

      if (participant) {
        const {mic, volume} = this.state;
        if (participant.mute) {
          if (mic) {
            this.setState({
              mic: false
            });
          }
        }

        if (chatCallStatus && chatCallStatus.call) {
          const {uiRemoteAudio} = chatCallStatus.call;
          if (volume && uiRemoteAudio) {
            if (uiRemoteAudio.muted) {
              this.setState({
                volume: false
              });
            }
          }
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {chatCallStatus, dispatch} = this.props;
    const {chatCallStatus: oldChatCallStatus} = prevProps;
    const {status: oldStatus} = oldChatCallStatus;
    const {status} = chatCallStatus;
    if (oldStatus !== status) {
      if (status === CHAT_CALL_STATUS_STARTED) {
        const {volume, mic} = this.state;
        const {callId, uiRemoteAudio} = chatCallStatus.call;
        const {user} = this.props;
        if (!mic) {
          dispatch(chatCallMuteParticipants(callId, [user.id]));
        }
        if (!volume) {
          if (uiRemoteAudio) {
            uiRemoteAudio.muted = true;
          }
        }
      }
    }
  }

  onDropCallClick(e) {
    e.stopPropagation();
    const {stopRingtone, dispatch, chatCallStatus} = this.props;
    const {call, status} = chatCallStatus;
    dispatch(chatRejectCall(call, status));
    stopRingtone(status);
  }

  onAcceptCallClick(e) {
    e.stopPropagation();
    const {dispatch, chatCallStatus, stopRingtone} = this.props;
    const {call, status} = chatCallStatus;
    dispatch(chatAcceptCall(call));
    stopRingtone(status);
  }

  onVolumeClick(e) {
    e.stopPropagation();
    const currentState = this.state.volume;
    const nextState = !currentState;
    const {chatCallStatus} = this.props;
    const {call, status} = chatCallStatus;
    const {uiRemoteAudio} = call;
    if (uiRemoteAudio) {
      uiRemoteAudio.muted = !nextState;
    }
    this.setState({
      volume: nextState,
    })
  }

  onMicClick(e) {
    e.stopPropagation();
    const currentState = this.state.mic;
    const nextState = !currentState;
    const {chatCallStatus, user, dispatch} = this.props;
    if (nextState) {
      dispatch(chatCallUnMuteParticipants(chatCallStatus.call.callId, [user.id]));
    } else {
      dispatch(chatCallMuteParticipants(chatCallStatus.call.callId, [user.id]));
    }
    this.setState({
      mic: nextState,
    })
  }

  render() {
    const {chatCallStatus, buttonSize} = this.props;
    const {mic, volume} = this.state;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const callDropClassNames = classnames({
      [style.MainCallBoxControlSet__Button]: true,
      [style.MainCallBoxControlSet__DropCall]: true
    });
    const callAcceptClassNames = classnames({
      [style.MainCallBoxControlSet__Button]: true,
      [style.MainCallBoxControlSet__AcceptCall]: true
    });
    const speakerOnOrOffClassNames = classnames({
      [style.MainCallBoxControlSet__Button]: true,
      [style.MainCallBoxControlSet__Speaker]: true
    });
    const micOffOrOnClassNames = classnames({
      [style.MainCallBoxControlSet__Button]: true,
      [style.MainCallBoxControlSet__Mic]: true
    });

    return <Container className={style.MainCallBoxControlSet}>
      <ButtonFloating onClick={this.onDropCallClick} size={buttonSize || "sm"} className={callDropClassNames}>
        <MdCall size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/>
      </ButtonFloating>
      {incomingCondition &&
      <ButtonFloating onClick={this.onAcceptCallClick} size={buttonSize || "sm"} className={callAcceptClassNames}>
        <MdCall size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/>
      </ButtonFloating>
      }
      {!incomingCondition &&
      <ButtonFloating onClick={this.onMicClick} size={buttonSize || "sm"} className={micOffOrOnClassNames}>

        {mic ?
          <MdMic size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/> :
          <MdMicOff size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/>
        }
      </ButtonFloating>
      }
      {!incomingCondition &&
      <ButtonFloating onClick={this.onVolumeClick} size={buttonSize || "sm"} className={speakerOnOrOffClassNames}>

        {volume ?
          <MdVolumeUp size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/> :
          <MdVolumeOff size={styleVar.iconSizeMd} style={{margin: "7px 5px"}}/>
        }

      </ButtonFloating>
      }
    </Container>
  }
}