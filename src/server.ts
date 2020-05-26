import { OPCUAServer, DataType, Variant } from "node-opcua";

const server = new OPCUAServer({
  port: 4334,
  resourcePath: "/UA/SAMPLE",
});

function construct_my_address_space(server: OPCUAServer) {
  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace?.getOwnNamespace();

  const device = namespace?.addObject({
    organizedBy: addressSpace?.rootFolder.objects,
    browseName: "MyDevice",
  });

  let variable1 = 1;
  setInterval(() => {
    variable1 += 1;
  }, 500);
  namespace?.addVariable({
    componentOf: device,
    browseName: "MyVariable1",
    dataType: "Double",
    value: {
      get: () => {
        return new Variant({ dataType: DataType.Double, value: variable1 });
      },
    },
  });
}

server.initialize(() => {
  construct_my_address_space(server);
  server.start(() => {
    console.log("Server is now listening");
    console.log("port", server.endpoints[0].port);
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0]
      .endpointUrl;
    console.log(endpointUrl);
  });
});
