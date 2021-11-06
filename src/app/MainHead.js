// src/list/Avatar.scss.js
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import classnames from "classnames";
import Cookies from "js-cookie";
import {isChannel} from "../utils/helpers";

//strings
import strings from "../constants/localization";
import {SHOW_CALL_BUTTONS_EVENT} from "../constants/callModes";
import {SHOW_CALL_BUTTON} from "../constants/cookieKeys";

//actions
import {threadSelectMessageShowing} from "../actions/threadActions";
import {threadModalThreadInfoShowing, threadCheckedMessageList} from "../actions/threadActions";
import {chatSupportModuleBadgeShowing} from "../actions/chatActions";

//UI components
import {ContextTrigger} from "../../../pod-chat-ui-kit/src/menu/Context";
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import Loading, {LoadingBlinkDots} from "../../../pod-chat-ui-kit/src/loading";
import {MdMoreVert, MdClose} from "react-icons/md";
import MainHeadThreadInfo from "./MainHeadThreadInfo";
import MainHeadBatchActions from "./MainHeadBatchActions";
import MainHeadCallButtons from "./MainHeadCallButtons";

//styling
import style from "../../styles/app/MainHead.scss";

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
    this.state = {
      showCallButtons: Cookies.get(SHOW_CALL_BUTTON)
    };
    window.addEventListener(SHOW_CALL_BUTTONS_EVENT, e => {
      this.setState({
        showCallButtons: true
      });
    })
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
    const {showCallButtons} = this.state;
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
                      <MdClose size={style.iconSizeMd} color={style.colorWhite}/>
                    </Container>

                  </Container>
                }

                {
                  !threadSelectMessageShowing &&
                  <Fragment>
                    {
                      showCallButtons && !isChannel(thread) && !supportMode &&
                      <MainHeadCallButtons participants={participants} thread={thread} user={user}
                                           smallVersion={smallVersion}/>
                    }
                    <Container className={style.MainHead__SearchContainer} inline>
                      <ContextTrigger id="thread-extra-context"
                                      mouseButton={0}
                                      holdToDisplay={-1}>

                        <MdMoreVert size={style.iconSizeMd} color={style.colorWhite}/>

                      </ContextTrigger>
                    </Container>
                    {supportMode &&
                    <Container className={style.MainHead__BackContainer} inline
                               onClick={this.closeSupportModule}>
                      <MdClose size={style.iconSizeMd} color={style.colorWhite}/>

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