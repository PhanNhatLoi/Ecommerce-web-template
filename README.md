## Merchant web

#### Description:

.....

## Project Status

(only necessary if incomplete)

#### Example:

This project is currently in development......

## Requirements

- [Node 18](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Installation and Setup Instructions

#### Environment variables:

```
    GENERATE_SOURCEMAP=false
    DOMAIN=http://45.77.174.206:8182
    PORT=5000

```

#### Build & Run:

Clone down this repository. You will need `node`, `npm` and `yarn` installed globally on your machine.

Installation:

`yarn`

To Run Test Suite:

`yarn test`

To Start Server:

`yarn start`

To Visit App:

`localhost:3000`

## Build and run application with docker

You will need login to registry.gitlab.com.com (`docker logout && docker login registry.gitlab.com.com`) first.

#### Build:

Clone down this repository. You will need `docker` and `docker-compose` and `yarn`.

Build:

Step2: Run `docker build -t registry.gitlab.com.com/malu-platform/merchant/merchant-web .`

Step3: Run `docker push registry.gitlab.com.com/malu-platform/merchant/merchant-web`

#### Deployment:

Use `docker` or `docker-compose` to deployment

##### Example:

    - `docker run -p 3000:3000 registry.gitlab.com.com/malu-platform/merchant/merchant-web`
    - `docker-compose -f app.yml up -d`
