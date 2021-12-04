Blockly.Blocks['moveup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Up");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(150);
  }
};


Blockly.JavaScript['moveup'] = function(block) {
	gridSystem.moveUp();
	return 'moveUp()\n';
};


Blockly.Blocks['movedown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Down");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(150);
  }
};


Blockly.JavaScript['movedown'] = function(block) {

};


Blockly.Blocks['moveleft'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Left");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(150);
  }
};


Blockly.JavaScript['moveleft'] = function(block) {

};


Blockly.Blocks['moveright'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Right");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(150);
  }
};


Blockly.JavaScript['moveright'] = function(block) {

};


