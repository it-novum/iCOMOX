using System;
using System.IO.Ports;
using System.Threading;
using System.Threading.Tasks;

namespace iCOMOX
{
    class Program
    {
        static bool _continue;
        static SerialPort _serialPort;

        public static void Main()
        {

            StringComparer stringComparer = StringComparer.OrdinalIgnoreCase;
            Thread readThread = new Thread(Read);
            System.Text.ASCIIEncoding enc = new System.Text.ASCIIEncoding();

            // Create a new SerialPort object with default settings.
            _serialPort = new SerialPort();

            // Allow the user to set the appropriate properties.
            //_serialPort.PortName = "/dev/cu.usbserial-DM0266RU"; 
            _serialPort.PortName = "/dev/tty.usbserial-DM0266RU";
            _serialPort.BaudRate = 115200; //125000 //115200
            _serialPort.Parity = System.IO.Ports.Parity.None;
            _serialPort.DataBits = 8;
            _serialPort.ReadBufferSize = 100000;
            _serialPort.WriteBufferSize = 4096;
            _serialPort.StopBits = System.IO.Ports.StopBits.Two;
            _serialPort.Handshake = System.IO.Ports.Handshake.None;

            // Set the read/write timeouts
            _serialPort.ReadTimeout = 500;
            _serialPort.WriteTimeout = 500;

            _serialPort.Open();
            if(_serialPort.IsOpen){
                Console.WriteLine("Port is open");
            }

            //Send OUT_MSG_Hello = b"\x00" to box
            _serialPort.Write("\x00");

            //def OUT_MSG_SetConfiguration(Reports, CommChannel, Activate):
            //    return b"\x03" + struct.pack("<BBB", Reports, CommChannel, Activate)
            
            Task.Delay(1).Wait();

            byte[] data = new byte[] {
                0x03,
                30,
                1,
                1
            };

            //Console.WriteLine(enc.GetString(data));

            _serialPort.Write(enc.GetString(data));

            

            _continue = true;
            readThread.Start();
             

        }
        public static void Read()
        {
            while (_continue)
            {
                try
                {
                    char[] buffer = new char[1024];
                    Int32 charsRead = 0;
                    charsRead = _serialPort.Read(buffer, 0, 1024);
                    Console.WriteLine(buffer);
                }
                catch (TimeoutException) {  }
            }
        }

    }
}