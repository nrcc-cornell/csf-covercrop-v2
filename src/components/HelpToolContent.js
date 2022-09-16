///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import Box from '@material-ui/core/Box';

const HelpMain = () => {
        return (
            <Box maxWidth={800} padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
               <h2>Data sources and methods</h2>
               <h4><br/>TEMPERATURE DATA</h4>
               <p>
               Growing degree days are calculated using daily maximum and minimum temperatures obtained from a high-resolution (4km) gridded dataset constructed for the Northeast United States. These temperature grids are produced daily by the <a href="http://www.nrcc.cornell.edu" target="_blank" rel="noopener noreferrer">Northeast Regional Climate Center</a> using the documented procedure described in the following publication:
               </p>
               <p>
               Degaetano, Arthur & Belcher, Brian. (2007). Spatial Interpolation of Daily Maximum and Minimum Air Temperature Based on Meteorological Model Analyses and Independent Observations. Journal of Applied Meteorology and Climatology. 46.
               </p>
               <p>
               These data are available for use through the Applied Climate Information System (<a href="http://www.rcc-acis.org" target="_blank" rel="noopener noreferrer">ACIS</a>) web service.
               </p>
               <h4>CROP MODELS</h4>
               <p>
               We utilize crop models from the following sources below.
               </p>
               Buckwheat:
               <p>
               Björkman, Thomas & W. Shail, Joseph. (2013). Using a Buckwheat Cover Crop for Maximum Weed Suppression after Early Vegetables. HortTechnology. 23. 575-580. 
               </p>
               Mustard:
               <p>
               Björkman, Thomas. (2015). Mustard Cover Crops for Biomass Production and Weed Suppression in the Great Lakes Region. Agronomy Journal. 107. 1235-1249.
               </p>
               Rye:
               <p>
               Mirsky, Steven & S. Curran, William & Mortensen, David & R. Ryan, Matthew & L. Shumway, Durland. (2009). Control of Cereal Rye with a Roller/Crimper as Influenced by Cover Crop Phenology. Agronomy Journal. 101.<br/>
               Nuttonson, M.Y. 1958. Rye-climate relationships and use of phenology in ascertaining the thermal and photo-thermal requirements of rye. Ameri- can Institute of Crop Ecology, Washington, DC.<br/>
               </p>
            </Box>
        );
} 

export {HelpMain};

