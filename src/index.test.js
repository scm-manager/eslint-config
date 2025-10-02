/*
 * Copyright (c) 2020 - present Cloudogu GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
 */

import { describe, it, expect } from "vitest";

import { ESLint } from "eslint";
import path from "path";
import config from "./index";

const eslint = new ESLint({
  baseConfig: config
});
const resource = path.join(__dirname, "__resources__");

const lint = async file => {
  const results = await eslint.lintFiles([path.join(resource, file)]);

  const { messages } = results[0];

  const warnings = messages.filter(m => m.severity === 1).map(m => m.ruleId);
  const errors = messages.filter(m => m.severity === 2).map(m => m.ruleId);
  return {
    errors,
    warnings
  };
};

const expectContains = (results, ...ids) => {
  ids.forEach(id => expect(results).toContain(id));
};

describe("should lint different file types", () => {
  it("should lint tsx files", async () => {
    const { errors, warnings } = await lint("TypescriptWithJsx.tsx");
    expectContains(errors, "no-console", "quotes", "semi");
    expectContains(warnings, "prettier/prettier");
  });

  it("should lint js files", async () => {
    const { errors, warnings } = await lint("Node.js");
    expectContains(errors, "no-var", "quotes", "semi");
    expectContains(warnings, "prettier/prettier");
  });

  it("should lint ts files", async () => {
    const { errors, warnings } = await lint("Typescript.ts");
    expectContains(errors, "no-console", "quotes");
    expectContains(warnings, "prettier/prettier");
  });
});

describe("lint @scm-manager imports", () => {
  it("should return an error for source imports", async () => {
    const { errors } = await lint("AvoidSourceImport.tsx");
    expectContains(errors, "no-restricted-imports");
  });

  it("should return no error for package imports", async () => {
    const { errors, warnings } = await lint("AllowRootImport.tsx");
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for image without alt", async () => {
    const { errors, warnings } = await lint("WithoutAlt.tsx");
    expect(errors).toEqual(["jsx-a11y/alt-text"]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for invalid image alt", async () => {
    const { errors, warnings } = await lint("WrongImageAlt.tsx");
    expect(errors).toEqual(["jsx-a11y/img-redundant-alt"]);
    expect(warnings).toEqual([]);
  });

  it("should return no errors for elements with alt", async () => {
    const { errors, warnings } = await lint("WithAlt.tsx");
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for header without content", async () => {
    const { errors, warnings } = await lint("HeaderWithoutContent.tsx");
    expect(errors).toEqual(["jsx-a11y/heading-has-content"]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for wrong autocomplete", async () => {
    const { errors, warnings } = await lint("AutoComplete.tsx");
    expect(errors).toEqual(["jsx-a11y/autocomplete-valid"]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for html without lang", async () => {
    const { errors, warnings } = await lint("HtmlWithoutLang.tsx");
    expect(errors).toEqual(["jsx-a11y/html-has-lang"]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for invalid aria role", async () => {
    const { errors, warnings } = await lint("InvalidAriaRole.tsx");
    expect(errors).toEqual(["jsx-a11y/aria-role"]);
    expect(warnings).toEqual([]);
  });

  it("should return errors for empty aria role", async () => {
    const { errors, warnings } = await lint("EmptyAriaRole.tsx");
    expect(errors).toEqual(["jsx-a11y/aria-role"]);
    expect(warnings).toEqual([]);
  });
});

describe("lint react hooks", () => {
  it("should return error for exhaustive deps", async () => {
    const { errors, warnings } = await lint("ExhaustiveDeps.tsx");
    expect(errors).toEqual(["react-hooks/exhaustive-deps"]);
    expect(warnings).toEqual([]);
  });
});

describe("lint typescript comments", () => {
  it("should return warning if comment is missing on ts-ignore", async () => {
    const { errors, warnings } = await lint("TsIgnoreWithoutComment.ts");
    expect(errors).toEqual([]);
    expect(warnings).toEqual(["@typescript-eslint/ban-ts-comment"]);
  });

  it("should return nothing if ts-ignore has a comment", async () => {
    const { errors, warnings } = await lint("TsIgnoreWithComment.ts");
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });
});
