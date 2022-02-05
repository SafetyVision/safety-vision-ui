# safety-vision-ui

The first time you pull the repo run:
```
make setup
```

To build the Docker image:
```
make build-image
```

To run the app inside the docker container first run `make setup`, then:
```
make up
```

## Running tests for development
Start an interactive test running terminal session:
```
make test
```

To run all tests without an interactive terminal session run:
```
make test-run
```
