import * as core from "@actions/core";
import * as github from "@actions/github";

export async function run() {
  try {
    const token = core.getInput("token", { required: true });
    const owner_and_repository = core.getInput("repository", {
      required: true,
    });
    const owner_and_repository_list = owner_and_repository.split("/");
    const owner = owner_and_repository_list[0];
    const repository = owner_and_repository_list[1];
    console.log(owner_and_repository);
    const octokit = new github.GitHub(token);
    const { data: data } = await octokit.repos.get({
      owner: owner,
      repo: repository,
    });
    core.setOutput("allow_merge_commit", String(data.allow_merge_commit));
    core.setOutput("allow_rebase_merge", String(data.allow_rebase_merge));
    core.setOutput("allow_squash_merge", String(data.allow_squash_merge));
    core.setOutput("archived", String(data.archived));
    core.setOutput("disabled", String(data.disabled));
    core.setOutput("forks_count", String(data.forks_count));
    core.setOutput("has_downloads", String(data.has_downloads));
    core.setOutput("has_issues", String(data.has_issues));
    core.setOutput("has_pages", String(data.has_pages));
    core.setOutput("has_projects", String(data.has_projects));
    core.setOutput("has_wiki", String(data.has_wiki));
    core.setOutput("network_count", String(data.network_count));
    core.setOutput("open_issues_count", String(data.open_issues_count));
    core.setOutput("stargazers_count", String(data.stargazers_count));
    core.setOutput("subscribers_count", String(data.subscribers_count));
    core.setOutput("watchers_count", String(data.watchers_count));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
