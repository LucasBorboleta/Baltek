"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget = { };
baltek.widget.__initModuleCalled = false;

baltek.widget.__initModule = function(){

    if ( baltek.widget.__initModuleCalled ) return;
    baltek.widget.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.utils.__initModule();

    // Init inner classes
    baltek.widget.Button.__initClass();
    baltek.widget.CounterWithDecimals.__initClass();
    baltek.widget.CounterWithSymbols.__initClass();
    baltek.widget.IFrame.__initClass();
    baltek.widget.Selector.__initClass();
    baltek.widget.Widget.__initClass();


};
///////////////////////////////////////////////////////////////////////////////
baltek.widget.getStylePropertyValue = function(elementId, propertyName){
    var element = document.getElementById(elementId);
    var style = window.getComputedStyle(element, null);
    var propertyValue = style.getPropertyValue(propertyName);
    return propertyValue;
};
///////////////////////////////////////////////////////////////////////////////
