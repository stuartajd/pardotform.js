<div align="center">
  <a href="https://github.com/stuartajd/pardotform.js">
    <img src="assets/logo.png" alt="Logo">
  </a>

  <p align="center">
    Listen to events from an embedded Pardot Form, inspired by Marketos Forms2.js.
    <br /><br />
    <a href="https://github.com/stuartajd/pardotform.js/issues">Report Bug</a>
    ·
    <a href="https://github.com/stuartajd/pardotform.js/issues">Request Feature</a>
  </p>
</div>

## How it works

As we don't control the full end-to-end process of creating a Pardot form, there are events that are emitted via PostMessage from the form iFrame. Pardot allows forms to be embedded using standard iFrames and still maintain default functionality such as prepopulation & progressive profiling.

Within the layout template on the form, emitters can be placed at strategic points to enable the Pardot form to trigger an event at the correct time. For example, on load. 

When creating a Pardot form, the form should be set to "Always display form after submission" to allow the script to trigger the validation rules correctly on revisiting the page. The "Redirect to the following URL" should not be checked to allow the script to control the submission.

The main `src/pardotform.js` script should then be included on the outer page, this will then listen to all events outputted by the script.

## Methods

| Method               	| Description                                                                                                                             	| Parameters 	|
|----------------------	|-----------------------------------------------------------------------------------------------------------------------------------------	|------------	|
| new PardotForm(url, config) 	| Loads a new PardotForm instance                                                                                 	| URL: Pardot Form URL, Config: see below for config options  	|
| .loadForm(container) 	| Loads a new form iFrame form into the container element                                                                                 	| container: DOM Element for the iFrame to be appended to 	|
| .onLoad()            	| Adds a callback that is triggered when the form has completed loading.                                                                  	| callback   	|
| .onSubmit()          	| Adds a callback that is triggered when the form is submitted. This will occur before the success / failure of the submission is known.  	| callback   	|
| .onValidate()        	| Adds a callback that is triggered when the validation is attempted. The success or failure of the submission will be returned in the callback. 	| callback   	|
| .onSuccess()         	| Adds a callback that is triggered when the submission was successful.                                                                   	| callback   	|
| .getFormElem()       	| Returns the container element for the embedded form.                                                                                    	|            	|
| .getUrl()       	| Returns the Pardot form URL.                                                                                    	|            	|


## Config

| Method | Description | Parameters |
| ----- | ----- | ----- |
| resize | The iFrame can be automatically resized on load, this config option will enable this functionality. | Default: `"resize": true`

## Usage

#### Page Script

The page script should be uploaded to a clients instance, then referenced directly in the code. This will include the classes required for the `pardotform.js` script to run.

#### Form Layout Template

Within Pardot, a layout template should be completed and the "Form" tab content updated to include the content from the `src/form-layout.html` file. This contains the default output for a Pardot form however does include slight alterations to emit events.

## Examples

#### Default Pardot iFrame

```html
<iframe src="*Pardot Form URL*" width="100%" height="500" type="text/html" frameborder="0" allowTransparency="true" style="border: 0"></iframe>

<script src="*instance*/pardotform.js"></script>
<script>
	const pardotForm = new PardotForm("*Pardot Form URL*");
	pardotForm
		.onLoad(function(form){
			console.log("loaded");
		})
		.onSubmit(function(form){
			console.log("submitted");
		})
		.onValidate(function(form, passesValidation){
			console.log("validated");
		})
		.onSuccess(function(form){
			console.log("success");
		});
</script>
```

#### Dynamically creating a new Pardot form

```html
<div class="pardot-form-here"></div>

<script src="*instance*/pardotform.js"></script>
<script>
	const pardotForm = new PardotForm("*Pardot Form URL*");
	pardotForm
		.newForm(document.querySelector(".pardot-form-here"))
		.onLoad(function(form){
			console.log("loaded");
		})
		.onSubmit(function(form){
			console.log("submitted");
		})
		.onValidate(function(form, passesValidation){
			console.log("validated");
		})
		.onSuccess(function(form){
			console.log("success");
		});
</script>
```