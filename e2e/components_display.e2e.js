import { expect } from "chai";
import testUtils from "./utils";

describe("application launch", function () {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("shows search bar after launch", function () {
    return this.app.client.getText("#search-path");
  });

  it("shows search file list launch", function () {
    return this.app.client.getText("#file-table");
  });

  it("shows side menu after launch", function () {
    return this.app.client.getText("#side-menu");
  });

  it("has an hidden tab bar after launch", function () {
    return !this.app.client.isVisible("#tab-bar");
  });
});
