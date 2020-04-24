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
    let requestedData = [
      "allow_merge_commit",
      "allow_rebase_merge",
      "allow_squash_merge",
      "archived",
      "disabled",
      "forks_count",
      "has_downloads",
      "has_issues",
      "has_pages",
      "has_projects",
      "has_wiki",
      "network_count",
      "open_issues_count",
      "stargazers_count",
      "subscribers_count",
      "watchers_count",
    ];
    requestedData.forEach((element) => {
      core.setOutput(element, String(data[element]));
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
