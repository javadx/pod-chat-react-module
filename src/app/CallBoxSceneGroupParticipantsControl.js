import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import checkForPrivilege, {isOwner} from "../utils/privilege";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {
  chatAudioPlayer, chatCallGroupSettingsShowing, chatCallGroupSettingsShowingReducer,
  chatCallMuteParticipants,
  chatCallRemoveParticipants,
  chatCallUnMuteParticipants
} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";

import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../pod-chat-ui-kit/src/modal";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMic,
  MdMicOff,
  MdClose,
  MdCallEnd
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import List from "../../../pod-chat-ui-kit/src/List";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";

//styling
import style from "../../styles/app/CallBoxSceneGroupParticipantsControl.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {
  CHAT_CALL_STATUS_INCOMING,
  CHAT_CALL_STATUS_OUTGOING,
  CHAT_CALL_STATUS_STARTED,
  MOCK_CONTACT,
  MOCK_USER
} from "../constants/callModes";
import {ContactListItem, getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";
import {THREAD_ADMIN} from "../constants/privilege";
import Timer from "react-compound-timer";

@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus
  }
})
export default class CallBoxSceneGroupParticipantsControl extends Component {

  constructor(props) {
    super(props);
    this.onParticipantMuteClick = this.onParticipantMuteClick.bind(this);
    this.onParticipantRemoveClicked = this.onParticipantRemoveClicked.bind(this);
    this.hideControl = this.hideControl.bind(this);
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

  onParticipantRemoveClicked(participant) {
    const {chatCallStatus, dispatch} = this.props;
    dispatch(chatCallRemoveParticipants(chatCallStatus.call.callId, [participant.id]));
  }

  hideControl(){
    const {dispatch} = this.props;
    dispatch(chatCallGroupSettingsShowing(false));
  }

  render() {
    const {chatCallParticipantList, setDetailsShowing, chatCallBoxShowing, user, chatCallStatus} = this.props;
    const {call, status} = chatCallStatus;
    const classNames = classnames({
      [style.CallBoxSceneGroupParticipantsControl]: true
    });
    const {thread, contact} = chatCallBoxShowing;
    const isCallOwner = call && call.isOwner || isOwner(thread, user);
    const muteUnmutePermissionCondition = (isOwner(thread, user) || isCallOwner);
    return <Modal isOpen={true} wrapContent userSelect="none">

      <ModalBody>

    <Container className={classNames}>
      <Container className={style.CallBoxSceneGroupParticipantsControl__Head}>
        <Container className={style.CallBoxSceneGroupParticipantsControl__HeadText}>
          <Text bold
                size="sm">{strings.peopleIsTalking(chatCallParticipantList.length)}
          </Text>
        </Container>
        <Container cursor="pointer">
          <MdClose onClick={this.hideControl}
                   size={styleVar.iconSizeMd}
                   color={styleVar.colorAccentDark}/>
        </Container>
      </Container>
      <List style={{overflowY: "auto"}}>
        {chatCallParticipantList.map(participant =>
          <ContactListItem invert
                           contact={participant}
                           AvatarTextFragment={isCallOwner ? ({contact}) => {
                               return <Text size="xs" color={contact.joined ? "green" : "accent"} bold>
                                 {contact.joined ? strings.callStarted : strings.callingWithNoType}
                               </Text>
                             }
                             : null}
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
                               return <Container style={{display: "flex", flexDirection: "row-reverse"}}>
                                 {status === CHAT_CALL_STATUS_STARTED &&
                                 <Container
                                   style={{
                                     margin: "3px 0",
                                     cursor: muteUnmutePermissionCondition ? "pointer" : "default"
                                   }}
                                   onClick={muteUnmutePermissionCondition && this.onParticipantMuteClick.bind(this, contact)}>
                                   {contact.mute ?
                                     <MdMicOff size={styleVar.iconSizeSm}
                                               color={styleVar.colorGrayDark}
                                               style={{
                                                 margin: "3px 4px",
                                               }}/>
                                     :
                                     <MdMic size={styleVar.iconSizeSm}
                                            color={styleVar.colorAccentDark}
                                            style={{
                                              margin: "3px 4px",
                                            }}/>}
                                 </Container>
                                 }
                                 {isCallOwner &&
                                 <Container
                                   style={{margin: "3px 0", cursor: "pointer"}}
                                   color={styleVar.colorRedDark}
                                   onClick={this.onParticipantRemoveClicked.bind(this, contact)}>
                                   <MdCallEnd size={styleVar.iconSizeSm}
                                              color={styleVar.colorRed}
                                              style={{
                                                margin: "3px 4px"
                                              }}/>
                                 </Container>
                                 }
                               </Container>

                             }
                           }
                           contacts={chatCallParticipantList}/>
        )}
      </List>
    </Container>
      </ModalBody>
    </Modal>
        ;
  }
}


