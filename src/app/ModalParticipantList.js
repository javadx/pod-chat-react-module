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
import style from "../../styles/app/ModalParticipantList.scss";

function AvatarTextFragment({contact}) {
  return <Text size="xs" inline
               color={contact.blocked ? "red" : "accent"}>{strings.lastSeen(date.prettifySince(contact ? contact.notSeenDuration : ""))}</Text>;
}

export const statics = {
  count: 50,
  visualList: {
    CONTACT: "CONTACT",
    THREAD_PARTICIPANTS: "THREAD_PARTICIPANTS"
  }
};

@connect(store => {
  return {
    chatSelectParticipantForCallShowing: store.chatSelectParticipantForCallShowing,
  };
}, null, null, {forwardRef: true})
export default class ModalParticipantList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onInitRequest = this.onInitRequest.bind(this);
    this.setInitRequestFunc = this.setInitRequestFunc.bind(this);
    this.onSearchChangeRequest = this.onSearchChangeRequest.bind(this);
    this.onScrollBottomThresholdRequest = this.onScrollBottomThresholdRequest.bind(this);
    this.state = {
      query: null,
      threadSelectedParticipants: [],
      threadParticipants: [],
      maximumLimitSelection: false,
      visualList: statics.visualList.CONTACT
    };
    this.initRequestFunc = null;
  }

  setInitRequestFunc(func) {
    this.initRequestFunc = func;
  }

  _resetState() {
    this.setState({
      query: null,
      threadSelectedParticipants: [],
      threadParticipants: []
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {chatSelectParticipantForCallShowing: oldChatSelectParticipantForCallShowing} = prevProps;
    const {chatSelectParticipantForCallShowing} = this.props;
    const {showing: oldShowing} = oldChatSelectParticipantForCallShowing;
    const {showing} = chatSelectParticipantForCallShowing;
    const {visualList: oldVisualList} = prevState;
    const {visualList} = this.state;
    if (!showing) {
      if (oldShowing) {
        this._resetState();
      }
    }
    if (oldVisualList !== visualList) {
      this._resetState();
      this.initRequestFunc();
    }
  }

  _requestForParticipant(callBack, offset = 0, query = null) {
    const {dispatch, chatSelectParticipantForCallShowing} = this.props;
    const {visualList} = this.state;
    const {thread} = chatSelectParticipantForCallShowing;
    if (visualList === statics.visualList.CONTACT) {
      return dispatch(contactGetList(0, statics.count, query, false, true)).then(data => {
        const {contacts, hasNext, nextOffset} = data;
        callBack(contacts, nextOffset, hasNext);
      });
    }
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

  onDualModeTabSelect(name) {
    this.setState({
      visualList: name
    })
  }

  renderDualMode() {
    const {visualList} = this.state;
    const itemClassNames = name => classnames({
      [style.ModalParticipantList__DualModeTabItem]: true,
      [style["ModalParticipantList__DualModeTabItem--selected"]]: name === visualList,
    });
    return <Container className={style.ModalParticipantList__DualModeTab}>
      <Container className={itemClassNames(statics.visualList.CONTACT)}
                 onClick={this.onDualModeTabSelect.bind(this, statics.visualList.CONTACT)}><Text
        bold>{strings.contactList}</Text></Container>
      <Container className={itemClassNames(statics.visualList.THREAD_PARTICIPANTS)}
                 onClick={this.onDualModeTabSelect.bind(this, statics.visualList.THREAD_PARTICIPANTS)}><Text
        bold>{strings.threadParticipantList}</Text></Container>
    </Container>
  }

  render() {
    const {chatSelectParticipantForCallShowing} = this.props;
    const {showing, headingTitle, selectiveMode, FooterFragment, dualMode} = chatSelectParticipantForCallShowing;
    const {threadSelectedParticipants} = this.state;
    if (!showing) {
      return null;
    }
    return <ModalContactList isShow={showing}
                             setInitRequestFunc={this.setInitRequestFunc}
                             onInitRequest={this.onInitRequest}
                             outSideAvatarTextFragment={AvatarTextFragment}
                             onSearchChangeRequest={this.onSearchChangeRequest}
                             onScrollBottomThresholdRequest={this.onScrollBottomThresholdRequest}
                             headingTitle={headingTitle || strings.selectParticipants}
                             selectiveMode={selectiveMode}
                             activeList={threadSelectedParticipants}
                             FooterFragment={FooterFragment.bind(null, this.state.visualList)}
                             BodyFragment={dualMode && this.renderDualMode.bind(this)}
                             onClose={this.onClose}
                             onSelect={this.onSelect}
                             onDeselect={this.onDeselect}

    />

  }
}