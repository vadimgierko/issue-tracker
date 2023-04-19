# Issue Tracker (under development)

This app allows you to track, manage & filter issues across your dev projects.

## Why this Issue Tracker is special?

Because:

- you can not only **view & manage issues in every particular project**,
- but also **you can have an overview of all issues regardless of the project, placed in one table** to focus on the most important things
- & **filter issues by status, type, urgency & importance**

## Motivation

I'm working on this custom tracker, because:

1. I dont't want to use GitHub Issues Features, because:
  - adding issues has impact on GitHub stats,
  - GitHub Issues is free for public repositories, but there is a cost for using it with private repositories (I'm using free version),
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

## Tech Stack

- React
- TypeScript
- React Router
- Firebase
- React Bootstrap
- Bootstrap
- React Icons
- React Markdown

## Todo

---

### Enable ordering by timestamps

### Enable adding tasks/ "issues" to issues

OR/ AND

### Group issues with milestones/ stages/ substatutes = WRAP STATUS SYSTEM INTO MILESTONES FRAMEWORK

Every project, feature & issue can have a sub status:

- initiation
- requirements gathering
- design (not only UI, but also logic, structure, data arch
- development
- integration (with the rest of the app)
- testing
- deployment

All that **substatuses can be used to indicate exact `in progress` status**.

This system also enable checking time, when substatuses was changes => `timeline` *(init at..., req gath at..., des at..., ..., deployed at...)*

### Extend Project data management & features

- [ ] add specified fields for motivation, features, tech stack, how to install, guides, details, readme, etc.
- [ ] add project status (milestone)

### About

- [ ] **update about page**
  - [ ] in future design about page same as linky notes about

### Good for UI/UX

- [ ] add **bootstrap alerts** for user, not the alerts which are blocking the browser
- [ ] add **cancel buttons**
- [ ] add **confirm before delete** anything
- [ ] add **icons with tooltips instead buttons**
- [ ] add **breadcrumbs**

### Maybe

- [ ] consider **rebuilding routing system** to nested /users/:userId/projects/:projectId/issues/:issueId etc.
  - [ ] use children routes & outlet
    - [ ] apply tabs in projects, issues, user page
  - [ ] only /users/:userId route will be private
    - [ ] redirect to protected page after sign in