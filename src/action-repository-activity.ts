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
    const octokit = github.getOctokit(token);
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

    // getViews requires more permissions than the default GitHub action token
    // provides. Catch the failure and report a warning, to allow users to use
    // the default token if this metrics is not useful.
    try {
      const { data: views } = await octokit.repos.getViews({
        owner: owner,
        repo: repository,
      });
      core.setOutput("repo_view_views", String(views.count));
      core.setOutput("repo_view_uniques", String(views.uniques));
    } catch (error) {
      core.warning(error.message);
    }

    try {
      const { data: clones } = await octokit.repos.getClones({
        owner: owner,
        repo: repository,
      });
      core.setOutput("repo_clones_views", String(clones.count));
      core.setOutput("repo_clones_uniques", String(clones.uniques));

      const { data: views } = await octokit.repos.getViews({
        owner: owner,
        repo: repository,
      });
      core.setOutput("repo_view_views", String(views.count));
      core.setOutput("repo_view_uniques", String(views.uniques));

      const {
        data: codeFrequencyStats,
      } = await octokit.repos.getCodeFrequencyStats({
        owner: owner,
        repo: repository,
      });
      core.setOutput(
        "code_frequency_stats_lines_added",
        String(codeFrequencyStats[codeFrequencyStats.length - 1][1])
      );
      core.setOutput(
        "code_frequency_stats_lines_deleted",
        String(codeFrequencyStats[codeFrequencyStats.length - 1][2])
      );

      const {
        data: participationStats,
      } = await octokit.repos.getParticipationStats({
        owner: owner,
        repo: repository,
      });
      const allLength = participationStats["all"].length;
      const ownerLength = participationStats["owner"].length;
      core.setOutput(
        "participation_all",
        String(participationStats["all"][allLength - 1])
      );
      core.setOutput(
        "participation_owner",
        String(participationStats["owner"][ownerLength - 1])
      );
    } catch (error) {
      core.warning(error.message);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
