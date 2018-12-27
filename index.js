
import { NativeModules } from 'react-native';
import React, { Component } from "react";


const { RNReactNativeChictuslytics } = NativeModules;

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    )
  }

}
