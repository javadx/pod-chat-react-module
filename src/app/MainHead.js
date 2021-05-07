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
import {MdChevronLeft, MdSearch, MdCheck, MdClose, MdPhone} from "react-icons/md";
import MainHeadThreadInfo from "./MainHeadThreadInfo";
import MainHeadBatchActions from "./MainHeadBatchActions";

//styling
import style from "../../styles/app/MainHead.scss";
import styleVar from "../../styles/variables.scss";
import {chatCallBoxShowing, chatStartCall, chatSupportModuleBadgeShowing} from "../actions/chatActions";
import {isGroup} from "../utils/helpers";
import {CHAT_CALL_BOX_COMPACTED, CHAT_CALL_BOX_NORMAL, CHAT_CALL_STATUS_STARTED} from "../constants/callModes";
import {getParticipant} from "./ModalThreadInfoPerson";

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    supportMode: store.chatSupportMode,
    threadSelectMessageShowing: store.threadSelectMessageShowing,
    threadCheckedMessageList: store.threadCheckedMessageList,
    participants: store.threadParticipantList.participants,
    chatCallStatus: store.chatCallStatus,
    user: store.user.user
  };
})
class MainHead extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
    this.onThreadHide = this.onThreadHide.bind(this);
    this.onLeftAsideShow = this.onLeftAsideShow.bind(this);
    this.onSelectMessagesHide = this.onSelectMessagesHide.bind(this);
    this.onSelectMessagesShow = this.onSelectMessagesShow.bind(this);
    this.closeSupportModule = this.closeSupportModule.bind(this);
    this.onVoiceCallClick = this.onVoiceCallClick.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  onThreadHide(e) {
    e.stopPropagation();
    const {dispatch, chatRouterLess, history} = this.props;
    dispatch(threadInit());
    if (!chatRouterLess) {
      history.push("/");
    }
  }

  closeSupportModule() {
    this.props.dispatch(chatSupportModuleBadgeShowing(true));
  }

  onLeftAsideShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEARCH));
  }

  onSelectMessagesShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadSelectMessageShowing(true));
  }

  onSelectMessagesHide(e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
  }

  onVoiceCallClick() {
    const {participants, thread, user, dispatch} = this.props;
    const contact = thread.onTheFly ? thread.participant : getParticipant(participants, user);
    dispatch(chatCallBoxShowing(CHAT_CALL_BOX_NORMAL, thread, contact));
    if (thread.onTheFly) {
      const id = contact.isMyContact ? contact.contactId : contact.id;
      const type = contact.isMyContact ? "TO_BE_USER_CONTACT_ID" : "TO_BE_USER_ID";
      return dispatch(chatStartCall(null, "voice", {
        invitees: [{
          "id": id,
          "idType": type
        }
        ]
      }));
    }
    dispatch(chatStartCall(thread.id, "voice"));
  }

  render() {
    const {thread, smallVersion, threadSelectMessageShowing, threadCheckedMessageList, supportMode, chatCallStatus} = this.props;
    const showLoading = !thread.id;
    const classNames = classnames({
      [style.MainHead]: true,
      [style["MainHead--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} onClick={this.onShowInfoClick} relative>
        {
          showLoading ?
            <Container>
              <Gap y={15}>
                <Text color="gray" light inline>{strings.waitingForGettingContactInfo}</Text>
                <Loading inline><LoadingBlinkDots size="sm" invert/></Loading>
              </Gap>
            </Container>
            :
            <Fragment>
              {
                threadSelectMessageShowing ?
                  <MainHeadBatchActions thread={thread} threadCheckedMessageList={threadCheckedMessageList}
                                        smallVersion={smallVersion}/>
                  :
                  <MainHeadThreadInfo smallVersion={smallVersion} thread={thread}/>
              }
              <Container centerLeft>
                {
                  threadSelectMessageShowing &&
                  <Container>
                    <Container inline>
                      <Text color="gray" light>{strings.messagesCount(threadCheckedMessageList.length)}</Text>
                    </Container>
                    <Container className={style.MainHead__SearchContainer} inline onClick={this.onSelectMessagesHide}>
                      <MdClose size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                    </Container>

                  </Container>
                }

                {
                  !threadSelectMessageShowing &&
                  <Container>
                    {
                      !isGroup(thread) && !supportMode &&
                      <Container className={style.MainHead__VoiceCallContainer} inline
                                 onClick={chatCallStatus.status ? e => {} : this.onVoiceCallClick}>
                        <MdPhone size={styleVar.iconSizeMd}
                                 color={chatCallStatus.status ? "rgb(255 255 255 / 30%)" : styleVar.colorWhite}/>
                      </Container>
                    }
                    {
                      thread.lastMessageVO && !supportMode &&
                      <Container className={style.MainHead__SearchContainer} inline onClick={this.onSelectMessagesShow}>
                        <MdCheck size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                      </Container>
                    }
                    <Container className={style.MainHead__SearchContainer} inline onClick={this.onLeftAsideShow}>
                      <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                    </Container>
                    <Container className={style.MainHead__BackContainer} inline
                               onClick={supportMode ? this.closeSupportModule : this.onThreadHide}>
                      {supportMode ?
                        <MdClose size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                        :
                        <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
                      }

                    </Container>
                  </Container>
                }
              </Container>
            </Fragment>
        }
      </Container>
    )
  }
}

export default withRouter(MainHead);