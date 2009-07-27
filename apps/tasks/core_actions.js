/**
 * A mixin that defines all of the "actions" that trigger state transitions.
 *
 * @author Sean Eidemiller
 * @author Suvajit GÏupta
 */
/*globals Tasks sc_require */
sc_require('core');

Tasks.mixin({
  
  /**
   * Authenticate user trying to log in to Tasks application.
   *
   * @param {String} user's login name.
   * @param {String} user's password.
   */
  authenticate: function(loginName, password) {
  // TODO: [SG] Should we be using parameters in any action functions?
    switch (this.state.a) {
      case 1:
        this.goState('a', 2);
        if (this._authenticateUser (loginName, password)) {
          this.authenticationSuccess();
        } 
        else {
          this.authenticationFailure();
        }
        break;
      default:
        this._logActionNotHandled('login', 'a', this.state.a);  
    }
  },
  
  /**
   * Implements user authentication logic.
   *
   * @param {String} user's login name.
   * @param {String} user's password.
   * @returns (Boolean) true if authentication succeeds, false otherwise
   */
  _authenticateUser: function(loginName, password) {
    // TODO: [SG] implement server-based authentication
    var store = CoreTasks.get('store');
    var users = store.findAll(CoreTasks.User);
    var len = users.get('length');
    for (var i = 0; i < len; i++) {
      var user = users.objectAt(i);
      if (loginName === user.get('loginName')) {
        CoreTasks.set('user', loginName);
        return true;
      }
    }
    return false;
  },
  
  /**
   * Called after successful login.
   */
  authenticationSuccess: function() {
    switch (this.state.a) {
      case 2:
        this.goState('a', 3);
        this._loadData();
        // TODO: [SE] install succsss/failure callbacks for this instead.
        this.dataLoadSuccess();
        break;
      default:
        this._logActionNotHandled('authenticationSuccess', 'a', this.state.a);  
    }
  },

  /**
   * Called after failed login.
   */
  authenticationFailure: function() {
    switch (this.state.a) {
      case 2:
        alert('Authentication failed');
        this.goState('a', 1);
        break;
      default:
        this._logActionNotHandled('authenticationFailure', 'a', this.state.a);  
    }
  },
  
  /**
   * Load all data used by Tasks views.
   */
  _loadData: function() {
    
    var store = CoreTasks.get('store');
    var projects = store.findAll(CoreTasks.Project);
    
    // Extract all unassigned tasks for the Inbox
    var tasks = store.findAll(CoreTasks.Task), task, unassigned = [];
    var taskCount = tasks.get('length');
    for (var i = 0; i < taskCount; i++) {
      task = tasks.objectAt(i);
      unassigned.push(task.get('id')); // add in all tasks
    }
    
    // Identify unassigned tasks to be stored in Inbox
    var projectCount = projects.get('length');
    for (i = 0; i < projectCount; i++) {
      var project = projects.objectAt(i);
      tasks = project.get('tasks');
      taskCount = tasks.get('length');
      for (var j = 0; j < taskCount; j++) {
        task = tasks.objectAt(j);
        var idx = unassigned.indexOf(task.get('id'));
        unassigned.splice(idx, 1); // remove assigned tasks
      }
    }

    // Create Inbox project to hold all unassigned tasks
    var inboxProject = store.createRecord(CoreTasks.Project,
      { id: 0, name: CoreTasks.INBOX_PROJECT_NAME, tasks: unassigned });

    // FIXME: [SC] Shouldn't have to call this - CJ investigating an API change to fix this.
    store.commitRecords();

    CoreTasks.set('inbox', inboxProject);
    projects.insertAt(0, inboxProject);
    this.get('projectsController').set('content', projects);
    
    var endUsers = store.findAll(Tasks.User);
    this.get('usersController').set('content',endUsers);
  },

  /**
   * Called after successful data load.
   */
  dataLoadSuccess: function() {
    switch (this.state.a) {
      case 3:
        this.goState('a', 4);
        break;
      default:
        this._logActionNotHandled('dataLoadSuccess', 'a', this.state.a);  
    }
  },
  
  /**
   * Called after failed data load.
   */
  dataLoadFailure: function() {
    switch (this.state.a) {
      case 3:
        // TODO: [SG] implement data load failure state transition & actions
        break;
      default:
        this._logActionNotHandled('dataLoadSuccess', 'a', this.state.a);  
    }
  },
  
  /**
   * Import data from external text file.
   */
  importData: function() {
    // TODO: [SG] implement view to prompt user for data to import (sample data hardcoded below for testing)
    var data = 
    '#A comment\n     \n' +
    '- An unallocated task [hacker] @Done\n' +
    'My Project\n' +
    '^ My first task {2} <enemy1> @Risky\n' +
    '| description line1\n' +
    '| description line2\n' +
    '- My second task $Bug [cyberpunk] <bigboss> %Failed\n' +
    'v My third task @Active $Feature {12-14} %Passed\n' +
    ' \t \n' +
    'Your Project {12}\n' +
    '- Your first task {2} [cyberpunk] <enemy1> @Done\n' +
    // FIXME: [SE] why is this not throwing an exception since it is not a valid value
    '- Your second task {4-5} [boo] <bigboss> @NoIdea\n';
    this._parseAndLoadData(data);
    this.get('assignmentsController').showAssignments();
  },
  
  /**
   * Parse data and create/load objects.
   *
   * @param {String} data to be parsed.
   */
  _parseAndLoadData: function(data) {
    
    var lines = data.split('\n');
    var store = CoreTasks.get('store');
    
    var currentProject = CoreTasks.get('inbox');
    for (var i = 0; i < lines.length; i++) {
      
      var line = lines[i];
      // console.log("Parsing line '" + line + "'\n");
      
      if (line.indexOf('#') === 0) { // a Comment
        var commentLine = line.slice(1);
        console.log ('Commment:\t' + commentLine);
      }
      else if (line.match(/^[\^\-v][ ]/)) { // a Task
        
        // extract priority based on bullet
        var taskPriority = CoreTasks.TASK_PRIORITY_MEDIUM;
        if (line.charAt(0) === '^') {
          taskPriority = CoreTasks.TASK_PRIORITY_HIGH;
        } else if (line.charAt(0) === 'v') {
          taskPriority = CoreTasks.TASK_PRIORITY_LOW;
        }
        var taskLine = line.slice(2);
        
        // extract task name
        var taskNameMatches = /([\w\s]+)[\s]*[\{<\[\$@%]/.exec(taskLine);
        var taskName = taskLine;
        if (taskNameMatches) {
          taskName = taskNameMatches[1];
        }
        var output = 'Task:\t\t' + taskName + ' of Priority: ' + taskPriority;
        
        // extract task effort
        var taskEffortMatches = /\{(\d+)\}|\{(\d+-\d+)\}/.exec(taskLine);
        var taskEffort = null;
        if(taskEffortMatches) {
          taskEffort = taskEffortMatches[1]? taskEffortMatches[1] : taskEffortMatches[2];
          output += ' of Effort: ' + taskEffort;
        }
               
        // extract task assignee
        var taskAssigneeMatches = /\[([\w]+)\]/.exec(taskLine);
        var taskAssigneeId = null;
        if(taskAssigneeMatches) {
          var taskAssignee = taskAssigneeMatches[1];
          output += ' of Assignee: ' + taskAssignee;
          var assigneeUser = this._getUser(taskAssignee);
          if (assigneeUser) {
            taskAssigneeId = assigneeUser.get('id');
          }
          else {
            console.log('Import Error - no such assignee: ' + taskAssignee);
            continue;
          }
        }
        
        // extract task submitter
        var taskSubmitterMatches = /\<([\w]+)\>/.exec(taskLine);
        var taskSubmitterId = null;
        if(taskSubmitterMatches) {
          var taskSubmitter = taskSubmitterMatches[1];
          output += ' of Submitter: ' + taskSubmitter;
          var submitterUser = this._getUser(taskSubmitter);
          if (taskSubmitter) {
            taskSubmitterId = submitterUser.get('id');
          }
          else {
            console.log('Import Error - no such submitter: ' + taskSubmitter);
            continue;
          }
        }
        
        // extract task type
        var taskTypeMatches = /\$([\w]+)/.exec(taskLine);
        var taskType = CoreTasks.TASK_TYPE_OTHER;
        if(taskTypeMatches) {
          taskType = taskTypeMatches[1];
          output += ' of Type: ' + taskType;
        }
        
        // extract task status
        var taskStatusMatches = /@([\w]+)/.exec(taskLine);
        var taskStatus = CoreTasks.TASK_STATUS_PLANNED;
        if(taskStatusMatches) {
          taskStatus = taskStatusMatches[1];
          output += ' of Status: ' + taskStatus;
        }
        
        // extract task validation
        var taskValidationMatches = /%([\w]+)/.exec(taskLine);
        var taskValidation = CoreTasks.TASK_VALIDATION_UNTESTED;
        if(taskValidationMatches) {
          taskValidation = taskValidationMatches[1];
          output += ' of Validation: ' + taskValidation;
        }
        
        console.log (output);
        var taskRecord = store.createRecord(CoreTasks.Task, {
          name: taskName,
          priority: taskPriority,
          effort: taskEffort,
          assignee: taskAssigneeId,
          submitter: taskSubmitterId,
          type: taskType,
          status: taskStatus,
          validation: taskValidation
        });
        if(!taskRecord) {
          console.log('Import Error - task creation failed');
          continue;
        }
        store.commitRecords();
        currentProject.get('tasks').pushObject(taskRecord);
        
      }
      else if (line.indexOf('| ') === 0) { // a Description
        var descriptionLine = line.slice(2);
        console.log ('Description:\t' + descriptionLine);
      }
      else if (line.search(/^\s*$/) === 0) { // a blank line
        console.log ('Blank Line:');
      }
      else { // a Project
        // extract timeLeft if provided
        var projectName = line, timeLeft = null;
        var res = line.match(/([\w\s]+)[\s*]\{(\d+)\}/);
        if(res) {
          projectName = res[1];
          timeLeft = res[2];
        }
        console.log ('Project:\t\t' + projectName);
        if (timeLeft) {
          console.log (' with TimeLeft: ' + timeLeft);
        }
        var projectRecord = store.createRecord(CoreTasks.Project, { name: projectName, timeLeft: timeLeft, tasks: [] });
        if(!projectRecord) {
          console.log('ERROR: project creation failed!');
          continue;
        }
        store.commitRecords();
        currentProject = projectRecord;
        this.get('projectsController').addObject(projectRecord);
      }
     }
  },
  
  /**
   * Get user record corresponding to specified loginName.
   *
   * @param {String} user's login name.
   * @returns {Object} user record, if macthing one exists, or null.
   */
  _getUser: function(loginName) {
    var users = CoreTasks.get('store').findAll(SC.Query.create({
      recordType: Tasks.User, 
      conditions: 'loginName = %@',
      parameters: [loginName]
    }));
    if(!users) return null;
    return users.objectAt(0);
  },
  
  /**
   * Export data to external text file.
   */
  exportData: function() {

    var val, task, user, data = "# Tasks data export at " + new Date().format('MMM dd, yyyy hh:mm:ssa') + '\n\n';
    
    var pc = this.get('projectsController');
    pc.forEach(function(rec){
          var tasks = rec.get('tasks');
          var len = tasks.get('length');
          if(rec.get('name') !== CoreTasks.INBOX_PROJECT_NAME) {
            data += rec.get('displayName') + '\n';
          }
          for (var i = 0; i < len; i++) {
            task = tasks.objectAt(i);
            switch(task.get('priority')) {
              case CoreTasks.TASK_PRIORITY_HIGH: val = '^'; break;
              case CoreTasks.TASK_PRIORITY_MEDIUM: val = '-'; break;
              case CoreTasks.TASK_PRIORITY_LOW: val = 'v'; break;
            }
            data += val + ' ';
            data += task.get('displayName');
            user = task.get('submitter');
            if (user) data += ' <' + user.get('name') + '>';
            user = task.get('assignee');
            if (user) data += ' [' + user.get('name') + ']';
            val = task.get('type');
            if(val !== CoreTasks.TASK_TYPE_OTHER)  data += ' $' + val;
            val = task.get('status');
            if(val !== CoreTasks.TASK_STATUS_PLANNED)  data += ' @' + val;
            val = task.get('validation');
            if(val !== CoreTasks.TASK_VALIDATION_UNTESTED)  data += ' %' + val;
            val = task.get('description');
            if(val) {
              var lines = val.split('\n');
              for (var j = 0; j < lines.length; j++) {
                data += '\n| ' + lines[j];
              }
            }
            data += '\n';
          }
          data += '\n';
      }, pc);
    
    console.log(data);
  },
  
  /**
   * Save modified data to persistent store.
   */
  saveData: function() {
    // TODO: [SG] implement project data saving
    this._notImplemented ('saveData');
  },
  
  /**
   * Launch User Manager dialog.
   */
  openUserManager: function() {
    // TODO: [SG] implement open user manager
    this._notImplemented ('openUserManager');
  },
  
  /**
   * Exit User Manager dialog.
   */
  closeUserManager: function() {
    // TODO: [SG] implement close user manager
    this._notImplemented ('closeUserManager');
  },
  
  /**
   * Launch new browser/tab to display online help.
   */
  showHelp: function() {
    // TODO: [SG] implement online help
    this._notImplemented ('showHelp');
  },
  
  /**
   * Handle application exiting request.
   */
  exit: function() {
    // TODO: [SG] implement logout
    this._notImplemented ('exit');
  },
  
  /**
   * Save all changes before exiting application.
   */
  saveAndExit: function() {
    // TODO: [SG] implement save & exit
    this._notImplemented ('saveAndExit');
  },
  
  /**
   * Exit application without saving changes.
   */
  exitNoSave: function() {
    // TODO: [SG] implement exit w/o save
    this._notImplemented ('exitNoSave');
  },
  
  /**
   * Add a new project and start editing it in projects master list.
   */
  addProject: function() {
    
    var pc = this.get('projectsController');
    var sel = pc.get('selection');
 
    var store = CoreTasks.get('store');
    var task = store.createRecord(CoreTasks.Project, { name: CoreTasks.NEW_PROJECT_NAME });
    store.commitRecords(); // FIXME: [SC] Shouldn't have to call this - CJ investigating an API change to fix this
    pc.addObject(task); // FIXME: [SC] Why do we have to manually add to the controller instead of store notifying?

    // TODO: [SG] add new project right after currently selected project, if one
    var listView = Tasks.getPath('mainPage.mainPane').get('projectsList');
    var idx = listView.length - 1;
    listView.select(idx);

    // Begin editing newly created item.
    var itemView = listView.itemViewForContentIndex(idx);
    
    // wait for run loop to complete before method is called
    itemView.beginEditing.invokeLater(itemView);

  },
  
  /**
   * Delete selected project in master projects list.
   */
  deleteProject: function() {
    
    var pc = this.get('projectsController');
    var sel = pc.get('selection');
    
    if (sel && sel.length() > 0) {
      var store = CoreTasks.get('store');

      // extract the project to be deleted
      var project = sel.firstObject();
      var id = project.get('id');
      store.destroyRecord(CoreTasks.Project, id);
      store.commitRecords(); // FIXME: [SC] Shouldn't have to call this - CJ investigating an API change to fix this
      pc.removeObject(project); // FIXME: [SC] Why do we have to manually remove from the controller instead of store notifying?
      Tasks.getPath('mainPage.mainPane').get('projectsList').select(0);
    }
  },
  
  /**
   * Add a new task to tasks detail list.
   */
  addTask: function() {

    // Create a new task with a default name
    // TODO: [SG] Get selected task and get its assignee, then create new task with same assignee

    var store = CoreTasks.get('store');
    var task = store.createRecord(CoreTasks.Task, { name: CoreTasks.NEW_TASK_NAME });
    store.commitRecords(); // FIXME: [SC] Shouldn't have to call this - CJ investigating an API change to fix this
    
    var ac = this.get('assignmentsController');
    ac.addObject(task); // FIXME: [SC] Why do we have to manually add to the controller instead of store notifying?
    ac.showAssignments();

    // TODO: [SG] Begin editing newly created item.

  },
  
  /**
   * Delete selected task in tasks detail list.
   */
  deleteTask: function() {
    
    var tc = this.get('tasksController');
    var sel = tc.get('selection');
    
    if (sel && sel.length() > 0) {
      var store = CoreTasks.get('store');

      //pass the record to be deleted
      var task = sel.firstObject();
      var id = task.get('id');
      store.destroyRecord(CoreTasks.Task, id);
      store.commitRecords(); // FIXME: [SC] Shouldn't have to call this - CJ investigating an API change to fix this

      tc.set('selection', null);
      var ac = this.get('assignmentsController');      
      ac.removeObject(task); // FIXME: [SC] Why do we have to manually remove from the controller instead of store notifying?
      ac.showAssignments();
      
      // TODO: [SG] Select task after deleted task, if any
      
    }
  },
  
  /**
   * Launch task editor dialog.
   */
  openTaskEditor: function() {
    // TODO: [SG] implement open Task editor
    this._notImplemented ('openTaskEditor');
  },
  
  /**
   * Exit task editor dialog.
   */
  closeTaskEditor: function() {
    // TODO: [SG] implement close Task editor
    this._notImplemented ('closeTaskEditor');
  },
  
  /**
   * Logs a message indicating that the given state isn't handled in the given action.
   *
   * @param {String} action The name of the action (ex. "logout").
   * @param {String} stateName The name of the state (ex. "a").
   * @param {Integer} stateNum The number of the sate (ex. "4").
   */
  _logActionNotHandled: function(action, stateName, stateNum) {
    console.log('Action not handled in state %@[%@]: %@'.fmt(stateName, stateNum, action));
  },
  
  /**
   * Temporary callback to handle missing functionality.
   *
   * @param (String) name of unimmplemented function
   */
  _notImplemented: function(functionName) {
    var prefix = '';
    if(functionName) {
      prefix = functionName + '(): ';
    }
    alert (prefix + 'Not yet implemented');
  }
  
});

// ============================================================================
// Tasks -- A simplified task manager built with the SproutCore framework
// Copyright (C) 2009 Suvajit Gupta
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along
// with this program.  If not, see <http://www.gnu.org/licenses/>.
// ============================================================================
