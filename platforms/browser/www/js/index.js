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
let namaLogin;

var app = {
    // Application Constructor
    // macAddress: ,//"66:22:F7:33:EC:53",
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //alert("the js "+document.getElementById("btadd").value);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.addEventListener('deviceready', this.manageConnection, false);
        // connectButton.addEventListener('touchend', app.manageConnection, false);
        sambungButton.addEventListener('touchend', app.manageConnection, false);
        //cetakButton.addEventListener('touchend', this.cobaTulis, false);
        // simpanButton.addEventListener('touchend', this.cobaSimpan, false);
        // ambilButton.addEventListener('touchend', this.cobaBaca, false);
        //keluarButton.addEventListener("touchend", this.tutup, false);
            
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function() {
        //alert(document.getElementById("btadd").value);

        app.receivedEvent('deviceready');
        
        // alert("ready");

        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }

        // // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            alert("Bluetooth is not enabled.")
        }

        //  // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );

        app.manageConnection();

    },
    
    manageConnection: function() {
        //alert("koddeb");
        app.clear();
        app.display("manageConnection")
        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            //app.display("Attempting to connect. " +
            //    "Make sure the serial port is open on the target device.");
            // attempt to connect:
            bluetoothSerial.connect(
                document.getElementById("btadd").value,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
            );
            
            
        };
        
        //disconnect() will get called only if isConnected() (below)
        ///returns success  In other words, if  connected, then disconnect:
        
        var disconnect = function () {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        //app.display("Connected to: " + document.getElementById("btadd").value);
        // change the button's name:
        sambungButton.innerHTML = "PUTUSKAN DARI TIMBANGAN";
        //cetakButton.innerHTML = "TESS";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function (data) {
            app.clear();
            app.display(data);
        });
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        //app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        sambungButton.innerHTML = "Sambungkan Ke Timbangan";
        document.getElementById("statConn").innerHTML="-";

        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.display(data);
                },
                app.showError
        );
    },
/*
    appends @error to the message div:
*/
    showError: function(error) {
        app.display(error);
    },
    
    // bluetoothSerial.read(function (data) {
    //     console.log(data);
    // }, failure);

    cobaBaca: function() {
            alert("Coba BAca");
            app.display("attempting to Baca");
            // if connected, do this:
            //document.getElementById("tulisan").value = "HORE";
            //theTul=document.getElementById("tulisan").value;
            
            bluetoothSerial.readUntil('\n',
                function (data) {
                    alert(data);
                    app.display(data);
                },
                app.showError );
            alert("Selesai BAca");
    },
    
    cobaTulis: function() {
            app.display("attempting to Nulis");
            // if connected, do this:
            //document.getElementById("tulisan").value = "HORE";
            theTul=document.getElementById("tulisan").value;
            
            bluetoothSerial.write(
                theTul+"\n",
                app.showOK,     // stop listening to the port
                app.showError      // show the error if you fail
            );
    },
    cobaPutus: function() {
        alert("attempting to Putus");
        
    },

    cobaSimpan2: function() {
        //alert("attempting to Simpan");
        // sqlitePlugin.openDatabase({
        //     name: 'my.db',
        //     location: 'default',
        //     androidDatabaseProvider: 'system'
        //   });
        

        //alert("attempting to Simpan 2");
        // if connected, do this:
        //document.getElementById("tulisan").value = "HORE";
        // theTul=document.getElementById("tulisan").value;
        
        // bluetoothSerial.write(
        //     theTul+"\n",
        //     app.showOK,     // stop listening to the port
        //     app.showError      // show the error if you fail
        // );
    },

    showOK: function() {
        app.display("OK xixi");
    },

    display: function(message) {
        //var display = document.getElementById("message"), // the message div
        //    lineBreak = document.createElement("br"),     // a line break
        //    label = document.createTextNode(message);     // create the label
        //display.appendChild(lineBreak);          // add a line break
        //display.appendChild(label);              // add the message node
        var theRed=0//document.getElementById("reduksi1").value
        var sat1=document.getElementById("sat1").value
        nilaiRed=parseFloat(theRed)
        if(isNaN(nilaiRed)){nilaiRed=0}
        if(nilaiRed>20){nilaiRed=20}
        var str1=message.toString()
        //console.log(str1)
        var str2=str1.split(",")[2]
        if(str2==undefined){var str2=str1.split(",")[0]}
        //console.log(str2)
        var message2=str2.replace("KG","") //.split(" ")[0]
        message2=parseFloat(message2)
        if( isNaN(message2)){message2=0}
        message2=message2*(100-nilaiRed)/100
        message2=message2.toFixed(2)
        console.log(message2,sat1)

        //var message2=message.split(",")[2]
        // message2=message2.toString()
        // console.log(message2)
        // try {
        //     var message3=message2.split("KG")[0]
        // }
        // finally{var message3=message2}
        var strStat=message.split(",")[0]
        // message2.toString()
        // document.getElementById("temp1").value=message2.toString()
        // var message3= message2.toString()//document.getElementById("temp1").value
        // message3=message3.toLowerCase()
        // message3=message3.replace("kg","")
        // // message3=message3.replace("KG","")
        // // message3=parseFloat(message3)
        // console.log(parseFloat(message3))
        
        document.getElementById("berat").innerHTML=message2+" "+sat1;
        document.getElementById("statConn").innerHTML=strStat;

        if(strStat=="ST"){
            document.getElementById("statConn").style.background ='#a2fcb6';
            document.getElementById("statConn").innerHTML="STABIL"
            document.getElementById("simpanButton").disabled=false;
            simpanButton.addEventListener('touchend', cobaSimpan, false);        
        }
        else if(strStat=="US"){
            document.getElementById("statConn").style.background ='#ffe77a';
            document.getElementById("statConn").innerHTML="BELUM STABIL"
            document.getElementById("simpanButton").disabled=true;
            simpanButton.removeEventListener('touchend',cobaSimpan);        
            

        }
        else{
            document.getElementById("statConn").style.background ='#c75e5e';
            document.getElementById("statConn").innerHTML="TIDAK DIKETAHUI"
            document.getElementById("simpanButton").disabled=true;
            simpanButton.removeEventListener('touchend',cobaSimpan);        
        }
        
        var hasil=document.getElementById("listPending").value
        var hasilBaris=hasil.split("\n")
        if(hasilBaris.length>18){
            document.getElementById("simpanButton").disabled=true;
            simpanButton.removeEventListener('touchend',cobaSimpan);   
        }

        },
/*
    clears the message div:
*/
    clear: function() {
        //var display = document.getElementById("message");
        //display.innerHTML = "";
        var display2 = document.getElementById("berat");
        display2.innerHTML = "";
        
    },    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

