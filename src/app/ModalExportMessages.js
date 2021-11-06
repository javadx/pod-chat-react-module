import React, {Component} from "react";
import {connect} from "react-redux";
import {RangeDatePicker} from "jalali-react-datepicker/dist/index";


//strings
import strings from "../constants/localization";

//actions

//UI components
import {withRouter} from "react-router-dom";
import {threadExportMessagesShowing} from "../actions/threadActions";
import Text from "../../../pod-chat-ui-kit/src/typography/Text";
import Heading from "../../../pod-chat-ui-kit/src/typography/Heading";
import Modal, {ModalBody, ModalHeader} from "../../../pod-chat-ui-kit/src/modal";
import {Button, ButtonFloating} from "../../../pod-chat-ui-kit/src/button";
import Container from "../../../pod-chat-ui-kit/src/container";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import {MdDateRange} from "react-icons/md";

//styling
import style from "../../styles/app/ModalExportMessages.scss";

@connect(store => {
  return {
    thread: store.thread.thread,
    threadExportMessagesShowing: store.threadExportMessagesShowing
  };
}, null, null, {forwardRef: true})
class ModalShare extends Component {

  constructor(props) {
    super(props);
    this.pickerRef = React.createRef();
    this.openPicker = this.openPicker.bind(this);
    this.rangeSelected = this.rangeSelected.bind(this);
    this.state = {
      rangeSelected: null
    }
  }

  componentDidMount() {

  }

  openPicker() {
    this.pickerRef.current.setState({isOpenModal: true})
  }

  rangeSelected(data) {
    this.setState({
      rangeSelected: data
    });
  }

  onClose() {
    this.setState({
      rangeSelected: null
    });
    this.props.dispatch(threadExportMessagesShowing(false));
  }

  onCancel() {
    this.setState({
      rangeSelected: null
    });
  }

  onExport() {
    this.setState({
      rangeSelected: null
    });
  }

  render() {
    const {threadExportMessagesShowing} = this.props;
    const {rangeSelected} = this.state;
    return <Modal isOpen={threadExportMessagesShowing}>

      <ModalHeader>
        <Heading h3>{strings.exportMessages}</Heading>
      </ModalHeader>

      <ModalBody>
        {rangeSelected ?
          <>
            <Container centerTextAlign>
              <Gap y={10}>
                <Text bold>{strings.rangeSelectedFromDateToDate(rangeSelected.start._d.toLocaleDateString('fa'), rangeSelected.end._d.toLocaleDateString('fa'))}</Text>
              </Gap>
            </Container>
            <Button text onClick={this.onExport.bind(this)}>{strings.export}</Button>
            <Button text onClick={this.onCancel.bind(this)}>{strings.cancel}</Button>
            <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
          </>
          :
          <>
            <Text style={{textAlign: "center"}}>{strings.forExportingPleaseEnterDates}</Text>
            <Gap y={5}/>
            <Container className={style.ModalExportMessages__DatePicker}>
              <Container className={style.ModalExportMessages__DatePickerIcon} onClick={this.openPicker}>
                <ButtonFloating className={style.ModalExportMessages__DatePickerIconButton}>
                  <MdDateRange size={style.iconSizeMd} style={{margin: "7px 5px"}}/>
                </ButtonFloating>
              </Container>
              <RangeDatePicker ref={this.pickerRef} onClickSubmitButton={this.rangeSelected}/>
            </Container>
            <Gap y={10}/>
            <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
          </>
        }


      </ModalBody>
    </Modal>
  }
}

export default withRouter(ModalShare);