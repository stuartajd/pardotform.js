/**
 * PardotForm.js
 *
 * Pardot Form JS API, similar to the Marketo Forms2 JS API.
 * @version 0.2
 */
class PardotForm {
	constructor(url, config){
		this.formUrl = url;
		this.config = config || {};
		this.loaded = false;
		this.callbacks = {
			load: [],
			submit: [],
			validate: [],
			success: []
		};
		this.startCapture();
	}

	createForm = (function(containerElement) {
		var formFrame = document.createElement("iframe");
		formFrame.src = this.formUrl;
		formFrame.classList.add("pardot-form");
		containerElement.appendChild(formFrame);
		return this;
	});

	onLoad = function(callback) { return this.bindCallback("load", callback) };
	onSubmit = function(callback) { return this.bindCallback("submit", callback) };
	onValidate = function(callback) { return this.bindCallback("validate", callback) };
	onSuccess = function(callback) { return this.bindCallback("success", callback) };
	getFormElem = function() { 
		return document.querySelector("iframe[src='"+ this.formUrl +"']");
	};
	getUrl = function() { return this.formUrl }
	
	hasEvent = (function(event, data) {
		this.callbacks[event].forEach(function(callback) {
			callback(this, data.value);
		}.bind(this));
	}.bind(this));
	
	bindCallback = (function(method, callback) {
		var requestedCallbacks = this.callbacks[method];
		if(callback) {
			requestedCallbacks.push(callback);
		}
		return this;
	});

	hasLoaded = (function(event, data) {
		if(this.loaded === true) return;
		this.loaded = true;
		this.hasEvent(event, data);
	}.bind(this));

	hasResized = (function(event, data) {
		if(!this.getFormElem()) return;
		if(!this.config.resize) return;
		this.getFormElem().height = data.value.toString() + "px";
	}.bind(this));

	startCapture = function() {
		window.addEventListener("message", function(event) {
			if(!event.data.form) return;
			if(event.data.form !== this.formUrl) return;
			if(!event.data.method) return;

			var statusFunctionMap = {
				"load": this.hasLoaded,
				"submit": this.hasEvent,
				"validate": this.hasEvent,
				"success": this.hasEvent,
				"resize": this.hasResized,
			};

			if(!statusFunctionMap[event.data.method]) return;

			statusFunctionMap[event.data.method](event.data.method, event.data);		
		}.bind(this));
	};
}