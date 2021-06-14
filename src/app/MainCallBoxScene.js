import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMicOff,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";
import MainCallBoxToaster from "./MainCallBoxToaster";

//styling
import style from "../../styles/app/MainCallBoxScene.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData, isVideoCall} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap"
import MainCallBoxSceneVideo from "./MainCallBoxSceneVideo";
import MainCallBoxSceneAudio from "./MainCallBoxSceneAudio";


@connect(store => {
  return {
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class MainCallBoxScene extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing, user, chatCallParticipantList} = this.props;
    const {status, call} = chatCallStatus;
    const isVideoCalling = isVideoCall(call);
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const outgoingCondition = status === CHAT_CALL_STATUS_OUTGOING;
    const commonArgs = {
      chatCallStatus,
      chatCallBoxShowing,
      user,
      chatCallParticipantList
    };
    return isVideoCalling && !incomingCondition && !outgoingCondition ?
      <MainCallBoxSceneVideo {...commonArgs}/> :
      <MainCallBoxSceneAudio {...commonArgs}/>;
  }
}