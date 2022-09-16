///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 180,
  },
  menuPaper: {
    maxHeight: 190,
    backgroundColor: green[600],
    color: '#ffffff',
  }
});

const getLabel = (v) => {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

const CropSelect = (props) => {
        const { classes } = props;
        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="Crop">Cover Crop</InputLabel>
              <Select
                value={props.value}
                onChange={props.onchange}
                margin='none'
                MenuProps={{ classes: { paper: classes.menuPaper } }}
                inputProps={{
                  name: 'crop',
                  id: 'crop',
                }}
              >
                {props.values &&
                  props.values.map((v,i) => (
                    <MenuItem key={i} value={v}>{getLabel(v)}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </form>
        );
}

CropSelect.propTypes = {
  value: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default withStyles(styles)(CropSelect);
