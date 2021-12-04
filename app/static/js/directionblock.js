Blockly.Blocks['moveForward'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move Forward");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
    }
};


Blockly.JavaScript['moveForward'] = function (block) {
    gridSystem.moveForward();
    return 'moveForward()\n';
};


Blockly.Blocks['reverse'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("reverse");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
    }
};


Blockly.JavaScript['reverse'] = function (block) {
    gridSystem.reverse();
    return 'reverse()\n';
};


Blockly.Blocks['moveLeft'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move Left");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
    }
};


Blockly.JavaScript['moveLeft'] = function (block) {
    gridSystem.moveLeft();
    return 'moveLeft()\n';
};


Blockly.Blocks['moveRight'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move Right");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
    }
};


Blockly.JavaScript['moveRight'] = function (block) {
    gridSystem.moveRight();
    return 'moveRight()\n';
};


Blockly.Blocks['stop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("stop");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(230);
    }
};


Blockly.JavaScript['stop'] = function (block) {
    gridSystem.stop();
    return 'stop()\n';
};

// JavaScript source code
