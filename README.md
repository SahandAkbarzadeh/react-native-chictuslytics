
# react-native-react-native-chictuslytics

## Getting started

`$ npm install react-native-react-native-chictuslytics --save`

### Mostly automatic installation

`$ react-native link react-native-react-native-chictuslytics`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-react-native-chictuslytics` and add `RNReactNativeChictuslytics.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNReactNativeChictuslytics.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNReactNativeChictuslyticsPackage;` to the imports at the top of the file
  - Add `new RNReactNativeChictuslyticsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-react-native-chictuslytics'
  	project(':react-native-react-native-chictuslytics').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-react-native-chictuslytics/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-react-native-chictuslytics')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNReactNativeChictuslytics.sln` in `node_modules/react-native-react-native-chictuslytics/windows/RNReactNativeChictuslytics.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using React.Native.Chictuslytics.RNReactNativeChictuslytics;` to the usings at the top of the file
  - Add `new RNReactNativeChictuslyticsPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNReactNativeChictuslytics from 'react-native-react-native-chictuslytics';

// TODO: What to do with the module?
RNReactNativeChictuslytics;
```
  