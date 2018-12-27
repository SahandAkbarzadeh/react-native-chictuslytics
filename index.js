import {NativeModules, View, Text, ActivityIndicator} from 'react-native';
import React, {Component} from "react";
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import Server, {REPORT_TYPES} from "./server";
import RNExitApp from 'react-native-exit-app';

/*

    THIS IS AN EXPERIMENTAL IMPL OF ChictusLytics!

 */

const {RNReactNativeChictuslytics} = NativeModules;

const STATES = {
  NORMAL: 0,
  CRASH: 1,
  REPORT: 2
};

// props: enableDevCrashReport, enableReleaseShakeToReport, server, configs

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: STATES.NORMAL
    };
    Server.setUrl(this.props.server);
    Server.setConfigs(this.props.configs);
    const handleExceptions = (err, isFatal) => {
      this.setState({state: STATES.CRASH});
      Server.add("Crash Report " + this.props.titleExtraInformation(), "\n" + this.props.extraInformation(), REPORT_TYPES.CRASH, (data)=> {
        if (data.reportId === "") {
          RNExitApp.exitApp();
        } else {
          Server.add_text_attachment(data.reportId, err, REPORT_TYPES.CRASH, () => {
            RNExitApp.exitApp();
          })
        }
      })
    };
    setJSExceptionHandler(handleExceptions, this.props.enableDevCrashReport);
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        {this.state.state === STATES.NORMAL && (this.props.children)}
        {this.state.state === STATES.CRASH && (
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              {"مشکلی پیش آمده است!\n نرم افزار تا چند ثانیه دیگر بسته خواهد شد..."}
            </Text>
            <View style={{width: 10, height: 10}}/>
            <ActivityIndicator/>
          </View>
        )}
      </View>
    )
  }

}

ChictusLytics.defaultProps = {
  enableDevCrashReport: false,
  enableReleaseShakeToReport: false,
  extraInformation: () => { return ""},
  titleExtraInformation: () => { return ""},
};