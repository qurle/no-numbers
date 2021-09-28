// I really don't care about quality of the code, but you can fork it to make it better

const finishMsgs = ["Done!", "You got it!", "All renamed!", "Is that all?", "My job here is done", "Gotcha!", "It wasn't hard", "Got it! What's next?"]
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
  "Vector"
]
const regex = /^\w+(?= \d+)|\d+$/gm

let notification: NotificationHandler
let selection: ReadonlyArray<SceneNode>
let working: boolean
let count: number

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
    if (index >= 0)
      node.name = dict[index]
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
  notify(finishMsgs[Math.floor(Math.random() * finishMsgs.length)])
  //figma.viewport.scrollAndZoomIntoView(selection)
  figma.closePlugin()
}