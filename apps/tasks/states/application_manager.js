/**
 * State to handle globally available actions
 *
 * @author Suvajit Gupta
 * License: Licened under MIT license (see license.js)
 */
/*globals CoreTasks Tasks Ki */

Tasks.ApplicationManagerState = Ki.State.extend({
      
  initialSubstate: 'readyForGlobalActions',
  
  // State indicating global action readiness
  readyForGlobalActions: Ki.State.design({

    showUsersSettingsPanel: function() {
      this.gotoState('showingUsersSettingsPanel');
    },
        
    setBackgroundBrown: function() {
      Tasks.mainPageHelper.setBackgroundBrown();
    },

    setBackgroundBlack: function() {
      Tasks.mainPageHelper.setBackgroundBlack();
    },

    setBackgroundGreen: function() {
      Tasks.mainPageHelper.setBackgroundGreen();
    },

    setBackgroundBlue: function() {
      Tasks.mainPageHelper.setBackgroundBlue();
    },

    toggleShowProjectsList: function() {
      Tasks.mainPageHelper.set('showProjectsList', !Tasks.mainPageHelper.get('showProjectsList'));
    },

    toggleAutoSave: function(){
      Tasks.set('autoSave', !Tasks.get('autoSave'));
    },

    toggleSendNotifications: function() {
      CoreTasks.set('sendNotifications', !CoreTasks.get('sendNotifications'));
    },

    showStatisticsPanel: function() {
      this.gotoState('showingStatisticsPanel');
    },

    showTextImportPanel: function() {
      this.gotoState('showingTextImportPanel');
    },

    showTextExportPanel: function() {
      this.gotoState('showingTextExportPanel');
    },

    showHTMLExportWindow: function() {
      Tasks.exportDataController.exportData('HTML');
    },

    showHelpWindow: function() {
      if(SC.platform.touch) window.location = Tasks.getHelpUrl();
      else window.open(Tasks.getBaseUrl() + '#help', '', 'width=1000,height=750,menubar=no,location=no,toolbar=no,directories=no,status=no');
    },

    logout: function() {
      var that = this;
      SC.AlertPane.warn("_Confirmation".loc(), "_LogoutConfirmation".loc(), null, "_Yes".loc(), "_No".loc(), null,
        SC.Object.create({
          alertPaneDidDismiss: function(pane, status) {
            if(status === SC.BUTTON1_STATUS) {
              if(CoreTasks.get('needsSave')) {
                SC.AlertPane.warn("_Confirmation".loc(), "_SaveConfirmation".loc(), null, "_Yes".loc(), "_No".loc(), null,
                  SC.Object.create({
                    alertPaneDidDismiss: function(pane, status) {
                      if(status === SC.BUTTON1_STATUS) {
                        CoreTasks.saveChanges();
                        Tasks.statechart.gotoState('shutDown');
                      }
                      else if(status === SC.BUTTON2_STATUS){
                        CoreTasks.set('needsSave', false);
                        Tasks.statechart.gotoState('shutDown');
                      }
                    }
                  })
                );
              }
              else {
                Tasks.statechart.gotoState('shutDown');
              }
            }
          }
        })
      );
    },
    
    save: function() {
      Tasks.saveChanges();
    },

    refresh: function() {
      Tasks.loadData();
    }

  }),
  
  // State to handle user info/settings
  showingUsersSettingsPanel: Ki.State.design({

    enterState: function() {
      var pane = Tasks.get('usersSettingsPane');
      Tasks.usersController.selectObject(CoreTasks.get('currentUser'));
      if(!CoreTasks.isCurrentUserAManager()) pane.setSmallSize();
      pane.append();
    },
    
    addUser: function() {

      if(!CoreTasks.getPath('permissions.canCreateUser')) {
        console.warn('You do not have permission to add a user');
        return null;
      }

      // Create and select new user (copy role of selected user if one).
      var userHash = SC.clone(CoreTasks.User.NEW_USER_HASH);
      userHash.name = userHash.name.loc();
      userHash.loginName = userHash.loginName.loc();
      var selectedUser = Tasks.usersController.getPath('selection.firstObject');
      if (selectedUser) userHash.role = selectedUser.get('role');
      var user = CoreTasks.createRecord(CoreTasks.User, userHash);
      Tasks.usersController.selectObject(user);
      Tasks.usersSettingsPane.focus();

    },

    deleteUser: function() {
      
      if(!CoreTasks.getPath('permissions.canDeleteUser')) {
        console.warn('You do not have permission to delete a user');
        return;
      }

      var sel = Tasks.usersController.get('selection');
      var len = sel? sel.length() : 0;
      if (len > 0) {

        // Confirm deletion operation
        SC.AlertPane.warn("_Confirmation".loc(), "_UserDeletionConfirmation".loc(), "_UserDeletionConsequences".loc(), "_Yes".loc(), "_No".loc(), null,
          SC.Object.create({
            alertPaneDidDismiss: function(pane, status) {
              if(status === SC.BUTTON1_STATUS) {
                var context = {};
                for (var i = 0; i < len; i++) {
                  // Get and delete each selected user.
                  var user = sel.nextObject(i, null, context);
                  user.destroy();
                }
                // Select the logged in user.
                Tasks.usersController.selectObject(CoreTasks.get('currentUser'));
              }
            }
          })
        );

      }
    },

    setRoleManager: function() {
      Tasks.usersController.set('role', CoreTasks.USER_ROLE_MANAGER);
    },

    setRoleDeveloper: function() {
      Tasks.usersController.set('role', CoreTasks.USER_ROLE_DEVELOPER);
    },

    setRoleTester: function() {
      Tasks.usersController.set('role', CoreTasks.USER_ROLE_TESTER);
    },

    setRoleGuest: function() {
      Tasks.usersController.set('role', CoreTasks.USER_ROLE_GUEST);
    },

    close: function() {
      this.gotoState('loggedIn.applicationManager.readyForGlobalActions');
    },

    exitState: function() {
      // Next 3 lines are to ensure any unmodified user is deleted before panel closes
      SC.RunLoop.begin();
      Tasks.usersController.selectObject(CoreTasks.get('currentUser'));
      SC.RunLoop.end();
      Tasks.get('usersSettingsPane').remove();
      if(Tasks.get('autoSave')) Tasks.saveChanges();
    }
    
  }),

  // State to show statistics
  showingStatisticsPanel: Ki.State.design({

    enterState: function() {
      Tasks.statisticsController.computeStatistics();
      Tasks.statisticsPane.append();
    },
    
    close: function() {
      this.gotoState('loggedIn.applicationManager.readyForGlobalActions');
    },

    exitState: function() {
      Tasks.get('statisticsPane').remove();
    }
    
  }),

  // State to manage text import
  showingTextImportPanel: Ki.State.design({

    enterState: function() {
      var pane = Tasks.getPath('importDataPane');
      pane.append();
      pane.focus();
    },
    
    importData: function() {
      Tasks.importDataController.importData();
    },

    close: function() {
      this.gotoState('loggedIn.applicationManager.readyForGlobalActions');
    },

    exitState: function() {
      Tasks.get('importDataPane').remove();
    }
    
  }),

  // State to manage text export
  showingTextExportPanel: Ki.State.design({

    enterState: function() {
      Tasks.exportDataController.exportData('Text');
    },
    
    close: function() {
      this.gotoState('loggedIn.applicationManager.readyForGlobalActions');
    },

    exitState: function() {
      Tasks.get('exportDataPane').remove();
    }
    
  })
    
});
