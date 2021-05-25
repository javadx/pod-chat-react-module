import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import queryString from "query-string";
import Cookies from "js-cookie";

//strings
import strings from "../constants/localization";
import {MESSAGE_SHARE} from "../constants/cookie-keys";

//actions
import {chatModalPrompt} from "../actions/chatActions";

//UI components
import {ROUTE_ADD_CONTACT, ROUTE_INDEX, ROUTE_JOIN_GROUP, ROUTE_SHARE} from "../constants/routes";
import {withRouter} from "react-router-dom";
import {
  threadCreateWithExistThread,
  threadJoinPublicGroup,
  threadModalListShowing,
  threadNew
} from "../actions/threadActions";
import Text from "../../../pod-chat-ui-kit/src/typography/Text";
import Container from "../../../pod-chat-ui-kit/src/container";
import Paper from "../../../pod-chat-ui-kit/src/paper";
import Gap from "../../../pod-chat-ui-kit/src/gap";

//styling

@connect(store => {
  return {
    chatInstance: store.chatInstance.chatSDK,
  };
}, null, null, {forwardRef: true})
class ModalJoin extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {match, history, dispatch} = this.props;
    const threadName = match.params.threadName;
    if (threadName) {
      const extraMessage = message => (
        <Fragment>
          <Gap y={5} block/>
          <Paper colorBackground style={{borderRadius: "5px"}}>
            <Text size="xs">{message}</Text>
          </Paper>
        </Fragment>
      );
      dispatch(chatModalPrompt(true, `${strings.areYouSureAboutJoiningThisThread}؟`, () => {
        history.push(ROUTE_INDEX);
        dispatch(threadJoinPublicGroup(threadName)).then(e => {
          if (e.hasError) {
            dispatch(chatModalPrompt());
            dispatch(chatModalPrompt(true, `${strings.hasFollowingErrorWhileJoining}`, null, e => {
              dispatch(chatModalPrompt());
            }, null, null, extraMessage(e.errorMessage), true));
            return;
          }
          const {chatInstance} = this.props;
          chatInstance.getThreadInfo({threadIds: [e.result.id]}).then(thread => {
            dispatch(threadCreateWithExistThread(thread));
            dispatch(threadNew(thread))
          });
        });
        dispatch(chatModalPrompt());
      }, e => {
        history.push(ROUTE_INDEX);
      }, strings.yes, null, extraMessage(threadName)));
    }
  }

  onClose() {
    this.setState({
      showing: false
    });
  }

  render() {
    return null
  }
}

export default withRouter(ModalJoin);