'use strict'

const Heap = require('heap');

// Global variables to simplify recursion
var logEntriesHeaped = [];
var fullHeap = false;
var heap = new Heap(function(a, b) {
	return a.date - b.date;
});

module.exports = (logSources, printer) => {
	// Initialize tracking of heaped indexes so we do not begin popping too soon
	for (let index in logSources) {
		logEntriesHeaped[index] = false;
	}

	// Fill heap with initial values of each source and begin recursion
	for (let index in logSources) {
		resolvePromise(logSources, index, printer);
	}
}

/**
 * Async Promises required a recursive solution as I needed to wait for each Promise to resolve 
 * before using heap to get the first entry and then wait for its replacement to be determined 
 * before either pushing it on, if valid, or popping the next entry until heap is empty.
 */
function resolvePromise(logSources, index, printer) {
	let logEntryPromise = logSources[index].popAsync();
	var getEntry = function () {
		logEntryPromise
			.then(function (logEntry) {
				logEntriesHeaped[index] = true;
				if (logEntry) {
					heap.push({date:logEntry.date, entry:logEntry, index:index});
					if (heapIsFull(logEntriesHeaped)) {
						logEntry = heap.pop();
						printer.print(logEntry.entry);
						resolvePromise(logSources, logEntry.index, printer);
					}
				} else {
					if (heap.empty()) {
						printer.done();
					} else {
						logEntry = heap.pop();
						printer.print(logEntry.entry);
						resolvePromise(logSources, logEntry.index, printer);
					}
				}
			})
			.catch(function (error) {
				console.log(error.message);
			});
	}
	getEntry();
}

/**
 * Simple check to make sure all sources had been entered in the heap before popping began.
 * fullHeap used as a shortcut as once heap is full, it will always remain so until sources
 * run out of entries.
 */
function heapIsFull(logEntriesHeaped) {
	if (fullHeap) {
		return true;
	}
	for (let index in logEntriesHeaped) {
		if (!logEntriesHeaped[index]) {
			return false;
		}
	}
	fullHeap = true;
	return true;
}