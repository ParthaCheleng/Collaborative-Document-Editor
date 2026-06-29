import { describe, it, expect } from "vitest";
import { parseFile } from "../fileParser";

/**
 * Helper to create a mock File object for testing.
 */
function createMockFile(
  content: string,
  filename: string,
  mimeType = "text/plain"
): File {
  return new File([content], filename, { type: mimeType });
}

describe("parseFile", () => {
  it("parses a .txt file by wrapping lines in <p> tags", async () => {
    const file = createMockFile(
      "Hello World\nThis is line two\n\nLine after empty",
      "notes.txt"
    );
    const result = await parseFile(file);

    expect(result.title).toBe("notes");
    expect(result.content).toContain("<p>Hello World</p>");
    expect(result.content).toContain("<p>This is line two</p>");
    expect(result.content).toContain("<p></p>"); // empty line
    expect(result.content).toContain("<p>Line after empty</p>");
  });

  it("parses a .md file and converts Markdown to HTML", async () => {
    const markdown = "# Heading\n\nSome **bold** text and *italic* text.\n\n- Item 1\n- Item 2";
    const file = createMockFile(markdown, "readme.md");
    const result = await parseFile(file);

    expect(result.title).toBe("readme");
    // marked wraps heading in <h1> tags
    expect(result.content).toContain("<h1");
    expect(result.content).toContain("Heading");
    // bold text
    expect(result.content).toContain("<strong>bold</strong>");
    // italic text
    expect(result.content).toContain("<em>italic</em>");
    // list items
    expect(result.content).toContain("<li>");
    expect(result.content).toContain("Item 1");
  });

  it("extracts the title from the filename without extension", async () => {
    const file = createMockFile("content", "My Document.txt");
    const result = await parseFile(file);
    expect(result.title).toBe("My Document");
  });

  it("rejects unsupported file extensions", async () => {
    const file = createMockFile("<html></html>", "index.html");
    await expect(parseFile(file)).rejects.toThrow(
      "Only .txt and .md files are supported."
    );
  });

  it("handles an empty .txt file gracefully", async () => {
    const file = createMockFile("", "empty.txt");
    const result = await parseFile(file);
    expect(result.title).toBe("empty");
    // Should have at least one paragraph (empty content)
    expect(result.content).toContain("<p>");
  });

  it("handles a .md file with nested formatting", async () => {
    const markdown = "## Sub Heading\n\n1. First\n2. Second\n3. Third";
    const file = createMockFile(markdown, "list.md");
    const result = await parseFile(file);

    expect(result.title).toBe("list");
    expect(result.content).toContain("<h2");
    expect(result.content).toContain("<ol>");
    expect(result.content).toContain("First");
  });
});
