
import { NativeModules, View, Text } from 'react-native';
import React, { Component } from "react";


const { RNReactNativeChictuslytics } = NativeModules;

const STATES = {
  NORMAL: 0,
  CRASH: 1,
  REPORT: 2
};

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: STATES.NORMAL
    }
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        {this.state.state === STATES.NORMAL && (this.props.children)}
        {this.state.state === STATES.CRASH && (
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}>
            <Text>
              مشکلی پیش آمده است!
            </Text>
          </View>
        )}
      </View>
    )
  }

}
