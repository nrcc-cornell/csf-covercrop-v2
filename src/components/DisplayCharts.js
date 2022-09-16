import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import DisplayChart from './DisplayChart';
import DisplayBarChart from './DisplayBarChart';

class DisplayCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {
          idxChartElement: 0,
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.crop!==this.props.crop || prevProps.locInfo.id!==this.props.locInfo.id) {
          this.handleChange_idxChartElement(0)
        }
    }

    handleChange_idxChartElement = (v) => {
        this.setState({
          idxChartElement: v
        })
    }

    render() {

      return(

      <>
        <Grid item style={{width:'100%'}}>
          <DisplayChart
            locInfo={this.props.locInfo}
            chartWeatherData={this.props.chartWeatherData}
            crop={this.props.crop}
            dataIsLoading={this.props.dataIsLoading}
            idxChartElement={this.state.idxChartElement}
            onchange_idxChartElement={this.handleChange_idxChartElement}
          />
        </Grid>
        <Grid item style={{width:'100%'}}>
          <DisplayBarChart
            locInfo={this.props.locInfo}
            chartWeatherData={this.props.chartWeatherData}
            crop={this.props.crop}
            dataIsLoading={this.props.dataIsLoading}
            idxChartElement={this.state.idxChartElement}
          />
        </Grid>
      </>

      );
    };

}

DisplayCharts.propTypes = {
  locInfo: PropTypes.object.isRequired,
  chartWeatherData: PropTypes.object.isRequired,
  crop: PropTypes.string.isRequired,
  dataIsLoading: PropTypes.bool.isRequired,
};

export default DisplayCharts;
