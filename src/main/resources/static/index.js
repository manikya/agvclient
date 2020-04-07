const MAX_SPEED = 1024;
const MIN_SPEED = 0;
const DEFAULT_SPEED = 512;
const DIRECTION = {
    ArrowUp: "MoveForward",
    ArrowDown: "MoveBackward",
    ArrowLeft: "TurnLeft",
    ArrowRight: "TurnRight",
    Break: "Break"
};

let busy = false;
let speed;

$(document).ready(() => {
    console.log("Ready....");

    setSpeed(DEFAULT_SPEED);

    // register shortcuts
    $(document).keydown(e => handleKeydown(e));
    $(document).keyup(e => handleKeyup(e));

    // register actions
    $('#btn-up').click(() => move(DIRECTION.ArrowUp));
    $('#btn-down').click(() => move(DIRECTION.ArrowDown));
    $('#btn-left').click(() => move(DIRECTION.ArrowLeft));
    $('#btn-right').click(() => move(DIRECTION.ArrowRight));
    $('#range-speed').change((event) => speed = +event.target.value);
});

function move(direction) {
    if (!busy) {
        console.log("Moving... -- " + direction);
        busy = true;
        $.ajax({
            url: makeReqURL(direction),
            contentType: "application/json",
            dataType: 'json',
            success: function (result) {
                console.log(result);
            }
        }).always(() => busy = false)
    }
}

function makeReqURL(direction) {
    return 'http://' + $('#target-id').val() + ":8080/command/run?command=" + direction + "&speed=" + $('#range-speed').val()
}

function handleKeyup(event) {
    if (
        event.code === 'ArrowUp' ||
        event.code === 'ArrowDown' ||
        event.code === 'ArrowLeft' ||
        event.code === 'ArrowRight'
    ) {
        move(DIRECTION[event.code])
    }
}

function handleKeydown(event) {
    switch (event.code) {
        case 'Equal':
        case 'Plus':
            setSpeed(event.shiftKey ? Math.min(MAX_SPEED, speed + 128) : Math.min(MAX_SPEED, speed + 8));
            break;
        case 'Minus':
            setSpeed(event.shiftKey ? Math.max(MIN_SPEED, speed - 128) : Math.max(MIN_SPEED, speed - 8));
            break;
        case 'ArrowUp':
            animateButton($('#btn-up'));
            break;
        case 'ArrowDown':
            animateButton($('#btn-down'));
            break;
        case 'ArrowLeft':
            animateButton($('#btn-left'));
            break;
        case 'ArrowRight':
            animateButton($('#btn-right'));
            break;
    }
}

function setSpeed(_speed) {
    speed = +_speed;
    $('#range-speed').val(+_speed);
}

function animateButton(button) {
    button.addClass('animate');
    setTimeout(() => button.removeClass('animate'), 100);
}