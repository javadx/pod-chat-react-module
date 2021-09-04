import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../pod-chat-ui-kit/src/avatar";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import {
  MdMicOff,
  MdPlayArrow,
  MdPause
} from "react-icons/md";

//styling
import style from "../../styles/app/CallBoxCompactedPerson.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, isVideoCall} from "../utils/helpers";
import {getImage, getName} from "./_component/contactList";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_STARTED, MOCK_CONTACT} from "../constants/callModes";
import strings from "../constants/localization";
import date from "../utils/date";
import Timer from "react-compound-timer";


@connect(store => {
  return {
    chatCallParticipantList: store.chatCallParticipantList.participants,
    user: store.user.user
  };
})
export default class CallBoxCompactedPerson extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {dispatch, chatCallBoxShowing, chatCallStatus, chatCallParticipantList, user} = this.props;
    const {status, call} = chatCallStatus;
    const {contact} = chatCallBoxShowing;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const callStarted = status === CHAT_CALL_STATUS_STARTED;
    const isVideoCallBool = (isVideoCall(call));
    const realUserFromParticipantList = chatCallParticipantList.find(participant => contact.id === participant.id);
    const realUser = realUserFromParticipantList || contact;
    return <Container className={style.CallBoxCompactedPerson} onClick={this.onAudioPlayerClick}>
      <Avatar>
        <Container relative>
          <AvatarImage src={avatarUrlGenerator(getImage(realUser), avatarUrlGenerator.SIZES.MEDIUM)}
                       text={avatarNameGenerator(getName(realUser)).letter}
                       textBg={avatarNameGenerator(getName(realUser)).color}/>
          {realUser.mute &&
          <Container className={style.CallBoxCompactedPerson__MicOffContainer}>
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
                  inline>{incomingCondition ? strings.ringing(isVideoCallBool) : callStarted ? strings.callStarted : strings.calling(isVideoCallBool)}</Text>
            {callStarted &&
            <Gap x={5}>
              <Timer
                formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
                initialTime={window.calltimer}>
                {({getTime}) => {
                  window.calltimer = getTime();
                  return <Text size="xs" color="accent" bold>
                    <Timer.Minutes/>:<Timer.Seconds/>
                  </Text>
                }}
              </Timer>
            </Gap>
            }
          </AvatarText>
        </AvatarName>
      </Avatar>
    </Container>
  }
}