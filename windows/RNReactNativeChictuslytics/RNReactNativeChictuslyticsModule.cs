using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace React.Native.Chictuslytics.RNReactNativeChictuslytics
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNReactNativeChictuslyticsModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNReactNativeChictuslyticsModule"/>.
        /// </summary>
        internal RNReactNativeChictuslyticsModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNReactNativeChictuslytics";
            }
        }
    }
}
