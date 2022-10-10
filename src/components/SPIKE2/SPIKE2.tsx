import WebSerial from "../WebSerial";
export default class SPIKE2 {

    private serial: WebSerial;

    constructor(serial: WebSerial) {
        this.serial = serial;
    }
}