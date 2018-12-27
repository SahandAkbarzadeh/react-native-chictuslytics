
import { NativeModules, View } from 'react-native';
import React, { Component } from "react";


const { RNReactNativeChictuslytics } = NativeModules;

export default class ChictusLytics extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        {this.props.children}
      </View>
    )
  }

}
