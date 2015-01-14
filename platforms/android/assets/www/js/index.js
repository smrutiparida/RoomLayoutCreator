/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//document.addEventListener("deviceready", onDeviceReady, false);
//Activate :active state on device
//

//function onDeviceReady() {
    
//}

//function AccelerometerApp() {

//}

var AccelerometerApp = {
	watchID : null,
	spanX : null,
	spanY: null,
	spanZ: null,
	spanTimeStamp: null,
	steps: 0,
	prev:0,
	count:0,
    
	run: function() {
		var that = this,
    		startButton = document.getElementById("startButton"),
    		stopButton = document.getElementById("stopButton");
        
		that.spanX = document.getElementById("spanDirectionX");
		that.spanY = document.getElementById("spanDirectionY");
		that.spanZ = document.getElementById("spanDirectionZ");
		that.spanTimeStamp = document.getElementById("spanTimeStamp");

		startButton.addEventListener("click", 
									 function() { 
										 that._startWatch.apply(that, arguments)
									 });
		stopButton.addEventListener("click", 
									function() { 
										that._stopWatch.apply(that, arguments)
									});
	},
    
	// Start watching the acceleration
	_startWatch: function() {
		// Only start testing if watchID is currently null.
		var that = this;
		if (that.watchID === null) {
			// Update acceleration every .5 second
			var options = { frequency: 500 };
			that.watchID = navigator.accelerometer.watchAcceleration(function() { 
				that._onAccelerometerSuccess.apply(that, arguments)
			}, 
            function(error) { 
             that._onAccelerometerError.apply(that, arguments)
            }, 
            options);
		}
	},
     
	// Stop watching the acceleration
	_stopWatch: function() {
		var that = this;
		if (that.watchID !== null) {
			var emptyText = "";
			navigator.accelerometer.clearWatch(that.watchID);
			that.watchID = null;
			that.spanX.innerText = emptyText;
			that.spanY.innerText = emptyText;
			that.spanZ.innerText = emptyText;
			that.spanTimeStamp.innerText = emptyText;
		}
	},
 
	//Get a snapshot of the current acceleration
	_onAccelerometerSuccess: function(acceleration) {
		var that = this;
		that.count++;
		
		if( that.prev > 1.2 * acceleration.y){
				that.steps++;
		}
		that.spanX.innerText = "Called " + that.count + " times";
		that.spanY.innerText = acceleration.y;
		//that.spanZ.innerText = acceleration.z;
		that.spanZ.innerText = that.steps;              
		that.spanTimeStamp.innerText = acceleration.timestamp;
		that.prev = acceleration.y;
	},
    
	//Failed to get the acceleration
	_onAccelerometerError: function(error) {
        //check if we're running in simulator
        if (window.navigator.simulator === true)
        {
            alert(error);
            this._stopWatch.apply(this, arguments);
        } else
		alert("Unable to start accelerometer! Error code: " + error.code );
	}
}
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("touchstart", function() {}, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //navigator.splashscreen.hide();
		//var accelerometerHelper = new AccelerometerApp();
		//accelerometerHelper.run();
		AccelerometerApp.run();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById("showStatus");
        //var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();