import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import CircularProgress from '@material-ui/core//CircularProgress';
import Backdrop from '@material-ui/core//Backdrop';

HighchartsMore(Highcharts)
Exporting(Highcharts)
ExportData(Highcharts)
window.Highcharts = Highcharts;

Highcharts.Tooltip.prototype.hide = function () {};

const DisplayChart = (props) => {

        const getChartTitle = () => {
            let t = ''
            if (props.crop==='rye') {
                t = 'Probability of cover crop establishment before end of season (Rye)'
            } else if (props.crop==='buckwheat') {
                t = 'Probability of biomass > 1 ton/acre before hard freeze (Buckwheat)'
            } else if (props.crop==='mustard') {
                t = 'Probability of biomass > 1.5 tons/acre before hard freeze (Mustard)'
            } else {
                t = ''
            }
            return t
        }

        const formatProbData = (probs) => {
            let dataToDisplay = [];
            let dlen = probs.length;
            for (var i=0; i<dlen; i++) {
                let d = props.chartWeatherData.dates[i].split('/')
                dataToDisplay.push({
                    x: Date.UTC(parseInt(moment().format('YYYY'),10),parseInt(d[0],10)-1,parseInt(d[1],10)),
                    y: probs[i],
                })
            }
            return dataToDisplay
        }

        const genChartConfig = () => {
              return {
                 credits: { enabled: false },
                 legend: {
                     labelFormatter: function () {
                         return '<span style="color:' + this.color + ';">' + this.name + '</span>';
                     },
                     layout: 'vertical',
                     align: 'right',
                     verticalAlign: 'top',
                     floating: true,
                     x: 0,
                     y: 50,
                 },
                 chart: {
                     height: 300,
                     events: {
                       render: function (this: Highcharts.Chart) {
                         if (this) {
                           const data = this.series[0].points[props.idxChartElement];
                           if (data) {this.tooltip.refresh(data)};
                         }
                       }
                     }
                 },
                 title: {
                     text: getChartTitle(),
                     style: { "fontWeight": "bold", "fontSize": "16px" },
                 },
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         animation: false,
                         grouping: false,
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                         },
                         states: {
                             hover: {
                                 enabled: true,
                                 halo: {
                                     size: 0
                                 }
                             }
                         },
                         point: {
                             events: {
                                 mouseOver: (e) => props.onchange_idxChartElement(e.target.index)
                             }
                         }
                     }
                 },
                 exporting: {
                   menuItemDefinitions: {
                     // Custom definition
                     downloadCSV: {
                       text: 'Download as CSV table'
                     },
                     downloadXLS: {
                       text: 'Download as XLS table'
                     }
                   },
                   buttons: {
                     contextButton: {
                       menuItems: [
                         "printChart",
                         "separator",
                         "downloadPNG",
                         "downloadJPEG",
                         "downloadPDF",
                         "downloadSVG",
                         "separator",
                         "downloadCSV",
                         "downloadXLS",
               //              "viewData",
                         "openInCloud"
                       ]
                     }
                   }
                 },
                 xAxis: {
                     type: 'datetime',
                     dateTimeLabelFormats: { day: '%b %e', week: '%b %e', year: '%Y' },
                     labels: {
                         align: 'center',
                         x: 0,
                         y: 20 
                     },
                 },
                 yAxis: {
                     title: { text: 'Probability (%)' },
                     min: 0,
                     max: 100,
                     tickInterval: 50,
                 },
                 tooltip: {
                     useHTML: true,
                     positioner: () => {
                         return {x:80, y:200};
                     },
                     shadow: false,
                     borderWidth: 0,
                     backgroundColor: null,
                     style: {"fontSize": "12px"},
                     headerFormat: '<span style="font-size: 16px"><b>Planting Date: </b>{point.key:%m/%d}</span><br/>',
                     pointFormat: '<span style="font-size: 16px"><b>Probability: </b>{point.y:.0f}%</span>',
                     crosshairs: [{
                         width: 1,
                         color: 'gray',
                         dashStyle: 'solid'
                     }],
                 },
                 series: [{
                     type: 'line',
                     name: 'Recent 15-yr',
                     data: formatProbData(props.chartWeatherData.probs_15),
                     lineWidth: 4,
                     color: 'rgba(0,0,0,1.0)',
                 },{
                     type: 'line',
                     name: '30-yr Normal',
                     data: formatProbData(props.chartWeatherData.probs_30),
                     lineWidth: 2,
                     color: 'rgba(0,0,0,0.2)',
                     enableMouseTracking: false,
                 },{
                     type: 'line',
                     name: 'POR: '+props.chartWeatherData.years[0].toString()+'-'+props.chartWeatherData.years[props.chartWeatherData.years.length-1].toString(),
                     data: formatProbData(props.chartWeatherData.probs_por),
                     lineWidth: 2,
                     color: 'rgba(0,0,255,0.2)',
                     enableMouseTracking: false,
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

DisplayChart.propTypes = {
  locInfo: PropTypes.object.isRequired,
  chartWeatherData: PropTypes.object.isRequired,
  crop: PropTypes.string.isRequired,
  dataIsLoading: PropTypes.bool.isRequired,
  idxChartElement: PropTypes.number.isRequired,
  onchange_idxChartElement: PropTypes.func.isRequired
};

export default DisplayChart;
