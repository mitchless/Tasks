// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string": "text".  HINT: For your key names, use the
// English string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//

/** @class

  @version 0.1
  @author Suvajit Gupta
*/
SC.stringsFor('English', {

  // Authentication strings
  "_LoginPrompt": "Please sign in",
  "_LoginName:": "Login Name:",
  "_Login": "Login",
  "_LoginError": "Login failed, please try again",
  "_LoginSince": "Logged in since ",
  "_Confirmation": "Confirmation",
  "_LogoutConfirmation": "Are you sure you want to log out from the application?",
  "_SaveConfirmation": "You have unsaved changes - save before logging out?",
  "_Yes": "Yes",
  "_No": "No",

  // Top Bar strings
  "_Tasks": "Tasks",
  "_Credits": "Credits: Suvajit Gupta, Sean Eidemiller, Josh Holt, and Matt Grantham",
  "_User:": "User: ",
  "_Role:": "Role:",
  "_SaveTooltip": "Save modified Tasks data to the server",
  "_RefreshTooltip": "Reload latest Tasks data from the server",
  "_Import": "Import",
  "_ImportTooltip": "Import Tasks data from a text format",
  "_Export": "Export",
  "_ExportTooltip": "Export Tasks data to a text or HTML format",
  "_ExportText": "Export Text...",
  "_ExportHTML": "Export HTML...",
  "_SettingsTooltip": "Administer Tasks users and settings",
  "_Help": "Online Help",
  "_HelpTooltip": "Open Tasks online help in a separate window",
  "_LogoutTooltip": "Sign out of Tasks and allow next user to sign in",
  "_Team": "Team",
  "_DisplayModeTooltip": "Choose 'TASKS' display mode to see details or 'TEAM' to see team summary",
  "_UserSelectionHint": "Assignees or <Submitters>",
  "_UserSelectionTooltip": "Use all or part of full/login name separated via commas or spaces; Use 'none' for unassigned",
  "_TasksSearchHint": "Task #IDs or search text",
  "_TasksSearchTooltip": "Separate #IDs by commas or spaces, otherwise search for text within task name or description (prefix with a caret to find items that don't match text)",
  
  // Popup Pane/Panel strings
  "_CreateMissingUsers": "Create Missing Users",
  "_CreateMissingUsersTooltip": "Automatically create new users for unknown assignees/submitters found during importing",
  "_ImportInstructions:": "Paste or type in text to be imported:<br>(see format on right)",
  "_FormatOnscreenHelpSoftwareMode": "Project Name {TimeLeft}<br>- Task Name {Effort} &lt;Submitter&gt; [Assignee] $Type @Status %Validation<br>| Description (1 or more lines following a Project or Task)",
  "_FormatOnscreenHelpTodoMode": "Project Name {TimeLeft}<br>- Task Name {Effort} &lt;Submitter&gt; [Assignee] @Status<br>| Description (1 or more lines following a Project or Task)",
  "_QuickFilters": "QUICK FILTERS",
  "_QuickFiltersTooltip": "Most commonly used filters",
  "_Troubled": "Troubled",
  "_TroubledTooltip": "Manage by Exception: what's risky or failed",
  "_Unfinished": "Unfinished",
  "_UnfinishedTooltip": "Deliver on Commitments: what's left to finish",
  "_Unvalidated": "Unvalidated",
  "_UnvalidatedTooltip": "Trust but Verify: what's left to validate",
  "_Verified": "Verified",
  "_VerifiedTooltip": "Ready for Primetime: what's done and passed",
  "_Showstoppers": "Showstoppers",
  "_ShowstoppersTooltip": "Are We There Yet: open high priority defects",
  "_All": "All",
  "_AllTooltip": "Full Plate: all tasks",
  "_Cancel": "Cancel",
  "_Close": "Close",
  "_Apply": "Apply",
  "_Project:": "Project: ",
  "_Add": "Add",
  "_Duplicate": "Duplicate",
  "_Delete": "Delete",
  "_ShowStatistics": "Statistics...",
  "_ShowStatisticsTooltip": "Show statistics about displayed tasks",
  "_Statistics": "Statistics",
  "_Summary:": "Summary: ",
  "_Created:": "Created: ",
  "_Updated:": "Updated: ",
  
  // Project strings
  "_AddProject": "Add Project",
  "_AddProjectTooltip": "Add a new project",
  "_DeleteProject": "Delete Project",
  "_DeleteProjectTooltip": "Delete selected project",
  "_ProjectDeletionConfirmation": "Are you sure you want to delete the selected projects?",
  "_TasksUnallocated": "Any tasks allocated to deleted projects will become unallocated.",
  "_NewProject": "New Project",
  "_System": "System",
  "_Projects": "Projects",
  "_AllTasks": "All Tasks",
  "_Unallocated": "Unallocated",
  "_UnallocatedTasks": "Unallocated Tasks",
  "_Has": "Has ",
  "_tasks": " tasks",
  "_ProjectTimeLeftTooltip": "Time left",
  "_description": "description",
  "_ClickToEdit": " - click to edit",
  "_TimeLeft:": "Time Left:",
  "_TimeLeftOnscreenHelp": "May be unspecified, a decimal like '0.25'; units 'd' or 'h'",
  
  // Task strings
  "_AddTask": "Add Task",
  "_AddTaskTooltip": "Add a new task, to the same project/assignee if there is a selected task",
  "_DuplicateTask": "Dup. Task",
  "_Copy": ": copy",
  "_CopyID/Name": "Copy ID/Name",
  "_CopyLinkLocation": "Copy Link Location",
  "_NewTask": "New Task",
  "_DeleteTask": "Delete Task",
  "_DeleteTaskTooltip": "Delete selected task",
  "_TaskDeletionConfirmation": "Are you sure you want to delete the selected tasks?",
  "_Filter": "Filter",
  "_FilterTooltip": "Filter tasks by type, priority, status, validation, effort specified, recently updated",
  "_DontCare": "Don't Care",
  "_EffortSpecified:": "Effort Specified:",
  "_EffortSpecifiedTooltip": "Show/hide tasks that have effort specified",
  "_RecentlyUpdated:": "Recently Updated:",
  "_RecentlyUpdatedFilterTooltip": "Show/hide recently updated tasks",
  "_Type": "TYPE",
  "_TypeTooltip": "Kind of task: user visible functionality, defect fix, or other",
  "_Feature": "Feature",
  "_Bug": "Bug",
  "_Other": "Other",
  "_Priority": "PRIORITY",
  "_PriorityTooltip": "Importance of task: must do, plan to do, do if you can",
  "_High": "High",
  "_Medium": "Medium",
  "_Low": "Low",
  "_Status": "STATUS",
  "_StatusTooltip": "Development status of task: show progress or obstacles",
  "_Planned": "Planned",
  "_Active": "Active",
  "_Done": "Done",
  "_finished": " tasks finished",
  "_total": ", total ",
  "_left": " tasks left",
  "_Risky": "Risky",
  "_Validation": "VALIDATION",
  "_ValidationTooltip": "Testing status of completed task - independent verification recommended",
  "_Untested": "Untested",
  "_Passed": "Passed",
  "_Failed": "Failed",
  "_Effort:": "Effort:",
  "_EffortOnscreenHelp": "May be unspecified,<br> a decimal like '0.25',<br> or a range like '2-3';<br> units 'd' or 'h'",
  "_Description:": "Description:",
  "_DescriptionHint": "Enter detailed notes...",
  "_SubmitterTooltip": "Submitted by ",
  "_RecentlyUpdatedTooltip": "This dot indicates an item created/updated recently (within the last day)",
  "_TaskEffortTooltip": "Effort",
  "_TaskIdTooltip": "Unique ID (dashes for unsaved tasks)",
  "_TaskValidationTooltip": "; Background color indicates validation status",
  
  // User/Assignee strings
  "_AddUser": "Add User",
  "_AddUserTooltip": "Add a new user",
  "_UserDeletionConfirmation": "Are you sure you want to delete the selected users?",
  "_TasksUnassigned": "Any tasks assigned to deleted users will become unassigned.",
  "_DeleteUser": "Delete User",
  "_DeleteUserTooltip": "Delete selected user",
  "_FullName:": "Full Name:",
  "_FirstLast": "Firstname Lastname",
  "_Initials": "Initials",
  "_Unassigned": "Unassigned",
  "_Manager": "Manager",
  "_Developer": "Developer",
  "_Tester": "Tester",
  "_Guest": "Guest",
  "_User": "User",
  "_Submitter:": "Submitter: ",
  "_Submitters:": "Submitters: ",
  "_Assignee:": "Assignee: ",
  "_Assignees:": "Assignees: ",
  "_AssigneeNotLoaded": "Not Loaded",
  "_AssigneeUnderLoaded": "Under Loaded",
  "_AssigneeProperlyLoaded": "Properly Loaded",
  "_AssigneeOverloaded": "Overloaded",
  "_NewUserSignup": "New User Signup",
  "_SignupPrompt": "Guest User Signup",
  "_Email:": "Email:",
  "_InvalidEmailAddress": "This email address",
  "_EmailAddress": "Your Email Address",
  "_Password:": "Password:",
  "_PasswordHint": "Your Password",
  "_Signup": "Signup",
  "_UserManager": "User Manager",
  "_RegisteredUsers": " registered users, ",
  
  // Status Bar strings
  "_selected": " selected",
  "_displayed": " displayed",
  "_projects": " projects and ",
  "_assignees": " assignees and ",
  "_redFlags": " red flags",
  "_RedFlags:": "Red Flags: ",
  "_AutoSave": "AutoSave",
  "_AutoSaveTooltip": "Check to automatially save changes to the server (otherwise you have to manually press the \"Save\" button)",
  "_SendNotifications": "Notifications",
  "_SendNotificationsTooltip": "Check to have server send Email notifications when tasks are created/updated/deleted",
  "_UsersLoaded": "Loaded users, ",
  "_TasksLoaded": "tasks, ",
  "_ProjectsLoaded": " projects at ",
  "_SaveMessage": "Data last saved "
    
});
