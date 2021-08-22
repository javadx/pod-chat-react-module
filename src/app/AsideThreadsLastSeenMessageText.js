import React, {Fragment} from "react";
import {
  decodeEmoji,
  clearHtml,
  isMessageIsFile, isSystemMessage, isMessageByMe
} from "../utils/helpers";
import strings from "../constants/localization";
import Typing from "./_component/Typing";
import {sanitizeRule} from "./AsideThreads";

//UI components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";

export default function (props) {
  const {isGroup, isChannel, lastMessageVO, lastMessage, draftMessage, inviter, isTyping} = props;
  const isFileReal = isMessageIsFile(lastMessageVO);
  const hasLastMessage = lastMessage || lastMessageVO;
  const isTypingReal = isTyping && isTyping.isTyping;
  const isTypingUserName = isTyping && isTyping.user.user;

  return (
    <Container> {
      isTypingReal ?
        <Typing isGroup={isGroup || isChannel} typing={isTyping}
                        textProps={{size: "sm", color: "yellow", dark: true}}/>
        :
        draftMessage ?
          <Fragment>
            <Text size="sm" inline color="red" light>{strings.draft}:</Text>
            <Text size="sm"
                  inline
                  color="gray"
                  dark
                  isHTML>{clearHtml(draftMessage, true)}</Text></Fragment>
          :
          (
            isGroup && !isChannel ?
              hasLastMessage ?
                <Container display="inline-flex">

                  <Container>
                    <Text size="sm" inline
                          color="accent">{isTypingReal ? isTypingUserName : draftMessage ? "Draft:" : lastMessageVO.participant && (lastMessageVO.participant.contactName || lastMessageVO.participant.name)}:</Text>
                  </Container>

                  <Container>
                    {isFileReal ?
                      <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                      :
                      <Text isHTML size="sm" inline color="gray"
                            sanitizeRule={sanitizeRule}
                            dark>{decodeEmoji(lastMessage, 30)}</Text>
                    }
                  </Container>

                </Container>
                :
                <Text size="sm" inline
                      color="accent">{decodeEmoji(strings.createdAThread(inviter && (inviter.contactName || inviter.name), isGroup, isChannel), 30)}</Text>
              :
              hasLastMessage ? isFileReal ?
                <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                :
                !lastMessage ?
                  <Text bold size="xs" italic color="gray" dark>{strings.unknownMessage}</Text>
                  :
                  <Fragment>
                  {isSystemMessage(lastMessageVO) ?

                    <Fragment>
                      <Container style={{alignItems: "center", alignContent: "center", display: "flex"}}>
                        <Container>
                          {isMessageByMe(lastMessageVO) ?
                            <MdCallEnd color={styleVar.colorRed} size={styleVar.iconSizeSm}
                                       style={{marginLeft: "5px"}}/> :
                            <MdCallMissed color={styleVar.colorRed} size={styleVar.iconSizeSm}
                                          style={{marginLeft: "5px"}}/>}
                        </Container>
                        <Container>
                          <Text isHTML wordWrap="breakWord" size="sm" color="gray" dark>
                            {!isMessageByMe(lastMessageVO) ? strings.missedCallAt(messageDatePetrification(lastMessageVO.time)) : strings.participantRejectYourCall(thread.title, messageDatePetrification(lastMessageVO.time))}
                          </Text>
                        </Container>


                      </Container>
                    </Fragment> :

                    <Text isHTML size="sm" inline color="gray"
                          sanitizeRule={sanitizeRule}
                          dark>{decodeEmoji(lastMessage, 30)}</Text>
                  }

                </Fragment>

                :
                <Text size="sm" inline
                      color="accent">{decodeEmoji(strings.createdAThread(inviter && (inviter.contactName || inviter.name), isGroup, isChannel), 30)}</Text>
          )
    }
    </Container>
  )
}