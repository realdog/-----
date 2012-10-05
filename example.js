self.childTemplates[0].load(false);
self.childTemplates[1].load(false);

var button1 = {
    type: "imageButton",
    IFPC
        cursor: "images/cursor/1.png"
    ENDIF
    effect: "flash",
    name: "地图选择按钮1",
    border: "none",
    image: "images/1.png",
    pos: {
        auto: true,
        top: 100,
        left: 100
    },
    onTouchEnd: function(pos, ){
        system.user[0]["favorable"] -= 1;
        template.load(template.children[0], true, "flip");
    }
};

var button1 = {
    type: "imageButton",
    IFPC
        cursor: "images/cursor/1.png"
    ENDIF
    effect: "flash",
    name: "地图选择按钮2",
    border: "none",
    image: "images/2.png",
    pos: {
        auto: true,
        top: 100,
        left: 100
    },
    onTouchEnd: function(pos, ){
        system.user[0]["favorable"] -= 1;
        template.load(template.childTemplates[1], true, "flip");
    }
};

var template = {
    type: "map";
    name: "故事开始";
    button: [{
        template_child:[{
            type: "normal";
            name: "显示一个";
            template_child:["5"];
            question_options:[];
        }, {
            type: "normal";
            name: "显示一个";
            template_child:["5"];
            question_options:[];
        }];
        
    }]
    talk: ["第一段话","第二段话"];
    template_child:["1","2"];
    question_options:[""]
};

self.display("clip");
self.onDisplay(function(){
    if (system.Accelerate == true) {
        template.displayText(true);
    } else {
        template.displayText();
    }
    
    
});

self.onTouch(function(pos){

});