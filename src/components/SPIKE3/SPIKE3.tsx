import WebSerial from "../WebSerial";
import Motor from "./Motor/Motor"

export type PortLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export default class SPIKE3 {

    private serial: WebSerial;

    constructor(serial: WebSerial) {
        this.serial = serial;
    }

    public writeCommand(command: string): void {
        this.serial.writeToPort([command]);
    }

    public async getResult(): Promise<any> {

    }

    public Motor(port: PortLetter) {
        const newMotorInstance: Motor = new Motor(port);
        return newMotorInstance;
    }
}