import { marked } from "marked";

export interface ParsedFile {
  title: string;
  content: string;
}

/**
 * Parses a .txt or .md file into a title and Tiptap-compatible HTML content.
 * - .md files are converted from Markdown to HTML using `marked`.
 * - .txt files have their lines wrapped in <p> tags.
 * - Title is derived from the filename (sans extension).
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext !== "txt" && ext !== "md") {
    throw new Error("Only .txt and .md files are supported.");
  }

  const text = await file.text();
  const title = file.name.replace(/\.(txt|md)$/i, "");

  let content: string;

  if (ext === "md") {
    // Convert Markdown to HTML
    const result = marked.parse(text);
    content = typeof result === "string" ? result : await result;
  } else {
    // Plain text: wrap each non-empty line in <p>, preserve empty lines as empty <p>
    content = text
      .split("\n")
      .map((line) => {
        const trimmed = line.trimEnd();
        return trimmed.length > 0 ? `<p>${trimmed}</p>` : `<p></p>`;
      })
      .join("");
  }

  return { title, content };
}
