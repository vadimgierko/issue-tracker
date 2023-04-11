# Issue Tracker

This app allows you to manage issues across your dev projects. You can view & manage issues in every particular project.

You can also view all issues from all projects in one place (in the table at the moment) to have an overview of all issues regardless of the project, to be able to focus on the most important issues or to filter them by status, priority or project.

## Motivation

I'm working on this custom tracker, because:

1. I dont't want to use GitHub Issues Features, because:
  - that kind of activity has impact on GitHub stats,
  - the lack of features I want
1. I also dont't want to use any existing tracker.
1. I dont't want to integrate/ connect the tracker to GitHub & my projects (for example I want to be able adding issues like common todos, which may not be done in the future & I don't want them to be on GitHub)
1. I want a few unique features:
  - the ability to have a look on all issues from all the projects in one place (for example table) to be able to decide, what issue/s working on independently of the project,
  - the ability to filter those all collected issues by tags, priorities, types etc.
  - the ability to add extra notes, descriptions (in Markdown), todos to issues & projects
  - the ability to add motivation, tech stack, milestones, feature list sections to projects (to be able to use it in project's README file & documentation)
  - the ability to hide those things from others (for example I'm used to include todo lists in README file, but because most of my projects are public, that is visible to anyone),
  - the ability to edit all of the data extensevly (if it was reflected in stats, that would be a nightmare) on any device, separately from GitHub.
1. I want this tracker to be something more than a common tracker. This must be a system that gives more freedom in managing projects, not only programming ones. I don't want to only track bugs or list future features ideas, I want to add a lot of stuff, like notes with knowledge, information, thoughts etc. This will also help me offload my existing todo lists and notes in my apps that help me with project and knowledge management and are overflowing with lists and notes for development projects even though these tools don't meet my needs for that.
1. Continuing the previous thread, this project may eventually become the main extended system to manage all my projects.

And also I want to exercise in TypeScript and... try out my new template app ;-)

## Database structure

The app's data is stored in Firebase Firestore database.

The database is structured as follows: ...

## Tech Stack

- React
- TypeScript
- React Router
- Firebase
- React Bootstrap
- Bootstrap
- Local Storage
- React Icons
- React Markdown

## Todo

- [ ] is current license in Footer (borrowed from teplate) accurate for this project?
- [ ] maybe control resetting the state via App component?
- [ ] add bootstrap alerts for user, not the alerts which are blocking the browser
- [ ] add cancel buttons

- enable
  - auto adding date of opening an issue
  - markdown editor for issue description
  - editing an issue
  - closing an issue
  - storing issues history
  - filter issues by project, priority, type etc.