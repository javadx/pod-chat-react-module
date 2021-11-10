import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {isOwner} from "../utils/privilege";

//actions
import {
  chatCallAddParticipants,
  chatCallGetParticipantList,
  chatCallGroupSettingsShowing,
  chatCallMuteParticipants,
  chatCallRemoveParticipants,
  chatCallUnMuteParticipants,
  chatSelectParticipantForCallShowing
} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";

import Modal, {ModalBody} from "../../../pod-chat-ui-kit/src/modal";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMic,
  MdMicOff,
  MdClose,
  MdCallEnd,
  MdAdd
} from "react-icons/md";
import {Button} from "../../../pod-chat-ui-kit/src/button";
import List from "../../../pod-chat-ui-kit/src/list";

//styling
import style from "../../styles/app/CallBoxSceneGroupParticipantsControl.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {
  CHAT_CALL_BOX_NORMAL,
  CHAT_CALL_STATUS_INCOMING,
  CHAT_CALL_STATUS_OUTGOING,
  CHAT_CALL_STATUS_STARTED, MAX_GROUP_CALL_COUNT,
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
    this.onAddMember = this.onAddMember.bind(this);
    this._selectParticipantForCallFooterFragment = this._selectParticipantForCallFooterFragment.bind(this);
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

  hideControl() {
    const {dispatch} = this.props;
    dispatch(chatCallGroupSettingsShowing(false));
  }

  _selectParticipantForCallFooterFragment({selectedContacts, allContacts}) {
    const {dispatch, user, chatCallParticipantList, chatCallStatus} = this.props;
    const isMaximumCount = (selectedContacts && (selectedContacts.length + chatCallParticipantList.length) >= MAX_GROUP_CALL_COUNT);
    return <Container>
      <Container>
        {(selectedContacts && selectedContacts.length >= 1) &&
        <Button disabled={isMaximumCount} color={isMaximumCount ? "gray" : "accent"} onClick={e => {
          if (isMaximumCount) {
            return;
          }
          dispatch(chatSelectParticipantForCallShowing(false));
          const selectedParticipants = allContacts.filter(e => selectedContacts.indexOf(e.id) > -1);
          selectedParticipants.find(e => e.id === user.id) ? null : selectedParticipants.push(user);
          const usernames = selectedParticipants.map(e => {
            return e.username;
          });
          dispatch(chatCallAddParticipants(chatCallStatus.call.callId, usernames, selectedParticipants));
        }}>{strings.add}</Button>
        }
        <Button text onClick={() => dispatch(chatSelectParticipantForCallShowing(false))}>{strings.cancel}</Button>
      </Container>
      <Container>
        {
          isMaximumCount &&
          <Text color="accent">{strings.maximumNumberOfContactSelected}</Text>
        }
      </Container>
    </Container>
  }

  onAddMember() {
    const {chatCallBoxShowing, dispatch} = this.props;
    const {thread} = chatCallBoxShowing;
    return dispatch(chatSelectParticipantForCallShowing({
        thread,
        showing: true,
        selectiveMode: true,
        headingTitle: strings.addMember,
        FooterFragment: this._selectParticipantForCallFooterFragment
      },
    ));
  }

  render() {
    const {chatCallParticipantList, chatCallBoxShowing, user, chatCallStatus} = this.props;
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

            {(isCallOwner && chatCallParticipantList.length < MAX_GROUP_CALL_COUNT) &&
            <Container cursor="pointer">

              <MdAdd onClick={this.onAddMember}
                     size={styleVar.iconSizeMd}
                     color={styleVar.colorAccentDark}/>
              <Gap x={5}/>
            </Container>
            }

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


