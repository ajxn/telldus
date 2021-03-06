#include "sensorsplugin.h"
#include "sensor.h"
#include "sensorvalue.h"
#include <QScriptEngine>
#include <QtDeclarative>

QScriptValue SensorCTor(QScriptContext *context, QScriptEngine *engine) {
	if (!context->isCalledAsConstructor()) {
		return engine->undefinedValue();
	}
	return engine->newQObject(new Sensor(), QScriptEngine::ScriptOwnership);
}

SensorsPlugin::SensorsPlugin ( QObject * parent )
		:QScriptExtensionPlugin( parent )
{
	qmlRegisterType<SensorValue>("Telldus", 1, 0, "SensorValue");
}

SensorsPlugin::~SensorsPlugin() {
}

void SensorsPlugin::initialize ( const QString & key, QScriptEngine * engine ) {
	if (key == "com.telldus.sensors") {
		QScriptValue qml = engine->globalObject().property("com").property("telldus").property("sensors");
		qml.setProperty("sensor", engine->newFunction(SensorCTor));
	}
}

QStringList SensorsPlugin::keys () const {
	return QStringList() << "com.telldus.sensors";
}

Q_EXPORT_PLUGIN2(SensorsInterface, SensorsPlugin)
