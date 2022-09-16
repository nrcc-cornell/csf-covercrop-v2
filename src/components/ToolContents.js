///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import ls from 'local-storage';

// Components
import LocationPicker from './LocationPicker/LocationPicker'
import LoadPointData from './LoadPointData';
import DisplayCharts from './DisplayCharts';
import UserInput from './UI/UserInput';
import VarPopover from './VarPopover';
import {HelpMain} from "./HelpToolContent";
import HelpToolPopover from "./HelpToolPopover";

import { processWeatherData } from './processWeatherData';

class ToolContents extends Component {

    constructor(props) {
        super(props);
        this.toolName = 'CSF-COVERCROP';
        this.token = 'YOUR_TOKEN';
        this.crop_list = ['buckwheat','mustard','rye']
        this.defaultLocation = {
          "address":"Cornell University, Ithaca, NY",
          "lat":42.45,
          "lng":-76.48,
          "id":"default",
        }
        this.defaultLocations = {
          'default':this.defaultLocation
        }
        this.state = {
          locations: ls(this.toolName+'.locations') || this.defaultLocations,
          selected: ls(this.toolName+'.selected') || this.defaultLocation['id'],
          pointData: null,
          crop: 'rye',
          dataIsLoading: false,
        }
    }

    componentDidMount() {
        // Find all data for a given location
        if ((this.state.locations && this.state.selected)) {
          this.loadAllData()
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevState.selected!==this.state.selected) {
          this.loadAllData()
        }
        if (prevState.locations!==this.state.locations) { ls.set(this.toolName+'.locations',this.state.locations) }
        if (prevState.selected!==this.state.selected) { ls.set(this.toolName+'.selected',this.state.selected) }
    }

    loadAllData = () => {
          this.handleDataIsLoadingChange(true)
          setTimeout(() => {

            LoadPointData({param:this.getAcisParamsObs()})
              .then(response_obs => {

                //handle observed data
                let data_obs = response_obs['data']
                data_obs = data_obs.filter(item => item[1] !== -999 && item[2] !== -999)

                let result = {'data':data_obs}
                this.handleDataChange(result)
                this.handleDataIsLoadingChange(false)

              })
            },
            1000
          );
    }

    getAcisParamsObs = () => {
          return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "loc":[this.state.locations[this.state.selected]['lng'],this.state.locations[this.state.selected]['lat']].join(),
              "sdate":"1980-01-01",
              "edate":moment().subtract(1.0,"years").format("YYYY")+"-12-31",
              "grid":"nrcc-model",
              "elems":[
                {
                 "name":"maxt",
                 "interval":[0,0,1]
                },
                {
                 "name":"mint",
                 "interval":[0,0,1]
                }
              ]})
          };
    }

    handleSelectedLocationChange = (v) => {
        this.setState({
          selected: v
        })
    }

    handleLocationInfoChange = (e) => {
        let k = e.target.name
        let v = e.target.value
        this.setState(prevState => ({
          ...prevState,
          locations : {
              ...prevState.locations, ...{[prevState.selected] : {...prevState.locations[prevState.selected], [k]: v} }
          }
        }) )
    }

    handleLocationPickerOutput = (s,l) => {
        // include additional items for each location (items other than lat,lng,id)
        let l_new = {}
        for (let k in l) {
          if (l.hasOwnProperty(k)) {
            if (this.state.locations.hasOwnProperty(k)) {
              l_new[k] = { ...this.defaultLocation, ...l[k], ...this.state.locations[k] }
            } else {
              l_new[k] = { ...this.defaultLocation, ...l[k] }
            }
          }
        }
        this.setState({
          locations: l_new,
          selected: s
        })
    }

    handleDataChange = (d) => {
        this.setState({
          pointData: d
        })
    }

    handleCropChange = (e) => {
        this.setState({
          crop: e.target.value
        })
    }

    handleDataIsLoadingChange = (b) => {
        this.setState({
          dataIsLoading: b
        })
    }

    render() {

        let display_DisplayCharts;
        let display_UserInput;
        let processedWeatherData;
        if (this.state.pointData) {
            processedWeatherData = processWeatherData(this.state.pointData['data'], this.state.crop)
            display_DisplayCharts = <DisplayCharts
                        locInfo={this.state.locations[this.state.selected]}
                        chartWeatherData={processedWeatherData}
                        crop={this.state.crop}
                        dataIsLoading={this.state.dataIsLoading}
                      />
        }

        display_UserInput = <UserInput
                                  crop={this.state.crop}
                                  crop_list={this.crop_list}
                                  onchange_crop={this.handleCropChange}
                                />

        return (
              <Grid container direction="column" justifyContent="center" spacing={2}>

                <Grid item>
                  <Typography variant='h6'>
                    <LocationPicker
                      locations={this.state.locations}
                      selected={this.state.selected}
                      newLocationsCallback={this.handleLocationPickerOutput}
                      token={this.token}
                      modalZIndex={150}
                    />
                  </Typography>
                </Grid>

                <Grid item>
                </Grid>

                <Grid container direction="row" justifyContent="center">

                  <Grid item container direction="column" justifyContent="flex-start" spacing={1} md>
                    <Hidden mdUp>
                        <Grid item container direction="row">
                          <Grid item>
                            <VarPopover content={display_UserInput} />
                          </Grid>
                          <Grid item>
                            <HelpToolPopover content={<HelpMain/>} />
                          </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid item container direction="column" justifyContent="center" alignItems="center">
                          <Grid item>
                            {display_UserInput}
                          </Grid>
                          <Grid item>
                            <HelpToolPopover content={<HelpMain/>} />
                          </Grid>
                        </Grid>
                    </Hidden>
                  </Grid>

                  <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={1} md={9}>
                      {this.state.pointData && display_DisplayCharts}
                  </Grid>

                </Grid>

              </Grid>
        );
    }
}

export default ToolContents;
