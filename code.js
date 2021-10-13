// I really don't care about quality of the code, but you can make pull request to make it bettor!
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// Variables
let notification;
let selection;
let working;
let count = 0;
figma.on("currentpagechange", escape);
// For networking purposes
figma.showUI(__html__, { visible: false });
const post = (k, v = 1, last = false) => figma.ui.postMessage({ k: k, v: v, last: last });
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg === "finished")
        figma.closePlugin();
    else
        console.log(msg);
});
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
        post("runned for", time, true);
    }
    else
        notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)]);
    // figma.closePlugin()
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
