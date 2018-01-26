var $gamePlace = $('#game');

function createBox(id) {
    var height;
    var id = id;
    var boxState = 0;

    return {
        insertBox: function (difficultyLevel) {
            switch (difficultyLevel) {
                case 9:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-4"></div>'));
                    height = $gamePlace.height() / 3;
                    break;
                case 16:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-3"></div>'));
                    height = $gamePlace.height() / 4;
                    break;
                case 25:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-4"></div>'));
                    height = $gamePlace.height() / 5;
                    $('.playArea').css({
                        display: 'inline - block',
                        float: 'left',
                        width: '20%'
                    });
                    break;
            }
            $('#' + id).height(height);
        },

        getBoxState: function () {
            return boxState;
        },

        setActiveBox: function (goodBad) {
            if (goodBad) {
                $('#' + id).addClass('activeGood');
                boxState = 1;
            } else {
                $('#' + id).addClass('activeBad');
                boxState = 2;
            }
        },

        removeActiveBox: function () {
            if (boxState) {
                $('#' + id).removeClass('activeGood activeBad');
                boxState = 0;
            }
        }
    }
}


function createGame() {
    var gameArea = [];
    var levelL = 9;
    var divColor = 0;
    var goodBadBox;
    var quantityBox = 9;
    var level = 1;
    var score = 0;
    var roundScore = 0;
    var totalRoundPoints = 0;
    var setGameTime = 30;
    var seconds;
    var timeCounterInterval;
    var timeBetweenBoxes = 2000;
    var activeGameInterval;
    var activeBoxInterval;
    var $difficultyLevelChecked = $('input[name="difficultyLevel"]');

    createGameArea();

    function createGameArea() {
        // $('#game').empty();
        $('.playArea').remove();
        gameArea = [];
        for (var i = 0; i < levelL; i++) {
            gameArea[i] = createBox(i);
        }
        gameArea.forEach(function (area, index) {
            area.insertBox(levelL);
        })
    };

    $difficultyLevelChecked.click(function () {
        levelL = parseInt($difficultyLevelChecked.filter(':checked').val());
        switch (levelL) {
            case 9:
                timeBetweenBoxes = 2000;
                break;
            case 16:
                timeBetweenBoxes = 1400;
                break;
            case 25:
                timeBetweenBoxes = 1000;
                break;
        }
        createGameArea();
    });

    $('#play').click(counter);
    $('#stop').click(stopGame);

    function startGame() {
        $('#play').attr('disabled', 'disabled'); //wyłącza możliwość ponownego startu
        $difficultyLevelChecked.attr('disabled', 'disabled'); //wyłącza możliwość wyboru trudności
        $('#level').text(level); // wyświetla która runda
        timeCounterInterval = setInterval(function () {
            seconds = setGameTime % 60;
            $('#timeToEnd').text('0:' + seconds);
            if (seconds === 0) {
                setGameTime = 30;
                clearInterval(timeCounterInterval);
                clearInterval(activeGameInterval);
                clearTimeout(activeBoxInterval);
                gameArea[divColor].removeActiveBox();
                if (roundScore >= (totalRoundPoints / 100) * 70) {
                    level++;
                    totalRoundPoints = 0;
                    if (timeBetweenBoxes > 200) {
                        timeBetweenBoxes -= 200;
                        showRound();
                    }
                } else {
                    score = 0;
                    level = 1;
                    $('#play').removeAttr('disabled');
                    $difficultyLevelChecked.removeAttr('disabled');
                }
                roundScore = 0;
            } else {
                setGameTime--;
            }
        }, 1000);

//      Tworzymy nowy podświetlany box co pewnien okres czasu
        activeGameInterval = setInterval(function () {
            // $('#' + divColor).removeClass('activeGood');
            gameArea[divColor].removeActiveBox();
            if (setGameTime >= (timeBetweenBoxes / 1000)) {
                divColor = Math.floor(Math.random() * quantityBox);
                // $('#' + divColor).addClass('activeGood');
                goodBadBox = Math.round(Math.random() * 3);
                gameArea[divColor].setActiveBox(goodBadBox);
                if(goodBadBox) totalRoundPoints++;
            }
        }, timeBetweenBoxes);

        // Jeżeli klikniemy na aktywny box, to zwiększamy punktację
        $('.playArea').click(function () {
            var boxNumber = parseInt($(this).attr("id"));
            boxState = gameArea[boxNumber].getBoxState();
            if (boxState) {
                if (boxState === 1) {
                    gameArea[boxNumber].removeActiveBox();
                    score++;
                    roundScore++;
                }
                if (boxState === 2) {
                    gameArea[boxNumber].removeActiveBox();
                    score--;
                }
                $('#gameScore').text(score);
            }
        });
    }

    function stopGame() {
        setGameTime = 30;
        clearInterval(timeCounterInterval);
        clearInterval(activeGameInterval);
        clearTimeout(activeBoxInterval);
        gameArea[divColor].removeActiveBox();
        score = 0;
        level = 1;
        setGameTime = 30;
        $('#play').removeAttr('disabled');
        $difficultyLevelChecked.removeAttr('disabled');
        $('#level').text(" ");
        $('#gameScore').text(score);
        $('#timeToEnd').text(setGameTime);
    }

    function counter() {
        var countNumber = 3;
        $('#coverRound').removeClass('hidden');
        var count = setInterval(function () {
            if(countNumber >0) {
                $('#roundText').text(countNumber);
            }else if(countNumber === 0){
                $('#roundText').text('START');
            }else {
                $('#roundText').text('');
                $('#coverRound').addClass('hidden');
                clearInterval(count);
                startGame();
                return;
            }
            countNumber--;
        },500);
    }

    function showRound() {
        $('#roundText').text('Runda ' + level);
        $('#coverRound').removeClass('hidden');
        var timeout = setTimeout(function () {
            $('#coverRound').addClass('hidden');
            $('#roundText').text('');
            clearTimeout(timeout);
            startGame();
            return
        },500);
    }
}

var game = createGame();

