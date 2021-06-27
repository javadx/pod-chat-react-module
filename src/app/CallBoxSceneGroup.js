import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdClose,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";

//styling
import style from "../../styles/app/CallBoxSceneGroup.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";
import CallBoxSceneGroupParticipants from "./CallBoxSceneGroupParticipants";


@connect(store => {
  return {
    user: store.user.user
  };
})
export default class CallBoxSceneGroup extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing, user} = this.props;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const {thread, contact} = chatCallBoxShowing;
    const avatarContainerClassNames = classnames({
      [style.CallBoxSceneGroup__AvatarContainer]: !incomingCondition
    });
    const avatarClassName = classnames({
      [style.CallBoxSceneGroup__Avatar]: true
    });

    return <Container className={style.CallBoxSceneGroup}>
      {
        !incomingCondition && <CallBoxSceneGroupParticipants chatCallBoxShowing={chatCallBoxShowing}/>
      }

      <Container className={avatarContainerClassNames}>
        <Avatar cssClassNames={avatarClassName} inline={false}>
          <AvatarImage
            size="xlg"
            src={avatarUrlGenerator.apply(this, [thread.image, avatarUrlGenerator.SIZES.SMALL, getMessageMetaData(thread)])}
            text={avatarNameGenerator(thread.title).letter}
            textBg={avatarNameGenerator(thread.title).color}/>
          <Gap y={5}/>
          <AvatarName maxWidth={"110px"} style={{marginRight: "0", maxWidth: "96px"}} size="sm">
            {thread.title}
          </AvatarName>
          {incomingCondition &&
          <AvatarText>
            <Text size="xs" inline color="accent"> {getName(contact)} در حال تماس است</Text>
          </AvatarText>
          }
        </Avatar>
      </Container>
    </Container>
  }
}