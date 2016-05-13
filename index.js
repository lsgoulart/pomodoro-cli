#! /usr/bin/env node

/**
* Module dependencies.
*/
var program = require('commander');
var pkg = require('./package');
var Config = require('configstore');
var moment = require('moment');
var notifier = require('node-notifier');
var Spinner = require('cli-spinner').Spinner;

/**
 * Initial config store
 */
var config = new Config(pkg.name);
var spinner = new Spinner('Countdown %s');

program
    .version('0.0.1')
    .option('-s, --start', 'Pomodoro Start')
    .option('-p, --pause', 'Pomodoro Pause')
    .option('-b, --shortbreak', 'Short Break')
    .option('-B, --longbreak', 'Long Break')
    .parse(process.argv);

var getDuration = function() {
    var duration = config.get('time');
    if(duration > 0) {
        duration -= 100;
        config.set('time', duration);
    }

    return duration;
}

var startTimer = function(type) {
    var time = 0;
    switch (type) {
        case 'shortbreak':
            time = (60*5)*1000;
            break;
        case 'longbreak':
            time = (60*10)*1000;
            break;
        case 'pomodoro':
        default:
            time = (60*25)*1000;
            break;
    }

    config.set('time', time);
    spinner.setSpinnerString(18);
    spinner.start();

    var interval = setInterval(function() {
        var duration = getDuration();
        if(duration <= 0) {
            clearInterval(interval);
            notifier.notify({
              'title': 'My notification',
              'message': 'Hello, there!'
            });
        }

        spinner.setSpinnerTitle(type + ': ' + moment.utc(duration).format('mm:ss'));

        //process.stdout.clearLine();
		//process.stdout.write('\rPomodoro: ' + moment.utc(duration).format('mm:ss'));
    }, 100);
};

if(program.pause) {
    startTimer('pomodoro');
} else if(program.shortbreak) {
    startTimer('shortbreak');
} else if(program.longbreak) {
    startTimer('longbreak');
} else {
    startTimer('pomodoro');
}
