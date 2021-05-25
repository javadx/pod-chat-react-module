import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import {Virtuoso} from 'react-virtuoso'
import date from "../utils/date";

//strings
import strings from "../constants/localization";

//actions
import {
  contactAdding,
  contactGetList, contactModalCreateGroupShowing,
} from "../actions/contactActions";
import {threadParticipantList} from "../actions/threadActions";
import {chatSelectParticipantForCallShowing} from "../actions/chatActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../pod-chat-ui-kit/src/modal";
import {Button} from "../../../pod-chat-ui-kit/src/button";
import {Heading, Text} from "../../../pod-chat-ui-kit/src/typography";
import Container from "../../../pod-chat-ui-kit/src/container";
import Loading, {LoadingBlinkDots} from "../../../pod-chat-ui-kit/src/loading";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import {InputText} from "../../../pod-chat-ui-kit/src/input";
import {MdSearch, MdClose} from "react-icons/md";
import ModalContactList from "./ModalContactList";

//styling
import style from "../../styles/app/ModalContactList.scss";
import styleVar from "../../styles/variables.scss";
import {ContactList, ContactListSelective} from "./_component/contactList";
import {ROUTE_ADD_CONTACT} from "../constants/routes";
import {avatarUrlGenerator} from "../utils/helpers";
import {statics as modalContactListStatics} from "./ModalContactList";



function AvatarTextFragment({contact}) {
  return <Text size="xs" inline
               color={contact.blocked ? "red" : "accent"}>{strings.lastSeen(date.prettifySince(contact ? contact.notSeenDuration : ""))}</Text>;
}

export const statics = {
  count: 50
};

@connect(store => {
  return {
    chatSelectParticipantForCallShowing: store.chatSelectParticipantForCallShowing,
  };
}, null, null, {forwardRef: true})
export default class ModalParticipantList extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onInitRequest = this.onInitRequest.bind(this);
    this.onSearchChangeRequest = this.onSearchChangeRequest.bind(this);
    this.onScrollBottomThresholdRequest = this.onScrollBottomThresholdRequest.bind(this);
    this.state = {
      query: null,
      threadSelectedParticipants: [],
      threadParticipants: []
    };
  }

  _requestForParticipant(callBack, offset = 0, query = null) {
    const {dispatch, chatSelectParticipantForCallShowing} = this.props;
    const {thread} = chatSelectParticipantForCallShowing;
    dispatch(threadParticipantList(thread.id, 0, statics.count, query, true)).then(data => {
      const {participants, hasNext, nextOffset} = data;
      callBack(participants, nextOffset, hasNext);
    });
  }

  onInitRequest(callBack) {
    this._requestForParticipant(callBack);
  }

  onClose() {
    const {dispatch, onClose} = this.props;
    this.setState({
      query: null,
      threadSelectedParticipants: [],
      threadParticipants: []
    });
    if (onClose) {
      onClose();
    }
    dispatch(chatSelectParticipantForCallShowing(false));
  }

  onSelect(id) {
    const {threadSelectedParticipants} = this.state;
    let contactsClone = [...threadSelectedParticipants];
    contactsClone.push(id);
    this.setState({
      threadSelectedParticipants: contactsClone
    });
  }

  onDeselect(id) {
    const {threadSelectedParticipants} = this.state;
    let contactsClone = [...threadSelectedParticipants];
    contactsClone.splice(contactsClone.indexOf(id), 1);
    this.setState({
      threadSelectedParticipants: contactsClone
    });
  }

  onSearchChangeRequest(query, callBack) {
    this._requestForParticipant(callBack, 0, query);
  }

  onScrollBottomThresholdRequest(nextOffset, query, callBack) {
    this._requestForParticipant(callBack, nextOffset, query);
  }

  render() {
    const {chatSelectParticipantForCallShowing} = this.props;
    const {showing, headingTitle, selectiveMode, FooterFragment} = chatSelectParticipantForCallShowing;
    const {threadSelectedParticipants} = this.state;
    if (!showing) {
      return null;
    }
    return <ModalContactList isShow={showing}
                             onInitRequest={this.onInitRequest}
                             outSideAvatarTextFragment={AvatarTextFragment}
                             onSearchChangeRequest={this.onSearchChangeRequest}
                             onScrollBottomThresholdRequest={this.onScrollBottomThresholdRequest}
                             headingTitle={headingTitle || strings.selectParticipants}
                             selectiveMode={selectiveMode}
                             activeList={threadSelectedParticipants}
                             FooterFragment={FooterFragment}
                             onClose={this.onClose}
                             onSelect={this.onSelect}
                             onDeselect={this.onDeselect}

    />

  }
}