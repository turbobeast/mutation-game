var multiverse = {}, scientist_falling = {};

multiverse = (function () {
    var o = {};
    o.eventlistener = (function () {
        var handler;
    if (typeof document.addEventListener === 'function') {
            handler = function (evt, obj, listener) {
                obj.addEventListener(evt, listener, false);
            };
        } else if (typeof document.attachEvent === 'function') {
            handler = function (evt, obj, listener) {
                obj.attachEvent('on' + evt, listener);
            };
        } else {
            handler = function (evt, obj, listener) {
                obj['on' + evt] = listener;
            };
        }
        return handler;
    }());

    o.cancelevent =  function (e) {
        if (typeof e.stopPropagation === 'function') { e.stopPropagation(); }
        if (typeof e.cancelBubble !== 'undefined') { e.cancelBubble = true; }
        if (typeof e.preventDefault === 'function') { e.preventDefault(); }
        if (typeof e.returnValue !== false) { e.returnValue = false; }
    };
    return o;
}());

scientist_falling.initialize = function () {
    var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    canvaswidth = 480,
    canvasheight = 960,
    scale = 12,
    world,
    /* box 2d variables */
    B2Vec2 = Box2D.Common.Math.b2Vec2, /* vector */
    B2BodyDef = Box2D.Dynamics.b2BodyDef,/*  body definition */
    b2Body = Box2D.Dynamics.b2Body,/* body */
    B2FixtureDef = Box2D.Dynamics.b2FixtureDef,/* fixture definition */
    B2World = Box2D.Dynamics.b2World,/* world */
    B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,/* polygon shape */
    B2CircleShape = Box2D.Collision.Shapes.b2CircleShape,/* circle shape */
    B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    B2ContactListener = Box2D.Dynamics.b2ContactListener,
    animFrame,
    mainMenu = {},
    endScreen = {},
    splashScreen = {},
    multiChoice = {},
    successScreen = {},
    sharedScreen = {},
    mssuccessScreen = {},
    sharePopUp = {},
    msiPopUp = {},
    rviPopUp = {},
    diagram = {},
    jobsCta = {},
    scientist = [],
    amoebas = [],
    amoebaFix = new B2FixtureDef(),
    amoebaBod = new B2BodyDef(),
    DNAFix = new B2FixtureDef(),
    DNABod = new B2BodyDef(),
    tankImg = new Image(),
    bubbleImg = new Image(),
    totalAssets = 0,
    torso = {},
    amoebaModels = [],
    tinyAmoebas = [],
    tinyAmoebaModels = [],
    giantAmoebas = [],
    giantAmoebaModels = [],
    tetherX = 0,
    tetherY = 0,
    anchor = {},
    iPhone = false,
    sideways = false,
    body_images = [
        'head',
        'torso',
        'forearm_right',
        'forearm_left',
        'bicep',
        'calf_right',
        'calf_left',
        'thigh'],
    scientistBody = [],
    scientistLoaded = false,
    head = {},
    currentBodyImages = [],
    mutations = {},
    humanities = {},
    listofMutatedLimbs = [],
    percentageofHumanDNA = 1,
    percentageofMutantDNA = 0,
    currentGameLoopFunction = function(){},
    fallingLoop = function(){},
    menuLoop = function(){},
    madScienceLoop = function() {},
    currentResetFunction = function(){},
    brokenResetFunction = function(){},
    tryAgainFunction = function(){},
    tryMadScientistFunction = function () {},
    currentTouchStartFunction = function() {},
    currentTouchMoveFunction = function () {},
    currentAcceleromterFunction = function () {},
    selectGameState = function(){},
    oldState = '',
    ui = {},
    deathCounter = 0,
    countDownStarted = false,
    countDownStartTime,
    reset = {},
    DNApills = [],
    pillImage = new Image(),
    superPillImg = new Image(),
    powerUpImage = new Image(),
    ebolaImg = new Image(),
    fullBar = document.getElementById('full-bar'),
    emptyBar = document.getElementById('empty-bar'),
    mutationText = document.getElementById('mutation-text'),
    glarePanel = document.getElementById('glare'),
    //splash-screen
    beginexperiment_btn = document.getElementById('begin-experiment'),
    //end screen
    playagain_btn = document.getElementById('playagain'),
    share_btn = document.getElementById('share'),
    //multi-choice screen
    madscientist_btn = document.getElementById('mad-scientist-start'),
    startgame_btn = document.getElementById('game-start'),
    sharegame_btn = document.getElementById('share-game'),
    //success screen
    gotomulti_btn = document.getElementById('gotomultichoice'),
    //shared screen 
    gotosplash_btn = document.getElementById('gotogame'),
    //mscontinue_btn = document.getElementById('ms-continue'),
    closeShare_btn = document.getElementById('close-share'),
    shareShade = document.getElementById('share-shade'),
    twitter_btn = document.getElementById('twitter-share'),
    facebook_btn = document.getElementById('facebook-share'),
    ready_btn = document.getElementById('readytogo'),
    getfreaky_btn = document.getElementById('getfreaky'),
    oldDate = new Date(),
    manlyAlpha = 1,
    flickerCounter = 0,
    instructions = {},
    container = {
        x : 0,
        y : -2000
    },
    motor = {
        x : 0,
        y : -20,
        targetY : -20
    },
    fingerStartPos = 0,
    velocity_Y = 0,
    bubbles = [],
    lines= [],
    superbubble = {
        x : bitwise((-24) * 1.4),
        y : bitwise((-87) * 1.4),
        width : bitwise((60)*1.4),
        height : bitwise((70)*1.4)
    },
    supertank = {
        x : bitwise((-35) * 1.4),
        y : bitwise((-53) * 1.4),
        width : bitwise((30) * 1.4),
        height : bitwise((70) * 1.4 )
    },
    amoebaTimer,
    dnaTimer,
    shareOnTwitter,
    shareOnFacebook,
    cameraTarget = 0,
    targetRatio = 0.85,
    killerReleased = false,
    superPillReleased = false,
    powerUpReleased = false,
    tubeTop = new Image(),
    gameComplete = false,
    scientistXPos = 0,
    scientistYPos = 0,
    cameraStopPos = 0,
    amoebaDelay = 1000,
    leftWall = {},
    rightWall = {},
    resetTubeWalls = function(){},
    tubeResetFunction = function(){},
    selectMenuScreen = function(){},
    oldMenuScreen = null,
    currentSubScreen = {},
    gameURL = 'http://retrovirus.stonecanoe.ca/',
    queryString = '',
    ironMan = {},
    ironManPower = false,
    boggedDown = false,
    boggedDownTimer = null,
    grabDate = 0,
    grabbed = false,
    energyTextBox = document.getElementById('grip-text'),
    xPower = 0;

    shareOnTwitter = function() {
        var thelink = gameURL + queryString,
        twitterString = 'https://twitter.com/share' +
                        '?original_referer=https%3A%2F%2Fretrovirus.stonecanoe.ca' +
                        '&source=tweetbutton' +
                        '&text=' + 'Check out this mutant I made in Retro Virus' + 
                        '&url=' + thelink;
        window.open(twitterString);
        console.log('query string is ' + queryString);
    };

    shareOnFacebook = function () {
        var thelink = gameURL + queryString;
        FB.ui({
            method : 'feed',
            name : 'retrovirus',
            caption : 'I made this awesome mutant!',
            description : 'Keep Dr. Nano in one piece until he can escape the experiment.',
            link : thelink,
            picture : 'http://iphone.stonecanoe.ca/falling/images/falling_nano.png'
        }, function(response){
           // console.log('response: ' + response);
        } );
    };

    function bodyObject () {
        var bo = {
        'head' : [],
        'torso' : [],
        'bicep' : [],
        'calf_right' : [],
        'calf_left' : [],
        'thigh' : [],
        'forearm_right' : [],
        'forearm_left' : []};
        return bo;
    }

    function initializeIntro () {
        if(creatingAMonster === true) {
            mutateDiagramImage(javascriptMutationArray);
            selectMenuScreen('shared');
            creatingAMonster = false;
        } else {
            removeMenus();
            selectMenuScreen('splash');
        }
    }

    function cleanUpIntroGarbage() {
        /*introObj.alpha = 0;
        introObj.elem.style.marginLeft = '-3333px';
        shareLander.alpha = 1;
        shareLander.elem.style.marginLeft = '-3333px';*/
    }

    function initializeGame () {
        //outroObj.elem.style.marginLeft = "-9000px";
        mainMenu.setCallback(function(){ currentGameLoopFunction = fallingLoop; });
        removeMenus();

        cleanHouse();
        world = new B2World( new B2Vec2(0,0)/*gravity*/ , false/*allow sleep*/);
        setUpGameRagDoll();
        setUpDNA();
        //start random firing of DNA
        dnaTimer = setTimeout(releaseDNA, Math.random()* 4000 + 4000);
        setUpAmoebas();
        //start random firing of Amoebas
        amoebaTimer = setTimeout(createRandomAmoeba, 2000);

        amoebaDelay = 1000;
        
        motor.y = -25;

        setUpTube();
        initLines();

        currentTouchMoveFunction = steer;
        currentTouchStartFunction = setFingerPos;
        setUpCollisionHandler();
        targetRatio = 0.85;
        cameraTarget = canvasheight * targetRatio;
        //currentAcceleromterFunction = fancyGravity;
        tubeResetFunction = resetTubeWalls;

        document.getElementById('grip-inner').style.opacity = 1;
        document.getElementById('grip-border').style.opacity = 1;
        document.getElementById('grip-text').style.opacity = 1;
        document.getElementById('full-bar').style.opacity = 1;
        document.getElementById('empty-bar').style.opacity = 1;
        document.getElementById('mutation-text').style.opacity = 1;
       
        //currentGameLoopFunction = fallingLoop;
    }

    function initializeMadScientist () {
        //outroObj.elem.style.marginLeft = "-9000px";
        cleanHouse();
        //console.log('mad scientist');
        mainMenu.setCallback(function() { currentGameLoopFunction = madScienceLoop; });
        removeMenus();
        world = new B2World( new B2Vec2(0,0)/*gravity*/ , false/*allow sleep*/);
        setUpMadScientistRagDoll();
        setUpDNA();
        dnaTimer = setTimeout(fireDNA, Math.random()* 4000 + 4000);
        setUpMadAmoebas();
        currentAcceleromterFunction = fancyGravity;
        currentTouchStartFunction = dropAmoeba;
        currentTouchMoveFunction = brokenFunction;
        setUpMSCollisionHandler();
        targetRatio = 0.5;
        cameraTarget = canvasheight * targetRatio;
        document.getElementById('full-bar').style.opacity = 1;
        document.getElementById('empty-bar').style.opacity = 1;
        document.getElementById('mutation-text').style.opacity = 1;
        document.getElementById('grip-inner').style.opacity = 0;
        document.getElementById('grip-border').style.opacity = 0;
        document.getElementById('grip-text').style.opacity = 0;

       
        //currentGameLoopFunction = madScienceLoop;
    }

    function cleanUpGameGarbage() {
        currentTouchMoveFunction = brokenFunction;
        currentTouchStartFunction = brokenFunction;
        tubeResetFunction = brokenFunction;

        gameComplete = false;
        clearTimeout(amoebaTimer);
        clearTimeout(dnaTimer);
        ironManPower = false;
        killerReleased = false;
        superPillReleased = false;
        powerUpReleased = false;
        gameComplete = false;
        document.getElementById('full-bar').style.opacity = 0;
        document.getElementById('empty-bar').style.opacity = 0;
        document.getElementById('mutation-text').style.opacity = 0;
        document.getElementById('grip-inner').style.opacity = 0;
        document.getElementById('grip-border').style.opacity = 0;
        document.getElementById('grip-text').style.opacity = 0;
        context.clearRect(0,0,canvaswidth,canvasheight);
    }

    function cleanUpMadScientistGarbage() {
        currentAcceleromterFunction = brokenFunction;
        currentTouchStartFunction = brokenFunction;
        clearTimeout(dnaTimer);
        context.clearRect(0,0,canvaswidth,canvasheight);
        document.getElementById('full-bar').style.opacity = 0;
        document.getElementById('empty-bar').style.opacity = 0;
        document.getElementById('mutation-text').style.opacity = 0;
    }

    function cleanUpEndGarbage () {
       /// console.log('clean up end garbage');
        currentResetFunction = brokenResetFunction;
        //outroObj.targetAlpha = 0;
    }

    function convertMutationToSecretNumber(mutationName) {
        var secretNumber = 0,
        mutationsArray = ['chicken','skeleton','bodybuilder','burlesque','octopus','duck','vanillaice','poop','cyclops','macaroni','computer','ninja','meta','girl','lumberjack','robot','bagel','scientist'];
        secretNumber = mutationsArray.indexOf(mutationName);
        return secretNumber;
    }

    function convertLimbToPrefix (limbName) {
        var prefix = 'h';
        switch (limbName) {
            case 'head':
                prefix = 'h';
            break;
            case 'torso':
                prefix = 't';
            break;
            case 'thigh':
                prefix = 'th';
            break;
            case 'bicep':
                prefix = 'b';
            break;
            case 'calf_left' :
                prefix = 'cl';
            break;
            case 'calf_right':
                prefix = 'cr';
            break;
            case 'forearm_left':
                prefix = 'fl';
            break;
            case 'forearm_right':
                prefix = 'fr';
            break;

        }
        return prefix;
    }

    function mutateDiagramImage (mutantArray) {
        var i = 0,
        currentMutation = '',
        mages = document.getElementsByTagName('img');

        for(i = 0; i < body_images.length; i += 1) {
            //currentMutation = currentBodyImages[body_images[i]].name;
            currentMutation = mutantArray[body_images[i]].name;
            for(g = 0; g < mages.length; g += 1) {
                if(mages[g].className === body_images[i]) {
                    mages[g].src = 'images/' + currentMutation + '_' + body_images[i] + '.png';
                }
            }
        }
    }

    function initializeEnd (oState) {
        var titleMSG = '',
        lowerMSG = '',
        titleContainer = document.getElementById('end-title'),
        lowerContainer = document.getElementById('top-message'),
        i = 0;

        queryString = '?mq=';

        for(i = 0; i < body_images.length; i += 1){
            queryString += convertLimbToPrefix(body_images[i]);
            queryString += '=';
            queryString += convertMutationToSecretNumber(currentBodyImages[body_images[i]].name);
            if(i < (body_images.length-1)) {
                queryString += '*';
            }
        }

        mutateDiagramImage(currentBodyImages);

        /*textMSG = textMSG.slice(0, (textMSG.length-1));
        textMSG += ' abomination!';*/

       // console.log('percentage of human DNA is ' + percentageofHumanDNA);
        if(oState !== 'mad-scientist') {
            if(Math.round(percentageofHumanDNA* 100) == 0) {
               // console.log('total failure');
                selectMenuScreen('end');
                titleMSG = "Fail!";
                lowerMSG = "Dr. Nano has mutated beyond recognition. His wife will be upset... Experiment again.";
                titleContainer.innerHTML = titleMSG;
                lowerContainer.innerHTML = lowerMSG;
            } else if (Math.round(percentageofHumanDNA* 100) === 100) {
               // console.log('success');
                selectMenuScreen('success');
            } else {
               // console.log('partial failure');
                titleMSG = "So close!";
                lowerMSG = "Dr. Nano escaped total mutation but he's not quite right. Try to save his human form.";
                titleContainer.innerHTML = titleMSG;
                lowerContainer.innerHTML = lowerMSG;
                selectMenuScreen('end');
            }
           
        } else {
            selectMenuScreen('ms-success');
        }
        
    }

    selectMenuScreen = function (screen) {

        switch (oldMenuScreen) {
            case 'end':
            break;
            case 'splash':
                splashScreen.targetAlpha = 0;
                splashScreen.elem.style.visibility = 'hidden';
            break;
            case 'multi':
            break;
            case 'shared':
                sharedScreen.targetAlpha = 0;
                sharedScreen.elem.style.visibility = 'hidden';
            break;
            case 'success':
            break;
            case null:
            break;
        }
        switch(screen) {
            case 'end':
            //console.log('end');
                endScreen.targetAlpha = 1;
                endScreen.elem.style.left = 0;
                endScreen.elem.style.visibility = "visible";
                currentSubScreen = endScreen;
                diagram.targetAlpha = 1;
                diagram.elem.style.visibility = "visible";
                jobsCta.targetAlpha = 1;
                jobsCta.elem.style.visibility = "visible";
            break;
            case 'splash':
                splashScreen.targetAlpha = 1;
                splashScreen.elem.style.visibility = "visible";
                currentSubScreen = splashScreen;
            break;
            case 'multi':
                multiChoice.targetAlpha = 1;
                multiChoice.elem.style.visibility = "visible";
                currentSubScreen = multiChoice;
                jobsCta.targetAlpha = 1;
                jobsCta.elem.style.visibility = "visible";
            break;
            case 'shared':
                splashScreen.targetAlpha = 0;
                splashScreen.elem.style.visibility = "hidden";
                sharedScreen.targetAlpha = 1;
                sharedScreen.elem.style.visibility = 'visible';
                diagram.targetAlpha = 1;
                diagram.elem.style.visibility = "visible";
                currentSubScreen = sharedScreen;
            break;
            case 'success':
           // console.log('success');
                successScreen.targetAlpha = 1;
                successScreen.elem.style.visibility = "visible";
                currentSubScreen = successScreen;
            break;
            case 'ms-success':
                diagram.targetAlpha = 1;
                diagram.elem.style.visibility = "visible";
                mssuccessScreen.targetAlpha = 1;
                mssuccessScreen.elem.style.visibility = "visible";
                jobsCta.targetAlpha = 1;
                jobsCta.elem.style.visibility = "visible";
                currentSubScreen = mssuccessScreen;
            break;
        }
        mainMenu.targetAlpha = 1;
        mainMenu.elem.style.visibility = "visible";
        oldMenuScreen = screen;
    };

    selectGameState = function (state) {
        switch (oldState) {
            case 'intro':
                cleanUpIntroGarbage();
            break;
            case 'game':
                cleanUpGameGarbage();
            break;
            case 'end':
                cleanUpEndGarbage();
            break;
            case 'mad-scientist':
                cleanUpMadScientistGarbage();
            break;
        }

        switch(state) {
            case 'intro':
                initializeIntro();
                currentGameLoopFunction = menuLoop;
            break;
            case 'game':
                initializeGame();
            break;
            case 'end':
                initializeEnd(oldState);
                currentGameLoopFunction = menuLoop;
            break;
            case 'mad-scientist':
                initializeMadScientist();
            break;
        }

        oldState = state;
    };

    ui = (function () {
        var ux = {},
            currentMeterLevel = 1,
            countDownFontSize,
            countDownAlpha,
            oldCount = 222;

            ux.meter = {
                textfield : {
                    text : '',
                    x : 15,
                    y : canvasheight - 100,
                    style : 'rgba(240,244,120,1)'
                },
                redbar : { style : 'rgba(255,10,10,1)', width : (canvaswidth * 0.4), height : 40, x : 15, y : (canvasheight - 80) },
                greenbar : {
                    style : 'rgba(240,244,120,1)',
                    width : 0,
                    height: 40,
                    x : 15,
                    y : (canvasheight - 80)
                },
                    greybar : {
                    style : 'rgba(10,10,10,0.6)',
                    width : (canvaswidth * 0.4),
                    height : 40,
                    x : 15,
                    y : (canvasheight - 80)
                }
            };

            ux.grabMeter = {
                elem : document.getElementById('grip-inner'),
                textElem : document.getElementById('grip-text'),
                backBar : document.getElementById('grip-border'),
                infoTxt : "ENERGY",
                targetWidth : 309,
                width : 309,
                toggle : 0,
                currentOpacity : 1
            };

            ux.countdown = { text : '', fontSize : 0, x : 0, y : 0, alpha : 1 };

            ux.update = function () {
                var meterWidth = 309,
                targetMeterLevel = meterWidth * percentageofMutantDNA;
                currentMeterLevel += (targetMeterLevel - currentMeterLevel) * 0.1;
                ux.meter.greenbar.width = currentMeterLevel;
                if (percentageofMutantDNA > 0 ) {
                    if(deathCounter !== oldCount) {
                        countDownFontSize = 524;
                        countDownAlpha = 1;
                    } else {
                        countDownFontSize -= 12;

                        if(countDownAlpha > 0 ) {
                            countDownAlpha -= 0.02;
                        } else {
                            countDownAlpha = 0;
                        }
                    }

                    ux.countdown.fontSize = countDownFontSize;
                    ux.countdown.alpha = countDownAlpha;
                    ux.countdown.text = (6 - deathCounter).toString();
                    ux.countdown.x = (canvaswidth * 0.5);
                    ux.countdown.y = (canvasheight * 0.5);
                }
                    oldCount = deathCounter;

                if(boggedDown === false) {
                    if(grabbed === true) {
                        ux.grabMeter.targetWidth = 309 -  Math.floor(( ( new Date() - grabDate ) / 1000) * 309);
                        //console.log('time is ' + ((new Date() - grabDate) / 1000 ));
                    } else {
                         ux.grabMeter.targetWidth = 309;
                    }
                    ux.grabMeter.width += (ux.grabMeter.targetWidth - ux.grabMeter.width ) * 0.2;

                    if(ux.grabMeter.width < 5) {
                        ux.grabMeter.width = 0;
                    }

                    ux.grabMeter.infoTxt = "ENERGY";
                    ux.grabMeter.toggle = 0;
                    //ux.grabMeter.textElem.style.opacity = 1;
                    //ux.grabMeter.backBar.style.opacity = 1;
                } else {

                    ux.grabMeter.toggle += 1;
                    if( ux.grabMeter.toggle % 4 === 0) {
                        if(ux.grabMeter.currentOpacity === 0) {
                            ux.grabMeter.currentOpacity = 1;
                        } else {
                            ux.grabMeter.currentOpacity = 0;
                        }
                    } 
                   
                    ux.grabMeter.width = 0;
                    ux.grabMeter.infoTxt = "LET GO TO REFILL";
                }
               
                //ux.grabMeter.width = Math.floor( (new Date() - grabDate ) / 1000) * 309;
                //deathCounter = Math.floor(  (new Date() - countDownStartTime) / 1000 );
            };

            ux.render = function () {
                var gren = ux.meter.greenbar,
                cd = ux.countdown;
                fullBar.style.width = gren.width + 'px';

                //mutationText.innerHTML = "MUTATION LEVEL " + (percentageofMutantDNA* 100) + '%';

                if (percentageofHumanDNA < 0.1 ) {
                    //countdown
                    if(deathCounter > 0 && deathCounter < 6) {
                        context.save();
                        context.strokeStyle = "rgba(39,59,66," + cd.alpha + ")";
                        context.lineWidth = cd.fontSize * 0.03;
                        context.textAlign = 'center';
                        context.beginPath();

                        if(cd.fontSize <= 0 ) { cd.fontSize = 1; } //safety net */

                        context.arc(cd.x ,cd.y -(cd.fontSize* 0.25) , cd.fontSize * 0.8, 0, (Math.PI * 4) - ((Math.PI * 4) * cd.alpha ) , false);
                        context.stroke();

                        context.font = "bold " + cd.fontSize + "px arial";
                        context.fillStyle = "rgba(39,59,66," + cd.alpha + ")";
                        context.fillText(cd.text, cd.x, cd.y);

                        context.textAlign = 'right';

                        context.restore();
                        }
                    }

                };

                ux.nonMadScienceRender = function (){ 

                    if(boggedDown === false ) {
                        ux.grabMeter.textElem.style.opacity = 1;
                        ux.grabMeter.backBar.style.opacity = 1;
                        ux.grabMeter.currentOpacity = 1;
                    }
                    ux.grabMeter.backBar.style.opacity = ux.grabMeter.currentOpacity;
                    ux.grabMeter.elem.style.width = ux.grabMeter.width + 'px';
                    ux.grabMeter.textElem.innerHTML = ux.grabMeter.infoTxt;
                };

            return ux;
    }());

    instructions = (function(){

        var inc = 0.13,
        counter = 1,
        circle = {};

        structions = {};

        circle = {
            rad : 100,
            x : 130,
            y : 600
        };

        textfield = {
            text : 'TOUCH',
            text2 : 'SCREEN TO ADD',
            text3 : 'GERMS',
            x : 400,
            y : 600
        };

        structions.update = function () {
            counter += inc;
            circle.y = canvasheight * 0.7;
            circle.rad = 120 + Math.sin(counter) * 14;
            textfield.y = (canvasheight * 0.7);
            circle.x = canvaswidth * 0.5;
            textfield.x = canvaswidth * 0.5;
            //textfield.x = 230 + Math.sin(counter) * 20;
        };

        structions.render = function () {
            //context.strokeStyle = "rgb(39,59,66)";
            context.strokeStyle = 'rgba(255,255,255,0.4)';
            context.lineWidth = 8;
            context.beginPath();
            context.arc(circle.x, circle.y, circle.rad, 0, Math.PI * 2, false);
            context.stroke();

            context.font = "bold 22px arial";
            context.fillStyle = "rgb(255,255,255)";
            context.textAlign = 'center';
            context.fillText(textfield.text, textfield.x, textfield.y -30);
            context.fillText(textfield.text2, textfield.x, textfield.y + 10);
            context.fillText(textfield.text3, textfield.x, textfield.y + 50);
        };

        return structions;
    }());

    function bitwise (x) { return (x + 0.5) | 0; }

    function domObject (id) {
        var cBack = null,
        DO = {
            elem : document.getElementById(id),
            x : 0,
            y : 0,
            targetX : 0,
            targetY : 0,
            alpha : 1,
            targetAlpha : 0
        };

        DO.update = function () {
            if( Math.abs( this.targetAlpha - this.alpha) < 0.1 ) {
                this.alpha = this.targetAlpha;
                if(cBack !== null ) {
                    cBack();
                    cBack = null;
                }
            } else {
                this.alpha += (this.targetAlpha - this.alpha) * 0.24;
            }
        };

        DO.render = function () {
            this.elem.style.opacity = this.alpha;
        };

        DO.setCallback = function (f) {
            cBack = f;
        };
        return DO;
    }

    function objectCreator (mage, nam) {
        var obj = {};
        obj.img = mage;
        obj.name = nam;
        return obj;
    }

    function superCreator(arr, prefix, callback) {
        var nameArray = arr,
        b = 0,
        superArray = [],
        incrementLoadCount,
        loadedSoFar = 0,
        numberOfAssets = nameArray.length,
        src,
        obj = {}
        mage = {};

        incrementLoadCount = function(evt) {
            var e = evt || window.event;
            multiverse.cancelevent(e);
            loadedSoFar += 1;
            if(loadedSoFar === numberOfAssets) {
                callback();
                callback = null;
            }
        };

        for(b = 0; b < nameArray.length; b+= 1) {
            mage = new Image();
            multiverse.eventlistener('load', mage, incrementLoadCount);
            src = 'images/' + prefix + '_' + nameArray[b]+ '.png';
            mage.src = src;
            obj = objectCreator(mage, prefix);
            obj.isHuman = true;
            superArray[nameArray[b]] = obj;
        }
        return superArray;
    }

    function loadManager( img , src, nam) {
        var naim = nam || null;
        totalAssets += 1;
        img.src = src;
        if(naim !== null) {
            img.name = naim;
        }
    }

    function drFrankenstein (d,f,cX,cY) {
        var s = scale,
        centX = cX  || canvaswidth * 0.5,
        centY = cY || canvasheight * 0.5,
        def = d,
        fix = f;
        return function (xPos, yPos, wid, hite, nam) {
            var bodyPart = {};
            fix.shape = new B2PolygonShape();
            fix.shape.SetAsBox(wid/s, hite/s);
    
            def.position.x = (centX + xPos) / s;
            def.position.y = (centY + yPos) / s;

            bodyPart.body = world.CreateBody(def);
            bodyPart.fixture = bodyPart.body.CreateFixture(fix);
            bodyPart.width = wid;
            bodyPart.height = hite;
            bodyPart.scaledWidth = bitwise(wid * 1.4);
            bodyPart.scaledHeight = bitwise(hite * 1.4);
            bodyPart.name = nam;
            bodyPart.alpha = 1;
            bodyPart.isMan = true;
            bodyPart.body.parentObj = bodyPart;
            scientist.push(bodyPart);
            return bodyPart;
        };
    }
 
    function jointFusion (d,cX,cY) {
        var def = d,
        centX = cX,
        centY = cY,
        s = scale;
        return function (limb1, limb2, xPos, yPos, la, ua) {
            var joint = {};
            def.enableLimit = true;
            def.lowerAngle = la;
            def.upperAngle = ua;
            def.referenceAngle = 0;
            def.Initialize(limb1, limb2, new B2Vec2( (centX + xPos)/s, (centY + yPos)/s ) );
            joint = world.CreateJoint(def);
            return joint;
        };
    }

    function tether(bod, xPos, yPos, dist, dynamic) {
        var tetherDef = new B2BodyDef(),
        tetherFix = new B2FixtureDef(),
        tempFilt,
        a = {},
        tetherJ;

        if(dynamic === true) {
            tetherFix.density = 0.02;
            tetherFix.friction = 0;
            tetherFix.restitution = 0.1;
            tetherDef.type = b2Body.b2_dynamicBody;
         } else {
             tetherDef.type = b2Body.b2_staticBody;
         }
       
        tetherFix.shape = new B2CircleShape(0);
        tempFilt =  tetherFix.filter;
        tempFilt.categoryBits = 2;
        tempFilt.maskBits = 2;
        //tempFilt.categoryBits = 32;
        //tempFilt.maskBits = 16;
        tetherFix.filter = tempFilt;
        tetherDef.position.x = (xPos) / scale;
        tetherDef.position.y = yPos / scale;
        a.body = world.CreateBody(tetherDef);
        a.fixture = a.body.CreateFixture(tetherFix);
        tetherJ = new B2DistanceJointDef();
        tetherJ.Initialize(a.body, bod, new B2Vec2((xPos)/scale, (yPos+dist)/scale), new B2Vec2((xPos)/scale, yPos/scale));
        world.CreateJoint(tetherJ);
        a.vx = 0;
        a.vy = 0;
        return a;
    }

    //making an object takes three things...
    //--fixture definition
    //--body definition
    //--shape

    function createRagDoll (cX,cY) {
        var jointDef = new B2RevoluteJointDef(),
        bodyDef = new B2BodyDef(),
        fixDef = new B2FixtureDef(),
        frankenstein,
        fusion,
        centX = cX || canvaswidth * 0.5,
        centY = cY || canvaswidth * 0.5,
        rightArm,
        leftArm,
        rightThigh,
        leftThigh,
        rightForeArm,
        leftForeArm,
        rightCalf,
        leftCalf,
        neck,
        rShoulder,
        lShoulder,
        rightHip,
        leftHip,
        rightElbow,
        leftElbow,
        rightKnee,
        leftKnee,
        tempFilt;

       // fixDef.density = 0.01;
        fixDef.density = 0.01;//0.01;// 0.001;
        fixDef.friction = 1;//1;//0.00005;
        fixDef.restitution = 0.1;//0.1;// 0.04;

        bodyDef.type = b2Body.b2_dynamicBody;

        frankenstein = drFrankenstein(bodyDef, fixDef, centX, centY);
        fusion = jointFusion(jointDef, centX, centY);

        //body parts
        torso = frankenstein(0, 0, 29, 28, 'torso');

        rightArm = frankenstein(23, 8, 8, 16, 'bicep');
        leftArm = frankenstein(-24, 6, 8, 16, 'bicep');
        rightThigh = frankenstein(9, 53, 9, 16, 'thigh');
        leftThigh = frankenstein(-14, 53, 9, 16, 'thigh' );

        rightCalf = frankenstein(10, 91, 11, 20, 'calf_left');
        leftCalf = frankenstein(-18, 90, 11, 20, 'calf_right');//his right

        rightForeArm = frankenstein(24, 49, 10, 22, 'forearm_right');
        leftForeArm = frankenstein(-24, 49, 10, 22, 'forearm_left');

        head = frankenstein(3, -70, 24, 32, 'head');

        tempFilt = rightForeArm.fixture.GetFilterData();
        tempFilt.categoryBits = 32;
        tempFilt.maskBits = 16;

        rightForeArm.fixture.SetFilterData(tempFilt);
        leftForeArm.fixture.SetFilterData(tempFilt);
        rightArm.fixture.SetFilterData(tempFilt);
        leftArm.fixture.SetFilterData(tempFilt);
        /*rightCalf.fixture.SetFilterData(tempFilt);
        leftCalf.fixture.SetFilterData(tempFilt);
        rightThigh.fixture.SetFilterData(tempFilt);
        leftThigh.fixture.SetFilterData(tempFilt);*/

        //joints
        neck = fusion(head.body, torso.body, 0, -44, 0, 0.1);
        rShoulder = fusion(rightArm.body, torso.body, 22, -20, 0.4, 2);
        lShoulder = fusion(leftArm.body, torso.body,  -22,  -20, -2, 1);

        rightHip = fusion(rightThigh.body, torso.body, 7, 30, -0.4, 0.8);
        leftHip = fusion(leftThigh.body, torso.body, -13, 30, -0.8, 0.4);

        rightElbow = fusion(rightArm.body, rightForeArm.body, 26, 26, -2, 1);
        leftElbow = fusion(leftArm.body, leftForeArm.body, -26, 26, -1, 2);
        rightKnee = fusion(rightThigh.body, rightCalf.body, 10, 70, -1, 1);
        leftKnee = fusion(leftThigh.body, leftCalf.body, -16, 74, -1, 1); //his right
    }

    animFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  window.oRequestAnimationFrame      ||
                  window.msRequestAnimationFrame     ||
                  function(/* function */ callback/*,  DOMElement  element */){
                    window.setTimeout(callback, 1000 / 60);
                  };
    }());

    function trackScientist () {
        var bod = scientist[1].body;
        scientistXPos = bod.GetPosition().x;
        scientistYPos = bod.GetPosition().y;
    }

     function updateAmoebas(meebArray, reset) {
        var m = 0, meeb = {};
        for(m = 0; m < meebArray.length; m+= 1) {
            meeb = meebArray[m];
            meeb.y += velocity_Y;
            meeb.x += (meeb.vx);
            meeb.rotation += meeb.vr;
            if(reset > -meeb.radius) {
                reset = -meeb.radius;
            }
            if(meeb.y < reset) {
                meeb.y = canvasheight + meeb.radius;
            } else if ( meeb.y > canvasheight+meeb.radius) {
                meeb.y = -meeb.radius;
            }

            if(meeb.x < -meeb.radius) {
                meeb.x = canvaswidth + meeb.radius;
            } else if (meeb.x > canvaswidth + meeb.radius) {
                meeb.x = -meeb.radius;
            }
        }
    }

    function updateDeathCounter() {
        if(percentageofHumanDNA > 0 ) {
            if(countDownStarted === true) {
                countDownStarted = false;
            }
        } else {       
            if(countDownStarted !== true) {
                countDownStarted = true;
                countDownStartTime = new Date();
            }
            deathCounter = Math.floor(  (new Date() - countDownStartTime) / 1000 );
            if(deathCounter > 5) {
                selectGameState('end');
            }
        }
    }

    function cleanUpWaste (ray) {
        var a, waste, yPos, xPos;
        for(a = 0; a < ray.length; a += 1) {
            waste = ray[a];
            yPos = (waste.body.GetPosition().y * scale);
            xPos = (waste.body.GetPosition().x * scale);
            if(( yPos > canvasheight - container.y) || waste.destroy === true) {
                world.DestroyBody(waste.body);
                ray.splice(a,1);
            }
        }
    }

    function cleanUpMadScientistWaste (ray) {
        var a, waste, yPos, xPos;
        for(a = 0; a < ray.length; a += 1) {
            waste = ray[a];
            yPos = (waste.body.GetPosition().y * scale);
            xPos = (waste.body.GetPosition().x * scale);
            if((yPos < 0 || yPos > canvasheight - container.y) || waste.destroy === true) {
                world.DestroyBody(waste.body);
                ray.splice(a,1);
            }

            if(xPos < -40 || xPos > canvaswidth + 40) {
                world.DestroyBody(waste.body);
                ray.splice(a,1);
            }
        }
    }

    function updateaManlyOpacity () {
        if(flickerCounter < 8 ) {

            if(flickerCounter % 4 === 0 ) {
                //manlyAlpha = 0.2;
                manlyAlpha = 1;
            } else {
                //manlyAlpha += 0.1;
                manlyAlpha = 0.1;
            }

            flickerCounter += 1;
        } else {
            fickerCounter = 20;
            manlyAlpha = 1;
        }
    }

    function updateMadlyOpacity () {
         if(flickerCounter < 8 ) {

            if(flickerCounter % 4 === 0 ) {
                manlyAlpha = 0.2;
            } else {
                manlyAlpha += 0.1;
            }

            flickerCounter += 1;
        } else {
            fickerCounter = 20;
            manlyAlpha = 1;
        }
    }

    function updateZoom() {
        //motor.y += ((motor.targetY - motor.y) * 0.1);
        anchor.body.ApplyForce(new B2Vec2(motor.x,motor.y), anchor.body.GetWorldCenter() );
        motor.x *= 0.92;
    }

    function updateCamera() {
        var targetY = 0;
        if (gameComplete !== true) {
            targetY = (-scientistYPos * scale) + cameraTarget;
            container.y = container.y + ((targetY - container.y) * 0.14);
        } else {
            container.y = cameraStopPos;
        }
        
    }

    function updateBubbles() {
        var newbub = {},
        bub = {},
        i = 0;
        newbub.radius = bitwise( Math.random() * 4);
        newbub.velX = (motor.x * -1) * 0.3 + (Math.random() * 4 -2);

        newbub.x = container.x + (scientist[1].body.GetPosition().x)*scale -53;
        newbub.y = container.y + (scientist[1].body.GetPosition().y)*scale + (Math.random()* 8 -4);
    
        bubbles.push(newbub);
        for(i = 0; i < bubbles.length; i += 1) {
            bub = bubbles[i];
            bub.y += velocity_Y;
            bub.x += bub.velX;
            if(bub.y > canvasheight) {
                bubbles.splice(i,1);
            }
        }
    }

    function checkifScientistisOutofTube () {
        //var scientistYPos = scientist[1].body.GetPosition().y;
        if(scientistYPos < -1500 ) {
            if(gameComplete === false) {
                gameComplete = true;
                cameraStopPos = container.y;
                setTimeout(function(){
                    selectGameState('end');
                }, 2000);
            }
            motor.y = 0;
        }
        if(killerReleased === false) {
            if(scientistYPos < -1000) {
                killerReleased = true;
                releaseEbola();
            }
        }

        if(superPillReleased === false) {
            if(scientistYPos < -1250) {
                superPillReleased = true;
                if((percentageofHumanDNA * 100) < 50) {
                    releaseSuperPill();
                }
            }
        }

        if(powerUpReleased === false) {
            if(scientistYPos < -650) {
                powerUpReleased = true;
                releasePowerUp();
            }
        }

         if(ironManPower === true) {
            if(scientistYPos < -900) {
                //ironManPower = false;
                setTimeout(function(){ironManPower = false;}, 1000);
                flickerCounter = -10;
            }
        }
    }

    function updateEnergyText () {
        if(boggedDown === true ) {
            energyTextBox.innerHTML = "LET GO TO REFILL";
        } else {
            energyTextBox.innerHTML = "ENERGY";
        }
    }

    function updateGame(){
        var timeDelta = (new Date() - oldDate),
        fps = bitwise(1000/ timeDelta);
        //console.log('game is running at ' + fps + ' frames per second');
        oldDate = new Date();
        if(fps <= 0) {
            fps = 15;
        }
        trackScientist();
        
        checkifScientistisOutofTube();
        updateCamera();
        updateZoom();
        //updateBubbles();
        cleanUpWaste(amoebas);
        cleanUpWaste(DNApills);
        /*if(iOSVersion > 4) {
            //updateAmoebas(tinyAmoebas, 0);
            //updateAmoebas(giantAmoebas,-3000);
        }*/
        updateaManlyOpacity();
        updateDeathCounter();
        ui.update();
       // updateEnergyText();

        //world.Step((1/fps), 30 , 30 );
        world.Step((1/fps), 30 , 30 );
        world.ClearForces();
        
    }

    function updateMadScientistMode () {
        var timeDelta = (new Date() - oldDate),
        fps = bitwise(1000/ timeDelta);
        oldDate = new Date();
        if(fps <= 0) {
            fps = 15;
        }
        trackScientist();
        
        updateCamera();
        updateMadlyOpacity();
        cleanUpMadScientistWaste(amoebas);
        cleanUpMadScientistWaste(DNApills);
        updateDeathCounter();
        ui.update();
        world.Step((1/fps), 30 , 30 );
    }

    function renderMadScientistMode () {
        //console.log('render');
        context.clearRect(0,0,canvaswidth, canvasheight);
        //console.log('canvaswidth is ' + canvaswidth);
        /*if(iOSVersion > 4) {
            //renderNonWorldAmoebas(tinyAmoebas,context);
            //renderNonWorldAmoebas(giantAmoebas,foreground);
        } */
        renderScientist();
        renderAmoebas();
        renderDNA();
        ui.render();
        //renderLines();
    }

    function renderTubeTop () {
        context.fillSyle= "rgb(255,255,255)";
        if(container.y + (-1500*scale) > 0 ) {
            context.drawImage(tubeTop, 0, (container.y + (-1500*scale) - tubeTop.height) + 20, canvaswidth, tubeTop.height);
        }
       // context.drawImage(tubeTop, 0, (container.y + (-2000*scale) - tubeTop.height) + 20, canvaswidth, tubeTop.height);
    }

    function renderRescueBubble () {
        if(gameComplete === true) {
            context.save();
            context.strokeStyle = "rgba(255,255,255, 1)";
            context.fillStyle = 'rgba(255,255,255, 0.2)';
            context.lineWidth = 1;
            
            context.beginPath();
            context.arc((container.x + scientistXPos * scale) - 20 ,( container.y + scientistYPos * scale) - 20 , 180, 0, Math.PI * 2, false);

            context.fill();
            context.stroke();
            context.restore();

            context.save();
            context.beginPath();
            context.fillStyle = 'rgba(255,255,255, 0.3)';
            context.arc((container.x + scientistXPos * scale) - 80 ,( container.y + scientistYPos * scale) -80 , 50, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
        }
    }

    
    function renderScientist() {
        var limb = {},
        i = 0,
        img,
        torsoY = torso.body.GetPosition().y * scale,
        torsoX = torso.body.GetPosition().x * scale;
        //draw tank
        context.save();
        context.setTransform(1,0,0,1,0,0);
        context.translate(container.x + torsoX, container.y + torsoY);
        context.rotate(torso.body.GetAngle());
        context.globalAlpha = manlyAlpha;
        context.drawImage(tankImg, supertank.x, supertank.y, supertank.width, supertank.height);
        context.restore();
        //draw limbs
        for(i = 0; i < scientist.length; i += 1) {
            limb = scientist[i];
            context.save();
            context.setTransform(1,0,0,1,0,0);
            context.translate( container.x + (limb.body.GetPosition().x)*scale,
                                container.y + (limb.body.GetPosition().y)*scale);
            context.globalAlpha = manlyAlpha;
            context.fillStyle = 'rgba(255,255,255, .3)';
            context.rotate(limb.body.GetAngle());
            
            if( ironManPower === true ) {
                 img = ironMan[limb.name].img;
             } else {
                img = currentBodyImages[limb.name].img;
             }
            context.drawImage(img,
                                -limb.scaledWidth,
                                -limb.scaledHeight,
                                (limb.scaledWidth*2),
                                (limb.scaledHeight*2) );
            context.restore();
        }
        //draw bubble
        context.save();
        context.setTransform(1,0,0,1,0,0);
        context.translate(container.x + torsoX, container.y + torsoY);
        context.rotate(torso.body.GetAngle());
        context.drawImage(bubbleImg, superbubble.x, superbubble.y, superbubble.width, superbubble.height);
        context.restore();
    }


    function renderAmoebas() {
        var a = 0, meeb = {};
        for(a = 0; a < amoebas.length; a += 1) {
            meeb = amoebas[a];
            context.save();
            context.setTransform(1,0,0,1,0,0);
            context.translate( (meeb.body.GetPosition().x) * scale,
                                    container.y +  (meeb.body.GetPosition().y) * scale);

            context.rotate(meeb.body.GetAngle());
            context.globalAlpha = meeb.alpha;
            context.drawImage(meeb.image,
                                -meeb.scaledRadius,
                                -meeb.scaledRadius,
                                meeb.scaledWidth,
                                meeb.scaledWidth);
            context.restore();
        }
    }

    function renderDNA () {
        var p, pill = {};
        for(p = 0; p < DNApills.length; p+= 1) {
            
            pill = DNApills[p];
            context.save();
            context.setTransform(1,0,0,1,0,0);
            context.translate( container.x + (pill.body.GetPosition().x) * scale,
                                container.y + (pill.body.GetPosition().y) * scale);
            context.rotate(pill.body.GetAngle());
            context.drawImage(pill.image, -pill.width, - pill.height, pill.width * 2, pill.height * 2);
            context.restore();
        }
    }

    function renderNonWorldAmoebas(meebArray,ctx) {
        var meeb = {}, m = 0;
        //ctx.clearRect(0,0,canvaswidth,canvasheight);
        for(m = 0; m < meebArray.length; m+= 1) {
            meeb = meebArray[m];
            //ctx.save();
            //ctx.setTransform(1,0,0,1,0,0);
            //ctx.translate(meeb.x, meeb.y);
            //ctx.rotate(radians(meeb.rotation));
            //ctx.globalAlpha = meeb.alpha;
            ctx.beginPath();
            //ctx.arc();
            ctx.fillStyle = 'rgba(255,255,255, ' + meeb.alpha + ')';
            ctx.arc(meeb.x,meeb.y, meeb.radius, 0, Math.PI * 2 , false);
            ctx.fill();
            //ctx.drawImage(meeb.image, -meeb.radius, -meeb.radius, meeb.radius *2, meeb.radius *2);
            //ctx.restore();

        }
    }

    function renderBubbles () {
        var i = 0,
        bub = {};

        for(i = 0; i < bubbles.length; i += 1) {
            bub = bubbles[i];
            context.strokeStyle = 'rgb(255,255,255)';

            context.lineWidth = 1;
            context.beginPath();
            context.arc(bub.x , bub.y, bub.radius, 0, (Math.PI * 2), false);
            context.stroke();
        }
    }

    function renderLines() {
        var i = 0,
        ln;
        context.fillStyle = 'rgba(255,255,255, 0.2)';
        for(i = 0; i < lines.length; i += 1) {
            ln = lines[i];
            if(container.y + (ln.scaledPos) < canvasheight &&  container.y + (ln.scaledPos) > 0) {
                context.fillRect(container.x, container.y + (ln.scaledPos), (ln.scaledWidth), ln.height);
                if(ln.text !== null) {
                    context.textAlign = 'left';
                    context.font = "bold  82px arial";
                  //  context
                    context.fillText(ln.text, (ln.scaledWidth), container.y + (ln.scaledPos) + (ln.width * 2));
                }
            }
        }

    }

    /*function renderLetGoMsg () {
        if(boggedDown === true) {
            context.save();
            context.fillStyle = 'rgba(255,255,255,0.6)';
            context.font = "bold 30px arial";
            context.textAlign = 'center';
            context.fillText("LET GO TO REFILL ENERGY!", canvaswidth * 0.5, canvasheight * 0.5);
            context.restore();
        }
    }*/

    function renderGame() {
        context.clearRect(0,0,canvaswidth, canvasheight);
        /*if(iOSVersion > 4) {
            //renderNonWorldAmoebas(tinyAmoebas,context);
            //renderNonWorldAmoebas(giantAmoebas,foreground);
        }*/
        //renderBubbles();
        renderTubeTop();
        renderScientist();
        renderAmoebas();
        renderDNA();
        renderRescueBubble();
        ui.render();
        ui.nonMadScienceRender();
        renderLines();
        //renderLetGoMsg();
    }

    fallingLoop = function () {
        //console.log('falling loop');
        updateGame();
        renderGame();
    };

    madScienceLoop = function () {
       //console.log('mad science ');
       //console.log('mad science loop');
        updateMadScientistMode();
        renderMadScientistMode();
    };

    menuLoop = function () {
        mainMenu.update();
        endScreen.update();
        splashScreen.update();
        multiChoice.update();
        successScreen.update();
        sharedScreen.update();
        sharePopUp.update();
        diagram.update();
        jobsCta.update();
        mssuccessScreen.update();
        rviPopUp.update();
        msiPopUp.update();
        //render
        mainMenu.render();
        endScreen.render();
        splashScreen.render();
        multiChoice.render();
        successScreen.render();
        sharedScreen.render();
        sharePopUp.render();
        diagram.render();
        jobsCta.render();
        rviPopUp.render();
        msiPopUp.render();

        mssuccessScreen.render();
    };

    function runGame() {
        currentGameLoopFunction(); //current function for running the game
        animFrame(runGame); //loop
    }

    function createRandomAmoeba() {
        var x = 0,
        y = 0;
        if(amoebas.length < 3) {
            x = Math.random() * (canvaswidth / scale);
            //x = scientistXPos;
            y = (-container.y / scale) -5;
            if(y > -1490) {
                 releaseAmoeba(x,y);
            }
        }
        amoebaTimer = setTimeout(createRandomAmoeba, Math.random()* amoebaDelay + amoebaDelay);
        if(amoebaDelay > 50) {
            amoebaDelay -= 40;
        } else {
            amoebaDelay = 40;
        }
      
    }

    function dropAmoeba (evt) {
        var e = evt || window.event,
        fingerX = 0,
        fingerY = 0,
        x = 0,
        y = 0;
        if(amoebas.length < 4 ) {
            if(e.touches !== undefined) {
                fingerX = e.touches[0].pageX;
                fingerY= e.touches[0].pageY;
            } else if (e.pageX !== undefined) {
                fingerX = e.pageX;
                fingerY = e.pageY;
            }
            x = (-container.x + fingerX) / scale;
            y = (-container.y + fingerY) / scale;
            releaseAmoeba(x,y);
            //console.log('release that fucker');
        }
    }

    function createAmoeba (x,y,wide) {
        var amoeba = {},
        wid = wide || 40,
        rad;

        rad = wid/scale;

        amoebaBod.position.x =  x;
        amoebaBod.position.y =  y;
        amoebaBod.bullet = true;

        amoeba.body = world.CreateBody(amoebaBod);
        amoeba.fixture = amoeba.body.CreateFixture(amoebaFix);
        amoeba.radius = rad;
        amoeba.scaledRadius = bitwise(rad * scale);
        amoeba.scaledWidth = bitwise((rad *2) * scale);
        amoeba.body.SetAngularVelocity(Math.random()*8 -4);
        amoeba.alpha = 1;
        amoeba.body.parentObj = amoeba;
        return amoeba;
    }

    function releaseAmoeba (x,y) {
        var amoeba = {},
        rand;
        amoeba = createAmoeba(x,y);
        amoeba.isVirus = true;
        rand = Math.floor(Math.random() * amoebaModels.length );
        amoeba.image = amoebaModels[rand];
        amoebas.push(amoeba);
    }

    function releaseEbola () {
        var virus,
        x = 0,
        y = 0;
        x = Math.random() * (canvaswidth / scale);
        y = (-container.y / scale) -5;
        virus = createAmoeba(x,y,65);
        virus.isEbola = true;
        virus.image = ebolaImg;
        amoebas.push(virus);
       
    }

    function releasePowerUp () {
        var pu,
        x = 0,
        y = 0;
        x = Math.random() * (canvaswidth / scale );
        y = (-container.y / scale ) - 5;
        pu = createAmoeba(x,y,45);
        pu.isPowerUp = true;
        pu.image = powerUpImage;
        amoebas.push(pu);
    }

    function fireDNA () {
        var xPos,
        yPos,
        pill = {},
        vx = 0,
        vy = 0;

        if(percentageofHumanDNA > 0) {
            xPos = (Math.random() * canvaswidth) / scale;
            yPos = (canvasheight) / scale;
            vx = (scientistXPos - xPos) * 10;
            vy = (scientistYPos - yPos) * 10;
            pill = makePill(xPos,yPos);
            pill.isDNA = true;
            pill.image = pillImage;
            pill.body.ApplyImpulse(new B2Vec2(vx,vy), pill.body.GetWorldCenter() );
            DNApills.push(pill);

        }

        dnaTimer = setTimeout(fireDNA, Math.random() * 4000 + 4000);
    }

    function makePill (x,y) {
        var pill = {},
        widf = 44,
        hite = 20;
        DNABod.position.x = x;
        DNABod.position.y = y;
        pill.width = widf;
        pill.height = hite;
        pill.body = world.CreateBody(DNABod);
        pill.body.SetAngularVelocity(Math.random()*16 -8);
        pill.fix = pill.body.CreateFixture(DNAFix);
        pill.body.parentObj = pill;
        return pill;
    }

    function releaseDNA () {
        var x = 0,
        y = 0,
        pill = {};

        if(DNApills.length < 1) {
            x = (Math.random() * canvaswidth) / scale;
            y = (-container.y / scale) -5;
            if(y > -1490)  {
                  pill = makePill(x,y);
                pill.isDNA = true;
                pill.image = pillImage;
                DNApills.push(pill);
            }
        }
        dnaTimer = setTimeout(releaseDNA, Math.random() * 4000 + 4000);
    }

    function releaseSuperPill () {
        var x = 0,
        y = 0,
        pill;

        x = (Math.random() * canvaswidth) / scale;
        y = (-container.y / scale);
        pill = makePill(x,y);
        pill.isSuperPill = true;
        pill.image = superPillImg;
        DNApills.push(pill);

    }

    function releasetheBastard () {
        boggedDown = true;
        console.log('let me go!!');
    }

    function touchStartRelay (evt) {
       // console.log("AUFG!");
        var e = evt || window.event;
        multiverse.cancelevent(e);
        currentTouchStartFunction(e);
        if(boggedDownTimer === null) {
            boggedDownTimer = setTimeout(releasetheBastard, 1000);
            grabDate = new Date();
        }
        grabbed = true;
        //boggedDownTimer = setTimeout(releasetheBastard, 1000);
    }

    function touchMoveRelay (evt) {
        var e = evt || window.event;
        multiverse.cancelevent(e);
        currentTouchMoveFunction(e);
    }

    function touchEndRelay (evt) {
        var e = evt || window.event;
        if(boggedDownTimer !== null) {
            clearTimeout(boggedDownTimer);
            boggedDownTimer = null;
        }
        boggedDown = false;
        grabbed = false;
    }

    function sizeCanvas (ww,hh) {
        var outerWidth = ww || window.innerWidth,
        outerHeight = hh || window.innerHeight;

        canvaswidth = bitwise(outerWidth);
        canvasheight = bitwise(outerHeight - 10);

        canvas.height = canvasheight;
        canvas.width = canvaswidth;
    }

    resetTubeWalls = function() {
        world.DestroyBody(leftWall.body);
        world.DestroyBody(rightWall.body);
        setUpTube();
    };

    function resizeCanvas (ww,hh) {
        var outerWidth = ww || window.innerWidth,
        outerHeight = hh || window.innerHeight;

        canvaswidth = bitwise(outerWidth - 10);
        canvasheight = bitwise(outerHeight - 10);

        canvas.height = canvasheight;
        canvas.width = canvaswidth;

        /*emptyBar.style.top = (canvasheight * 0.13) + 'px';
        emptyBar.style.left = 22 + 'px';
        fullBar.style.top = (canvasheight * 0.13) + 'px';
        fullBar.style.left = 22 + 'px';
        mutationText.style.top = ((canvasheight * 0.13) + 8) + 'px';*/
        cameraTarget = canvasheight * targetRatio;
        tubeResetFunction();
    }

    document.changeSize = function(widf,hite,sway) {
        sideways = sway;
        resizeCanvas(widf,hite);
    };

    function initLines() {
        var i = 0,
        ln;

        for (i = 0; i <= 150; i += 1) {
            ln = {};
            ln.xPos = 0;
            ln.yPos = (i * -20);
            ln.scaledPos = ln.yPos * scale;

            if(i % 5 === 0) {
                ln.width = 16;
                ln.height = 12;
                ln.text = ((ln.yPos + 1500) * 0.1) + 'ml';
            } else {
                ln.width = 8;
                ln.height = 6;
                ln.text = null;
            }
            ln.scaledWidth = ln.width * scale;
            lines.push(ln);
        }
    }

    function accelerometerRelay (evt) {
        currentAcceleromterFunction(evt);
    }

    function fancyGravity(e) {
        var xforce = 0, yforce = 0;
        if(e) {
            if(sideways === false ) {
                xforce = e.accelerationIncludingGravity.x * -15;// * -155;
                yforce = e.accelerationIncludingGravity.y * 15;// * 155;
            } else {
                yforce = e.accelerationIncludingGravity.x * -15;// * -155;
                xforce = e.accelerationIncludingGravity.y * -15;// * -155;
            }
            world.SetGravity(new B2Vec2( xforce, yforce ) );
        }
    }

    function checkForiOS() {
        var uagent = navigator.userAgent.toLowerCase();
        if ( uagent.search("iphone") > -1 || uagent.search("ipad") > -1 ) {
            iPhone = true;
        }
        if(iPhone === true) {
            multiverse.eventlistener('devicemotion', window, accelerometerRelay);
        }
    }

    function setUpDNA () {
        DNAFix.density = 0.001;
        DNAFix.friction = 0;
        DNAFix.restitution = 4;
        DNAFix.shape = new  B2PolygonShape();
        DNAFix.shape.SetAsBox(44/scale,20/scale);
        DNABod.type = b2Body.b2_dynamicBody;
    }

    function setUpAmoebas() {
        amoebaFix.density = 0.000001;
        amoebaFix.friction = 0;
        amoebaFix.restitution = 4;
        amoebaFix.shape = new B2CircleShape(40/scale);
        amoebaBod.type = b2Body.b2_dynamicBody;
        amoebaCreator(amoebaModels, 'main', 5);
    }

    function setUpMadAmoebas() {
        amoebaFix.density = 2;
        amoebaFix.friction = 0;
        amoebaFix.restitution = 4;
        amoebaFix.shape = new B2CircleShape(40/scale);
        amoebaBod.type = b2Body.b2_dynamicBody;
        amoebaCreator(amoebaModels, 'main', 5);
    }


    function setUpTube () {
        var tubeWallDef = new B2BodyDef(),
        tubeWallFix = new B2FixtureDef(),
        tubeWallDef2 = new B2BodyDef(),
        tubeWallFix2 = new B2FixtureDef();

        tubeWallFix.shape = new B2PolygonShape();
        tubeWallFix.shape.SetAsBox(20/scale, (canvasheight * 200) /scale);
        tubeWallDef.type = b2Body.b2_staticBody;
        tubeWallDef.position.x = (canvaswidth + 4) / scale;
        tubeWallDef.position.y =  1 / scale;

        leftWall.body = world.CreateBody(tubeWallDef);
        leftWall.body.parentObj = leftWall;
        leftWall.fixture = leftWall.body.CreateFixture(tubeWallFix);

        tubeWallFix2.shape = new B2PolygonShape();
        tubeWallFix2.shape.SetAsBox(20/scale, (canvasheight * 200) /scale);
        tubeWallDef2.type = b2Body.b2_staticBody;
        tubeWallDef2.position.x = (1) / scale;
        tubeWallDef2.position.y =  1 / scale;

        rightWall.body = world.CreateBody(tubeWallDef2);
        rightWall.body.parentObj = rightWall;
        rightWall.fixture = rightWall.body.CreateFixture(tubeWallFix2);
        
    }

    function setUpGameRagDoll() {
        tetherX = canvaswidth*0.5;
        tetherY = canvasheight* 0.6;
        createRagDoll((canvaswidth*0.5), (canvasheight* 0.6) );
       // anchor = tether(head.body, tetherX, tetherY-60, 4, true);
        anchor = tether(head.body, tetherX, tetherY-10, 4, true);
    }

    function setUpMadScientistRagDoll () {
        tetherX = canvaswidth*0.5;
        tetherY = canvasheight* 0.6;
        createRagDoll((canvaswidth*0.5), canvasheight * 0.6 );
        anchor = tether(head.body, tetherX, tetherY, 60, false);
    }

    function switchLimb (limbName, newLimb) {
        if(newLimb.img.width > 0 ) {
            currentBodyImages[limbName] = newLimb;
            calculateMutationPercentage();
        } else {
            return false;
        }
        flickerCounter = 0;
    }

    function dehumanize () {
        var limb,
        randLimb,
        newLimb;
        limb = body_images[ Math.floor(Math.random() * body_images.length )];
        randLimb = Math.floor( Math.random() * mutations[limb].length );
        newLimb = mutations[limb][randLimb];
        switchLimb(limb, newLimb);
    }

    function fullMutation () {
        var limbname,
        i = 0,
        mutation,
        randomSelection = 0;

        for(i = 0; i < body_images.length; i+= 1) {
            limbname = body_images[i];
            randomSelection = Math.floor( Math.random() * mutations[limbname].length );
            mutation = mutations[limbname][randomSelection];
            switchLimb(limbname,mutation);
        }
    }

    function humanize () {
        var newLimb,
        limb;

        if(listofMutatedLimbs.length > 0) {
            limb = listofMutatedLimbs[ Math.floor(Math.random() * listofMutatedLimbs.length )];
            newLimb = humanities[limb][0];
        } else {
            newLimb = { img : {  width : 0 } };
        }
        switchLimb(limb, newLimb);
    }

    function fullHumanization (){
        var i = 0,
        limbname;
        for(i = 0; i < body_images.length; i+= 1) {
            limbname = body_images[i];
            switchLimb(limbname, humanities[limbname][0]);
        }
    }

    function calculateMutationPercentage() {
        var human_limbs = 0,
        i = 0;

        listofMutatedLimbs = [];

        for(i = 0; i < body_images.length; i += 1) {
            if(currentBodyImages[body_images[i]].isHuman === true) {
                human_limbs += 1;
                if(body_images[i] === 'bicep' || body_images[i] === 'thigh') {
                    human_limbs += 1;
                }
            } else {
                listofMutatedLimbs.push(body_images[i]);
            }
        }
        percentageofHumanDNA = ((human_limbs / (body_images.length + 2))).toFixed(2);
        percentageofMutantDNA =((listofMutatedLimbs.length / body_images.length).toFixed(2) );

    }

    function setUpCollisionHandler() {
        var listener = new B2ContactListener();
        listener.PostSolve = function(contact) {
        //listener.PreSolve = function(contact) {
            var bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody();

            if(ironManPower === true ) { return false; }
            if(bodyA.parentObj.isMan === true && bodyB.parentObj.isMan !== true) {
                if(bodyB.parentObj.destroy!== true) {
                     bodyB.parentObj.destroy = true;
                    if(bodyB.parentObj.isDNA === true) {
                        humanize();
                       // return;
                    } else if (bodyB.parentObj.isVirus === true) {
                        dehumanize();
                        //return;
                    } else if (bodyB.parentObj.isEbola === true) {
                        fullMutation();
                        //return;
                    } else if (bodyB.parentObj.isSuperPill === true) {
                        fullHumanization();
                       // return;
                    } else if (bodyB.parentObj.isPowerUp === true ) {
                        ironManPower = true;
                        flickerCounter = 0;
                        //return;
                    }
                   // bodyB.parentObj.destroy = true;
                }
            } else if (bodyB.parentObj.isMan === true && bodyA.parentObj.isMan !== true) {
                if(bodyA.parentObj.destroy!== true) {
                      bodyA.parentObj.destroy = true;
                    if(bodyA.parentObj.isDNA === true) {
                        humanize();
                         return;
                    } else if (bodyA.parentObj.isVirus === true) {
                        dehumanize();
                         return;
                    } else if (bodyA.parentObj.isEbola === true) {
                        fullMutation();
                         return;
                    } else if (bodyA.parentObj.isSuperPill === true) {
                        fullHumanization();
                         return;
                    } else if (bodyA.parentObj.isPowerUp === true ) {
                        ironManPower = true;
                        flickerCounter = 0;
                         return;
                    }
                  
                }
            }
        };

        world.SetContactListener(listener);
    }

    function setUpMSCollisionHandler () {
        var listener = new B2ContactListener();
        listener.PostSolve = function(contact) {
        //listener.PreSolve = function(contact) {
            var bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody();

            if(ironManPower === true ) { return false; }
            if(bodyA.parentObj.isMan === true && bodyB.parentObj.isMan !== true) {
                if(bodyB.parentObj.destroy!== true) {
                    if(bodyB.parentObj.isDNA === true) {
                        humanize();
                    } else if (bodyB.parentObj.isVirus === true) {
                        dehumanize();
                    } 
                    bodyB.parentObj.destroy = true;
                }
            } else if (bodyB.parentObj.isMan === true && bodyA.parentObj.isMan !== true) {
                if(bodyA.parentObj.destroy!== true) {
                    if(bodyA.parentObj.isDNA === true) {
                        humanize();
                    } else if (bodyA.parentObj.isVirus === true) {
                        dehumanize();
                    } 
                    bodyA.parentObj.destroy = true;
                }
            }
        };

        world.SetContactListener(listener);
    }

    function steer (evt) {
        var e = evt || window.event,
        x = 0,
        y = 0,
        directionVector = 0,
        yPos = 0;

        if(e.touches !== undefined) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        } else if (e.pageX !== undefined) {
            x = e.pageX;
            y = e.pageY;
        }

        directionVector = x - fingerStartPos;
        yPos = scientist[1].body.GetPosition().y;
        if(boggedDown === false) {
            //anchor.body.SetPosition(new B2Vec2(x/scale,yPos));
            anchor.body.ApplyImpulse(new B2Vec2(directionVector*0.3,0), anchor.body.GetWorldCenter());
           /// motor.x = (directionVector * 0.1);
        }
       
        multiverse.cancelevent(e);
        //ui.moveSlider(x);
    }

    function setFingerPos (evt) {
        var e = evt || window.event,
        xPos = 0;
        if(e.touches !== undefined) {
            xPos = e.touches[0].pageX;
        } else if (e.pageX !== undefined) {
            xPos = e.pageX;
        }
        
        fingerStartPos = xPos;
        multiverse.cancelevent(e);
    }

    function allSystemsGo() {
        checkForiOS();
        sideways = (function () {
            return (window.innerHeight < window.innerWidth);
        }());
        sizeCanvas(window.innerWidth, window.innerHeight);
        //event listeners... add once!
        //game buttons
        multiverse.eventlistener('touchmove', glarePanel, touchMoveRelay);
        multiverse.eventlistener('touchstart', glarePanel, touchStartRelay);
        multiverse.eventlistener('touchend', glarePanel, touchEndRelay);

        setUpButtons();
        selectGameState('intro');
        runGame();
    }

    function mutantParts(parts, suffix) {
        var img,
        i = 0;
        mutations[suffix] = [];
        for(i = 0; i < parts.length; i+= 1) {
            img = new Image();
            img.src = 'images/' + parts[i] + '_' + suffix + '.png';
            mutations[suffix][i] = objectCreator(img, parts[i]);
        }
    }

    function amoebaCreator (ray, suffix, total) {
        var img,
        i = 0;
        for(i = 1; i <= total; i+= 1) {
            img = new Image();
            img.src = 'images/' + i + '_' + suffix + '.png';
            ray.push(img);
        }
    }

    reset = function () {
        currentResetFunction();
    };

    brokenFunction = function () {
        //do nothing!
    };

    function cleanHouse () {
        var limbname = '',
        i = 0,
        c = 0;
        //make him human again
        context.clearRect(0,0,canvaswidth,canvasheight);
        for(i = 0; i < body_images.length; i+= 1) {
            limbname = body_images[i];
            currentBodyImages[limbname] = humanities[limbname][0];
        }
        for(i = 0; i < scientist.length; i += 1) {
            world.DestroyBody(scientist[i].body);
        }
        calculateMutationPercentage();
        for(c = 0; c < amoebas.length; c+= 1) {
            amoebas[c].destroy = true;
        }
        DNApills = [];
        amoebas = [];
        percentageofHumanDNA = 1;
        countDownStarted = false;
        deathCounter = 0;
        lines = [];
        scientist = [];
        //world = {};
        container.x = 0;
        container.y = -2000;
        fullBar.style.width = '0px';
    }

    function removeMenus () {
        mainMenu.targetAlpha = 0;
        diagram.targetAlpha = 0;
        mainMenu.elem.style.visibility = "hidden";
        endScreen.elem.style.visibility = "hidden";
        splashScreen.elem.style.visibility = "hidden";
        splashScreen.targetAlpha = 0;
        multiChoice.elem.style.visibility = "hidden";
        successScreen.elem.style.visibility = "hidden";
        sharedScreen.elem.style.visibility = "hidden";
        sharePopUp.elem.style.visibility = "hidden";
        diagram.elem.style.visibility = "hidden";
        jobsCta.elem.style.visibility = "hidden";
        mssuccessScreen.targetAlpha = 0;
        mssuccessScreen.elem.style.visibility = "hidden";
    }

    tryAgainFunction = function () {
        cleanHouse();
    };

    tryMadScientistFunction = function() {
        cleanHouse();
    };

    function makeScientistMutant () {
        var i = 0;
        for(i = 0; i < body_images.length; i += 1) {
            humanities[body_images[i]].push( scientistBody[body_images[i]] );
        }
    }

    loadManager(tankImg, "images/tank.png");
    loadManager(bubbleImg, "images/bubble.png");
    loadManager(pillImage, "images/DNAPill.png", "dna");
    loadManager(superPillImg, "images/GOLDPill.png");
    loadManager(ebolaImg, "images/Ebola.png");
    loadManager(tubeTop, "images/beaker_top.png");
    loadManager(powerUpImage, "images/powerup.png");

    humanities = bodyObject();
    mutations = bodyObject();

    mutantParts(['skeleton', 'chicken', 'octopus', 'bodybuilder'], 'forearm_left');
    mutantParts(['chicken', 'skeleton', 'octopus', 'bodybuilder'], 'forearm_right');
    mutantParts(['chicken', 'skeleton', 'bagel', 'bodybuilder', 'burlesque', 'girl', 'robot'], 'torso');
    mutantParts(['duck', 'skeleton', 'vanillaice', 'poop', 'cyclops', 'macaroni', 'computer', 'ninja', 'meta', 'girl', 'lumberjack', 'robot'], 'head');
    mutantParts(['chicken', 'skeleton', 'bodybuilder', 'burlesque'], 'calf_right');
    mutantParts(['chicken', 'skeleton', 'bodybuilder', 'burlesque'], 'calf_left');
    mutantParts(['chicken', 'skeleton', 'bodybuilder', 'burlesque'], 'thigh');
    mutantParts(['chicken', 'skeleton', 'octopus', 'bodybuilder'], 'bicep');

    scientistBody = superCreator(body_images, 'scientist', function(){
        scientistLoaded = true;
        makeScientistMutant();
        currentBodyImages = scientistBody;
        allSystemsGo();
    });

    ironMan = superCreator(body_images, 'ironman', function(){
        //console.log('ironman ready!');
    });

    function setUpButtons () {
        console.log('setting up buttons');
        //splash screen
        multiverse.eventlistener('touchstart',beginexperiment_btn, function(){
            //removeMenus();
            splashScreen.targetAlpha = 0;
            splashScreen.elem.style.visibility  = 'hidden';
            rviPopUp.targetAlpha = 1;
            rviPopUp.elem.style.visibility = "visible";
        });
        //end screen
        multiverse.eventlistener('touchstart',playagain_btn, function(){
            selectGameState('game');
        });
       
        //multi-choice screen
        multiverse.eventlistener('touchstart', madscientist_btn, function(){
            selectGameState('mad-scientist');
            //msiPopUp.targetAlpha = 1;
            //msiPopUp.elem.style.visibility = "visible";
        });
         multiverse.eventlistener('touchstart', getfreaky_btn, function(){
            //alert('pow');
            removeMenus();
            msiPopUp.targetAlpha = 0;
            msiPopUp.elem.style.visibility = "hidden";
            selectGameState('mad-scientist');
        });
        multiverse.eventlistener('touchstart', startgame_btn, function(){
            selectGameState('game');
           
        });
        multiverse.eventlistener('touchstart', ready_btn, function(){
            removeMenus();
            rviPopUp.targetAlpha = 0;
            rviPopUp.elem.style.visibility = "hidden";
            //removeMenus();
            selectGameState('game');
        });
        multiverse.eventlistener('touchstart',share_btn, function(){
            sharePopUp.targetAlpha = 1;
            sharePopUp.elem.style.visibility = "visible";
        });
        multiverse.eventlistener('touchstart', sharegame_btn, function(){
            sharePopUp.targetAlpha = 1;
            sharePopUp.elem.style.visibility = "visible";
        });
        //success screen
        multiverse.eventlistener('touchstart', gotomulti_btn, function(){
           // currentSubScreen.elem.style.left = '-9999px';
            //removeMenus();
            //selectGameState('mad-scientist');
            //selectMenuScreen('multi');
            successScreen.targetAlpha = 0;
            msiPopUp.targetAlpha = 1;
            msiPopUp.elem.style.visibility = "visible";
        } );

        //shared screen 
        multiverse.eventlistener('touchstart', gotosplash_btn, function(){
            diagram.targetAlpha = 0;
            diagram.elem.style.visibility = 'hidden';
            splashScreen.targetAlpha = 0;
            splashScreen.elem.style.visibility  = 'hidden';
            selectMenuScreen('splash');
        });

        multiverse.eventlistener('touchend', closeShare_btn, function(){
            sharePopUp.elem.style.visibility = "hidden";
            sharePopUp.targetAlpha = 0;
        } );
        multiverse.eventlistener('touchend', shareShade, function(){
            sharePopUp.elem.style.visibility = "hidden";
            sharePopUp.targetAlpha = 0;
        } );


        /*multiverse.eventlistener('touchend', rviShade, function(){
            rviPopUp.elem.style.visibility = "hidden";
            sharePopUp.targetAlpha = 0;
        } );
        multiverse.eventlistener('touchend', msiShade, function(){
            msiPopUp.elem.style.visibility = "hidden";
            sharePopUp.targetAlpha = 0;
        } ); */


        //ms success
        /*multiverse.eventlistener('touchstart', mscontinue_btn, function() {
            removeMenus();
            selectMenuScreen('multi');
        });*/

        multiverse.eventlistener('touchstart', twitter_btn, shareOnTwitter );
        multiverse.eventlistener('touchstart', facebook_btn, shareOnFacebook );

    }

    function noScroll (e) {
        multiverse.cancelevent(e);
    }

    mainMenu = domObject('main-wrapper');
    endScreen = domObject('end-screen');
    splashScreen = domObject('splash-screen');
    multiChoice = domObject('multi-choice');
    successScreen = domObject('success-screen');
    sharedScreen = domObject('shared-screen');
    mssuccessScreen = domObject('ms-success');
    sharePopUp = domObject('share-popup');
    rviPopUp = domObject('rvi-popup');
    msiPopUp = domObject('msi-popup');
    diagram = domObject('diagram');
    jobsCta = domObject('jobs-cta');

    multiverse.eventlistener('touchmove', mainMenu.elem, noScroll);
  

};

multiverse.eventlistener('load', window, scientist_falling.initialize);