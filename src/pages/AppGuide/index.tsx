import MarkdownRenderer from "../../components/MarkdownRenderer";

const MARKDOWN = `
# How to use *Issue Tracker* app efficiently

- create projects for dev projects you're working on (or want to)
- you can also add project's description, which can be styled/ formatted using Markdown syntax - you will be able to assign your issues to them
- on project page you can work with project's issues in a table mode (where the order of issues doesn't matter) & in list mode
- when you've noticed something to improve or fix, or add, or just got some ideas, questions etc., add it as an issue to the related project
- when adding the issue you can set priority, estimated time, difficulty & importance
- the first issue you've added is unordered by default, but even if all issues are unordered, you can:
  - track, manage, filter & sort **issues in particular dev projects or all issues regardless of the project**
  - **filter issues** by type, urgency, importance, estimated time, difficulty & status
  - **sort issues** by creation time, update time, urgency, importance, estimated time, difficulty & **rank** (issues rank is calculated automatically)
  - **have an overview, figure out & focus on the most important issues to work on at the moment** by combining filtering & sorting features & also by looking at the issues' ranking regardless of the project they belong to
- now, when you can figure out, what issues are worth to be working on, you can start **ordering** them by **converting into ordered issues**, so thanks to that you will have a partialy ordered plan set
- you can always change your mind & **convert ordered issue into unordered**
- **ordered & unordered issues can be mixed & coexist in one list**: ordered issues always appears in the top of the list & unordered are situated below ordered (unordered issues in list mode are sorted by rank)
- you can use **drag & drop** to change the order of ordered issues (of same parent)
- you can also **nest issues**: add issues as children to other issues & also you can not only nest them, but also you can **mix** them: you can **add ordered to unordered & vice versa**, so you are able to have recursive issues lists
- when you drag & drop ordered issue, all of issue's children will move with the parent
- when you're converting issue into ordered or unordered, all of issue's chidren will be untouched and ordered same way as they were before and still be linked to parent
- **parent issues** has a badge after the title, which shows how many children are resolved
- you can **use parent issues (nesting issues) for grouping them**: for example you can add an issue called "Features" (or "FEATURES") & add as many children you want to that issue => this is the way to group issues by features, milestones, any topic you want
- when all children issues are resolved (at all levels), the parent issue become resolved automatically
- when you add a child to any of resolved issues, they become reopened automatically
- when you reopen any child issue (which doesn't have any children), the resolved parent issue becomes reopened (and all of its resolved parents, if exist)
- you can not reopen resolved issue, if all of its children are resolved
- also, when you view the list, you can **show or hide resolved issues and issues rank**
- besides, you can **use Markdown Syntax to format & style your issues & projects descriptions** ([see the guide](/markdown-guide))
`;

export default function AppGuide() {
	return <MarkdownRenderer markdown={MARKDOWN} />;
}
