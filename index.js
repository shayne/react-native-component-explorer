/* @flow */
'use strict';

var React = require('react-native');

var {
  AsyncStorage,
  ListView,
  Navigator,
  PixelRatio,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var ReactART = require('ReactNativeART');

var {
  Group,
  Shape,
  Surface,
} = ReactART;


var NavigationButtons = require('react-native-navigation-buttons');
var {
  LeftNavigationButton,
} = NavigationButtons;

var EXPLORER_AS_KEY_ROUTE = "ExplorerSavedRoute";


class Explorer extends React.Component {
  _navigator: Navigator;

  constructor(props: any) {
    super(props)
  }

  componentWillMount() {
    StatusBarIOS.setStyle('default');

    AsyncStorage.getItem(EXPLORER_AS_KEY_ROUTE)
    .then((value) => { return new Promise((resolve, reject) => {
      this.props.examples.some((example) => {
        if (example.title + example.description == value) {
          resolve([{title: this.props.title}, example]);
          return true;
        }})
        resolve([{title: this.props.title}])})})
      .then((routes) => {
        this._navigator.immediatelyResetRouteStack(routes);
      })
      .done();
  }

  shouldComponentUpdate(nextProps: any, nextState: any): bool {
    // keep react from double rendering
    return false;
  }

  render() {
    return (
      <Navigator
        style         = {{ paddingTop: 44}}
        ref           = {(navigator) => { this._navigator = navigator }}
        initialRoute  = {{ title: "loading" }}
        renderScene   = {this._renderScene.bind(this)}
        navigationBar = {
          <Navigator.NavigationBar
            style={{  backgroundColor: '#f7f7f8', borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#acacac' }}
            routeMapper={{
              Title: (route) => {
                if (route.title === "loading") return null
                return (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{route.title}</Text>
                  </View>
                )
              },
              LeftButton: (route, navigator, c, state) => {
                if (c === 0) return null;
                var lastTitle = state.routeStack[c - 1];
                // TODO: pass in Navigator for pop, get previous title
                return <LeftNavigationButton title={lastTitle} onPress={() => navigator.pop()} />;
              },
              RightButton: () => null
            }}
          />}
      />
    );
  }

  _renderScene(route: any, navigator: Navigator) {

    if (route.render) {
      return route.render();
    } else if (route.component) {
      return <route.component />
    } else if (route.title === "loading") {
      return <View />
    } else {
      if (navigator.getCurrentRoutes().length == 1) {
        AsyncStorage.removeItem(EXPLORER_AS_KEY_ROUTE);
      }

      return (
        <ExplorerList
          examples  = {this.props.examples}
          onForward = {(route) => {
            AsyncStorage.setItem(EXPLORER_AS_KEY_ROUTE,
                                 route.title + route.description);
            navigator.push(route);
          }}
        />
      )
    }
  }
}

class ExplorerList extends React.Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged          : (r1, r2) => r1 !== r2,
                                     sectionHeaderHasChanged : (s1, s2) => s1 !== s2});
    this.state = {
      dataSource : ds.cloneWithRows(this.props.examples),
    };
  }

  render() {
    return (
      <ListView
        style               = {{ backgroundColor: '#eeeef4'}}
        dataSource          = {this.state.dataSource}
        renderRow           = {this._renderRow.bind(this)}
        renderSeparator     = {this._renderSeparator.bind(this)}
      />
    );
  }

  _renderRow(rowData: any) {
    if (rowData.render || rowData.component) {
      return (
        <TouchableHighlight onPress={this.props.onForward.bind(this, rowData)}>
          <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
            <View style={{ flex: 1, paddingLeft: 20, padding: 12}}>
              <Text style={{ fontSize: 16 }}>{rowData.title}</Text>
              {rowData.description ?
                <Text style={{ paddingTop: 5, color: '#8e8e8e' }}>{rowData.description}</Text> : null}
              </View>
              {this._renderRightArrow()}
            </View>
          </TouchableHighlight>
      );
    } else {
      return renderGroupHeader(rowData.title);
    }
  }

  _renderSeparator(sectionID, rowID) {
    var {examples} = this.props;
    var i = parseInt(rowID);
    var marginLeft = examples[i].render && examples.length - 1 > i && examples[i + 1].render && 20 || 0;
    return renderSeparator({marginLeft})
  }

  _renderRightArrow() {
    var pr = PixelRatio.get() + 1; // +1 because of PaintCode?
    return (
      <View style={{ alignSelf: 'center', paddingRight: 15}}>
        <Surface width={24 / pr} height={39 / pr}>
          <Shape
            scale       = {1 / pr}
            fill        = '#c6c6cb'
            stroke      = '#c6c6cb'
            strokeWidth = {0.5}
            d           = 'M 4,0.5 L 23.5,19.5 4,38.5 1,35.5 17,19.5 1,3.5 4,0.5 Z M 4,0.5' />
        </Surface>
      </View>
    )
  }
}

Explorer.defaultProps = { title: "Component Explorer" };


class ExamplesList extends React.Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged          : (r1, r2) => r1 !== r2,
                                     sectionHeaderHasChanged : (s1, s2) => s1 !== s2});
    this.state = {
      dataSource : ds.cloneWithRows(this.props.examples),
    };
  }

  render() {
    return (
      <ListView
        style               = {{ backgroundColor: '#eeeef4'}}
        dataSource          = {this.state.dataSource}
        renderRow           = {this._renderRow.bind(this)}
        renderSeparator     = {renderSeparator}
      />
    )
  }

  _renderRow(example) {
    var content = example && example.render ? example.render() :
      example && example.component ? <example.component /> : null;

    content || console.error("Must provide a render method or component property");

    return (
      <View>
        {renderGroupHeader(example.title)}
        {renderSeparator()}
        <View style={{ backgroundColor: 'white' }}>
          {content}
        </View>
      </View>
    )
  }
}


Explorer.buildExamplesList = (es) => {
  return (
    class extends ExamplesList {
      constructor(props) {
        props.examples = es;
        super(props)
      }
    }
  )
};


function renderGroupHeader(title) {
  return (
    <View style={{ flex: 1, height: 64, justifyContent: 'flex-end', paddingLeft: 20, paddingBottom: 2}}>
      <Text style={{ color: '#6d6d71'}}>{title.toUpperCase()}</Text>
    </View>
  );
}

function renderSeparator(style) {
  return (
    <View style={{ flex: 1, height: 1 / PixelRatio.get(), backgroundColor: '#fff' }}>
      <View style={[style, { flex: 1, backgroundColor: '#c6c6cb', }]} />
    </View>
  )
}

module.exports = Explorer;
