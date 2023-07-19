# Issue Tracker

Track, manage, filter, sort, rank, nest & mix ordered & unordered issues in your dev projects & have an overview of all issues regardless of the project in 1 table.

## Where to try the app for free & future of *Issue Tracker*

Try the (free) app here: https://issue-tracker-react-ts.vercel.app/ *(I'm using it everyday)*.

You may also be interested in my other great app - [Linky Notes](https://vadimgierko.github.io/linky-notes/about) - which allows you to create, organize & filter your notes with one or more tags & style them with Markdown syntax *(I'm using it everyday too)*.

*Issue Tracker* & *Linky Notes* are stable & will be not extended in the future. Instead, they will be combined into one app & all of their features will be not only combined, but shared & extended.

So stay tuned! I will inform users of mentioned apps about the new app, when it will be published!

## How to work with the Issue Tracker to get the most of it?

- create projects for dev projects you're working on (or want to)
- you can add project's description & also project's features, pages & components - you will be able to assign your issues to them
- on project page you can work with project's issues in a table mode (where the order doesn't matter) & in list mode
- when you've noticed something to improve or fix, or add, or just got some ideas, questions etc., add it as an issue to the related project
- when adding the issue you can set priority, estimated time, difficulty, importance & also you can assign it to previously added to the project project's feature, page or component
- the first issue you've added is unordered by default, but even if all issues are unordered, you can:
  - track, manage, filter & sort **issues in particular dev projects or all issues regardless of the project**
  - **filter issues** by type, urgency, importance, estimated time, difficulty, status & project's features, pages & components issues are asigned to
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
- besides, you can **use Markdown Syntax to format & style your issues & projects descriptions** (the link to the Markdown Guide is available in navbar at the top of the page)

## Motivation

I'm working on this custom tracker, because:

- **I dont't want to use GitHub Issues** Features, because:
  - adding issues has impact on GitHub stats,
  - GitHub Issues is free for public repositories, but there is a cost for using it with private repositories (I'm using free version),
  - the lack of features I want
- **I also dont't want to use any existing tracker**.
- **I dont't want to integrate/ connect the tracker to GitHub & my projects** (for example I want to be able adding issues like common todos, which may not be done in the future & I don't want them to be on GitHub)
- **I want a few unique features**:
  - the ability to have a look on all issues from all the projects in one place (table) to be able to decide, what issue/s working on regardless of the project,
  - the ability to filter & sort those all collected issues by priorities, types etc.
  - the ability to add extra notes, descriptions (in Markdown), todos to issues & projects
  - the ability to add motivation, tech stack, milestones, feature list sections to projects (to be able to use it in project's README file & documentation) (partialy implemented)
  - the ability to hide those things from others (for example I'm used to include todo lists in README file, but because most of my projects are public, that is visible to anyone),
  - the ability to edit all of the data extensevly (if it was reflected in stats, that would be a nightmare) on any device, separately from GitHub.
- **I want this tracker to be something more than a common tracker**. This must be a system that gives more freedom in managing projects, not only programming ones. I don't want to only track bugs or list future features ideas, I want to add a lot of stuff, like notes with knowledge, information, thoughts etc. This will also help me offload my existing todo lists and notes in my apps that help me with project and knowledge management and are overflowing with lists and notes for development projects even though these tools don't meet my needs for that.
- Continuing the previous thread, **this project may eventually become the main extended system to manage all of my projects**.

## Tech Stack

- React
- TypeScript
- Firebase
- React Router
- React Context API
- React Bootstrap
- Bootstrap
- React Icons
- React Markdown