import React, {Component} from "react";
import {connect} from "react-redux";
import checkForPrivilege, {isOwner} from "../utils/privilege";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer, chatCallMuteParticipants, chatCallUnMuteParticipants} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMic,
  MdMicOff,
  MdClose,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import List from "../../../pod-chat-ui-kit/src/List";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";

//styling
import style from "../../styles/app/MainCallBoxSceneGroupParticipantsDetails.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {ContactListItem, getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";
import {THREAD_ADMIN} from "../constants/privilege";

@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus
  }
})
export default class MainCallBoxSceneGroupParticipantsDetails extends Component {

  constructor(props) {
    super(props);
    this.onParticipantMuteClick = this.onParticipantMuteClick.bind(this);
    this.state = {}
  }

  onParticipantMuteClick(participant, e) {
    e.stopPropagation();
    const {chatCallStatus, user, dispatch} = this.props;
    if (participant.mute) {
      dispatch(chatCallUnMuteParticipants(chatCallStatus.call.callId, [participant.id]));
    } else {
      dispatch(chatCallMuteParticipants(chatCallStatus.call.callId, [participant.id]));
    }
  }

  render() {
    const {chatCallParticipantList, setDetailsShowing, chatCallBoxShowing, user} = this.props;
    const classNames = classnames({
      [style.MainCallBoxSceneGroupParticipantsDetails]: true
    });
    const {thread, contact} = chatCallBoxShowing;
    return <Container className={classNames} topLeft>
      <Container className={style.MainCallBoxSceneGroupParticipantsDetails__Head}>
        <Container className={style.MainCallBoxSceneGroupParticipantsDetails__HeadText}>
          <Text bold
                size="sm">{strings.peopleIsTalking(chatCallParticipantList.length)}
          </Text>
        </Container>
        <Container cursor="pointer">
          <MdClose onClick={() => setDetailsShowing(false)}
                   size={styleVar.iconSizeMd}
                   color={styleVar.colorAccentDark}/>
        </Container>
      </Container>
      <List>
        {chatCallParticipantList.map(participant =>
          <ContactListItem invert
                           contact={participant}
                           AvatarNameFragment={
                             ({contact}) => {
                               return contact.admin ?
                                 <Container className={style.ModalThreadInfoGroupSettingsAdminAdd__AdminDisable}
                                            onMouseDown={e => e.stopPropagation()}>
                                 </Container> : ""
                             }
                           }
                           LeftActionFragment={
                             ({contact}) => {
                               return <Container
                                 style={{margin: "3px 0", cursor: isOwner(thread, user) ? "pointer" : "none"}}
                                 onClick={this.onParticipantMuteClick.bind(this, contact)}>
                                 {contact.mute ?
                                   <MdMicOff size={styleVar.iconSizeMd}
                                             color={styleVar.colorGrayDark}
                                             style={{
                                               margin: "3px 4px",
                                               cursor: isOwner(thread, user) ? "pointer" : "none"
                                             }}/>
                                   :
                                   <MdMic size={styleVar.iconSizeMd}
                                          color={styleVar.colorAccentDark}
                                          style={{
                                            margin: "3px 4px",
                                            cursor: isOwner(thread, user) ? "pointer" : "none"
                                          }}/>}
                               </Container>
                             }
                           }
                           contacts={chatCallParticipantList}/>
        )}
      </List>
    </Container>;
  }
}


