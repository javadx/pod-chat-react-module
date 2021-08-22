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
import {ContextTrigger} from "../../../pod-chat-ui-kit/src/menu/Context";
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import Loading, {LoadingBlinkDots} from "../../../pod-chat-ui-kit/src/loading";
import {MdMoreVert, MdClose} from "react-icons/md";
import MainHeadThreadInfo from "./MainHeadThreadInfo";
import MainHeadBatchActions from "./MainHeadBatchActions";


//styling
import style from "../../styles/app/MainHead.scss";
import styleVar from "../../styles/variables.scss";
import {
  chatCallBoxShowing, chatSelectParticipantForCallShowing,
  chatStartCall,
  chatStartGroupCall,
  chatSupportModuleBadgeShowing
} from "../actions/chatActions";
import {isChannel, isGroup} from "../utils/helpers";
import {CHAT_CALL_BOX_COMPACTED, CHAT_CALL_BOX_NORMAL, CHAT_CALL_STATUS_STARTED} from "../constants/callModes";
import {getParticipant} from "./ModalThreadInfoPerson";
import MainHeadCallButtons from "./MainHeadCallButtons";
import MainHeadExtraMenu from "./MainExtraMenu";

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    supportMode: store.chatSupportMode,
    threadSelectMessageShowing: store.threadSelectMessageShowing,
    threadCheckedMessageList: store.threadCheckedMessageList,
    participants: store.threadParticipantList.participants,
    user: store.user.user
  };
})
class MainHead extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
    this.onSelectMessagesHide = this.onSelectMessagesHide.bind(this);
    this.closeSupportModule = this.closeSupportModule.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  closeSupportModule() {
    this.props.dispatch(chatSupportModuleBadgeShowing(true));
  }

  onSelectMessagesHide(e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
  }

  render() {
    const {thread, smallVersion, threadSelectMessageShowing, threadCheckedMessageList, supportMode, user, participants} = this.props;
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
                  <Fragment>
                    {
                      !isChannel(thread) && !supportMode &&
                      <MainHeadCallButtons participants={participants} thread={thread} user={user}
                                           smallVersion={smallVersion}/>
                    }
                    <Container className={style.MainHead__SearchContainer} inline>
                      <ContextTrigger id="thread-extra-context"
                                      mouseButton={0}
                                      holdToDisplay={-1}>

                        <MdMoreVert size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>

                      </ContextTrigger>
                    </Container>
                    {supportMode &&
                    <Container className={style.MainHead__BackContainer} inline
                               onClick={this.closeSupportModule}>
                      <MdClose size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>

                    </Container>
                    }
                  </Fragment>

                }
              </Container>
            </Fragment>
        }
      </Container>
    )
  }
}

export default withRouter(MainHead);