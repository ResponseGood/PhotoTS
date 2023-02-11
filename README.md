<p align="midlle">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
</p>

### PhotoTS



## Api endpoints

```
Auth
/register - user registration,method POST
/login - login & password authorization,method POST

Photos
/load-photos - uploading photos,method POST
/change-album-title - change album name by id,method PUT
/delete-photo - deleting photos by id,method DELETE
/delete-album - deleting album by id,method DELETE
/get-photos - getting all photos with pagination,method GET
```

## Deploying the application using docker

```Dockerfile
docker build -t photots .
docker run photots
```
