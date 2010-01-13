// ==========================================================================
// Tasks.statisticsPane
// ==========================================================================
/*globals Tasks CoreTasks sc_require */
sc_require('core');


/** @static
    
  @extends SC.PanelPane
  @author Suvajit Gupta
  
  Filter Panel
  
*/

Tasks.statisticsPane = SC.PanelPane.create({  
  
  layout: { centerX: 0, centerY: 0, height: 260, width: 600 },
  classNames: ['statistics-pane'],
  
  contentView: SC.View.design({
    
    layout: { top: 0, left: 0, bottom: 0, right: 0 },
    childViews: 'titlebar projectNameLabel projectName statistics closeButton'.w(),
    
    titlebar: SC.View.design(SC.Border, {
      layout: { left: 10, right: 10, top: 10, height: 35 },
      classNames: ['toolbar'],
      childViews: [
        SC.LabelView.design({
          layout: { centerY: 0, height: 20, centerX: 0, width: 200 },
          value: "_Statistics".loc(),
          classNames: ['window-title']
        })
      ]
    }),
    
    projectNameLabel: SC.LabelView.design({
      layout: { top: 50, left: 10, height: 20, width: 50 },
      value: "_Project:".loc()
    }),
    
    projectName: SC.LabelView.design({
      layout: { top: 50, left: 60, height: 20, right: 10 },
      fontWeight: SC.BOLD_WEIGHT,
      valueBinding: 'Tasks.projectController*content.name'
    }),
    
    statistics: SC.LabelView.design({
      layout: { top: 75, left: 10, right: 10, bottom: 40 },
      escapeHTML: NO,
      valueBinding: 'Tasks.projectController.projectStatistics'
    }),
    
    closeButton: SC.ButtonView.design({
      layout: { width: 80, height: 30, right: 10, bottom: 8 },
      titleMinWidth: 0,
      keyEquivalent: 'return',
      isDefault: YES,
      theme: 'capsule',
      title: "_Close".loc(),
      target: 'Tasks.projectController',
      action: 'closePanel'
    })
    
  })
      
});