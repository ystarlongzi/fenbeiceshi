import ui from "./ui.json" with { type: "json" };
import knowledge from "./knowledge.json" with { type: "json" };
import details from "./details.json" with { type: "json" };

const content = { ...knowledge, ...details };
export { ui, content };
