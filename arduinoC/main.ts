/** 
 * @brief imaker sensors Mind+ library.
 * @n This is a MindPlus graphics programming extension for imaker's module.
 * @date  2026-02-01
*/

//% color="#106464" iconWidth=50 iconHeight=40
namespace arm_control_extension {
    //% block="Initialize arm controller Tx [TX] Rx [RX]" blockType="command"
    //% TX.shadow="dropdown" TX.options="UART_Tx_PIN" TX.defl="P0"
    //% RX.shadow="dropdown" RX.options="UART_Rx_PIN"  RX.defl="P1"
    export function initArm(parameter: any, block: any) {
        let tx = parameter.TX.code;
        let rx = parameter.RX.code;
        
        Generator.addInclude("LobotServoController", "#include <LobotServoController.h>");

        if (Generator.board === 'esp32' || Generator.board === 'firebeetleesp32' || Generator.board === 'firebeetleesp32e' || Generator.board === 'telloesp32' || Generator.board === 'esp32s3bit') {
            Generator.addObject("armController", "LobotServoController", "arm(Serial1);");
            Generator.addSetup("Serial1Begin", `Serial1.begin(9600, SERIAL_8N1, ${rx}, ${tx});`);
        } else if (Generator.board === 'pico') {
            Generator.addObject("armController", "LobotServoController", "arm(Serial1);");
            Generator.addSetup("Serial1Begin", `Serial1.setTX(${tx});\n  Serial1.setRX(${rx});\n  Serial1.begin(9600);`);
        } else {
            Generator.addInclude("SoftwareSerial", "#include <SoftwareSerial.h>");
            Generator.addObject("mySoftwareSerial", "SoftwareSerial", `mySerial(${rx}, ${tx});`);
            Generator.addObject("armController", "LobotServoController", "arm(mySerial);");
            Generator.addSetup("mySerialBegin", "mySerial.begin(9600);");
        }
    }

    //% block="Arm controller run action group [NUM] times [TIMES]" blockType="command"
    //% NUM.shadow="range" NUM.params.min=0 NUM.params.max=230 NUM.defl=0
    //% TIMES.shadow="range" TIMES.params.min=0 TIMES.params.max=100 TIMES.defl=1
    export function runActionGroup(parameter: any, block: any) {
        let num = parameter.NUM.code;
        let times = parameter.TIMES.code;
        Generator.addCode(`arm.runActionGroup(${num}, ${times});`);
    }

    //% block="Arm controller stop action group" blockType="command"
    export function stopActionGroup(parameter: any, block: any) {
        Generator.addCode(`arm.stopActionGroup();`);

}
}
