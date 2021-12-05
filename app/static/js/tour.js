class Tour {
    inittooltip() {
        tour.addStep('step1', {
            title: "Step 1",
            text: "Select the available car in the dropdown selection to Pair at Instruction Panel. Then press 'PAIR' button to pair with the robotic car\n",
            hook: ".first",
            timer: 10000, // will show for 10 seconds before going to the next step
            onShow: function () {

            },
            onHide: function () {

            },
            buttons: [
                {
                    text: "Skip",
                    action: "tour.stop()"
                },
                {
                    text: "Next",
                    action: "tour.next()"
                }
            ],
            links: [

            ]
        });
        tour.addStep('step2', {
            title: "Step 2",
            text: "Select different levels. (Easy, Medium or Hard)",
            hook: ".second",
            timer: 10000, // will show for 10 seconds before going to the next step
            onShow: function () {

            },
            onHide: function () {

            },
            buttons: [
                {
                    text: "Previous",
                    action: "tour.previous()"
                },
                {
                    text: "Next",
                    action: "tour.next()"
                }
            ],
            links: [

            ]
        });
        tour.addStep('step3', {
            title: "Step 3",
            text: "Drag icons and set in the Control Panel. Click button EXECUTE to execute the commands",
            hook: ".third",
            timer: 10000, // will show for 10 seconds before going to the next step
            onHide: function () {

            },
            buttons: [
                {
                    text: "Previous",
                    action: "tour.previous()"
                },
                {
                    text: "Next",
                    action: "tour.next()"
                }
            ],
            links: [

            ]
        });
        tour.addStep('step4', {
            title: "Step 4", // will show for 10 seconds before going to the next step
            text: "Click on the 'History' button to view past commands that you sent to the car",
            hook: ".fourth",
            timer: 10000,
            onHide: function () {

            },
            buttons: [
                {
                    text: "Previous",
                    action: "tour.previous()"
                },
                {
                    text: "Next",
                    action: "tour.next()"
                }
            ],
            links: [

            ]
        });
        tour.addStep('step5', {
            title: "Step 5", // will show for 10 seconds before going to the next step
            text: "Click on the 'Leaderboard' button to view past record times by others!",
            hook: ".fifth",
            timer: 10000,
            onHide: function () {

            },
            buttons: [
                {
                    text: "Previous",
                    action: "tour.previous()"
                },
                {
                    text: "Finish",
                    action: "tour.stop()"
                }
            ],
            links: [

            ]
        });

    }
    constructor(name) {
        this.name = name;
        this.steps = [];
        this.box;

        this.titleBackground;
        this.background;
        this.accentColor;
        this.borderRadius;

        this.scroll = true;

    }

    style(info = {}) {
        if (info.titleBackground != undefined) {
            this.titleBackground = info.titleBackground;
        }
        if (info.background != undefined) {
            this.background = info.background;
        }
        if (info.accentColor != undefined) {
            this.accentColor = info.accentColor;
        }
        if (info.borderRadius != undefined) {
            this.borderRadius = info.borderRadius;
        }
    }

    addStep(name, info = {}) {
        var step = new Step(name, info.title, info.text, info.hook, info.timer, info.onShow, info.onHide, info.buttons, info.links);
        this.steps.push(step);
    }

    start() {
        var length = this.steps.length;
        this.show(0);
    }

    next() {
        this.remove();
        this.show(this.currentStep + 1);
    }

    previous() {
        this.remove();
        this.show(this.currentStep - 1);
    }

    stop() {
        this.remove();
        this.currentStep = 0;
    }

    pause() {
        this.remove();
    }

    resume() {
        this.show(this.currentStep);
    }

    remove() {
        clearTimeout(this.timeout);
        var box = this.box;
        var self = this;
        $(this.box).animate({
            marginTop: "50px",
            opacity: "0"
        }, 300, function () {
            box.remove();
        });

        if (this.steps[this.currentStep].onHide != undefined) {
            this.steps[this.currentStep].onHide();
        }
    }

    setScroll(value) {
        this.scroll = value;
    }

    getScroll() {
        return this.scroll;
    }

    show(stepIndex) {

        this.currentStep = stepIndex;
        var hook = this.steps[stepIndex].hook;

        if (this.steps[stepIndex].onShow != undefined) {
            this.steps[stepIndex].onShow();
        };

        $.fn.isInViewport = function () {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();

            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        if (!$(hook).isInViewport() && this.getScroll()) {
            $('html,body').animate({
                scrollTop: $(this.steps[stepIndex].hook).offset().top
            }, 'slow');
        };

        this.box = $("<div class='tour'></div>");
        this.box.attr("id", this.steps[stepIndex].name);
        var titleContainer = $("<div class='titleContainer'><div style='float: right;'><a href='#' style='text-decoration: none;' onClick= 'tour.stop()'>x</a></div></div>");
        var mainContainer = $("<div class='mainContainer'></div>");
        var actionContainer = $("<div class='actionContainer'></div>");
        var arrow = $("<div class='tour-arrow'></div>");

        $(hook).after(this.box);
        $(this.box).append(arrow);


        $(this.box).append(titleContainer);
        $(titleContainer).append("<h3>" + this.steps[stepIndex].title + "</h3>");
        $(this.box).append(mainContainer);
        $(mainContainer).append("<p>" + this.steps[stepIndex].text + "</p>");
        $(this.box).append(actionContainer);

        for (var i = 0; i < this.steps[stepIndex].links.length; i++) {
            $(actionContainer).append("<a href='" + this.steps[stepIndex].links[i].href + "'>" + this.steps[stepIndex].links[i].text + "</a>");
        }

        for (var i = 0; i < this.steps[stepIndex].buttons.length; i++) {
            $(actionContainer).append("<button onclick='" + this.steps[stepIndex].buttons[i].action + "'>" + this.steps[stepIndex].buttons[i].text + "</button>");
        }

        (this.titleBackground != undefined) && document.body.style.setProperty('--TourTitleBackground', this.titleBackground);

        (this.background != undefined) && document.body.style.setProperty('--TourBackground', this.background);

        (this.accentColor != undefined) && document.body.style.setProperty('--TourAccent', this.accentColor);

        (this.borderRadius != undefined) && document.body.style.setProperty('--TourBorderRadius', this.borderRadius);


        $(this.box).animate({
            marginTop: "15px",
            opacity: "1"
        }, 300);

        var self = this;
        if (this.steps[stepIndex].timer != undefined) {
            this.timeout = setTimeout(function () {
                self.next();
            }, this.steps[stepIndex].timer);
        }
    }

}

class Step {
    constructor(name, title, text, hook, timer, onShow, onHide, buttons, links) {
        this.name = name;
        this.title = title;
        this.text = text;
        this.hook = hook;
        this.timer = timer;
        this.onShow = onShow;
        this.onHide = onHide;
        this.buttons = buttons;
        this.links = links;
    }
}