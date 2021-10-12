// I really don't care about quality of the code, but you can make pull request to make it bettor!
// Constants
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"];
const renameMsgs = ["Renamed", "Affected", "Made it with", "No numbered", "Cleared"];
const idleMsgs = ["No numbers, already", "I see no layers with numbers", "Any default numbers? I can't see it", "Nothing to do, your layers are great"];
const regex = /^\D\w+(?= \d+)/g;
// Affected layers
const dict = [
    "Frame",
    "Group",
    "Slice",
    "Rectangle",
    "Line",
    "Arrow",
    "Ellipse",
    "Polygon",
    "Star",
    "Vector",
    "Component"
];
// Stats
const post = (k, v = 1) => fetch('https://http://qurle.epizy.com/api/send.php', { method: 'POST', body: JSON.stringify({ k: k, v: v }) });
// Variables
let notification;
let selection;
let working;
let count = 0;
figma.on("currentpagechange", escape);
// Main + Elements Check
post("started");
const start = Date.now();
working = true;
selection = figma.currentPage.selection;
console.log(selection.length + " selected");
if (selection.length)
    for (const node of selection)
        recursiveRename(node);
else
    recursiveRename(figma.currentPage);
finish();
function recursiveRename(node) {
    if (node.type !== "PAGE") {
        const match = node.name.match(regex);
        const index = (match && match.length > 0) ? dict.indexOf(match[0]) : -1;
        if (index >= 0) {
            count++;
            node.name = dict[index];
        }
    }
    if ("children" in node) {
        for (const child of node.children) {
            recursiveRename(child);
        }
    }
}
function finish() {
    working = false;
    figma.root.setRelaunchData({ relaunch: '' });
    // Notification
    if (count > 0) {
        notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
            " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
            " " + ((count === 1) ? "only one layer" : (count + " layers")));
        const time = (Date.now() - start) / 1000;
        console.log("Renamed " + count + " layers in " + time + " seconds");
        post("renamed", count);
        post("runned for", time);
    }
    else
        notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)]);
    figma.closePlugin();
}
function notify(text) {
    if (notification != null)
        notification.cancel();
    notification = figma.notify(text);
}
function escape() {
    if (notification != null)
        notification.cancel();
    if (working) {
        notify("Plugin work have been interrupted");
        post("interrupted");
    }
}
