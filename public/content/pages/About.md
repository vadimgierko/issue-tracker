Track, manage, filter, sort & rank issues in particular dev projects & have an overview of all issues regardless of the project in 1 table.

*NOTE: this app is still under development. New features can be implemented every day. But you can use it from now! If I will see new users, I will inform them about updates via the app.*

## How to work with the Issue Tracker to get the most of it?

- create separate projects for projects you're working on (or want to)
- when you've noticed something to improve or fix, or add, or just got some ideas, questions etc., add it as an issue to the related project
- when adding the issue you can set priority, estimated time, difficulty, importance & also you can assign it to previously added to the project project's feature, page or component
- the issue you've added is unordered by default, but at the moment you can:
  - track, manage, filter & sort **issues in particular dev projects or all issues regardless of the project**
  - **filter issues by** type, urgency, importance, estimated time, difficulty, status & project's features, pages & components issues are asigned to
  - **sort issues by** creation time, update time, urgency, importance, estimated time, difficulty & **rank** (issues rank is calculated automatically)
  - **have an overview, figure out & focus on the most important issues to work on at the moment** by combining filtering & sorting features & also by looking at the issues' ranking regardless of the project they belong to
- now, when you can figure out, what issues are worth to be working on and can start ordering them by converting them into ordered issues, so thanks to that you will have a partial plan
- you can view your issues in table mode (where the order doesn't matter) or in a list mode, where you can have ordered & unordered issues listed together & add issues as children to other issues & also you can not only nest them, but also you can mix them: you can add ordered to unordered & vice versa.

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
- React Router
- Firebase
- React Bootstrap
- Bootstrap
- React Icons
- React Markdown