/**
 * jspsych-wof-slider-response
 * a jspsych plugin for wheels of fortune slider response
 * adapted from html-slider-response plugin from jsPsych plugin library
 * by Lily FitzGibbon
 *
 */


jsPsych.plugins['wof-slider-response'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'wof-slider-response',
    description: '',
    parameters: {
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      slider_start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: 'Rate how you feel',
        description: 'Text for the prompt at the top of the screen.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
      clear_screen: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Clear the screen after the trial",
        default: true,
        description: "If true, the screen is cleared after the response, if false, only the slider is removed."
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    // change the prompt text
    document.getElementById('jspsych-prompt').innerHTML = trial.prompt

    // half of the thumb width value from jspsych.css, used to adjust the label positions
    var half_thumb_width = 7.5;

    // var slider_html = '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 3em auto; width:500px; height: 150px">';
    var slider_html = '<input type="range" class="jspsych-slider" value="'+trial.slider_start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" id="jspsych-html-slider-response-response"></input>';
    slider_html += '<div style="margin-bottom: 25px">'
    for(var j=0; j < trial.labels.length; j++){
      var label_width_perc = 100/(trial.labels.length-1);
      var percent_of_range = j * (100/(trial.labels.length - 1));
      var percent_dist_from_center = ((percent_of_range-50)/50)*100;
      var offset = (percent_dist_from_center * half_thumb_width)/100;
      slider_html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; '+
      'left:calc('+percent_of_range+'% - ('+label_width_perc+'% / 2) - '+offset+'px); text-align: center; width: '+label_width_perc+'%;">';
      slider_html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      slider_html += '</div>'
    }
    slider_html += '</div>';
    slider_html += '</div>';
    slider_html += '</div>';


    // add submit button
    slider_html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    // instead of replacing the whole display element, we just update the slider container (previously an empty div)
    document.getElementById('wof-slider').innerHTML = slider_html;

    var response = {
      rt: null,
      response: null
    };

    if(trial.require_movement){
      display_element.querySelector('#jspsych-html-slider-response-response').addEventListener('click', function(){
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = false;
      });
    }

    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = display_element.querySelector('#jspsych-html-slider-response-response').valueAsNumber;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "slider_start": trial.slider_start,
        "response": response.response
      };

      // use jQuery's .extend to combine the trial data with the trial input settings so everything is recorded
      $.extend(trial_data, trial_data, trial);

      // clear the display - if multiple sliders consecutively then we want to have this conditional on a trial variable
      if(trial.clear){
        display_element.innerHTML = '';
      }else{
        document.getElementById('wof-slider').innerHTML = "";
      }
        
      // next trial
      jsPsych.finishTrial(trialdata);
    }


    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
