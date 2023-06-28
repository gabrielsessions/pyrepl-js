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

  /**
   * Closes the snackbar
   * @param event - Event that occurs (not used in function)
   * @param reason - Reason why the even occurred
   * @returns - Nothing
   */
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  /**
   * Depending on the alert color, return the correct alert title
   * @param type - Type of alert, see alert colors type definition
   * @returns A string with the title of the aler
   */
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
              <div>
                <AlertTitle>
                  {getAlertTitle(props.type)}
                </AlertTitle>
                {props.text}
              </div>
                
            </Alert>
        </Snackbar>
    </div>
  );
}
