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
  MdMicOff,
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
import ReactStopwatch from "react-stopwatch";
import Gap from "raduikit/src/gap";


@connect(store => {
  return {
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class MainCallBoxCompacted extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {dispatch, chatCallBoxShowing, chatCallStatus, chatCallParticipantList} = this.props;
    const {status} = chatCallStatus;
    const {contact} = chatCallBoxShowing;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const callStarted = status === CHAT_CALL_STATUS_STARTED;
    const realUserFromParticipantList = chatCallParticipantList.find(participant => contact.id === participant.id);
    const realUser = realUserFromParticipantList || user;
    return <Container className={style.MainCallBoxCompactedPerson} onClick={this.onAudioPlayerClick}>
      <Avatar>
        <Container relative>
          <AvatarImage src={avatarUrlGenerator(getImage(realUser), avatarUrlGenerator.SIZES.MEDIUM)}
                       text={avatarNameGenerator(getName(realUser)).letter}
                       textBg={avatarNameGenerator(getName(realUser)).color}/>
          {realUser.mute &&
          <Container className={style.MainCallBoxCompactedPerson__MicOffContainer}>
            <MdMicOff size={styleVar.iconSizeXs}
                      color={styleVar.colorGrayDark}
                      style={{margin: "3px 4px"}}/>
          </Container>
          }
        </Container>
        <AvatarName maxWidth={"150px"}>
          {getName(realUser)}
          <AvatarText>
            <Text size="xs"
                  color="accent"
                  inline>{incomingCondition ? strings.ringing : callStarted ? strings.callStarted : strings.calling}</Text>
            {callStarted &&
            <Gap x={5}>
              <ReactStopwatch
                seconds={window.calltimerSec}
                minutes={window.calltimerMins}
                render={({formatted, hours, minutes, seconds}) => {
                  return (
                    <Text size="xs" color="accent" bold inline>
                      {minutes > 10 ? minutes : `0${minutes}`}:{seconds > 10 ? seconds : `0${seconds}`}
                    </Text>
                  );
                }}/>
            </Gap>
            }
          </AvatarText>
        </AvatarName>
      </Avatar>;
    </Container>
  }
}