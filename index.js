const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('GITHUB_TOKEN', {required: true});
  const octokit = github.getOctokit(token);
  
  const context = github.context;

  const pr = await octokit.rest.pulls.get({
     owner: context.owner,
     repo: context.repo,
    pull_number: context.issue.number
  });

  const body = pr.data?.body || '';
  if (!body) {
    core.setFailed("PR description is empty");
  }

  const lines = body.split('\n')
  var readingTestOptions = false
  var optionChecked = false
  for(var i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!readingTestOptions && line.startsWith("### How did you test it?")) {
      readingTestOptions = true
      continue;
    }

    if (readingTestOptions && line.startsWith("<!-- end -->")) {
      break;
    }

    if (line.startsWith("[x]")) {
      optionCheck = true;
      break;
    }
  }

  if (!optionChecked) {
    core.setFailed("No test option checked. Please check an option under the `How did you test this?` section.");  
  }
}