import {NativeModules, View, Text, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import React, {Component} from "react";
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import Server, {REPORT_TYPES} from "./server";
import {captureScreen} from "react-native-view-shot";

/*

    THIS IS AN EXPERIMENTAL IMPL OF ChictusLytics!

 */

const {RNReactNativeChictuslytics} = NativeModules;

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
      bugReportEnabled: false,
    };
    Server.setUrl(this.props.server);
    Server.setConfigs(this.props.configs);
    const handleExceptions = (err, isFatal) => {
      this.setState({state: STATES.CRASH, working: true});
      Server.add("Crash Report " + this.props.titleExtraInformation(), "\n" + this.props.extraInformation(), REPORT_TYPES.CRASH, (data) => {
        if (data.reportId === "") {
          this.setState({working: false})
        } else {
          Server.add_text_attachment(data.reportId, JSON.stringify(err), REPORT_TYPES.CRASH, () => {
            this.setState({working: false})
          })
        }
      })
    };
    setJSExceptionHandler(handleExceptions, this.props.enableBugReportForRelease);
    if (__DEV__ || this.props.enableReleaseShakeToReport) {
      this.setState({bugReportEnabled: true})
    }
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
      <View style={{width: '100%', height: '100%'}}>
        {(this.state.state === STATES.NORMAL || this.state.state === STATES.REPORT) && (this.props.children)}
        {this.state.bugReportEnabled &&
        <TouchableOpacity
          onPress={() => this.capture() }
          style={{
          backgroundColor: 'red',
          width:50,
          height:50,
          opacity: 0.3,
          position: 'absolute',
          left: 50,
          top: 5
        }}/>
        }
        {this.state.state === STATES.CRASH && (
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{textAlign: 'center'}}>
              {"مشکلی پیش آمده است!"}
            </Text>
            <Text>
              {this.state.working ? 'در حال ارسال خطا به سرور برای رفع مشکل...' : 'از اتفاق پیش آمده متاسفیم لطفا نرم افزار را مجددا باز کنید.'}
            </Text>
            <View style={{width: 10, height: 10}}/>
            {this.state.working &&
            <ActivityIndicator/>
            }
            {this.state.state === STATES.REPORT &&
            <View style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              padding: 40
            }}>
              <Image
                style={{flex: 1}}
                resizeMode={'contain'}
                source={{uri: this.state.image}}
              />

            </View>
            }
          </View>
        )}
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