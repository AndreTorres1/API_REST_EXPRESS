async function startServer() {
    const sleep = async(time)=>(await (setTimeout(()=>{}, time)));
    const { spawn } = require('child_process');

    // initiate the server with the
    console.log("[tests] starting the server...");
    const serverProcess = spawn("npm", ["run", "start-test"]);

    // uncomment for server logging
    serverProcess.stdout.on('data', (data) => {
        //console.log(`[server] ${data}`);
    });

    // pool the server until it is online
    while (true) {
        try {
            await fetch('http://localhost:4000/api/v1/version');
        } catch {
            await sleep(1000);
            continue;
        }
        console.log("[tests] server started!");
        break;
    }

    return serverProcess;
}

beforeEach(startServer)

//before(startServer);