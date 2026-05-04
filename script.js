const editor = document.getElementById("codeEditor");
const language = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const output = document.getElementById("output");

const examples = {
  python: 'print("hello world")',
  javascript: 'console.log("hello world");',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("hello world");\n  }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "hello world" << endl;\n  return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n  printf("hello world\\n");\n  return 0;\n}',
  csharp: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("hello world");\n  }\n}',
  php: '<?php\necho "hello world";\n?>',
  ruby: 'puts "hello world"',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("hello world")\n}',
  rust: 'fn main() {\n  println!("hello world");\n}',
  kotlin: 'fun main() {\n  println("hello world")\n}',
  swift: 'print("hello world")'
};

const extensions = {
  python: "main.py",
  javascript: "script.js",
  java: "Main.java",
  cpp: "main.cpp",
  c: "main.c",
  csharp: "Program.cs",
  php: "index.php",
  ruby: "main.rb",
  go: "main.go",
  rust: "main.rs",
  kotlin: "Main.kt",
  swift: "main.swift"
};

language.addEventListener("change", () => {
  editor.value = examples[language.value] || "";
  localStorage.setItem("language", language.value);
});

editor.addEventListener("input", () => {
  localStorage.setItem("code", editor.value);
});

runBtn.addEventListener("click", async () => {
  output.textContent = "Running...";

  try {
    const response = await fetch("http://localhost:3000/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: language.value,
        code: editor.value
      })
    });

    const data = await response.json();

    output.textContent =
      data.output ||
      data.error ||
      "No output";
  } catch (error) {
    output.textContent =
      "Server is not running.\n\nOpen terminal and run:\nnode server.js";
  }
});

saveBtn.addEventListener("click", () => {
  const fileName = extensions[language.value] || "code.txt";
  const blob = new Blob([editor.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
});

window.addEventListener("load", () => {
  language.value = localStorage.getItem("language") || "python";
  editor.value = localStorage.getItem("code") || examples[language.value];
});