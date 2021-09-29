// I really don't care about quality of the code, but you can make pull request to make it bettor!

let finishMsgs = ["Done!", "You got it!", "All renamed!", "Is that all?", "My job here is done", "Gotcha!", "It wasn't hard", "Got it! What's next?"]
const finishVain = ["No numbers, already", "I see no layers with numbers", "Any default numbers? I can't see it", "Nothing to do, your layers are great"]
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
]
const regex = /^\w+(?= \d+)|\d+$/gm

let notification: NotificationHandler
let selection: ReadonlyArray<SceneNode>
let working: boolean
let count: number = 0

figma.on("currentpagechange", escape)

// Main + Elements Check
const nodes: SceneNode[] = [];
working = true
selection = figma.currentPage.selection
if (selection.length) {
  console.log("selection")
  for (const node of selection)
    recursiveRename(node)
}
else {
  console.log("No sel")
  recursiveRename(figma.currentPage)
}
working = false
finish()

function recursiveRename(node) {
  console.log("Current node: " + node.name);
  if (node.type !== "PAGE") {
    const match = node.name.match(regex)
    const index = (match && match.length === 2) ? dict.indexOf(match[0]) : -1
    if (index >= 0) {
      count++
      node.name = dict[index]
    }
  }
  if ("children" in node) {
    for (const child of node.children) {
      recursiveRename(child)
    }
  }
}

function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

function escape() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}

function finish() {
  working = false
  if (count > 0) {
    if (count === 1) finishMsgs.push("Renamed only one layer")
    else finishMsgs.push("Renamed " + count + "layers in total")
    notify(finishMsgs[Math.floor(Math.random() * finishMsgs.length)])
  }
  else notify(finishVain[Math.floor(Math.random() * finishVain.length)])
  //figma.viewport.scrollAndZoomIntoView(selection)
  figma.closePlugin()
}