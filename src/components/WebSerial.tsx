
/*
    WebSerial.tsx
    By: Gabriel Sessions

    Faciliates the interaction between client code and the WebSerial API

    Last Edited: 10/20/22
*/

import Queue from "./Queue";

/*~ https://wicg.github.io/serial/#dom-serial */
interface Serial extends EventTarget {
  onconnect: ((this: this, ev: Event) => any) | null;
  ondisconnect: ((this: this, ev: Event) => any) | null;

  getPorts(): Promise<SerialPort[]>;
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: this, ev: Event) => any,
    useCapture?: boolean): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions): void;
  removeEventListener(
    type: 'connect' | 'disconnect',
    callback: (this: this, ev: Event) => any,
    useCapture?: boolean): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean): void;

}

/*~ https://wicg.github.io/serial/#dom-serialport */
interface SerialPort extends EventTarget {
  onconnect: ((this: this, ev: Event) => any) | null;
  ondisconnect: ((this: this, ev: Event) => any) | null;
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;

  open(options: SerialOptions): Promise<void>;
  setSignals(signals: SerialOutputSignals): Promise<void>;
  getSignals(): Promise<SerialInputSignals>;
  getInfo(): SerialPortInfo;
  close(): Promise<void>;

  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: this, ev: Event) => any,
    useCapture?: boolean): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions): void;
  removeEventListener(
    type: 'connect' | 'disconnect',
    callback: (this: this, ev: Event) => any,
    useCapture?: boolean): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean): void;
}

/*~ https://wicg.github.io/serial/#extensions-to-the-navigator-interface */
interface Navigator {
  readonly serial: Serial;
}

interface TextDecoderStream {
  readable: ReadableStream,
  writable: WritableStream
}

interface TextEncoderStream {
  readable: ReadableStream,
  writable: WritableStream
}

// Main Class to Export
class WebSerial {
  // Class Constants
  static CONTROL_A: string = '\x01'; // CTRL-A character 
  static CONTROL_B: string = '\x02'; // CTRL-B character
  static CONTROL_C: string = '\x03'; // CTRL-C character 
  static CONTROL_D: string = '\x04'; // CTRL-D character
  static CONTROL_E: string = '\x05'; // CTRL-E character
  static CONTROL_F: string = '\x06'; // CTRL-F character
  static ENTER: string = '\r\n' // NEWLINE character
  static TAB: string = '\x09' // TAB character

  // Private member variables
  private consoleQueue: Queue = new Queue();
  private os: number = 0; // Not enabled yet
  private port: Serial = navigator.serial;
  private portRequest: any = undefined;
  private isWriteInit: boolean = false;
  private textEncoder: TextEncoderStream = new TextEncoderStream();
  private reader: any = undefined;
  private writer: any = undefined;
  private writerInitialized: boolean | Promise<boolean> = false;

  // Publically accessible variables
  public isActive: boolean = false;
  public executeAfterInit: Function = () => { console.log("PyREPL Initialized") };
  public onRead: (readValue: string) => void = (value) => console.log(value);

  set writer_Initialized(newVal: boolean) {
    this.writerInitialized = newVal;
  }

  /**
   * Initializes a WebSerial connection between a SPIKE Prime hub
   * and the webpage
   * @param optional function to trigger on error
   * @returns true if initialization is successful, false otherwise
   */
  public async initWebSerial(errorFunction: (errorMessage: any) => void = () => { }): Promise<boolean> {

    // Open Serial popup for user to select serial port
    await this.port.getPorts();

    this.portRequest = await this.port.requestPort();

    // wait for the port to open.
    try {
      await this.portRequest.open({ baudRate: 115200 });
    }
    catch (er) {
      console.log("%cPyREPL ", "color: #3ba336;", er);
      if (errorFunction !== undefined)
        errorFunction(er);
      //await this.portRequest.close();
      return false;

    }

    if (this.portRequest.readable) {
      this.rawWriteToPort(WebSerial.CONTROL_C)
      this.readPort(errorFunction);

      this.executeAfterInit();
      return true;
    }
    else {
      return false;
    }
  }

  // Not Enabled Yet
  // Checks the OS Version of a SPIKE Prime Hub
  private async getOS(): Promise<void> {

    const VERSION_CUTOFF = 16;
    const SPIKE2 = 2;
    const SPIKE3 = 3;

    await this.writeToPort(["import sys", "sys.implementation"])

    setTimeout(() => {
      while (this.consoleQueue.size() > 0 && !this.consoleQueue.top().includes("sys.implementation")) {
        console.log("Dequeue: " + this.consoleQueue.dequeue());
      }

      this.consoleQueue.dequeue(); // remove sys.implementation line
      // next line is the implementation details
      const implementationDetails: string = this.consoleQueue.dequeue();

      const versionNumber: string | undefined = this.findVersionNumber(implementationDetails);

      if (typeof versionNumber == "string") {
        if (parseInt(versionNumber.substring(1)) > VERSION_CUTOFF) {
          this.os = SPIKE3;
          return;
        }
      }

      this.os = SPIKE2;

    }, 50);

  }

  /**
   * Finds the current SPIKE OS version in a sys.implementation call
   */
  private findVersionNumber(rawString: string): string | undefined {
    const detailsArray: Array<string> = rawString.split(',');
    console.log(rawString);

    // Looking for NUMBER in "version=(1, NUMBER, 0)" 
    // sys.implementation call to generate string
    let counter = 0;
    let versionNumIsNext: boolean = false;
    for (let i = 0; i < detailsArray.length; i++) {
      if (versionNumIsNext) {
        return (detailsArray.at(counter))
      }
      if (detailsArray.at(counter)?.includes("version=")) {
        versionNumIsNext = true;
      }
      counter++;
    };

    return ("0");
  }

  // Not finished, getHubName should fetch info from hub filesystem
  private getHubName(): string {
    return "SPIKE Hub";
  }

  /**
   * Reads data from the SPIKE serial port
   */
  private async readPort(errorFunction: (errorMessage: any) => void = () => { }): Promise<void> {
    // eslint-disable-next-line no-undef
    // @ts-ignore
    let decoder: TextDecoderStream = new TextDecoderStream();
    this.portRequest.readable.pipeTo(decoder.writable);
    const inputStream: any = decoder.readable;
    this.reader = inputStream.getReader();

    let curLine = "";
    while (this.portRequest && this.portRequest.readable && this.isActive) {
      try {
        while (this.isActive) {
          const { value, done } = await this.reader.read();
          this.onRead(value);
          if (done) {
            break;
          }
          curLine += value;
          const lineArr = curLine.split('\n');
          if (lineArr.length > 1) {
            for (let i = 0; i < lineArr.length - 1; i++) {
              this.consoleQueue.enqueue(lineArr[i]);
            }
            curLine = lineArr[lineArr.length - 1];
          }
        }
      } catch (error) {
        console.error(error);
        errorFunction(error);
        this.isActive = false;
      } finally {
        console.log("Reader Closed")
        //this.reader.releaseLock();
      }
    }
  }

  public getOutput(): string[] {
    return (this.consoleQueue.getAll())
  }

  public clearConsole(): void {
    this.consoleQueue.clear();
  }

  /**
   * Initializes the write stream, if not already initialized
   */
  private initWriteStream(): void {
    this.textEncoder.readable.pipeTo(this.portRequest.writable);
    this.writer = this.textEncoder.writable.getWriter();
    this.writerInitialized = true;
    this.isActive = true;

  }

  /**
   * Writes lines of micropython code to the connected serial port
   * @param lines - an array of lines to write to the serial port
   */
  public writeToPort(lines: Array<string>): void {

    try {
      if (!this.isActive)
        this.initWriteStream();
    }
    catch {
      console.error("Error: Device not connected, cannot write data");
      return;
    }

    console.log("%cPyREPL ", "color: #3ba336;", "----------------WRITING TO MICROPROCESSOR----------------");
    this.writer.write(WebSerial.CONTROL_E);
    // Writes code one line at a time
    lines.forEach((element) => {
      // console.log(element)
      this.writer.write(element + "\r\n");
    });

    this.writer.write(WebSerial.CONTROL_D);


    console.log("%cPyREPL ", "color: #3ba336;", "----------------FINISHED WRITING----------------");
  }

  public rawWriteToPort(line: string) {
    try {
      if (!this.isActive)
        this.initWriteStream();
    }
    catch {
      console.error("Error: Device not connected, cannot write data");
      return;
    }

    console.log(line)
    this.writer.write(line);
  }

  public async closePort() {
    try {
      if (this.portRequest.readable) {
        await this.reader.cancel();
        await this.reader.releaseLock();
      }
    } catch (error) {
      console.error("Error handling the reader:", error);
    }

    try {
      if (this.portRequest.writable) {
        await this.writer.close();
        await this.writer.releaseLock();
        this.writer = undefined;
        this.writerInitialized = false;
      }
    } catch (error) {
      console.error("Error handling the writer:", error);
    }

    try {
      setTimeout(() => {
        this.portRequest.close();
        this.resetVariables()
      }, 200);

    } catch (error) {
      console.error("Error closing the port:", error);
    }


  }

  private resetVariables() {
    this.consoleQueue = new Queue();
    this.os = 0; // Not enabled yet
    this.port = navigator.serial;
    this.portRequest = undefined;
    this.isWriteInit = false;
    this.textEncoder = new TextEncoderStream();
    this.reader = undefined;
    this.writer = undefined;
    this.writerInitialized = false;
    this.isActive = false;
  }
}

export default WebSerial;


