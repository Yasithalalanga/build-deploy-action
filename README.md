# Choreo Build Deployer Action

This action deploys your newly built docker images to Kubernetes clusters through Choreo API

## Example

```
  build:
    steps:
    - name: choreo Deploy
      uses: choreo-templates/build-deploy-action@v1
      with:
        domain: ${{ env.RUDDER_WEBHOOK_URL }}
        org-id: ${{ env.CHOREO_ORG_ID }}
        project-id: ${{ env.CHOREO_PROJECT_ID }}
        token: ${{ env.RUDDER_WEBHOOK_SECRET }}
        image-name: ${{ env.CHOREO_GITOPS_REPO }}
        git-hash: ${{ env.NEW_SHA }}
        git-hash-date: ${{ github.event.inputs.shaDate }}
        gitops-hash: ${{ env.NEW_GITOPS_SHA }}
        app-id: ${{ env.APP_ID }}
        env-id: ${{ github.event.inputs.envId }}
        version: ${{ github.event.inputs.versionId }}
        branch: ${{ github.event.inputs.branch }}
        port-extract-file-path: target/kubernetes/${{ env.WORKSPACE }}/${{ env.WORKSPACE }}.yaml
        is-http-based: true 
        is-container-deployment: true | false
```