import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official';
import CircularProgress from '@material-ui/core//CircularProgress';
import Backdrop from '@material-ui/core//Backdrop';

HighchartsMore(Highcharts)
Exporting(Highcharts)
ExportData(Highcharts)
window.Highcharts = Highcharts;

Highcharts.Tooltip.prototype.hide = function () {};

const DisplayBarChart = (props) => {

        const getChartTitle = () => {
            let t = ''
            if (props.crop==='rye') {
                t = 'GDDs (base '+props.chartWeatherData.gdd_base+') from planting date (' + props.chartWeatherData.dates[props.idxChartElement] + ') through end of season'
            } else if (props.crop==='buckwheat') {
                t = 'GDDs (base '+props.chartWeatherData.gdd_base+') from planting date (' + props.chartWeatherData.dates[props.idxChartElement] + ') through hard freeze'
            } else if (props.crop==='mustard') {
                t = 'GDDs (base '+props.chartWeatherData.gdd_base+') from planting date (' + props.chartWeatherData.dates[props.idxChartElement] + ') through hard freeze'
            } else {
                t = ''
            }
            return t
        }

        const formatData = (data) => {
            let colorUse = '';
            let dataToDisplay = [];
            if (data) {
              let dlen = data.length;
              for (var i=0; i<dlen; i++) {
                  if (data[i]>=props.chartWeatherData.gdd_thresh) {
                      colorUse = 'rgba(0,0,255,1.0)'
                  } else {
                      colorUse = 'rgba(255,0,0,1.0)'
                  }
                  dataToDisplay.push({
                      x: Date.UTC(parseInt(props.chartWeatherData.years[i],10),1,1),
                      y: data[i],
                      color: colorUse,
                  })
              }
            }
            return dataToDisplay
        }

        const flattenGDD = (data) => {
            return data.flat()
        }

        const genChartConfig = () => {
              return {
                 credits: { enabled: false },
                 legend: { enabled: false },
                 chart: {
                     height: 160,
                     marginBottom: 15,
                 },
                 title: {
                     text: getChartTitle(),
                     style: { "fontWeight": "bold", "fontSize": "16px" },
                 },
                 subtitle: {
                     text: '',
                     style: { "fontWeight": "bold", "fontSize": "12px" },
                 },
                 exporting: { enabled: false },
                 plotOptions: {
                     series: {
                         animation: false,
                     },
                 },
                 xAxis: {
                     type: 'datetime',
                     dateTimeLabelFormats: { day: '%b %e', week: '%b %e', year: '%Y' },
                     labels: {
                         align: 'center',
                         x: 0,
                         y: 10 
                     },
                 },
                 yAxis: {
                     title: { text: 'GDD-'+props.chartWeatherData.gdd_base.toString() },
                     min: Math.min(...flattenGDD(props.chartWeatherData.gdd)),
                     max: Math.max(...flattenGDD(props.chartWeatherData.gdd)),
                     startOnTick: false,
                     endOnTick: false,
                     plotLines: [{
                         color: 'black',
                         dashStyle: 'solid',
                         zIndex: 4,
                         width: 2,
                         value: parseFloat(props.chartWeatherData.gdd_thresh),
                         label:{
                             text:props.chartWeatherData.gdd_thresh.toString(),
                             style: {
                                 color: 'blue',
                                 fontWeight: 'bold',
                             },
                             x:-33,
                             y:3
                         }
                     }],
                     visible: true,
                 },
                 tooltip: {
                     pointFormat: "GDD: {point.y:,.0f}",
                     xDateFormat: "%Y",
                     crosshairs: [{
                         width: 1,
                         color: 'gray',
                         dashStyle: 'solid'
                     }],
                 },
                 series: [{
                     type: 'column',
                     name: 'GDD',
                     data: formatData(props.chartWeatherData.gdd[props.idxChartElement]),
                 }],
              }
            }

    return(

      <>
        <HighchartsReact
          containerProps={{ style: { height: "100%" } }}
          highcharts={Highcharts}
          options={genChartConfig()}
          //callback={afterRender}
        />

        {props.dataIsLoading &&
          <Backdrop
            style={{zIndex:1000}}
            invisible={true}
            open={props.dataIsLoading}
          >
            <CircularProgress size={200} color="primary"/>
          </Backdrop>
        }
      </>

    );


}

DisplayBarChart.propTypes = {
  locInfo: PropTypes.object.isRequired,
  chartWeatherData: PropTypes.object.isRequired,
  crop: PropTypes.string.isRequired,
  dataIsLoading: PropTypes.bool.isRequired,
  idxChartElement: PropTypes.number.isRequired,
};

export default DisplayBarChart;
