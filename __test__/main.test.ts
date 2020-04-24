import * as report_generator from "../src/action-repository-activity";

describe("Run workflow", () => {
  it("run workflow", async () => {
    report_generator.run();
  });
});
