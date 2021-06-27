// src/list/Avatar.scss.js
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import classnames from "classnames";

//strings
import strings from "../constants/localization";
import {THREAD_LEFT_ASIDE_SEARCH} from "../constants/actionTypes";

//actions
import {
  threadLeftAsideShowing,
  threadSelectMessageShowing,
  threadInit
} from "../actions/threadActions";
import {threadModalThreadInfoShowing, threadCheckedMessageList} from "../actions/threadActions";

//UI components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import Loading, {LoadingBlinkDots} from "../../../pod-chat-ui-kit/src/loading";
import {Button} from "../../../pod-chat-ui-kit/src/button";
import {MdVideocam, MdPhone} from "react-icons/md";
import MainHeadThreadInfo from "./MainHeadThreadInfo";
import MainHeadBatchActions from "./MainHeadBatchActions";


//styling
import style from "../../styles/app/MainHeadCallButtons.scss";
import styleVar from "../../styles/variables.scss";
import {
  chatCallBoxShowing, chatCallGetParticipantList, chatSelectParticipantForCallShowing,
  chatStartCall,
  chatStartGroupCall,
  chatSupportModuleBadgeShowing
} from "../actions/chatActions";
import {isChannel, isGroup} from "../utils/helpers";
import {
  CHAT_CALL_BOX_COMPACTED,
  CHAT_CALL_BOX_NORMAL,
  CHAT_CALL_STATUS_STARTED,
  MAX_GROUP_CALL_COUNT
} from "../constants/callModes";
import {getParticipant} from "./ModalThreadInfoPerson";

function createInvitees(participants) {
  return participants.map(participantId => {
    return {
      "id": participantId,
      "idType": "TO_BE_USER_ID"
    }
  });
}

@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus,

    participants: store.threadParticipantList.participants,
  };
})
export default class MainHeadCallButtons extends Component {

  constructor(props) {
    super(props);
    this.onVoiceCallClick = this.onVoiceCallClick.bind(this);
    this.onVideoCallClick = this.onVideoCallClick.bind(this);
    this._selectParticipantForCallFooterFragment = this._selectParticipantForCallFooterFragment.bind(this);
  }

  _selectParticipantForCallFooterFragment({selectedContacts, allContacts}) {
    const {thread, dispatch, user} = this.props;
    const isMaximumCount = (selectedContacts && selectedContacts.length > MAX_GROUP_CALL_COUNT - 1);
    return <Container>
      <Container>
        {(selectedContacts && selectedContacts.length >= 1) &&
        <Button disabled={isMaximumCount} color={isMaximumCount ? "gray" : "accent"} onClick={e => {
          if (isMaximumCount) {
            return;
          }
          dispatch(chatCallBoxShowing(CHAT_CALL_BOX_NORMAL, thread));
          dispatch(chatSelectParticipantForCallShowing(false));
          const selectedParticipants = allContacts.filter(e => selectedContacts.indexOf(e.id) > -1);
          selectedParticipants.find(e => e.id === user.id) ? null : selectedParticipants.push(user);
          dispatch(chatCallGetParticipantList(null, selectedParticipants));
          const invitess = selectedParticipants.map(e => {
            return {id: e.username, type: "TO_BE_USER_USERNAME"}
          });
          dispatch(chatStartGroupCall(null, invitess, "voice"));
        }}>{strings.call}</Button>
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

  _groupCall() {
    const {participants, thread, user, dispatch} = this.props;
    if (thread.participantCount > MAX_GROUP_CALL_COUNT) {
      return dispatch(chatSelectParticipantForCallShowing({
          showing: true,
          selectiveMode: true,
          headingTitle: strings.forCallPleaseSelectContacts,
          thread,
          FooterFragment: this._selectParticipantForCallFooterFragment
        },
      ));
    }

    dispatch(chatCallBoxShowing(CHAT_CALL_BOX_NORMAL, thread));
    dispatch(chatCallGetParticipantList(null, participants));
    dispatch(chatStartGroupCall(thread.id, null, "voice"));
  }

  _p2pCall(callType) {
    const {participants, thread, user, dispatch} = this.props;
    const contact = thread.onTheFly ? thread.participant : getParticipant(participants, user);
    dispatch(chatCallBoxShowing(CHAT_CALL_BOX_NORMAL, thread, contact));
    if (thread.onTheFly) {
      const id = contact.isMyContact ? contact.contactId : contact.id;
      const type = contact.isMyContact ? "TO_BE_USER_CONTACT_ID" : "TO_BE_USER_ID";
      return dispatch(chatStartCall(null, callType, {
        invitees: [{
          "id": id,
          "idType": type
        }
        ]
      }));
    }
    dispatch(chatCallGetParticipantList(null, [contact, user]));
    dispatch(chatStartCall(thread.id, callType));
  }

  onVoiceCallClick() {
    const {thread} = this.props;
    if (isGroup(thread)) {
      return this._groupCall();
    }
    this._p2pCall("voice");
  }

  onVideoCallClick() {
    this._p2pCall("video");
  }

  render() {
    const {smallVersion, chatCallStatus, thread} = this.props;
    const classNames = classnames({
      [style.MainHeadCallButtons__Button]: true,
      [style["MainHeadCallButtons__Button--smallVersion"]]: smallVersion
    });
    return (
      <Container inline>
        <Container className={classNames} onClick={chatCallStatus.status ? e => {
        } : this.onVoiceCallClick}>
          <MdPhone size={styleVar.iconSizeMd}
                   color={chatCallStatus.status ? "rgb(255 255 255 / 30%)" : styleVar.colorWhite}/>
        </Container>
        {!isGroup(thread) &&
        <Container className={classNames} onClick={chatCallStatus.status ? e => {
        } : this.onVideoCallClick}>
          <MdVideocam size={styleVar.iconSizeMd}
                      color={chatCallStatus.status ? "rgb(255 255 255 / 30%)" : styleVar.colorWhite}/>
        </Container>
        }

      </Container>
    )
  }
}