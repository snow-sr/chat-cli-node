import { io } from "socket.io-client";
import readline from "readline";
import chalk from "chalk";
const messages = [];
var user = null;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});
const socket = io("http://localhost:8087");
function sendMessage(message, user) {
    socket.emit("message", { message, user });
}
function askForMessage() {
    rl.question("", (message) => {
        if (message == "/clear") {
            console.clear();
        }
        if (!message.includes("/")) {
            let dateOfMessage = new Date().toLocaleTimeString();
            let MG = `${message}  ${chalk.dim(dateOfMessage)}`;
            sendMessage(MG, user);
        }
        messages.push(message);
        if (messages.indexOf(message) == 1) {
            console.clear();
        }
        readline.moveCursor(process.stdout, 0, -2);
        readline.clearScreenDown(process.stdout);
        askForMessage();
    });
}
socket.on("message", function (x) {
    user ? console.log(`${chalk.blue(`${x.user} said:`)} ${x.message}`) : console.log('  someone sended a message, but you dont have a name yet, insert a name:');
});
if (messages.length == 0 && user == null) {
    rl.question(`${chalk.red("What is your name?")}`, (name) => {
        user = name;
        console.clear();
        console.log(`hey there ${user}`);
        askForMessage();
    });
}
;
