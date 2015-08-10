/* @flow */
'use strict';

var React = require('react-native');

var {
  SliderIOS,
  View,
} = React;

var EXAMPLE_MOVIE = require('./example-movie');
var MovieScreen = require('./MovieScreen');

var EXAMPLES = [
  { title: 'Movie Cell' },
  {
    title: 'All States',
    component: require('./explorers/MovieCellExplorer'),
  },
  {
    title: 'Movie Screen',
  },
  {
    title: 'All Info Movie',
    render() {
      return <MovieScreen movie={EXAMPLE_MOVIE} />
    }
  },
  {
    title: 'No Info Movie',
    render() {
      var movie = { ratings: {} };
      return <MovieScreen movie={movie} />
    }
  },
  {
    title: 'Ratings Sliders',
    description: 'Adjust rating to test ratings color styles',
    component: class extends React.Component {
      constructor(props: Object) {
        super(props);
        this.state = { movie: { ...EXAMPLE_MOVIE, synopsis: null, abridged_cast: null } };
      }

      render() {
        return (
          <View>
            <MovieScreen movie={this.state.movie} />
            <SliderIOS
              style          = {{ margin: 20 }}
              minimumValue   = {0}
              maximumValue   = {100}
              value          = {this.state.movie.ratings.critics_score}
              onValueChange  = {(newValue) => {
                this.setState(React.addons.update(this.state, {
                  movie: { ratings: { critics_score: { $set: Math.round(newValue) } } }
                }));
              }}
            />
            <SliderIOS
              style          = {{ margin: 20 }}
              minimumValue   = {0}
              maximumValue   = {100}
              value          = {this.state.movie.ratings.audience_score}
              onValueChange  = {(newValue) => {
                this.setState(React.addons.update(this.state, {
                  movie: { ratings: { audience_score: { $set: Math.round(newValue) } } }
                }));
              }}
            />
          </View>
        )
      }
    }
  },
];

module.exports = EXAMPLES;
