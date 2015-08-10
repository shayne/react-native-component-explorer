/* @flow */
'use strict';

var React = require('react-native');

var {
  SliderIOS,
  View,
} = React;

var Explorer = require('react-native-component-explorer');

var MovieCell = require('../MovieCell');

var EXAMPLE_MOVIE = {
  title: "Fantastic Four",
  year: 2015,
  posters: {
    thumbnail: 'http://resizing.flixster.com/c508lXCTGuK495BkM-hwOKkvbAY=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/19/11/11191141_ori.jpg',
  },
  ratings: {
    critics_score: 8,
  }
};


var EXAMPLES = [
  {
    title: "Standard Movie",
    render() {
      return <MovieCell movie={EXAMPLE_MOVIE} />;
    }
  },
  {
    title: "Long Title",
    render() {
      var movie = {
        ...EXAMPLE_MOVIE,
        title: "Titled Night of the Day of the Dawn of the Son of the Bride of the Return of the Revenge of the Terror of the Attack of the Evil, Mutant, Alien, Flesh Eating, Hellbound, Zombified Living Dead Part 2",
      }
      return <MovieCell movie={movie} />;
    }
  },
  {
    title: "Critics Rating Slider",
    component: class extends React.Component {
      constructor(props: Object) {
        super(props)
        this.state = { movie: EXAMPLE_MOVIE,};
      }

      render() {
        return (
          <View>
            <MovieCell movie = {this.state.movie} />
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
          </View>
        );
      }
    },
  }
];

module.exports = Explorer.buildExamplesList(EXAMPLES);
