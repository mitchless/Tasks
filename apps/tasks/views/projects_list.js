// ==========================================================================
// Project: Tasks 
// ==========================================================================
/*globals Tasks sc_require*/
/** 

  Scrollable Projects List view.
  
  @extends SC.ScrollView
  @author Suvajit Gupta
*/
sc_require('views/list');
sc_require('views/group_item');
sc_require('views/project_item');

Tasks.ProjectsListView = SC.View.extend({
  
  classNames: ['transparent'],
  
  childViews: 'projectsList projectsBottomBar'.w(),

  projectsList: SC.ScrollView.design({
    
    classNames: ['projects-pane'],
    
    layout: Tasks.isMobile? { left: 5, top: 8, bottom: 40, right: 5 } : { left: 10, top: 8, bottom: 40, right: 5 },
    
    contentView: Tasks.ListView.design({

      classNames: ['transparent'],
      
      contentBinding: 'Tasks.sourcesController*arrangedObjects',
      selectionBinding: 'Tasks.projectsController.selection',
      contentValueKey: 'displayName',
      contentUnreadCountKey: Tasks.isMobile? null : 'displayCountDown',
      contentIconKey: 'icon',
      hasContentIcon: YES,
      localize: YES,
      rowHeight: Tasks.isMobile? 32 : 24,
      exampleView: Tasks.ProjectItemView,
      groupExampleView: Tasks.GroupItemView.design({
        render: function(context, firstTime) {
          context.addClass('transparent');
          sc_super();
        }
      }),
      allowDeselectAll: YES,
      isEditable: YES,
      canEditContent: YES,
      canReorderContent: YES,
      canDeleteContent: YES,
      destroyOnRemoval: YES,
      selectOnMouseDown: YES,
      delegate: Tasks.sourcesController,

      selectionEvent: null,
      mouseDown: function(event) {
        var ret = sc_super();
        if(event.which === 3) { // right click
          this.set('selectionEvent', event);
          this.invokeLast('popupContextMenu');
        }
        return ret;
      },
      popupContextMenu: function() {
        var items = Tasks.ProjectItemView.buildContextMenu();
        if(items.length > 0) {
          var pane = SCUI.ContextMenuPane.create({
            contentView: SC.View.design({}),
            layout: { width: 125, height: 0 },
            itemTitleKey: 'title',
            itemIconKey: 'icon',
            itemIsEnabledKey: 'isEnabled',
            itemTargetKey: 'target',
            itemActionKey: 'action',
            itemSeparatorKey: 'isSeparator',
            items: items
          });
          pane.popup(this, this.get('selectionEvent')); // pass in the mouse event so the pane can figure out where to put itself
        }
      },

      // Hotkeys - be careful to avoid conflicts with browser shortcuts!
      keyDown: function(event) {
        var ret = NO, commandCode = event.commandCodes();
        // console.log('DEBUG: hotkey "' + commandCode[0] + '" pressed');
        if(commandCode[0] === 'ctrl_left' && Tasks.mainPageHelper.get('showProjectsList')) {
          Tasks.mainPageHelper.set('showProjectsList', NO);
          ret = YES;
        }
        if (ret || Tasks.getPath('assignmentsController.displayMode') === Tasks.DISPLAY_MODE_TASKS && commandCode[0] === 'right') {
          Tasks.getPath('mainPage.tasksListView').becomeFirstResponder();
          if(Tasks.tasksController.getPath('selection.length') === 0) Tasks.tasksController.selectFirstTask();
          ret = YES;
        }
        else {
          ret = sc_super();
        }
        return ret;
      }

    })

  }),

  projectsBottomBar: SC.View.design({

    layout: { bottom: 0, height: 30 },

    classNames: ['bottom-bar transparent'],

    childViews: 'addProjectButton deleteProjectButton'.w(),

    addProjectButton: SC.ButtonView.design({
      layout: { centerY: 0, left: Tasks.isMobile? 5 : 15, height: 24, width: 32 },
      classNames: ['dark'],
      titleMinWidth: 0,
      icon: 'add-icon',
      toolTip: "_AddProjectTooltip".loc(),
      isVisibleBinding: 'CoreTasks.permissions.canCreateProject',
      action: 'addProject'
    }),
    deleteProjectButton: SC.ButtonView.design({
      layout: { centerY: 0, left: Tasks.isMobile? 47 : 57, height: 24, width: 32 },
      classNames: ['dark'],
      titleMinWidth: 0,
      icon: 'delete-icon',
      toolTip: "_DeleteProjectTooltip".loc(),
      isVisibleBinding: 'CoreTasks.permissions.canDeleteProject',
      isEnabledBinding: 'Tasks.projectsController.isDeletable',
      action: 'deleteProject'
    })

  })

});
