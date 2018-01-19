src = "https://code.jquery.com/jquery-3.2.1.js";
integrity = "sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=";
crossorigin = "anonymous";

var divColor;
var quantityBox = 9;
var columnNumber = 3;
var level = 1;
var score = 0;
var roundScore = 0;
var totalRoundPoints = 0;
var setGameTime = 30;
var minutes, seconds;
var timeCounterInterval;
var timeBetweenBoxes = 2000;
var activeGameInterval;
var activeBoxInterval;
var difficultyLevelChecked = $('input[name="difficultyLevel"]');

createGameArea();

difficultyLevelChecked.click(createGameArea);

function createGameArea() {
    $('#game').empty();
    quantityBox = difficultyLevelChecked.filter(':checked').val();
    for (var i = 0; i < quantityBox; i++) {
        switch (quantityBox) {
            case "9":
                $('#game').append($('<div id="' + i + '" class="playArea col-xs-4"></div>'));
                columnNumber = 3;
                break;
            case "16":
                $('#game').append($('<div id="' + i + '" class="playArea col-xs-3"></div>'));
                columnNumber = 4;
                break;
            case "25":
                $('#game').append($('<div id="' + i + '" class="playArea"></div>'));
                columnNumber = 5;
                break;
        }
    }
    $('.playArea').height($('#game').height() / columnNumber);
    if (columnNumber === 5) {
        $(".playArea").css({
            display: 'inline - block',
            float: 'left',
            width: '20%'
        });
    }
    switch (quantityBox) {
        case "5":
            timeBetweenBoxes = 2000;
            break;
        case "16":
            timeBetweenBoxes = 1400;
            break;
        case "25":
            timeBetweenBoxes = 1000;
            break;
    }
}

$('#play').click(startGame);

function startGame() {
    $('#play').attr('disabled', 'disabled'); //wyłącza możliwość ponownego startu
    difficultyLevelChecked.attr('disabled', 'disabled'); //wyłącza możliwość wyboru trudności
    $('#level').text(level); // wyświetla która runda
    timeCounterInterval = setInterval(function () {
        minutes = Math.floor(setGameTime / 60);
        seconds = setGameTime % 60;
        $('#timeToEnd').text(minutes + ':' + seconds);
        if (minutes === 0 && seconds === 0) {
            setGameTime = 30;
            clearInterval(timeCounterInterval);
            clearInterval(activeGameInterval);
            clearTimeout(activeBoxInterval);
            $('#' + divColor).removeClass('clicked');
            if (roundScore >= (totalRoundPoints / 100) * 70) {
                level++;
                totalRoundPoints = 0;
                if (timeBetweenBoxes > 200) {
                    timeBetweenBoxes -= 200;
                    startGame();
                }
            } else {
                score = 0;
                level = 1;
                $('#play').removeAttr('disabled');
                difficultyLevelChecked.removeAttr('disabled');
            }
            roundScore = 0;
        } else {
            setGameTime--;
        }
    }, 1000);

//      Tworzymy nowy podświetlany box co pewnien okres czasu
    activeGameInterval = setInterval(function () {
        $('#' + divColor).removeClass('clicked');
        if (setGameTime >= (timeBetweenBoxes / 1000)) {
            divColor = Math.floor(Math.random() * quantityBox);
            $('#' + divColor).addClass('clicked');
            totalRoundPoints++;
        }
    }, timeBetweenBoxes);


//      Jeżeli klikniemy na aktywny box, to zwiększamy punktację
    $('.playArea').click(function () {
        if ($(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
            score++;
            roundScore++;
            $('#gameScore').text(score);
        }
    });
}
