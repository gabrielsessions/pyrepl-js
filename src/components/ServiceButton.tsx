/*
    ServiceButton.tsx

    By: Gabriel Sessions

    Interface for connecting between a serial device and a webpage.
    Main button component to be embedded in other sites

    Last Edited: October 10th, 2022
*/

import React, {useEffect, useState} from "react";
import { Fab, Tooltip } from "@mui/material";
import CableIcon from '@mui/icons-material/Cable';
import CircularProgress from "@mui/material/CircularProgress";
import { AlertColor } from "@mui/material";

import WebSerial from "./WebSerial";
import SnackbarAlert from "./SnackbarAlert";

type Color = 'inherit' | 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'default' | 'error';

const CONTROL_C = '\x03'; // CTRL-C character 
const CONTROL_D = '\x04'; // CTRL-D character
const CONTROL_E = '\x05'; // CTRL-E character

/**
 * Props of the ServiceButton component
 *
 * @interface ButtonProps
 * @member {string} id of the div surrounding ServiceButton content
 * @member {string} CSS classes of the div surrounding ServiceButton content
 */
export interface ButtonProps {
    /**
     * id of div surrounding ServiceButton
     */
    id: string,
    /**
     * CSS class name(s) of div surrounding ServiceButton
     */
    className: string
}

/**
 * Outline of the ServiceButton user interface
 */
export interface ButtonUI {
    /**
     * name of the state
     */
    name: string

    /**
     * color of the button (use MUI color string)
     */
    color: Color

    /**
     * text shown when hovering over the button
     */
    tooltipText: string
}
   



/**
 * Stores information about the ServiceDock Color Theme
 * @public
 */
export class ButtonState {

    /**
     * Constructs a new button state, more button states can be created 
     * using the addState function.
     *
     * @remarks
     * This is a UI class that should not be edited by ServiceDock users.
     *
     * @param name - Name of the state
     * @param color - Main color of the button
     * @param tooltipText - Text of the tooltip when the mouse hovers over the button
     * 
     * @example
     * ```
     * // Disconnected (Red) State
     * const states = new ButtonState("Disconnected", "error", "Not Connected");
     * ```
     * 
     * @internal
     * 
     */

    private states: ButtonUI[] = [];
    private activeState: string;

    constructor(name: string, color: Color, 
                tooltipText: string)  {

        const firstState: ButtonUI = {
            name: name,
            color: color,
            tooltipText: tooltipText
        }
        this.states.push(firstState)
        this.activeState = "name"
    }

    /**
     * Adds a new state to the list of button states
     * 
     * @param name - Name of the button state
     * @param color - Main color of the button
     * @param tooltipText - Text of the tooltip when the mouse hovers over the button
     */
    public addState(name: string, color: Color, 
        tooltipText: string): void {

        const newState: ButtonUI = {
            name: name,
            color: color,
            tooltipText: tooltipText
        }
        this.states.push(newState);

    }

    /**
     * Returns the state information of the button
     * 
     * @param state - the name of the requested state
     * @returns A ButtonUI object which contains the current color and tooltip
     * to be rendered on the ServiceButton
     * @error If the state does not exits, an error is thrown
     */
    public getState(state: string): ButtonUI {
        
        for (let i = 0; i < this.states.length; i++){
            let element = this.states[i];
            if (element.name === state) {
                return element;
            }
        }

        console.error("Error: state " + state + " does not exist");
        return ({name: "", color: "default", tooltipText: ""});
    }
}


// Main Instance of serial connection
const serial: WebSerial = new WebSerial();

/**
 * Renders the button for the user to interact with ServiceSPIKE (connect, restart, view status, etc.)
 * 
 * @param props - passed as a ButtonProps object
 * @returns A button with a cable icon and tooltip that appears on hover. Full implementation of the "backend" can be found in other modules
 */
export function ServiceButton(props: ButtonProps) {

    interface alertObject  {
        open: boolean,
        text: string,
        type: AlertColor
    }

    const initAlert: alertObject = {
        open: false,
        text: "",
        type: "error"
    }

    const [alert, setAlert] = useState(initAlert);
    
    /**
     * Triggers an action when the ServiceButton is clicked, depending on 
     * which state the button is in.
     * 
     * @param state - Current (React) state of the the button 
     * @param setState - A method to change the current button state
     * @param serial - Webserial connection
     * @returns Nothing
     */
    async function buttonClick(state:string, setState:any, serial: WebSerial) {
        try {
            if (state === "Disconnected") {
                setAlert({
                    open: true,
                    text: "Connect your SPIKE above (select a Serial Port profile)",
                    type: "info"
                })
                openSerial(state, setState, serial)
            }
            if (state === "Connected") {
                const pyrepl: any = window.pyrepl;

                pyrepl.write = `from hub import speaker
speaker.beep(500)`
                
            }
        }
        catch(e) {
            console.error(e);
            setState("Disconnected")
        }
        
    }

    /**
     * Triggers an alert if an error occurs during the initialization process
     * @param er - An error message to display (get from a catch block)
     */
    function displayError(er: any) {
        const errorStr:string = er.toString();
        
        setAlert({
            open: true,
            text: errorStr,
            type: "error"
        });

        setCurrentState("Disconnected");
    }

    /**
     * Attempts to initalize a serial connection when the button is clicked
     * and a connection does not already exist
     */
    async function openSerial(state:string, setState:any, serial: WebSerial) {
        
        setState("Loading")

        let errorLog:any = "";

        try {
            let serialConnection: boolean = await serial.initWebSerial(displayError);
            if (serialConnection) {
                setState("Connected");
                setAlert({
                    open: true,
                    text: "Connection to SPIKE Prime Hub was successful",
                    type: "success"
                })
            }
            else {
                setState("Disconnected")
            }
        }
        catch(er) {
            console.error(er);
            displayError(er)
            setState("Disconnected");
        }

    }
    
    // Initializing button themes
    const buttonState: ButtonState = new ButtonState("Disconnected", "error", "Not Connected");
    buttonState.addState("Loading", "warning", "Connecting")
    buttonState.addState("Connected", "success", "Connected")

    // Setting state to change between button themes
    const [currentState, setCurrentState] = useState("Disconnected");

    // Returns the current icon on the button
    function getIcon(state: string) {
        if (state === "Loading") {
            return <CircularProgress size="2rem" color="inherit" />
        }
        return <CableIcon fontSize="large" />
    }

    type PyreplProxyObject = {
        "write": string; 
        "read": string[];
    };
    
    // Fetches user command calls from the browser window and executes appropriate WebSerial actions
    useEffect(() => {
        const targetObj: PyreplProxyObject  = {"write": "", "read": []};
        const pyreplProxy: any = new Proxy(targetObj, {
            set: function (target: PyreplProxyObject, key: string, value: any) {
                if (key === "write") {
                    if (typeof(value) == 'string') {
                        serial.rawWriteToPort(WebSerial.CONTROL_E)
                        const delayInterval = 8 // 8ms per line
                        for (let i = 0; i < value.split("\n").length; i++) {
                            setTimeout(() => {
                                serial.rawWriteToPort(value.split("\n")[i] + "\r")
                            }, i*delayInterval);
                        }
                        setTimeout(() => {
                            serial.rawWriteToPort(WebSerial.CONTROL_D)
                        }, delayInterval * value.split("\n").length + 1);
                    }
                    else {
                        serial.writeToPort([WebSerial.CONTROL_E, ...(value.split("\n")), WebSerial.CONTROL_D])
                    }
                    
                }
                
                // Needs to be a function
                else if (key === "executeAfterInit") {
                    if (typeof value === 'function')
                        serial.executeAfterInit = value;
                    else 
                        console.error("Error: executeAfterInit value must be a function name. Value given to onActivation was: " + typeof value);
                }
                return true;
            },

            get: function (target: PyreplProxyObject, key: string) {
                if (key === "read") {
                    target["read"] = serial.getOutput();
                    return target["read"];
                }
                else if (key === "isActive") {
                    return serial.isActive;
                }
                else if (key === "clearConsole") {
                    serial.clearConsole();
                }
                else if (key === "stop") {
                    serial.rawWriteToPort(WebSerial.CONTROL_C)
                }
                else if (key === "reboot") {
                    serial.rawWriteToPort(WebSerial.CONTROL_D)
                }
                return "";
            }
        });


        window.pyrepl = pyreplProxy;
    }, [props])
    
    return (
        <div id={props.id}>
            <Tooltip 
                title={buttonState.getState(currentState).tooltipText} 
                placement="top"
            >   
                <Fab 
                    aria-label="connect"
                    color={buttonState.getState(currentState).color}
                    onClick={() => {
                        buttonClick(currentState, setCurrentState, serial)
                    }}
                >
                    {
                        getIcon(currentState)
                    }
                </Fab>
            </Tooltip>
            <div style={{textAlign: "left"}}>
                <SnackbarAlert 
                    open={alert.open}
                    setOpen={() => {
                        setAlert((prev) => {
                            return ({
                                ...prev,
                                open: false
                            })
                        })
                    }}
                    text={alert.text}
                    type={alert.type}
                    
                />
            </div>
            
        </div>
    )
}

export default ServiceButton;