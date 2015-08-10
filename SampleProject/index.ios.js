var COMPONENT_EXPLORER_MODE = false;
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';


var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} = React;

var SearchScreen = require('./SearchScreen');

var SampleProject = React.createClass({
  render: function() {
    if (COMPONENT_EXPLORER_MODE) {
      var Explorer = require('react-native-component-explorer');
      return (
        <Explorer
          title    = "Movies Explorer"
          examples = {require('./explorer-examples')}
        />
      );
    }
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Movies',
          component: SearchScreen,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('SampleProject', () => SampleProject);
