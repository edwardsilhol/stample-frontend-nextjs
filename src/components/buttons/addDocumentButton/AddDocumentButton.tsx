import React from 'react';
import ButtonGroup from '../../muiOverrides/ButtonGroup';
import Button from '../../muiOverrides/Button';
import ArrowDropDownIcon from '../../muiOverrides/ArrowDropDownIcon';
import StarIcon from '../../muiOverrides/StarIcon';

function useStyles() {
  return {
    button: {
      justifyContent: 'flex-end',
    },
  };
}
function AddDocumentButton() {
  const styles = useStyles();

  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="double button"
        sx={styles.button}
      >
        <Button>
          <StarIcon />
          Ajouter
        </Button>
        <Button size="small" aria-label="options">
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
    </>
  );
}

export default AddDocumentButton;
