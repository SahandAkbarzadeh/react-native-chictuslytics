import { NativeModules, View, Text, ActivityIndicator, Image, TouchableOpacity, TextInput,  KeyboardAvoidingView } from 'react-native';
import React, { Component } from "react";
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import Server, { REPORT_TYPES } from "./server";
import { captureScreen } from "react-native-view-shot";

/*

    THIS IS AN EXPERIMENTAL IMPL OF ChictusLytics!

 */

const { RNReactNativeChictuslytics } = NativeModules;

const STATES = {
  NORMAL: 0,
  CRASH: 1,
  REPORT: 2
};

// props: enableDevCrashReport, enableBugReportForRelease, server, configs

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: STATES.NORMAL,
      working: false,
      image: null,
      bugReportEnabled: __DEV__ || this.props.enableBugReportForRelease,
      text: ''
    };
    Server.setUrl(this.props.server);
    Server.setConfigs(this.props.configs);
    const handleExceptions = (err, isFatal) => {
      this.setState({ state: STATES.CRASH, working: true });
      Server.add("Crash Report " + this.props.titleExtraInformation(),this.getDeviceInfo() + "\n" + this.props.extraInformation(), REPORT_TYPES.CRASH, (data) => {
        if (data.reportId === "") {
          this.setState({ working: false })
        } else {
          Server.add_text_attachment(data.reportId, JSON.stringify(err), REPORT_TYPES.CRASH, () => {
            this.setState({ working: false })
          })
        }
      })
    };
    setJSExceptionHandler(handleExceptions, this.props.enableDevCrashReport);
  }

  getDeviceInfo() {
    return ""
  }

  sendReport() {
    let userTitle = this.props.titleExtraInformation()
    this.setState({ working: true })
    Server.add(this.state.text + ' ' + (userTitle === "" ? "" : "| " + userTitle), this.getDeviceInfo() + "\n" + this.props.extraInformation(), REPORT_TYPES.REPORT, data => {
      if (data.reportId === "") {
        this.setState({ working: false, text: '', image: null, state: STATES.NORMAL})
      } else {
        Server.add_attachment(data.reportId, this.state.image, REPORT_TYPES.REPORT, () => {
          this.setState({ working: false, text: '', image: null, state: STATES.NORMAL})
        })
      }
    })
  }

  capture() {
    captureScreen({
      format: "jpg",
      quality: 0.9
    })
      .then(
        uri => {
          this.setState({
            state: STATES.REPORT,
            image: uri
          })
        },
        error => {
          throw error
        }
      );

  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        {(this.state.state === STATES.NORMAL || this.state.state === STATES.REPORT) && (this.props.children)}
        {this.state.bugReportEnabled && this.state.state !== STATES.CRASH ? (
          <TouchableOpacity
            onPress={() => this.capture()}
            style={{
              backgroundColor: 'rgb(2,119,189)',
              width: 40,
              height: 40,
              opacity: 0.05,
              borderRadius: 20,
              position: 'absolute',
              left: 70,
              top: 10,
              zIndex: 1000
            }} />) : null
        }
        {this.state.state === STATES.CRASH && (
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center'
          }}>
            <Text style={{ textAlign: 'center' }}>
              {"مشکلی پیش آمده است!"}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {this.state.working ? 'در حال ارسال خطا به سرور برای رفع مشکل...' : 'از اتفاق پیش آمده متاسفیم لطفا نرم افزار را مجددا اجرا کنید.'}
            </Text>
            <View style={{ width: 10, height: 10 }} />
            {this.state.working &&
              <ActivityIndicator />
            }
          </View>
        )}
        {this.state.state === STATES.REPORT ? (
          <KeyboardAvoidingView behavior={"padding"} enabled style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgb(38,50,56)',
            zIndex: 10000,
            padding: 40
          }}>
            <Image
              style={{
                flex: 3,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: 'rgb(2,119,189)',
                marginBottom: 10,
              }}
              resizeMode={'contain'}
              source={{ uri: this.state.image }}
            />
            <Text style={{ textAlign: 'right', color: 'white', marginBottom: 5 }}>
              متن گزارش
              </Text>
            <TextInput
              keyboardAppearance={"dark"}
              keyboardType={"ascii-capable"}
              style={{ height: 100, width: '100%', textAlign: 'right', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 10, borderRadius: 5 }}
              placeholder=""
              onChangeText={(text) => this.setState({ text })}
              multiline={true}
            />
            <TouchableOpacity
              onPress={() => {
                if (!this.state.working) {
                    this.sendReport()
                }
              }}
              style={{
                backgroundColor: 'rgb(2,119,189)',
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }} >
              {this.state.working ? <ActivityIndicator color={'white'} /> : (<Text style={{ textAlign: 'center', color: 'white' }}>
                گزارش
              </Text>)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ state: STATES.NORMAL })}
              style={{
                borderColor: 'rgb(2,119,189)',
                borderWidth: 2,
                borderStyle: 'dashed',
                padding: 10,
                borderRadius: 5,
                marginBottom: 15
              }} >
              <Text style={{ textAlign: 'center', color: 'white' }}>
                انصراف
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        ) : null}
      </View>
    )
  }

}

ChictusLytics.defaultProps = {
  enableDevCrashReport: false,
  enableBugReportForRelease: false,
  extraInformation: () => {
    return ""
  },
  titleExtraInformation: () => {
    return ""
  },
};