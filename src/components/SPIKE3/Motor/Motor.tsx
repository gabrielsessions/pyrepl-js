import { PortLetter } from "../SPIKE3";

export default class Motor {

    constructor(private port: PortLetter) {
        this.port = port;
    }

    public async get_power(): Promise<number> {
        return 0;
    }

    public async get_speed(): Promise<number> {
        return await this.get_power();
    }
}