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
    B2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    B2ContactListener = Box2D.Dynamics.b2ContactListener,
    animFrame,
    introObj = {}, // = document.getElementById('intro'),
    outroObj = {},
    shareLander = {},
    //statsObj = {},
    scientist = [],
    amoebas = [],
    amoebaFix = new B2FixtureDef(),
    amoebaBod = new B2BodyDef(),
    DNAFix = new B2FixtureDef(),
    DNABod = new B2BodyDef(),
    tankImg = new Image(),
    bubbleImg = new Image(),
    assetsLoaded = 0,
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
    currentBodyImages = [],
    hits = 0,
    mutations = {},
    humanities = {},
    listofMutatedLimbs = [],
    percentageofHumanDNA = 1,
    percentageofMutantDNA = 0,
    currentGameLoopFunction = function(){},
    fallingLoop = function(){},
    introLoop = function(){},
    endLoop = function(){},
    oldState = '',
    ui = {},
    iOSVersion = 0,
    score = 0,
    deathCounter = 0,
    countDownStarted = false,
    countDownStartTime,
    reset = {},
    currentResetFunction = function(){},
    brokenResetFunction = function(){},
    workingResetFunction = function(){},
    currentTouchFunction = function(){},
    gameTouchFunction = function(){},
    nonGameTouchFuntion = function(){},
    particles = [],
    DNApills = [],
    pillImage = new Image(),
    fullBar = document.getElementById('full-bar'),
    emptyBar = document.getElementById('empty-bar'),
    selectGameState = {},
    mutationText = document.getElementById('mutation-text'),
    oldDate = new Date(),
    manlyAlpha = 1,
    flickerCounter = 0,
    resetButton = document.getElementById('playagain'),
    glarePanel = document.getElementById('glare'),
    skeletons= {},
    preSchool = true,
    instructions = {},
    startGameButton1 = document.getElementById('begin-experiment'),
    startGameButton2 = document.getElementById('begin-experiment-2'),
    shareButton = document.getElementById('share'),
    container = {
        x : 0,
        y : -2000
    },
    motor = {
        x : 0,
        y : -20,
        targetY : -20
    },
    motorRotation = 0,
    fingerStartPos = 0,
    velocity_Y = 0,
    oldY = 0,
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
    dnaTimer;

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

    iOSVersion = (function() {
        var version = navigator.userAgent.match('iPod') || navigator.userAgent.match('iPhone') ? 1.0 : 0;
        if (match = /iPhone OS (.*) like Mac OS X/.exec(navigator.userAgent)) {
            version = parseInt(match[1].replace('_', ''), 10) / 100;
            if (version < 1) { version *= 10; }
        }
        return version;
    }());

    function initializeIntro () {
        var startGame = {};
        //introObj.targetAlpha = 1;
        startGame = function () {
            introObj.targetAlpha = 0;
            //introObj.alpha = 0;
            introObj.setCallback(function(){
                selectGameState('game');
            });
        };

        if(creatingAMonster === true) {
            shareLander.targetAlpha = 1;
            shareLander.alpha = 1;
            mutateDiagramImage(javascriptMutationArray);
            multiverse.eventlistener('touchstart', startGameButton2, startGame);
            multiverse.eventlistener('click', startGameButton2, startGame);

            creatingAMonster = false;
        } else {
            introObj.targetAlpha = 1;
            multiverse.eventlistener('touchstart', startGameButton1, startGame);
            multiverse.eventlistener('click', startGameButton1, startGame);
            shareLander.elem.style.marginLeft = '-9000px';
        }

    }
    function cleanUpIntroGarbage() {
        introObj.alpha = 0;
        introObj.elem.style.marginLeft = '-3333px';
        shareLander.alpha = 1;
        shareLander.elem.style.marginLeft = '-3333px';
    }
    function initializeGame () {
        //console.log('initialize game!');
        outroObj.elem.style.marginLeft = "-9000px";
        setTimeout(function(){
            // currentTouchFunction = gameTouchFunction;
        }, 400);
        world = new B2World( new B2Vec2(0,0)/*gravity*/ , false/*allow sleep*/);
        setUpRagDoll();
        setUpDNA();
        setUpAmoebas();
        setUpTube();
        initLines();
        multiverse.eventlistener('touchmove', glarePanel, steer);
        multiverse.eventlistener('touchstart', glarePanel, setFingerPos);
       // multiverse.eventlistener('touchend', glarePanel, releaseScientist);
        setUpCollisionHandler();

        currentTouchFunction = gameTouchFunction;
    }

    function cleanUpGameGarbage() {
        currentTouchFunction = nonGameTouchFuntion;
        clearTimeout(amoebaTimer);
        clearTimeout(dnaTimer);
    }
    function cleanUpEndGarbage () {
        console.log('clean up end garbage');
        currentResetFunction = brokenResetFunction;
        outroObj.targetAlpha = 0;
    }

    function convertMutationToSecretNumber(mutationName) {
        var secretNumber = 0;
        switch(mutationName) {
            case 'chicken':
                secretNumber = 0;
            break;
            case 'skeleton':
                secretNumber = 1;
            break;
            case 'bodybuilder':
                secretNumber = 2;
            break;
            case 'burlesque':
                secretNumber = 3;
            break;
            case 'octopus':
                secretNumber = 4;
            break;
            case 'duck':
                secretNumber = 5;
            break;
            case 'vanillaice':
                secretNumber = 6;
            break;
            case 'poop':
                secretNumber = 7;
            break;
            case 'cyclops':
                secretNumber = 8;
            break;
            case 'macaroni':
                secretNumber = 9;
            break;
            case 'computer':
                secretNumber = 10;
            break;
            case 'ninja':
                secretNumber = 11;
            break;
            case 'meta':
                secretNumber = 12;
            break;
            case 'girl':
                secretNumber = 13;
            break;
            case 'lumberjack':
                secretNumber = 14;
            break;
            case 'robot':
                secretNumber = 15;
            break;
            case 'bagel':
                secretNumber = 16;
            break;
            case 'scientist':
                secretNumber = 17;
            break;
            default :
                secretNumber = 1;

        }
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

    function mutateDiagramImage (mutationArray) {
        var i = 0,
        currentMutation = '',
        mages = document.getElementsByTagName('img');

        for(i = 0; i < body_images.length; i += 1) {
            currentMutation = currentBodyImages[body_images[i]].name;
            for(g = 0; g < mages.length; g += 1) {
                if(mages[g].className === body_images[i]) {
                    mages[g].src = 'images/' + currentMutation + '_' + body_images[i] + '.png';
                }
            }
        }

    }

    function initializeEnd () {
        var textMSG = '',
        abominations = [],
        currentMutation,
        alreadyUsed = false,
        mages = document.getElementsByTagName('img'),
        monsterImageHTML = '',
        twitterString = '',
        queryString = '?mq=',
        i = 0,
        b = 0,
        g = 0,
        sharing = false,
        messageContainer = document.getElementById('end-message');

        //textMSG = 'Scotee Nano has been permanently transformed into a half ';

        for(i = 0; i < body_images.length; i += 1){
            queryString += convertLimbToPrefix(body_images[i]);
            queryString += '=';
            queryString += convertMutationToSecretNumber(currentBodyImages[body_images[i]].name);
            if(i < (body_images.length-1)) {
                queryString += '*';
            }
            //queryString += '*';
        }

        mutateDiagramImage(currentBodyImages);

        textMSG = textMSG.slice(0, (textMSG.length-1));
        textMSG += ' abomination!';
        //statsObj.elem.innerHTML = 'dude, you finished with a score of ' + score + '!';
        //statsObj.elem.innerHTML = textMSG;

        outroObj.elem.style.marginLeft = "0";
        outroObj.targetAlpha = 1;
        outroObj.alpha = 1;
        outroObj.setCallback(
            function(){
                setTimeout(function(){
                    currentResetFunction = workingResetFunction;
                },600);
            });

        multiverse.eventlistener('touchstart', resetButton, reset);
        multiverse.eventlistener('click', resetButton, reset);

        //message
        console.log('percentage of human DNA is ' + percentageofHumanDNA);
        if(Math.round(percentageofHumanDNA) === 0) {
            textMSG = 'Oh no! Doctor Nano has been permanently mutated into a horrible freak!<br />' +
                        'His wife may never find him sexually attractive again!';
        } else if (Math.round(percentageofHumanDNA* 100) === 100) {
            textMSG = 'Doctor Nano has made it out of the tube with his DNA completely uncontaminated! ' +
                        'He is happy, but not very intersting...<br /> Play mad-scientist bonus round and see what' +
                        ' you can turn him into!';
        } else {
            textMSG = 'Doctor Nano made it out of the tube, but his DNA is only ' + (percentageofHumanDNA * 100) +
                    '% human.<br />Get him out with 100% human DNA to unlock mad-scientist bonus round!';
        }
        messageContainer.innerHTML = textMSG;

        //twitter parameters
        //text
        //original_refferer
        //url
        twitterString = 'https://twitter.com/share' +
                        '?original_referer=https%3A%2F%2Fiphone.stonecanoe.ca' +
                        '&source=tweetbutton' +
                        '&text=I%20created%20this%20abomination!' +
                        '&url=http://iphone.stonecanoe.ca/' + queryString;
                        //?h=15&amp;t=15&amp;fr=4&amp;fl=0&amp;b=4&amp;cr=0&amp;cl=2&amp;th=3&amp;';

        function shareOnTwitter () {
           if(sharing === false) {
                 sharing = true;
                 window.open(twitterString);
            }
        }

        multiverse.eventlistener('click', shareButton, shareOnTwitter);
        multiverse.eventlistener('touchend', shareButton, shareOnTwitter);
    }

    selectGameState = function (state) {

        console.log('game state is now ' + state);

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
        }

        switch(state) {
            case 'intro':
                initializeIntro();
                currentGameLoopFunction = introLoop;
            break;
            case 'game':
                initializeGame();
                currentGameLoopFunction = fallingLoop;
            break;
            case 'end':
                initializeEnd();
                currentGameLoopFunction = endLoop;
            break;
        }

        oldState = state;
    };

    ui = (function () {
        var ux = {},
            currentMeterLevel = 1,
            alertCounter = 0,
            countDownFontSize,
            countDownAlpha,
            oldCount = 222,
            displayScore = 0;

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

            ux.countdown = { text : '', fontSize : 0, x : 0, y : 0, alpha : 1 };

            ux.update = function () {
                var meterWidth = 309,
                targetMeterLevel = meterWidth * percentageofMutantDNA;
                currentMeterLevel += (targetMeterLevel - currentMeterLevel) * 0.1;
                ux.meter.greenbar.width = currentMeterLevel;

                /* if(percentageofHumanDNA > 0 ) {

                } else */

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
            };

            ux.render = function () {
                var gren = ux.meter.greenbar,
                tex = ux.meter.textfield,
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
    function radians (deg) { return (deg * Math.PI) /180; }

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
        obj = {};

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
            superArray[nameArray[b]] = new Image();
            multiverse.eventlistener('load', superArray[nameArray[b]], incrementLoadCount);
            src = 'images/' + prefix + '_' + nameArray[b]+ '.png';
            superArray[nameArray[b]].src = src;
            obj = objectCreator(superArray[nameArray[b]], 'scientist');
            obj.isHuman = true;
            superArray[nameArray[b]] = obj;
        }

        return superArray;
    }

    function loadHandler () {
        assetsLoaded += 1;
        /*if( assetsLoaded === totalAssets ) {
            //allSystemsGo();
        } */
    }

    function loadManager( img , src, nam) {
        var naim = nam || null;
        totalAssets += 1;
        img.src = src;
        if(naim !== null) {
            img.name = naim;
        }

        multiverse.eventlistener('load', img, loadHandler);
    }

    function drFrankenstein (d,f,scal,cX,cY) {
        var s = scal || 30,
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
 
    function jointFusion (d,cX,cY,scal) {
        var def = d,
        centX = cX,
        centY = cY,
        s = scal;
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

    function tether(bod, xPos, yPos, dist, s) {
        var tetherDef = new B2BodyDef(),
        tetherFix = new B2FixtureDef(),
        tempFilt,
        a = {},
        tetherJ;

        tetherFix.density = 0.02;
        tetherFix.friction = 0;
        tetherFix.restitution = 4;
        tetherDef.type = b2Body.b2_dynamicBody;

        //tetherDef.type = b2Body.b2_staticBody;
        tetherFix.shape = new B2CircleShape(0);
        tempFilt =  tetherFix.filter;
        tempFilt.categoryBits = 2;
        tempFilt.maskBits = 2;
        tetherFix.filter = tempFilt;
        ///tetherFix.SetFilterData();
        tetherDef.position.x = (xPos) / s;
        tetherDef.position.y = yPos / s;
        a.body = world.CreateBody(tetherDef);
        a.fixture = a.body.CreateFixture(tetherFix);
        tetherJ = new B2DistanceJointDef();
        //tetherJ = new B2RevoluteJointDef();
        tetherJ.Initialize(a.body, bod, new B2Vec2((xPos)/s, (yPos+dist)/s), new B2Vec2((xPos)/s, yPos/s));
        world.CreateJoint(tetherJ);
        a.vx = 0;
        a.vy = 0;
        return a;
    }

    //making an object takes three things...
    //--fixture definition
    //--body definition
    //--shape

    function createRagDoll (cX,cY,scal) {
        var jointDef = new B2RevoluteJointDef(),
        bodyDef = new B2BodyDef(),
        fixDef = new B2FixtureDef(),
        frankenstein,
        fusion,
        centX = cX || canvaswidth * 0.5,
        centY = cY || canvaswidth * 0.5,
        s = scal || scale,
        rightArm,
        leftArm,
        rightThigh,
        leftThigh,
        rightForeArm,
        leftForeArm,
        rightCalf,
        leftCalf,
        neck,
        head,
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
        fixDef.density = 0.0005;
        fixDef.friction = 0.00005;
        fixDef.restitution = 0.04;
        bodyDef.type = b2Body.b2_dynamicBody;

        frankenstein = drFrankenstein(bodyDef, fixDef, s, centX, centY);
        fusion = jointFusion(jointDef, centX, centY, s);

        //body parts
        torso = frankenstein(0, 0, 29, 28, 'torso');

        rightArm = frankenstein(23, 8, 8, 16, 'bicep');
        leftArm = frankenstein(-24, 6, 8, 16, 'bicep');
        rightThigh = frankenstein(9, 53, 9, 16, 'thigh');
        leftThigh = frankenstein(-14, 53, 9, 16, 'thigh' );

        //rightForeArm = frankenstein(24, 49, 10, 22, 'forearm_right');
        //leftForeArm = frankenstein(-28, 49, 10, 22, 'forearm_left');

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
        anchor = tether(head.body, centX, centY-60, 4, s);
    }

    /*var debugDraw = new B2DebugDraw();
    debugDraw.SetSprite(context);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(B2DebugDraw.e_shapeBit | B2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);*/

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

    function updateParticles () {
        var i = 0,
        p = {};

        for(i = 0; i < particles.length; i+= 1) {
            p = particles[i];
            p.alpha -= 0.04;
            p.x += p.vx;
            p.y += p.vy;
            if(p.alpha <= 0 ) {
                particles.splice(i, 1);
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
                //console.log('remove');
            }

        }
    }

    function updateaManlyOpacity () {

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
        var scientistYPos = scientist[1].body.GetPosition().y;
        if(scientistYPos < -2000 ) {
            selectGameState('end');
        }
        motor.y += ((motor.targetY - motor.y) * 0.1);
        anchor.body.ApplyForce(new B2Vec2(motor.x,motor.y), anchor.body.GetWorldCenter() );
        //anchor.body.ApplyImpulse( new B2Vec2(motor.x, 0), anchor.body.GetWorldCenter() );
        //console.log('motor.x is ' + motor.x);
        motor.x *= 0.92;
    }

    function updateCamera() {
        var scientistXPos = scientist[1].body.GetPosition().x,
        scientistYPos = scientist[1].body.GetPosition().y,
        targetY = 0;
        targetY = (-scientistYPos * scale) + (canvasheight * 0.85);

        container.y = container.y + ((targetY - container.y) * 0.14);
        //container.x = (-scientistXPos * scale) + canvaswidth * 0.5;

        velocity_Y = oldY - (scientistYPos * scale);
        oldY = scientistYPos * scale;
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

    function updateLines () {
        var i = 0,
        ln;
    }

    function updateGame(){
        var timeDelta = (new Date() - oldDate),
        fps = bitwise(1000/ timeDelta);
       // console.log('game is running at ' + fps + ' frames per second');
        oldDate = new Date();
        if(fps <= 0) {
            fps = 15;
        }
        updateCamera();
        updateZoom();
        //updateBubbles();
        //updateLines();
        world.Step((1/fps), 30 , 30 );
        world.ClearForces();
        cleanUpWaste(amoebas);
        cleanUpWaste(DNApills);
        if(iOSVersion > 4) {
            //updateAmoebas(tinyAmoebas, 0);
            //updateAmoebas(giantAmoebas,-3000);
        }
        updateaManlyOpacity();
        updateDeathCounter();
        
        ui.update();
        if(preSchool === true) {
            instructions.update();
        }
    
    }

    
    function renderScientist() {
        var limb = {}, i = 0, img,
        superscale = 1.4,
        widd = 0,
        hidd = 0,
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
            
            img = currentBodyImages[limb.name].img;
            //widd = limb.width * superscale;
            ///hidd = limb.height * superscale;
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
        //console.log('hey');
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

    function randomColor () {
        var r = Math.floor(Math.random() * 255),
            g = Math.floor(Math.random() * 255),
            b = Math.floor(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';

    }

    function renderParticles () {
        var i = 0,
        p = {};
        
        for(i = 0; i < particles.length; i+= 1) {
            p = particles[i];
            context.save();
            context.globalAlpha = p.alpha;
            
            context.fillStyle = randomColor();
            context.beginPath();
            context.arc(p.x,p.y, 2, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
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
            if(container.y + (ln.yPos * scale) < canvasheight &&  container.y + (ln.yPos * scale) > 0) {
                context.fillRect(container.x + (ln.xPos * scale), container.y + (ln.yPos * scale), (ln.width * scale), ln.height);
                if(ln.text !== null) {
                    context.textAlign = 'left';
                    context.font = "bold  42px arial";
                  //  context
                    context.fillText(ln.text, (ln.width * scale), container.y + (ln.yPos* scale) + (ln.width * 2));
                }
            }
            //context.fillRect(ln.xPos, ln.yPos, ln.width, 12);
        }

    }

    function renderGame() {
        var oldDate = new Date();
        context.clearRect(0,0,canvaswidth, canvasheight);
        if(iOSVersion > 4) {
            //renderNonWorldAmoebas(tinyAmoebas,context);
            //renderNonWorldAmoebas(giantAmoebas,foreground);
        }
        //renderBubbles();
        renderScientist();
        renderAmoebas();
        //world.DrawDebugData();
        renderDNA();
        ui.render();
        renderLines();
        if(preSchool === true) {
        //  instructions.render();
        }
    }

    introLoop = function() {
        introObj.update();
        introObj.render();
        shareLander.update();
        shareLander.render();
        //updateGame();
        //renderGame();
    };

    fallingLoop = function () {
        //console.log('falling loop');
        updateGame();
        renderGame();
    };

    endLoop = function () {
        outroObj.update();
        outroObj.render();
    };

    function runGame() {
        currentGameLoopFunction();
        animFrame(runGame);
    }


    function releaseAmoeba () {
        var x, // = e.pageX || e.touches[0].pageX,
        y, // = e.pageY || e.touches[0].pageY,
        amoeba = {},
        rand,
        yPos = 0;

        //console.log('release amoeba!');

       //yPos =  scientist[1].body.GetPosition().y;
       if(amoebas.length < 3) {
            x = Math.random() * (canvaswidth / scale);
           // y = yPos + (-(Math.random() * canvasheight * 35) / scale) - ((canvasheight * 2) /scale);

            y = (-container.y / scale) -5;


            rad = 40 / scale; //(((Math.random() * 35) + 18) / scale);
            amoebaFix.shape = new B2CircleShape(rad);
            //amoebaBod.position.x = (container.x + x) +  x/scale;
            //amoebaBod.position.y = (container.y + y) + y/scale;
            amoebaBod.position.x =  x;
            amoebaBod.position.y =  y;
            amoebaBod.bullet = true;

            amoeba.body = world.CreateBody(amoebaBod);
            amoeba.fixture = amoeba.body.CreateFixture(amoebaFix);
            amoeba.radius = rad;
            rand = Math.floor(Math.random() * amoebaModels.length );
            amoeba.image = amoebaModels[rand];
            amoeba.scaledRadius = bitwise(rad * scale);
            amoeba.scaledWidth = bitwise((rad *2) * scale);
            amoeba.isVirus = true;
            amoeba.body.SetAngularVelocity(Math.random()*8 -4);
            amoeba.alpha = 1;
            amoeba.body.parentObj = amoeba;
            amoebas.push(amoeba);
       }
       
        amoebaTimer = setTimeout(releaseAmoeba, Math.random()* 1000 + 1000);

    }

    function releaseDNA () {
        var yPos = 0,
        x = 0,
        y = 0,
        pill = {},
        widf = 44,
        hite = 20;

        //yPos = scientist[1].body.GetPosition().y;

        if(DNApills.length < 1) {
            x = (Math.random() * canvaswidth) / scale;
            //y = yPos + (-(Math.random() * canvasheight * 35) / scale);
            y = y = (-container.y / scale) -5;


            DNAFix.shape = new  B2PolygonShape();
            DNAFix.shape.SetAsBox(widf/scale,hite/scale);
            DNABod.position.x = x;
            DNABod.position.y = y;
            pill.width = widf;
            pill.height = hite;
            pill.body = world.CreateBody(DNABod);
            pill.body.SetAngularVelocity(Math.random()*8 -4);
            pill.fix = pill.body.CreateFixture(DNAFix);
            pill.isDNA = true;
            pill.image = pillImage;
            pill.body.parentObj = pill;
            DNApills.push(pill);
        }

        dnaTimer = setTimeout(releaseDNA, Math.random() * 4000 + 4000);
    }


    function clickRelay (evt) {
        var e = evt || window.event;

        multiverse.cancelevent(e);
        currentTouchFunction(e);
    }

    gameTouchFunction = function(e) {
        var cx = 0,
        cy = 0,
        sx = 0,
        sy = 0,
        distX = 0,
        distY = 0,
        dist = 0;

        if(e.touches !== undefined) {
            cx = e.touches[0].pageX;
            cy = e.touches[0].pageY;
        } else if (e.pageX !== undefined) {
            cx = e.pageX;
            cy = e.pageY;
        }
        sx = scientist[1].body.GetPosition().x * scale;
        sy = scientist[1].body.GetPosition().y * scale;
        distX = sx - cx;
        distY = sy - cy;
        dist = Math.sqrt((distX*distX) + (distY * distY));

        if(dist > 100 ) {
            //releaseAmoeba(e);
        }
        
    };

    nonGameTouchFuntion = function () {
        //do nothing
    };

    function sizeCanvas (ww,hh) {
        var outerWidth = ww || window.innerWidth,
        outerHeight = hh || window.innerHeight;
        //contaDiv = document.getElementById('wrap');

        canvaswidth = bitwise(outerWidth);
        canvasheight = bitwise(outerHeight - 10);

        canvas.height = canvasheight;
        canvas.width = canvaswidth;

    }

    function resizeCanvas (ww,hh) {
        var outerWidth = ww || window.innerWidth,
        outerHeight = hh || window.innerHeight;

        canvaswidth = bitwise(outerWidth - 10);
        canvasheight = bitwise(outerHeight - 10);

        canvas.height = canvasheight;
        canvas.width = canvaswidth;

        emptyBar.style.top = (canvasheight * 0.13) + 'px';
        emptyBar.style.left = 22 + 'px';
        fullBar.style.top = (canvasheight * 0.13) + 'px';
        fullBar.style.left = 22 + 'px';
        mutationText.style.top = ((canvasheight * 0.13) + 8) + 'px';
    }

    document.changeSize = function(widf,hite,sway) {
        sideways = sway;
        resizeCanvas(widf,hite);
    };

    function initKillerAmoebas() {
        var i = 0;
        //upped it to 140, so I could die easier, it was at 80 before.
       // for(i = 0; i < 12; i += 1) {
        amoebaTimer = setTimeout( releaseAmoeba, 2000);
        //}
    }

    function initPills () {
       /* var i = 0;
        for(i = 0; i < 16; i += 1) {
          //  releaseDNA();
        }*/
        dnaTimer = setTimeout(releaseDNA, Math.random()* 4000 + 4000);
    }

    function initTinyAmoebas () {
        var m = 0, meeba = {};
        for(m = 0; m < 18; m += 1) {
            meeba = {};
            meeba.x = Math.random() * canvaswidth;
            meeba.y = Math.random() * canvasheight;
            
            meeba.image = tinyAmoebaModels[ Math.floor(Math.random()*tinyAmoebaModels.length) ];
            meeba.radius = (Math.random() * 3 + 3);
            meeba.vy = -meeba.radius;
            meeba.vx = 0;
            meeba.rotation = 0;
            meeba.alpha = Math.random();
            if(meeba.alpha > 0.6 ) {
                meeba.alpha *= 0.5;
            }
            meeba.vr = Math.random() * 16 - 8;
            tinyAmoebas.push(meeba);
        }
    }

    function initGiantAmoebas () {
        var m = 0, meeba = {};
        for(m = 0; m < 4; m += 1) {
            meeba = {};
            meeba.x = Math.random() * canvaswidth;
            meeba.y = (m * -800) + 800;//Math.random() * (canvasheight - 5000);
            meeba.image = giantAmoebaModels[ m ];
            meeba.radius = (Math.random() * 40 + 140);
            meeba.vy = -meeba.radius / 80;
            meeba.vx = 0;
            meeba.rotation = 0;
            meeba.vr = Math.random() * 2 - 1;
            meeba.alpha = 0.5;
            giantAmoebas.push(meeba);
        }
    }

    function initLines() {
        var i = 0,
        ln;

        for (i = 0; i <= 100; i += 1) {
            ln = {};
            ln.xPos = 0;
            ln.yPos = (i * -20);
            if(i % 5 === 0) {
                ln.width = 16;
                ln.height = 12;
                ln.text = ((ln.yPos + 2000) * 0.1) + 'ml';
            } else {
                ln.width = 8;
                ln.height = 6;
                ln.text = null;
            }
            lines.push(ln);
        }
    }


    function fancyGravity(e) {
        var xforce = 0, yforce = 0, meeba = {}, i = 0;
        if(e) {
            if(sideways === false ) {
                xforce = e.accelerationIncludingGravity.x * -15;
                yforce = e.accelerationIncludingGravity.y * 15;
            } else {
                yforce = e.accelerationIncludingGravity.x * -15;
                xforce = e.accelerationIncludingGravity.y * -15;
            }

            world.SetGravity(new B2Vec2(xforce,yforce));

            for(i = 0; i < tinyAmoebas.length; i+= 1) {
                meeba = tinyAmoebas[i];
                meeba.vy = meeba.radius * (yforce/50);
                meeba.vx = meeba.radius * (xforce/50);
            }
        }
    }

    function checkForiOS() {
        var uagent = navigator.userAgent.toLowerCase();
        if ( uagent.search("iphone") > -1 || uagent.search("ipad") > -1 ) {
            iPhone = true;
        }
        if(iPhone === true) {
            //multiverse.eventlistener('devicemotion', window, fancyGravity);
        }
    }

    function setUpDNA () {
        DNAFix.density = 0.001;
        DNAFix.friction = 0;
        DNAFix.restitution = 4;
        DNABod.type = b2Body.b2_dynamicBody;
        initPills();
    }

    function setUpAmoebas() {
        //amoebaFix.density = 0.20;
        amoebaFix.density = 1;
        amoebaFix.friction = 0;
        //amoebaFix.restitution = 0.1;
        amoebaFix.restitution = 1;
        amoebaBod.type = b2Body.b2_dynamicBody;
        amoebaCreator(amoebaModels, 'main', 5);
        //amoebaCreator(tinyAmoebaModels, 'smallwhite', 4);
        //amoebaCreator(giantAmoebaModels, 'largeOOF', 4);
       // initTinyAmoebas();
        initKillerAmoebas();
        //initGiantAmoebas();
    }

    function setUpTube () {
        var tubeWallDef = new B2BodyDef(),
        tubeWallFix = new B2FixtureDef(),
        tubeWallDef2 = new B2BodyDef(),
        tubeWallFix2 = new B2FixtureDef(),
        leftWall = {},
        rightWall = {},
        tetherJ;

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

    function setUpRagDoll() {
        tetherX = canvaswidth*0.5;
        tetherY = canvasheight* 0.6;
        createRagDoll((canvaswidth*0.5), (canvasheight* 0.6), scale);
    }

    function createSplosion (xp,yp) {
        var numb = bitwise( Math.random() * 9),
        i = 0,
        newP = {};

        if(particles.length < 30 ) {
            for (i = 0; i < numb ; i += 1) {
                newP = {
                    x : xp,
                    y : yp,
                    vx : Math.random() * 10 - 5,
                    vy : Math.random() * 10  - 5,
                    alpha : 1
                };
                particles.push(newP);
            }
        }
    }

    function switchLimb (limbName, newLimb) {
        if(newLimb.img.width > 0 ) {
            currentBodyImages[limbName] = newLimb;
            calculateMutationPercentage();
        } else {
            return false;
        }
    }

    function dehumanize () {
        var limb,
        randLimb,
        newLimb;
        flickerCounter = 0;
        limb = body_images[ Math.floor(Math.random() * body_images.length )];
        randLimb = Math.floor( Math.random() * mutations[limb].length );
        newLimb = mutations[limb][randLimb];
        switchLimb(limb, newLimb);
        if(preSchool === true) {
            preSchool = false;
        }
    }

    function humanize () {
        var newLimb,
        limb;
         flickerCounter = 0;

        if(listofMutatedLimbs.length > 0) {
            limb = listofMutatedLimbs[ Math.floor(Math.random() * listofMutatedLimbs.length )];
            newLimb = humanities[limb][0];
        } else {
            newLimb = { img : {  width : 0 } };
        }
       // motor.y = -4000;
        switchLimb(limb, newLimb);
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
            
            if(contact.GetFixtureA().GetBody().parentObj.isVirus === true ||
                contact.GetFixtureB().GetBody().parentObj.isVirus === true) {
                //virus is hitting something
                if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    contact.GetFixtureA().GetBody().parentObj.destroy = true;
                    dehumanize();
                } else if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    contact.GetFixtureB().GetBody().parentObj.destroy = true;
                    dehumanize();
                }
            }

            if(contact.GetFixtureB().GetBody().parentObj.isDNA === true ||
                contact.GetFixtureA().GetBody().parentObj.isDNA === true ) {
                //dna pill is colliding
                if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    contact.GetFixtureB().GetBody().parentObj.destroy = true;
                    humanize();
                } else if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    contact.GetFixtureA().GetBody().parentObj.destroy = true;
                    humanize();
                }
            }

        };

        world.SetContactListener(listener);
    }

    function randomAmoebaDropper () {
        setTimeout(function() {
            /*if(percentageofHumanDNA < 1 && DNApills.length < 2) {
                if(deathCounter === 0) { releaseDNA();}
            }*/
            releaseAmoeba();
            randomAmoebaDropper();
        }, (Math.random() * 1000 ) + 1000);
    }

    function checkLocalStorage() {
        if(typeof window.localStorage === 'undefined') {
            hits = 0;
            return;
        }
        //hits = parseInt( localStorage.getItem('hits'), 10 ) || 0;
    }

    function steer (evt) {
        var e = evt || window.event,
        x = 0,
        y = 0,
        directionVector = 0,
        rotations,
        xPos = 0,
        yPos = 0;

        if(e.touches !== undefined) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        } else if (e.pageX !== undefined) {
            x = e.pageX;
            y = e.pageY;
        }

        directionVector = x - fingerStartPos;
        //xPos = scientist[1].body.GetPosition().x;
        yPos = scientist[1].body.GetPosition().y;
        anchor.body.SetPosition(new B2Vec2(x/scale,yPos));
        motor.x = (directionVector * 0.1);
        //scientist[1].body.x = (x / scale);
        //motor.x = x - (canvaswidth * 0.5);
      //  motor.x = ((scientist[1].body.GetPosition().x) - (x/scale) * 10);
        //console.log('scientist is at ' + scientist[1].body.GetPosition().x);
        //console.log('finger is at ' + (x/scale));
        //var target =  (scientist[1].body.GetPosition().x) - (x/scale);
       // console.log('target is ' + target );
        //motor.x = -target * 2;
        multiverse.cancelevent(e);

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

    function releaseScientist (evt) {
        console.log('hey');
        var e = evt || window.event,
        x = 0,
        directionVector = 0;

        //if(e.touches !== undefined) {
           // x = e.touches[0].pageX;
        //} else if (e.pageX !== undefined) {
            x = e.pageX;
       // }

      //  directionVector = x - fingerStartPos;
       // motor.x = -(directionVector * 0.1);
       // console.log('release him!');

    }

    function allSystemsGo(game) {
        checkForiOS();
        sideways = (function () {
            return (window.innerHeight < window.innerWidth);
        }());
        sizeCanvas(window.innerWidth, window.innerHeight);
        selectGameState('intro');
        runGame();
    }

    function mutantParts(parts, suffix) {
        var img,
        obj,
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

    brokenResetFunction = function () {
        //do nothing!
    };

    workingResetFunction = function () {
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
        container.x = 0;
        container.y = -2000;
        //score = 0;
        //outroObj
        fullBar.style.width = 0 + 'px';
        outroObj.targetAlpha = 0;
        outroObj.alpha = 0;
        outroObj.setCallback(function(){
            currentResetFunction = brokenResetFunction;
            selectGameState('game');
        });
    };

    function makeScientistMutant () {
        var i = 0;
        for(i = 0; i < body_images.length; i += 1) {
            humanities[body_images[i]].push( scientistBody[body_images[i]] );
        }
        
    }

    function makeSkeletonMan () {
        var i = 0;
        for(i = 0; i < body_images.length; i += 1) {
            skeletons[body_images[i]].push( scientistBody[body_images[i]] );
        }
    }

    loadManager(tankImg, "images/tank.png");
    loadManager(bubbleImg, "images/bubble.png");
    loadManager(pillImage, "images/DNAPill.png", "dna");

    humanities = bodyObject();
    mutations = bodyObject();
    //skeletons = bodyObject();

    introObj = domObject('intro');
    shareLander = domObject('share-lander');
    outroObj = domObject('outro');
    //statsObj = domObject('stats');

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
        allSystemsGo(false);
    });

    function noScroll (evt) {
        var e = evt || window.event;
        //multiverse.cancelevent(e);
    }

    multiverse.eventlistener('touchstart', window, noScroll);
    multiverse.eventlistener('touchmove', window, noScroll);
    multiverse.eventlistener('click', window, noScroll);

};


multiverse.eventlistener('load', window, scientist_falling.initialize);