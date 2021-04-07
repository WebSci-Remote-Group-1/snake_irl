MAKEFLAGS += -j2

NODEPM = npm
ifneq (, $(shell which yarn))
	NODEPM = yarn
endif

.PHONY: install clean startExpress startReact

all: startExpress startReact

install:
	cd src && $(NODEPM) install && cd frontend && $(NODEPM) install

clean:
	find . -type d -name "node_modules" -exec rm -rf {} \;

startExpress:
	cd src && npm start

startReact:
	cd src/frontend && npm start
