window.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connect");
  connectButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await onClickConnect();
  });
  const disconnectButton = document.getElementById("disconnect");
  disconnectButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await onClickDisconnect();
  });
  const sendButton = document.getElementById("send");
  sendButton.addEventListener("click", async (event) => {
    event.preventDefault();
    onClickSend();
  });
});

const uuid1 = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const uuid2 = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const uuid3 = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let server = undefined;
let writeCharacteristic = undefined;
let readCharacteristic = undefined;

const onClickConnect = async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [uuid1],
    });
    console.log("device", device);
    document.getElementById("deviceName").innerText = device.name;

    server = await device.gatt.connect();
    console.log("server", server);

    const service = await server.getPrimaryService(uuid1);
    console.log("service", service);

    writeCharacteristic = await service.getCharacteristic(uuid2);
    console.log("writeCharacteristic", writeCharacteristic);

    readCharacteristic = await service.getCharacteristic(uuid3);
    console.log("readCharacteristic", readCharacteristic);

    readCharacteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        const value = new TextDecoder().decode(event.target.value);
        document.getElementById("value").innerText = value;
      },
    );
    readCharacteristic.startNotifications();
  } catch (error) {
    console.error(error);
  }
};

const onClickDisconnect = async () => {
  if (server) {
    readCharacteristic.stopNotifications();
    server.disconnect();
  }
};

const onClickSend = async () => {
  const text = document.getElementById("text").value;
  const encoded = new TextEncoder().encode(text);
  await writeCharacteristic.writeValue(encoded);
};
