/**
 * A mixin that defines all of the "actions" that trigger state transitions.
 *
 * @author Sean Eidemiller
 * @author Suvajit GÏupta
 */
/*globals CoreTasks Tasks sc_require */
sc_require('core');

// FIXME: [SC] Shouldn't have to Store.commitRecords() after createRecord for Fixtures Data Source.
// FIXME: [SC] Shouldn't have to manually add/remove to/from controller instead of store notifying of changes.

Tasks.mixin({

  /**
   * Authenticate user trying to log in to Tasks application.
   *
   * @param {String} user's login name.
   * @param {String} user's password.
   */
  authenticate: function(loginName, password) {
    // TODO: [SG] Should we be using parameters in any action functions?
    // [SE] We don't in Orion but that doesn't mean it's bad, necessarily.
    switch (this.state.a) {
      case 1:
        this.goState('a', 2);

        // We'll need the login name later on, in _userLoadSuccess().
        CoreTasks.set('loginName', loginName);

        // Retrieve all users from the data source.
        CoreTasks.get('store').findAll(CoreTasks.User, {
          successCallback: this._userLoadSuccess.bind(this),
          failureCallback: this._userLoadFailure.bind(this)
        });

        break;

      default:
        this._logActionNotHandled('authenticate', 'a', this.state.a);  
    }
  },

  /**
   * Called after all users have been loaded from the data source.
   *
   * Now we can "authenticate" the user by searching for a matching loginName attribute in the list
   * of users in the store.
   */
  _userLoadSuccess: function() {
    console.log('All users loaded.');

    var loginName = CoreTasks.get('loginName');

    var users = CoreTasks.get('store').findAll(SC.Query.create({
      recordType: CoreTasks.User,
      conditions: "loginName = '" + loginName + "'"
    }));

    var authenticated = NO;

    if (users && users.length() > 0) {
      var user = users.objectAt(0);
      if (loginName === user.get('loginName')) {
        CoreTasks.set('user', loginName);
        authenticated = YES;
      }
    }

    if (authenticated) {
      // Set the content of the users controller.
      users = CoreTasks.get('store').findAll(SC.Query.create({
        recordType: CoreTasks.User,
        order: 'loginName ASC'
      }));

      this.get('usersController').set('content', users);
      // HACK: [SE] Set the objects array on the user drop down list (really ugly).
      // var selectField = this.getPath('mainPage.mainPane.topView.childViews.4');
      // selectField.set('objects', users);

      this._authenticationSuccess();
    } else {
      this._authenticationFailure();
    }
  },

  /**
   * Called if the request to the data source to load all users failed for some reason.
   */
  _userLoadFailure: function() {
    this._authenticationFailure();
  },

  /**
   * Called after successful login.
   */
  _authenticationSuccess: function() {
    switch (this.state.a) {
      case 2:
        this.goState('a', 3);

        // Load all data (projects and tasks) from the data source.
        this._loadData();
        break;

      default:
        this._logActionNotHandled('_authenticationSuccess', 'a', this.state.a);  
    }
  },

  /**
   * Called after failed login.
   */
  _authenticationFailure: function() {
    switch (this.state.a) {
      case 2:
        alert('Authentication failed.');
        this.goState('a', 1);
        break;
      default:
        this._logActionNotHandled('_authenticationFailure', 'a', this.state.a);  
    }
  },
  
  /**
   * Load all data (projects and tasks) used by Tasks views.
   */
  _loadData: function() {
    // Start by loading all tasks.
    CoreTasks.get('store').findAll(CoreTasks.Task, {
      successCallback: this._taskLoadSuccess.bind(this),
      failureCallback: this._dataLoadFailure.bind(this)
    });
  },

  /**
   * Called after all tasks have been loaded from the data source.
   */
  _taskLoadSuccess: function() {
    console.log('All tasks loaded.');

    // Now load all of the projects.
    CoreTasks.get('store').findAll(CoreTasks.Project, {
      successCallback: this._projectLoadSuccess.bind(this),
      failureCallback: this._dataLoadFailure.bind(this)
    });
  },

  /**
   * Called after all projects have been loaded from the data source.
   */
  _projectLoadSuccess: function(storeKeys) {
    console.log('All projects loaded.');

    var store = CoreTasks.get('store');
    var projects = store.recordArrayFromStoreKeys(storeKeys, CoreTasks.Project, store);
    
    // Get all tasks from the store and push them into the unallocated array.
    var tasks = store.findAll(SC.Query.create({ recordType: CoreTasks.Task }));
    var taskCount = tasks.get('length');
    var all = [];
    var unallocated = [];
    var unallocatedIds = [];

    for (var i = 0; i < taskCount; i++) {
      var t = tasks.objectAt(i);
      all.push(t);
      unallocated.push(t);
      unallocatedIds.push(t.get('id'));
    }

    // Create the AllTasks project to hold all tasks in the system.
    var allTasksProject = store.createRecord(CoreTasks.Project, {
      name: CoreTasks.ALL_TASKS_NAME
    });

    allTasksProject.set('tasks', all);
    CoreTasks.set('allTasks', allTasksProject);

    // Find tasks that belong to projects and remove from unallocated array.
    var projectCount = projects.get('length');

    for (i = 0; i < projectCount; i++) {
      var project = projects.objectAt(i);
      tasks = project.get('tasks');
      taskCount = tasks.get('length');
      for (var j = 0; j < taskCount; j++) {
        var idx = unallocatedIds.indexOf(tasks.objectAt(j).get('id'));

        // Remove task and task ID from corresponding arrays.
        unallocated.splice(idx, 1);
        unallocatedIds.splice(idx, 1);
      }
    }

    // Create the Inbox project with the unallocated tasks.
    var inboxProject = CoreTasks.createRecord(CoreTasks.Project, {
      id: 0,
      name: CoreTasks.INBOX_NAME
    });

    inboxProject.set('tasks', unallocated);
    CoreTasks.set('inbox', inboxProject);

    // Now push the All project to the beginning of the array.
    projects.unshiftObject(allTasksProject);

    // Push the Inbox project to the beginning of the projects array.
    projects.unshiftObject(inboxProject);

    // Set the contnent of the projects controller.
    this.get('projectsController').set('content', projects);

    this._dataLoadSuccess();
  },

  /**
   * Called after successful data load.
   */
  _dataLoadSuccess: function() {
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
  _dataLoadFailure: function() {
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
    Tasks.importDataController.openPanel();  
  },

  /**
   * Export data to external text file.
   */
  exportData: function() {
    var val, task, user;
    var data = "# Tasks data export at " + new Date().format('MMM dd, yyyy hh:mm:ssa') + '\n\n';
    var pc = this.get('projectsController');

    pc.forEach(function(rec){
          if (rec.get('name') === CoreTasks.ALL_TASKS_NAME) return;
          var tasks = rec.get('tasks');
          var len = tasks.get('length');
          if(rec.get('name') !== CoreTasks.INBOX_NAME) {
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
    var store = CoreTasks.get('store');

    // Remove the store keys of the Inbox and AllTasks projects from the changelog so that they're not
    // persisted to the server.
    var inboxKey = CoreTasks.getPath('inbox.storeKey');
    var allTasksKey = CoreTasks.getPath('allTasks.storeKey');
    var cl = store.changelog;

    if (cl) {
      if (cl.contains(inboxKey)) cl.remove(inboxKey);
      if (cl.contains(allTasksKey)) cl.remove(allTasksKey);
    }

    // Now commit all dirty records to the database.
    store.commitRecords();
  },
  
  /**
   * Launch User Manager dialog.
   */
  openUserManager: function() {
    // TODO: [SG] implement open user manager
    this._notImplemented('openUserManager');
  },
  
  /**
   * Exit User Manager dialog.
   */
  closeUserManager: function() {
    // TODO: [SG] implement close user manager
    this._notImplemented('closeUserManager');
  },
  
  /**
   * Launch new browser/tab to display online help.
   */
  showHelp: function() {
    // TODO: [SG] implement online help
    this._notImplemented('showHelp');
  },
  
  /**
   * Handle application exiting request.
   */
  exit: function() {
    // TODO: [SG] implement logout
    this._notImplemented('exit');
  },
  
  /**
   * Save all changes before exiting application.
   */
  saveAndExit: function() {
    // TODO: [SG] implement save & exit
    this._notImplemented('saveAndExit');
  },
  
  /**
   * Exit application without saving changes.
   */
  exitNoSave: function() {
    // TODO: [SG] implement exit w/o save
    this._notImplemented('exitNoSave');
  },
  
  /**
   * Add a new project and start editing it in projects master list.
   */
  addProject: function() {
    var project = CoreTasks.get('store').createRecord(
      CoreTasks.Project, { name: CoreTasks.NEW_PROJECT_NAME });

    this.getPath('projectsController.content').pushObject(project);

    // TODO: [SG] add new project right after currently selected project.
    var listView = Tasks.getPath('mainPage.mainPane.projectsList');
    var idx = listView.length - 1;
    listView.select(idx);

    // Begin editing newly created item.
    var itemView = listView.itemViewForContentIndex(idx);

    // Wait for run loop to complete before method is called.
    CoreTasks.invokeLater(itemView.beginEditing.bind(itemView));
  },
  
  /**
   * Delete selected project in master projects list.
   */
  deleteProject: function() {
    // Get the selected project.
    var pc = this.get('projectsController');
    var sel = pc.get('selection');
    
    if (sel && sel.length() > 0) {
      var project = sel.firstObject();

      // Select the first project in the list.
      // FIXME: [SE, SG] Do this without using SC.RunLoop.begin/end, if possible.
      SC.RunLoop.begin();
      Tasks.getPath('mainPage.mainPane.projectsList').select(0);
      SC.RunLoop.end();

      // Remove the project from the list and destroy.
      pc.removeObject(project);
      project.destroy();
    }
  },
  
  /**
   * Add a new task to tasks detail list.
   */
  addTask: function() {
    var task = CoreTasks.createRecord(CoreTasks.Task, CoreTasks.Task.NEW_TASK_HASH);
    // task.id = CoreTasks.generateId(); // For FIXTUREs

    // Get selected task and get its assignee so that we can set the same assignee on the
    // newly-created task.
    var tc = this.get('tasksController');
    var sel = tc.get('selection');

    if (sel && sel.length() > 0) {
      var selectedObject = sel.firstObject();
      if (SC.instanceOf(selectedObject, CoreTasks.Task)) {
        var taskAssignee = selectedObject.get('assignee');
        if (taskAssignee) {
          task.set('assignee', taskAssignee);
          console.log('Assignee: ' + taskAssignee.get('name'));
        }
      }
    }
    console.log('ADD TASK: ' + task);

    // We have to commit the task immediately because we need the ID before we add the task to the
    // selected project.
    var params = {
      successCallback: this._addTaskSuccess.bind(this),
      failureCallback: this._addTaskFailure.bind(this)
    };
    task.commitRecord(params);
  },

  _addTaskSuccess: function(storeKey) {
    // Get the task object from the store.
    var task = CoreTasks.get('store').materializeRecord(storeKey);

    // Add the new task to the currently-selected project.
    var project = this.getPath('projectsController.selection').firstObject();
    project.addTask(task);
    console.log('ADD TASK SUCCESS: ' + project.get('name'));

    // Add the task to the All Tasks project.
    CoreTasks.get('allTasks').addTask(task);

    // Refresh the assignments controller.
    var ac = this.get('assignmentsController');
    CoreTasks.invokeLater(ac.showAssignments.bind(ac));
    
    // TODO: [SG] Begin editing newly created item.
  },

  _addTaskFailure: function(storeKey) {
    // TODO: [SE] Implement addTaskFailure
  },
  
  /**
   * Delete selected task in tasks detail list.
   */
  deleteTask: function() {
    var tc = this.get('tasksController');
    var sel = tc.get('selection');
    if (sel && sel.length() > 0) {
      
      // Get the task and remove it from the project.
      var task = sel.firstObject();
      var project = this.getPath('projectsController.selection').firstObject();
      project.removeTask(task);

      // Remove the task from the All Tasks project.
      CoreTasks.get('allTasks').removeTask(task);

      // Now remove the task from the assignments controller.
      tc.set('selection', null);
      
      var ac = this.get('assignmentsController');      
      ac.removeObject(task);

      CoreTasks.invokeLater(ac.showAssignments());

      // Finally, destroy the task.
      task.destroy();

      // TODO: [SG] Select task after deleted task, if any.
    }
  },
  
  /**
   * Launch task editor dialog.
   */
  openTaskEditor: function() {
    // TODO: [SG] implement open Task editor
    this._notImplemented('openTaskEditor');
  },
  
  /**
   * Exit task editor dialog.
   */
  closeTaskEditor: function() {
    // TODO: [SG] implement close Task editor
    this._notImplemented('closeTaskEditor');
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
