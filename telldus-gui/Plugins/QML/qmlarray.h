#ifndef QMLARRAY_H
#define QMLARRAY_H

#include <QAbstractListModel>
#include <QScriptValue>

class QMLArray : public QAbstractListModel
{
	Q_OBJECT
	Q_PROPERTY(int length READ rowCount)
public:
	explicit QMLArray(QObject *parent = 0);
	~QMLArray();

	virtual int rowCount(const QModelIndex &parent = QModelIndex()) const;
	virtual QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const;

signals:

public slots:
	void push(const QScriptValue &v);
	void remove(int index);
	void removeLater(int index);
	QVariant get(int index) const;


private:
	class PrivateData;
	PrivateData *d;

};

#endif // QMLARRAY_H
