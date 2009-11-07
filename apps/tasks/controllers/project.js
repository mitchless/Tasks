// ==========================================================================
// Tasks.projectController
// ==========================================================================
/*globals Tasks */

/** 

  This controller tracks the selected Project in the master list

  @extends SC.ObjectController
	@author Joshua Holt
	@author Suvajit Gupta
*/
Tasks.projectController = SC.ObjectController.create(
/** @scope Tasks.projectController.prototype */ {
  
  contentBinding: 'Tasks.projectsController.selection',
  contentBindingDefault: SC.Binding.single(),
  
  _contentDidChange: function() { // when a new project is selected
    Tasks.deselectTasks();
  }.observes('content')
  
});
