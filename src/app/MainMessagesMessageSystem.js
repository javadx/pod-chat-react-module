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
  messageDatePetrification, prettifyElapsedTime, analyzeCallStatus
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
import {MdEdit, MdCallMissed, MdCallEnd} from "react-icons/md";
import MainMessagesMessageBox from "./MainMessagesMessageBox";
import MainMessagesMessageBoxHighLighter from "./MainMessagesMessageBoxHighLighter";

//styling
import style from "../../styles/app/MainMessagesText.scss";
import systemStyle from "../../styles/app/MainMessagesMessageSystem.scss";
import styleVar from "../../styles/variables.scss";
import {getName} from "./_component/contactList";
import {getParticipant} from "./ModalThreadInfoPerson";


@connect()
export default class MainMessagesMessageText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      isMessageByMe,
      isFirstMessage,
      message,
      highLightMessage,
      isChannel,
      isGroup,
      ref,
      user,
      thread
    } = this.props;
    const AnalyzeResult = analyzeCallStatus(this.props);
    if (!AnalyzeResult) {
      return ""
    }
    return (
      <Container className={style.MainMessagesText} ref={ref}>
        <MainMessagesMessageBox message={message}
                                isChannel={isChannel} isGroup={isGroup}
                                isFirstMessage={isFirstMessage} isMessageByMe={isMessageByMe}>
          <MainMessagesMessageBoxHighLighter message={message} highLightMessage={highLightMessage}/>
          <Container userSelect="none" className={systemStyle.MainMessagesMessageSystem__TextContainer}>
            <AnalyzeResult.Icon/>

            {/*            {isMessageByMe ?
              <MdCallEnd color={styleVar.colorRed} size={styleVar.iconSizeSm} style={{marginLeft: "5px"}}/> :
              <MdCallMissed color={styleVar.colorRed} size={styleVar.iconSizeSm} style={{marginLeft: "5px"}}/>}*/}
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap" color="text" dark size="sm">
              {/*              {!isMessageByMe ? strings.missedCallAt(messageDatePetrification(message.time)) : strings.participantRejectYourCall(thread.title, messageDatePetrification(message.time))}*/}
              {AnalyzeResult.Text()}
            </Text>
          </Container>
        </MainMessagesMessageBox>
      </Container>
    );
  }
}