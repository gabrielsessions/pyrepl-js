import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


type Color = 'inherit' | 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'default' | 'error';

interface alertProps {
    open: boolean,
    setOpen: any,
    text: string,
    type: AlertColor
}


export default function AlertSnackbar(props: alertProps) {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  function getAlertTitle(type: AlertColor): string {
    switch(type) {
        case "error":
            return "Error"
            break;
        case "success":
            return "Success!"
            break;
        case "warning":
            return "Warning"
            break;
        default:
            return "Alert"
    }
    return ""
  }

  return (
    <div>
        <Snackbar open={props.open} autoHideDuration={5000} onClose={handleClose}>
            <Alert severity={props.type}>
                <AlertTitle>{getAlertTitle(props.type)}</AlertTitle>
                {props.text}
            </Alert>
        </Snackbar>
    </div>
  );
}
