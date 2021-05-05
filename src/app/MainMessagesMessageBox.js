import React from "react";

import Paper from "../../../pod-chat-ui-kit/src/paper";

import MainMessagesMessageBoxPersonName from "./MainMessagesMessageBoxPersonName";
import MainMessagesMessageBoxReply from "./MainMessagesMessageBoxReply";
import MainMessagesMessageBoxForward from "./MainMessagesMessageBoxForward";
import {isSystemMessage} from "../utils/helpers";

export default function ({scope, message, onRepliedMessageClicked, isFirstMessage, isMessageByMe, isGroup, maxReplyFragmentWidth, children}) {

  const style = {
    borderRadius: "5px"
  };
  if (isMessageByMe) {
    style.backgroundColor = "#effdde";
  }
  if (isSystemMessage(message)) {
    style.backgroundColor = "#fffae5";
    style.borderRadius = "5px";
    style.padding = "3px";
    style.textAlign = "center";
  }
  return (
    <Paper style={style} hasShadow colorBackgroundLight={!isMessageByMe} relative>
      {
        isGroup &&
        <MainMessagesMessageBoxPersonName message={message}
                                          isFirstMessage={isFirstMessage}
                                          isMessageByMe={isMessageByMe}/>
      }
      <MainMessagesMessageBoxReply isMessageByMe={isMessageByMe}
                                   message={message}
                                   onRepliedMessageClicked={onRepliedMessageClicked}
                                   maxReplyFragmentWidth={maxReplyFragmentWidth}

                                   scope={scope}/>
      <MainMessagesMessageBoxForward message={message} isMessageByMe={isMessageByMe}/>
      {children}
    </Paper>
  )
}