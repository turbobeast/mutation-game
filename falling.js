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
    introObj = {}, // = document.getElementById('intro'),
    outroObj = {},
    shareLander = {},
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
    introLoop = function(){},
    endLoop = function(){},
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
    iOSVersion = 0,
    score = 0,
    deathCounter = 0,
    countDownStarted = false,
    countDownStartTime,
    reset = {},
    particles = [],
    DNApills = [],
    pillImage = new Image(),
    superPillImg = new Image(),
    ebolaImg = new Image(),
    fullBar = document.getElementById('full-bar'),
    emptyBar = document.getElementById('empty-bar'),
    mutationText = document.getElementById('mutation-text'),
    resetButton = document.getElementById('playagain'),
    glarePanel = document.getElementById('glare'),
    startGameButton1 = document.getElementById('begin-experiment'),
    startGameButton2 = document.getElementById('begin-experiment-2'),
    shareButton = document.getElementById('share'),
    oldDate = new Date(),
    manlyAlpha = 1,
    flickerCounter = 0,
    skeletons= {},
    preSchool = true,
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
    dnaTimer,
    twitterString = '',
    shareOnTwitter,
    cameraTarget = 0,
    killerReleased = false;

    shareOnTwitter = function() {
        window.open(twitterString);
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
        outroObj.elem.style.marginLeft = "-9000px";
        world = new B2World( new B2Vec2(0,0)/*gravity*/ , false/*allow sleep*/);
        setUpGameRagDoll();
        setUpDNA();
        //start random firing of DNA
        dnaTimer = setTimeout(releaseDNA, Math.random()* 4000 + 4000);
        setUpAmoebas();
        //start random firing of Amoebas
        amoebaTimer = setTimeout(createRandomAmoeba, 2000);

        killerReleased = false;

        //setTimeout(releaseEbola, Math.random() * 14000 + 4000);
        setUpTube();
        initLines();

        currentTouchMoveFunction = steer;
        currentTouchStartFunction = setFingerPos;
        setUpCollisionHandler();
        cameraTarget = canvasheight * 0.85;
        currentGameLoopFunction = fallingLoop;
    }

    function initializeMadScientist () {
        outroObj.elem.style.marginLeft = "-9000px";
        world = new B2World( new B2Vec2(0,0)/*gravity*/ , false/*allow sleep*/);
        setUpMadScientistRagDoll();
        setUpDNA();
        dnaTimer = setTimeout(fireDNA, Math.random()* 4000 + 4000);
        setUpAmoebas();
        currentAcceleromterFunction = fancyGravity;
        currentTouchStartFunction = dropAmoeba;
        setUpCollisionHandler();
        cameraTarget = canvasheight * 0.5;
        currentGameLoopFunction = madScienceLoop;
    }

    function cleanUpGameGarbage() {
        currentTouchMoveFunction = brokenFunction;
        currentTouchStartFunction = brokenFunction;
        clearTimeout(amoebaTimer);
        clearTimeout(dnaTimer);
    }

    function cleanUpMadScientistGarbage() {
        currentAcceleromterFunction = brokenFunction;
        clearTimeout(dnaTimer);
    }

    function cleanUpEndGarbage () {
        console.log('clean up end garbage');
        currentResetFunction = brokenResetFunction;
        outroObj.targetAlpha = 0;
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

    function mutateDiagramImage () {
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
        queryString = '?mq=',
        i = 0,
        messageContainer = document.getElementById('end-message');
        //textMSG = 'Scotee Nano has been permanently transformed into a half ';

        for(i = 0; i < body_images.length; i += 1){
            queryString += convertLimbToPrefix(body_images[i]);
            queryString += '=';
            queryString += convertMutationToSecretNumber(currentBodyImages[body_images[i]].name);
            if(i < (body_images.length-1)) {
                queryString += '*';
            }
        }

        mutateDiagramImage();

        textMSG = textMSG.slice(0, (textMSG.length-1));
        textMSG += ' abomination!';

        outroObj.elem.style.marginLeft = "0";
        outroObj.targetAlpha = 1;
        outroObj.alpha = 1;
        outroObj.setCallback(
            function(){
                setTimeout(function(){
                    //currentResetFunction = workingResetFunction;
                },600);
            });

        //message
        console.log('percentage of human DNA is ' + percentageofHumanDNA);
        if(Math.round(percentageofHumanDNA) === 0) {
            textMSG = 'Oh no! Doctor Nano has been permanently mutated into a horrible freak!<br />' +
                        'His wife may never find him sexually attractive again!';
            currentResetFunction = tryAgainFunction;
            resetButton.innerHTML = 'try again';
        } else if (Math.round(percentageofHumanDNA* 100) === 100) {
            textMSG = 'Doctor Nano has made it out of the tube with his DNA completely uncontaminated! ' +
                        'He is happy, but not very intersting...<br /> Play mad-scientist bonus round and see what' +
                        ' you can turn him into!';
            currentResetFunction = tryMadScientistFunction;
            resetButton.innerHTML = 'mad-scientist mode';
        } else {
            textMSG = 'Doctor Nano made it out of the tube, but his DNA is only ' + (percentageofHumanDNA * 100) +
                    '% human.<br />Get him out with 100% human DNA to unlock mad-scientist bonus round!';
            currentResetFunction = tryAgainFunction;
            resetButton.innerHTML = 'try again';
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

    }

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
                currentGameLoopFunction = introLoop;
            break;
            case 'game':
                initializeGame();
            break;
            case 'end':
                initializeEnd();
                currentGameLoopFunction = endLoop;
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
            tetherFix.restitution = 4;
            tetherDef.type = b2Body.b2_dynamicBody;
         } else {
             tetherDef.type = b2Body.b2_staticBody;
         }
       
        tetherFix.shape = new B2CircleShape(0);
        tempFilt =  tetherFix.filter;
        tempFilt.categoryBits = 2;
        tempFilt.maskBits = 2;
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
        fixDef.density = 0.0005;
        fixDef.friction = 0.00005;
        fixDef.restitution = 0.04;

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
        motor.y += ((motor.targetY - motor.y) * 0.1);
        anchor.body.ApplyForce(new B2Vec2(motor.x,motor.y), anchor.body.GetWorldCenter() );
        motor.x *= 0.92;
    }

    function updateCamera() {
        var scientistXPos = scientist[1].body.GetPosition().x,
        scientistYPos = scientist[1].body.GetPosition().y,
        targetY = 0;
        targetY = (-scientistYPos * scale) + cameraTarget;
        container.y = container.y + ((targetY - container.y) * 0.14);
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

    function checkifScientistisOutofTube () {
        var scientistYPos = scientist[1].body.GetPosition().y;
        if(scientistYPos < -2000 ) {
            selectGameState('end');
        }
        if(killerReleased === false) {
            if(scientistYPos < -1000) {
                killerReleased = true;
                releaseEbola();
            }
        }
    }

    function updateGame(){
        var timeDelta = (new Date() - oldDate),
        fps = bitwise(1000/ timeDelta);
       // console.log('game is running at ' + fps + ' frames per second');
        oldDate = new Date();
        if(fps <= 0) {
            fps = 15;
        }
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
        updateCamera();
        updateaManlyOpacity();
        cleanUpMadScientistWaste(amoebas);
        cleanUpMadScientistWaste(DNApills);
        updateDeathCounter();
        ui.update();
        /*if(preSchool === true) {
            instructions.update();
        }*/
        world.Step((1/fps), 30 , 30 );
    }

    function renderMadScientistMode () {
        context.clearRect(0,0,canvaswidth, canvasheight);
        /*if(iOSVersion > 4) {
            //renderNonWorldAmoebas(tinyAmoebas,context);
            //renderNonWorldAmoebas(giantAmoebas,foreground);
        } */
        renderScientist();
        renderAmoebas();
        renderDNA();
        ui.render();
        //renderLines();
        /*if(preSchool === true) {
        //  instructions.render();
        } */
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
            
            img = currentBodyImages[limb.name].img;
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
        }

    }

    function renderGame() {
        context.clearRect(0,0,canvaswidth, canvasheight);
        /*if(iOSVersion > 4) {
            //renderNonWorldAmoebas(tinyAmoebas,context);
            //renderNonWorldAmoebas(giantAmoebas,foreground);
        }*/
        //renderBubbles();
        renderScientist();
        renderAmoebas();
        renderDNA();
        ui.render();
        renderLines();
    }

    introLoop = function() {
        introObj.update();
        introObj.render();
        shareLander.update();
        shareLander.render();
    };

    fallingLoop = function () {
        //console.log('falling loop');
        updateGame();
        renderGame();
    };

    madScienceLoop = function () {
        updateMadScientistMode();
        renderMadScientistMode();
    };

    endLoop = function () {
        outroObj.update();
        outroObj.render();
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
            y = (-container.y / scale) -5;
            releaseAmoeba(x,y);
        }
        amoebaTimer = setTimeout(createRandomAmoeba, Math.random()* 1000 + 1000);
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
        }
    }

    function createAmoeba (x,y) {
        var amoeba = {},
        rad = 40/scale;

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
       //amoeba.image = ebolaImg;
        amoebas.push(amoeba);
    }

    function releaseEbola () {
        var virus,
        x = 0,
        y = 0;
        x = Math.random() * (canvaswidth / scale);
        y = (-container.y / scale) -5;
        virus = createAmoeba(x,y);
        virus.isEbola = true;
        virus.image = ebolaImg;
        amoebas.push(virus);
       
    }

    function fireDNA () {
        var xPos,
        yPos,
        pill = {},
        vx = 0,
        vy = 0,
        scientistYPos = 0,
        scientistXPos = 0;

        if(percentageofHumanDNA > 0) {
            scientistXPos = scientist[1].body.GetPosition().x;
            scientistYPos = scientist[1].body.GetPosition().y;
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
            pill = makePill(x,y);
            pill.isDNA = true;
            pill.image = pillImage;
            DNApills.push(pill);
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

    function touchStartRelay (evt) {
        var e = evt || window.event;
        multiverse.cancelevent(e);
        currentTouchStartFunction(e);
    }

    function touchMoveRelay (evt) {
        var e = evt || window.event;
        multiverse.cancelevent(e);
        currentTouchMoveFunction(e);
    }

    function sizeCanvas (ww,hh) {
        var outerWidth = ww || window.innerWidth,
        outerHeight = hh || window.innerHeight;

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

    function accelerometerRelay (evt) {
        currentAcceleromterFunction(evt);
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
        amoebaFix.density = 1;
        amoebaFix.friction = 0;
        amoebaFix.restitution = 1;
        amoebaFix.shape = new B2CircleShape(40/scale);
        amoebaBod.type = b2Body.b2_dynamicBody;
        amoebaCreator(amoebaModels, 'main', 5);
    }

    function setUpTube () {
        var tubeWallDef = new B2BodyDef(),
        tubeWallFix = new B2FixtureDef(),
        tubeWallDef2 = new B2BodyDef(),
        tubeWallFix2 = new B2FixtureDef(),
        leftWall = {},
        rightWall = {};

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
        anchor = tether(head.body, tetherX, tetherY-60, 4, true);
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
       /*if(preSchool === true) {
            preSchool = false;
        } */
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
            //currentBodyImages[limbname] = humanities[limbname][0];
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

            if(contact.GetFixtureA().GetBody().parentObj.isVirus === true ||
                contact.GetFixtureB().GetBody().parentObj.isVirus === true) {
                //virus is hitting something
                if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureA().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureA().GetBody().parentObj.destroy = true;
                        dehumanize();
                    }
                } else if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureB().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureB().GetBody().parentObj.destroy = true;
                        dehumanize();
                    }
                    
                }
            }

            if(contact.GetFixtureB().GetBody().parentObj.isDNA === true ||
                contact.GetFixtureA().GetBody().parentObj.isDNA === true ) {
                //dna pill is colliding
                if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureB().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureB().GetBody().parentObj.destroy = true;
                        humanize();
                    }
                } else if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureA().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureA().GetBody().parentObj.destroy = true;
                        humanize();
                    }
                }
            }

             if(contact.GetFixtureB().GetBody().parentObj.isSuperPill === true ||
                contact.GetFixtureA().GetBody().parentObj.isSuperPill === true ) {
                //super pill is colliding
                if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureB().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureB().GetBody().parentObj.destroy = true;
                        fullHumanization();
                    }
                } else if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureA().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureA().GetBody().parentObj.destroy = true;
                        fullHumanization();
                    }
                }
            }

             if(contact.GetFixtureA().GetBody().parentObj.isEbola === true ||
                contact.GetFixtureB().GetBody().parentObj.isEbola === true) {
                //virus is hitting something
                if(contact.GetFixtureB().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureA().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureA().GetBody().parentObj.destroy = true;
                        fullMutation();
                        setTimeout(releaseSuperPill, Math.random() * 3000 + 2000);
                    }
                } else if(contact.GetFixtureA().GetBody().parentObj.isMan === true) {
                    if(contact.GetFixtureB().GetBody().parentObj.destroy !== true) {
                        contact.GetFixtureB().GetBody().parentObj.destroy = true;
                        fullMutation();
                        setTimeout(releaseSuperPill, Math.random() * 3000 + 2000);
                    }
                    
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
        anchor.body.SetPosition(new B2Vec2(x/scale,yPos));
        motor.x = (directionVector * 0.1);
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

    function allSystemsGo() {
        checkForiOS();
        sideways = (function () {
            return (window.innerHeight < window.innerWidth);
        }());
        sizeCanvas(window.innerWidth, window.innerHeight);
        selectGameState('intro');
        //event listeners... add once!
        multiverse.eventlistener('touchmove', glarePanel, touchMoveRelay);
        multiverse.eventlistener('touchstart', glarePanel, touchStartRelay);
        //multiverse.eventlistener('click', shareButton, shareOnTwitter);
        multiverse.eventlistener('touchend', shareButton, shareOnTwitter);
        multiverse.eventlistener('touchstart', resetButton, reset);
        multiverse.eventlistener('click', resetButton, reset);

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
        container.x = 0;
        container.y = -2000;
        fullBar.style.width = '0px';
    }

    tryAgainFunction = function () {
        cleanHouse();
        //outroObj
        outroObj.targetAlpha = 0;
        outroObj.alpha = 0;

        outroObj.setCallback(function(){
            currentResetFunction = brokenFunction;
            selectGameState('game');
        });
    };

    tryMadScientistFunction = function() {
        cleanHouse();
        outroObj.targetAlpha = 0;
        outroObj.alpha = 0;

        outroObj.setCallback(function(){
            currentResetFunction = brokenFunction;
            selectGameState('mad-scientist');
        });
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

    humanities = bodyObject();
    mutations = bodyObject();

    introObj = domObject('intro');
    shareLander = domObject('share-lander');
    outroObj = domObject('outro');

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
};

multiverse.eventlistener('load', window, scientist_falling.initialize);