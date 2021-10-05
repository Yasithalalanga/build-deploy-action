const axios = require('axios').default;
const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

exec("ls -la", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

try {
    const domain = core.getInput('domain');
    const organizationId = core.getInput('org-id');
    const projectId = core.getInput('project-id');
    const appId = core.getInput('app-id');
    const envId = core.getInput('env-id');
    const imageName = core.getInput('image-name');
    const gitHash = core.getInput('git-hash');
    const token = core.getInput('token');
    const payload = github.context.payload;

    console.log('payload:: ', payload);

    // if (debug) {
    //     console.log(`debug enabled...`);
    // }

    console.log(`Sending Request to Choreo API....`);
    const body = {
        image: imageName,
        tag: gitHash,
        image_ports: imageName,
        git_hash: gitHash,
        organization_id: organizationId,
        project_id: projectId,
        app_id: appId,
        environment_id: envId,
        registry_token: token
    }

    console.log('body:', body);

    let WebhhookURL;
    if (containerID && containerID != "") {
        body.container_id = containerID
        WebhhookURL = `${domain}/rudder/webhook/v1/container`
    }
    if (imageRegistryID && imageRegistryID != "") {
        body.image_registry_id = imageRegistryID
        WebhhookURL = `${domain}/rudder/webhook/v1/image-registry`
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'x-project-id': projectId,
        'x-organization-id': organizationId
    }

    if (debug) {
        console.log("request-body: ", JSON.stringify(body));
        console.log("request-headers: ", JSON.stringify(headers));
    }

    console.log("sending request to " + WebhhookURL)


    axios.post(WebhhookURL, body, {
        headers: headers
    }).then(function (response) {
        core.setOutput("choreo-status", "deployed");
    }).catch(function (error) {
        core.setOutput("choreo-status", "failed");
        core.setFailed(error.message);
    });

} catch (error) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(error.message);
}



