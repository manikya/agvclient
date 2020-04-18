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
const COMMAND = {
    Cmd1: "command1",
    Cmd2: "command2",
    Cmd3: "command3",
    Cmd4: "command4",
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
    $('#btn-cmd-1').click(() => move(COMMAND.Cmd1));
    $('#btn-cmd-2').click(() => move(COMMAND.Cmd2));
    $('#btn-cmd-3').click(() => move(COMMAND.Cmd3));
    $('#btn-cmd-4').click(() => move(COMMAND.Cmd4));
    $('#range-speed').change((event) => speed = +event.target.value);
    $('#btn-call').click(() => startCall());
});

function move(direction) {
    if (!busy) {
        console.log("Moving... -- " + direction);
        busy = true;
        $.ajax({
            url: 'http://' + $('#target-id').val() + ":9090/command/run?command=" + direction + "&speed=" + $('#range-speed').val(),
            contentType: "application/json",
            dataType: 'json',
            success: function (result) {
                console.log(result);
            }
        }).always(() => busy = false)
    }
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

function startCall() {

    $.ajax({
        url: 'http://' + $('#target-id').val() + ":9090/chat/openChat?url=" + $('#txt-url').val(),
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            // console.log(result);
            $('#chatroom').attr("src", $('#txt-url').val());
            $('#chatroom').addClass("active");
            $('.rtc-frame .placeholder').addClass("hidden");
            $('.call-end').show();
        }
    }).done(() => console.log("Starting call...."));
}

function endCall() {

    $.ajax({
        url: 'http://' + $('#target-id').val() + ":9090/chat/closeChat",
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            // console.log(result);
            $('#chatroom').removeAttr("src");
            $('#chatroom').removeClass("active");
            $('.rtc-frame .placeholder').removeClass("hidden");
            $('.call-end').hide();
        }
    }).done(() => console.log("Ending call...."));
}