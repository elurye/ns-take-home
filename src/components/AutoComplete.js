import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

function AutoComplete(props) {
  const valueOption = {};
  props.trackedRates.forEach(rate => {
      valueOption[rate.label + ' (' + rate.id + ')'] = 1;
  });
  return (
    <Autocomplete
      options={ props.options }
      onChange={(event, newValue) => {
        props.setAddCoin(newValue);
      }}
      getOptionLabel={(option) => `${option.label} (${option.id})` }
      renderOption={(option) => (
        <div>{option.label} ({option.id})</div>
      )}
      renderInput={(params) => (

        <TextField
          {...params}
          className="coin-search-input"
          label="Search crypto currencies"
          inputProps={{
            ...params.inputProps, // must include otherwise it breaks
            value:
              params.inputProps.value && valueOption[params.inputProps.value] ? "" : params.inputProps.value
          }}
          variant="outlined" />
      )}
    />
  );
}

export default AutoComplete;
