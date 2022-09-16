///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// Components
import CropSelect from './CropSelect';

class UserInput extends React.Component {

  render() {

    return (
      <Box padding={2} border={0} borderRadius={4} borderColor="primary.main">

                    <Grid container item direction="column" spacing={3}>

                      <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={2}>

                        <Grid item>
                          <CropSelect
                            value={this.props.crop}
                            values={this.props.crop_list}
                            onchange={this.props.onchange_crop}
                          />
                        </Grid>

                      </Grid>

                    </Grid>

      </Box>
    );
  }
}

UserInput.propTypes = {
  crop: PropTypes.string.isRequired,
  crop_list: PropTypes.array.isRequired,
  onchange_crop: PropTypes.func.isRequired,
};

export default UserInput;
