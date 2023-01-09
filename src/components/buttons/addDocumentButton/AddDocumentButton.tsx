import React from 'react';
import ButtonGroup from '../../muiOverrides/ButtonGroup';
import Button from '../../muiOverrides/Button';
import ArrowDropDownIcon from '../../muiOverrides/ArrowDropDownIcon';
import StarIcon from '../../muiOverrides/StarIcon';

export default function AddDocumentButton() {
  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="double button"
        sx={{ justifyContent: 'flex-end' }}
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
