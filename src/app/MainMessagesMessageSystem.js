// src/list/BoxSceneMessagesText
import React, {Component, Fragment} from "react";
import "moment/locale/fa";
import {connect} from "react-redux";
import {
  mobileCheck,
  decodeEmoji,
  clearHtml,
  emailify,
  mentionify,
  urlify,
  messageDatePetrification
} from "../utils/helpers";
import copyToClipBoard from "copy-to-clipboard";

//strings
import strings from "../constants/localization";

//actions
import {messageCancel, messageEditing, messageSend} from "../actions/messageActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {ContextItem} from "../../../pod-chat-ui-kit/src/menu/Context";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {MdEdit, MdCallMissed} from "react-icons/md";
import MainMessagesMessageBox from "./MainMessagesMessageBox";
import MainMessagesMessageBoxHighLighter from "./MainMessagesMessageBoxHighLighter";
import MainMessagesMessageBoxSeen from "./MainMessagesMessageBoxSeen";
import MainMessagesMessageBoxEdit from "./MainMessagesMessageBoxEdit";
import MainMessagesMessageBoxFooter from "./MainMessagesMessageBoxFooter";

//styling
import style from "../../styles/app/MainMessagesText.scss";
import systemStyle from "../../styles/app/MainMessagesMessageSystem.scss";
import styleVar from "../../styles/variables.scss";


@connect()
export default class MainMessagesMessageText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      isMessageByMe,
      isFirstMessage,
      thread,
      messageControlShow,
      messageTriggerShow,
      message,
      highLightMessage,
      onMessageControlShow,
      onRepliedMessageClicked,
      onMessageSeenListClick,
      onMessageControlHide,
      forceSeen,
      isChannel,
      isGroup,
      supportMode,
      ref
    } = this.props;
    return (
      <Container className={style.MainMessagesText} ref={ref}>
        <MainMessagesMessageBox message={message}
                                isChannel={isChannel} isGroup={isGroup}
                                isFirstMessage={isFirstMessage} isMessageByMe={isMessageByMe}>
          <MainMessagesMessageBoxHighLighter message={message} highLightMessage={highLightMessage}/>
          <Container userSelect="none" className={systemStyle.MainMessagesMessageSystem__TextContainer}>
            <MdCallMissed color={styleVar.colorRed} size={styleVar.iconSizeSm} style={{marginLeft: "5px"}}/>
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap" color="text" dark size="sm">
             {strings.missedCallAt(messageDatePetrification(message.time))}
            </Text>
          </Container>
        </MainMessagesMessageBox>
      </Container>
    );
  }
}