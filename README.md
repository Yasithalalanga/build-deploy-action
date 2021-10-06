# Choreo Build Deployer Action

This action deploys your newly built docker images to Kubernetes clusters through Choreo API

## Inputs

### `domain`

choreo API Domain. Default.

### `org-id`

**Required** choreo Organization ID 


### `project-id`

**Required** choreo Project ID 


### `image-name`

**Required** Name of your Docker Image

### `tag`

**Required** Tag of your newly built image. (If you have multiple tags, just add one of them as all of them refer to the same image blob) Default `"latest"`

### `env-id`

Application Environment ID of choreo component.

### `git-hash`

Last commit hash.

### `Token`

**Required** choreo Service Account Token to be used for this action. Please use Secrets for this.

### `port-extract-file-path`

**Required** file path where deployment ports need to be extracted


## Example

```
  build:
    steps:
    - name: choreo Deploy
      uses: choreo-templates/build-deploy-action@v1
      with:
       domain: ${{secrets.DOMAIN}}
       org-id: ${{secrets.ORG_ID}}
       project-id: ${{secrets.PROJECT_ID}}
       token: ${{secrets.TOKEN}}
       image-name: ${{secrets.DOCKER_USER}}/${{ github.event.repository.name }} 
       git-hash: ${{github.sha}}
       env-id: ${{secrets.ENV_ID}}
       port-extract-file-path: 'path to file'
```