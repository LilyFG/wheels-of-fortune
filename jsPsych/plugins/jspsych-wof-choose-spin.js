/**
 * jspsych-wof-choose-spin
 * a jspsych plugin for wheels of fortune wheel choice and spinner
 *
 * Lily FitzGibbon
 *
 */

jsPsych.plugins["wof-choose-spin"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "wof-choose-spin",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: "Choose a wheel"
      },
      trial_type: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: "partial"
      },
      left_value_1: {
        type: jsPsych.plugins.parameterType.INT,
        default: 0
      },
      left_value_2: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 0
      },
      left_prob_1: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: 0.5
      },
      left_outcome: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 1
      },
      right_value_1: {
        type: jsPsych.plugins.parameterType.INT,
        default: 0
      },
      right_value_2: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 0
      },
      right_prob_1: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: 0.5
      },
      right_outcome: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 1
      },
      phase: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "choice"
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, then trial will end when user responds.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
        console.log(trial.trial_type)

        // display stimulus
        var html = '<div id="jspsych-prompt">'+trial.prompt+'</div>';

        html += '<div id="jspsych-wheels-choice">'

        buttons = [
                '<div style="position:relative; margin: 20px;">'+
                '<div class="value value1" id="left_val_1">'+trial.left_value_1+'</div>'+
                '<div class="value value2" id="left_val_2">'+trial.left_value_2+'</div>'+
                '<div class="pie-yum" id="wheel0" style="position: relative">' +
                '<svg class="pie" id="spinner0" width="300px" height="300px" viewBox="0 0 32 32">' +
                '<circle r="16" cx="16" cy="16" fill="blue" stroke="yellow" stroke-width="32" stroke-dasharray="' + trial.left_prob_1 * 100 + ' 100" />' +
                '</div></div>',
                '<div style="position:relative; margin: 20px;">'+
                '<div class="value value1" id="right_val_1">'+trial.right_value_1+'</div>'+
                '<div class="value  value2" id="right_val_2">'+trial.right_value_2+'</div>'+
                '<div class="pie-yum" id="wheel1" style="position: relative">' +
                '<svg class="pie" id="spinner1" width="300px" height="300px" viewBox="0 0 32 32">' +
                '<circle r="16" cx="16" cy="16" fill="blue" stroke="yellow" stroke-width="32" stroke-dasharray="' + trial.right_prob_1 * 100 + ' 100" />' +
                '</div></div>']
        for (var i = 0; i < 2; i++) {
          var str = buttons[i];
          html += '<div class="wheels" style="display: inline-block; border: solid 3px white;" id="wheel-container-' + i +'" data-choice="'+i+'">'+str+'</div>';
        }
        html += '</div>';

        html += '<div class="jspsych-html-slider-response-container" id="wof-slider" style="position:relative; margin: 50px auto 10px auto; width:500px; height: 150px"></div>';


        display_element.innerHTML = html;

        // start time
        var start_time = performance.now();

        var click_fun = function(e){
          var choice = parseInt(e.currentTarget.getAttribute('data-choice')); // don't use dataset for jsdom compatibility
          console.log(e.currentTarget);
          e.currentTarget.style.borderColor = "black";
          after_response(choice);
        }

        // add event listeners to buttons
        for (var i = 0; i < 2; i++) {
          display_element.querySelector('#wheel-container-' + i).addEventListener('click', click_fun);
        }

        // store response
        var response = {
          rt: null,
          button: null
        };

        // function to handle responses by the subject
        function after_response(choice) {
          // measure rt
          var end_time = performance.now();
          var rt = end_time - start_time;
          response.button = choice;
          response.rt = rt;

          // after a valid response, the stimulus will have the CSS class 'responded'
          // which can be used to provide visual feedback that a response was recorded
          // display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

          // disable all the buttons after a response
          var btns = document.querySelectorAll('.wheels');
          for(var i=0; i<btns.length; i++){
            btns[i].removeEventListener('click', click_fun);
            btns[i].setAttribute('disabled', 'disabled');
          }

          // spin the wheels
          setTimeout(function(){
            document.getElementById('wheel'+choice).innerHTML += arrow[choice];
            // draw the arrow using snap.svg
            var s1 = Snap("#arrow"+choice);
            var c1 = s1.circle(150, 150, 5);
            var g1 = s1.group(s1.line(150, 50, 150, 150).attr({stroke: "#000", strokeWidth: 2}),
                            s1.polyline([150, 50, 140, 60, 160, 60]))
            // random rotation value
            var rotate1 = Math.random() * 360 * [trial[["left","right"][choice]+"_prob_1"], 1-trial[["left","right"][choice]+"_prob_1"]][+(trial[["left","right"][choice]+"_outcome"]==2)];
            if(trial[["left","right"][choice]+"_outcome"]==2){
              rotate1 += 360*trial[["left","right"][choice]+"_prob_1"]
            }

            if(trial.trial_type=="complete"){
              console.log(choice)
              console.log(typeof(choice));
              console.log(!choice)
              console.log('wheel'+(+!choice))
              document.getElementById('wheel'+(+!choice)).innerHTML += arrow[+!choice];

              // draw the arrow using snap.svg
              var s2 = Snap("#arrow"+(+!choice));
              var c2 = s2.circle(150, 150, 5);
              var g2 = s2.group(s2.line(150, 50, 150, 150).attr({stroke: "#000", strokeWidth: 2}),
                              s2.polyline([150, 50, 140, 60, 160, 60]))
              // random rotation value
              var rotate2 = Math.random() * 360 * [trial[["left","right"][+!choice]+"_prob_1"], 1-trial[["left","right"][+!choice]+"_prob_1"]][+(trial[["left","right"][+!choice]+"_outcome"]==2)];
              if(trial[["left","right"][+!choice]+"_outcome"]==2){
                rotate2 += 360*trial[["left","right"][+!choice]+"_prob_1"]
              }
            }

            // animate the rotation and display the outcome
            g1.animate({ transform: 'r'+(360+rotate1)+',150,150'}, 1000, mina.easeinout, end_trial)
            if(trial.trial_type=="complete"){
              g2.animate({ transform: 'r'+(360+rotate2)+',150,150'}, 1000, mina.easeinout)
            }
          }, 500)

          if (trial.response_ends_trial) {
            end_trial();
          }
        };

        // function to end trial when it is time
        function end_trial() {

          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

          // gather the data to store for the trial
          var trial_data = {
            "rt": response.rt,
            "button_pressed": response.button
          };


          $.extend(trial_data, trial_data, trial);

          // clear the display
          //display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        };


        // end trial if time limit is set
        if (trial.trial_duration !== null) {
          jsPsych.pluginAPI.setTimeout(function() {
            end_trial();
          }, trial.trial_duration);
        }

      };

      return plugin;
})();
