/** TELLDUS GUI **/

var devices = new Array();
var methodsSupported = com.telldus.core.TELLSTICK_TURNON
	| com.telldus.core.TELLSTICK_TURNOFF
	| com.telldus.core.TELLSTICK_BELL
	| com.telldus.core.TELLSTICK_DIM
	| com.telldus.core.TELLSTICK_UP
	| com.telldus.core.TELLSTICK_DOWN
	| com.telldus.core.TELLSTICK_STOP;

__postInit__ = function() {
	com.telldus.core.deviceChange.connect(deviceChange);
	application.allDoneLoading.connect( allDone );
	application.addWidget("devices.default", ":/images/devices.png", com.telldus.gui);
}

function down() {
	com.telldus.core.down( this.id );
}

function stop() {
	com.telldus.core.stop( this.id );
}

function turnOn() {
	com.telldus.core.turnOn( this.id );
}

function turnOff() {
	com.telldus.core.turnOff( this.id );
}

function up() {
	com.telldus.core.up( this.id );
}

function dim() {
	com.telldus.core.dim( this.id, this.value );
}

function bell() {
	com.telldus.core.bell( this.id );
}

function allDone() {
	if (com.telldus.systray) {
		var count = com.telldus.core.getNumberOfDevices();
		for (var i = 0; i < count; ++i) {
			var obj = { id: com.telldus.core.getDeviceId(i) };
			var name = com.telldus.core.getName(obj.id);
			obj.menuId = com.telldus.systray.addMenuItem( name );

			devices.push(obj);

			addMethodsSubmenu(obj);
		}

		com.telldus.systray.addSeparator();
	}
}

function deviceChange( deviceId, eventType ) {
	if (eventType == com.telldus.core.TELLSTICK_DEVICE_ADDED) {
		var lastIndex = devices.length-1;
		var obj = { id: deviceId };
		var name = com.telldus.core.getName(obj.id);
		obj.menuId = com.telldus.systray.addMenuItemAfter( name, devices[lastIndex].menuId );
		devices.push(obj);
		addMethodsSubmenu(obj);
		return;
	}

	var index = -1;
	//Find the device
	for (var i=0; i < devices.length; ++i) {
			if (devices[i].id == deviceId) {
				index = i;
				break;
			}
	}
	//Device not found, return
	if (index < 0) {
		return;
	}

	if (eventType == com.telldus.core.TELLSTICK_DEVICE_CHANGED) {
		var name = com.telldus.core.getName(deviceId);
		var menuItem = com.telldus.systray.menuItem( devices[index].menuId );
		if (menuItem) {
			menuItem.text = name;
			com.telldus.systray.clear( devices[index].menuId );
			addMethodsSubmenu( devices[index] );
		}
	} else if (eventType == com.telldus.core.TELLSTICK_DEVICE_REMOVED) {
		com.telldus.systray.removeMenuItem( devices[index].menuId );
		devices.splice(index, 1);
	}
}

function addMethodsSubmenu( obj ) {
	var methods = com.telldus.core.methods( obj.id, methodsSupported );
	if (methods & com.telldus.core.TELLSTICK_TURNON) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("On"), obj.menuId )).triggered.connect( obj, turnOn );
	}
	if (methods & com.telldus.core.TELLSTICK_UP) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("Up"), obj.menuId )).triggered.connect( obj, up );
	}
	if (methods & com.telldus.core.TELLSTICK_DIM) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "90%", obj.menuId )).triggered.connect( {id: obj.id, value: 230}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "80%", obj.menuId )).triggered.connect( {id: obj.id, value: 204}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "70%", obj.menuId )).triggered.connect( {id: obj.id, value: 179}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "60%", obj.menuId )).triggered.connect( {id: obj.id, value: 153}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "50%", obj.menuId )).triggered.connect( {id: obj.id, value: 128}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "40%", obj.menuId )).triggered.connect( {id: obj.id, value: 102}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "30%", obj.menuId )).triggered.connect( {id: obj.id, value: 77}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "20%", obj.menuId )).triggered.connect( {id: obj.id, value: 51}, dim );
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( "10%", obj.menuId )).triggered.connect( {id: obj.id, value: 25}, dim );
	}
	if (methods & com.telldus.core.TELLSTICK_STOP) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("Stop"), obj.menuId )).triggered.connect( obj, stop );
	}
	if (methods & com.telldus.core.TELLSTICK_TURNOFF) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("Off"), obj.menuId )).triggered.connect( obj, turnOff );
	}
	if (methods & com.telldus.core.TELLSTICK_DOWN) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("Down"), obj.menuId )).triggered.connect( obj, down );
	}
	if (methods & com.telldus.core.TELLSTICK_BELL) {
		com.telldus.systray.menuItem(com.telldus.systray.addMenuItem( qsTr("Bell"), obj.menuId )).triggered.connect( obj, bell );
	}
}

