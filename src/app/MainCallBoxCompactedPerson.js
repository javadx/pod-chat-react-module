import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../pod-chat-ui-kit/src/avatar";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdClose,
  MdPlayArrow,
  MdPause
} from "react-icons/md";

//styling
import style from "../../styles/app/MainCallBoxCompactedPerson.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator} from "../utils/helpers";
import {getImage, getName} from "./_component/contactList";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_STARTED, MOCK_CONTACT} from "../constants/callModes";
import strings from "../constants/localization";
import date from "../utils/date";


@connect()
export default class MainCallBoxCompacted extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {dispatch, chatCallBoxShowing, chatCallStatus} = this.props;
    const {status} = chatCallStatus;
    const {contact} = chatCallBoxShowing;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const callStarted = status === CHAT_CALL_STATUS_STARTED;
    return <Container className={style.MainCallBoxCompactedPerson} onClick={this.onAudioPlayerClick}>
      <Avatar>
        <AvatarImage src={avatarUrlGenerator(getImage(contact), avatarUrlGenerator.SIZES.MEDIUM)}
                     text={avatarNameGenerator(getName(contact)).letter}
                     textBg={avatarNameGenerator(getName(contact)).color}/>
        <AvatarName maxWidth={"150px"}>
          {getName(contact)}
          <AvatarText>
            <Text size="xs"
                  color="accent">{incomingCondition ? strings.ringing : callStarted ? strings.callStarted : strings.calling}</Text>
          </AvatarText>
        </AvatarName>
      </Avatar>;
    </Container>
  }
}