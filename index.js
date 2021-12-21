const axios = require('axios').default;
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('js-yaml');

try {
    const extractedPorts = [];
    const workspaceEncordedFile = '';
    const domain = core.getInput('domain');
    const organizationId = core.getInput('org-id');
    const projectId = core.getInput('project-id');
    const appId = core.getInput('app-id');
    const envId = core.getInput('env-id');
    const api_version_id = core.getInput('version');
    const imageName = core.getInput('image-name');
    const gitHash = core.getInput('git-hash');
    const gitOpsHash = core.getInput('gitops-hash');
    const token = core.getInput('token');
    const debug = core.getInput('debug');
    const isHttpBased = core.getInput('is-http-based');
    const payload = github.context.payload;
    const portExtractFilePath = core.getInput('port-extract-file-path');

    try {
        let fileContents = fs.readFileSync(portExtractFilePath, 'utf8');
        let data = yaml.loadAll(fileContents);

        for (const file of data) {
            if (file.kind == 'Service') {
                for (const port of file.spec.ports) {
                    extractedPorts.push({
                        port: port.port,
                        name: port.name
                    });
                }
            }
        }
        console.log("BEFOR :: ", extractedPorts);
        if (extractedPorts.length === 0 && isHttpBased) {
            extractedPorts.push({
                port: 8090,
                name: "port-1-default"
            });
        }
        console.log("AFTER :: ", extractedPorts);
    } catch (e) {
        console.log(e);
    }

    console.log(`Sending Request to Choreo API....`);
    const body = {
        image: imageName,
        tag: gitHash,
        image_ports: extractedPorts,
        git_hash: gitHash,
        gitops_hash: gitOpsHash,
        organization_id: organizationId,
        project_id: projectId,
        app_id: appId,
        api_version_id: api_version_id,
        environment_id: envId,
        registry_token: token,
        workspace_yaml_path: portExtractFilePath
    }

    let WebhhookURL;
    if (body.registry_token && body.registry_token != "") {
        WebhhookURL = `${domain}/image/deploy`
    }
    /** not required any header for current implementation */
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Authorization': token,
    //     'x-project-id': projectId,
    //     'x-organization-id': organizationId
    // }

    if (debug) {
        console.log("request-body: ", JSON.stringify(body));
    }

    console.log("sending request to " + WebhhookURL)
    //     console.log(WebhhookURL.split('').join(":"));

    axios.post(WebhhookURL, body).then(function (response) {
        core.setOutput("choreo-status", "deployed");
        console.log("choreo-status", "deployed");
    }).catch(function (error) {
        //         if (error.response) {
        //             console.log(error.response.data);
        //             console.log(error.response.status);
        //             console.log(error.response.headers);
        //         }
        //         if (error.error.response) {
        //             console.log(error.error.response.data);
        //             console.log(error.error.response.status);
        //             console.log(error.error.response.headers);
        //         }
        core.setOutput("choreo-status", "failed");
        core.setFailed(error.message);
        console.log("choreo-status", "failed");
        console.log(error.message);
    });

} catch (error) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(error.message);
    console.log("choreo-status", "failed");
    console.log(error.message);
}



