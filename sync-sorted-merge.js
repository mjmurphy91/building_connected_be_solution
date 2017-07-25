'use strict'

const Heap = require('heap');

module.exports = (logSources, printer) => {
	// Using a heap to automatically and efficiently sort entries
	var heap = new Heap(function(a, b) {
		return a.date - b.date;
	});
	var logEntry = null;
	var newLogEntry = null;

	// Fill heap with initial values of each source
	for (let index in logSources) {
		logEntry = logSources[index].pop();
		if (logEntry) {
			heap.push({date:logEntry.date, entry:logEntry, index:index});
		}
	}

	// Let heap do it's job, printing each popped entry and pushing new entry onto heap if valid
	while (!heap.empty()) {
		logEntry = heap.pop();
		printer.print(logEntry.entry);
		newLogEntry = logSources[logEntry.index].pop();
		if (newLogEntry) {
			heap.push({date:newLogEntry.date, entry:newLogEntry, index:logEntry.index});
		}
	}
	printer.done();
}