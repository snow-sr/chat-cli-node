import { connect, io } from "socket.io-client";
import readline from "readline";
import chalk from "chalk";
const messages = [];
var user = null;
var connected = false;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let serverLink = process.argv[3];

const socket = io(`http://${serverLink}`);

console.log(`${chalk.bold.yellow("Trying to connect you at:")} ${serverLink}`);


socket.on("connected", () => {
  connected = true;
  console.log(`${chalk.bold.yellowBright("Status of the connection: ")}${connected}`);
  askUser()
})

function sendMessage(message: string, user: string) {
  socket.emit("message", { message, user });
}

function askForMessage() {
  rl.question("", (message) => {

    if (message == "/clear") {
      console.clear();
    }

    if (!message.includes("/")) {
      let dateOfMessage = new Date().toLocaleTimeString()

      let MG = `${message}  ${chalk.dim(dateOfMessage)}`
    
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



function askUser(){
if(messages.length == 0 && user == null && connected){
    rl.question(`${chalk.red("What is your name?")}`, (name) => {
        user = name;
        console.clear()
        console.log(`hey there ${user}`)
        askForMessage();
    })
};
}


