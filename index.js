import {NativeModules, View, Text, ActivityIndicator} from 'react-native';
import React, {Component} from "react";
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';


const {RNReactNativeChictuslytics} = NativeModules;

const STATES = {
  NORMAL: 0,
  CRASH: 1,
  REPORT: 2
};

// props: enableCrashReport, enableShakeToReport

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: STATES.NORMAL
    };
    const handleExceptions = (err, isFatal) => {
      this.setState({state: STATES.CRASH})
    };
    setJSExceptionHandler(handleExceptions, this.props.enableCrashReport);
    setNativeExceptionHandler(handleExceptions(, this.props.enableCrashReport));
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        {this.state.state === STATES.NORMAL && (this.props.children)}
        {this.state.state === STATES.CRASH && (
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              مشکلی پیش آمده است!
              نرم افزار تا چند ثانیه دیگر دوباره اجرا خواهد شد...
            </Text>
            <View style={{width: 10, height: 10}}/>
            <ActivityIndicator/>
          </View>
        )}
      </View>
    )
  }

}
